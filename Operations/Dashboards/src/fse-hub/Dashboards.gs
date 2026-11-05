/**
 * Per-Team Revenue Dashboard — one Apps Script web app, one view per escrow team.
 *
 *   <exec-url>?team=jd        -> JD Unit dashboard
 *   <exec-url>?team=team3     -> Team 3 dashboard
 *   <exec-url>?team=team5     -> Team 5 dashboard
 *   <exec-url>?team=team7     -> Team 7 dashboard
 *   <exec-url>?team=team9     -> Team 9 dashboard
 *   <exec-url>                -> DEFAULT_TEAM
 *   add &format=json          -> raw model JSON
 *
 * ACCESS: gated by the deployment's "Who has access" = anyone in the
 *   brettward.net Workspace. No in-app key. Google blocks non-domain users at
 *   sign-in before this code runs. Team is a DISPLAY filter, not a security
 *   boundary.
 *
 * SCRIPT PROPERTIES:
 *   SMARTSHEET_TOKEN = your Smartsheet API token
 *
 * TO CHANGE THE DASHBOARD: edit MODULES (below). Reorder = move a line.
 *   Remove = delete a line. Add a data point = add a line. No other edits.
 *   All teams render the same MODULES list; only the sheet ID differs.
 */

/* ============================ CONFIG ============================ */

// ONE config drives everything: the dashboard views, the team switcher, and
// the portal's Team Resources page (Portal.gs). `link` is the team's Smartsheet
// permalink (from the Smartsheet API, 2026-08-28). Add a team = add one line.
var TEAMS = {
  jd:    { label: 'JD Unit', sheet: '6403198558359428', link: 'https://app.smartsheet.com/sheets/MVj9wCf7G2qjw4Q8fpPm5p8RGhpVFjVxJ2FQ57h1' },
  team3: { label: 'Team 3',  sheet: '339384860993412',  link: 'https://app.smartsheet.com/sheets/6cgfcC6wxX2PRrPXFhXFhHgCvRVX5Q84vRfGvr31' },
  team5: { label: 'Team 5',  sheet: '8144815540987780', link: 'https://app.smartsheet.com/sheets/hx7VMJmvcCjfXJmqppRqhpRR9c8MwV9Fgpgfw6Q1' },
  team7: { label: 'Team 7',  sheet: '307047045588868',  link: 'https://app.smartsheet.com/sheets/G2mHxQVXj4RX8f43RwHMr7FjVjj9CXF5ch7Pf5Q1' },
  team9: { label: 'Team 9',  sheet: '2609780876437380', link: 'https://app.smartsheet.com/sheets/7cRwGM4p3x8MMxPm5F8r6prVwQ9xfGQ8FV83hPw1' }
};
var DEFAULT_TEAM = 'jd';

// Column titles — the single place to retitle if a sheet header ever changes.
// Lookups are tolerant (exact -> case-insensitive -> contains) so minor drift
// across the three sheets is absorbed; a missing column just renders blank.
var COL = {
  account:     'Directing Customer',
  fees:        'Escrow Fees',
  openDate:    'Open Date',
  closeDate:   'Actual COE',
  projDate:    'Projected COE',
  status:      'File Status',
  escrowNo:    'Escrow #',
  address:     'Property Address',
  rep:         'Sales Rep',
  type:        'Type'
};
var STATUS_CANCELED = 'canceled';
// Placeholder customer names left out of the client attribution index (lowercased).
// Any value shaped like a file number (digits-letters) is skipped too.
var JUNK_CUSTOMERS = ['(none)', 'na', 'n/a', 'previous buyer', 'fsbo (michael libutti prev seller)'];  // compared trimmed + lowercased, same as the Company and Client Stats dashboards

// ---- THE DASHBOARD. Edit this array to change what shows and in what order. ----
// event:  opened   -> Open Date drives it, cancelled files excluded
//         closed   -> Actual COE present drives it (true close-of-escrow)
//         projected-> open & non-cancelled, Projected COE drives it
// window: mtd | thisMonth | lastMonth | t12m | next7
// measure (kpi cards): fees (default, $ headline) | count (# headline, $ sub)
//                      | avgFee ($ per closed) | avgDays (days to close)
var MODULES = [
  // Section 1 — current month. Month names render dynamically (e.g. "June Projected").
  { type:'kpiRow', cards:[
    { label:'Projected', labelMonth:'cur',  event:'projectedMonth', window:'thisMonth', tone:'proj' },
    { label:'Opened MTD',                    event:'opened',         window:'mtd',       tone:'open' },
    { label:'Closed MTD',                    event:'closed',         window:'mtd',       tone:'closed' },
    { label:'Closed',     labelMonth:'last', event:'closed',         window:'lastMonth', tone:'prev' }
  ]},
  // Section 2 — one consolidated block, all trailing-12-month figures
  { type:'statBlock', title:'Last 12 Months', stats:[
    { label:'Opened',            event:'opened', window:'t12m', measure:'fees',    tone:'open' },
    { label:'Closed',            event:'closed', window:'t12m', measure:'fees',    tone:'closed' },
    { label:'Avg Fee / Closed',  event:'closed', window:'t12m', measure:'avgFee',  tone:'fee' },
    { label:'Avg Days to Close', event:'closed', window:'t12m', measure:'avgDays', tone:'days' }
  ]},
  { type:'grossByMonth', title:'Gross Fees by Month',   months:12 },
  { type:'reports',      title:'Reports' },   // Closed / Closing / Opened by date range and client (replaced Closing, Next 7 Days, 2026-10-30)
  { type:'topClients',   title:'Top 10 Clients (12 mo)', window:'t12m', n:10 },
  { type:'clientLookup', title:'Client Lookup',          window:'t12m' }
];

/* ============================ ENTRY ============================ */

function doGet(e) {
  var props = PropertiesService.getScriptProperties();
  var wantJson = !!(e && e.parameter && e.parameter.format === 'json');
  var selfUrl = ScriptApp.getService().getUrl();

  // Portal pages (?page=resources | calc | forms) — served from Portal.gs, no Smartsheet needed.
  var pg = (e && e.parameter && e.parameter.page) ? String(e.parameter.page).toLowerCase() : '';
  if (pg) return renderPortalPage(pg, selfUrl, (e && e.parameter) || {});

  var token = props.getProperty('SMARTSHEET_TOKEN');
  if (!token) return wantJson ? out({ error: 'Missing SMARTSHEET_TOKEN' })
                              : page('Setup needed', 'Missing SMARTSHEET_TOKEN script property.');

  var key = (e && e.parameter && e.parameter.team) ? String(e.parameter.team).toLowerCase() : DEFAULT_TEAM;
  var team = TEAMS[key];
  if (!team) {
    var valid = Object.keys(TEAMS).join(', ');
    return wantJson ? out({ error: 'Unknown team "' + key + '". Valid: ' + valid })
                    : page('Unknown team', 'No team "' + esc(key) + '". Use ?team= one of: ' + esc(valid) + '.');
  }

  try {
    var m = buildModel(token, key, team);
    if (wantJson) return out(m.json);
    return HtmlService.createHtmlOutput(renderDashboard(m, selfUrl))
      .setTitle('Five Star — ' + team.label)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    return wantJson ? out({ error: String(err) }) : page('Error', String(err));
  }
}

/* ============================ DATA LAYER ============================ */

