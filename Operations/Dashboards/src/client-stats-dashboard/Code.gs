/*************************************************************************************
 * FSE CLIENT & REVENUE DASHBOARD
 * -----------------------------------------------------------------------------------
 * Standalone Apps Script web app. Single data source: the team Smartsheets listed in
 * CONFIG.teams (JD Unit / Team 3 / Team 5 / Team 7 / Team 9), combined into one
 * company dataset.
 *
 * REVENUE BASIS (gross escrow fees, closed):
 *   A file counts when it has a valid Actual COE date and File Status is not
 *   "Canceled". No File Status = "Closed" filter and no de-duplication, matching the
 *   Company Dashboard so the two reconcile.
 *   - Escrow Fees is the only fee column on each sheet, so it IS gross fees.
 *
 * WINDOWS (by Actual COE):
 *   - 365-Day : trailing 365 days
 *   - YTD     : Jan 1 (current year) through today
 *
 * GROUPING: revenue groups by the raw Directing Customer string (so it reconciles
 *   with the Company Dashboard). Only the attribution lookup merges names.
 *
 * NAME MERGING (attribution lookup and the table's Team / Sales Rep, 2026-10-09):
 *   two spellings are one client when clientKey_ matches (case, punctuation, spaces,
 *   "&" vs "and", trailing Inc/LLC/Corp/Co ignored), or when the Client Merges tab
 *   of the FSE Portal Content sheet maps a spelling to a "Show as" name.
 *
 * ATTRIBUTION (who owns a client; replaced the weekly fse-client-attribution job
 *   2026-10-09): every file on the five sheets, all history, canceled included.
 *   Team = the sheet holding the client's most recently OPENED file; Sales Rep and
 *   Last Open come from that same file. The search box looks up every client this
 *   way, and the table's Team and Sales Rep columns use the same rule.
 *
 * FILE HISTORY (2026-10-30): clicking a client opens a panel with every file for that
 *   client on the five sheets, all history, canceled and open included, filtered in the
 *   page by report type, date range, team, and a Show canceled box. The rows load on
 *   demand through getClientFiles(), from a CacheService copy written on every page
 *   build, so the page itself does not grow.
 *
 * SETUP (one time, this project only):
 *   Project Settings (gear) > Script properties > add:
 *     SMARTSHEET_TOKEN = <your Smartsheet API token>
 *
 * RECONCILE: run diagRevenue() from the editor and read the Executions log to compare
 *   per-team and per-month gross fees against the Gross Fees report.
 *
 * DEPLOY:  Deploy > New deployment > Web app
 *   Execute as: Me   |   Who has access: Anyone within brettward.net
 *   Redeploy to keep the /exec URL: Manage deployments > pencil > New version > Deploy
 *************************************************************************************/

/*************************** CONFIG ***************************/
var CONFIG = {
  tokenProperty: 'SMARTSHEET_TOKEN',
  timezone: 'America/Los_Angeles',
  teams: [
    { name: 'JD Unit', sheetId: '6403198558359428' },
    { name: 'Team 3',  sheetId: '339384860993412'  },
    { name: 'Team 5',  sheetId: '8144815540987780' },
    { name: 'Team 7',  sheetId: '307047045588868'  },
    { name: 'Team 9',  sheetId: '2609780876437380' }
  ],
  col: {
    directingCustomer: 'Directing Customer',
    salesRep:          'Sales Rep',
    escrowFees:        'Escrow Fees',
    actualCoe:         'Actual COE',
    openDate:          'Open Date',
    fileStatus:        'File Status',
    propertyAddress:   'Property Address',
    escrowNumber:      'Escrow #',
    projectedCoe:      'Projected COE'
  },
  canceledValue: 'canceled',   // File Status value marking a dead file (lowercased), matches company dashboard
  blankCustomerLabel: '(No Directing Customer)',
  // Placeholder customer names left out of the attribution lookup (lowercased).
  // Any value shaped like a file number (digits-letters) is skipped too.
  junkCustomers: ['na', 'n/a', 'previous buyer', 'fsbo (michael libutti prev seller)'],
  // Client Merges tab (Spelling | Show as) in the FSE Portal Content sheet.
  contentSheetId: '1i59Xa138I7evQRt2vygVTv2eLvp1J69_LcwVr3YQwho',
  mergeTab: 'Client Merges'
};

// Bump this whenever the code changes so you can confirm which build the /exec URL serves.
var BUILD = '2026-10-30 file history';

