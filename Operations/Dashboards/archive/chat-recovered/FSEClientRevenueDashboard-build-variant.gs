/*************************************************************************************
 * FSE CLIENT & REVENUE DASHBOARD  (v2)
 * -----------------------------------------------------------------------------------
 * Standalone Apps Script web app. Data source: the active team Smartsheets that roll
 * into the company Gross Fees Report — currently JD Unit + Team 3 + Team 7. (Terra,
 * HB, Team 1, Team 8 are dormant in the trailing window; add here if the Gross Fees
 * Report's active team columns change.)
 *
 * REVENUE BASIS: CLOSED files only, dated by Actual COE (realized revenue).
 *   Reconciles to the Gross Fees Report on COMPLETED months. The report also
 *   pre-populates the current/next month with PROJECTED fees, so the dashboard's
 *   current-month realized figure will read below the report's current-month cell
 *   until that month closes out — that gap is projection, not an error.
 *
 * WINDOWS:  365-Day (trailing 365 days by Actual COE) | YTD (Jan 1 -> today).
 * GROUPING: by Directing Customer (a.k.a. Primary Customer on Unit sheets),
 *   duplicates merged case-/whitespace-insensitive, Escrow Fees summed,
 *   % of Revenue = client sum / window total.
 *
 * FIX LOG v2:
 *   - Robust pagination: Team 7 has 5,746 rows; v1's single 5,000-row page dropped
 *     recent closings. Now pages through every row (and requests only needed columns).
 *   - Customer column resolves "Directing Customer" OR "Primary Customer".
 *   - Added Team + Sales Rep (most recent close wins), dark/light mode, header rename.
 *
 * SETUP:  Project Settings > Script properties > SMARTSHEET_TOKEN = <API token>
 * DEPLOY: Web app | Execute as: Me | Access: Anyone within brettward.net
 *         Redeploy to keep /exec URL: Manage deployments > pencil > New version > Deploy
 *************************************************************************************/

/*************************** CONFIG ***************************/
var CONFIG = {
  tokenProperty: 'SMARTSHEET_TOKEN',
  timezone: 'America/Los_Angeles',
  // Mirrors the Gross Fees Report's active team columns.
  teams: [
    { name: 'JD Unit', sheetId: '6403198558359428' },
    { name: 'Team 3',  sheetId: '339384860993412'  },
    { name: 'Team 7',  sheetId: '307047045588868'  }
  ],
  canceledValue: 'Canceled',
  blankCustomerLabel: '(No Directing Customer)'
};

