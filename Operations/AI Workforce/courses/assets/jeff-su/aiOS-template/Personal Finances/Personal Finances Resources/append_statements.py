#!/usr/bin/env python3
"""
append_statements.py - parse monthly card statements into ledger rows  (STUDENT TEMPLATE)
========================================================================================
Companion to build_tracker.py. Parses card-statement text into clean transaction
rows, reconciles each statement to its printed Purchases total, dedups against the
current ledger, classifies category/subcategory, and writes new_rows.json for
review. Appending the reviewed rows to the Transactions tab and rebuilding the
dashboards (build_tracker.py + a spreadsheet recalc) is the final step.

ADAPT THIS TEMPLATE TO YOUR OWN STATEMENTS
  Every bank prints statements differently, so this parser will NOT match your
  bank out of the box. Two things to edit:
    1. CONFIG          - the statement folder, the FILES map (one entry per
                         statement file), your home/foreign currency rate, etc.
    2. classify()      - the keyword -> (Category, Subcategory) rules. A SHORT
                         example list ships below; replace it with merchants YOU
                         actually see on your statements.
  The parse() regexes assume two illustrative statement layouts ("TypeA" /
  "TypeB"). Treat them as a worked example and rewrite them to fit your bank's
  text once you have run `pdftotext -layout` on a real statement.

MONTHLY WORKFLOW
  1. Drop statement PDFs in the inbox, convert to text (layout-preserving):
       for f in *.pdf; do pdftotext -layout "$f" "$f.txt"; done
  2. Edit CONFIG below: STMT_DIR, FILES (txt filename -> card, statement month), LEDGER_XLSX.
  3. Run:  python3 append_statements.py
       -> prints per-statement reconciliation + low-confidence flags, writes new_rows.json
  4. Review flagged rows. Append the new rows to the Transactions tab columns A:M
     only (keep it sorted ascending by Date), then rebuild and recalculate:
       python3 build_tracker.py "<ledger.xlsx>" "<out.xlsx>"
     Confirm the Cards grand total moved by exactly the imported sum, and that
     Numbers plus Quick Look/preview both show computed values, then swap the file in.
     If build_tracker.py reports that no calculation engine is available, treat its
     output as a draft: open and save it in Numbers, Excel, or LibreOffice before delivery.

DEPENDENCY
  Requires Python 3 and openpyxl. If openpyxl is missing, install it in the
  current environment or a virtual environment; do not override system package
  protections.

LEDGER RULES
  - Identify each card by a consistent label you choose (e.g. "Primary Card",
    "Foreign Card") set in the FILES map and reused as the ledger Card value.
    Last-four digits are optional; add them to the label only if you want to
    disambiguate similar cards. They are never required.
  - Convert foreign-currency cards to your home currency at the rate in CONFIG;
    home-currency cards post directly.
  - Exclude card payments and bank fees; keep merchant refunds as negatives.
  - Reconcile parsed purchases to the printed "Purchases" total to the cent.
  - Dedup by (card, transaction date, home-currency equivalent) against the ledger.
  - Preserve the ledger schema: Transactions is columns A:M only. Do not add helper columns.
"""
import re, json, datetime, os
import openpyxl
from collections import defaultdict
D = datetime.date

# ===================== CONFIG (edit per import) =====================
STMT_DIR    = "statements/"                       # folder of pdftotext -layout .txt files
LEDGER_XLSX = "Master Spending Tracker.xlsx"      # current ledger to dedup against
OUT_JSON    = "new_rows.json"
FX_RATE     = 1.10                                # foreign -> home rate (example: EUR->Home)
FILES = {
    # "<txt filename>": ("<Card label>", "<Statement month label>"),
    # Use the same Card label your ledger uses (last-four optional, not required).
    # "primary-statement.pdf.txt":  ("Primary Card","Jan"),
    # "foreign-statement.pdf.txt":  ("Foreign Card","Jan"),
}
# ====================================================================

MON={'JAN':1,'FEB':2,'MAR':3,'APR':4,'MAY':5,'JUN':6,'JUL':7,'AUG':8,'SEP':9,'OCT':10,'NOV':11,'DEC':12}
def num(s): return float(s.replace(",",""))