/*************************** WEB APP ENTRY ***************************/
function doGet(e) {
  e = e || {};
  var q = e.parameter || {};
  // Live diagnostic: <exec-url>?debug=WeRevive  -> plain JSON of what the DEPLOYED code computes.
  if (q.debug) {
    return ContentService.createTextOutput(debugClient_(q.debug))
      .setMimeType(ContentService.MimeType.JSON);
  }
  // <exec-url>?files=WeRevive -> plain JSON of the file history rows for that client.
  if (q.files) {
    return ContentService.createTextOutput(JSON.stringify(getClientFiles(q.files), null, 1))
      .setMimeType(ContentService.MimeType.JSON);
  }
  var payload = buildPayload_();
  return HtmlService.createHtmlOutput(getHtml_(payload))
    .setTitle('FSE Client & Revenue Dashboard')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Returns the deployed build + a named client's computed figures in each window.
function debugClient_(name) {
  var p = buildPayload_();
  var out = { build: BUILD, generatedAt: p.generatedAt, query: name,
              sheetRows: (p.meta && p.meta.sheetRows) || {}, closedFiles: p.meta && p.meta.closed,
              clientsIndexed: p.owners.length };
  var nk = resolveClient_(name, loadMerges_()).key;
  out.mergeRows = p.mergeRows;
  out.mergeError = p.mergeError || '';
  out.owner = 'not found';
  p.owners.forEach(function (o) {
    if (clientKey_(o[0]) === nk) out.owner = { client: o[0], team: o[1], salesRep: o[2], lastOpen: o[3], alsoTypedAs: o[4] || '' };
  });
  ['365', 'ytd'].forEach(function (w) {
    var win = p.windows[w];
    var hit = null;
    win.clients.forEach(function (c) { if (c.name.toLowerCase() === String(name).toLowerCase()) hit = c; });
    out[win.label] = hit
      ? { escrowFees: Math.round(hit.sum), team: hit.team, files: hit.fileCount, rank: hit.rank, byTeam: hit.byTeam }
      : 'not found';
  });
  return JSON.stringify(out, null, 2);
}

function getDashboardData() {
  return buildPayload_();
}

/*************************** DATA PIPELINE ***************************/
function buildRecords_() {
  var token = PropertiesService.getScriptProperties().getProperty(CONFIG.tokenProperty);
  if (!token) {
    throw new Error('Missing script property "' + CONFIG.tokenProperty +
      '". Add it under Project Settings > Script properties.');
  }

  var records = [];
  var owners = {};   // attribution index: merged client key -> latest-opened file
  var files = {};    // file history: merged client key -> every file (noteFile_)
  var merges = loadMerges_();
  var stats = { scanned: 0, closed: 0, canceled: 0, byTeam: {}, sheetRows: {} };

  CONFIG.teams.forEach(function (team) {
    var sheet = fetchTeam_(team, token);
    var idx = resolveColumns_(sheet.columns, team.name);
    stats.byTeam[team.name] = 0;
    stats.sheetRows[team.name] = (sheet.rows || []).length;

    (sheet.rows || []).forEach(function (row) {
      stats.scanned++;
      var cellById = {};
      (row.cells || []).forEach(function (c) { cellById[c.columnId] = c; });
      noteOwner_(owners, team.name, cellById, idx, merges);
      noteFile_(files, team.name, cellById, idx, merges);

      // ---- Curation matched to the Company Dashboard (buildFiles/topClients) ----
      // Closed revenue = any file with an Actual COE that is NOT canceled.
      // No File Status = "Closed" filter, no de-duplication, grouped by the raw
      // Directing Customer string, so the two dashboards reconcile.
      var status = String(cellVal_(cellById, idx.fileStatus) || '').trim();
      if (status.toLowerCase() === CONFIG.canceledValue) { stats.canceled++; return; }

      var coe = parseDate_(cellVal_(cellById, idx.actualCoe));
      if (!coe) return; // no Actual COE = still in pipeline, not closed

      var rawCust = String(cellVal_(cellById, idx.directingCustomer) || '').trim();
      var displayCust = rawCust || CONFIG.blankCustomerLabel;
      var fee = parseMoney_(cellVal_(cellById, idx.escrowFees));
      var openD = parseDate_(cellVal_(cellById, idx.openDate));

      records.push({
        team: team.name,
        customer: displayCust,
        key: displayCust,          // group by raw Directing Customer, like the company dashboard
        fee: fee,
        coe: coe,
        openTs: openD ? openD.getTime() : 0,
        address: String(cellVal_(cellById, idx.propertyAddress) || '').trim(),
        escrow: String(cellVal_(cellById, idx.escrowNumber) || '').trim()
      });
      stats.closed++;
      stats.byTeam[team.name] += fee;
    });
  });

  stats.mergeRows = merges.rows;
  stats.mergeError = merges.error;
  return { records: records, stats: stats, owners: owners, merges: merges, files: files };
}

// File history: every row with a Directing Customer, canceled and open included,
// grouped by merged client key as [open, escrow #, property, team, sales rep, status,
// actual COE, projected COE, fee, canceled 1/0]. Dates are yyyy-MM-dd or ''.
function noteFile_(files, teamName, cellById, idx, merges) {
  var name = normName_(cellVal_(cellById, idx.directingCustomer));
  if (!name) return;
  var key = resolveClient_(name, merges).key;
  if (!key) return;
  var status = normName_(cellVal_(cellById, idx.fileStatus));
  (files[key] = files[key] || []).push([
    isoDate_(cellVal_(cellById, idx.openDate)),
    normName_(cellVal_(cellById, idx.escrowNumber)),
    normName_(cellVal_(cellById, idx.propertyAddress)),
    teamName,
    normName_(cellVal_(cellById, idx.salesRep)),
    status,
    isoDate_(cellVal_(cellById, idx.actualCoe)),
    isoDate_(cellVal_(cellById, idx.projectedCoe)),
    Math.round(parseMoney_(cellVal_(cellById, idx.escrowFees)) * 100) / 100,
    status.toLowerCase() === CONFIG.canceledValue ? 1 : 0
  ]);
}

// The file history copy in CacheService: { f: files by key, m: Client Merges map },
// in 90K chunks (a cache value holds 100 KB). Written on every page build and
// Refresh; read by getClientFiles(). Fail-soft both ways.
var HIST_CACHE = 'hist';
function cacheFiles_(files, map) {
  try {
    var str = JSON.stringify({ f: files, m: map }), put = {}, n = 0;
    for (var i = 0; i < str.length; i += 90000) put[HIST_CACHE + '_' + (n++)] = str.substring(i, i + 90000);
    var cache = CacheService.getScriptCache();
    cache.putAll(put, 21600);
    cache.put(HIST_CACHE, String(n), 21600);
  } catch (e) {}
}
function readFiles_() {
  try {
    var cache = CacheService.getScriptCache(), n = Number(cache.get(HIST_CACHE)) || 0, keys = [];
    if (!n) return null;
    for (var i = 0; i < n; i++) keys.push(HIST_CACHE + '_' + i);
    var got = cache.getAll(keys), str = '';
    for (var j = 0; j < n; j++) { if (got[keys[j]] == null) return null; str += got[keys[j]]; }
    return JSON.parse(str);
  } catch (e) { return null; }
}

// Called from the page (google.script.run): every file for one client, all spellings.
// A cold cache rebuilds from the sheets (about 10 seconds).
function getClientFiles(name) {
  var hit = readFiles_();
  if (!hit) {
    var built = buildRecords_();
    hit = { f: built.files, m: built.merges.map };
    cacheFiles_(hit.f, hit.m);
  }
  var key = resolveClient_(normName_(name), { map: hit.m }).key;
  return { name: String(name), rows: hit.f[key] || [] };
}

function isoDate_(v) {
  var d = parseDate_(v);
  return d ? Utilities.formatDate(d, CONFIG.timezone, 'yyyy-MM-dd') : '';
}

// Attribution: keep the client's most recently opened file (Actual COE stands in
// when Open Date is blank). Every file counts, canceled or still open. Spellings
// of one client share a key; every spelling seen is kept for the search box.
function noteOwner_(owners, teamName, cellById, idx, merges) {
  var name = normName_(cellVal_(cellById, idx.directingCustomer));
  var low = name.toLowerCase();
  if (!name || CONFIG.junkCustomers.indexOf(low) !== -1 || /^\d+-[a-z]+$/i.test(name)) return;
  var rc = resolveClient_(name, merges);
  if (!rc.key) return;
  var d = parseDate_(cellVal_(cellById, idx.openDate)) || parseDate_(cellVal_(cellById, idx.actualCoe));
  var ts = d ? d.getTime() : 0;
  var cur = owners[rc.key];
  if (!cur) cur = owners[rc.key] = { name: rc.show || name, team: teamName, ts: -1, rep: 'Unassigned', seen: {} };
  cur.seen[low] = name;
  if (cur.ts >= ts) return;
  cur.ts = ts;
  cur.team = teamName;
  cur.name = rc.show || name;
  cur.rep = String(cellVal_(cellById, idx.salesRep) || '').trim() || 'Unassigned';
}

function normName_(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); }

// Merge key: lowercase, "&" = "and", punctuation and spaces dropped, trailing
// Inc / LLC / Corp / Co dropped. "Bay Equity, LLC" and "BayEquity" share a key.
function clientKey_(v) {
  var s = String(v == null ? '' : v).toLowerCase().replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ').trim();
  var prev;
  do { prev = s; s = s.replace(/\s+(inc|llc|corp|co)$/, ''); } while (s !== prev);
  return s.replace(/\s+/g, '');
}

// Client Merges tab -> { map: key -> Show as, rows: count }. Fail-soft: an
// unreadable or missing tab means only the key rule merges.
function loadMerges_() {
  var out = { map: {}, rows: 0, error: '' };
  try {
    var sh = SpreadsheetApp.openById(CONFIG.contentSheetId).getSheetByName(CONFIG.mergeTab);
    if (!sh) { out.error = 'tab "' + CONFIG.mergeTab + '" not found'; return out; }
    var v = sh.getDataRange().getValues();
    for (var i = 1; i < v.length; i++) {
      var from = normName_(v[i][0]), to = normName_(v[i][1]);
      if (!from || !to) continue;
      out.map[clientKey_(from)] = to;
      out.map[clientKey_(to)] = to;
      out.rows++;
    }
  } catch (e) { out.error = String((e && e.message) || e); }   // tab unreadable: key rule only
  return out;
}

// Run from the editor: Run > diagMerges. Logs how many Client Merges rows load,
// or why the tab could not be read (also shown as mergeError in ?debug=).
function diagMerges() {
  var m = loadMerges_();
  Logger.log('Client Merges rows: ' + m.rows + (m.error ? ' | error: ' + m.error : ''));
}

