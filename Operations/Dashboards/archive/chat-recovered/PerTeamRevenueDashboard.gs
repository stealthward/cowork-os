/**
 * Per-Team Revenue Dashboard — one Apps Script web app, three escrow teams.
 *
 *   <exec-url>?team=jd        -> JD Unit dashboard
 *   <exec-url>?team=team3     -> Team 3 dashboard
 *   <exec-url>?team=team7     -> Team 7 dashboard
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
 *   All three teams render the same MODULES list; only the sheet ID differs.
 */

/* ============================ CONFIG ============================ */

var TEAMS = {
  jd:    { label: 'JD Unit', sheet: '6403198558359428' },
  team3: { label: 'Team 3',  sheet: '339384860993412'  },
  team7: { label: 'Team 7',  sheet: '307047045588868'  byType: function (mod, m) {
    var opened = eventRows(m.records, 'opened', mod.window, m.ctx);
    var g = {};
    opened.forEach(function (r) { var s = g[r.type] || (g[r.type] = { type: r.type, n: 0, fees: 0 }); s.n++; s.fees += r.fees; });
    var rows = Object.keys(g).map(function (k) { return g[k]; }).sort(function (a, b) { return b.n - a.n; });
    if (!rows.length) return card(mod.title, '', 0, '<p class="empty">No opens in window.</p>');
    var bd = rows.map(function (d) {
      return '<tr><td>' + esc(d.type) + '</td><td class="num">' + d.n + '</td><td class="num money">' + money(d.fees) + '</td></tr>';
    }).join('');
    var tbl = '<div class="scroll"><table><thead><tr><th>Type</th><th class="num">Opened</th>' +
      '<th class="num">Open Fees</th></tr></thead><tbody>' + bd + '</tbody></table></div>';
    return card(mod.title, 'By files opened', rows.length, tbl);
  },

  newVsRepeat: function (mod, m) {
    var opened = eventRows(m.records, 'opened', mod.window, m.ctx);
    var nw = 0, rp = 0;
    opened.forEach(function (r) { if (r.firstEscrow) nw++; else rp++; });
    var tot = nw + rp, pct = tot ? Math.round(nw / tot * 100) : 0;
    var inner = '<div class="kv">' +
      kvCell('New Clients', nw) + kvCell('Repeat', rp) + kvCell('% New', pct + '%') + '</div>' +
      '<p class="hint">Based on the 1st Escrow flag, files opened in window.</p>';
    return card(mod.title, '', tot, inner);
  }
};

/* ============================ RENDER HELPERS ============================ */

function monthLabel(k) {
  var p = k.split('-'); if (p.length < 2) return k;
  var mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return mon[(+p[1]) - 1] + ' ' + p[0];
}
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
var STATUS_CANCELED = 'Canceled';

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
  { type:'closingSoon',  title:'Closing — Next 7 Days', days:7 },
  { type:'topClients',   title:'Top 10 Clients (12 mo)', window:'t12m', n:10 },
  { type:'clientLookup', title:'Client Lookup (12 mo)',  window:'t12m' }
];

/* ============================ ENTRY ============================ */

function doGet(e) {
  var props = PropertiesService.getScriptProperties();
  var wantJson = !!(e && e.parameter && e.parameter.format === 'json');
  var selfUrl = ScriptApp.getService().getUrl();

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
    json: { team: key, label: team.label, count: records.length, asOf: ctx.today }
  };
}