# ---- ADAPT: classify a merchant string into (Category, Subcategory). ----
# These are EXAMPLE mappings only. Replace the keywords with merchants you see
# on your own statements. Matching is substring, case-insensitive.
def classify(m, refund=False):
    u=m.upper()
    def has(*ks): return any(k in u for k in ks)
    # subscriptions / software
    if has("NETFLIX","SPOTIFY","EXAMPLE STREAM","EXAMPLE MUSIC","EXAMPLE CLOUD","EXAMPLE PRODUCTIVITY"):
        return ("Subscriptions & Software","SaaS")
    # transport
    if has("UBER","LYFT","METRO","TAXI"):
        return ("Transportation","Taxi")
    # food & drink
    if has("STARBUCKS","CAFE","RESTAURANT","COFFEE","GROCERY","SUPERMARKET"):
        return ("Food & Dining","Restaurants")
    # travel
    if has("HOTEL","AIRLINE","AIRWAYS","BOOKING","AIRBNB"):
        return ("Travel","Hotels")
    # shopping
    if has("STORE","SHOP","MARKET","RETAIL"):
        return ("Shopping","Retail")
    return ("Miscellaneous","Review")

# ---- ADAPT: merchant strings that should always be hand-checked. ----
LOWCONF={"EXAMPLE AMBIGUOUS","UNKNOWN VENDOR"}

def parse():
    """
    EXAMPLE parser for two illustrative statement layouts. Rewrite the regexes to
    match your bank's `pdftotext -layout` output.
      TypeA (home currency): lines like  MM/DD  MERCHANT  AMOUNT
      TypeB (foreign):       lines like  DDMON DDMON MERCHANT [CUR ORIG] AMOUNT[CR]
    The FILES map decides which layout a file uses via the card label suffix:
    labels containing "Foreign" use TypeB, everything else uses TypeA.
    """
    rows=[]; recon={}
    for fn,(card,mon) in FILES.items():
        txt=open(os.path.join(STMT_DIR,fn),encoding="utf-8",errors="ignore").read()
        foreign = "FOREIGN" in card.upper()
        if foreign:
            mt=re.search(r"PURCHASES\s*:\s*([\d,]+\.\d{2})",txt)
        else:
            mt=re.search(r"Purchases\s+\+?\$?([\d,]+\.\d{2})",txt)
        stmt_total=num(mt.group(1)) if mt else None
        gross=0.0; nP=nF=nPay=nRef=0; lines=[]
        for ln in txt.splitlines():
            if not foreign:
                # TypeA: MM/DD  MERCHANT  AMOUNT  (home currency)
                m=re.match(r"^\s*(\d{2})/(\d{2})\s+(.+?)\s+(-?[\d,]*\.\d{2})\s*$",ln)
                if not m: continue
                desc=m.group(3).strip()
                if re.search(r"Previous Balance|New Balance|Minimum Payment|Payment Due|Account|Totals|Interest|Fees|Available|Credit",desc,re.I): continue
                amt=num(m.group(4)); mm=int(m.group(1)); dd=int(m.group(2))
                dt=D(datetime.date.today().year,mm,dd)
                if amt<0 or re.search(r"PAYMENT|THANK YOU|AUTOPAY",desc,re.I): nPay+=1; continue
                if "FOREIGN TRANSACTION FEE" in desc.upper(): nF+=1; gross+=amt; continue
                gross+=amt; nP+=1
                lines.append(dict(card=card,date=dt.isoformat(),merchant=desc,orig=amt,cur="Home",home=round(amt,2),refund=False))
            else:
                # TypeB: DDMON DDMON MERCHANT [CUR ORIG] AMOUNT[CR]  (foreign card)
                m=re.match(r"^\s*(\d{2})([A-Z]{3})\s+(\d{2})([A-Z]{3})\s+(.+?)\s+([\d,]+\.\d{2})(CR)?\s*$",ln)
                if not m: continue
                blk=m.group(5).strip(); amt=num(m.group(6)); cr=bool(m.group(7))
                td=int(m.group(3)); tmon=MON.get(m.group(4))
                if not tmon: continue
                dt=D(datetime.date.today().year,tmon,td)
                up=blk.upper()
                if "FEE" in up: nF+=1; gross+=amt; continue
                if cr and re.search(r"PAYMENT|THANK YOU|AUTOPAY",up):
                    nPay+=1; continue
                fm=re.search(r"\s([A-Z]{3})\s+([\d,]+\.\d{2})$",blk)
                if fm:
                    cur=fm.group(1); orig=num(fm.group(2)); merch=blk[:fm.start()].strip()
                else:
                    cur="EUR"; orig=amt; merch=blk
                home=round(amt*FX_RATE,2)
                if cr:
                    nRef+=1; home=-home; orig=-orig
                else:
                    gross+=amt; nP+=1
                lines.append(dict(card=card,date=dt.isoformat(),merchant=re.sub(r"\s+"," ",merch),orig=orig,cur=cur,home=home,refund=cr))
        recon[fn]=dict(card=card,mon=mon,stmt_total=stmt_total,gross=round(gross,2),nP=nP,nF=nF,nPay=nPay,nRef=nRef)
        for L in lines: L["src"]=fn
        rows+=lines
    return rows, recon