// Run from the editor: Run > diagMergeRows (read-only on Smartsheet). Lists every
// team-sheet row whose Directing Customer maps to a different "Show as" name, newest
// Open Date first, into the "Client Merges Row List" tab of the FSE Portal Content
// sheet (replaced on each run). Kind: misspelling (a Client Merges spelling) or
// variant (punctuation, case, or spacing of the Show as name). Source cleanup, 2026-10-12.
function diagMergeRows() {
  var token = PropertiesService.getScriptProperties().getProperty(CONFIG.tokenProperty);
  var merges = loadMerges_();
  if (merges.error) throw new Error('Client Merges unreadable: ' + merges.error);
  var out = [], counts = {};
  CONFIG.teams.forEach(function (team) {
    var sheet = fetchTeam_(team, token);
    var idx = resolveColumns_(sheet.columns, team.name);
    (sheet.rows || []).forEach(function (row) {
      var cellById = {};
      (row.cells || []).forEach(function (c) { cellById[c.columnId] = c; });
      var raw = String(cellVal_(cellById, idx.directingCustomer) || '');
      var name = normName_(raw);
      if (!name) return;
      var rc = resolveClient_(name, merges);
      if (!rc.show || raw === rc.show) return;
      var kind = clientKey_(name) === clientKey_(rc.show) ? 'variant' : 'misspelling';
      var od = parseDate_(cellVal_(cellById, idx.openDate));
      out.push([team.name, team.sheetId, String(row.id), String(idx.directingCustomer),
                String(cellVal_(cellById, idx.escrowNumber) || ''), od ? fmtDate_(od) : '',
                od ? od.getTime() : 0, raw, rc.show, kind]);
      counts[team.name + ' ' + kind] = (counts[team.name + ' ' + kind] || 0) + 1;
    });
  });
  out.sort(function (a, b) { return b[6] - a[6]; });
  var rows = [['Team', 'Sheet ID', 'Row ID', 'Column ID', 'Escrow #', 'Open Date', 'Current', 'Change to', 'Kind']]
    .concat(out.map(function (r) { return [r[0], r[1], r[2], r[3], r[4], r[5], r[7], r[8], r[9]]; }));
  var ss = SpreadsheetApp.openById(CONFIG.contentSheetId);
  var sh = ss.getSheetByName('Client Merges Row List') || ss.insertSheet('Client Merges Row List');
  sh.clearContents();
  sh.getRange(1, 1, rows.length, rows[0].length).setNumberFormat('@').setValues(rows);
  Logger.log('Rows to change: ' + out.length + ' | ' + JSON.stringify(counts));
}

// Run from the editor ONLY on Brett's go (smartsheet-conventions.md rule 6): rebuilds
// the row list from the live sheets, writes the "Show as" name into Directing Customer
// (no other column) in batches of 500, and logs every row with its result to a new
// "Client Merges Run <date time>" tab (the rule 7 run log; the first run, 2026-10-12
// 15:44, is in "Client Merges Row List"). Source cleanup, 2026-10-12.
function applyMergeRows() {
  var token = PropertiesService.getScriptProperties().getProperty(CONFIG.tokenProperty);
  var merges = loadMerges_();
  if (merges.error) throw new Error('Client Merges unreadable: ' + merges.error);
  var log = [], totals = { updated: 0, failed: 0 };
  CONFIG.teams.forEach(function (team) {
    var sheet = fetchTeam_(team, token);
    var idx = resolveColumns_(sheet.columns, team.name);
    var batch = [];
    (sheet.rows || []).forEach(function (row) {
      var cellById = {};
      (row.cells || []).forEach(function (c) { cellById[c.columnId] = c; });
      var raw = String(cellVal_(cellById, idx.directingCustomer) || '');
      var name = normName_(raw);
      if (!name) return;
      var rc = resolveClient_(name, merges);
      if (!rc.show || raw === rc.show) return;
      batch.push({ id: row.id, raw: raw, to: rc.show,
                   escrow: String(cellVal_(cellById, idx.escrowNumber) || '') });
    });
    for (var i = 0; i < batch.length; i += 500) {
      var chunk = batch.slice(i, i + 500);
      var resp = UrlFetchApp.fetch('https://api.smartsheet.com/2.0/sheets/' + team.sheetId + '/rows', {
        method: 'put', contentType: 'application/json', muteHttpExceptions: true,
        headers: { Authorization: 'Bearer ' + token },
        payload: JSON.stringify(chunk.map(function (b) {
          return { id: b.id, cells: [{ columnId: idx.directingCustomer, value: b.to }] };
        }))
      });
      var ok = resp.getResponseCode() === 200;
      var note = ok ? 'updated' : 'failed HTTP ' + resp.getResponseCode();
      chunk.forEach(function (b) {
        log.push([team.name, team.sheetId, String(b.id), String(idx.directingCustomer),
                  b.escrow, b.raw, b.to, note]);
      });
      totals[ok ? 'updated' : 'failed'] += chunk.length;
      if (!ok) Logger.log(team.name + ' batch ' + (i / 500 + 1) + ' failed: ' + resp.getContentText().slice(0, 300));
    }
  });
  // Each run logs to its own new tab, so earlier run logs are never overwritten.
  var stamp = Utilities.formatDate(new Date(), CONFIG.timezone, 'yyyy-MM-dd HHmm');
  var rows = [['Team', 'Sheet ID', 'Row ID', 'Column ID', 'Escrow #', 'Old value', 'New value', 'Result']].concat(log);
  var sh = SpreadsheetApp.openById(CONFIG.contentSheetId).insertSheet('Client Merges Run ' + stamp);
  sh.getRange(1, 1, rows.length, rows[0].length).setNumberFormat('@').setValues(rows);
  Logger.log('applyMergeRows: ' + JSON.stringify(totals));
}

// Name -> { key, show }: show is the Client Merges "Show as" name, or '' when unmapped.
function resolveClient_(name, merges) {
  var k = clientKey_(name);
  var show = (merges && merges.map[k]) || '';
  return { key: show ? clientKey_(show) : k, show: show };
}

function buildPayload_() {
  var built = buildRecords_();
  cacheFiles_(built.files, built.merges.map);
  var records = built.records;
  var owners = built.owners;
  var merges = built.merges;

  var now = new Date();
  // Trailing 12 months, same boundary math as the company dashboard's t12mStart
  // (same calendar day, 12 months back) — so Top Clients reconciles 1:1 with it.
  var start12 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start12.setMonth(start12.getMonth() - 12);
  var startYtd = new Date(now.getFullYear(), 0, 1);

  return {
    title: 'Client & Revenue Dashboard',
    generatedAt: fmtDateTime_(now),
    build: BUILD,
    teams: CONFIG.teams.map(function (t) { return t.name; }),
    meta: { closed: built.stats.closed, canceled: built.stats.canceled, sheetRows: built.stats.sheetRows },
    windows: {
      '365': computeWindow_(records, start12, now, 'Last 12 Months', fmtRange_(start12, now), owners, merges),
      'ytd': computeWindow_(records, startYtd, now, 'YTD ' + now.getFullYear(), fmtRange_(startYtd, now), owners, merges)
    },
    mergeRows: built.stats.mergeRows,
    mergeError: built.stats.mergeError,
    // Attribution index for the lookup: [client, team, sales rep, last open, other
    // spellings ('' when none)], A-Z by name
    owners: Object.keys(owners).map(function (k) {
      var o = owners[k], me = o.name.toLowerCase();
      var other = Object.keys(o.seen).filter(function (s) { return s !== me; })
        .map(function (s) { return o.seen[s]; }).sort().join(' \u00b7 ');
      return [o.name, o.team, o.rep, o.ts > 0 ? fmtDate_(new Date(o.ts)) : '\u2014', other];
    }).sort(function (a, b) { return a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1; })
  };
}

