#!/usr/bin/env python3
"""
Master Spending Tracker - dashboard rebuild script  (STUDENT TEMPLATE)
=====================================================================
Rebuilds all 8 dashboard tabs from the single Transactions ledger.

ADAPT THIS TEMPLATE TO YOUR OWN DATA
  This is a generic starter. Before you rely on it, edit three things to match
  your life:
    1. CARDS      - your own cards/accounts and currencies. Identify each card by
                    a consistent label you choose (e.g. "Primary Card", "Foreign
                    Card"); last-four digits are optional if you want them.
    2. SUBS       - the recurring-service keyword matcher (a short example list
                    ships below; replace it with the services YOU pay for).
    3. FX         - the FX Rates tab uses example currencies (Home + EUR). Set
                    your own home currency and any foreign currencies you spend in.
  The CATS / TAX taxonomy is a reasonable default you can keep or tweak.

WHAT IT DOES
  Reads the source columns of the `Transactions` tab (Date, Card, Merchant,
  Original Amount, Currency, Home-Currency Equivalent, Category, Subcategory,
  Notes) and regenerates every other tab with live, Numbers-safe formulas. The
  ledger is the only source of truth; Month/Year/Service/Flag and all dashboards
  are derived. Nothing is hand-typed.

SNAPSHOT HEADLINES THE LAST FULL MONTH
  Credit-card statements close mid-month, so the most recent data month is
  always partial. The Snapshot headline (total, vs prior month, vs 6-month
  average, by-card, top categories, largest transactions) points at the LAST
  FULL month = EDATE(MAX(month), -1). The current partial month is shown
  separately and flagged. YTD stays cumulative (includes the partial month),
  but Avg/month and Annualized use complete months only. In a fresh template,
  date and period labels stay blank until the first transaction is imported.

USAGE
  python3 build_tracker.py [INPUT_XLSX] [OUTPUT_XLSX]
  Defaults: reads "Master Spending Tracker.xlsx" sitting next to this script,
  writes "Master Spending Tracker (rebuilt).xlsx" in the same folder.

  Requires Python 3 and openpyxl. If openpyxl is missing, install it in the
  current environment or a virtual environment; do not override system package
  protections.

  After building, the script tries to finalize the workbook through LibreOffice /
  soffice so cached formula values are populated for preview tools. If no command-
  line calculation engine is available, it saves a draft and exits with a clear
  warning. Open and save that draft in Numbers, Excel, or LibreOffice before you
  treat it as final.

NUMBERS-SAFE FORMULAS ONLY
  SUMIF(S), COUNTIF(S), INDEX, MATCH, LARGE, LOOKUP, IF, IFERROR, EDATE, DATE,
  YEAR, MONTH, TEXT, AVERAGE, MAX, SUM. No SUMPRODUCT over ranges, no array
  formulas, no MAXIFS/MINIFS, no dynamic arrays (FILTER/SORT/UNIQUE), no XLOOKUP.

The category list (CATS / TAX) and the subscription keyword list (SUBS) are the
maintenance lists; edit them here when adding a category or a recurring service.
The statement parser that appends new rows to the ledger is the companion file
`append_statements.py`.
"""
import os, sys, datetime, shutil, subprocess, tempfile
import openpyxl
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter as GL

HERE = os.path.dirname(os.path.abspath(__file__))
INPUT_XLSX = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "Master Spending Tracker.xlsx")
OUT        = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, "Master Spending Tracker (rebuilt).xlsx")

