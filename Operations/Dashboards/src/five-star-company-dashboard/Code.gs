/**
 * Five Star Revenue Dashboard — company view, served by Apps Script. Light/dark toggle.
 *   <exec-url>              -> dashboard
 *   add ?format=json        -> raw JSON
 *
 * DATA SOURCE: the team sheets in TEAM_SHEETS (all files, open + closed), aggregated in code.
 *   All date buckets (today / yesterday / MTD opens, closed MTD), Projected Fees, and the
 *   Gross Fees by Month chart are computed here from the team-sheet records, so MTD is
 *   always the current calendar month and the Projected tiles agree with the chart.
 *
 * ACCESS: gated by the deployment's "anyone in the Workspace" setting. No in-app key.
 * SCRIPT PROPERTIES:  SMARTSHEET_TOKEN = your Smartsheet API token
 */

var TEAM_SHEETS = [
  { label: 'JD Unit', sheet: '6403198558359428' },
  { label: 'Team 3',  sheet: '339384860993412'  },
  { label: 'Team 5',  sheet: '8144815540987780' },
  { label: 'Team 7',  sheet: '307047045588868'  },
  { label: 'Team 9',  sheet: '2609780876437380' }
];

var COL = {
  file:'Escrow #', property:'Property Address', client:'Directing Customer',
  salesRep:'Sales Rep', type:'Type', openDate:'Open Date', coe:'Actual COE',
  projDate:'Projected COE', status:'File Status', fees:'Escrow Fees'
};
var CANCELED = 'canceled';        // File Status value marking a dead file (lowercased)
var EXCLUDE_CANCELED = true;

var PORTAL = {
  today:     'https://sites.google.com/brettward.net/fivestarportal/home/opened-today?authuser=0',
  yesterday: 'https://sites.google.com/brettward.net/fivestarportal/home/opened-yesterday?authuser=0',
  mtd:       'https://sites.google.com/brettward.net/fivestarportal/home/opened-month-to-date?authuser=0'
};

function doGet(e) {
  var props = PropertiesService.getScriptProperties();
  var wantJson = !!(e && e.parameter && e.parameter.format === 'json');
  var selfUrl = ScriptApp.getService().getUrl();
  var token = props.getProperty('SMARTSHEET_TOKEN');
  if (!token) return wantJson ? out({ error: 'Missing SMARTSHEET_TOKEN' }) : page('Setup needed', 'Missing SMARTSHEET_TOKEN script property.');
  try {
    var m = buildModel(token);
    if (wantJson) return out({ files: m.files.length, asOf: m.ctx.today });
    return HtmlService.createHtmlOutput(renderDashboard(m, selfUrl))
      .setTitle('Five Star Revenue Dashboard')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return wantJson ? out({ error: String(err) }) : page('Error', String(err));
  }
}

/* ---------- fetch + parse ---------- */