function computeWindow_(records, start, end, label, rangeStr, owners, merges) {
  var groups = {};
  var total = 0, fileCount = 0;

  records.forEach(function (r) {
    if (r.coe < start || r.coe > end) return;
    total += r.fee;
    fileCount++;

    var g = groups[r.key];
    if (!g) g = groups[r.key] = { name: r.customer, sum: 0, fileCount: 0, byTeam: {}, files: [] };
    g.sum += r.fee;
    g.fileCount++;
    g.byTeam[r.team] = (g.byTeam[r.team] || 0) + r.fee;
    g.files.push({ ts: r.coe.getTime(), openTs: r.openTs || r.coe.getTime(),
                   date: fmtDate_(r.coe), escrow: r.escrow,
                   address: r.address, team: r.team, fee: r.fee });
  });

  var clients = Object.keys(groups).map(function (k) { return groups[k]; });
  clients.sort(function (a, b) { return b.sum - a.sum; });

  clients.forEach(function (c, i) {
    c.rank = i + 1;
    c.pct = total > 0 ? c.sum / total : 0;
    // Owning unit follows the account: use the most recently OPENED file so a late-
    // closing file from a former unit can't flip the label after an account moves.
    var cur = c.files.slice().sort(function (a, b) { return b.openTs - a.openTs; })[0];
    var own = owners && owners[resolveClient_(c.name, merges).key];
    c.team = own ? own.team : cur.team;   // attribution sees every file, not just closings
    c.rep = own ? own.rep : '\u2014';
    c.lastOpen = own && own.ts ? fmtDate_(new Date(own.ts)) : '\u2014';
    c.files.sort(function (a, b) { return b.ts - a.ts; });   // display: most recent close first
    c.files.forEach(function (f) { delete f.ts; delete f.openTs; });
  });

  return { label: label, range: rangeStr, total: total,
           clientCount: clients.length, fileCount: fileCount, clients: clients };
}

/*************************** SMARTSHEET FETCH ***************************/
// Fetch the full sheet. The company dashboard fetches with no pagination and gets every
// row, so we do the same by default. We also page as a safety net for very large sheets,
// but we DECIDE when to stop by comparing rows returned to totalRowCount — never by
// trusting a `totalPages` field (Get Sheet may omit it, which previously truncated the
// Team 7 read to the first page and dropped the newest files).
function fetchTeam_(team, token) {
  var base = 'https://api.smartsheet.com/2.0/sheets/' + team.sheetId;

  function get(url) {
    var resp = UrlFetchApp.fetch(url, {
      method: 'get', headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true
    });
    if (resp.getResponseCode() !== 200) {
      throw new Error('Smartsheet fetch failed for ' + team.name + ' (sheet ' +
        team.sheetId + ') — HTTP ' + resp.getResponseCode() + ': ' + resp.getContentText());
    }
    return JSON.parse(resp.getContentText());
  }

  // First, the plain full-sheet call (no pagination params) — returns all rows.
  var data = get(base);
  var columns = data.columns || [];
  var rows = data.rows || [];
  var total = data.totalRowCount || rows.length;

  // Safety net: if the platform ever caps the plain call, page by row count until complete.
  if (rows.length < total) {
    rows = [];
    var page = 1;
    while (page < 200) {
      var d = get(base + '?page=' + page + '&pageSize=500');
      var batch = d.rows || [];
      rows = rows.concat(batch);
      if (batch.length < 500 || rows.length >= (d.totalRowCount || total)) break;
      page++;
    }
  }
  return { columns: columns, rows: rows, rowCount: rows.length };
}