/*************************** WEB APP ENTRY ***************************/
function doGet() {
  var payload = buildPayload_();
  return HtmlService.createHtmlOutput(getHtml_(payload))
    .setTitle('FSE Client & Revenue Dashboard')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getDashboardData() { return buildPayload_(); }

/*************************** DATA PIPELINE ***************************/
function buildPayload_() {
  var token = PropertiesService.getScriptProperties().getProperty(CONFIG.tokenProperty);
  if (!token) {
    throw new Error('Missing script property "' + CONFIG.tokenProperty +
      '". Add it under Project Settings > Script properties.');
  }

  var records = [];
  CONFIG.teams.forEach(function (team) {
    var sheet = fetchTeam_(team, token);
    var idx = sheet.idx;
    (sheet.rows || []).forEach(function (row) {
      var cellById = {};
      (row.cells || []).forEach(function (c) { cellById[c.columnId] = c; });

      var coe = parseDate_(cellVal_(cellById, idx.actualCoe));
      if (!coe) return; // not closed

      var status = String(cellVal_(cellById, idx.fileStatus) || '').trim();
      if (status.toLowerCase() === CONFIG.canceledValue.toLowerCase()) return;

      var rawCust = String(cellVal_(cellById, idx.customer) || '').trim();
      var displayCust = rawCust ? rawCust.replace(/\s+/g, ' ') : CONFIG.blankCustomerLabel;

      records.push({
        team: team.name,
        customer: displayCust,
        key: displayCust.toLowerCase(),
        rep: String(cellVal_(cellById, idx.salesRep) || '').trim(),
        fee: parseMoney_(cellVal_(cellById, idx.escrowFees)),
        coe: coe,
        address: String(cellVal_(cellById, idx.propertyAddress) || '').trim(),
        escrow: String(cellVal_(cellById, idx.escrowNumber) || '').trim()
      });
    });
  });

  var now = new Date();
  var start365 = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  var startYtd = new Date(now.getFullYear(), 0, 1);

  return {
    title: 'Client & Revenue Dashboard',
    generatedAt: fmtDateTime_(now),
    teams: CONFIG.teams.map(function (t) { return t.name; }),
    windows: {
      '365': computeWindow_(records, start365, now, '365-Day', fmtRange_(start365, now)),
      'ytd': computeWindow_(records, startYtd, now, 'YTD',     fmtRange_(startYtd, now))
    }
  };
}

function computeWindow_(records, start, end, label, rangeStr) {
  var groups = {}, total = 0, fileCount = 0;

  records.forEach(function (r) {
    if (r.coe < start || r.coe > end) return;
    total += r.fee;
    fileCount++;
    var g = groups[r.key];
    if (!g) g = groups[r.key] = { name: r.customer, sum: 0, fileCount: 0, byTeam: {}, files: [] };
    g.sum += r.fee;
    g.fileCount++;
    g.byTeam[r.team] = (g.byTeam[r.team] || 0) + r.fee;
    g.files.push({
      date: fmtDate_(r.coe), ts: r.coe.getTime(),
      escrow: r.escrow, address: r.address, team: r.team, rep: r.rep, fee: r.fee
    });
  });

  var clients = Object.keys(groups).map(function (k) { return groups[k]; });
  clients.sort(function (a, b) { return b.sum - a.sum; });

  clients.forEach(function (c, i) {
    c.rank = i + 1;
    c.pct = total > 0 ? c.sum / total : 0;
    c.files.sort(function (a, b) { return b.ts - a.ts; });     // most recent close first
    c.team = c.files.length ? c.files[0].team : '';            // most recent team
    c.rep = c.files.length ? (c.files[0].rep || '') : '';      // most recent sales rep
    c.files.forEach(function (f) { delete f.ts; });
  });

  return { label: label, range: rangeStr, total: total,
    clientCount: clients.length, fileCount: fileCount, clients: clients };
}

/*************************** SMARTSHEET FETCH ***************************/
function fetchTeam_(team, token) {
  var base = 'https://api.smartsheet.com/2.0/sheets/' + team.sheetId;

  // 1) One light call to read columns, then resolve the ids we need.
  var head = ssGet_(base + '?pageSize=1', token, team.name);
  var idx = resolveColumns_(head.columns || [], team.name);
  var ids = [idx.customer, idx.escrowFees, idx.actualCoe, idx.fileStatus,
             idx.salesRep, idx.propertyAddress, idx.escrowNumber]
              .filter(function (x) { return x; });
  var idsParam = '&columnIds=' + ids.join(',');

  // 2) Page through EVERY row (minimal columns). This is the v1 fix.
  var rows = [], page = 1, guard = 0;
  while (true) {
    if (++guard > 200) break;
    var data = ssGet_(base + '?pageSize=5000&page=' + page + idsParam, token, team.name);
    var batch = data.rows || [];
    rows = rows.concat(batch);
    var totalPages = data.totalPages || 1;
    if (page >= totalPages || batch.length === 0) break;
    page++;
  }
  return { idx: idx, rows: rows };
}

function ssGet_(url, token, name) {
  var resp = UrlFetchApp.fetch(url, {
    method: 'get', headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true
  });
  var code = resp.getResponseCode();
  if (code !== 200) {
    throw new Error('Smartsheet fetch failed for ' + name + ' — HTTP ' + code + ': ' + resp.getContentText());
  }
  return JSON.parse(resp.getContentText());
}

// Title-keyed resolver. Handles "Directing Customer" vs "Primary Customer".
function resolveColumns_(columns, teamName) {
  var norm = (columns || []).map(function (c) {
    return { id: c.id, t: String(c.title || '').trim().toLowerCase() };
  });
  function exact(cands) {
    for (var i = 0; i < cands.length; i++) {
      var target = cands[i].toLowerCase();
      for (var j = 0; j < norm.length; j++) if (norm[j].t === target) return norm[j].id;
    }
    return null;
  }
  function contains(sub) {
    var s = sub.toLowerCase();
    for (var j = 0; j < norm.length; j++) if (norm[j].t.indexOf(s) !== -1) return norm[j].id;
    return null;
  }
  function pred(fn) {
    for (var j = 0; j < norm.length; j++) if (fn(norm[j].t)) return norm[j].id;
    return null;
  }
  function need(id, label) {
    if (!id) throw new Error('Column "' + label + '" not found on ' + teamName + ' sheet.');
    return id;
  }
  return {
    customer:        need(exact(['Directing Customer', 'Primary Customer']) || contains('customer'), 'Directing/Primary Customer'),
    escrowFees:      need(exact(['Escrow Fees']) || pred(function (t) { return t.indexOf('escrow') !== -1 && t.indexOf('fee') !== -1; }), 'Escrow Fees'),
    actualCoe:       need(exact(['Actual COE']) || pred(function (t) { return t.indexOf('actual') !== -1 && t.indexOf('coe') !== -1; }), 'Actual COE'),
    fileStatus:      exact(['File Status']) || contains('status'),
    salesRep:        exact(['Sales Rep']) || contains('sales rep'),
    propertyAddress: exact(['Property Address']) || contains('property address') || contains('address'),
    escrowNumber:    exact(['Escrow #', 'Escrow Number']) || pred(function (t) { return t.indexOf('escrow') !== -1 && t.indexOf('#') !== -1; })
  };
}

/*************************** PARSERS / FORMATTERS ***************************/
function cellVal_(cellById, columnId) {
  if (!columnId) return '';
  var c = cellById[columnId];
  if (!c) return '';
  if (c.value !== undefined && c.value !== null && c.value !== '') return c.value;
  return c.displayValue !== undefined ? c.displayValue : '';
}
function parseMoney_(v) {
  if (v === null || v === undefined || v === '') return 0;
  if (typeof v === 'number') return v;
  var n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
}
function parseDate_(v) {
  if (!v) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v;
  var s = String(v).trim();
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s = s + 'T12:00:00';
  var d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}
function fmtDate_(d)     { return Utilities.formatDate(d, CONFIG.timezone, 'MMM d, yyyy'); }
function fmtDateTime_(d) { return Utilities.formatDate(d, CONFIG.timezone, "MMM d, yyyy 'at' h:mm a"); }
function fmtRange_(a, b) { return fmtDate_(a) + '  \u2013  ' + fmtDate_(b); }

/*************************** HTML ***************************/
function getHtml_(payload) {
  var payloadJson = JSON.stringify(payload);
  return '' +
'<!DOCTYPE html><html><head><meta charset="utf-8">' +
'<style>' +
/* ---- THEME TOKENS (default = dark) ---- */
':root{' +
'--bg:#0e1116;--card:#161a20;--thead:#12161c;--ink:#e6e9ee;--ink2:#c3c9d2;--muted:#8a93a0;--faint:#616b78;' +
'--line:#232a33;--line2:#1b2129;--accent:#34d399;--accent-ink:#0b0e12;--accent-soft:rgba(52,211,153,.14);' +
'--track:#222b35;--shadow:0 1px 2px rgba(0,0,0,.45);}' +
'body.light{' +
'--bg:#f5f6f8;--card:#ffffff;--thead:#fbfcfd;--ink:#1f2937;--ink2:#374151;--muted:#6b7280;--faint:#9ca3af;' +
'--line:#e6e8eb;--line2:#eef0f2;--accent:#059669;--accent-ink:#ffffff;--accent-soft:#ecfdf5;' +
'--track:#eef1f4;--shadow:0 1px 2px rgba(16,24,40,.04),0 1px 3px rgba(16,24,40,.06);}' +
'*{box-sizing:border-box}' +
'body{margin:0;background:var(--bg);color:var(--ink);transition:background-color .2s,color .2s;' +
'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.45;-webkit-font-smoothing:antialiased}' +
'.wrap{max-width:1160px;margin:0 auto;padding:22px 20px 60px}' +
'.lbl{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600}' +
'.mono{font-variant-numeric:tabular-nums}' +
'.head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px}' +
'.head h1{margin:0;font-size:21px;font-weight:700;letter-spacing:-.01em}' +
'.head .sub{margin-top:3px;color:var(--muted);font-size:12.5px}' +
'.head .range{color:var(--ink2);font-weight:600}' +
'.hbtns{display:flex;gap:8px}' +
'.btn{border:1px solid var(--line);background:var(--card);color:var(--ink2);border-radius:8px;padding:8px 12px;font-size:13px;font-weight:600;cursor:pointer}' +
'.btn:hover{border-color:var(--accent)}' +
'.btn:disabled{opacity:.55;cursor:default}' +
'.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}' +
'.kpi{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 15px;box-shadow:var(--shadow)}' +
'.kpi .v{font-size:24px;font-weight:700;margin-top:6px;letter-spacing:-.01em}' +
'.kpi .s{font-size:12px;color:var(--muted);margin-top:2px}' +
'.kpi.accent{border-left:3px solid var(--accent)}' +
'.bar{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:14px}' +
'.seg{display:inline-flex;background:var(--card);border:1px solid var(--line);border-radius:9px;padding:3px}' +
'.seg button{border:0;background:transparent;color:var(--ink2);font-weight:600;font-size:12.5px;padding:6px 13px;border-radius:7px;cursor:pointer;white-space:nowrap}' +
'.seg button.on{background:var(--accent);color:var(--accent-ink)}' +
'.grow{flex:1 1 200px}' +
'.search{width:100%;border:1px solid var(--line);border-radius:9px;padding:9px 12px;font-size:13.5px;background:var(--card);color:var(--ink)}' +
'.search:focus{outline:none;border-color:var(--accent)}' +
'.count{color:var(--muted);font-size:12.5px;white-space:nowrap}' +
'.link{background:none;border:0;color:var(--ink2);font-weight:600;font-size:12.5px;cursor:pointer;text-decoration:underline}' +
'.card{background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);overflow:hidden}' +
'table{width:100%;border-collapse:collapse}' +
'thead th{position:sticky;top:0;background:var(--thead);border-bottom:1px solid var(--line);text-align:left;padding:11px 14px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);font-weight:600;cursor:pointer;user-select:none;white-space:nowrap}' +
'thead th .ar{color:var(--faint);margin-left:4px;font-size:10px}' +
'thead th.on{color:var(--ink)}' +
'thead th.num,tbody td.num{text-align:right}' +
'tbody td{padding:11px 14px;border-bottom:1px solid var(--line2);font-size:13.5px;color:var(--ink2)}' +
'tbody tr:last-child td{border-bottom:0}' +
'tbody tr{cursor:pointer}' +
'tbody tr:hover{background:var(--accent-soft)}' +
'.rk{color:var(--faint);font-variant-numeric:tabular-nums;width:44px}' +
'.nm{font-weight:600;color:var(--ink)}' +
'.pctcell{min-width:150px}' +
'.pctrow{display:flex;align-items:center;gap:9px;justify-content:flex-end}' +
'.bartrack{flex:1;height:6px;background:var(--track);border-radius:99px;overflow:hidden;max-width:110px}' +
'.barfill{height:100%;background:var(--accent);border-radius:99px}' +
'.pctval{width:52px;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink)}' +
'.empty{padding:34px;text-align:center;color:var(--muted)}' +
'.detail{margin-top:16px;background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);display:none}' +
'.detail.show{display:block}' +
'.dhead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px 18px;border-bottom:1px solid var(--line)}' +
'.dhead h2{margin:0;font-size:17px;font-weight:700}' +
'.dhead .who{margin-top:4px;color:var(--muted);font-size:12.5px}' +
'.badge{display:inline-block;background:var(--accent-soft);color:var(--accent);border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;letter-spacing:.03em;margin-left:8px}' +
'.dstats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border-bottom:1px solid var(--line)}' +
'.dstat{padding:13px 18px;border-right:1px solid var(--line2)}' +
'.dstat:last-child{border-right:0}' +
'.dstat .v{font-size:18px;font-weight:700;margin-top:4px}' +
'.dteam{display:flex;gap:8px;flex-wrap:wrap;padding:13px 18px;border-bottom:1px solid var(--line2)}' +
'.chip{border:1px solid var(--line);border-radius:8px;padding:6px 11px;font-size:12.5px}' +
'.chip b{font-weight:700;color:var(--ink)}' +
'.chip .cl{color:var(--muted);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;display:block}' +
'.dfiles{max-height:340px;overflow:auto}' +
'.dfiles th{font-size:10.5px}' +
'.x{background:none;border:1px solid var(--line);border-radius:8px;width:30px;height:30px;cursor:pointer;color:var(--muted);font-size:16px;line-height:1}' +
'@media(max-width:820px){.kpis{grid-template-columns:repeat(2,1fr)}.dstats{grid-template-columns:1fr}.dstat{border-right:0;border-bottom:1px solid var(--line2)}.addr-h,.addr{display:none}}' +
'</style></head><body>' +
'<div class="wrap">' +
  '<div class="head">' +
    '<div><h1 id="title"></h1><div class="sub"><span class="range" id="range"></span> &nbsp;\u2022&nbsp; Updated <span id="gen"></span></div></div>' +
    '<div class="hbtns"><button class="btn" id="themeBtn"></button><button class="btn" id="refresh">\u21bb Refresh data</button></div>' +
  '</div>' +
  '<div class="kpis" id="kpis"></div>' +
  '<div class="bar">' +
    '<div class="seg" id="segWindow"><button data-w="365" class="on">365-Day</button><button data-w="ytd">YTD</button></div>' +
    '<div class="seg" id="segScope"><button data-s="top20" class="on">Top 20</button><button data-s="all">All Clients</button></div>' +
    '<div class="grow"><input id="search" class="search" placeholder="Search directing customer\u2026" autocomplete="off"></div>' +
    '<span class="count" id="count"></span>' +
    '<button class="link" id="exportBtn">Export view (CSV)</button>' +
  '</div>' +
  '<div class="card"><table>' +
    '<thead><tr>' +
      '<th class="rk" data-k="rank"># <span class="ar"></span></th>' +
      '<th data-k="name">Directing Customer <span class="ar"></span></th>' +
      '<th data-k="team">Team <span class="ar"></span></th>' +
      '<th data-k="rep">Sales Rep <span class="ar"></span></th>' +
      '<th class="num" data-k="sum">Escrow Fees <span class="ar"></span></th>' +
      '<th class="num" data-k="pct">% of Revenue <span class="ar"></span></th>' +
    '</tr></thead><tbody id="rows"></tbody>' +
  '</table><div class="empty" id="empty" style="display:none">No matching clients.</div></div>' +
  '<div class="detail" id="detail"></div>' +
'</div>' +
'<script>' +
'var DATA = ' + payloadJson + ';' +
'var state={window:"365",scope:"top20",sortKey:"pct",sortDir:"desc",search:"",theme:"dark"};' +
'var usd=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});' +
'var usd2=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});' +
'function pct(x){return (x*100).toFixed(2)+"%";}' +
'function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c];});}' +
'function win(){return DATA.windows[state.window];}' +
'var STR={name:1,team:1,rep:1};' +

'function applyTheme(t){state.theme=t;if(t==="light"){document.body.classList.add("light");}else{document.body.classList.remove("light");}' +
  'var b=document.getElementById("themeBtn");if(b)b.textContent=(t==="light")?"\u263e Dark":"\u2600 Light";' +
  'try{localStorage.setItem("fse_theme",t);}catch(e){}}' +

'function renderHead(){document.getElementById("title").textContent=DATA.title;' +
  'document.getElementById("gen").textContent=DATA.generatedAt;' +
  'document.getElementById("range").textContent=win().label+": "+win().range;}' +

'function renderKpis(){var w=win();var top=w.clients[0];var html="";' +
  'html+=kpi("Total Escrow Fees",usd.format(w.total),w.label+" \u2022 closed",true);' +
  'html+=kpi("Clients",String(w.clientCount),"with closed revenue",false);' +
  'html+=kpi("Files Closed",String(w.fileCount),"in window",false);' +
  'html+=kpi("Top Client",top?esc(top.name):"\u2014",top?pct(top.pct)+" of revenue":"",false);' +
  'document.getElementById("kpis").innerHTML=html;}' +
'function kpi(l,v,s,a){return \'<div class="kpi\'+(a?" accent":"")+\'"><div class="lbl">\'+l+\'</div><div class="v">\'+v+\'</div><div class="s">\'+esc(s)+\'</div></div>\';}' +

'function currentRows(){var w=win();var list=w.clients.slice();' +
  'if(state.scope==="top20"){list=list.filter(function(c){return c.rank<=20;});}' +
  'if(state.search){var q=state.search.toLowerCase();list=list.filter(function(c){return c.name.toLowerCase().indexOf(q)!==-1||(c.rep||"").toLowerCase().indexOf(q)!==-1;});}' +
  'var k=state.sortKey,dir=state.sortDir==="asc"?1:-1;' +
  'list.sort(function(a,b){var av,bv;if(STR[k]){av=(a[k]||"").toLowerCase();bv=(b[k]||"").toLowerCase();return av<bv?-1*dir:av>bv?1*dir:0;}av=a[k];bv=b[k];return (av-bv)*dir;});' +
  'return list;}' +

'function renderTable(){var list=currentRows();var w=win();var maxPct=0;' +
  'list.forEach(function(c){if(c.pct>maxPct)maxPct=c.pct;});if(maxPct===0)maxPct=1;' +
  'var html="";list.forEach(function(c){var bw=Math.max(3,Math.round((c.pct/maxPct)*100));' +
    'html+=\'<tr data-key="\'+esc(c.name.toLowerCase())+\'">\'+' +
      '\'<td class="rk mono">\'+c.rank+\'</td>\'+' +
      '\'<td class="nm">\'+esc(c.name)+\'</td>\'+' +
      '\'<td>\'+esc(c.team||"\u2014")+\'</td>\'+' +
      '\'<td>\'+esc(c.rep||"\u2014")+\'</td>\'+' +
      '\'<td class="num mono">\'+usd.format(c.sum)+\'</td>\'+' +
      '\'<td class="num pctcell"><div class="pctrow"><div class="bartrack"><div class="barfill" style="width:\'+bw+\'%"></div></div><span class="pctval">\'+pct(c.pct)+\'</span></div></td></tr>\';});' +
  'document.getElementById("rows").innerHTML=html;' +
  'document.getElementById("empty").style.display=list.length?"none":"block";' +
  'document.getElementById("count").textContent=list.length+" of "+w.clientCount+" clients";' +
  'updateSortIndicators();bindRowClicks(w);}' +

'function updateSortIndicators(){document.querySelectorAll("thead th").forEach(function(th){' +
  'var k=th.getAttribute("data-k");var ar=th.querySelector(".ar");' +
  'if(k===state.sortKey){th.classList.add("on");ar.textContent=state.sortDir==="asc"?"\u25b2":"\u25bc";}' +
  'else{th.classList.remove("on");ar.textContent="";}});}' +

'function bindRowClicks(w){document.querySelectorAll("#rows tr").forEach(function(tr){tr.onclick=function(){' +
  'var key=tr.getAttribute("data-key");var c=w.clients.filter(function(x){return x.name.toLowerCase()===key;})[0];if(c)showDetail(c,w);};});}' +

'function showDetail(c,w){var d=document.getElementById("detail");var teams=DATA.teams;' +
  'var chips="";teams.forEach(function(t){var v=c.byTeam[t]||0;if(v>0)chips+=\'<div class="chip"><span class="cl">\'+esc(t)+\'</span><b>\'+usd.format(v)+\'</b></div>\';});' +
  'var files="";c.files.forEach(function(f){files+=\'<tr>\'+' +
    '\'<td class="mono" style="white-space:nowrap">\'+esc(f.date)+\'</td>\'+' +
    '\'<td class="mono">\'+esc(f.escrow||"\u2014")+\'</td>\'+' +
    '\'<td class="addr">\'+esc(f.address||"\u2014")+\'</td>\'+' +
    '\'<td>\'+esc(f.team)+\'</td>\'+' +
    '\'<td>\'+esc(f.rep||"\u2014")+\'</td>\'+' +
    '\'<td class="num mono">\'+usd2.format(f.fee)+\'</td></tr>\';});' +
  'd.innerHTML=\'<div class="dhead"><div><h2>\'+esc(c.name)+\'<span class="badge">RANK #\'+c.rank+\' \u2022 \'+w.label+\'</span></h2>\'+' +
      '\'<div class="who">Most recent: \'+esc(c.team||"\u2014")+\' \u2022 \'+esc(c.rep||"\u2014")+\'</div></div>\'+' +
      '\'<button class="x" id="closeDetail">\u00d7</button></div>\'+' +
    '\'<div class="dstats">\'+' +
      '\'<div class="dstat"><div class="lbl">Total Escrow Fees</div><div class="v">\'+usd.format(c.sum)+\'</div></div>\'+' +
      '\'<div class="dstat"><div class="lbl">% of Revenue</div><div class="v">\'+pct(c.pct)+\'</div></div>\'+' +
      '\'<div class="dstat"><div class="lbl">Files Closed</div><div class="v">\'+c.fileCount+\'</div></div></div>\'+' +
    '\'<div class="dteam">\'+chips+\'</div>\'+' +
    '\'<div class="dfiles"><table><thead><tr><th>Close Date</th><th>Escrow #</th><th class="addr-h">Property Address</th><th>Team</th><th>Sales Rep</th><th class="num">Fee</th></tr></thead><tbody>\'+files+\'</tbody></table></div>\';' +
  'd.classList.add("show");' +
  'document.getElementById("closeDetail").onclick=function(){d.classList.remove("show");};' +
  'd.scrollIntoView({behavior:"smooth",block:"nearest"});}' +

'function exportCsv(){var list=currentRows();var rows=[["Rank","Directing Customer","Team","Sales Rep","Escrow Fees","% of Revenue"]];' +
  'list.forEach(function(c){rows.push([c.rank,c.name,c.team,c.rep,c.sum.toFixed(2),(c.pct*100).toFixed(4)+"%"]);});' +
  'var csv=rows.map(function(r){return r.map(function(x){var s=String(x==null?"":x);return /[",\\n]/.test(s)?\'"\'+s.replace(/"/g,\'""\')+\'"\':s;}).join(",");}).join("\\n");' +
  'var blob=new Blob([csv],{type:"text/csv"});var a=document.createElement("a");' +
  'a.href=URL.createObjectURL(blob);a.download="FSE_"+state.window+"_"+state.scope+".csv";a.click();}' +

'function renderAll(){renderHead();renderKpis();renderTable();document.getElementById("detail").classList.remove("show");}' +

'document.getElementById("segWindow").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;state.window=b.getAttribute("data-w");setSeg("segWindow",b);renderAll();});' +
'document.getElementById("segScope").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;state.scope=b.getAttribute("data-s");setSeg("segScope",b);renderTable();});' +
'function setSeg(id,btn){document.querySelectorAll("#"+id+" button").forEach(function(x){x.classList.remove("on");});btn.classList.add("on");}' +
'document.querySelectorAll("thead th").forEach(function(th){th.addEventListener("click",function(){var k=th.getAttribute("data-k");' +
  'if(state.sortKey===k){state.sortDir=state.sortDir==="asc"?"desc":"asc";}else{state.sortKey=k;state.sortDir=STR[k]?"asc":"desc";}renderTable();});});' +
'document.getElementById("search").addEventListener("input",function(e){state.search=e.target.value.trim();renderTable();});' +
'document.getElementById("exportBtn").addEventListener("click",exportCsv);' +
'document.getElementById("themeBtn").addEventListener("click",function(){applyTheme(state.theme==="light"?"dark":"light");});' +
'document.getElementById("refresh").addEventListener("click",function(){var btn=this;btn.disabled=true;btn.textContent="\u21bb Refreshing\u2026";' +
  'google.script.run.withSuccessHandler(function(p){DATA=p;renderAll();btn.disabled=false;btn.textContent="\u21bb Refresh data";})' +
  '.withFailureHandler(function(err){alert("Refresh failed: "+err.message);btn.disabled=false;btn.textContent="\u21bb Refresh data";}).getDashboardData();});' +

'var saved="dark";try{saved=localStorage.getItem("fse_theme")||"dark";}catch(e){}applyTheme(saved==="light"?"light":"dark");' +
'renderAll();' +
'</script></body></html>';
}