function buildModel(token, key, team) {
  var grid = safeFetchGrid(team.sheet, token);
  if (!grid) throw new Error('Could not read team sheet ' + team.sheet + ' (check ID / token access).');

  var tz  = Session.getScriptTimeZone() || 'America/Los_Angeles';
  var ctx = dateContext(tz);
  var records = toRecords(grid);

  return {
    teamKey: key, teamLabel: team.label,
    tz: tz, ctx: ctx, records: records,
    headerDate: Utilities.formatDate(new Date(), tz, 'EEEE, MMMM d, yyyy'),
    updated:    Utilities.formatDate(new Date(), tz, 'MMM d, h:mm a'),
    json: { team: key, label: team.label, count: records.length, asOf: ctx.today,
            clientsIndexed: (attrIndex(false) || []).length }
  };
}

// Full-column rows: every sheet column is in `raw`; common fields are normalized.
function toRecords(grid) {
  var cm = columnMap(grid);
  return (grid.rows || []).map(function (r) {
    var o = rowObj(r, cm);
    var status   = gd(o, COL.status);
    var canceled = String(status).trim().toLowerCase() === STATUS_CANCELED;
    var closeISO = validDate(gv(o, COL.closeDate));  // Actual COE date, or ''
    var projISO  = validDate(gv(o, COL.projDate));   // Projected COE date, or ''
    return {
      account:     gd(o, COL.account) || '(none)',
      fees:        num(gv(o, COL.fees)),
      openDate:    validDate(gv(o, COL.openDate)),
      closeDate:   closeISO,
      projDate:    projISO,
      status:      status,
      canceled:    canceled,
      closed:      !!closeISO,                  // closed = Actual COE holds a date
      open:        !closeISO && !canceled,      // currently in escrow
      escrowNo:    gd(o, COL.escrowNo),
      address:     gd(o, COL.address),
      rep:         gd(o, COL.rep) || '(unassigned)',
      type:        gd(o, COL.type) || '(none)',
      raw:         o   // arbitrary column access for future modules
    };
  });
}

function dateContext(tz) {
  var now = new Date();
  var todayISO = Utilities.formatDate(now, tz, 'yyyy-MM-dd');
  var p = todayISO.split('-'), Y = +p[0], M = +p[1], D = +p[2];

  var monthLast = new Date(Date.UTC(Y, M, 0)).getUTCDate();
  var lmY = (M === 1) ? Y - 1 : Y, lmM = (M === 1) ? 12 : M - 1;
  var lmLast = new Date(Date.UTC(lmY, lmM, 0)).getUTCDate();

  var t12 = new Date(Date.UTC(Y, M - 1, D)); t12.setUTCMonth(t12.getUTCMonth() - 12);
  var n7  = new Date(Date.UTC(Y, M - 1, D)); n7.setUTCDate(n7.getUTCDate() + 7);

  // last `months` month-keys (yyyy-MM), oldest first
  var keys = [];
  for (var i = 11; i >= 0; i--) {
    var d = new Date(Date.UTC(Y, M - 1, 1)); d.setUTCMonth(d.getUTCMonth() - i);
    keys.push(Utilities.formatDate(d, 'UTC', 'yyyy-MM'));
  }

  return {
    today: todayISO,
    monthStart: iso(Y, M, 1), monthEnd: iso(Y, M, monthLast),
    lastMonthStart: iso(lmY, lmM, 1), lastMonthEnd: iso(lmY, lmM, lmLast),
    t12mStart: Utilities.formatDate(t12, 'UTC', 'yyyy-MM-dd'),
    next7End:  Utilities.formatDate(n7, 'UTC', 'yyyy-MM-dd'),
    monthKeys: keys, nowYear: Y, nowMonth: M
  };
  function iso(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }
}

/* ====================== AGGREGATION PRIMITIVES ====================== */

function windowBounds(ctx, w) {
  switch (w) {
    case 'mtd':       return [ctx.monthStart, ctx.today];
    case 'thisMonth': return [ctx.monthStart, ctx.monthEnd];
    case 'lastMonth': return [ctx.lastMonthStart, ctx.lastMonthEnd];
    case 't12m':      return [ctx.t12mStart, ctx.today];
    case 'next7':     return [ctx.today, ctx.next7End];
    default:          return ['0000-00-00', '9999-99-99'];
  }
}
function eventDate(rec, event) {
  if (event === 'opened')    return rec.openDate;
  if (event === 'closed')    return rec.closeDate;
  if (event === 'projected') return rec.projDate;
  return '';
}
function eventEligible(rec, event) {
  if (event === 'opened')    return !rec.canceled;                 // opens exclude cancelled
  if (event === 'closed')    return rec.closed;                    // closed = Actual COE present
  if (event === 'projected') return !rec.closed && !rec.canceled;  // open & non-cancelled
  return true;
}
// Rows whose event-date falls within the window.
function eventRows(records, event, window, ctx) {
  var b = windowBounds(ctx, window), from = b[0], to = b[1];
  return records.filter(function (r) {
    if (!eventEligible(r, event)) return false;
    var d = eventDate(r, event);
    return d && d >= from && d <= to;
  });
}
function sumFees(rows) { return rows.reduce(function (s, r) { return s + r.fees; }, 0); }
function groupBy(rows, keyFn) {
  var g = {};
  rows.forEach(function (r) { var k = keyFn(r); (g[k] = g[k] || []).push(r); });
  return g;
}
function daysBetween(aIso, bIso) {
  var a = Date.parse(aIso + 'T00:00:00Z'), b = Date.parse(bIso + 'T00:00:00Z');
  if (isNaN(a) || isNaN(b)) return null;
  return Math.round((b - a) / 864e5);
}

/* ============================ RENDER ============================ */

function renderDashboard(m, selfUrl) {
  var body = MODULES.map(function (mod) {
    var fn = RENDERERS[mod.type];
    return fn ? fn(mod, m) : '';
  }).join('');

  var themeInit = '<script>(function(){try{var t=localStorage.getItem("briefTheme")||"dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();</script>';
  var themeToggle = '<script>(function(){var b=document.getElementById("themeBtn");function lbl(){if(b)b.textContent=document.documentElement.getAttribute("data-theme")==="light"?"\u263e Dark":"\u2600 Light";}lbl();if(b)b.addEventListener("click",function(){var n=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";document.documentElement.setAttribute("data-theme",n);try{localStorage.setItem("briefTheme",n);}catch(e){}lbl();});})();</script>';

  return css() + themeInit + '<div class="wrap">' +
    '<div class="top"><div>' +
      '<h1 class="h1"><span class="star">\u2605</span>' + esc(m.teamLabel) + ' Dashboard</h1>' +
      '<div class="sub">' + esc(m.headerDate) + ' \u00b7 Five Star Escrow</div>' +
    '</div><div class="actions">' + teamSwitcher(m.teamKey, selfUrl) +
      '<button id="themeBtn" class="btn" type="button">\u2600 Light</button>' +
      '<a class="btn" href="' + esc(selfUrl) + '?team=' + esc(m.teamKey) + '" target="_top">\u21bb Refresh</a>' +
    '</div></div>' +
    body +
    '<div class="foot">Live from Smartsheet \u00b7 ' + esc(String(m.records.length)) + ' files \u00b7 updated ' + esc(m.updated) + '</div>' +
    '</div>' + themeToggle;
}

function teamSwitcher(activeKey, selfUrl) {
  return '<div class="tswitch">' + Object.keys(TEAMS).map(function (k) {
    var on = k === activeKey ? ' on' : '';
    return '<a class="tbtn' + on + '" href="' + esc(selfUrl) + '?team=' + esc(k) + '" target="_top">' + esc(TEAMS[k].label) + '</a>';
  }).join('') + '</div>';
}