function resolveColumns_(columns, teamName) {
  function find(target, opts) {
    opts = opts || {};
    var t = target.toLowerCase();
    var exact = null, contains = null;
    (columns || []).forEach(function (col) {
      var title = String(col.title || '').trim().toLowerCase();
      if (title === t) exact = col.id;
      else if (!contains && title.indexOf(t) !== -1) contains = col.id;
      if (opts.needHash && title.indexOf('escrow') !== -1 && title.indexOf('#') !== -1) exact = exact || col.id;
    });
    var id = exact || contains;
    if (!id && !opts.optional) throw new Error('Column "' + target + '" not found on ' + teamName + ' sheet.');
    return id || null;
  }
  return {
    directingCustomer: find(CONFIG.col.directingCustomer),
    salesRep:          find(CONFIG.col.salesRep, { optional: true }),
    escrowFees:        find(CONFIG.col.escrowFees),
    actualCoe:         find(CONFIG.col.actualCoe),
    openDate:          find(CONFIG.col.openDate, { optional: true }),
    fileStatus:        find(CONFIG.col.fileStatus),
    propertyAddress:   find(CONFIG.col.propertyAddress, { optional: true }),
    escrowNumber:      find(CONFIG.col.escrowNumber, { needHash: true, optional: true }),
    projectedCoe:      find(CONFIG.col.projectedCoe, { optional: true })
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
  if (!s || s === '/') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s = s + 'T12:00:00';
  var d = new Date(s);
  if (isNaN(d.getTime())) return null;
  var y = d.getFullYear();
  if (y < 2000 || y > 2100) return null; // guard obvious typos (e.g. 1915)
  return d;
}

function fmtDate_(d)     { return Utilities.formatDate(d, CONFIG.timezone, 'MMM d, yyyy'); }
function fmtDateTime_(d) { return Utilities.formatDate(d, CONFIG.timezone, "MMM d, yyyy 'at' h:mm a"); }
function fmtRange_(a, b) { return fmtDate_(a) + '  \u2013  ' + fmtDate_(b); }

/*************************** DIAGNOSTIC (reconcile to Gross Fees report) ***************************/
function diagRevenue() {
  var built = buildRecords_();
  var s = built.stats;
  Logger.log('Rows scanned: ' + s.scanned + ' | closed kept (has COE, not canceled): ' + s.closed +
             ' | canceled excluded: ' + s.canceled);
  Logger.log('All-time closed gross fees by team:');
  CONFIG.teams.forEach(function (t) {
    Logger.log('  ' + t.name + ': $' + (s.byTeam[t.name] || 0).toFixed(2));
  });

  // Trailing 14 months of gross fees by month (compare to Gross Fees by Month chart)
  var now = new Date();
  var floor = new Date(now.getFullYear(), now.getMonth() - 13, 1);
  var months = {};
  built.records.forEach(function (r) {
    if (r.coe < floor) return;
    var k = Utilities.formatDate(r.coe, CONFIG.timezone, 'yyyy-MM');
    months[k] = (months[k] || 0) + r.fee;
  });
  Logger.log('Gross fees by month (trailing 14, by Actual COE):');
  Object.keys(months).sort().forEach(function (k) {
    Logger.log('  ' + k + ': $' + months[k].toFixed(2));
  });
}

/*************************** HTML ***************************/
function getHtml_(payload) {
  var payloadJson = JSON.stringify(payload);
  return '' +
'<!DOCTYPE html><html><head><meta charset="utf-8">' +
'<style>' +
'*{box-sizing:border-box}' +
'#root[data-theme="dark"]{' +
'--bg:#0f141a;--card:#161d26;--ink:#e8ecf1;--ink2:#c4ccd6;--muted:#8b97a5;--faint:#5c6773;' +
'--line:#26313d;--line2:#1d2732;--track:#232f3b;--accent:#34d399;--accent-soft:#10241d;--shadow:none;}' +
'#root[data-theme="light"]{' +
'--bg:#f5f6f8;--card:#ffffff;--ink:#1f2937;--ink2:#374151;--muted:#6b7280;--faint:#9ca3af;' +
'--line:#e6e8eb;--line2:#eef0f2;--track:#eef1f4;--accent:#059669;--accent-soft:#ecfdf5;' +
'--shadow:0 1px 2px rgba(16,24,40,.04),0 1px 3px rgba(16,24,40,.06);}' +
'html,body{margin:0}' +
'#root{background:var(--bg);color:var(--ink);min-height:100vh;' +
'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.45;-webkit-font-smoothing:antialiased}' +
'.wrap{max-width:1180px;margin:0 auto;padding:22px 20px 60px}' +
'.lbl{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600}' +
'.mono{font-variant-numeric:tabular-nums}' +
'.head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:8px}' +
'.head h1{margin:0;font-size:21px;font-weight:700;letter-spacing:-.01em}' +
'.head .sub{margin-top:3px;color:var(--muted);font-size:12.5px}' +
'.head .range{color:var(--ink2);font-weight:600}' +
'.actions{display:flex;gap:8px}' +
'.btn{border:1px solid var(--line);background:var(--card);color:var(--ink2);border-radius:8px;padding:8px 12px;font-size:13px;font-weight:600;cursor:pointer}' +
'.btn:hover{border-color:var(--accent)}' +
'.btn:disabled{opacity:.55;cursor:default}' +
'.recon{margin:12px 0 16px;font-size:12px;color:var(--muted);border-left:2px solid var(--line);padding-left:10px}' +
'.recon b{color:var(--ink2);font-weight:600}' +
'.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}' +
'.kpi{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px 15px;box-shadow:var(--shadow)}' +
'.kpi .v{font-size:24px;font-weight:700;margin-top:6px;letter-spacing:-.01em}' +
'.kpi .s{font-size:12px;color:var(--muted);margin-top:2px}' +
'.kpi.accent{border-left:3px solid var(--accent)}' +
'.bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}' +
'.seg{display:inline-flex;background:var(--card);border:1px solid var(--line);border-radius:9px;padding:3px}' +
'.seg button{border:0;background:transparent;color:var(--ink2);font-weight:600;font-size:12.5px;padding:6px 13px;border-radius:7px;cursor:pointer;white-space:nowrap}' +
'.seg button.on{background:var(--accent);color:#08130f}' +
'.grow{flex:1 1 200px}' +
'.search{width:100%;border:1px solid var(--line);border-radius:9px;padding:9px 12px;font-size:13.5px;background:var(--card);color:var(--ink)}' +
'.search:focus{outline:none;border-color:var(--accent)}' +
'.count{color:var(--muted);font-size:12.5px;white-space:nowrap}' +
'.link{background:none;border:0;color:var(--ink2);font-weight:600;font-size:12.5px;cursor:pointer;text-decoration:underline}' +
'.card{background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);overflow:hidden}' +
'.scroll{overflow-x:auto}' +
'table{width:100%;border-collapse:collapse}' +
'thead th{position:sticky;top:0;background:var(--card);border-bottom:1px solid var(--line);text-align:left;padding:11px 14px;font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);font-weight:600;cursor:pointer;user-select:none;white-space:nowrap}' +
'thead th .ar{color:var(--faint);margin-left:4px;font-size:10px}' +
'thead th.on{color:var(--ink)}' +
'thead th.num,tbody td.num{text-align:right}' +
'tbody td{padding:11px 14px;border-bottom:1px solid var(--line2);font-size:13.5px;white-space:nowrap}' +
'tbody tr:last-child td{border-bottom:0}' +
'tbody tr{cursor:pointer}' +
'tbody tr:hover{background:var(--track)}' +
'.rk{color:var(--faint);font-variant-numeric:tabular-nums;width:40px}' +
'.nm{font-weight:600;color:var(--ink)}' +
'.sub2{color:var(--muted)}' +
'.pctcell{min-width:150px}' +
'.pctrow{display:flex;align-items:center;gap:9px;justify-content:flex-end}' +
'.bartrack{flex:1;height:6px;background:var(--track);border-radius:99px;overflow:hidden;max-width:100px}' +
'.barfill{height:100%;background:var(--accent);border-radius:99px}' +
'.pctval{width:54px;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink2)}' +
'.empty{padding:34px;text-align:center;color:var(--muted)}' +
'.detail{margin-top:16px;background:var(--card);border:1px solid var(--line);border-radius:12px;box-shadow:var(--shadow);display:none}' +
'.detail.show{display:block}' +
'.dhead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px;border-bottom:1px solid var(--line)}' +
'.dhead h2{margin:0;font-size:17px;font-weight:700}' +
'.badge{display:inline-block;background:var(--accent-soft);color:var(--accent);border-radius:6px;padding:3px 8px;font-size:11px;font-weight:700;letter-spacing:.03em;margin-left:8px}' +
'.dmeta{padding:10px 18px;border-bottom:1px solid var(--line2);color:var(--muted);font-size:12.5px}' +
'.dmeta b{color:var(--ink2)}' +
'.dstats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--line)}' +
'.dstat{padding:13px 18px;border-right:1px solid var(--line2)}' +
'.dstat:last-child{border-right:0}' +
'.dstat .v{font-size:18px;font-weight:700;margin-top:4px}' +
'.dteam{display:flex;gap:8px;flex-wrap:wrap;padding:13px 18px;border-bottom:1px solid var(--line2)}' +
'.chip{border:1px solid var(--line);border-radius:8px;padding:6px 11px;font-size:12.5px}' +
'.chip b{font-weight:700}' +
'.chip .cl{color:var(--muted);font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;display:block}' +
'.dfiles{max-height:340px;overflow:auto}.dfiles th{font-size:10.5px}' +
'.who{margin-bottom:14px;display:none}.who.show{display:block}' +
'.who .lbl{padding:11px 14px;border-bottom:1px solid var(--line)}' +
'.who tbody tr{cursor:default}.who .more{padding:9px 14px;color:var(--muted);font-size:12.5px}' +
'.hctl{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;padding:13px 18px 14px}' +
'.hdates{display:flex;flex-direction:column;gap:8px}.hdrow{display:flex;gap:10px;flex-wrap:wrap}' +
'.hfld{display:flex;flex-direction:column;gap:4px}' +
'.hin{border:1px solid var(--line);border-radius:8px;padding:7px 10px;font-size:13px;font-weight:600;background:var(--card);color:var(--ink);font-family:inherit}' +
'#root[data-theme="dark"] .hin{color-scheme:dark}#root[data-theme="light"] .hin{color-scheme:light}' +
'.hin:focus{outline:none;border-color:var(--accent)}' +
'.hcl{position:relative;flex:1 1 220px;min-width:200px;max-width:320px}.hcl .hin{width:100%}' +
'.hlist{position:absolute;top:100%;left:0;right:0;z-index:5;margin-top:4px;background:var(--card);border:1px solid var(--line);border-radius:8px;box-shadow:var(--shadow);overflow:hidden}' +
'.hrow{padding:8px 11px;font-size:13px;cursor:pointer}.hrow:hover{background:var(--track)}.hrow.none{cursor:default;color:var(--muted)}' +
'.hchk{flex-direction:row;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--ink2);margin-top:28px;cursor:pointer}' +
'.hquick{display:flex;gap:6px;flex-wrap:wrap}' +
'.hq{border:1px solid var(--line);background:var(--card);color:var(--ink2);border-radius:8px;padding:7px 13px;font-size:13px;font-weight:600;cursor:pointer}.hq:hover{border-color:var(--accent)}.hq.on{background:var(--accent);border-color:var(--accent);color:#08130f}' +
'.dfiles tbody tr{cursor:default}' +
'.hmsg{padding:18px;color:var(--muted)}' +
'.dstats.hsum{grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line2)}.dstat .s{font-size:12px;color:var(--muted);margin-top:2px}' +
'.x{background:none;border:1px solid var(--line);border-radius:8px;width:30px;height:30px;cursor:pointer;color:var(--muted);font-size:16px;line-height:1}' +
'@media(max-width:820px){.dstats.hsum{grid-template-columns:repeat(2,1fr)}.kpis{grid-template-columns:repeat(2,1fr)}.dstats{grid-template-columns:1fr}.dstat{border-right:0;border-bottom:1px solid var(--line2)}.addr-h,.addr{display:none}}' +
'</style></head><body>' +
'<div id="root" data-theme="dark"><div class="wrap">' +
  '<div class="head">' +
    '<div><h1 id="title"></h1><div class="sub"><span class="range" id="range"></span> &nbsp;\u2022&nbsp; Updated <span id="gen"></span></div></div>' +
    '<div class="actions">' +
      '<button class="btn" id="theme" title="Toggle light/dark">\u263e Dark</button>' +
      '<button class="btn" id="refresh">\u21bb Refresh</button>' +
    '</div>' +
  '</div>' +
  '<div class="kpis" id="kpis"></div>' +
  '<div class="bar">' +
    '<div class="seg" id="segWindow"><button data-w="365" class="on">Last 12 Months</button><button data-w="ytd">YTD</button></div>' +
    '<div class="seg" id="segScope"><button data-s="top20" class="on">Top 20</button><button data-s="all">All Clients</button></div>' +
    '<div class="grow"><input id="search" class="search" placeholder="Look up any client\u2026" autocomplete="off"></div>' +
    '<span class="count" id="count"></span>' +
    '<button class="link" id="exportBtn">Export view (CSV)</button>' +
  '</div>' +
  '<div class="card who" id="who"></div>' +
  '<div class="card scroll"><table>' +
    '<thead id="mhead"><tr>' +
      '<th class="rk" data-k="rank"># <span class="ar"></span></th>' +
      '<th data-k="name">Directing Customer <span class="ar"></span></th>' +
      '<th data-k="team">Team <span class="ar"></span></th>' +
      '<th data-k="rep">Sales Rep <span class="ar"></span></th>' +
      '<th class="num" data-k="sum">Escrow Fees <span class="ar"></span></th>' +
      '<th class="num" data-k="pct">% of Revenue <span class="ar"></span></th>' +
    '</tr></thead><tbody id="rows"></tbody>' +
  '</table><div class="empty" id="empty" style="display:none">No matching clients.</div></div>' +
  '<div class="detail" id="detail"></div>' +
'</div></div>' +
'<script>' +
'var DATA = ' + payloadJson + ';' +
'var state={window:"365",scope:"top20",sortKey:"pct",sortDir:"desc",search:"",theme:"dark"};' +
'var usd=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0});' +
'var usd2=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2,maximumFractionDigits:2});' +
'function pct(x){return (x*100).toFixed(2)+"%";}' +
'function esc(s){return String(s==null?"":s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;"}[c];});}' +
'function win(){return DATA.windows[state.window];}' +
'function root(){return document.getElementById("root");}' +

'function initTheme(){try{var t=localStorage.getItem("fseTheme");if(t)state.theme=t;}catch(e){}applyTheme();}' +
'function applyTheme(){root().setAttribute("data-theme",state.theme);' +
  'document.getElementById("theme").textContent=(state.theme==="dark")?"\u263e Dark":"\u2600 Light";}' +
'function toggleTheme(){state.theme=(state.theme==="dark")?"light":"dark";try{localStorage.setItem("fseTheme",state.theme);}catch(e){}applyTheme();}' +

'function renderHead(){document.getElementById("title").textContent=DATA.title;' +
  'document.getElementById("gen").textContent=DATA.generatedAt;' +
  'document.getElementById("range").textContent=win().label+": "+win().range;}' +

'function renderKpis(){var w=win();var top=w.clients[0];var html="";' +
  'html+=kpi("Gross Escrow Fees",usd.format(w.total),w.label+" \u2022 closed",true);' +
  'html+=kpi("Clients",String(w.clientCount),"with closed revenue",false);' +
  'html+=kpi("Files Closed",String(w.fileCount),"in window",false);' +
  'html+=kpi("Top Client",top?esc(top.name):"\u2014",top?pct(top.pct)+" of revenue":"",false);' +
  'document.getElementById("kpis").innerHTML=html;}' +
'function kpi(l,v,s,a){return \'<div class="kpi\'+(a?" accent":"")+\'"><div class="lbl">\'+l+\'</div><div class="v">\'+v+\'</div><div class="s">\'+esc(s)+\'</div></div>\';}' +

'function currentRows(){var w=win();var list=w.clients.slice();' +
  'if(state.scope==="top20")list=list.filter(function(c){return c.rank<=20;});' +
  'if(state.search){var q=state.search.toLowerCase();list=list.filter(function(c){return c.name.toLowerCase().indexOf(q)!==-1;});}' +
  'var k=state.sortKey,dir=state.sortDir==="asc"?1:-1;' +
  'list.sort(function(a,b){var av,bv;if(k==="name"||k==="team"||k==="rep"){av=String(a[k==="name"?"name":k]).toLowerCase();bv=String(b[k==="name"?"name":k]).toLowerCase();return av<bv?-1*dir:av>bv?1*dir:0;}av=a[k];bv=b[k];return (av-bv)*dir;});' +
  'return list;}' +

'function renderTable(){var list=currentRows();var w=win();' +
  'var maxPct=0;list.forEach(function(c){if(c.pct>maxPct)maxPct=c.pct;});if(maxPct===0)maxPct=1;' +
  'var html="";' +
  'list.forEach(function(c){var bw=Math.max(3,Math.round((c.pct/maxPct)*100));' +
    'html+=\'<tr data-key="\'+esc(c.name.toLowerCase())+\'">\'+' +
      '\'<td class="rk mono">\'+c.rank+\'</td>\'+' +
      '\'<td class="nm">\'+esc(c.name)+\'</td>\'+' +
      '\'<td class="sub2">\'+esc(c.team)+\'</td>\'+' +
      '\'<td class="sub2">\'+esc(c.rep)+\'</td>\'+' +
      '\'<td class="num mono">\'+usd.format(c.sum)+\'</td>\'+' +
      '\'<td class="num pctcell"><div class="pctrow"><div class="bartrack"><div class="barfill" style="width:\'+bw+\'%"></div></div><span class="pctval">\'+pct(c.pct)+\'</span></div></td></tr>\';});' +
  'document.getElementById("rows").innerHTML=html;' +
  'document.getElementById("empty").style.display=list.length?"none":"block";' +
  'document.getElementById("count").textContent=list.length+" of "+w.clientCount+" clients";' +
  'updateSortIndicators();bindRowClicks(w);}' +

'function updateSortIndicators(){document.querySelectorAll("#mhead th").forEach(function(th){var k=th.getAttribute("data-k");var ar=th.querySelector(".ar");' +
  'if(k===state.sortKey){th.classList.add("on");ar.textContent=state.sortDir==="asc"?"\u25b2":"\u25bc";}else{th.classList.remove("on");ar.textContent="";}});}' +

'function bindRowClicks(w){document.querySelectorAll("#rows tr").forEach(function(tr){tr.onclick=function(){' +
  'var key=tr.getAttribute("data-key");var c=w.clients.filter(function(x){return x.name.toLowerCase()===key;})[0];if(c)showDetail(c,w);};});}' +

'function showDetail(c,w){showHistory(c.name,c,w);}' +

'function exportCsv(){var list=currentRows();var rows=[["Rank","Directing Customer","Team","Sales Rep","Last Open","Escrow Fees","% of Revenue"]];' +
  'list.forEach(function(c){rows.push([c.rank,c.name,c.team,c.rep,c.lastOpen,c.sum.toFixed(2),(c.pct*100).toFixed(4)+"%"]);});' +
  'var csv=rows.map(function(r){return r.map(function(x){var s=String(x);return /[",\\n]/.test(s)?\'"\'+s.replace(/"/g,\'""\')+\'"\':s;}).join(",");}).join("\\n");' +
  'var blob=new Blob([csv],{type:"text/csv"});var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="FSE_"+state.window+"_"+state.scope+".csv";a.click();}' +

'function renderWho(){var el=document.getElementById("who");var q=state.search.toLowerCase();' +
  'if(!q){el.classList.remove("show");el.innerHTML="";return;}' +
  'var hits=(DATA.owners||[]).filter(function(o){return (o[0]+" "+(o[4]||"")).toLowerCase().indexOf(q)!==-1;});' +
  'var h=\'<div class="lbl">Who owns it \u2022 every client, all history</div>\';' +
  'if(!hits.length){h+=\'<div class="more">No client matches \u201c\'+esc(state.search)+\'\u201d on any team sheet.</div>\';}' +
  'else{h+=\'<div class="scroll"><table><thead><tr><th>Client</th><th>Team</th><th>Sales Rep</th><th>Last Open</th></tr></thead><tbody>\';' +
    'hits.slice(0,10).forEach(function(o){h+=\'<tr><td class="nm">\'+esc(o[0])+\'</td><td>\'+esc(o[1])+\'</td><td>\'+esc(o[2])+\'</td><td class="mono">\'+esc(o[3])+\'</td></tr>\';});' +
    'h+=\'</tbody></table></div>\';if(hits.length>10)h+=\'<div class="more">\'+(hits.length-10)+\' more. Keep typing to narrow.</div>\';}' +
  'el.innerHTML=h;el.classList.add("show");}' +
'function renderAll(){renderHead();renderKpis();renderWho();renderTable();document.getElementById("detail").classList.remove("show");}' +

'document.getElementById("theme").addEventListener("click",toggleTheme);' +
'document.getElementById("segWindow").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;state.window=b.getAttribute("data-w");setSeg("segWindow",b);renderAll();});' +
'document.getElementById("segScope").addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;state.scope=b.getAttribute("data-s");setSeg("segScope",b);renderTable();});' +
'function setSeg(id,btn){document.querySelectorAll("#"+id+" button").forEach(function(x){x.classList.remove("on");});btn.classList.add("on");}' +
'document.querySelectorAll("#mhead th").forEach(function(th){th.addEventListener("click",function(){var k=th.getAttribute("data-k");' +
  'if(state.sortKey===k){state.sortDir=state.sortDir==="asc"?"desc":"asc";}else{state.sortKey=k;state.sortDir=(k==="name"||k==="team"||k==="rep")?"asc":"desc";}renderTable();});});' +
'document.getElementById("search").addEventListener("input",function(e){state.search=e.target.value.trim();renderWho();renderTable();});' +
'document.getElementById("exportBtn").addEventListener("click",exportCsv);' +
'document.getElementById("refresh").addEventListener("click",function(){var btn=this;btn.disabled=true;btn.textContent="\u21bb Refreshing\u2026";' +
  'google.script.run.withSuccessHandler(function(p){DATA=p;renderAll();btn.disabled=false;btn.textContent="\u21bb Refresh";})' +
  '.withFailureHandler(function(err){alert("Refresh failed: "+err.message);btn.disabled=false;btn.textContent="\u21bb Refresh";}).getDashboardData();});' +

'(' + fileHistoryClient_.toString() + ')();' +
'initTheme();renderAll();' +
'</script></body></html>';
}

/*************************** FILE HISTORY PANEL (browser) ***************************/
// Runs in the page, after the main script, as source text (fileHistoryClient_.toString()),
// so it is plain JavaScript with no string escaping. Uses the page's DATA, state, esc,
// and usd2. Opened by a table row click (showDetail) or the panel's Client field; the
// rows load once per client through getClientFiles(), then every control filters in
// the page. Controls keep their values when the client changes. The summary cards
// and the table both follow the filters; only the rank badge reflects the table's window.
function fileHistoryClient_() {
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var HEAD = { all: 'Date', closed: 'Closed', closing: 'Proj COE', opened: 'Opened', canceled: 'Opened' };
  var ROWS = {};                                       // client name -> rows from getClientFiles
  var H = { name: '', type: 'all', from: '', to: '', team: '', canc: false, q: 'all' };   // q: highlighted quick pick, '' for typed dates

  function el(id) { return document.getElementById(id); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function dl(v) { if (!v) return '\u2014'; var p = v.split('-'); return MON[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0]; }

  // Owner row from DATA.owners: [client, team, sales rep, last open, other spellings].
  function owner(name) {
    var low = String(name).toLowerCase(), hit = null;
    (DATA.owners || []).forEach(function (o) {
      if (hit) return;
      if (o[0].toLowerCase() === low) hit = o;
      else if (o[4] && (' \u00b7 ' + o[4].toLowerCase() + ' \u00b7 ').indexOf(' \u00b7 ' + low + ' \u00b7 ') !== -1) hit = o;
    });
    return hit;
  }
  // The client's row in the current window's table, for the rank badge.
  function ranked(name) {
    var w = DATA.windows[state.window], low = String(name).toLowerCase();
    return { c: w.clients.filter(function (x) { return x.name.toLowerCase() === low; })[0] || null, w: w };
  }

  window.showHistory = function (name, c, w) {
    var d = el('detail'), o = owner(name);
    H.name = name;
    var h = '<div class="dhead"><h2>' + esc(name) +
      (c ? '<span class="badge">RANK #' + c.rank + ' \u2022 ' + esc(w.label) + '</span>' : '') +
      '</h2><button class="x" id="closeDetail">\u00d7</button></div>';
    if (o) h += '<div class="dmeta">Owner (latest open) \u2022 <b>' + esc(o[1]) + '</b> \u2022 Sales Rep <b>' +
      esc(o[2]) + '</b> \u2022 Last open <b>' + esc(o[3]) + '</b></div>';
    h += '<div class="hctl">' +
      '<div class="hfld hcl"><span class="lbl">Client</span><input id="hClient" class="hin" autocomplete="off" placeholder="Switch client\u2026"><div id="hList" class="hlist" style="display:none"></div></div>' +
      '<label class="hfld"><span class="lbl">Report</span><select id="hType" class="hin">' +
        '<option value="all">All files</option><option value="closed">Closed (by Actual COE)</option>' +
        '<option value="closing">Closing (open files by Projected COE)</option><option value="opened">Opened (by Open Date)</option>' +
        '<option value="canceled">Canceled (by Open Date)</option></select></label>' +
      '<div class="hdates"><div class="hdrow">' +
        '<label class="hfld"><span class="lbl">From</span><input id="hFrom" class="hin" type="date"></label>' +
        '<label class="hfld"><span class="lbl">To</span><input id="hTo" class="hin" type="date"></label></div>' +
        '<div class="hquick"><button type="button" class="hq" data-q="all">All history</button><button type="button" class="hq" data-q="tm">This month</button>' +
        '<button type="button" class="hq" data-q="lm">Last month</button><button type="button" class="hq" data-q="ty">This year</button></div></div>' +
      '<label class="hfld"><span class="lbl">Team</span><select id="hTeam" class="hin"><option value="">All teams</option>' +
        (DATA.teams || []).map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') + '</select></label>' +
      '<label class="hfld hchk"><input id="hCanc" type="checkbox"> Show canceled</label>' +
      '</div><div id="hSum" class="dstats hsum"></div><div id="hOut"><div class="hmsg">Loading files\u2026</div></div>';
    d.innerHTML = h;
    d.classList.add('show');
    el('closeDetail').onclick = function () { d.classList.remove('show'); };
    el('hType').value = H.type; el('hFrom').value = H.from; el('hTo').value = H.to;
    el('hTeam').value = H.team; el('hCanc').checked = H.canc; el('hCanc').disabled = H.type === 'canceled';
    bind();
    mark();
    d.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (ROWS[name]) { run(); return; }
    google.script.run.withSuccessHandler(function (r) {
      ROWS[name] = r.rows || [];
      if (H.name === name) run();
    }).withFailureHandler(function (err) {
      if (H.name === name) el('hOut').innerHTML = '<div class="hmsg">Could not load the files: ' + esc(err.message) + '. Click Refresh and try again.</div>';
    }).getClientFiles(name);
  };

  function bind() {
    el('hType').onchange = function () { H.type = this.value; el('hCanc').disabled = H.type === 'canceled'; run(); };
    el('hFrom').onchange = function () { H.from = this.value; H.q = ''; mark(); run(); };
    el('hTo').onchange = function () { H.to = this.value; H.q = ''; mark(); run(); };
    el('hTeam').onchange = function () { H.team = this.value; run(); };
    el('hCanc').onchange = function () { H.canc = this.checked; run(); };
    Array.prototype.forEach.call(document.querySelectorAll('#detail .hq'), function (b) {
      b.onclick = function () { quick(b.getAttribute('data-q')); };
    });
    var q = el('hClient'), list = el('hList');
    q.oninput = function () { suggest(q.value.trim().toLowerCase()); };
    q.onblur = function () { list.style.display = 'none'; };
  }

  // Client type-ahead over every client on the five sheets; names starting with the
  // typed text first, then names with a word starting with it, then the rest.
  function suggest(t) {
    var list = el('hList');
    if (!t) { list.style.display = 'none'; return; }
    var hits = (DATA.owners || []).filter(function (o) { return (o[0] + ' ' + (o[4] || '')).toLowerCase().indexOf(t) !== -1; });
    function rk(o) { var n = o[0].toLowerCase(); return n.indexOf(t) === 0 ? 0 : (' ' + n).indexOf(' ' + t) !== -1 ? 1 : 2; }
    hits = hits.sort(function (a, b) { return rk(a) - rk(b) || (a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1); }).slice(0, 8);
    list.innerHTML = hits.length ? '' : '<div class="hrow none">No match</div>';
    hits.forEach(function (o) {
      var row = document.createElement('div');
      row.className = 'hrow';
      row.textContent = o[0];
      row.onmousedown = function (e) { e.preventDefault(); var r = ranked(o[0]); showHistory(o[0], r.c, r.w); };
      list.appendChild(row);
    });
    list.style.display = 'block';
  }

  function quick(k) {
    var n = new Date(), y = n.getFullYear(), m = n.getMonth();
    if (k === 'all') { H.from = ''; H.to = ''; }
    if (k === 'tm') { H.from = iso(new Date(y, m, 1)); H.to = iso(new Date(y, m + 1, 0)); }
    if (k === 'lm') { H.from = iso(new Date(y, m - 1, 1)); H.to = iso(new Date(y, m, 0)); }
    if (k === 'ty') { H.from = y + '-01-01'; H.to = y + '-12-31'; }
    el('hFrom').value = H.from; el('hTo').value = H.to;
    H.q = k;
    mark();
    run();
  }
  // Highlights the quick pick in use; typed dates clear it.
  function mark() {
    Array.prototype.forEach.call(document.querySelectorAll('#detail .hq'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-q') === H.q);
    });
  }

  // Row: [open, escrow #, property, team, sales rep, status, actual COE, projected COE, fee, canceled].
  // All files dates by Open Date, then Actual COE, then Projected COE; blank From and To
  // mean all history, and a dated range leaves out files with no date.
  function run() {
    var rows = ROWS[H.name], out = el('hOut');
    if (!rows || !out) return;
    if (H.from && H.to && H.from > H.to) { summary([]); out.innerHTML = '<div class="hmsg">From is after To.</div>'; return; }
    var ty = H.type, list = [];
    rows.forEach(function (r) {
      var canc = r[9] === 1, dt;
      if (ty === 'canceled') { if (!canc) return; dt = r[0] || r[7]; }
      else {
        if (canc && !H.canc) return;
        if (ty === 'closed') { if (!r[6]) return; dt = r[6]; }
        else if (ty === 'closing') { if (r[6] || !r[7]) return; dt = r[7]; }
        else if (ty === 'opened') { if (!r[0]) return; dt = r[0]; }
        else dt = r[0] || r[6] || r[7];
      }
      if (H.team && r[3] !== H.team) return;
      if ((H.from || H.to) && !dt) return;
      if (H.from && dt < H.from) return;
      if (H.to && dt > H.to) return;
      list.push({ d: dt || '', r: r });
    });
    summary(list);
    if (!list.length) { out.innerHTML = '<div class="hmsg">No files match.</div>'; return; }
    list.sort(function (a, b) { return a.d < b.d ? 1 : a.d > b.d ? -1 : 0; });   // newest first, undated last
    var body = list.map(function (x) {
      var r = x.r;
      return '<tr><td class="mono">' + dl(x.d) + '</td><td class="mono">' + esc(r[1] || '\u2014') + '</td>' +
        '<td class="addr">' + esc(r[2] || '\u2014') + '</td><td>' + esc(r[3]) + '</td><td>' + esc(r[4] || '\u2014') + '</td>' +
        '<td>' + esc(r[9] === 1 ? 'Canceled' : (r[5] || '\u2014')) + '</td><td class="mono">' + dl(r[6]) + '</td>' +
        '<td class="num mono">' + usd2.format(r[8]) + '</td></tr>';
    }).join('');
    out.innerHTML = '<div class="dfiles"><table><thead><tr><th>' + HEAD[ty] + '</th><th>Escrow #</th><th class="addr-h">Property Address</th>' +
      '<th>Team</th><th>Sales Rep</th><th>Status</th><th>Close Date</th><th class="num">Fee</th></tr></thead><tbody>' + body + '</tbody></table></div>';
  }

  // Four cards over the listed files: Files (with the report and range), Closed fees
  // (Actual COE, not canceled), In escrow (no Actual COE, not canceled), Canceled.
  function summary(list) {
    var closed = 0, closedN = 0, open = 0, openN = 0, canc = 0, cancN = 0;
    list.forEach(function (x) {
      var r = x.r;
      if (r[9] === 1) { cancN++; canc += r[8]; }
      else if (r[6]) { closedN++; closed += r[8]; }
      else { openN++; open += r[8]; }
    });
    var range = H.from || H.to ? (H.from ? dl(H.from) : 'Start') + ' \u2013 ' + (H.to ? dl(H.to) : 'today') : 'All history';
    function card(l, v, sub) { return '<div class="dstat"><div class="lbl">' + l + '</div><div class="v">' + v + '</div><div class="s">' + esc(sub) + '</div></div>'; }
    el('hSum').innerHTML =
      card('Files', String(list.length), el('hType').options[el('hType').selectedIndex].text.replace(/ \(.*\)$/, '') + ' \u2022 ' + range + (H.team ? ' \u2022 ' + H.team : '')) +
      card('Closed fees', usd2.format(closed), closedN + ' closed') +
      card('In escrow', String(openN), usd2.format(open) + ' in fees') +
      card('Canceled', String(cancN), cancN ? usd2.format(canc) + ' not earned' : (H.canc || H.type === 'canceled' ? 'none' : 'hidden \u2022 tick Show canceled'));
  }
}
