#!/usr/bin/env python3
"""
build_cut_sheet_doc.py — formatter for the Reel Cut Sheet.

The model does the editorial work and writes ONE JSON file. This script renders it as a
single landscape .docx: a Contents table of contents, then one section per reel with an
overarching header block above the inline script. It ONLY formats. It does not check
verbatim accuracy, validate a schema, strike filler, or compute anything beyond a net
length estimate. Editorial correctness is the model's job and the curator's; this lays it out.

JSON shape:
{
  "show": "The Factory",
  "episode": "1",
  "reels": [
    {
      "reel_id": "R1",
      "priority": "A+",                     # or "A", or "A+ - Approval Needed" etc.
      "concept_category": "Proof",          # one of Proof/Pain/Promise/Plan/Picture
      "final_reel_concept": "...",
      "primary_speaker": "Brett Ward",
      "secondary_speakers": "Danny, Valli", # or "" for solo
      "primary_start": "3:44", "primary_end": "8:42",
      "hook_line": "...", "thumbnail_text": "...", "caption": "...",
      "notes": "Audience: ...",             # optional; red only if it starts "Approval" or "Rights"
      "lines": [
        # spoken line, filler wrapped in ~~tildes~~, optional end-of-line direction:
        {"start":"3:44","end":"3:48","speaker":"Brett","text":"I was ~~you know~~ that kid.","dir":"open cold, punch in"},
        # a whole-passage cut: set "trim": true (consecutive trims merge into one block)
        {"start":"5:03","end":"5:07","speaker":"Brett","text":"which I am.","trim": true,"trim_reason":"tangent"}
      ]
    }
  ]
}

Usage:  python build_cut_sheet_doc.py reels.json "<Show>-E<n>-Reel-Cut-Sheet.docx"
Filler is shown as grey strikethrough, whole cuts as red TRIM blocks in position, direction
as a green end-of-line tag. Every line and trim carries a start-end timecode.
"""
import json, sys, re
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.section import WD_ORIENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

ARIAL = "Arial"
GREY = RGBColor(0x99,0x99,0x99); RED = RGBColor(0xB0,0x00,0x00); BLU = RGBColor(0x1F,0x3B,0x73)
GRN  = RGBColor(0x1E,0x6B,0x2E); AMB = RGBColor(0xB3,0x6B,0x00); WHT = RGBColor(0xFF,0xFF,0xFF); BLK = RGBColor(0x22,0x22,0x22)

def secs(t):
    try: p=[int(x) for x in re.split(r"[:.]", str(t))]
    except Exception: return None
    return p[0]*60+p[1] if len(p)==2 else (p[0]*3600+p[1]*60+p[2] if len(p)==3 else None)
def mmss(x):
    if x is None: return "?"
    x=int(round(x)); return f"{x//60}:{x%60:02d}"
def is_trim(l): return bool(l.get("trim")) or str(l.get("use_as","")).lower()=="cut"
def is_soft(l): return bool(l.get("soft")) and not is_trim(l)

def est_net(reel):
    tot=0.0
    for l in reel.get("lines",[]):
        if is_trim(l) or is_soft(l): continue
        raw=l.get("text",""); kept=len(re.findall(r"[A-Za-z0-9']+", re.sub(r"~~.*?~~","",raw)))
        allw=len(re.findall(r"[A-Za-z0-9']+", raw.replace("~~","")))
        s,e=secs(l.get("start")),secs(l.get("end"))
        if s is not None and e is not None: tot+=(e-s)*((kept/allw) if allw else 1)
    return mmss(tot)

def R(p,text,bold=False,italic=False,color=None,size=10,strike=False):
    run=p.add_run(text); run.font.name=ARIAL; run.bold=bold; run.italic=italic
    run.font.size=Pt(size)
    if color: run.font.color.rgb=color
    if strike: run.font.strike=True
    return run

def bookmark(p,name):
    st=OxmlElement("w:bookmarkStart"); st.set(qn("w:id"),name); st.set(qn("w:name"),name)
    en=OxmlElement("w:bookmarkEnd"); en.set(qn("w:id"),name)
    p._p.insert(0,st); p._p.append(en)