var RENDERERS = {

  kpiRow: function (mod, m) {
    var cards = mod.cards.map(function (c) {
      var r = kpiCompute(c, m);
      return kpiCard(kpiLabel(c, m.ctx), r.val, r.sub, c.tone || 's');
    }).join('');
    return '<div class="kpis">' + cards + '</div>';
  },

  statBlock: function (mod, m) {
    var cells = mod.stats.map(function (c) {
      var r = kpiCompute(c, m);
      var green = (c.measure === 'avgDays') ? '' : ' green';
      return '<div class="kcell"><div class="kcl">' + esc(kpiLabel(c, m.ctx)) + '</div>' +
        '<div class="kcv' + green + '">' + r.val + '</div><div class="kcs">' + esc(r.sub) + '</div></div>';
    }).join('');
    return '<div class="card"><div class="shead"><div class="stitle"><h2>' + esc(mod.title) +
      '</h2><span class="snote">\u00b7 trailing 12 months</span></div></div><div class="kgrid">' + cells +
      '</div><p class="hint">Opened and closed by fees; averages across closed files.</p></div>';
  },

  topClients: function (mod, m) {
    var closed = eventRows(m.records, 'closed', mod.window, m.ctx);
    var opened = eventRows(m.records, 'opened', mod.window, m.ctx);
    var byAcct = {};
    function slot(a) { return byAcct[a] || (byAcct[a] = { account: a, fees: 0, closed: 0, opened: 0, inEscrow: 0 }); }
    closed.forEach(function (r) { var s = slot(r.account); s.fees += r.fees; s.closed++; });
    opened.forEach(function (r) { slot(r.account).opened++; });
    m.records.forEach(function (r) { if (r.open) slot(r.account).inEscrow++; });  // live snapshot
    var rows = Object.keys(byAcct).map(function (k) { return byAcct[k]; })
      .sort(function (a, b) { return b.fees - a.fees; }).slice(0, mod.n);

    if (!rows.length) return card(mod.title, '', '\u2014', '<p class="empty">No closed files in window.</p>');
    var body = rows.map(function (r, i) {
      return '<tr><td class="rk">' + (i + 1) + '</td><td>' + esc(r.account) +
        '</td><td class="num money">' + money(r.fees) +
        '</td><td class="num muted">' + r.opened +
        '</td><td class="num">' + r.inEscrow +
        '</td><td class="num">' + r.closed + '</td></tr>';
    }).join('');
    var tbl = '<div class="scroll"><table class="rank"><thead><tr><th></th><th>Client</th>' +
      '<th class="num">Closed Fees</th><th class="num">Opened</th><th class="num">In Escrow</th><th class="num">Closed</th>' +
      '</tr></thead><tbody>' + body + '</tbody></table></div>';
    return card(mod.title, 'Ranked by closed fees', rows.length, tbl);
  },

  clientLookup: function (mod, m) {
    var b = windowBounds(m.ctx, mod.window), from = b[0], to = b[1];
    var data = {}, merges = clientMerges(false);
    function slot(a) {                                               // one slot per merged client
      var rc = clientResolve(a, merges), k = rc.key || a;
      return data[k] || (data[k] = { account: rc.show || a, opened: 0, inEscrow: 0, closed: 0,
                                     cancelled: 0, closedFees: 0, lastOpen: '' });
    }
    m.records.forEach(function (r) {
      var s = slot(r.account);
      if (r.openDate > s.lastOpen) s.lastOpen = r.openDate;          // most recent open, any time
      if (r.open) s.inEscrow++;                                      // live snapshot
      var oIn = r.openDate && r.openDate >= from && r.openDate <= to;
      var cIn = r.closeDate && r.closeDate >= from && r.closeDate <= to;
      if (r.canceled) { if (oIn) s.cancelled++; }
      else if (oIn)   { s.opened++; }
      if (r.closed && cIn) { s.closed++; s.closedFees += r.fees; }
    });
    var keys = Object.keys(data).filter(function (k) {
      var d = data[k]; return d.opened || d.closed || d.cancelled || d.inEscrow;
    }).sort();

    var summary = {};
    keys.forEach(function (k) {
      var d = data[k];
      summary[k] = {
        opened: d.opened, inEscrow: d.inEscrow, closed: d.closed, cancelled: d.cancelled,
        closedFees: money(d.closedFees),
        avgFee: d.closed ? money(d.closedFees / d.closed) : '\u2014',
        lastOpen: d.lastOpen ? labelFromISO(d.lastOpen, false) : '\u2014'
      };
    });
    // Merge in the all-teams attribution index: every client on the five sheets,
    // with owner team, sales rep, and last open. Own-team 12-month stats attach
    // to the matching client; the lookup searches the union.
    var all = {}, byKey = {};
    (attrIndex(false) || []).forEach(function (o) {
      all[o[0]] = { t: o[1], r: o[2], l: o[3] ? fullDate(o[3]) : '\u2014', s: null, a: o[4] || '' };
      byKey[clientKey(o[0])] = o[0];
    });
    keys.forEach(function (k) {
      var name = byKey[k];
      if (name) all[name].s = summary[k];
      else all[data[k].account] = { t: '', r: '', l: '', s: summary[k], a: '' };
    });
    var json = JSON.stringify(all).replace(/</g, '\\u003c');
    var here = JSON.stringify(m.teamLabel);
    var uid = 'cl_' + Math.floor(Math.random() * 1e6);

    var inner =
      '<input class="lookup" id="' + uid + '_q" type="text" autocomplete="off" placeholder="Type a client name\u2026">' +
      '<div id="' + uid + '_list" class="looklist"></div>' +
      '<div id="' + uid + '_out" class="lookout"><p class="empty">Start typing to find a client.</p></div>' +
      '<script>(function(){var D=' + json + ';var KEYS=Object.keys(D);' +
      'var q=document.getElementById("' + uid + '_q"),L=document.getElementById("' + uid + '_list"),o=document.getElementById("' + uid + '_out");' +
      'function cell(l,v){return \'<div class="kvc"><div class="kvl">\'+l+\'</div><div class="kvv">\'+v+\'</div></div>\';}' +
      'function e(x){return String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;");}' +
      'function detail(k){var a=D[k],d=a.s,h=\'<div class="lookname">\'+e(k)+\'</div>\';' +
      'if(a.t){h+=\'<div class="kv">\'+cell("Owner",e(a.t)+(a.t===' + here + '?"":" (another team)"))+cell("Sales Rep",e(a.r))+cell("Last Open",e(a.l))+\'</div>\';}' +
      'if(d){h+=\'<div class="kv">\'+cell("Opened",d.opened)+cell("In Escrow",d.inEscrow)+cell("Closed",d.closed)+cell("Cancelled",d.cancelled)+' +
      'cell("Closed Fees (12 mo)",d.closedFees)+cell("Avg Fee / Closed",d.avgFee)+\'</div>\';}' +
      'else{h+=\'<p class="empty">No files with \'+e(' + here + ')+\' in the last 12 months.</p>\';}' +
      'o.innerHTML=h;}' +
      'function render(){var t=q.value.trim().toLowerCase();L.innerHTML="";if(!t){return;}' +
      'var hits=KEYS.filter(function(k){return (k+" "+(D[k].a||"")).toLowerCase().indexOf(t)!==-1;}).slice(0,12);' +
      'if(!hits.length){L.innerHTML=\'<div class="lookrow muted">No match</div>\';return;}' +
      'hits.forEach(function(k){var row=document.createElement("div");row.className="lookrow";row.textContent=k;' +
      'row.addEventListener("click",function(){q.value=k;L.innerHTML="";detail(k);});L.appendChild(row);});}' +
      'q.addEventListener("input",render);})();</script>';
    return card(mod.title, 'Owner across all five teams \u00b7 this team\'s stats, trailing 12 months', Object.keys(all).length, inner);
  },

  // Reports: Closed / Closing / Opened files in a date range, optional client
  // filter, fee total at the bottom. Filtering runs in the page (no reload).
  // Opens on Closing, next 7 days (the old "Closing, Next 7 Days" view).
  reports: function (mod, m) {
    var merges = clientMerges(false), cIdx = {}, clients = [];
    function client(a) {                                             // one entry per merged client
      var rc = clientResolve(a, merges), k = rc.key || a, c = cIdx[k];
      if (c == null) { c = cIdx[k] = clients.length; clients.push([rc.show || a, '']); }
      if (normName(a) !== clients[c][0] && clients[c][1].indexOf(a) === -1) clients[c][1] += ' ' + a;
      return c;
    }
    // [escrow #, property, client index, rep, fees, open, close, projected]; canceled and undated rows left out
    var rows = [];
    m.records.forEach(function (r) {
      if (r.canceled || !(r.openDate || r.closeDate || r.projDate)) return;
      rows.push([r.escrowNo, r.address, client(r.account), r.rep, Math.round(r.fees * 100) / 100,
                 r.openDate, r.closeDate, r.projDate]);
    });
    var data = JSON.stringify({ r: rows, c: clients,
      p: { n7: [m.ctx.today, m.ctx.next7End], tm: [m.ctx.monthStart, m.ctx.monthEnd], lm: [m.ctx.lastMonthStart, m.ctx.lastMonthEnd] }
    }).replace(/</g, '\\u003c');
    var uid = 'rp_' + Math.floor(Math.random() * 1e6);

    var inner =
      '<div class="rctl">' +
        '<label class="rfld"><span>Report</span><select id="' + uid + '_t" class="rin">' +
          '<option value="closing">Closing (open files by Projected COE)</option>' +
          '<option value="closed">Closed (by Actual COE)</option>' +
          '<option value="opened">Opened (by Open Date)</option></select></label>' +
        '<div class="rdates"><div class="rdrow">' +
          '<label class="rfld"><span>From</span><input id="' + uid + '_f" class="rin" type="date"></label>' +
          '<label class="rfld"><span>To</span><input id="' + uid + '_to" class="rin" type="date"></label></div>' +
          '<div class="rquick"><button type="button" class="rq" data-p="n7">Next 7 days</button>' +
          '<button type="button" class="rq" data-p="tm">This month</button>' +
          '<button type="button" class="rq" data-p="lm">Last month</button></div></div>' +
        '<div class="rfld rcl"><span>Client</span><input id="' + uid + '_q" class="rin" type="text" autocomplete="off" placeholder="All clients">' +
          '<button id="' + uid + '_x" class="rx" type="button" title="Clear client">×</button>' +
          '<div id="' + uid + '_l" class="looklist rlist"></div></div>' +
      '</div>' +
      '<div id="' + uid + '_o"></div>' +
      '<script>(function(){var D=' + data + ';' +
      'function $(s){return document.getElementById("' + uid + '_"+s);}' +
      'var T=$("t"),F=$("f"),TO=$("to"),Q=$("q"),X=$("x"),L=$("l"),O=$("o"),pick=-1;' +
      'var COL={opened:5,closed:6,closing:7},HD={opened:"Opened",closed:"Closed",closing:"Proj COE"};' +
      'var MON=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];' +
      'function e(x){return String(x==null?"":x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");}' +
      'function money(n){var neg=n<0;n=Math.abs(n);return (neg?"-$":"$")+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});}' +
      'function dl(s){var p=s.split("-");return MON[+p[1]-1]+" "+(+p[2])+", "+p[0];}' +
      'function cmatch(){var t=Q.value.trim().toLowerCase();if(pick>=0)return function(c){return c===pick;};' +
      'if(!t)return null;return function(c){var k=D.c[c];return (k[0]+" "+k[1]).toLowerCase().indexOf(t)!==-1;};}' +
      'function run(){var ty=T.value,ci=COL[ty],from=F.value,to=TO.value,cm=cmatch();' +
      'if(!from||!to){O.innerHTML=\'<p class="empty">Pick a From and To date.</p>\';return;}' +
      'if(from>to){O.innerHTML=\'<p class="empty">From is after To.</p>\';return;}' +
      'var rs=D.r.filter(function(r){var d=r[ci];if(!d||d<from||d>to)return false;' +
      'if(ty==="closing"&&r[6])return false;' +
      'return !cm||cm(r[2]);}).sort(function(a,b){return a[ci]<b[ci]?-1:a[ci]>b[ci]?1:0;});' +
      'if(!rs.length){O.innerHTML=\'<p class="empty">No files match.</p>\';return;}' +
      'var tot=0,h=rs.map(function(r){tot+=r[4];return "<tr><td>"+dl(r[ci])+\'</td><td class="mono">\'+e(r[0])+"</td><td>"+e(r[1])+' +
      '\'</td><td class="muted">\'+e(D.c[r[2]][0])+\'</td><td class="muted">\'+e(r[3])+\'</td><td class="num money">\'+money(r[4])+"</td></tr>";}).join("");' +
      'O.innerHTML=\'<div class="scroll"><table><thead><tr><th>\'+HD[ty]+"</th><th>Escrow #</th><th>Property</th><th>Client</th><th>Sales Rep</th>' +
      '<th class=\\"num\\">Fees</th></tr></thead><tbody>"+h+\'</tbody><tfoot><tr class="rtot"><td colspan="5">\'+rs.length+" file"+(rs.length===1?"":"s")+' +
      '\'</td><td class="num money">\'+money(tot)+"</td></tr></tfoot></table></div>";}' +
      'function sugg(){L.innerHTML="";var t=Q.value.trim().toLowerCase();if(!t||pick>=0)return;' +
      'var hits=[];for(var i=0;i<D.c.length;i++){if((D.c[i][0]+" "+D.c[i][1]).toLowerCase().indexOf(t)!==-1)hits.push(i);}' +
      'function rk(i){var n=D.c[i][0].toLowerCase();return n.indexOf(t)===0?0:(" "+n).indexOf(" "+t)!==-1?1:2;}' +
      'hits=hits.sort(function(a,b){return rk(a)-rk(b)||(D.c[a][0]<D.c[b][0]?-1:1);}).slice(0,8);' +
      'if(!hits.length){L.innerHTML=\'<div class="lookrow muted">No match</div>\';return;}' +
      'hits.forEach(function(i){var d=document.createElement("div");d.className="lookrow";d.textContent=D.c[i][0];' +
      'd.addEventListener("mousedown",function(ev){ev.preventDefault();pick=i;Q.value=D.c[i][0];L.innerHTML="";run();});L.appendChild(d);});}' +
      'Q.addEventListener("input",function(){pick=-1;sugg();run();});' +
      'Q.addEventListener("blur",function(){L.innerHTML="";});' +
      'X.addEventListener("click",function(){pick=-1;Q.value="";L.innerHTML="";run();});' +
      'var QB=O.parentNode.querySelectorAll(".rq");' +
      'function mark(p){QB.forEach(function(b){b.classList.toggle("on",b.getAttribute("data-p")===p);});}' +   // highlight the quick pick in use
      'function setP(p){F.value=D.p[p][0];TO.value=D.p[p][1];mark(p);run();}' +
      'QB.forEach(function(b){b.addEventListener("click",function(){setP(b.getAttribute("data-p"));});});' +
      '[F,TO].forEach(function(el){el.addEventListener("change",function(){mark("");run();});});' +
      'T.addEventListener("change",run);' +
      'setP("n7");})();</script>';
    return card(mod.title, '', '', inner);
  },

  // Each non-cancelled file lands in ONE month: Actual COE month if closed,
  // else Projected COE month if open. Open files with no Projected COE are not
  // counted (team rule: pipeline files carry a current-month Projected COE).
  // Rendered as a stacked bar chart: banked (Closed) + pending (Open/Projected).
  grossByMonth: function (mod, m) {
    var byM = {};
    function slot(k) { return byM[k] || (byM[k] = { closedFees: 0, openFees: 0, closedN: 0, openN: 0 }); }
    m.records.forEach(function (r) {
      if (r.canceled) return;
      if (r.closed) {
        if (!r.closeDate) return;
        var sc = slot(r.closeDate.substring(0, 7)); sc.closedFees += r.fees; sc.closedN++;
      } else {
        if (!r.projDate) return;                    // open w/ no Projected COE -> not counted
        var so = slot(r.projDate.substring(0, 7)); so.openFees += r.fees; so.openN++;
      }
    });
    var keys = m.ctx.monthKeys.slice(-(mod.months + 1));   // oldest -> current (chronological)
    var curKey = m.ctx.today.substring(0, 7);
    var nm = m.ctx.nowMonth + 1, ny = m.ctx.nowYear; if (nm > 12) { nm = 1; ny++; }
    var nextKey = ny + '-' + (nm < 10 ? '0' + nm : nm);
    keys = keys.concat([nextKey]);                         // + next month (forecast)
    var maxV = 1;
    keys.forEach(function (k) { var s = byM[k]; if (s) maxV = Math.max(maxV, s.closedFees + s.openFees); });

    // SVG layout (user units; scales to container width). ~half-height, compact.
    var padL = 10, padR = 10, padTop = 16, chartH = 78, padBot = 30;
    var barW = 22, gap = 14, slot2 = barW + gap;
    var W = padL + keys.length * slot2 - gap + padR;
    var H = padTop + chartH + padBot, baseY = padTop + chartH;

    var bars = keys.map(function (k, i) {
      var s = byM[k] || { closedFees: 0, openFees: 0, closedN: 0, openN: 0 };
      var cF = s.closedFees, oF = s.openFees, tot = cF + oF, isCur = (k === curKey), isNext = (k === nextKey);
      var x = padL + i * slot2;
      var hC = Math.round(cF / maxV * chartH), hO = Math.round(oF / maxV * chartH);
      var yC = baseY - hC, yO = yC - hO;
      var lbl = monthLabel(k), mon = lbl.split(' ')[0], yr = "\u2019" + lbl.slice(-2);
      var tip = lbl + ' \u2014 Gross ' + money(tot) + '  (Closed ' + money(cF) + ' / Open ' + money(oF) + ')';
      var seg = '<title>' + esc(tip) + '</title>';
      if (hC > 0) seg += '<rect x="' + x + '" y="' + yC + '" width="' + barW + '" height="' + hC + '" rx="2" fill="var(--barC)"></rect>';
      if (hO > 0) seg += '<rect x="' + x + '" y="' + yO + '" width="' + barW + '" height="' + hO + '" rx="2" fill="var(--barO)"></rect>';
      var top = tot > 0 ? '<text x="' + (x + barW / 2) + '" y="' + (yO - 5) + '" text-anchor="middle" font-size="9" font-weight="700" fill="var(--head)">' + esc(moneyShort(tot)) + '</text>' : '';
      var hot = isCur || isNext;
      var ml = '<text x="' + (x + barW / 2) + '" y="' + (baseY + 14) + '" text-anchor="middle" font-size="10" font-weight="' + (hot ? '700' : '500') + '" fill="' + (hot ? 'var(--head)' : 'var(--muted)') + '">' + esc(mon) + '</text>' +
               '<text x="' + (x + barW / 2) + '" y="' + (baseY + 25) + '" text-anchor="middle" font-size="9" fill="var(--faint)">' + esc(yr) + (isCur ? ' \u25cf' : '') + '</text>';
      return '<g>' + seg + top + ml + '</g>';
    }).join('');

    var axis = '<line x1="' + padL + '" y1="' + baseY + '" x2="' + (W - padR) + '" y2="' + baseY + '" stroke="var(--border)" stroke-width="1"></line>';
    var svg = '<div class="scroll"><svg viewBox="0 0 ' + W + ' ' + H + '" style="width:100%;height:auto;min-width:' + Math.min(W, 560) + 'px;display:block" xmlns="http://www.w3.org/2000/svg">' +
      axis + bars + '</svg></div>';
    var legend = '<div class="glegend"><span><i class="sw c"></i>Closed (banked)</span><span><i class="sw o"></i>Open \u00b7 projected</span><span class="gnote">\u25cf current month</span></div>';
    var hint = '<p class="hint">Closed = Actual COE that month. Open = Projected COE that month. Last bar is next month (forecast).</p>';
    return card(mod.title, 'Banked vs projected, by month', '', legend + svg + hint);
  },

};