def load_ledger_keys(path):
    wb=openpyxl.load_workbook(path, data_only=True); tx=wb["Transactions"]; keys=set()
    for r in range(3, tx.max_row+1):
        a=tx.cell(r,1).value
        if not a: continue
        di=a.date().isoformat() if hasattr(a,'date') else str(a)
        keys.add((tx.cell(r,4).value, di, round(tx.cell(r,8).value or 0,2)))
    return keys

def main():
    rows, recon = parse()
    print("==== PER-STATEMENT RECONCILIATION (parsed gross debits vs printed total) ====")
    for fn,r in recon.items():
        ok="OK " if (r["stmt_total"] and abs(r["gross"]-r["stmt_total"])<0.05) else "XX "
        print(f"{ok}{r['card']:14s} {r['mon']}  printed={r['stmt_total']}  parsedGross={r['gross']}  | purch={r['nP']} fee={r['nF']} pay={r['nPay']} refund={r['nRef']}")

    exset = load_ledger_keys(LEDGER_XLSX) if os.path.exists(LEDGER_XLSX) else set()
    new=[]; seen=set(); skipped=0
    for L in rows:
        key=(L["card"], L["date"], round(L["home"],2))
        if key in exset or key in seen: skipped+=1; continue
        seen.add(key); new.append(L)
    print(f"\nDedup: {len(rows)} parsed line-items -> {len(new)} NEW, {skipped} skipped (already in ledger or dup)")

    out_new=[]; review=[]
    for L in new:
        cat,sub=classify(L["merchant"], L["refund"])
        out_new.append(dict(date=L["date"], month=L["date"][:7], year=int(L["date"][:4]), card=L["card"],
            merchant=L["merchant"], orig_amt=L["orig"], currency=L["cur"], home=L["home"],
            category=cat, subcategory=sub, notes=("Refund" if L["refund"] else None)))
        if cat=="Miscellaneous" or any(k in L["merchant"].upper() for k in LOWCONF):
            review.append((L["date"],L["card"],L["merchant"][:34],round(L["home"]),cat))

    agg=defaultdict(lambda:[0,0.0])
    for r in out_new:
        k=(r["card"],r["month"]); agg[k][0]+=1; agg[k][1]+=r["home"]
    print("\nNEW rows by card/month:")
    for k in sorted(agg): print(f"  {k[0]:14s} {k[1]}  n={agg[k][0]:3d}  home={agg[k][1]:,.2f}")
    print(f"\nFLAG FOR REVIEW (low-confidence / misc): {len(review)}")
    for r in review: print("  ",r)

    json.dump(out_new, open(OUT_JSON,"w"), default=str, ensure_ascii=False)
    print(f"\nsaved {OUT_JSON} ({len(out_new)} rows) - review, then append to the Transactions tab and rebuild.")

if __name__=="__main__":
    main()

# This file was installed from Jeff Su's Cowork Academy AI Command Center template.