function fetchSheet(id, token) {
  try {
    var res = UrlFetchApp.fetch('https://api.smartsheet.com/2.0/sheets/' + id, { method: 'get', headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
    if (res.getResponseCode() !== 200) return null;
    return JSON.parse(res.getContentText());
  } catch (e) { return null; }
}
function columnMap(r) { var m = {}; (r.columns || []).forEach(function (c) { var id = (c.virtualId != null ? c.virtualId : c.id); m[id] = c.title; }); return m; }
function rowObj(row, cm) { var o = {}; (row.cells || []).forEach(function (c) { var id = (c.virtualColumnId != null ? c.virtualColumnId : c.columnId); var t = cm[id]; if (t) o[t] = { v: c.value, d: c.displayValue }; }); return o; }
function gd(o, t) { var c = lookup(o, t); return c ? (c.d != null ? c.d : (c.v != null ? String(c.v) : '')) : ''; }
function gv(o, t) { var c = lookup(o, t); return c ? (c.v != null ? c.v : (c.d != null ? c.d : '')) : ''; }
function lookup(o, t) {
  if (o[t] != null) return o[t];
  var keys = Object.keys(o), w = t.toLowerCase(), i;
  for (i = 0; i < keys.length; i++) if (keys[i].toLowerCase() === w) return o[keys[i]];
  for (i = 0; i < keys.length; i++) if (keys[i].toLowerCase().indexOf(w) !== -1) return o[keys[i]];
  return null;
}
function num(x) { if (x == null) return 0; if (typeof x === 'number') return x; var n = parseFloat(String(x).replace(/[$,]/g, '')); return isNaN(n) ? 0 : n; }
function isoDate(v) { var s = String(v == null ? '' : v); return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.substring(0, 10) : ''; }

function buildFiles(token) {
  var files = [];
  TEAM_SHEETS.forEach(function (t) {
    var grid = fetchSheet(t.sheet, token);
    if (!grid) return;
    var cm = columnMap(grid);
    (grid.rows || []).forEach(function (r) {
      var o = rowObj(r, cm);
      var status = gd(o, COL.status);
      var canceled = String(status).trim().toLowerCase() === CANCELED;
      var coe = isoDate(gv(o, COL.coe));
      files.push({
        team: t.label,
        file: gd(o, COL.file),
        property: gd(o, COL.property),
        client: gd(o, COL.client),
        type: gd(o, COL.type),
        openDate: isoDate(gv(o, COL.openDate)),
        coe: coe,
        projDate: isoDate(gv(o, COL.projDate)),
        status: status,
        canceled: canceled,
        closed: !!coe,
        open: !coe && !canceled,
        fees: num(gv(o, COL.fees))
      });
    });
  });
  return files;
}

/* ---------- date context ---------- */

function dateContext(tz) {
  var now = new Date();
  var todayISO = Utilities.formatDate(now, tz, 'yyyy-MM-dd');
  var p = todayISO.split('-'), Y = +p[0], M = +p[1], D = +p[2];
  var monthLast = new Date(Date.UTC(Y, M, 0)).getUTCDate();
  var t12 = new Date(Date.UTC(Y, M - 1, D)); t12.setUTCMonth(t12.getUTCMonth() - 12);
  var keys = [];
  for (var i = 11; i >= 0; i--) { var d = new Date(Date.UTC(Y, M - 1, 1)); d.setUTCMonth(d.getUTCMonth() - i); keys.push(Utilities.formatDate(d, 'UTC', 'yyyy-MM')); }
  return {
    today: todayISO,
    ym: Utilities.formatDate(now, tz, 'yyyy-MM'),
    monthStart: Y + '-' + pad(M) + '-01', monthEnd: Y + '-' + pad(M) + '-' + pad(monthLast),
    t12mStart: Utilities.formatDate(t12, 'UTC', 'yyyy-MM-dd'),
    monthKeys: keys, nowYear: Y, nowMonth: M
  };
}

/* ---------- model ---------- */

function buildModel(token) {
  var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
  var now = new Date();
  var ctx = dateContext(tz);
  var yISO = Utilities.formatDate(new Date(now.getTime() - 864e5), tz, 'yyyy-MM-dd');
  var ym = ctx.ym;

  var files = buildFiles(token);
  var active = files.filter(function (f) { return !EXCLUDE_CANCELED || !f.canceled; });

  var openedToday = active.filter(function (f) { return f.openDate === ctx.today; }).sort(byFeesDesc);
  var openedYest  = active.filter(function (f) { return f.openDate === yISO; }).sort(byFeesDesc);
  var openedMTD   = active.filter(function (f) { return f.openDate.substring(0, 7) === ym; });
  var closedMTD   = active.filter(function (f) { return f.coe.substring(0, 7) === ym; });

  var byDay = {};
  openedMTD.forEach(function (f) { var d = f.openDate; if (!d) return; if (!byDay[d]) byDay[d] = { date: d, count: 0, fees: 0 }; byDay[d].count++; byDay[d].fees += f.fees; });
  var daily = Object.keys(byDay).map(function (k) { byDay[k].label = labelFromISO(k, false); return byDay[k]; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; });

  var projected = computeProjected(files, ctx);

  return {
    ctx: ctx, files: files, yestLabel: labelFromISO(yISO, true), todayLabel: labelFromISO(ctx.today, true),
    headerDate: Utilities.formatDate(now, tz, 'EEEE, MMMM d, yyyy'),
    monthLabel: Utilities.formatDate(now, tz, 'MMMM yyyy'),
    updated: Utilities.formatDate(now, tz, 'MMM d, h:mm a'),
    today:     { rows: openedToday, count: openedToday.length, fees: sumFees(openedToday) },
    yesterday: { rows: openedYest,  count: openedYest.length,  fees: sumFees(openedYest) },
    openedMTD: { count: openedMTD.length, fees: sumFees(openedMTD) },
    closedMTD: { count: closedMTD.length, fees: sumFees(closedMTD) },
    daily: daily, projected: projected
  };
}

function byFeesDesc(a, b) { return b.fees - a.fees; }
function sumFees(rows) { return rows.reduce(function (s, r) { return s + r.fees; }, 0); }
function teamsLabel(obj) { var ks = Object.keys(obj); return ks.length === 1 ? ks[0] : (ks.length > 1 ? 'Multiple' : ''); }

// Projected Fees — computed from records, the SAME rule as the Gross Fees by Month chart's
// current-month bar: banked (Actual COE this month) + open pipeline (Projected COE this
// month). Guarantees the tiles and the chart agree; company = every team in TEAM_SHEETS.
function computeProjected(files, ctx) {
  var ym = ctx.today.substring(0, 7);
  function proj(pred) {
    var tot = 0;
    files.forEach(function (r) {
      if (r.canceled || !pred(r)) return;
      if (r.closed) { if (r.coe.substring(0, 7) === ym) tot += r.fees; }
      else if (r.projDate && r.projDate.substring(0, 7) === ym) tot += r.fees;
    });
    return tot;
  }
  var teams = {};
  TEAM_SHEETS.forEach(function (t) {
    teams[t.label] = proj(function (r) { return r.team === t.label; });
  });
  return { found: true,
    company: proj(function () { return true; }),
    teams: teams };
}

/* ---------- render ---------- */

function renderDashboard(m, selfUrl) {
  var kpi = function (label, val, sub, cls) { return '<div class="kpi"><div class="kdot ' + cls + '"></div><div class="klabel">' + esc(label) + '</div><div class="kval">' + val + '</div><div class="ksub">' + esc(sub) + '</div></div>'; };
  var kpis =
    kpi('Closed MTD', money(m.closedMTD.fees), m.closedMTD.count + ' file' + (m.closedMTD.count === 1 ? '' : 's'), 'e') +
    kpi('Opened MTD', money(m.openedMTD.fees), m.openedMTD.count + ' file' + (m.openedMTD.count === 1 ? '' : 's'), 's') +
    kpi('Opened Today', money(m.today.fees), m.today.count + ' file' + (m.today.count === 1 ? '' : 's'), 'a') +
    kpi('Opened Yesterday', money(m.yesterday.fees), m.yesterday.count + ' file' + (m.yesterday.count === 1 ? '' : 's'), 'i');

  var topRows = topClients(m, 20);

  var themeInit = '<script>(function(){try{var t=localStorage.getItem("briefTheme")||"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();</script>';
  var themeToggle = '<script>(function(){var b=document.getElementById("themeBtn");function lbl(){if(b)b.textContent=document.documentElement.getAttribute("data-theme")==="light"?"\u263e Dark":"\u2600 Light";}lbl();if(b)b.addEventListener("click",function(){var n=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",n);try{localStorage.setItem("briefTheme",n);}catch(e){}lbl();});})();</script>';

  return css() + themeInit + '<div class="wrap">' +
    '<div class="top"><div><h1 class="h1"><span class="star">\u2605</span>Five Star Revenue Dashboard</h1><div class="sub">' + esc(m.headerDate) + ' \u00b7 Five Star Escrow</div></div>' +
    '<div class="actions"><button id="themeBtn" class="btn" type="button">\u2600 Light</button><a class="btn" href="' + esc(selfUrl) + '" target="_top">\u21bb Refresh</a></div></div>' +

    projectedCard(m.projected, m.monthLabel) +
    '<div class="kpis">' + kpis + '</div>' +

    '<div class="card">' + sectionHead('Gross Fees by Month', 'banked vs projected', '') + grossByMonthInner(m) + '</div>' +
    '<div class="card">' + sectionHead('MTD Daily Opens', '', m.openedMTD.count + ' files', PORTAL.mtd) + dailyBars(m.daily) + '</div>' +

    collapsible('Opened Today', m.todayLabel, m.today.count, PORTAL.today, opensTable(m.today.rows, 'Nothing posted as opened yet \u2014 fills in as files open during the day.')) +
    collapsible('Opened Yesterday', m.yestLabel, m.yesterday.count, PORTAL.yesterday, opensTable(m.yesterday.rows, 'No files were posted as opened.')) +
    collapsible('Top 20 Clients', 'by closed fees \u00b7 last 12 months', topRows.length, '', topClientsTable(topRows)) +

    '<div class="card">' + sectionHead('Client Lookup', 'type to search \u00b7 trailing 12 months', '') + clientLookupInner(m) + '</div>' +

    '<div class="foot">Live from Smartsheet team sheets \u00b7 ' + esc(String(m.files.length)) + ' files \u00b7 updated ' + esc(m.updated) + '</div></div>' + themeToggle;
}

function sectionHead(title, note, count, href) {
  var pill = (count === '' || count == null) ? '' : '<span class="pill">' + esc(String(count)) + '</span>';
  return '<div class="shead"><div class="stitle"><h2>' + esc(title) + '</h2>' + (note ? '<span class="snote">\u00b7 ' + esc(note) + '</span>' : '') + '</div><div class="sright">' + pill + (href ? '<a class="portal" href="' + esc(href) + '" target="_blank" rel="noreferrer">Portal \u2197</a>' : '') + '</div></div>';
}

function collapsible(title, note, count, href, body) {
  var link = href ? '<a class="portal" href="' + esc(href) + '" target="_blank" rel="noreferrer" onclick="event.stopPropagation()">Portal \u2197</a>' : '';
  return '<details class="card csec">' +
    '<summary class="shead"><div class="stitle"><span class="chev">\u25b6</span><h2>' + esc(title) + '</h2>' + (note ? '<span class="snote">\u00b7 ' + esc(note) + '</span>' : '') + '</div>' +
    '<div class="sright"><span class="pill">' + esc(String(count)) + '</span>' + link + '</div></summary>' +
    '<div class="cbody">' + body + '</div></details>';
}

// Opened tables: no cents, no sales rep, "Client" header.
function opensTable(rows, emptyMsg) {
  if (!rows.length) return '<p class="empty">' + esc(emptyMsg || 'Nothing yet.') + '</p>';
  var body = rows.map(function (r) {
    return '<tr><td class="mono">' + esc(r.file) + '</td><td>' + esc(r.property) + '</td><td class="num money">' + money(r.fees) + '</td><td class="muted">' + esc(r.team) + '</td><td class="muted">' + esc(r.client) + '</td></tr>';
  }).join('');
  return '<div class="scroll"><table><thead><tr><th>File</th><th>Property</th><th class="num">Fees</th><th>Team</th><th>Client</th></tr></thead><tbody>' + body + '</tbody></table></div>';
}

// Top clients — team rules: ranked by closed fees over trailing 12 mo, with counts. + Team column.
function topClients(m, n) {
  var from = m.ctx.t12mStart, to = m.ctx.today, byAcct = {};
  function slot(a) { return byAcct[a] || (byAcct[a] = { account: a, fees: 0, closed: 0, opened: 0, inEscrow: 0, teams: {} }); }
  m.files.forEach(function (r) {
    var a = r.client || '(none)';
    if (r.closed && r.coe >= from && r.coe <= to) { var s = slot(a); s.fees += r.fees; s.closed++; s.teams[r.team] = 1; }
  });
  m.files.forEach(function (r) {
    var a = r.client || '(none)';
    if (!r.canceled && r.openDate >= from && r.openDate <= to) { var s = slot(a); s.opened++; s.teams[r.team] = 1; }
    if (r.open) { var s2 = slot(a); s2.inEscrow++; s2.teams[r.team] = 1; }
  });
  return Object.keys(byAcct).map(function (k) { var c = byAcct[k]; c.teamLabel = teamsLabel(c.teams); return c; })
    .sort(function (a, b) { return b.fees - a.fees; }).slice(0, n);
}
function topClientsTable(rows) {
  if (!rows.length) return '<p class="empty">No closed files in the last 12 months.</p>';
  var body = rows.map(function (r, i) {
    return '<tr><td class="rk">' + (i + 1) + '</td><td>' + esc(r.account) + '</td><td class="muted">' + esc(r.teamLabel) +
      '</td><td class="num money">' + money(r.fees) + '</td><td class="num muted">' + r.opened + '</td><td class="num">' + r.inEscrow + '</td><td class="num">' + r.closed + '</td></tr>';
  }).join('');
  return '<div class="scroll"><table class="rank"><thead><tr><th></th><th>Client</th><th>Team</th><th class="num">Closed Fees</th><th class="num">Opened</th><th class="num">In Escrow</th><th class="num">Closed</th></tr></thead><tbody>' + body + '</tbody></table></div>';
}

// Client lookup — team style: typeahead + detail panel, trailing 12 mo, + Team.
function clientLookupInner(m) {
  var from = m.ctx.t12mStart, to = m.ctx.today, data = {};
  function slot(a) { return data[a] || (data[a] = { account: a, opened: 0, inEscrow: 0, closed: 0, cancelled: 0, closedFees: 0, lastOpen: '', teams: {} }); }
  m.files.forEach(function (r) {
    var a = r.client || '(none)', s = slot(a);
    if (r.openDate > s.lastOpen) s.lastOpen = r.openDate;
    if (r.open) s.inEscrow++;
    s.teams[r.team] = 1;
    var oIn = r.openDate && r.openDate >= from && r.openDate <= to;
    var cIn = r.coe && r.coe >= from && r.coe <= to;
    if (r.canceled) { if (oIn) s.cancelled++; }
    else if (oIn) { s.opened++; }
    if (r.closed && cIn) { s.closed++; s.closedFees += r.fees; }
  });
  var keys = Object.keys(data).filter(function (k) { var d = data[k]; return d.opened || d.closed || d.cancelled || d.inEscrow; }).sort();
  if (!keys.length) return '<p class="empty">No client activity.</p>';
  var summary = {};
  keys.forEach(function (k) {
    var d = data[k];
    summary[k] = { team: teamsLabel(d.teams), opened: d.opened, inEscrow: d.inEscrow, closed: d.closed, cancelled: d.cancelled,
      closedFees: money(d.closedFees), avgFee: d.closed ? money(d.closedFees / d.closed) : '\u2014', lastOpen: d.lastOpen ? labelFromISO(d.lastOpen, false) : '\u2014' };
  });
  var json = JSON.stringify(summary).replace(/</g, '\\u003c');
  var uid = 'cl_' + Math.floor(Math.random() * 1e6);
  return '<input class="lookup" id="' + uid + '_q" type="text" autocomplete="off" placeholder="Type a client name\u2026">' +
    '<div id="' + uid + '_list" class="looklist"></div>' +
    '<div id="' + uid + '_out" class="lookout"><p class="empty">Start typing to find a client.</p></div>' +
    '<script>(function(){var D=' + json + ';var KEYS=Object.keys(D);' +
    'var q=document.getElementById("' + uid + '_q"),L=document.getElementById("' + uid + '_list"),o=document.getElementById("' + uid + '_out");' +
    'function cell(l,v){return \'<div class="kvc"><div class="kvl">\'+l+\'</div><div class="kvv">\'+v+\'</div></div>\';}' +
    'function detail(k){var d=D[k];o.innerHTML=\'<div class="lookname">\'+k+\'</div><div class="kv">\'+' +
    'cell("Team",d.team)+cell("Opened",d.opened)+cell("In Escrow",d.inEscrow)+cell("Closed",d.closed)+cell("Cancelled",d.cancelled)+' +
    'cell("Closed Fees (12 mo)",d.closedFees)+cell("Avg Fee / Closed",d.avgFee)+cell("Last Open",d.lastOpen)+\'</div>\';}' +
    'function render(){var t=q.value.trim().toLowerCase();L.innerHTML="";if(!t){return;}' +
    'var hits=KEYS.filter(function(k){return k.toLowerCase().indexOf(t)!==-1;}).slice(0,12);' +
    'if(!hits.length){L.innerHTML=\'<div class="lookrow muted">No match</div>\';return;}' +
    'hits.forEach(function(k){var row=document.createElement("div");row.className="lookrow";row.textContent=k;' +
    'row.addEventListener("click",function(){q.value=k;L.innerHTML="";detail(k);});L.appendChild(row);});}' +
    'q.addEventListener("input",render);})();</script>';
}

function projectedCard(p, monthLabel) {
  if (!p) return '';
  if (!p.found) return '<div class="card">' + sectionHead('Projected Fees', monthLabel, '\u2014') + '<p class="empty">No row found for ' + esc(monthLabel) + ' in the Gross Fees sheet.</p></div>';
  var stat = function (label, val) { return '<div class="stat"><div class="slabel">' + esc(label) + '</div><div class="sval">' + money(val) + '</div></div>'; };
  var teamStats = TEAM_SHEETS.map(function (t) { return stat(t.label, (p.teams && p.teams[t.label]) || 0); }).join('');
  return '<div class="card">' + sectionHead('Projected Fees', monthLabel, money(p.company)) +
    '<div class="stats">' + stat('Company Total', p.company) + teamStats + '</div>' +
    '<p class="hint">Banked so far this month + open pipeline projected to close this month. Matches the current-month bar in the chart above.</p></div>';
}

// Gross Fees by Month — stacked SVG (Closed banked + Open projected), trailing 12 + next month.
function grossByMonthInner(m) {
  var byM = {};
  function slot(k) { return byM[k] || (byM[k] = { closedFees: 0, openFees: 0, closedN: 0, openN: 0 }); }
  m.files.forEach(function (r) {
    if (r.canceled) return;
    if (r.closed) { if (!r.coe) return; var sc = slot(r.coe.substring(0, 7)); sc.closedFees += r.fees; sc.closedN++; }
    else { if (!r.projDate) return; var so = slot(r.projDate.substring(0, 7)); so.openFees += r.fees; so.openN++; }
  });
  var keys = m.ctx.monthKeys.slice();
  var curKey = m.ctx.today.substring(0, 7);
  var nm = m.ctx.nowMonth + 1, ny = m.ctx.nowYear; if (nm > 12) { nm = 1; ny++; }
  var nextKey = ny + '-' + (nm < 10 ? '0' + nm : nm);
  keys = keys.concat([nextKey]);
  var maxV = 1;
  keys.forEach(function (k) { var s = byM[k]; if (s) maxV = Math.max(maxV, s.closedFees + s.openFees); });

  var padL = 10, padR = 10, padTop = 18, chartH = 108, padBot = 34;
  var barW = 26, gap = 16, slot2 = barW + gap;
  var W = padL + keys.length * slot2 - gap + padR, H = padTop + chartH + padBot, baseY = padTop + chartH;

  var bars = keys.map(function (k, i) {
    var s = byM[k] || { closedFees: 0, openFees: 0 };
    var cF = s.closedFees, oF = s.openFees, tot = cF + oF, isCur = (k === curKey), isNext = (k === nextKey);
    var x = padL + i * slot2;
    var hC = Math.round(cF / maxV * chartH), hO = Math.round(oF / maxV * chartH);
    var yC = baseY - hC, yO = yC - hO;
    var lbl = monthLabel(k), mon = lbl.split(' ')[0], yr = "\u2019" + lbl.slice(-2);
    var tip = lbl + ' \u2014 Gross ' + money(tot) + '  (Closed ' + money(cF) + ' / Open ' + money(oF) + ')';
    var seg = '<title>' + esc(tip) + '</title>';
    if (hC > 0) seg += '<rect x="' + x + '" y="' + yC + '" width="' + barW + '" height="' + hC + '" rx="3" fill="var(--barC)"></rect>';
    if (hO > 0) seg += '<rect x="' + x + '" y="' + yO + '" width="' + barW + '" height="' + hO + '" rx="3" fill="var(--barO)"></rect>';
    var top = tot > 0 ? '<text x="' + (x + barW / 2) + '" y="' + (yO - 6) + '" text-anchor="middle" font-size="11" font-weight="700" fill="var(--head)">' + esc(moneyShort(tot)) + '</text>' : '';
    var hot = isCur || isNext;
    var ml = '<text x="' + (x + barW / 2) + '" y="' + (baseY + 15) + '" text-anchor="middle" font-size="11" font-weight="' + (hot ? '700' : '500') + '" fill="' + (hot ? 'var(--head)' : 'var(--muted)') + '">' + esc(mon) + '</text>' +
             '<text x="' + (x + barW / 2) + '" y="' + (baseY + 27) + '" text-anchor="middle" font-size="10" fill="var(--faint)">' + esc(yr) + (isCur ? ' \u25cf' : '') + '</text>';
    return '<g>' + seg + top + ml + '</g>';
  }).join('');

  var axis = '<line x1="' + padL + '" y1="' + baseY + '" x2="' + (W - padR) + '" y2="' + baseY + '" stroke="var(--border)" stroke-width="1"></line>';
  var svg = '<div class="scroll"><svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;min-width:' + Math.min(W, 620) + 'px;display:block" xmlns="http://www.w3.org/2000/svg">' + axis + bars + '</svg></div>';
  var legend = '<div class="glegend"><span><i class="sw c"></i>Closed (banked)</span><span><i class="sw o"></i>Open \u00b7 projected</span><span class="gnote">\u25cf current month</span></div>';
  var hint = '<p class="hint">Closed = Actual COE that month. Open = Projected COE that month. Last bar is next month (forecast).</p>';
  return legend + svg + hint;
}

function monthLabel(k) {
  var p = k.split('-'); if (p.length < 2) return k;
  var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return mon[(+p[1]) - 1] + ' ' + p[0];
}

function dailyBars(daily) {
  if (!daily.length) return '<p class="empty">No opens yet this month.</p>';
  var max = Math.max.apply(null, daily.map(function (d) { return d.fees; })) || 1;
  var bars = daily.map(function (d) {
    var h = Math.max(6, (d.fees / max) * 100);
    return '<div class="bcol"><div class="bval">' + money(d.fees) + '</div><div class="bar" style="height:' + h + '%" title="' + esc(d.label + ': ' + d.count + ' files') + '"></div><div class="blabel">' + esc(d.label) + '</div></div>';
  }).join('');
  return '<div class="bars daybars">' + bars + '</div>';
}

/* ---------- helpers ---------- */

function money(n) { n = Math.round(Number(n) || 0); var neg = n < 0; var s = String(Math.abs(n)), o = ''; while (s.length > 3) { o = ',' + s.slice(-3) + o; s = s.slice(0, -3); } return (neg ? '-$' : '$') + s + o; }
function moneyShort(n) { n = Math.round(Number(n) || 0); var neg = n < 0, a = Math.abs(n), s; if (a >= 1e6) { s = (a / 1e6).toFixed(a >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M'; } else if (a >= 1e3) { s = Math.round(a / 1e3) + 'k'; } else { s = String(a); } return (neg ? '-$' : '$') + s; }
function esc(s) { s = (s == null ? '' : String(s)); return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function labelFromISO(iso, wd) {
  var p = String(iso).split('-'); if (p.length < 3) return iso;
  var dt = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], wks = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return (wd ? wks[dt.getDay()] + ', ' : '') + mon[dt.getMonth()] + ' ' + dt.getDate();
}
function out(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function page(title, msg) { return HtmlService.createHtmlOutput('<div style="font-family:sans-serif;max-width:560px;margin:60px auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px"><h2>' + esc(title) + '</h2><p style="color:#94a3b8">' + esc(msg) + '</p></div>').setTitle(title); }

function css() {
  return '<style>' +
  ':root{--bg:#0f172a;--card:#1e293b;--border:#334155;--bd2:#28344a;--text:#e2e8f0;--head:#f1f5f9;--muted:#94a3b8;--faint:#64748b;--pill:#334155;--pilltext:#cbd5e1;--star:#fbbf24;--money:#34d399;--portal:#818cf8;--mono:#cbd5e1;--ki:#312e81;--ke:#064e3b;--ka:#78350f;--ks:#334155;--barO:#818cf8;--barC:#34d399}' +
  '[data-theme="light"]{--bg:#f8fafc;--card:#ffffff;--border:#e2e8f0;--bd2:#f1f5f9;--text:#334155;--head:#1e293b;--muted:#94a3b8;--faint:#94a3b8;--pill:#f1f5f9;--pilltext:#64748b;--star:#f59e0b;--money:#059669;--portal:#4f46e5;--mono:#334155;--ki:#eef2ff;--ke:#ecfdf5;--ka:#fffbeb;--ks:#f1f5f9;--barO:#6366f1;--barC:#059669}' +
  '*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
  '.wrap{max-width:960px;margin:0 auto;padding:20px}' +
  '.top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;gap:12px;flex-wrap:wrap}.actions{display:flex;gap:8px;align-items:center}' +
  '.h1{font-size:22px;font-weight:700;margin:0;display:flex;align-items:center;gap:8px;color:var(--head)}.star{color:var(--star)}' +
  '.sub{color:var(--muted);font-size:13px;margin-top:2px}' +
  '.btn{display:inline-flex;align-items:center;gap:6px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:13px;font-weight:600;color:var(--text);text-decoration:none;cursor:pointer}' +
  '.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}@media(max-width:640px){.kpis{grid-template-columns:repeat(2,1fr)}}' +
  '.kpi{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px}' +
  '.kdot{width:26px;height:26px;border-radius:8px;margin-bottom:8px}.kdot.i{background:var(--ki)}.kdot.e{background:var(--ke)}.kdot.a{background:var(--ka)}.kdot.s{background:var(--ks)}' +
  '.klabel{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600}.kval{font-size:20px;font-weight:700;margin-top:2px;color:var(--head)}.ksub{font-size:12px;color:var(--muted);margin-top:2px}' +
  '.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px;margin-bottom:16px}' +
  '.shead{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px}.stitle{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.stitle h2{font-size:16px;font-weight:600;margin:0;color:var(--head)}' +
  '.snote{font-size:12px;color:var(--muted)}.sright{display:flex;align-items:center;gap:8px}.pill{font-size:11px;color:var(--pilltext);background:var(--pill);border-radius:999px;padding:2px 8px}' +
  '.portal{font-size:12px;font-weight:600;color:var(--portal);text-decoration:none;white-space:nowrap}' +
  '.csec{padding:0}.csec>summary{list-style:none;cursor:pointer;padding:16px 18px;margin:0}.csec>summary::-webkit-details-marker{display:none}' +
  '.csec .cbody{padding:0 18px 18px}.csec>summary:hover{background:var(--bd2)}.chev{display:inline-block;transition:transform .15s;color:var(--portal);font-size:16px;line-height:1;font-weight:700}.csec[open] .chev{transform:rotate(90deg)}' +
  '.stats{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:12px}' +
  '@media(max-width:900px){.stats{grid-auto-flow:row;grid-template-columns:repeat(3,1fr)}}' +
  '@media(max-width:640px){.stats{grid-auto-flow:row;grid-template-columns:repeat(2,1fr)}}' +
  '.stat{background:var(--bd2);border:1px solid var(--border);border-radius:10px;padding:12px}' +
  '.slabel{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600}.sval{font-size:18px;font-weight:700;margin-top:4px;color:var(--money)}' +
  '.hint{font-size:12px;color:var(--faint);margin:10px 0 0}' +
  '.scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}' +
  'th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600;padding:6px 10px 6px 0;border-bottom:1px solid var(--border)}' +
  'td{padding:9px 10px 9px 0;border-bottom:1px solid var(--bd2)}.num{text-align:right}.money{font-weight:600;color:var(--money)}.mono{font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--mono)}.muted{color:var(--muted)}' +
  'table.rank td.rk{color:var(--faint);width:26px;font-weight:600}' +
  '.empty{color:var(--faint);font-size:13px;padding:10px 0}' +
  '.bars{display:flex;align-items:flex-end;gap:6px;height:150px;overflow-x:auto}.bcol{flex:1;min-width:34px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%}' +
  '.daybars{justify-content:flex-start}.daybars .bcol{flex:0 0 42px;width:42px;min-width:42px}.daybars .bval{font-size:9px}' +
  '.bval{font-size:10px;color:var(--faint);margin-bottom:4px;white-space:nowrap}.bar{width:100%;background:#818cf8;border-radius:4px 4px 0 0}.blabel{font-size:10px;color:var(--muted);margin-top:4px;white-space:nowrap}' +
  '.glegend{display:flex;gap:16px;align-items:center;font-size:12px;color:var(--muted);margin-bottom:10px;flex-wrap:wrap}.glegend span{display:inline-flex;align-items:center;gap:6px}.sw{width:11px;height:11px;border-radius:3px;display:inline-block}.sw.c{background:var(--barC)}.sw.o{background:var(--barO)}.gnote{color:var(--faint);font-size:11px}' +
  '.lookup{width:100%;max-width:360px;background:var(--bd2);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:9px 11px;font-size:14px;font-weight:600;margin-bottom:10px}' +
  '.looklist{display:flex;flex-direction:column;gap:2px;margin-bottom:10px;max-width:360px}' +
  '.lookrow{padding:8px 11px;border:1px solid var(--border);border-radius:8px;background:var(--bd2);font-size:13px;font-weight:500;color:var(--text);cursor:pointer}.lookrow:hover{border-color:var(--portal)}' +
  '.lookname{font-size:15px;font-weight:600;color:var(--head);margin-bottom:10px}' +
  '.kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}' +
  '.kvc{background:var(--bd2);border:1px solid var(--border);border-radius:10px;padding:12px}.kvl{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600}.kvv{font-size:18px;font-weight:600;margin-top:4px;color:var(--head)}' +
  '.foot{text-align:center;color:var(--faint);font-size:12px;margin-top:8px}' +
  '</style>';
}