/* ============================ RENDER HELPERS ============================ */

function monthLabel(k) {
  var p = k.split('-'); if (p.length < 2) return k;
  var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return mon[(+p[1]) - 1] + ' ' + p[0];
}

// Shared KPI math used by both the top row and the consolidated 12-month block.
function kpiCompute(c, m) {
  if (c.event === 'projectedMonth') {
    var closedMTD = eventRows(m.records, 'closed', 'mtd', m.ctx);
    var openProj  = eventRows(m.records, 'projected', 'thisMonth', m.ctx);
    var feesC = sumFees(closedMTD), feesP = sumFees(openProj);
    return { val: money(feesC + feesP), sub: money(feesC) + ' closed + ' + money(feesP) + ' to close' };
  }
  if (c.measure === 'avgDays') {
    var rows = eventRows(m.records, 'closed', c.window, m.ctx);
    var ds = rows.map(function (r) { return daysBetween(r.openDate, r.closeDate); })
                 .filter(function (n) { return n != null && n >= 0; });
    var avg = ds.length ? Math.round(ds.reduce(function (s, n) { return s + n; }, 0) / ds.length) : 0;
    return { val: ds.length ? avg + ' days' : '\u2014', sub: ds.length + ' closed' };
  }
  var rs = eventRows(m.records, c.event, c.window, m.ctx);
  if (c.measure === 'count')  return { val: String(rs.length), sub: money(sumFees(rs)) };
  if (c.measure === 'avgFee') { var a = rs.length ? sumFees(rs) / rs.length : 0; return { val: money(a), sub: rs.length + ' closed' }; }
  return { val: money(sumFees(rs)), sub: rs.length + ' file' + (rs.length === 1 ? '' : 's') };
}
function kpiLabel(c, ctx) {
  if (c.labelMonth === 'cur')  return monthFull(ctx.monthStart) + ' ' + c.label;
  if (c.labelMonth === 'last') return monthFull(ctx.lastMonthStart) + ' ' + c.label;
  return c.label;
}
function monthFull(s) {
  var mi = +(String(s).split('-')[1]) - 1;
  return ['January','February','March','April','May','June','July','August','September','October','November','December'][mi] || '';
}