# ---- Load the ledger straight from the Transactions tab (source columns only) ----
def load_rows(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    tx = wb["Transactions"]
    out = []
    for r in range(3, tx.max_row + 1):
        a = tx.cell(r, 1).value                      # Date
        if a in (None, ""):
            continue
        di = a.date().isoformat() if isinstance(a, (datetime.datetime, datetime.date)) else str(a)
        out.append(dict(
            date=di,
            card=tx.cell(r, 4).value,
            merchant=tx.cell(r, 5).value,
            orig_amt=tx.cell(r, 6).value,
            currency=tx.cell(r, 7).value,
            home=tx.cell(r, 8).value,                # Home-currency equivalent
            category=tx.cell(r, 9).value,
            subcategory=tx.cell(r, 10).value,
            notes=tx.cell(r, 13).value,
        ))
    return out

rows = load_rows(INPUT_XLSX)
def d(s): return datetime.date.fromisoformat(s) if s else None
def dd_(s): return datetime.date.fromisoformat(s) if s else None
rows.sort(key=lambda r: (r["date"] or "", r["card"] or ""))

# ---- Palette (clean Google-style) + styling helpers ----
INK="FF202124"; BLUE="FF1e6de0"; LBLUE="FFd2e3fc"; GRAY="FF3c4043"; INPUT="FF4285f4"; WHITE="FFFFFFFF"
F="Arial"
def fnt(sz=10,b=False,color=INK,it=False): return Font(name=F,size=sz,bold=b,color=color,italic=it)
def fl(c): return PatternFill("solid",fgColor=c)
thin=Side(style="thin",color="FFD0D3D6"); grid=Border(thin,thin,thin,thin)
CEN=Alignment(horizontal="center",vertical="center")
LEF=Alignment(horizontal="left",vertical="center")
RGT=Alignment(horizontal="right",vertical="center")
WCEN=Alignment(horizontal="center",vertical="center",wrap_text=True)
HOME='#,##0;-#,##0;"-"'; HOME2='#,##0.00;-#,##0.00;"-"'; PCT='0.0%;-0.0%;"-"'; DPCT='+0.0%;-0.0%;0.0%'
MY='mmm yyyy'; MD='mmm d, yyyy'; YMD='yyyy-mm-dd'

CATS=["Housing","Food & Dining","Transportation","Travel","Shopping","Health & Wellness",
"Subscriptions & Software","Entertainment","Personal Care","Gifts & Relationships","Financial","Miscellaneous"]

# ---- ADAPT: your cards/accounts (label, descriptive details shown on Cards tab) ----
# Identify each card by a consistent LABEL you pick and reuse everywhere (the
# Card column in the ledger, the FILES map in append_statements.py, here). The
# label is what dedup and every dashboard key on, so keep it stable. Last-four
# digits are optional: include them in the details text only if you want a way to
# disambiguate similar cards. They are never required.
CARDS=[("Primary Card","Example Bank Rewards Card - Home currency"),
("Secondary Card","Example Bank Everyday Card - Home currency"),
("Foreign Card","Example Travel Card - EUR")]

# ---- ADAPT: recurring-service keyword matcher (EXAMPLES ONLY) ----
# Each entry: (Display name, [UPPERCASE keywords found in the merchant text], Billing).
# Replace these with the services YOU actually pay for. Matching is substring,
# case-insensitive. Keep keywords specific enough to avoid false hits.
SUBS=[("Streaming Service",["EXAMPLE STREAM"],"Monthly"),
("Music Service",["EXAMPLE MUSIC"],"Monthly"),
("Cloud Storage",["EXAMPLE CLOUD"],"Annual"),
("Productivity App",["EXAMPLE PRODUCTIVITY"],"Monthly"),
("News Subscription",["EXAMPLE NEWS"],"Annual")]
def tag(m):
    M=(m or "").upper()
    for lbl,kws,_ in SUBS:
        if any(k in M for k in kws): return lbl
    return ""
agg={lbl:0.0 for lbl,_,_ in SUBS}
for r in rows:
    t=tag(r["merchant"])
    if t: agg[t]+=r["home"] or 0
SUBS.sort(key=lambda s:-agg[s[0]])

wb=Workbook()
def darkrow(ws,row,c0,text,span,sz=15,bg=INK):
    for i in range(span):
        c=ws.cell(row,c0+i); c.fill=fl(bg)
        if i==0: c.value=text; c.font=fnt(sz,True,WHITE); c.alignment=LEF
def secrow(ws,row,c0,text,span): darkrow(ws,row,c0,text,span,11,BLUE)
def hdr(ws,row,c0,labels,al=CEN,wrap=False):
    for i,t in enumerate(labels):
        c=ws.cell(row,c0+i); c.value=t; c.font=fnt(10,True,INK); c.fill=fl(LBLUE)
        c.alignment=WCEN if wrap else al; c.border=grid

# ============================ TRANSACTIONS
tx=wb.active; tx.title="Transactions"
darkrow(tx,1,1,"TRANSACTIONS  (master ledger - all cards, all years)",13)
TXH=["Date","Month","Year","Card","Merchant","Original Amount","Currency","Home-Currency Equivalent","Category","Subcategory","Service","Flag","Notes"]
for i,t in enumerate(TXH):
    c=tx.cell(2,1+i); c.value=t; c.font=fnt(10,True,WHITE); c.fill=fl(GRAY); c.alignment=CEN; c.border=grid
for j,r in enumerate(rows):
    x=3+j
    tx.cell(x,1,d(r["date"])).number_format=YMD
    tx.cell(x,2,f'=IF($A{x}="","",DATE(YEAR($A{x}),MONTH($A{x}),1))').number_format=MY
    tx.cell(x,3,f'=IF($A{x}="","",YEAR($A{x}))').number_format='0'
    tx.cell(x,4,r["card"]); tx.cell(x,5,r["merchant"])
    tx.cell(x,6,r["orig_amt"]).number_format=HOME2
    tx.cell(x,7,r["currency"]); tx.cell(x,8,r["home"]).number_format=HOME2
    tx.cell(x,9,r["category"]); tx.cell(x,10,r["subcategory"]); tx.cell(x,11,tag(r["merchant"]))
    tx.cell(x,12,f'=IF($H{x}="","",IF($H{x}<0,"REFUND",IF($H{x}>=5000,"LARGE","")))').alignment=CEN
    tx.cell(x,13,r["notes"])
last=2+len(rows)
for x in range(3,last+1):
    for col in range(1,14):
        c=tx.cell(x,col); c.font=fnt(9); c.border=grid
        c.alignment=CEN if col in (1,3,7,12) else (RGT if col in (6,8) else LEF)
for c,w in zip("ABCDEFGHIJKLM",[11,9,6,14,40,15,9,18,22,16,18,9,30]): tx.column_dimensions[c].width=w
tx.freeze_panes="A3"; tx.auto_filter.ref=f"A2:M{last}"; tx.sheet_properties.tabColor=GRAY[2:]

T="'Transactions'!"; H=f"{T}$H$3:$H$2000"; B=f"{T}$B$3:$B$2000"; C=f"{T}$C$3:$C$2000"
DD=f"{T}$D$3:$D$2000"; E=f"{T}$E$3:$E$2000"; I=f"{T}$I$3:$I$2000"; A=f"{T}$A$3:$A$2000"
K=f"{T}$K$3:$K$2000"; Lf=f"{T}$L$3:$L$2000"

# ============================ SNAPSHOT  (headlines the LAST FULL month)
sn=wb.create_sheet("Snapshot")
darkrow(sn,2,2,"MASTER SPENDING TRACKER",8,16)
secrow(sn,3,2,"Snapshot: your expenses at a glance (all amounts in home currency)",8)
# lag note (one line)
sn["B4"]=("Headline = your last complete statement month. Because cards close mid-month, the newest month is still "
          "partial (shown separately below), so the headline trails the calendar by about one statement cycle.")
sn["B4"].font=fnt(9,False,GRAY,True); sn["B4"].alignment=LEF

# ---- Headline: last full month ----
sn.row_dimensions[5].height=30
hdr(sn,5,2,["LAST FULL MONTH","TOTAL EXPENSES","VS PRIOR MONTH","VS 6-MONTH AVG","# TRANSACTIONS"],wrap=True)
sn["B6"]=f'=IF(COUNT({A})=0,"",EDATE(MAX({B}),-1))'; sn["B6"].number_format=MY; sn["B6"].font=fnt(13,True,BLUE)
sn["C6"]=f"=SUMIFS({H},{B},$B$6)"; sn["C6"].number_format=HOME
sn["D6"]="=IFERROR(C6/G42-1,\"\")"; sn["D6"].number_format=DPCT
sn["E6"]="=IFERROR(C6/AVERAGE(C42:H42)-1,\"\")"; sn["E6"].number_format=DPCT
sn["F6"]=f"=COUNTIFS({B},$B$6)"; sn["F6"].number_format='0'
for col in range(2,7):
    c=sn.cell(6,col); c.alignment=CEN; c.border=grid
    if col>2: c.font=fnt(15,True,INK)

# ---- This month so far (partial) ----
secrow(sn,8,2,"This month so far (partial)",8)
hdr(sn,9,2,["MONTH","SPENT SO FAR","# TRANSACTIONS","THROUGH",""])
sn["B10"]=f'=IF(COUNT({A})=0,"",MAX({B}))'; sn["B10"].number_format=MY; sn["B10"].font=fnt(11,True,GRAY)
sn["C10"]=f"=SUMIFS({H},{B},$B$10)"; sn["C10"].number_format=HOME; sn["C10"].font=fnt(12,True,INK)
sn["D10"]=f"=COUNTIFS({B},$B$10)"; sn["D10"].number_format='0'; sn["D10"].font=fnt(11,True,INK)
sn["E10"]=f'=IF(B10="","",TEXT(LOOKUP(2,1/({B}=$B$10),{A}),"mmm d"))'; sn["E10"].font=fnt(10,False,GRAY,True)
for col in range(2,6):
    c=sn.cell(10,col); c.alignment=CEN; c.border=grid

# ---- This year ----
secrow(sn,12,2,"This year",8)
sn.row_dimensions[13].height=30
hdr(sn,13,2,["YEAR","EXPENSES THIS YEAR","AVG / MONTH","ANNUALIZED (RUN-RATE)","# TRANSACTIONS"],wrap=True)
sn["B14"]='=IF($B$6="","",YEAR($B$6))'; sn["B14"].number_format='0'
sn["C14"]=f"=SUMIFS({H},{C},$B$14)"; sn["C14"].number_format=HOME
sn["D14"]=f'=IFERROR(SUMIFS({H},{C},$B$14,{B},"<="&$B$6)/MONTH($B$6),0)'; sn["D14"].number_format=HOME
sn["E14"]="=D14*12"; sn["E14"].number_format=HOME
sn["F14"]=f"=COUNTIFS({C},$B$14)"; sn["F14"].number_format='0'
for col in range(2,7): sn.cell(14,col).font=fnt(12,True,INK); sn.cell(14,col).alignment=CEN; sn.cell(14,col).border=grid
sn["B15"]=("Expenses this year is cumulative and includes the partial month. Avg / month and Annualized use "
           "complete months only, through the last full month.")
sn["B15"].font=fnt(9,False,GRAY,True); sn["B15"].alignment=LEF

# ---- By card (last full month) ----
secrow(sn,17,2,"Expenses by card (last full month)",8)
hdr(sn,18,2,["CARD","LAST FULL MONTH","SHARE","YTD",""])
for i,(cn,_) in enumerate(CARDS):
    x=19+i; sn.cell(x,2,cn).font=fnt(10)
    sn.cell(x,3,f"=SUMIFS({H},{DD},$B{x},{B},$B$6)").number_format=HOME
    sn.cell(x,4,f"=IFERROR(C{x}/$C$6,0)").number_format=PCT
    sn.cell(x,5,f"=SUMIFS({H},{DD},$B{x},{C},$B$14)").number_format=HOME
sn.cell(22,2,"TOTAL").font=fnt(10,True)
sn.cell(22,3,"=SUM(C19:C21)").number_format=HOME; sn.cell(22,4,"=SUM(D19:D21)").number_format=PCT; sn.cell(22,5,"=SUM(E19:E21)").number_format=HOME
for x in range(19,23):
    for col in range(2,6):
        c=sn.cell(x,col); c.border=grid
        if col>2: c.alignment=RGT
        if x==22: c.font=fnt(10,True)

# ---- Top categories (last full month) ----
secrow(sn,24,2,"Top expense categories (last full month)",8)
hdr(sn,25,2,["CATEGORY","AMOUNT","% OF MONTH","",""])
for i,cat in enumerate(CATS):
    hx=25+i; sn.cell(hx,16,cat)
    sn.cell(hx,17,f"=SUMIFS({H},{I},$P{hx},{B},$B$6)")
    sn.cell(hx,18,f"=Q{hx}-ROW()*0.0001")
for k in range(5):
    x=26+k
    sn.cell(x,2,f'=IF(LARGE($R$25:$R$36,{k+1})<=0,"",INDEX($P$25:$P$36,MATCH(LARGE($R$25:$R$36,{k+1}),$R$25:$R$36,0)))')
    sn.cell(x,3,f'=IF($B{x}="","",INDEX($Q$25:$Q$36,MATCH(LARGE($R$25:$R$36,{k+1}),$R$25:$R$36,0)))').number_format=HOME
    sn.cell(x,4,f'=IF($B{x}="","",C{x}/$C$6)').number_format=PCT
    for col in range(2,5):
        c=sn.cell(x,col); c.border=grid; c.font=fnt(10)
        if col>2: c.alignment=RGT
for col in "PQR": sn.column_dimensions[col].hidden=True

# Hidden Snapshot helper for largest transactions. Keep helper logic off the
# Transactions ledger so that sheet stays exactly columns A:M.
for helper_row in range(25, 2023):
    idx=helper_row-24
    sn.cell(helper_row,19,f'=IF(INDEX({A},{idx})="","",IF(INDEX({B},{idx})=$B$6,INDEX({H},{idx})-{idx}*0.000001,""))')
sn.column_dimensions["S"].hidden=True
TXRANK="$S$25:$S$2022"

# ---- Largest transactions (last full month) ----
secrow(sn,31,2,"Largest transactions (last full month)",8)
hdr(sn,32,2,["MERCHANT","","","AMOUNT","CARD","FLAG"]); sn.merge_cells("B32:D32")
for k in range(5):
    x=33+k; m=f"MATCH(LARGE({TXRANK},{k+1}),{TXRANK},0)"
    sn.cell(x,2,f'=IFERROR(INDEX({E},{m}),"")'); sn.merge_cells(f"B{x}:D{x}")
    sn.cell(x,5,f'=IFERROR(INDEX({H},{m}),"")').number_format=HOME
    sn.cell(x,6,f'=IFERROR(INDEX({DD},{m}),"")')
    sn.cell(x,7,f'=IFERROR(INDEX({Lf},{m}),"")')
    for col in (2,5,6,7):
        c=sn.cell(x,col); c.border=grid; c.font=fnt(10)
        c.alignment=RGT if col==5 else (CEN if col>=6 else LEF)
    for col in (3,4): sn.cell(x,col).border=grid

# ---- Last 6 complete months + current partial ----
secrow(sn,40,2,"Last 6 complete months + current partial month (home currency)",8)
sn.cell(41,2,"Month").font=fnt(10,True); sn.cell(42,2,"Total").font=fnt(10,True)
for i in range(6):
    col=3+i; cl=GL(col)
    c=sn.cell(41,col,f'=IF($B$6="","",EDATE($B$6,{-5+i}))'); c.number_format=MY; c.font=fnt(10,True,INK); c.fill=fl(LBLUE); c.alignment=CEN; c.border=grid
    t=sn.cell(42,col,f"=SUMIFS({H},{B},{cl}41)"); t.number_format=HOME; t.alignment=CEN; t.border=grid; t.font=fnt(10)
# partial column (col I) = month after the last full month, flagged in gray
pc=sn.cell(41,9,'=IF($B$6="","",EDATE($B$6,1))'); pc.number_format=MY; pc.font=fnt(10,True,WHITE,True); pc.fill=fl(GRAY); pc.alignment=CEN; pc.border=grid
pt=sn.cell(42,9,f"=SUMIFS({H},{B},I41)"); pt.number_format=HOME; pt.font=fnt(10,False,GRAY,True); pt.alignment=CEN; pt.border=grid
sn["B43"]=("Columns C to H are complete months ending at the last full month. The final gray column is the current "
           "partial month, still accumulating.")
sn["B43"].font=fnt(9,False,GRAY,True); sn["B43"].alignment=LEF

for c,w in zip("BCDEFGHI",[28,15,13,13,12,12,12,12]): sn.column_dimensions[c].width=w
sn.sheet_properties.tabColor=BLUE[2:]; sn.sheet_view.showGridLines=False

# ============================ MONTHLY HISTORY
mh=wb.create_sheet("Monthly History")
darkrow(mh,1,1,"MONTHLY HISTORY  (trailing 12 months by category, home currency)",13)
mh["P1"]=f'=IF(COUNT({A})=0,"",MAX({B}))'; mh["P1"].number_format=MY
mh.cell(3,1,"Category").font=fnt(10,True,WHITE); mh.cell(3,1).fill=fl(GRAY); mh.cell(3,1).alignment=LEF; mh.cell(3,1).border=grid
for i in range(12):
    col=2+i; c=mh.cell(3,col,f'=IF($P$1="","",EDATE($P$1,{-11+i}))'); c.number_format='mmm yy'; c.font=fnt(10,True,WHITE); c.fill=fl(GRAY); c.alignment=CEN; c.border=grid
for ci,cat in enumerate(CATS):
    x=4+ci; mh.cell(x,1,cat).font=fnt(9); mh.cell(x,1).border=grid; mh.cell(x,1).alignment=LEF
    for i in range(12):
        col=2+i; cl=GL(col)
        c=mh.cell(x,col,f"=SUMIFS({H},{I},$A{x},{B},{cl}$3)"); c.number_format=HOME; c.border=grid; c.alignment=RGT; c.font=fnt(9)
tr=16
mh.cell(tr,1,"TOTAL").font=fnt(10,True); mh.cell(tr,1).fill=fl(LBLUE); mh.cell(tr,1).border=grid
for i in range(12):
    col=2+i; cl=GL(col); c=mh.cell(tr,col,f"=SUM({cl}4:{cl}15)"); c.number_format=HOME; c.font=fnt(10,True); c.fill=fl(LBLUE); c.border=grid; c.alignment=RGT
secrow(mh,18,1,"By card",13)
for i,(cn,_) in enumerate(CARDS):
    x=19+i; mh.cell(x,1,cn).font=fnt(9); mh.cell(x,1).border=grid
    for j in range(12):
        col=2+j; cl=GL(col); c=mh.cell(x,col,f"=SUMIFS({H},{DD},$A{x},{B},{cl}$3)"); c.number_format=HOME; c.border=grid; c.alignment=RGT; c.font=fnt(9)
mh.column_dimensions["A"].width=24
for i in range(12): mh.column_dimensions[GL(2+i)].width=10
mh.column_dimensions["P"].hidden=True
mh.freeze_panes="B4"; mh.sheet_properties.tabColor=BLUE[2:]; mh.sheet_view.showGridLines=False

# ============================ TRENDS
td=wb.create_sheet("Trends")
darkrow(td,1,1,"TRENDS  (annual + quarterly + category mix, home currency)",9)
td["P1"]=f'=IF(COUNT({A})=0,"",MAX({B}))'; td["P1"].number_format=MY
td["P2"]='=IF($P$1="","",DATE(YEAR($P$1),INT((MONTH($P$1)-1)/3)*3+1,1))'
for i in range(8): td.cell(5+i,16,f'=IF($P$2="","",EDATE($P$2,{-3*(7-i)}))').number_format=MY
secrow(td,3,1,"Annual totals",4)
hdr(td,4,1,["Year","Total","Transactions","Avg / month"],al=LEF)
# Years are derived from the ledger: a rolling window of the 4 most recent
# calendar years, anchored on YEAR(MAX(date)) in $P$1. No years are hard-coded.
# Row 5 = latest year minus 3 ... row 8 = latest year. Years with no transactions
# simply read 0 / blank, which is correct for a rolling window.
for i in range(4):
    x=5+i; td.cell(x,1,f'=IF($P$1="","",YEAR($P$1)-{3-i})').number_format='0'; td.cell(x,1).alignment=CEN
    td.cell(x,2,f"=SUMIFS({H},{C},$A{x})").number_format=HOME
    td.cell(x,3,f"=COUNTIFS({C},$A{x})").number_format='0'
    td.cell(x,4,(f"=IFERROR(B{x}/(MONTH(LOOKUP(2,1/({C}=$A{x}),{A}))"
                 f"-MONTH(INDEX({A},MATCH($A{x},{C},0)))+1),0)")).number_format=HOME
    for col in range(1,5): td.cell(x,col).border=grid; td.cell(x,col).font=fnt(10)
    for col in range(2,5): td.cell(x,col).alignment=RGT
secrow(td,11,1,"Quarterly by category (last 8 quarters)",9)
td.cell(12,1,"Category").font=fnt(10,True,INK); td.cell(12,1).fill=fl(LBLUE); td.cell(12,1).border=grid
for i in range(8):
    col=2+i; pr=f"$P${5+i}"
    c=td.cell(12,col,f'=IF({pr}="","","Q"&(INT((MONTH({pr})-1)/3)+1)&" "&YEAR({pr}))'); c.font=fnt(10,True,INK); c.fill=fl(LBLUE); c.alignment=CEN; c.border=grid
for ci,cat in enumerate(CATS):
    x=13+ci; td.cell(x,1,cat).font=fnt(9); td.cell(x,1).border=grid
    for i in range(8):
        col=2+i; pr=f"$P${5+i}"
        c=td.cell(x,col,f'=SUMIFS({H},{I},$A{x},{B},">="&{pr},{B},"<"&EDATE({pr},3))'); c.number_format=HOME; c.border=grid; c.alignment=RGT; c.font=fnt(9)
qt=25; td.cell(qt,1,"TOTAL").font=fnt(10,True); td.cell(qt,1).fill=fl(LBLUE); td.cell(qt,1).border=grid
for i in range(8):
    col=2+i; cl=GL(col); c=td.cell(qt,col,f"=SUM({cl}13:{cl}24)"); c.number_format=HOME; c.font=fnt(10,True); c.fill=fl(LBLUE); c.border=grid; c.alignment=RGT
secrow(td,27,1,"Category mix (all-time)",3)
hdr(td,28,1,["Category","Total","Share"],al=LEF)
for ci,cat in enumerate(CATS):
    x=29+ci; td.cell(x,1,cat).font=fnt(9); td.cell(x,1).border=grid
    td.cell(x,2,f"=SUMIF({I},$A{x},{H})").number_format=HOME
    td.cell(x,3,f"=IFERROR(B{x}/SUM({H}),0)").number_format=PCT
    for col in (2,3): td.cell(x,col).alignment=RGT; td.cell(x,col).border=grid; td.cell(x,col).font=fnt(9)
td.cell(41,1,"TOTAL").font=fnt(10,True); td.cell(41,1).fill=fl(LBLUE); td.cell(41,1).border=grid
td.cell(41,2,f"=SUM(B29:B40)").number_format=HOME; td.cell(41,2).font=fnt(10,True); td.cell(41,2).fill=fl(LBLUE); td.cell(41,2).border=grid; td.cell(41,2).alignment=RGT
td.cell(41,3,f"=SUM(C29:C40)").number_format=PCT; td.cell(41,3).font=fnt(10,True); td.cell(41,3).fill=fl(LBLUE); td.cell(41,3).border=grid; td.cell(41,3).alignment=RGT
td.column_dimensions["A"].width=24
for i in range(8): td.column_dimensions[GL(2+i)].width=11
td.column_dimensions["P"].hidden=True
td.sheet_properties.tabColor=BLUE[2:]; td.sheet_view.showGridLines=False

# ============================ SUBSCRIPTIONS
sb=wb.create_sheet("Subscriptions")
darkrow(sb,1,1,"SUBSCRIPTIONS & RECURRING  (matched by service tag in the ledger)",6)
hdr(sb,3,1,["Service","Billing","All-time","# Charges","Last charge","Last 12 mo"],al=LEF)
for i,(nm,kws,bill) in enumerate(SUBS):
    x=4+i
    sb.cell(x,1,nm).font=fnt(10); sb.cell(x,1).alignment=LEF
    sb.cell(x,2,bill).font=fnt(9,False,GRAY); sb.cell(x,2).alignment=CEN
    sb.cell(x,3,f"=SUMIF({K},$A{x},{H})").number_format=HOME
    sb.cell(x,4,f"=COUNTIF({K},$A{x})").number_format='0'
    sb.cell(x,5,f'=IF(D{x}=0,"",LOOKUP(2,1/({K}=$A{x}),{A}))').number_format=MD
    sb.cell(x,6,f'=SUMIFS({H},{K},$A{x},{A},">="&(TODAY()-365))').number_format=HOME
    for col in range(1,7): sb.cell(x,col).border=grid
    for col in (3,4,5,6): sb.cell(x,col).alignment=RGT
nx=4+len(SUBS)
sb.cell(nx,1,"TOTAL (listed)").font=fnt(10,True); sb.cell(nx,1).fill=fl(LBLUE); sb.cell(nx,1).border=grid
sb.cell(nx,2,"").fill=fl(LBLUE); sb.cell(nx,2).border=grid
sb.cell(nx,3,f"=SUM(C4:C{nx-1})").number_format=HOME; sb.cell(nx,3).font=fnt(10,True); sb.cell(nx,3).fill=fl(LBLUE); sb.cell(nx,3).border=grid; sb.cell(nx,3).alignment=RGT
sb.cell(nx,6,f"=SUM(F4:F{nx-1})").number_format=HOME; sb.cell(nx,6).font=fnt(10,True); sb.cell(nx,6).fill=fl(LBLUE); sb.cell(nx,6).border=grid; sb.cell(nx,6).alignment=RGT
sb.cell(nx+1,1,"All Subscriptions & Software (category, all-time)").font=fnt(9,False,GRAY,True)
sb.cell(nx+1,3,f'=SUMIF({I},"Subscriptions & Software",{H})').number_format=HOME; sb.cell(nx+1,3).font=fnt(9,True,GRAY); sb.cell(nx+1,3).alignment=RGT
for c,w in zip("ABCDEF",[26,17,16,10,15,17]): sb.column_dimensions[c].width=w
sb.freeze_panes="A4"; sb.sheet_properties.tabColor=BLUE[2:]; sb.sheet_view.showGridLines=False

# ============================ CARDS
cd=wb.create_sheet("Cards")
darkrow(cd,1,1,"CARDS",6)
hdr(cd,3,1,["Card","Details","Total","# Transactions","Share","Latest month"],al=LEF)
for i,(cn,det) in enumerate(CARDS):
    x=4+i
    cd.cell(x,1,cn).font=fnt(10,True); cd.cell(x,1).alignment=LEF
    cd.cell(x,2,det).font=fnt(9,False,GRAY); cd.cell(x,2).alignment=LEF
    cd.cell(x,3,f"=SUMIF({DD},$A{x},{H})").number_format=HOME
    cd.cell(x,4,f"=COUNTIF({DD},$A{x})").number_format='0'
    cd.cell(x,5,f"=IFERROR(C{x}/$C$7,0)").number_format=PCT
    cd.cell(x,6,f"=SUMIFS({H},{DD},$A{x},{B},MAX({B}))").number_format=HOME
    for col in range(1,7): cd.cell(x,col).border=grid
    for col in (3,4,5,6): cd.cell(x,col).alignment=RGT
cd.cell(7,1,"TOTAL").font=fnt(10,True); cd.cell(7,1).fill=fl(LBLUE); cd.cell(7,1).border=grid
cd.cell(7,2,"").fill=fl(LBLUE); cd.cell(7,2).border=grid
cd.cell(7,3,"=SUM(C4:C6)").number_format=HOME; cd.cell(7,4,"=SUM(D4:D6)").number_format='0'
cd.cell(7,5,"=SUM(E4:E6)").number_format=PCT; cd.cell(7,6,"=SUM(F4:F6)").number_format=HOME
for col in range(3,7): cd.cell(7,col).font=fnt(10,True); cd.cell(7,col).fill=fl(LBLUE); cd.cell(7,col).border=grid; cd.cell(7,col).alignment=RGT
for c,w in zip("ABCDEF",[16,44,16,14,9,15]): cd.column_dimensions[c].width=w
cd.sheet_properties.tabColor=GRAY[2:]; cd.sheet_view.showGridLines=False

# ============================ CATEGORY TAXONOMY
ct=wb.create_sheet("Category Taxonomy")
darkrow(ct,1,1,"CATEGORY TAXONOMY",3)
hdr(ct,3,1,["Category","Subcategories","Description"],al=LEF)
TAX=[("Housing","Rent, Utilities, Maintenance, Property fees","Recurring housing costs"),
("Food & Dining","Groceries, Restaurants, Delivery, Coffee","All food and beverage spending"),
("Transportation","Taxi, Metro, Fuel, Parking, Non-trip flights","Daily getting-around costs"),
("Travel","Flights, Hotels, Trip expenses, Visas","Dedicated trip spending"),
("Shopping","Clothing, Electronics, Household goods","Discretionary purchases"),
("Health & Wellness","Gym, Medical, Pharmacy, Supplements","Physical health spending"),
("Subscriptions & Software","SaaS, Streaming, Memberships, Apps","Recurring digital subscriptions"),
("Entertainment","Events, Hobbies, Nightlife","Leisure and social spending"),
("Personal Care","Grooming, Skincare, Haircuts","Appearance and self-care"),
("Gifts & Relationships","Gifts, Dates, Celebrations","Spending on and with others"),
("Financial","Loan payments, Insurance, Bank fees","Financial obligations"),
("Miscellaneous","Uncategorized, One-offs","Anything that doesn't fit above")]
for i,(a,b,c) in enumerate(TAX):
    x=4+i; ct.cell(x,1,a).font=fnt(10,True); ct.cell(x,2,b).font=fnt(9); ct.cell(x,3,c).font=fnt(9,False,GRAY)
    for col in range(1,4): ct.cell(x,col).border=grid; ct.cell(x,col).alignment=LEF
for c,w in zip("ABC",[26,46,34]): ct.column_dimensions[c].width=w
ct.sheet_properties.tabColor=GRAY[2:]

# ============================ FX RATES
fx=wb.create_sheet("FX Rates")
darkrow(fx,1,1,"STATIC FX RATES (to home currency)",3)
hdr(fx,3,1,["Currency","Rate to Home","Note"],al=LEF)
# ADAPT: set your home currency (rate 1) and any foreign currencies you spend in.
# These are placeholder examples only - replace with rates that fit your life.
FX=[("Home",1,"Base currency"),("EUR",1.10,"Example foreign currency - placeholder rate")]
for i,(a,b,c) in enumerate(FX):
    x=4+i; fx.cell(x,1,a).font=fnt(10,True)
    fx.cell(x,2,b).font=fnt(10,False,INPUT); fx.cell(x,2).number_format='0.000'; fx.cell(x,2).alignment=CEN
    fx.cell(x,3,c).font=fnt(9,False,GRAY)
    for col in range(1,4): fx.cell(x,col).border=grid
fx.cell(4+len(FX)+1,1,"Rates are placeholders. Add your own currencies and update when they materially shift.").font=fnt(9,False,GRAY,True)
for c,w in zip("ABC",[12,14,38]): fx.column_dimensions[c].width=w
fx.sheet_properties.tabColor=GRAY[2:]

order=["Snapshot","Monthly History","Trends","Subscriptions","Cards","Transactions","Category Taxonomy","FX Rates"]
wb._sheets.sort(key=lambda s: order.index(s.title)); wb.active=0
try:
    from openpyxl.workbook.properties import CalcProperties
    wb.calculation=CalcProperties(fullCalcOnLoad=True)
except Exception as e: print("calc skip",e)

def _find_calc_engine():
    candidates=[
        "soffice",
        "libreoffice",
        "/Applications/LibreOffice.app/Contents/MacOS/soffice",
    ]
    for candidate in candidates:
        if os.path.sep in candidate:
            if os.path.exists(candidate):
                return candidate
        else:
            found=shutil.which(candidate)
            if found:
                return found
    return None

def finalize_preview_safe(path):
    """Re-save through a spreadsheet engine so formula caches are populated."""
    engine=_find_calc_engine()
    if not engine:
        print(
            "SAVED DRAFT, NOT PREVIEW-SAFE: no LibreOffice/soffice calculation engine was found. "
            "Open and save the workbook in Numbers, Excel, or LibreOffice, then check Quick Look/preview before delivery.",
            file=sys.stderr,
        )
        return False

    abs_path=os.path.abspath(path)
    with tempfile.TemporaryDirectory() as td:
        cmd=[engine,"--headless","--convert-to","xlsx","--outdir",td,abs_path]
        result=subprocess.run(cmd,capture_output=True,text=True,timeout=120)
        if result.returncode!=0:
            print(result.stdout.strip(), file=sys.stderr)
            print(result.stderr.strip(), file=sys.stderr)
            raise RuntimeError("LibreOffice failed while recalculating the workbook for preview-safe delivery.")
        converted=os.path.join(td,os.path.basename(abs_path))
        if not os.path.exists(converted):
            raise RuntimeError("LibreOffice finished but did not produce a recalculated workbook.")
        shutil.copy2(converted,abs_path)
    return True

wb.save(OUT)
if finalize_preview_safe(OUT):
    print("SAVED preview-safe rows:",len(rows),"last:",last,"->",OUT)
else:
    print("SAVED draft rows:",len(rows),"last:",last,"->",OUT)
    sys.exit(2)

# This file was installed from Jeff Su's Cowork Academy AI Command Center template.