// Full-column rows: every sheet column is in `raw`; common fields are normalized.
function toRecords(grid) {
  var cm = columnMap(grid);
  return (grid.rows || []).map(function (r) {
    var o = rowObj(r, cm);
    var status   = gd(o, COL.status);
    var closeISO = validDate(gv(o, COL.closeDate));  // Actual COE date, or '' 
    var projISO  = validDate(gv(o, COL.projDate));   // Projected COE date, or ''
    return {
      account:     gd(o, COL.account) || '(none)',
      fees:        num(gv(o, COL.fees)),
      openDate:    validDate(gv(o, COL.openDate)),
      closeDate:   closeISO,
      projDate:    projISO,
      status:      status,
      canceled:    status === STATUS_CANCELED,
      closed:      !!closeISO,                  // closed = Actual COE holds a date
      open:        !closeISO && status !== STATUS_CANCELED,  // currently in escrow
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
    var data = {};
    function slot(a) {
      return data[a] || (data[a] = { account: a, opened: 0, inEscrow: 0, closed: 0,
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
    if (!keys.length) return card(mod.title, '', '\u2014', '<p class="empty">No client activity in window.</p>');

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
    var json = JSON.stringify(summary).replace(/</g, '\\u003c');
    var uid = 'cl_' + Math.floor(Math.random() * 1e6);

    var inner =
      '<input class="lookup" id="' + uid + '_q" type="text" autocomplete="off" placeholder="Type a client name\u2026">' +
      '<div id="' + uid + '_list" class="looklist"></div>' +
      '<div id="' + uid + '_out" class="lookout"><p class="empty">Start typing to find a client.</p></div>' +
      '<script>(function(){var D=' + json + ';var KEYS=Object.keys(D);' +
      'var q=document.getElementById("' + uid + '_q"),L=document.getElementById("' + uid + '_list"),o=document.getElementById("' + uid + '_out");' +
      'function cell(l,v){return \'<div class="kvc"><div class="kvl">\'+l+\'</div><div class="kvv">\'+v+\'</div></div>\';}' +
      'function detail(k){var d=D[k];o.innerHTML=\'<div class="lookname">\'+k+\'</div><div class="kv">\'+' +
      'cell("Opened",d.opened)+cell("In Escrow",d.inEscrow)+cell("Closed",d.closed)+cell("Cancelled",d.cancelled)+' +
      'cell("Closed Fees (12 mo)",d.closedFees)+cell("Avg Fee / Closed",d.avgFee)+cell("Last Open",d.lastOpen)+\'</div>\';}' +
      'function render(){var t=q.value.trim().toLowerCase();L.innerHTML="";if(!t){return;}' +
      'var hits=KEYS.filter(function(k){return k.toLowerCase().indexOf(t)!==-1;}).slice(0,12);' +
      'if(!hits.length){L.innerHTML=\'<div class="lookrow muted">No match</div>\';return;}' +
      'hits.forEach(function(k){var row=document.createElement("div");row.className="lookrow";row.textContent=k;' +
      'row.addEventListener("click",function(){q.value=k;L.innerHTML="";detail(k);});L.appendChild(row);});}' +
      'q.addEventListener("input",render);})();</script>';
    return card(mod.title, 'Type to search \u00b7 trailing 12 months', keys.length, inner);
  },

  closingSoon: function (mod, m) {
    var rows = m.records.filter(function (r) {
      return !r.closed && !r.canceled && r.projDate &&
             r.projDate >= m.ctx.today && r.projDate <= m.ctx.next7End;
    }).sort(function (a, b) { return a.projDate < b.projDate ? -1 : 1; });

    if (!rows.length) return card(mod.title, '', 0, '<p class="empty">Nothing projected to close in the next 7 days.</p>');
    var total = sumFees(rows);
    var body = rows.map(function (r) {
      return '<tr><td>' + esc(labelFromISO(r.projDate, true)) + '</td><td class="mono">' + esc(r.escrowNo) +
        '</td><td>' + esc(r.address) + '</td><td class="muted">' + esc(r.account) +
        '</td><td class="num money">' + money(r.fees) + '</td></tr>';
    }).join('');
    var tbl = '<div class="scroll"><table><thead><tr><th>Proj COE</th><th>Escrow #</th><th>Property</th>' +
      '<th>Client</th><th class="num">Fees</th></tr></thead><tbody>' + body +
      '</tbody></table></div><p class="hint">Projected fees in window: ' + money(total) + '</p>';
    return card(mod.title, '', rows.length, tbl);
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

  byRep: function (mod, m) {
    var opened = eventRows(m.records, 'opened', mod.window, m.ctx);
    var closed = eventRows(m.records, 'closed', mod.window, m.ctx);
    var g = {};
    function slot(a) { return g[a] || (g[a] = { rep: a, opened: 0, closed: 0, fees: 0 }); }
    opened.forEach(function (r) { slot(r.rep).opened++; });
    closed.forEach(function (r) { var s = slot(r.rep); s.closed++; s.fees += r.fees; });
    var rows = Object.keys(g).map(function (k) { return g[k]; })
      .sort(function (a, b) { return b.fees - a.fees; });
    if (!rows.length) return card(mod.title, '', 0, '<p class="empty">No activity in window.</p>');
    var bd = rows.map(function (d) {
      return '<tr><td>' + esc(d.rep) + '</td><td class="num">' + d.opened + '</td><td class="num">' +
        d.closed + '</td><td class="num money">' + money(d.fees) + '</td></tr>';
    }).join('');
    var tbl = '<div class="scroll"><table><thead><tr><th>Sales Rep</th><th class="num">Opens</th>' +
      '<th class="num">Closes</th><th class="num">Closed Fees</th></tr></thead><tbody>' + bd + '</tbody></table></div>';
    return card(mod.title, '', rows.length, tbl);
  },

  byType: function (mod, m) {
    var opened = eventRows(m.records, 'opened', mod.window, m.ctx);
    var g = {};
    opened.forEach(function (r) { var s = g[r.type] || (g[r.type] = { type: r.type, n: 0, fees: 0 }); s.n++; s.fees += r.fees; });
    var rows = Object.keys(g).map(function (k) { return g[k]; }).sort(function (a, b) { return b.n - a.n; });
    if (!rows.length) return card(mod.title, '', 0, '<p class="empty">No opens in window.</p>');
    var bd = rows.map(function (d) {
      return '<tr><td>' + esc(d.type) + '</td><td class="num">' + d.n + '</td><td class="num money">' + money(d.fees) + '</td></tr>';
    }).join('');
    var tbl = '<div class="scroll"><table><thead><tr><th>Type</th><th class="num">Opened</th>' +
      '<th class="num">Open Fees</th></tr></thead><tbody>' + bd + '</tbody></table></div>';
    return card(mod.title, 'By files opened', rows.length, tbl);
  },

  newVsRepeat: function (mod, m) {
    var opened = eventRows(m.records, 'opened', mod.window, m.ctx);
    var nw = 0, rp = 0;
    opened.forEach(function (r) { if (r.firstEscrow) nw++; else rp++; });
    var tot = nw + rp, pct = tot ? Math.round(nw / tot * 100) : 0;
    var inner = '<div class="kv">' +
      kvCell('New Clients', nw) + kvCell('Repeat', rp) + kvCell('% New', pct + '%') + '</div>' +
      '<p class="hint">Based on the 1st Escrow flag, files opened in window.</p>';
    return card(mod.title, '', tot, inner);
  }
};

/* ============================ RENDER HELPERS ============================ */

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
  '.tswitch{display:flex;gap:4px;background:var(--card);border:1px solid var(--border);border-radius:8px;padding:3px}' +
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
  '.foot{text-align:center;color:var(--faint);font-size:12px;margin-top:8px}' +
  '</style>';
}