function kpiCard(label, val, sub, cls) {
  return '<div class="kpi"><div class="kdot ' + cls + '"></div><div class="klabel">' + esc(label) +
    '</div><div class="kval">' + val + '</div><div class="ksub">' + esc(sub) + '</div></div>';
}
function card(title, note, count, innerHtml) {
  return '<div class="card">' + sectionHead(title, note, count) + innerHtml + '</div>';
}
function sectionHead(title, note, count) {
  var pill = (count === '' || count == null) ? '' : '<span class="pill">' + esc(String(count)) + '</span>';
  return '<div class="shead"><div class="stitle"><h2>' + esc(title) + '</h2>' +
    (note ? '<span class="snote">\u00b7 ' + esc(note) + '</span>' : '') +
    '</div><div class="sright">' + pill + '</div></div>';
}
function kvCell(l, v) { return '<div class="kvc"><div class="kvl">' + esc(l) + '</div><div class="kvv">' + esc(String(v)) + '</div></div>'; }

/* ============================ SMARTSHEET PLUMBING (reused) ============================ */

// Returns parsed grid JSON, or null. Tries Report first, then Sheet.
function safeFetchGrid(id, token) {
  if (!id || /[^0-9]/.test(String(id))) return null;
  var urls = [
    'https://api.smartsheet.com/2.0/reports/' + id + '?pageSize=5000',
    'https://api.smartsheet.com/2.0/sheets/' + id
  ];
  for (var i = 0; i < urls.length; i++) {
    try {
      var res = UrlFetchApp.fetch(urls[i], { method: 'get', headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
      if (res.getResponseCode() === 200) return JSON.parse(res.getContentText());
    } catch (e) {}
  }
  return null;
}
function columnMap(r) { var m = {}; (r.columns || []).forEach(function (c) { var id = (c.virtualId != null ? c.virtualId : c.id); m[id] = c.title; }); return m; }
function rowObj(row, cm) { var o = {}; (row.cells || []).forEach(function (c) { var id = (c.virtualColumnId != null ? c.virtualColumnId : c.columnId); var t = cm[id]; if (t) o[t] = { v: c.value, d: c.displayValue }; }); return o; }

function gd(o, t) { var c = lookup(o, t); return c ? (c.d != null ? c.d : (c.v != null ? String(c.v) : '')) : ''; }
function gv(o, t) { var c = lookup(o, t); return c ? (c.v != null ? c.v : (c.d != null ? c.d : '')) : ''; }
// tolerant column lookup: exact -> ci-exact -> ci-contains
function lookup(o, t) {
  if (o[t] != null) return o[t];
  var keys = Object.keys(o), w = t.toLowerCase(), i;
  for (i = 0; i < keys.length; i++) if (keys[i].toLowerCase() === w) return o[keys[i]];
  for (i = 0; i < keys.length; i++) if (keys[i].toLowerCase().indexOf(w) !== -1) return o[keys[i]];
  return null;
}
function num(x) { if (x == null) return 0; if (typeof x === 'number') return x; var n = parseFloat(String(x).replace(/[$,]/g, '')); return isNaN(n) ? 0 : n; }
function dstr(x) { if (!x) return ''; x = String(x); return x.length >= 10 ? x.substring(0, 10) : x; }
// True ISO date or '' — guards against text typed into date columns (e.g. Actual COE).
function validDate(x) { var s = dstr(x); return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : ''; }

/* ============================ FORMAT / UTIL ============================ */

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
// "2026-09-30" -> "Sep 30, 2026" (attribution spans years, so the year shows).
function fullDate(iso) {
  var p = String(iso).split('-'); if (p.length < 3) return iso;
  var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return mon[parseInt(p[1], 10) - 1] + ' ' + parseInt(p[2], 10) + ', ' + p[0];
}
function normName(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); }

/* ======================= CLIENT NAME MERGING ======================= */
// Same rule as the Client & Revenue Dashboard (2026-10-09). Two spellings are one
// client when clientKey matches (case, punctuation, spaces, "&" vs "and", trailing
// Inc/LLC/Corp/Co ignored), or when the Client Merges tab of the FSE Portal
// Content sheet (Spelling | Show as) maps a spelling to a "Show as" name.
function clientKey(v) {
  var s = String(v == null ? '' : v).toLowerCase().replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ').trim();
  var prev;
  do { prev = s; s = s.replace(/\s+(inc|llc|corp|co)$/, ''); } while (s !== prev);
  return s.replace(/\s+/g, '');
}

// Client Merges tab -> { key: Show as }. Cached 10 minutes; fail-soft to {}.
function clientMerges(force) {
  var cache = CacheService.getScriptCache();
  try {
    if (!force) { var hit = cache.get('clientMerges'); if (hit) return JSON.parse(hit); }
    var map = {};
    var id = PropertiesService.getScriptProperties().getProperty('CONTENT_SHEET_ID');
    var sh = id ? SpreadsheetApp.openById(id).getSheetByName('Client Merges') : null;
    if (sh) {
      var v = sh.getDataRange().getValues();
      for (var i = 1; i < v.length; i++) {
        var from = normName(v[i][0]), to = normName(v[i][1]);
        if (!from || !to) continue;
        map[clientKey(from)] = to;
        map[clientKey(to)] = to;
      }
    }
    cache.put('clientMerges', JSON.stringify(map), 600);
    return map;
  } catch (e) { return {}; }
}

// Name -> { key, show }: show is the "Show as" name, or '' when unmapped.
function clientResolve(name, merges) {
  var k = clientKey(name), show = (merges && merges[k]) || '';
  return { key: show ? clientKey(show) : k, show: show };
}

/* ======================= CLIENT ATTRIBUTION ======================= */
// Who owns each client, across all five team sheets and all history (replaced
// the weekly fse-client-attribution job, 2026-10-09). Team = the sheet holding
// the client's most recently OPENED file (Actual COE when Open Date is blank),
// canceled and open files included; Sales Rep and Last Open come from that file.
// Built from the same five-sheet fetch as the company pulse, so the portalWarm
// trigger refreshes it every 10 minutes. Cached in ~90K chunks (CacheService
// caps a value at 100KB). Spellings of one client merge (CLIENT NAME MERGING).
// Returns [[client, team, rep, lastISO, otherSpellings], ...] A-Z, or null.
function attrIndex(force, grids) {
  var cache = CacheService.getScriptCache();
  try {
    if (!force) {
      var n = parseInt(cache.get('attrIdx_n'), 10);
      if (n > 0) {
        var ks = []; for (var i = 0; i < n; i++) ks.push('attrIdx_' + i);
        var got = cache.getAll(ks), parts = [];
        for (var j = 0; j < n; j++) { if (got[ks[j]] == null) { parts = null; break; } parts.push(got[ks[j]]); }
        if (parts) return JSON.parse(parts.join(''));
      }
    }
    grids = grids || portalFetchGrids();
    if (!grids) return null;
    var best = {}, seen = {};
    var merges = clientMerges(force);
    Object.keys(TEAMS).forEach(function (k) {
      if (!grids[k]) return;
      toRecords(grids[k]).forEach(function (r) {
        var name = normName(r.account), low = name.toLowerCase();
        if (!name || JUNK_CUSTOMERS.indexOf(low) !== -1 || /^\d+-[a-z]+$/i.test(name)) return;
        var rc = clientResolve(name, merges);
        if (!rc.key) return;
        (seen[rc.key] = seen[rc.key] || {})[low] = name;
        var d = r.openDate || r.closeDate || '';
        var cur = best[rc.key];
        if (cur && cur[3] >= d) return;
        best[rc.key] = [rc.show || name, TEAMS[k].label, r.rep === '(unassigned)' ? 'Unassigned' : r.rep, d];
      });
    });
    var idx = Object.keys(best).map(function (k) {
      var row = best[k], me = row[0].toLowerCase(), s = seen[k];
      row.push(Object.keys(s).filter(function (x) { return x !== me; })
        .map(function (x) { return s[x]; }).sort().join(' · '));
      return row;
    }).sort(function (a, b) { return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1; });
    var str = JSON.stringify(idx), CH = 90000, put = {}, c = 0;
    for (var p = 0; p < str.length; p += CH) put['attrIdx_' + (c++)] = str.slice(p, p + CH);
    put.attrIdx_n = String(c);
    cache.putAll(put, 1800);
    return idx;
  } catch (e) { return null; }
}

function out(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
function page(title, msg) { return HtmlService.createHtmlOutput('<div style="font-family:sans-serif;max-width:560px;margin:60px auto;padding:24px;background:#0f172a;color:#e2e8f0;border-radius:12px"><h2>' + esc(title) + '</h2><p style="color:#94a3b8">' + esc(msg) + '</p></div>').setTitle(title); }

/* ============================ DIAGNOSTIC ============================ */

// Run from the editor: Run > diagProjected. Computes several candidate
// definitions of "Projected This Month" on the FULL team sheet and logs each,
// so we can see which one equals the Gross Fees figure ($117,106 for Team 3),
// then lock that rule into the dashboard.
function diagProjected() {
  var token = PropertiesService.getScriptProperties().getProperty('SMARTSHEET_TOKEN');
  var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
  var ctx = dateContext(tz);
  var jun1 = ctx.monthStart, jun30 = ctx.monthEnd;
  function inMonth(d) { return d && d >= jun1 && d <= jun30; }

  Object.keys(TEAMS).forEach(function (k) {
    var t = TEAMS[k];
    Logger.log('--- ' + t.label + ' (sheet ' + t.sheet + ')  month ' + jun1 + ' .. ' + jun30);
    var g = safeFetchGrid(t.sheet, token);
    if (!g) { Logger.log('  NOT reachable'); return; }
    var recs = toRecords(g);

    var b = {};
    function add(name, r) { var s = b[name] || (b[name] = [0, 0]); s[0] += r.fees; s[1]++; }
    recs.forEach(function (r) {
      if (r.canceled) return;
      if (inMonth(r.closeDate)) add('closedActualMonth', r);                  // closed: Actual COE in month
      if (!r.closed) {                                                        // open (no Actual COE)
        if (inMonth(r.projDate))                   add('openProjMonth', r);   // proj this month
        else if (r.projDate && r.projDate < jun1)  add('openProjOverdue', r); // proj before this month, still open
        else if (r.projDate && r.projDate > jun30) add('openProjFuture', r);  // proj later
        else if (!r.projDate)                      add('openNoProj', r);      // no projected date
      }
      if (r.closed && inMonth(r.projDate)) add('closedProjMonth', r);         // closed but proj is this month
      if (inMonth(r.projDate))             add('anyProjMonth', r);            // anyone proj this month
    });
    function f(n) { return b[n] || [0, 0]; }
    function show(n) { var s = f(n); return money(s[0]) + ' (' + s[1] + ')'; }

    Logger.log('  closedActualMonth = ' + show('closedActualMonth'));
    Logger.log('  openProjMonth     = ' + show('openProjMonth'));
    Logger.log('  openProjOverdue   = ' + show('openProjOverdue'));
    Logger.log('  openProjFuture    = ' + show('openProjFuture'));
    Logger.log('  openNoProj        = ' + show('openNoProj'));
    Logger.log('  closedProjMonth   = ' + show('closedProjMonth'));
    Logger.log('  anyProjMonth      = ' + show('anyProjMonth'));
    var C1 = f('closedActualMonth')[0] + f('openProjMonth')[0];
    var C2 = C1 + f('openProjOverdue')[0];
    var C3 = C1 + f('openNoProj')[0];
    var C4 = C2 + f('openNoProj')[0];
    var C5 = f('anyProjMonth')[0];
    Logger.log('  CANDIDATES:');
    Logger.log('   C1 closed+openProjMonth ............... ' + money(C1));
    Logger.log('   C2 C1 + overdue open .................. ' + money(C2));
    Logger.log('   C3 C1 + no-proj-date open ............. ' + money(C3));
    Logger.log('   C4 C1 + overdue + no-proj ............. ' + money(C4));
    Logger.log('   C5 everyone projected this month ..... ' + money(C5));
  });
}

// Run from the editor: Run > diagSummary. Lists each team sheet's Sheet Summary
// fields — title, current value, and formula. This shows where the projected
// figure that feeds the Gross Fees Report is computed on the team sheet itself.
function diagSummary() {
  var token = PropertiesService.getScriptProperties().getProperty('SMARTSHEET_TOKEN');
  Object.keys(TEAMS).forEach(function (k) {
    var t = TEAMS[k];
    Logger.log('--- ' + t.label + ' summary fields (sheet ' + t.sheet + ')');
    try {
      var res = UrlFetchApp.fetch('https://api.smartsheet.com/2.0/sheets/' + t.sheet + '/summary',
        { headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
      if (res.getResponseCode() !== 200) {
        Logger.log('  HTTP ' + res.getResponseCode() + ' — ' + res.getContentText().slice(0, 200));
        return;
      }
      var j = JSON.parse(res.getContentText());
      var fields = j.fields || j.data || [];
      if (!fields.length) { Logger.log('  (no summary fields on this sheet)'); return; }
      fields.forEach(function (f) {
        var val = (f.displayValue != null) ? f.displayValue
                : (f.objectValue != null) ? JSON.stringify(f.objectValue)
                : f.value;
        Logger.log('  • "' + f.title + '" = ' + val + (f.formula ? '   [formula: ' + f.formula + ']' : ''));
      });
    } catch (e) { Logger.log('  ERROR ' + e); }
  });
}

// Run from the editor: Run > diag. Logs columns, a parse sample, and the
// "Projected This Month" breakdown (Closed MTD + open-projected) for each team.
function diag() {
  var token = PropertiesService.getScriptProperties().getProperty('SMARTSHEET_TOKEN');
  var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
  var ctx = dateContext(tz);
  Object.keys(TEAMS).forEach(function (k) {
    var t = TEAMS[k];
    Logger.log('--- ' + t.label + ' (sheet ' + t.sheet + ')');
    var g = safeFetchGrid(t.sheet, token);
    if (!g) { Logger.log('  NOT reachable — ID wrong or token lacks access.'); return; }
    var cm = columnMap(g), titles = Object.keys(cm).map(function (id) { return cm[id]; });
    Logger.log('  columns: ' + titles.join(' | '));
    var recs = toRecords(g);
    Logger.log('  rows: ' + recs.length + ' | sample acct/open/close/fees: ' +
      (recs[0] ? [recs[0].account, recs[0].openDate, recs[0].closeDate, recs[0].fees].join(' / ') : 'none'));
    var closedMTD = eventRows(recs, 'closed', 'mtd', ctx);
    var openProj  = eventRows(recs, 'projected', 'thisMonth', ctx);
    var fc = sumFees(closedMTD), fp = sumFees(openProj);
    Logger.log('  Projected This Month (on-sheet): ' + money(fc + fp) +
      ' (' + money(fc) + ' closed + ' + money(fp) + ' to close)');
  });
}

/* ============================ STYLES ============================ */

function css() {
  return '<style>' +
  ':root{--bg:#0f172a;--card:#1e293b;--border:#334155;--bd2:#28344a;--text:#e2e8f0;--head:#f1f5f9;--muted:#94a3b8;--faint:#64748b;--pill:#334155;--pilltext:#cbd5e1;--star:#fbbf24;--money:#34d399;--portal:#818cf8;--mono:#cbd5e1;--ki:#312e81;--ke:#064e3b;--ka:#78350f;--ks:#334155;--barO:#818cf8;--barC:#34d399}' +
  '[data-theme="light"]{--bg:#f8fafc;--card:#ffffff;--border:#e2e8f0;--bd2:#f1f5f9;--text:#334155;--head:#1e293b;--muted:#94a3b8;--faint:#94a3b8;--pill:#f1f5f9;--pilltext:#64748b;--star:#f59e0b;--money:#059669;--portal:#4f46e5;--mono:#334155;--ki:#eef2ff;--ke:#ecfdf5;--ka:#fffbeb;--ks:#f1f5f9;--barO:#6366f1;--barC:#059669}' +
  '*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
  '.wrap{max-width:960px;margin:0 auto;padding:20px}' +
  '.top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;gap:12px;flex-wrap:wrap}.actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}' +
  '.h1{font-size:22px;font-weight:700;margin:0;display:flex;align-items:center;gap:8px;color:var(--head)}.star{color:var(--star)}' +
  '.sub{color:var(--muted);font-size:13px;margin-top:2px}' +
  '.btn{display:inline-flex;align-items:center;gap:6px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:8px 12px;font-size:13px;font-weight:600;color:var(--text);text-decoration:none;cursor:pointer}' +
  '.tswitch{display:flex;flex-wrap:wrap;gap:4px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:3px}' +
  '.tbtn{font-size:12px;font-weight:600;color:var(--muted);text-decoration:none;padding:5px 10px;border-radius:6px}.tbtn.on{background:var(--pill);color:var(--head)}' +
  '.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}@media(max-width:640px){.kpis{grid-template-columns:repeat(2,1fr)}}' +
  '.kpi{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px}' +
  '.kdot{width:24px;height:24px;border-radius:7px;margin-bottom:11px}' +
  '.kdot.proj{background:#34d399}.kdot.open{background:#64748b}.kdot.closed{background:#38bdf8}.kdot.prev{background:#a78bfa}.kdot.fee{background:#fbbf24}.kdot.days{background:#fb7185}' +
  '.kdot.i{background:var(--ki)}.kdot.e{background:var(--ke)}.kdot.a{background:var(--ka)}.kdot.s{background:var(--ks)}.kdot.g{background:#34d399}' +
  '.klabel{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600}.kval{font-size:23px;font-weight:700;color:var(--head);line-height:1.15;margin-top:5px}.ksub{font-size:12px;color:var(--muted);margin-top:5px}' +
  '.kgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}@media(max-width:640px){.kgrid{grid-template-columns:repeat(2,1fr)}}' +
  '.kcell{background:var(--bd2);border:1px solid var(--border);border-radius:10px;padding:13px 14px;min-width:0}' +
  '.kcl{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:600}.kcv{font-size:22px;font-weight:700;color:var(--head);line-height:1.15;margin-top:5px}.kcv.green{color:var(--money)}.kcs{font-size:12px;color:var(--muted);margin-top:4px}' +
  '.card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:18px;margin-bottom:16px}' +
  '.shead{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:8px}.stitle{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.stitle h2{font-size:17px;font-weight:600;margin:0;color:var(--head)}' +
  '.snote{font-size:12px;color:var(--muted)}.sright{display:flex;align-items:center;gap:8px}.pill{font-size:11px;color:var(--pilltext);background:var(--pill);border-radius:999px;padding:2px 8px}' +
  '.scroll{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}' +
  'th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600;padding:6px 10px 6px 0;border-bottom:1px solid var(--border)}' +
  'td{padding:9px 10px 9px 0;border-bottom:1px solid var(--bd2)}.num{text-align:right}.money{font-weight:600;color:var(--money)}.mono{font-family:ui-monospace,Menlo,monospace;font-size:12px;color:var(--mono)}.muted{color:var(--muted)}' +
  'table.rank td.rk{color:var(--faint);width:26px;font-weight:600}' +
  '.empty{color:var(--faint);font-size:13px;padding:10px 0}.hint{font-size:12px;color:var(--faint);margin:10px 0 0}' +
  '.lookup{width:100%;max-width:360px;background:var(--bd2);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:9px 11px;font-size:14px;font-weight:600;margin-bottom:10px}' +
  '.looklist{display:flex;flex-direction:column;gap:2px;margin-bottom:10px;max-width:360px}' +
  '.lookrow{padding:8px 11px;border:1px solid var(--border);border-radius:8px;background:var(--bd2);font-size:13px;font-weight:500;color:var(--text);cursor:pointer}.lookrow:hover{border-color:var(--portal)}' +
  '.lookname{font-size:15px;font-weight:600;color:var(--head);margin-bottom:10px}' +
  '.kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}' +
  '.kvc{background:var(--bd2);border:1px solid var(--border);border-radius:10px;padding:12px}.kvl{font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600}.kvv{font-size:18px;font-weight:600;margin-top:4px;color:var(--head)}' +
  'tr.cur td{background:var(--bd2);font-weight:600}.tag{font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--portal);font-weight:600;margin-left:6px}' +
  '.glegend{display:flex;gap:16px;align-items:center;font-size:12px;color:var(--muted);margin-bottom:10px;flex-wrap:wrap}.glegend span{display:inline-flex;align-items:center;gap:6px}.sw{width:11px;height:11px;border-radius:3px;display:inline-block}.sw.c{background:var(--barC)}.sw.o{background:var(--barO)}.gnote{color:var(--faint);font-size:11px}' +
  '.rctl{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;margin-bottom:14px}.rdates{display:flex;flex-direction:column;gap:8px}.rdrow{display:flex;gap:10px;flex-wrap:wrap}.rfld{display:flex;flex-direction:column;gap:4px;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);font-weight:600}' +
  '.rin{background:var(--bd2);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:8px 10px;font-size:13px;font-weight:600;color-scheme:dark}[data-theme="light"] .rin{color-scheme:light}' +
  '.rcl{position:relative;flex:1;min-width:200px;max-width:320px}.rcl .rin{width:100%;padding-right:28px}.rx{position:absolute;right:6px;bottom:6px;background:none;border:0;color:var(--muted);font-size:16px;cursor:pointer;line-height:1}' +
  '.rlist{position:absolute;top:100%;left:0;right:0;z-index:5;margin-top:4px;text-transform:none;letter-spacing:0}.rlist .lookrow{background:var(--card)}' +
  '.rquick{display:flex;gap:6px;flex-wrap:wrap}.rq{background:var(--bd2);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:7px 12px;font-size:13px;font-weight:600;cursor:pointer}.rq:hover{border-color:var(--portal)}.rq.on{background:var(--portal);border-color:var(--portal);color:var(--bg)}' +
  'tr.rtot td{border-top:2px solid var(--border);border-bottom:0;font-weight:700;color:var(--head);padding-top:10px}' +
  '.foot{text-align:center;color:var(--faint);font-size:12px;margin-top:8px}' +
  '</style>';
}