def ilink(p,anchor,text,bold=True):
    h=OxmlElement("w:hyperlink"); h.set(qn("w:anchor"),anchor)
    run=OxmlElement("w:r"); rpr=OxmlElement("w:rPr")
    rf=OxmlElement("w:rFonts"); rf.set(qn("w:ascii"),ARIAL); rf.set(qn("w:hAnsi"),ARIAL); rpr.append(rf)
    col=OxmlElement("w:color"); col.set(qn("w:val"),"1F3B73"); rpr.append(col)
    u=OxmlElement("w:u"); u.set(qn("w:val"),"single"); rpr.append(u)
    if bold: rpr.append(OxmlElement("w:b"))
    run.append(rpr); t=OxmlElement("w:t"); t.text=text; run.append(t); h.append(run); p._p.append(h)

def score_str(reel):
    sc=reel.get("scores") or {}
    if not sc: return ""
    t=sc.get("total", sum(int(sc.get(k,0)) for k in ("hook","five_p","interaction","takeaway")))
    return f"{t}/20  (H{sc.get('hook','?')} P{sc.get('five_p','?')} I{sc.get('interaction','?')} T{sc.get('takeaway','?')})"

def approval(reel): return "approval" in str(reel.get("priority","")).lower()

def merge_rows(lines):
    """Sort chronologically; merge consecutive trims (<=2s apart) into one block."""
    lines=sorted(lines, key=lambda l: (secs(l.get("start")) if secs(l.get("start")) is not None else 10**9))
    rows=[]; buf=None
    for l in lines:
        if is_trim(l):
            s,e,sp=l.get("start"),l.get("end"),l.get("speaker","")
            if buf and secs(s) is not None and secs(buf["end"]) is not None and abs(secs(s)-secs(buf["end"]))<=2:
                buf["end"]=e; buf["text"]+=" "+l.get("text",""); buf["spk"]|={sp}
                buf["reason"]=buf["reason"] or l.get("trim_reason")
            else:
                if buf: rows.append(buf)
                buf={"kind":"trim","start":s,"end":e,"text":l.get("text",""),"reason":l.get("trim_reason"),"spk":{sp}}
        else:
            if buf: rows.append(buf); buf=None
            rows.append({"kind":"soft" if is_soft(l) else "keep","start":l.get("start"),"end":l.get("end"),
                         "text":l.get("text",""),"spk":l.get("speaker",""),"dir":l.get("dir"),
                         "reason":l.get("soft_reason")})
    if buf: rows.append(buf)
    return rows

def build(data, out_path):
    doc=Document()
    doc.styles["Normal"].font.name=ARIAL; doc.styles["Normal"].font.size=Pt(10)
    sec=doc.sections[0]; sec.orientation=WD_ORIENT.LANDSCAPE
    sec.page_width, sec.page_height = Inches(11), Inches(8.5)
    sec.left_margin=sec.right_margin=Inches(0.6)

    show=data.get("show","Show"); ep=data.get("episode","")
    reels=data.get("reels",[])
    reels=sorted(reels, key=lambda r:(secs(r.get("primary_start")) if secs(r.get("primary_start")) is not None else 10**9))

    title=doc.add_heading(f"{show} — Episode {ep} — Reel Cut Sheet", level=0)
    for r in title.runs: r.font.name=ARIAL

    # Contents (informative only)
    doc.add_heading("Contents", level=1)
    toc=doc.add_table(rows=1, cols=7); toc.style="Light Grid Accent 1"
    for i,h in enumerate(["Reel","Priority","Score","Concept Category","Primary Speaker","Secondary Speakers","Est Length"]):
        rr=toc.rows[0].cells[i].paragraphs[0].add_run(h); rr.bold=True; rr.font.size=Pt(9); rr.font.color.rgb=WHT; rr.font.name=ARIAL
    for reel in reels:
        c=toc.add_row().cells
        ilink(c[0].paragraphs[0], reel.get("reel_id","R?"), reel.get("reel_id","R?"))
        vals=[reel.get("priority",""),score_str(reel),reel.get("concept_category",""),reel.get("primary_speaker",""),
              reel.get("secondary_speakers") or "—", est_net(reel)]
        for i,v in enumerate(vals,1):
            rr=c[i].paragraphs[0].add_run(str(v)); rr.font.size=Pt(9); rr.font.name=ARIAL
            if approval(reel) and i==1: rr.font.color.rgb=RED; rr.bold=True
    doc.add_page_break()

    for reel in reels:
        h=doc.add_heading(reel.get("reel_id","R?"), level=1); bookmark(h, reel.get("reel_id","R?"))
        for r in h.runs: r.font.name=ARIAL
        # identity line
        idp=doc.add_paragraph()
        sec_sp=f" (with {reel['secondary_speakers']})" if reel.get("secondary_speakers") else ""
        R(idp, reel.get("priority",""), bold=True, color=(RED if approval(reel) else BLU))
        ps=f"   ·   Ps: {reel['ps_present']}" if reel.get("ps_present") else ""
        scr=f"   ·   {score_str(reel)}" if reel.get("scores") else ""
        R(idp, f"{scr}   ·   {reel.get('concept_category','')}{ps}   ·   {reel.get('primary_speaker','')}{sec_sp}"
               f"   ·   Est {est_net(reel)}   ·   {reel.get('primary_start','?')}–{reel.get('primary_end','?')}")
        # editorial block
        for lab,key in [("Concept","final_reel_concept"),("Takeaway","takeaway"),("Hook","hook_line"),
                        ("Thumbnail","thumbnail_text"),("Caption","caption")]:
            if reel.get(key):
                p=doc.add_paragraph(); R(p,f"{lab}:  ",bold=True); R(p,reel[key])
        if reel.get("notes"):
            n=str(reel["notes"]); loud=n.lower().startswith(("approval","rights"))
            p=doc.add_paragraph(); R(p,"Notes:  ",bold=True,color=(RED if loud else BLK),size=9)
            R(p,n,italic=True,size=9,color=(RED if loud else BLK))

        doc.add_heading("Script", level=2)
        for hh in doc.paragraphs[-1].runs: hh.font.name=ARIAL
        rows=merge_rows(reel.get("lines",[]))
        # group consecutive struck rows (soft cuts and trims); runs of 3+ collapse to one line
        groups=[]; i=0
        while i<len(rows):
            if rows[i]["kind"] in ("soft","trim"):
                j=i
                while j<len(rows) and rows[j]["kind"] in ("soft","trim"): j+=1
                run=rows[i:j]
                if len(run)>=3: groups.append(("collapsed",run))
                else: groups.extend(("row",r) for r in run)
                i=j
            else:
                groups.append(("row",rows[i])); i+=1
        for kind,row in groups:
            p=doc.add_paragraph()
            if kind=="collapsed":
                n=len(row); nsoft=sum(1 for r in row if r["kind"]=="soft")
                reasons=[]
                for r in row:
                    rr=r.get("reason")
                    if rr and rr not in reasons: reasons.append(rr)
                R(p,f"[{mmss(secs(row[0]['start']))}–{mmss(secs(row[-1]['end']))}]  ",bold=True,size=9)
                R(p,f"{n} lines struck",bold=True,color=(AMB if nsoft else RED),size=9)
                R(p,f" ({nsoft} editor's call, {n-nsoft} trim)" if nsoft and n-nsoft else (" (editor's call)" if nsoft else " (trim)"),size=9,color=GREY)
                if reasons: R(p,"   — "+"; ".join(reasons[:3])+(" …" if len(reasons)>3 else ""),italic=True,size=9,color=GREY)
                R(p,"   see full transcript below",italic=True,size=8,color=GREY)
                continue
            R(p,f"[{mmss(secs(row['start']))}–{mmss(secs(row['end']))}]  ",bold=True,size=9)
            if row["kind"]=="trim":
                who=", ".join(sorted(x for x in row["spk"] if x))
                R(p,f"TRIM ({who})  " if who else "TRIM  ",bold=True,color=RED,size=9)
                tw=row["text"].split()
                if len(tw)>40:
                    R(p," ".join(tw[:8]),color=GREY,strike=True); R(p,f"  [{len(tw)} words trimmed]  ",bold=True,size=9,color=RED)
                    R(p," ".join(tw[-8:]),color=GREY,strike=True)
                else:
                    R(p,row["text"],color=GREY,strike=True)
                if row["reason"]: R(p,f"   — {row['reason']}",italic=True,size=9,color=RED)
            elif row["kind"]=="soft":
                R(p,f"{row['spk']}:  ",bold=True,color=GREY)
                R(p,row["text"].replace("~~",""),color=GREY,strike=True)
                R(p,f"   ✎ EDITOR'S CALL{': '+row['reason'] if row.get('reason') else ''}",italic=True,size=9,color=AMB)
                if row.get("dir"): R(p,f"   → {row['dir'].upper()}",bold=True,color=GRN,size=9)
            else:
                R(p,f"{row['spk']}:  ",bold=True,color=BLU)
                for seg in re.split(r"(~~.*?~~)", row["text"]):
                    if seg.startswith("~~") and seg.endswith("~~"): R(p,seg[2:-2],color=GREY,strike=True)
                    elif seg: R(p,seg,color=BLK)
                if row.get("dir"): R(p,f"   → {row['dir'].upper()}",bold=True,color=GRN,size=9)
        # full word-for-word span, kept lines in bold, so an editor can pull anything back
        span=sorted(reel.get("lines",[]), key=lambda l:(secs(l.get("start")) if secs(l.get("start")) is not None else 10**9))
        if span:
            h3=doc.add_heading(f"Full transcript, {mmss(secs(span[0].get('start')))}–{mmss(secs(span[-1].get('end')))} (kept lines in bold)", level=3)
            for hh in h3.runs: hh.font.name=ARIAL
            fp=doc.add_paragraph()
            for l in span:
                kept=not (is_trim(l) or is_soft(l))
                R(fp,f"[{mmss(secs(l.get('start')))}] ",size=8,color=GREY)
                R(fp,f"{l.get('speaker','')}: ",size=8,bold=True,color=(BLK if kept else GREY))
                R(fp,l.get("text","").replace("~~","")+"  ",size=8,bold=kept,color=(BLK if kept else GREY))
        doc.add_page_break()

    cands=data.get("candidates") or []
    if cands:
        h=doc.add_heading("Candidates not built", level=1)
        for r in h.runs: r.font.name=ARIAL
        p=doc.add_paragraph(); R(p,"B-tier moments (11–13/20). Listed so the curator can promote one; not cut, not verified line by line.",italic=True,size=9)
        ct=doc.add_table(rows=1, cols=5); ct.style="Light Grid Accent 1"
        for i,hd in enumerate(["ID","Timecode","Concept","Score","Why not built"]):
            rr=ct.rows[0].cells[i].paragraphs[0].add_run(hd); rr.bold=True; rr.font.size=Pt(9); rr.font.color.rgb=WHT; rr.font.name=ARIAL
        for c in sorted(cands, key=lambda c:(secs(c.get("start")) if secs(c.get("start")) is not None else 10**9)):
            cells=ct.add_row().cells
            for i,v in enumerate([c.get("id",""), f"{c.get('start','?')}–{c.get('end','?')}", c.get("concept",""), score_str(c), c.get("why_not","")]):
                rr=cells[i].paragraphs[0].add_run(str(v)); rr.font.size=Pt(9); rr.font.name=ARIAL

    doc.save(out_path)
    return len(reels)

if __name__=="__main__":
    src=sys.argv[1]
    out=sys.argv[2] if len(sys.argv)>2 else "/mnt/user-data/outputs/Reel-Cut-Sheet.docx"
    data=json.load(open(src, encoding="utf-8"))
    n=build(data,out)
    print(f"OK: rendered {n} reel(s) -> {out}")
