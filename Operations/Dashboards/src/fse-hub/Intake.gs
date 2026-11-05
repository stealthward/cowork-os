/**
 * Hub intake, Phase 1 (2026-10-16): the escrow team opens files in the Hub
 * instead of typing into the team Smartsheets.
 *
 *   <exec-url>?page=open&t=key  -> New escrow (adds the file under its Projected COE month)
 *   <exec-url>?page=file        -> Escrow Lookup (Phase 2, 2026-10-19; renamed from Find a File); &t=key&r=rowId opens one to update
 *
 * One form (Brett, 2026-10-19): a new customer or agent is added from New Escrow
 * itself; the separate New Customer and New Agent pages are gone (old links land here).
 *
 * Scope: Operations/AI Workforce/drafts/2026-10-14-smartsheet-intake-forms-scope.md
 *
 * RULES
 *  - Who: everyone signed in to the Hub opens and updates files for every team
 *    (Brett, 2026-10-21). New Escrow starts on the person's own team (People tab
 *    TeamKey, matched by sign-in email) and offers the other teams as buttons.
 *  - Directing Customer must be on the Clients tab of the FSE Portal Content
 *    sheet (the one approved list), or be confirmed as new on the form.
 *  - Listing Agent or Loan Officer must be on the Agents tab (seeded 2026-10-16 from
 *    files opened since 2024, spellings checked against Zoho Contacts; FSBO and N/A
 *    are entries), or be confirmed as new. A co-listing is "Agent A / Agent B".
 *  - A name not on its list stops the save and shows its closest matches plus an
 *    "Add it" checkbox under the field. Ticked names are added to the list when the
 *    file saves, and logged as "new client" / "new agent". In test (&scratch=1) the
 *    lists are not touched and the log rows read "new client (test)" / "new agent (test)".
 *  - Escrow # reuse (Brett, 2026-10-26): numbers cost money and are reused after a
 *    cancellation with no deposit. A number found only on Canceled files (any team)
 *    saves, says so, and logs "reused Escrow #". A number on any file not Canceled is
 *    refused with a link to that file: cancel it in Escrow Lookup first.
 *  - The row is added as a child of its Projected COE month ("OCTOBER 2026" in
 *    Property Address), above that month's "Insert new files above" row. A month
 *    with no section is refused with the reason (sections are added each November).
 *  - Pre-open (Brett, 2026-10-20): an agent opens a file before there is an offer. The
 *    "Pre-open" box on New Escrow makes Open Date, Projected COE, File Status, and
 *    Escrow Fees optional (none is written, so a pre-open never counts as an opening)
 *    and adds the row as the last child of the PRE-OPENS section, above CANCELED.
 *    Escrow Lookup's "Open it" sets those four fields and moves it under its month.
 *    After INTAKE_EDIT.staleDays a pre-open is listed on its team page with Open it
 *    and Remove (age from Open Date, else the row's created date).
 *  - Prefill client info (Brett, 2026-10-26): with the box ticked, picking a Directing
 *    Customer fills Type, Sales Rep, Title Company, and Title Rep from that customer's
 *    most recent file (newest Open Date, any team). Picking a Listing Agent or Loan
 *    Officer while Directing Customer is still empty fills the same four plus Directing
 *    Customer from that agent's most recent file. Only empty fields are filled; fees,
 *    dates, status, and file-specific fields never are. See INTAKE_PREFILL.
 *  - Pick lists (Type, Sales Rep, Title Company, File Status) come live from the
 *    target sheet's column options. Since 2026-10-16 the five sheets carry one
 *    standard (00_Resources/smartsheet-conventions.md), so every team sees the same lists.
 *  - Every write is logged to the Hub Log tab (who, when, sheet, row, field, value),
 *    because Smartsheet's Modified By shows Brett for every Hub write (his token).
 *  - Test writes: &scratch=1 sends the write to INTAKE.scratch[team] instead of the
 *    live sheet. Empty in production; set only while testing on a scratch copy.
 *    Their log rows (Action ends "(test)") go to the Hub Log (test) tab, not the Hub Log.
 */

/* ========================= INTAKE CONFIG ========================= */

var INTAKE = {
  scratch: {},                       // team key -> scratch sheet ID, test only
  logTab: 'Hub Log',                 // When | Who | Action | Team | Sheet ID | Row ID | Escrow # | Field | Value | Old value
  testLogTab: 'Hub Log (test)',      // same columns; every "(test)" row lands here, made on first use
  insertMarker: 'insert new files above',
  closedStatuses: ['closed', 'canceled'],
  // Form fields in order. A column a sheet does not have is left off the form.
  fields: [
    { col: 'Escrow #',                       kind: 'text',   req: true },
    { col: 'Property Address',               kind: 'text',   req: true },
    { col: 'Seller/Borrower',                kind: 'text',   req: true },
    { col: 'Type',                           kind: 'pick',   req: true },
    { col: 'Directing Customer',             kind: 'client', req: true },
    { col: 'Listing Agent or Loan Officer',  kind: 'agent',  req: true },
    { col: 'Buyer Agent',                    kind: 'text' },
    { col: 'Buyer Agent Phone #',            kind: 'text' },
    { col: 'Sales Rep',                      kind: 'pick',   req: true },
    { col: 'Title Company',                  kind: 'pick' },
    { col: 'Title Rep',                      kind: 'text' },
    { col: 'Open Date',                      kind: 'date',   req: true, today: true, po: true },  // po: left off a pre-open
    { col: 'Projected COE',                  kind: 'date',   req: true, po: true },
    { col: 'File Status',                    kind: 'status', req: true, po: true },
    { col: 'Escrow Fees',                    kind: 'money',  req: true, po: true },
    { col: 'Wholesale?',                     kind: 'check' }
  ]
};

// The two approved lists. Each is a tab of the FSE Portal Content sheet
// (Name | Added by | Added on) plus a spellings tab (Spelling | Show as).
var INTAKE_LISTS = {
  client: { tab: 'Clients', merges: 'Client Merges', noun: 'customer',              field: 'Directing Customer' },
  agent:  { tab: 'Agents',  merges: 'Agent Merges',  noun: 'agent or loan officer', field: 'Listing Agent or Loan Officer' }
};

var INTAKE_MONTHS = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY',
                     'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

/* ========================= WHO IS SIGNED IN ========================= */

// { email, name, team, allTeam } from the People tab. team is '' for staff
// with no TeamKey. allTeam is true for anyone whose sign-in the Hub can read:
// every user opens and updates files for any team (Brett, 2026-10-21).
function intakeUser() {
  var email = '';
  try { email = String(Session.getActiveUser().getEmail() || '').toLowerCase(); } catch (e) {}
  var c = portalContent(), name = '', team = '';
  (c && c.people || []).forEach(function (p) {
    if (String(p.email || '').trim().toLowerCase() !== email || !email) return;
    if (!name) name = p.name;
    if (p.team && TEAMS[p.team] && !team) team = p.team;
  });
  return { email: email, name: name || email, team: team, allTeam: !!email };
}

function intakeCanOpen(u, key) { return !!TEAMS[key] && (u.allTeam || u.team === key); }

/* ========================= SMARTSHEET CALLS ========================= */

function intakeToken() {
  var t = PropertiesService.getScriptProperties().getProperty('SMARTSHEET_TOKEN');
  if (!t) throw new Error('The Hub is missing its Smartsheet token. Tell Brett: Script Property SMARTSHEET_TOKEN is not set.');
  return t;
}

// GET/POST with retry on 429 and 5xx. Returns parsed JSON or throws a plain error.
function intakeApi(method, path, body) {
  var opts = { method: method, headers: { Authorization: 'Bearer ' + intakeToken() }, muteHttpExceptions: true };
  if (body) { opts.contentType = 'application/json'; opts.payload = JSON.stringify(body); }
  var res, code;
  for (var i = 0; i < 4; i++) {
    res = UrlFetchApp.fetch('https://api.smartsheet.com/2.0' + path, opts);
    code = res.getResponseCode();
    if (code !== 429 && code < 500) break;
    Utilities.sleep(1000 * Math.pow(2, i));
  }
  var json = {};
  try { json = JSON.parse(res.getContentText()); } catch (e) {}
  if (code !== 200) throw new Error('Smartsheet said no (' + code + '): ' + (json.message || 'no detail') + '. Nothing was saved.');
  return json;
}

function intakeSheetId(key, scratch) {
  if (scratch) {
    if (!INTAKE.scratch[key]) throw new Error('No scratch sheet is set for ' + TEAMS[key].label + '. Remove &scratch=1 or set INTAKE.scratch.');
    return INTAKE.scratch[key];
  }
  return TEAMS[key].sheet;
}

// Column title -> column object, matched case-insensitively.
function intakeColumns(cols) {
  var m = {};
  (cols || []).forEach(function (c) { m[String(c.title).trim().toLowerCase()] = c; });
  return function (title) { return m[String(title).trim().toLowerCase()] || null; };
}

/* ========================= CLIENT LIST ========================= */

// An approved list (kind 'client' or 'agent') from its tab. Cached 5 minutes.
function intakeList(kind, force) {
  var L = INTAKE_LISTS[kind], ck = 'intakeList_' + kind;
  var cache = CacheService.getScriptCache();
  if (!force) { var hit = cache.get(ck); if (hit) return JSON.parse(hit); }
  var sh = intakeContentSheet().getSheetByName(L.tab);
  if (!sh) throw new Error('The ' + L.tab + ' tab is missing from the FSE Portal Content sheet. Tell Brett.');
  var v = sh.getDataRange().getValues(), list = [];
  for (var i = 1; i < v.length; i++) { var n = normName(v[i][0]); if (n) list.push(n); }
  list.sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
  try { cache.put(ck, JSON.stringify(list), 300); } catch (e) {}
  return list;
}

// Spelling -> listed name. Clients use the dashboards' Client Merges map; agents
// read the Agent Merges tab the same way. Cached 10 minutes; fail-soft to {}.
function intakeMerges(kind) {
  if (kind === 'client') return clientMerges();
  var cache = CacheService.getScriptCache(), ck = 'intakeMerges_' + kind;
  try {
    var hit = cache.get(ck); if (hit) return JSON.parse(hit);
    var map = {}, sh = intakeContentSheet().getSheetByName(INTAKE_LISTS[kind].merges);
    if (sh) {
      var v = sh.getDataRange().getValues();
      for (var i = 1; i < v.length; i++) {
        var from = normName(v[i][0]), to = normName(v[i][1]);
        if (from && to) { map[clientKey(from)] = to; map[clientKey(to)] = to; }
      }
    }
    cache.put(ck, JSON.stringify(map), 600);
    return map;
  } catch (e) { return {}; }
}

function intakeContentSheet() {
  var id = PropertiesService.getScriptProperties().getProperty('CONTENT_SHEET_ID');
  if (!id) throw new Error('The Hub is missing CONTENT_SHEET_ID. Tell Brett.');
  return SpreadsheetApp.openById(id);
}

// Exact list match (case, spacing, punctuation, "&" vs "and" ignored), or a
// known misspelling of a listed name. Returns the listed spelling or ''.
function intakeMatch(kind, name, list) {
  var k = clientKey(name);
  if (!k) return '';
  var merges = intakeMerges(kind);
  var show = merges[k] ? clientKey(merges[k]) : '';
  for (var i = 0; i < list.length; i++) {
    var lk = clientKey(list[i]);
    if (lk === k || (show && lk === show)) return list[i];
  }
  return '';
}

// Escrow Lookup's check of a Directing Customer or Listing Agent or Loan Officer edit,
// New Escrow's rule: each name (a co-listing split on " / ") must be on its list or be
// ticked "Add it" on the page (add[kind]). Listed names come back in their listed
// spelling; unconfirmed new names go into unlisted, confirmed ones into toAdd.
// Returns { val } or { err }.
function intakeNamesCheck(kind, value, add, list, unlisted, toAdd) {
  var parts = kind === 'agent' ? String(value).split(/\s+\/\s+/) : [value], named = [];
  for (var i = 0; i < parts.length; i++) {
    var p = normName(parts[i]);
    if (!p) continue;
    var hit = intakeMatch(kind, p, list);
    if (hit) { named.push(hit); continue; }
    if (kind === 'agent' && /\//.test(p) && !/^n\s*\/\s*a$/i.test(p))
      return { err: '"' + esc(p) + '" has a slash in it. For a co-listing, put a space on each side of the slash: Agent A / Agent B. Nothing was saved.' };
    if (clientKey(p).length < 2) return { err: 'Type the full name for ' + INTAKE_LISTS[kind].field + '. Nothing was saved.' };
    var ok = (add[kind] || []).some(function (x) { return clientKey(x) === clientKey(p); });
    if (ok) toAdd.push([kind, p]);
    else unlisted.push({ kind: kind, noun: INTAKE_LISTS[kind].noun, name: p, similar: intakeSimilar(p, list) });
    named.push(p);
  }
  return { val: named.join(' / ') };
}

// Close names for "Did you mean": edit distance on the client key, or one key
// containing the other. Up to 5, closest first.
function intakeSimilar(name, list) {
  var k = clientKey(name);
  if (k.length < 3) return [];
  var limit = Math.max(2, Math.floor(k.length / 5)), hits = [];
  list.forEach(function (n) {
    var lk = clientKey(n);
    var d = intakeDistance(k, lk);
    var contains = Math.min(k.length, lk.length) >= 4 && (lk.indexOf(k) >= 0 || k.indexOf(lk) >= 0);
    if (d <= limit || contains) hits.push({ n: n, d: contains ? Math.min(d, limit) : d });
  });
  hits.sort(function (a, b) { return a.d - b.d; });
  return hits.slice(0, 5).map(function (h) { return h.n; });
}

function intakeDistance(a, b) {
  if (Math.abs(a.length - b.length) > 6) return 99;
  var prev = [], cur, i, j;
  for (j = 0; j <= b.length; j++) prev[j] = j;
  for (i = 1; i <= a.length; i++) {
    cur = [i];
    for (j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/* ========================= HUB LOG ========================= */

// A row whose Action ends "(test)" goes to the test tab, never the Hub Log, so the
// real log holds only real activity (2026-10-20).
function intakeLog(rows) {
  var test = [], real = [];
  (rows || []).forEach(function (r) { (/\(test\)$/.test(String(r[2])) ? test : real).push(r); });
  intakeLogTo(INTAKE.logTab, real);
  intakeLogTo(INTAKE.testLogTab, test);
}

function intakeLogTo(tab, rows) {
  if (!rows.length) return;
  try {
    var ss = intakeContentSheet();
    var sh = ss.getSheetByName(tab);
    if (!sh) {
      sh = ss.insertSheet(tab);
      sh.appendRow(['When', 'Who', 'Action', 'Team', 'Sheet ID', 'Row ID', 'Escrow #', 'Field', 'Value', 'Old value']);
      sh.setFrozenRows(1);
    }
    if (sh.getRange(1, 10).getValue() !== 'Old value') sh.getRange(1, 10).setValue('Old value');  // added for Phase 2 updates
    rows = rows.map(function (r) { r = r.slice(0, 10); while (r.length < 10) r.push(''); return r; });
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, 10).setValues(rows);
  } catch (e) { console.error(tab + ' write failed: ' + e); }
}

/* ========================= NEW ESCROW: PAGE ========================= */

function intakeOpenPage(selfUrl, params) {
  var u = intakeUser();
  var key = (params && params.t) ? String(params.t).toLowerCase() : u.team;
  var scratch = String(params && params.scratch || '') === '1';
  var head = '';

  if (u.allTeam) {
    head = '<div class="tbtns" style="margin-bottom:14px">' + Object.keys(TEAMS).map(function (k) {
      return '<a class="pbtn' + (k === key ? '' : ' ghost') + '" href="' + esc(selfUrl) + '?page=open&t=' + esc(k) +
        (scratch ? '&scratch=1' : '') + '" target="_top">' + esc(TEAMS[k].label) + '</a>';
    }).join('') + '</div>';
  }
  if (!u.allTeam) {
    return '<div class="pcard"><h2 class="ph2">New Escrow</h2><p class="pnote">The Hub could not read your sign-in, so it cannot open a file for you. ' +
      'Sign in with your Five Star Google account and reload this page.</p></div>';
  }
  if (!key || !TEAMS[key]) {
    return '<div class="pcard"><h2 class="ph2">New Escrow</h2>' + head +
      '<p class="pnote">Pick the team the file belongs to.</p></div>';
  }

  var col, clients, agents;
  try {
    col = intakeColumns(intakeApi('get', '/sheets/' + intakeSheetId(key, scratch) + '/columns?includeAll=true').data);
    clients = intakeList('client');
    agents = intakeList('agent');
  } catch (e) {
    return '<div class="pcard"><h2 class="ph2">New Escrow</h2><p class="pnote">' + esc(e.message) + '</p></div>';
  }

  var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
  var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var inputs = INTAKE.fields.map(function (f) {
    var c = col(f.col);
    if (!c) return '';
    var id = 'f' + c.id, lab = '<label class="ilab" for="' + id + '">' + esc(f.col) + (f.req ? ' <span class="ireq">*</span>' : '') + '</label>';
    var attrs = ' id="' + id + '" data-col="' + esc(f.col) + '"' + (f.req ? ' data-req="1"' : '') + (f.po ? ' data-po="1"' : '');
    if (f.kind === 'check') {
      return '<div class="ifield icheck"><label><input type="checkbox"' + attrs + '> ' + esc(f.col) + '</label></div>';
    }
    var el;
    if (f.kind === 'pick' || f.kind === 'status') {
      var opts = (c.options || []).filter(function (o) {
        return f.kind !== 'status' || INTAKE.closedStatuses.indexOf(String(o).trim().toLowerCase()) < 0;
      });
      el = '<select class="iin"' + attrs + '><option value="">Choose...</option>' +
        opts.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>';
    } else if (f.kind === 'client') {
      el = '<div class="ita"><input class="iin" data-ta="client" autocomplete="off" placeholder="Start typing the client name"' + attrs + '><div class="isug"></div></div>' +
        '<div class="ihint">New customer? Type the full name; saving asks you to confirm it.</div><div class="inew" data-kind="client"></div>';
    } else if (f.kind === 'agent') {
      el = '<div class="ita"><input class="iin" data-ta="agent" autocomplete="off" placeholder="Start typing the name; FSBO or N/A if none"' + attrs + '><div class="isug"></div></div>' +
        '<div class="ihint">Co-listing: Agent A / Agent B. New name? Type it in full; saving asks you to confirm it.</div><div class="inew" data-kind="agent"></div>';
    } else if (f.kind === 'date') {
      el = '<input class="iin" type="date"' + attrs + (f.today ? ' value="' + today + '"' : '') + '>';
    } else if (f.kind === 'money') {
      el = '<input class="iin" inputmode="decimal" placeholder="1,250"' + attrs + '>';
    } else {
      el = '<input class="iin" autocomplete="off"' + attrs + '>';
    }
    return '<div class="ifield"' + (f.po ? ' data-pof="1"' : '') + '>' + lab + el + '</div>';
  }).join('');

  // Type-ahead data for the two lookups (our own dropdown; a native <datalist> does
  // not show suggestions in every browser, Brett 2026-10-19).
  var taData = 'var TA=' + JSON.stringify({ client: clients, agent: agents }).replace(/</g, '\\u003c') + ';';
  var testBanner = scratch ? '<p class="imsg bad">TEST MODE: this writes to the scratch copy, not the ' + esc(TEAMS[key].label) + ' sheet.</p>' : '';

  return intakeCss() +
    '<div class="pcard"><h2 class="ph2">New Escrow · ' + esc(TEAMS[key].label) + '</h2>' + head + testBanner +
    '<style>.iopts{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 14px}.iopts .ipo{display:inline-block;margin:0}#ipfmsg .imsg{margin:-4px 0 14px}</style>' +
    '<div class="iopts"><label class="inewc ipo"><input type="checkbox" id="ipre"> <b>Pre-open</b></label>' +
    '<label class="inewc ipo"><input type="checkbox" id="ipf"> <b>Prefill client info</b></label></div><div id="ipfmsg"></div>' +
    '<form id="iform" class="igrid" onsubmit="return false">' + inputs + '</form>' +
    '<div class="iact"><button id="isave" class="pbtn big" type="button">Open the file</button></div>' +
    '<div id="imsg"></div></div>' +
    '<script>' + taData + INTAKE_TA_JS + INTAKE_NEW_JS +
    'var KEY=' + JSON.stringify(key) + ',SCR=' + (scratch ? 'true' : 'false') + ';' +
    'var b=document.getElementById("isave"),m=document.getElementById("imsg"),pre=document.getElementById("ipre");' +
    'function say(t,ok){m.innerHTML="<p class=\\"imsg "+(ok?"good":"bad")+"\\">"+t+"</p>";}' +
    'function lbl(){b.textContent=pre.checked?"Pre-open the file":"Open the file";}' +
    'pre.addEventListener("change",function(){document.querySelectorAll("[data-pof]").forEach(function(d){d.style.display=pre.checked?"none":"";});lbl();});' +
    INTAKE_PREFILL_JS +
    'b.addEventListener("click",function(){' +
      'var v={},miss=[];' +
      'document.querySelectorAll("[data-col]").forEach(function(el){' +
        'if(pre.checked&&el.getAttribute("data-po"))return;' +
        'var val=el.type==="checkbox"?el.checked:el.value.trim();v[el.getAttribute("data-col")]=val;' +
        'if(el.getAttribute("data-req")&&!val)miss.push(el.getAttribute("data-col"));});' +
      'if(miss.length){say("Fill in: "+miss.join(", ")+".",false);return;}' +
      'v.__add=newAdds();v.__preopen=pre.checked;' +
      'b.disabled=true;b.textContent="Saving...";m.innerHTML="";' +
      'google.script.run.withSuccessHandler(function(r){b.disabled=false;lbl();' +
        'if(r.ok){say(r.msg,true);document.getElementById("iform").reset();newClear();pfm.innerHTML="";pre.checked=false;pre.dispatchEvent(new Event("change"));}' +
        'else{if(r.unlisted)newShow(r.unlisted);say(r.msg,false);}})' +
      '.withFailureHandler(function(e){b.disabled=false;lbl();say("Nothing was saved: "+e.message,false);})' +
      '.intakeSubmitOpen(KEY,v,SCR);' +
    '});' +
    '</script>';
}

/* ========================= PREFILL CLIENT INFO ========================= */

// Fields "Prefill client info" copies from the most recent matching file (Joyce, for
// VREV, 2026-10-26). Directing Customer is copied only when the match is by agent.
var INTAKE_PREFILL = ['Type', 'Sales Rep', 'Title Company', 'Title Rep'];

// Called from New Escrow. kind: 'client' (Directing Customer) or 'agent' (Listing Agent
// or Loan Officer). Read-only. Returns { ok, fields: {col: value}, from, msg }.
function intakePrefill(kind, name) {
  try {
    if (!intakeUser().allTeam) return { ok: false, msg: 'The Hub could not read your sign-in.' };
    var want = normName(name).toLowerCase();
    if (!want || (kind !== 'client' && kind !== 'agent')) return { ok: false, msg: '' };
    var idx = intakeFileIndex(false);
    if (!idx.ok) return { ok: false, msg: 'Could not look up earlier files: ' + idx.msg };
    var at = kind === 'client' ? 5 : 6, hit = null;
    for (var i = 0; i < idx.rows.length && !hit; i++) {   // rows are newest opens first
      if (normName(idx.rows[i][at]).toLowerCase() === want && TEAMS[idx.rows[i][0]]) hit = idx.rows[i];
    }
    if (!hit) return { ok: true, fields: {}, msg: 'No earlier file for ' + esc(name) + ', so nothing was filled.' };
    var f = intakeFileRow(hit[0], hit[1], false), fields = {};
    INTAKE_PREFILL.concat(kind === 'agent' ? ['Directing Customer'] : []).forEach(function (col) {
      var val = normName(f.d[col.toLowerCase()]);
      if (val) fields[col] = val;
    });
    var when = validDate(hit[11]);
    return { ok: true, fields: fields, msg: 'Filled from ' + esc(hit[2]) + ' (' + esc(TEAMS[hit[0]].label) + (when ? ', opened ' + esc(fullDate(when)) : '') + '). Check before saving.' };
  } catch (e) {
    return { ok: false, msg: 'Could not prefill: ' + esc(e.message || String(e)) };
  }
}

// New Escrow side of "Prefill client info". A pick (or a change) in Directing Customer
// fills from that customer; in Listing Agent or Loan Officer it fills only while
// Directing Customer is empty. Only empty fields are filled; a pick list value the
// sheet does not offer is skipped.
var INTAKE_PREFILL_JS =
  'var pf=document.getElementById("ipf"),pfm=document.getElementById("ipfmsg"),pfSeq=0;' +
  'function pfNote(t,ok){pfm.innerHTML=t?"<p class=\\"imsg "+(ok?"good":"bad")+"\\">"+t+"</p>":"";}' +
  'function pfFill(fields){Object.keys(fields).forEach(function(c){var el=document.querySelector("[data-col=\\""+c+"\\"]");if(!el||el.value.trim())return;' +
    'if(el.tagName==="SELECT"){var ok=[].some.call(el.options,function(o){return o.value===fields[c];});if(ok)el.value=fields[c];}else el.value=fields[c];});}' +
  'function pfRun(kind){if(!pf.checked)return;var inp=document.querySelector("[data-ta=\\""+kind+"\\"]");if(!inp)return;var name=inp.value.trim();if(!name)return;' +
    'if(kind==="agent"){var cl=document.querySelector("[data-ta=\\"client\\"]");if(cl&&cl.value.trim())return;}' +
    'var seq=++pfSeq;pfNote("Looking up the last file for "+newEsc(name)+"...",true);' +
    'google.script.run.withSuccessHandler(function(r){if(seq!==pfSeq)return;if(r.ok&&r.fields)pfFill(r.fields);pfNote(r.msg,r.ok);})' +
    '.withFailureHandler(function(e){if(seq===pfSeq)pfNote("Could not prefill: "+e.message,false);}).intakePrefill(kind,name);}' +
  '["client","agent"].forEach(function(k){var inp=document.querySelector("[data-ta=\\""+k+"\\"]");if(inp)inp.addEventListener("change",function(){pfRun(k);});});' +
  'pf.addEventListener("change",function(){if(!pf.checked){pfNote("");return;}pfRun("client");pfRun("agent");});';

// Type-ahead for inputs marked data-ta="client" or "agent": up to 8 matches from TA
// as the person types (anywhere in the name, punctuation ignored); click, or arrow
// keys and Enter, to pick. On the agent field the lookup applies to the text after
// the last " / ", so a co-listing can be built one name at a time.
var INTAKE_TA_JS =
  'function taKey(s){return String(s).toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g,"");}' +
  'document.querySelectorAll("[data-ta]").forEach(function(inp){' +
    'var box=inp.parentNode.querySelector(".isug"),kind=inp.getAttribute("data-ta"),list=TA[kind]||[],multi=kind==="agent",hi=-1,items=[];' +
    'function seg(){var v=inp.value;if(!multi)return {pre:"",q:v};var i=v.lastIndexOf(" / ");return i<0?{pre:"",q:v}:{pre:v.slice(0,i+3),q:v.slice(i+3)};}' +
    'function close(){box.style.display="none";hi=-1;}' +
    'function pick(n){var s=seg();inp.value=s.pre+n;close();inp.focus();inp.dispatchEvent(new Event("change"));}' +
    'function render(){var s=seg(),q=s.q.trim().toLowerCase(),k=taKey(q);if(!q){close();return;}' +
      'items=list.filter(function(n){return n.toLowerCase().indexOf(q)>=0||(k&&taKey(n).indexOf(k)>=0);});' +
      'items.sort(function(a,b){var ia=a.toLowerCase().indexOf(q),ib=b.toLowerCase().indexOf(q);ia=ia<0?99:ia;ib=ib<0?99:ib;return (ia-ib)||(a.toLowerCase()<b.toLowerCase()?-1:1);});' +
      'items=items.slice(0,8);' +
      'if(!items.length){box.innerHTML="<div class=\\"isn\\">No match. If it is new, type the full name; saving asks you to confirm it.</div>";box.style.display="block";return;}' +
      'box.innerHTML=items.map(function(n,i){return "<div class=\\"isi"+(i===hi?" on":"")+"\\" data-i=\\""+i+"\\">"+n.replace(/&/g,"&amp;").replace(/</g,"&lt;")+"</div>";}).join("");' +
      'box.style.display="block";}' +
    'inp.addEventListener("input",function(){hi=-1;render();});' +
    'inp.addEventListener("keydown",function(e){if(e.key==="Escape"){close();return;}if(box.style.display!=="block"||!items.length)return;' +
      'if(e.key==="ArrowDown"){hi=Math.min(hi+1,items.length-1);render();e.preventDefault();}' +
      'else if(e.key==="ArrowUp"){hi=Math.max(hi-1,0);render();e.preventDefault();}' +
      'else if(e.key==="Enter"&&hi>=0){pick(items[hi]);e.preventDefault();}});' +
    'box.addEventListener("mousedown",function(e){var t=e.target.closest(".isi");if(t){pick(items[+t.getAttribute("data-i")]);e.preventDefault();}});' +
    'inp.addEventListener("blur",function(){setTimeout(close,150);});' +
  '});';

// "Not on the list" notes under Directing Customer and Listing Agent or Loan Officer.
// A save returns r.unlisted ([{kind, noun, name, similar}]); each gets its closest
// matches as buttons (a click swaps the name into the field) and an "Add it" checkbox.
// Ticked names go back as v.__add and are added to their list when the file saves.
var INTAKE_NEW_JS =
  'function newEsc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");}' +
  'function newBox(k){return document.querySelector(".inew[data-kind=\\""+k+"\\"]");}' +
  'function newClear(){document.querySelectorAll(".inew").forEach(function(d){d.innerHTML="";});}' +
  'function newShow(list){newClear();list.forEach(function(u){var d=newBox(u.kind);if(!d)return;' +
    'var h="<div class=\\"inewbox\\"><b>"+newEsc(u.name)+"</b> is not on the "+u.noun+" list.";' +
    'if(u.similar&&u.similar.length){h+=" Did you mean:<div class=\\"inewm\\">"+u.similar.map(function(s){' +
      'return "<button type=\\"button\\" class=\\"pmchip\\" data-swap=\\""+newEsc(s)+"\\" data-from=\\""+newEsc(u.name)+"\\" data-kind=\\""+u.kind+"\\">"+newEsc(s)+"</button>";}).join("")+"</div>";}' +
    'h+="<label class=\\"inewc\\"><input type=\\"checkbox\\" data-add=\\""+u.kind+"\\" data-name=\\""+newEsc(u.name)+"\\"> Add it as a new "+u.noun+"</label></div>";' +
    'd.insertAdjacentHTML("beforeend",h);});}' +
  'function newAdds(){var a={client:[],agent:[]};document.querySelectorAll("[data-add]").forEach(function(c){if(c.checked)a[c.getAttribute("data-add")].push(c.getAttribute("data-name"));});return a;}' +
  'function newNorm(s){return String(s).trim().replace(/\\s+/g," ").toLowerCase();}' +
  'document.addEventListener("click",function(e){var t=e.target.closest("[data-swap]");if(!t)return;' +
    'var k=t.getAttribute("data-kind"),inp=document.querySelector("[data-ta=\\""+k+"\\"]"),from=newNorm(t.getAttribute("data-from")),to=t.getAttribute("data-swap");' +
    'inp.value=k==="agent"?inp.value.split(/\\s+\\/\\s+/).map(function(p){return newNorm(p)===from?to:p.trim();}).join(" / "):to;' +
    't.closest(".inewbox").remove();document.getElementById("imsg").innerHTML="";});' +
  'document.querySelectorAll("[data-ta]").forEach(function(inp){inp.addEventListener("input",function(){var d=newBox(inp.getAttribute("data-ta"));if(d)d.innerHTML="";});});';

/* ========================= NEW ESCROW: SAVE ========================= */

// Called from the page. Returns { ok, msg }. Writes nothing unless every check passes.
function intakeSubmitOpen(key, v, scratch) {
  var lock = LockService.getScriptLock();
  try {
    var u = intakeUser();
    key = String(key || '').toLowerCase();
    if (!intakeCanOpen(u, key)) return { ok: false, msg: 'The Hub could not read your sign-in, or that team does not exist. Reload the page and try again. Nothing was saved.' };
    v = v || {};
    var escrowNo = normName(v['Escrow #']);
    if (!escrowNo) return { ok: false, msg: 'Escrow # is required.' };

    // Directing Customer and each Listing Agent or Loan Officer name must be on its
    // approved list or be confirmed as new on the form (v.__add). Unconfirmed new names
    // go back to the page with their closest matches; nothing is written.
    var add = (v.__add && typeof v.__add === 'object') ? v.__add : {};
    var unlisted = [], toAdd = [];
    var unknown = function (kind, name, list) {
      if (clientKey(name).length < 2) return 'Type the full name for ' + INTAKE_LISTS[kind].field + '. Nothing was saved.';
      var ok = (add[kind] || []).some(function (x) { return clientKey(x) === clientKey(name); });
      if (ok) toAdd.push([kind, name]);
      else unlisted.push({ kind: kind, noun: INTAKE_LISTS[kind].noun, name: name, similar: intakeSimilar(name, list) });
      return '';
    };

    var clientList = intakeList('client', true), cName = normName(v['Directing Customer']);
    if (cName) {
      var listed = intakeMatch('client', cName, clientList);
      if (listed) v['Directing Customer'] = listed;
      else { var bad = unknown('client', cName, clientList); if (bad) return { ok: false, msg: bad }; v['Directing Customer'] = cName; }
    }

    // A co-listing is split on " / " (spaces required, so "N/A" stays whole).
    var agentList = intakeList('agent', true), parts = String(v['Listing Agent or Loan Officer'] || '').split(/\s+\/\s+/), named = [];
    for (var pi = 0; pi < parts.length; pi++) {
      var p = normName(parts[pi]);
      if (!p) continue;
      var hit = intakeMatch('agent', p, agentList);
      if (hit) { named.push(hit); continue; }
      if (/\//.test(p) && !/^n\s*\/\s*a$/i.test(p))
        return { ok: false, msg: '"' + esc(p) + '" has a slash in it. For a co-listing, put a space on each side of the slash: Agent A / Agent B. Nothing was saved.' };
      var bad2 = unknown('agent', p, agentList);
      if (bad2) return { ok: false, msg: bad2 };
      named.push(p);
    }
    if (named.length) v['Listing Agent or Loan Officer'] = named.join(' / ');
    if (unlisted.length) return { ok: false, unlisted: unlisted,
      msg: (unlisted.length === 1 ? 'One name is' : unlisted.length + ' names are') +
        ' not on the list (see under the field). Pick a match or tick "Add it", then click Open the file again. Nothing was saved.' };

    // Projected COE decides the month section; a pre-open goes under PRE-OPENS.
    var pre = v.__preopen === true, monthLabel = INTAKE_EDIT.preopen;
    if (!pre) {
      var proj = validDate(v['Projected COE']);
      if (!proj) return { ok: false, msg: 'Projected COE needs a date.' };
      monthLabel = INTAKE_MONTHS[Number(proj.substring(5, 7)) - 1] + ' ' + proj.substring(0, 4);
    }

    lock.waitLock(20000);

    // Duplicate check across all five team sheets (fresh read), plus the scratch copy in test.
    // Reads only the four columns it needs, in one parallel round trip (2026-11-03; it
    // was every column of every sheet, twice over, which made a save take 15 to 45 seconds).
    var grids = intakeSearchGrids(false, ['Escrow #', 'File Status', 'Actual COE', 'Property Address']);
    var target = null, sheetId = intakeSheetId(key, scratch);
    if (scratch) grids.__scratch = intakeApi('get', '/sheets/' + sheetId);
    // A match on a Canceled file may be reused; a match on any other file stops the save.
    var unreadable = '', live = null, reused = [];
    Object.keys(grids).forEach(function (k) {
      var g = grids[k];
      if (!g) { if (!unreadable) unreadable = k; return; }
      var col = intakeColumns(g.columns), c = col('Escrow #'), st = col('File Status'), ac = col('Actual COE');
      if (!c) return;
      var label = TEAMS[k] ? TEAMS[k].label : 'scratch copy';
      (g.rows || []).forEach(function (r) {
        var no = '', status = '', coe = '';
        (r.cells || []).forEach(function (cell) {
          if (cell.columnId === c.id) no = normName(cell.value);
          if (st && cell.columnId === st.id) status = normName(cell.value);
          if (ac && cell.columnId === ac.id) coe = cell.value;
        });
        if (!no || no.toLowerCase() !== escrowNo.toLowerCase()) return;
        if (status.toLowerCase() === 'canceled') { if (reused.indexOf(label) < 0) reused.push(label); return; }
        if (!live) live = { key: k, label: label, id: r.id, state: validDate(coe) ? 'closed' : status ? 'open' : 'preopen' };
      });
    });
    if (unreadable) return { ok: false, msg: 'Could not read the ' + esc(TEAMS[unreadable] ? TEAMS[unreadable].label : 'scratch') + ' sheet to check for a duplicate. Nothing was saved; try again in a minute.' };
    if (live) {
      var link = TEAMS[live.key] ? ' <a href="' + esc(ScriptApp.getService().getUrl()) + '?page=file&t=' + esc(live.key) + '&r=' + esc(String(live.id)) + '" target="_top">Open that file</a>.' : '';
      var what = live.state === 'closed' ? 'a closed' : live.state === 'preopen' ? 'a pre-open' : 'an open';
      var fix = live.state === 'closed' ? 'Check the number.'
              : live.state === 'preopen' ? 'If that pre-open is dead, remove it on its team page first, then open this one.'
              : 'If that file was canceled, cancel it in Escrow Lookup first, then open this one.';
      return { ok: false, msg: 'Duplicate escrow #: ' + esc(escrowNo) + ' is already used by ' + what + ' ' + esc(live.label) + ' file. ' + fix + ' Nothing was saved.' + link };
    }
    // The placement read above carries four columns; the cell build needs every column
    // and its pick lists, read fresh.
    target = scratch ? grids.__scratch : { rows: grids[key].rows, columns: intakeApi('get', '/sheets/' + sheetId + '/columns?includeAll=true').data };

    // Find the month section and its "Insert new files above" row.
    var col = intakeColumns(target.columns), addr = col('Property Address');
    var monthRow = null, marker = null;
    (target.rows || []).forEach(function (r) {
      var a = '';
      (r.cells || []).forEach(function (cell) { if (addr && cell.columnId === addr.id) a = normName(cell.value); });
      if (!monthRow && a.toUpperCase() === monthLabel) monthRow = r;
      if (monthRow && !marker && r.parentId === monthRow.id && a.toLowerCase() === INTAKE.insertMarker) marker = r;
    });
    if (!monthRow && pre) return { ok: false, msg: 'The ' + esc(TEAMS[key].label) + ' sheet has no Pre-opens section, so the file has nowhere to go. Tell Brett. Nothing was saved.' };
    if (!monthRow) return { ok: false, msg: 'The ' + esc(TEAMS[key].label) + ' sheet has no ' + monthLabel.charAt(0) + monthLabel.slice(1).toLowerCase() +
      ' section yet, so the file has nowhere to go. Check the Projected COE. If the date is right, ask Elizabeth to add that year\'s month sections. Nothing was saved.' };

    // Build the cells; refuse a value a restricted pick list would reject.
    var cells = [], logged = [];
    for (var i = 0; i < INTAKE.fields.length; i++) {
      var f = INTAKE.fields[i], c = col(f.col);
      if (!c || (pre && f.po)) continue;
      var val = v[f.col];
      if (f.kind === 'check') { val = !!val; }
      else {
        val = normName(val);
        if (!val) { if (f.req) return { ok: false, msg: f.col + ' is required.' }; continue; }
        if (f.kind === 'date') { val = validDate(val); if (!val) return { ok: false, msg: f.col + ' needs a date.' }; }
        if (f.kind === 'money') { var n = num(val); if (!(n > 0)) return { ok: false, msg: 'Escrow Fees needs a dollar amount.' }; val = n; }
        if ((f.kind === 'pick' || f.kind === 'status') && (c.options || []).indexOf(val) < 0)
          return { ok: false, msg: '"' + esc(val) + '" is not a ' + f.col + ' choice on this sheet. Nothing was saved.' };
        if (f.kind === 'status' && INTAKE.closedStatuses.indexOf(val.toLowerCase()) >= 0)
          return { ok: false, msg: 'A new file cannot open as ' + esc(val) + '.' };
      }
      cells.push({ columnId: c.id, value: val, strict: false });
      logged.push([f.col, val]);
    }

    var loc = marker ? { siblingId: marker.id, above: true } : { parentId: monthRow.id, toBottom: true };
    var row = { cells: cells };
    Object.keys(loc).forEach(function (x) { row[x] = loc[x]; });
    var res = intakeApi('post', '/sheets/' + sheetId + '/rows', [row]);
    var made = (res.result && res.result[0]) || {};

    // Test mode never touches the live Clients and Agents lists: the add is logged as
    // "(test)" and reported, but nothing is appended (2026-10-20, after ZZ test names
    // reached the lists and logged untagged on 10/19).
    var when = new Date(), added = [], tag = scratch ? ' (test)' : '';
    toAdd.forEach(function (a) {
      if (scratch) { added.push(a); return; }
      try { if (intakeAddToList(a[0], a[1], u, when)) added.push(a); }
      catch (e) { console.error('List add failed for ' + a[1] + ': ' + e); }
    });
    intakeLog(logged.map(function (p) {
      return [when, u.email, (pre ? 'pre-open' : 'open') + tag, TEAMS[key].label, "'" + sheetId, made.id ? "'" + made.id : '', escrowNo, p[0], String(p[1])];  // leading ' keeps 16-digit IDs as text
    }).concat(added.map(function (a) {
      return [when, u.email, 'new ' + a[0] + tag, TEAMS[key].label, '', '', escrowNo, INTAKE_LISTS[a[0]].field, a[1]];
    })).concat(reused.length ? [[when, u.email, 'reused Escrow #' + tag, TEAMS[key].label, "'" + sheetId, made.id ? "'" + made.id : '', escrowNo, 'Canceled file on', reused.join(', ')]] : []));
    try { CacheService.getScriptCache().removeAll(['portalTeam_' + key, 'portalPulse', 'intakePre_' + key]); } catch (e) {}
    if (made.id) intakeIndexPatch(key, made.id, scratch); else intakeIndexClear();

    return { ok: true, msg: (reused.length ? 'Duplicate escrow #: reused from a canceled ' + esc(reused.join(' and ')) + ' file. ' : '') + (pre ? 'Pre-opened ' : 'Opened ') + esc(escrowNo) + ' on the ' + esc(TEAMS[key].label) + (scratch ? ' scratch copy' : ' sheet') +
      ' under ' + intakeNiceSection(monthLabel) + (made.rowNumber ? ' (row ' + made.rowNumber + ')' : '') + '.' +
      (added.length ? (scratch ? ' Test: not added to the live list: ' : ' Added to the list: ') + added.map(function (a) { return esc(a[1]); }).join(', ') + '.' : '') +
      ' The form is clear for the next file.' };
  } catch (e) {
    return { ok: false, msg: esc(e.message || String(e)) };
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

/* ========================= LIST ADDS ========================= */

// Appends a name confirmed as new on New Escrow to its approved list. Re-checked under
// the save lock so a name added a moment ago is not added twice. True when it added.
function intakeAddToList(kind, name, u, when) {
  var L = INTAKE_LISTS[kind];
  if (intakeMatch(kind, name, intakeList(kind, true))) return false;
  var sh = intakeContentSheet().getSheetByName(L.tab);
  if (!sh) throw new Error('The ' + L.tab + ' tab is missing.');
  sh.appendRow([name, u.email, when]);
  CacheService.getScriptCache().remove('intakeList_' + kind);
  return true;
}

/* ========================= ONE-TIME SEED ========================= */

// Seeds the Clients tab from the client attribution index (every client on the
// five team sheets, spellings merged by the Client Merges tab). Preview by
// default: run intakeSeedClients() and read the log. Writes only with
// intakeSeedClientsApply(), on Brett's go, and only into an empty or missing tab.
function intakeSeedClients(apply) {
  var idx = attrIndex(true);
  if (!idx) throw new Error('Client index unavailable; nothing written.');
  var names = {}, out = [];
  idx.forEach(function (r) {
    var n = normName(r[0]), k = clientKey(n);
    if (n && k && !names[k]) { names[k] = 1; out.push(n); }
  });
  out.sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
  Logger.log('Clients to seed: ' + out.length + '. First 10: ' + out.slice(0, 10).join(' | ') + '. Last 5: ' + out.slice(-5).join(' | '));
  if (!apply) { Logger.log('Preview only; nothing written.'); return out.length; }
  var ss = intakeContentSheet();
  var sh = ss.getSheetByName(INTAKE_LISTS.client.tab);
  if (sh && sh.getLastRow() > 1) throw new Error('Clients tab already has ' + (sh.getLastRow() - 1) + ' rows; nothing written.');
  if (!sh) sh = ss.insertSheet(INTAKE_LISTS.client.tab);
  var when = new Date();
  var rows = [['Client', 'Added by', 'Added on']].concat(out.map(function (n) { return [n, 'seed from team sheets', when]; }));
  sh.getRange(1, 1, rows.length, 3).setValues(rows);
  sh.setFrozenRows(1);
  CacheService.getScriptCache().remove('intakeList_client');
  Logger.log('Wrote ' + out.length + ' clients to the Clients tab.');
  return out.length;
}
function intakeSeedClientsApply() { return intakeSeedClients(true); }

/* ========================= STYLE ========================= */

function intakeCss() {
  return '<style>' +
    '.igrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px 16px;margin-bottom:6px}' +
    '.ifield{display:flex;flex-direction:column;gap:5px}' +
    '.ilab{font-size:12.5px;font-weight:700;color:var(--navy)}' +
    '.ireq{color:#b91c1c}' +
    '.iin{font-size:14.5px;font-family:inherit;padding:9px 12px;border:1px solid var(--line);border-radius:9px;background:#fff;color:var(--ink);width:100%;box-sizing:border-box}' +
    '.iin:focus{outline:none;border-color:var(--navy);box-shadow:0 0 0 2px rgba(3,19,86,.12)}' +
    '.icheck{justify-content:flex-end}.icheck label{font-size:13.5px;font-weight:600;color:var(--ink);display:flex;gap:7px;align-items:center}' +
    '.icheck input{accent-color:var(--navy);width:16px;height:16px;margin:0}' +
    '.ihint{font-size:12px;color:var(--mut)}.ihint a{color:var(--navy)}' +
    '.ita{position:relative}' +
    '.isug{display:none;position:absolute;left:0;right:0;top:100%;z-index:20;margin-top:2px;background:#fff;border:1px solid var(--line);border-radius:9px;box-shadow:0 6px 16px rgba(3,19,86,.15);max-height:260px;overflow:auto}' +
    '.isi{padding:8px 12px;font-size:14px;color:var(--ink);cursor:pointer}.isi:hover,.isi.on{background:#eef2fb;color:var(--navy)}' +
    '.isn{padding:8px 12px;font-size:13px;color:var(--mut)}' +
    '.isub{display:block;font-size:12px;color:var(--mut)}' +
    '.inew:empty{display:none}.inewbox{margin-top:6px;padding:9px 12px;border:1px solid #fde68a;background:#fffbeb;border-radius:9px;font-size:13px;color:var(--ink)}' +
    '.inewm{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.inewm .pmchip{border:1px solid var(--line);cursor:pointer;font-family:inherit}' +
    '.inewc{display:flex;gap:7px;align-items:center;margin-top:6px;font-weight:600}.inewc input{accent-color:var(--navy);width:16px;height:16px;margin:0}' +
    '.iact{margin-top:14px}' +
    '.imsg{font-size:14px;font-weight:600;border-radius:9px;padding:10px 14px;margin:14px 0 0}' +
    '.imsg.good{background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0}' +
    '.imsg.bad{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}' +
    '.pbtn[disabled]{opacity:.6;cursor:wait}button.pbtn{border:0;cursor:pointer;font-family:inherit}' +
    '.iro{font-size:14.5px;padding:9px 0;color:var(--ink);border-bottom:1px solid var(--line);min-height:20px}.imut{color:var(--mut);font-style:italic}' +
    '.ihead{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}' +
    '.isearch{display:flex;gap:10px;max-width:640px}.isearch .iin{flex:1}' +
    '.iacts{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:16px}' +
    '.iactbox{border:1px solid var(--line);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:8px}.iactbox .ihint{margin:0}' +
    '.iactrow{display:flex;flex-direction:column;gap:5px}' +
    '.pbtn.sm{padding:5px 12px;font-size:12.5px}' +
    '.ipo{display:block;margin:0 0 14px;padding:10px 12px;border:1px solid var(--line);border-radius:9px;font-weight:400;line-height:1.45}.ipo input{vertical-align:-3px;margin-right:7px}.ipo b{color:var(--navy)}' +
    '</style>';
}

/* ========================= FIND AND UPDATE (Phase 2) ========================= */

// Hub intake Phase 2 (2026-10-19): find any file on the five team sheets and update
// it in the Hub. ?page=file searches (one type-ahead field per column: Escrow #, address,
// seller or borrower, client, agent or loan officer, buyer agent); &t=key&r=rowId opens one file.
//  - Everyone can look up every team's files. Edits follow the New Escrow rule:
//    everyone signed in may change any team's file (Brett, 2026-10-21).
//  - Editable: Projected COE, Escrow Fees, Buyer Agent, Buyer Agent Phone #, and
//    File Status (open statuses; Brett, 2026-10-19). Close sets File Status Closed
//    plus Actual COE; Cancel sets Canceled. A closed or canceled file reopens by picking an
//    open status; on a closed file that clears Actual COE (Brett, 2026-11-03).
//    Property Address is editable in every state, never blank (Brett, 2026-10-22).
//  - Since the team sheets went view-only (Brett, 2026-11-02) every column but Escrow #
//    is editable here: Seller/Borrower, Type, Directing Customer, Listing Agent or Loan
//    Officer, Sales Rep, Title Company, Title Rep, and Wholesale? in every state; Open
//    Date on open, canceled, and closed files (a pre-open gets it from Open it). The two
//    names use New Escrow's type-ahead and approved-list check ("Did you mean", "Add it").
//  - Before saving, the row is read fresh; if anything being changed no longer
//    matches what the page showed, nothing is saved (someone edited it in Smartsheet).
//  - Placement: a canceled file sits under CANCELED; any other file under the month of
//    its Actual COE, or its Projected COE while open. When a save changes that, the row
//    moves above the new month's "Insert new files above" row (or to the bottom of
//    CANCELED). A month with no section refuses the whole save.
//  - Every changed field is logged to the Hub Log with its old value.

var INTAKE_EDIT = {
  show: ['Escrow #', 'Property Address', 'Seller/Borrower', 'Type', 'Directing Customer', 'Listing Agent or Loan Officer',
         'Buyer Agent', 'Buyer Agent Phone #', 'Sales Rep', 'Title Company', 'Title Rep', 'Open Date', 'Projected COE',
         'Actual COE', 'File Status', 'Escrow Fees', 'Wholesale?'],
  kinds: { 'Open Date': 'date', 'Projected COE': 'date', 'Actual COE': 'date', 'Escrow Fees': 'money', 'Buyer Agent': 'text',
           'Buyer Agent Phone #': 'text', 'File Status': 'status', 'Property Address': 'text', 'Seller/Borrower': 'text',
           'Type': 'pick', 'Directing Customer': 'client', 'Listing Agent or Loan Officer': 'agent', 'Sales Rep': 'pick',
           'Title Company': 'pick', 'Title Rep': 'text', 'Wholesale?': 'check' },
  // Editable in every state; each state adds its own fields in intakeFilePage.
  always: ['Property Address', 'Seller/Borrower', 'Type', 'Directing Customer', 'Listing Agent or Loan Officer', 'Buyer Agent',
           'Buyer Agent Phone #', 'Sales Rep', 'Title Company', 'Title Rep', 'Wholesale?'],
  required: ['Property Address', 'Seller/Borrower', 'Type', 'Directing Customer', 'Listing Agent or Loan Officer', 'Sales Rep'],
  search: ['Escrow #', 'Property Address', 'Seller/Borrower', 'Directing Customer', 'Listing Agent or Loan Officer', 'Buyer Agent',
           'File Status', 'Open Date', 'Projected COE', 'Actual COE'],
  canceled: 'CANCELED',
  preopen: 'PRE-OPENS',
  staleDays: 60,                     // a pre-open this old is listed on its team page (Brett, 2026-10-20)
  maxResults: 30
};

// Value for comparing what the page showed with what the sheet holds now.
function intakeCmp(kind, v) {
  if (kind === 'date') return validDate(v);
  if (kind === 'money') { var s = normName(v); return s === '' ? '' : String(num(s)); }
  if (kind === 'check') return v === true || /^(yes|true)$/i.test(normName(v)) ? 'Yes' : 'No';
  return normName(v);
}

// Column id -> lowercased title.
function intakeTitles(cols) {
  var m = {};
  (cols || []).forEach(function (c) { m[c.id] = String(c.title).trim().toLowerCase(); });
  return m;
}

// { 'lowercased title': raw value } and the same for display values.
function intakeRowVals(row, titles) {
  var v = {}, d = {};
  (row.cells || []).forEach(function (c) {
    var t = titles[c.columnId];
    if (!t) return;
    v[t] = c.value == null ? '' : c.value;
    d[t] = c.displayValue != null ? c.displayValue : (c.value == null ? '' : String(c.value));
  });
  return { v: v, d: d };
}

// Sheets the search reads: the five team sheets, or the scratch copies in test.
function intakeSearchSheets(scratch) {
  var out = {};
  Object.keys(TEAMS).forEach(function (k) {
    if (scratch) { if (INTAKE.scratch[k]) out[k] = INTAKE.scratch[k]; }
    else out[k] = TEAMS[k].sheet;
  });
  return out;
}

// The named columns (default INTAKE_EDIT.search) of every sheet in one parallel round
// trip. Column ids are cached 6 hours per sheet so the row fetch carries only the
// columns it needs. New Escrow's duplicate check uses it with four columns (2026-11-03).
function intakeSearchGrids(scratch, titles) {
  var sheets = intakeSearchSheets(scratch), keys = Object.keys(sheets), cache = CacheService.getScriptCache();
  var hdr = { Authorization: 'Bearer ' + intakeToken() }, colMaps = {}, need = [];
  keys.forEach(function (k) {
    var hit = cache.get('intakeCols_' + sheets[k]);
    if (hit) colMaps[k] = JSON.parse(hit); else need.push(k);
  });
  if (need.length) {
    var cr = UrlFetchApp.fetchAll(need.map(function (k) {
      return { url: 'https://api.smartsheet.com/2.0/sheets/' + sheets[k] + '/columns?includeAll=true', headers: hdr, muteHttpExceptions: true };
    }));
    need.forEach(function (k, i) {
      if (cr[i].getResponseCode() !== 200) return;
      var cols = (JSON.parse(cr[i].getContentText()).data || []).map(function (c) { return { id: c.id, title: c.title }; });
      colMaps[k] = cols;
      try { cache.put('intakeCols_' + sheets[k], JSON.stringify(cols), 21600); } catch (e) {}
    });
  }
  var want = (titles || INTAKE_EDIT.search).map(function (s) { return s.toLowerCase(); });
  var ready = keys.filter(function (k) { return colMaps[k]; });
  var res = UrlFetchApp.fetchAll(ready.map(function (k) {
    var ids = colMaps[k].filter(function (c) { return want.indexOf(String(c.title).trim().toLowerCase()) >= 0; }).map(function (c) { return c.id; });
    return { url: 'https://api.smartsheet.com/2.0/sheets/' + sheets[k] + '?columnIds=' + ids.join(','), headers: hdr, muteHttpExceptions: true };
  }));
  var out = {};
  keys.forEach(function (k) { out[k] = null; });
  ready.forEach(function (k, i) {
    if (res[i].getResponseCode() === 200) { try { out[k] = JSON.parse(res[i].getContentText()); } catch (e) {} }
  });
  return out;
}

// The search fields on Escrow Lookup, in order (Brett, 2026-10-19: one field per column,
// each filtering as you type, so "Smith" can be narrowed to the agent, seller, or street).
var INTAKE_FIND_FIELDS = ['Escrow #', 'Property Address', 'Seller/Borrower', 'Directing Customer', 'Listing Agent or Loan Officer', 'Buyer Agent'];

// Every file on the sheets the search reads, as compact rows for the page:
// [0 team key, 1 row id, 2 Escrow #, 3 Property Address, 4 Seller/Borrower, 5 Directing Customer,
//  6 Listing Agent or Loan Officer, 7 Buyer Agent, 8 File Status, 9 COE date, 10 closed 1/0, 11 Open Date,
//  12 [the INTAKE_GRID_X columns, in the form the file page compares; 0 for a closed or
//  canceled file whose COE is over INTAKE_GRID_DAYS old], 13 state].
// The grid reads columns 2 to 11 for the fields they already carry, so nothing is sent
// twice; old closed files skip the rest to keep the page light (10,903 files on
// 2026-11-03: every column for every file was 3.9 MB against Lookup's 1.9 MB).
// Cached 6 hours in chunks (a cache value holds 100 KB). portalWarm rebuilds it every
// 10 minutes, and each Hub write patches its own row in place, so a page never waits on a
// cold read (2026-11-03, Joyce's speed ask; was 5 minutes and cleared by every write).
var INTAKE_GRID = INTAKE_EDIT.show;
var INTAKE_GRID_X = ['Type', 'Buyer Agent Phone #', 'Sales Rep', 'Title Company', 'Title Rep', 'Projected COE', 'Actual COE', 'Escrow Fees', 'Wholesale?'];
var INTAKE_GRID_DAYS = 365;
var INTAKE_IDX_TTL = 21600;
var intakeGridCut = '';   // set on first use in each run

function intakeIdxRow(k, rowId, v, section) {
  var no = normName(v['escrow #']);
  if (!no) return null;
  var actual = validDate(v['actual coe']), state = intakeFileState(v, section);
  var coe = actual || validDate(v['projected coe']), g = 0;
  var cut = intakeGridCut || (intakeGridCut = Utilities.formatDate(new Date(Date.now() - INTAKE_GRID_DAYS * 86400000), Session.getScriptTimeZone() || 'America/Los_Angeles', 'yyyy-MM-dd'));
  if ((state !== 'closed' && state !== 'canceled') || !coe || coe >= cut) {
    g = INTAKE_GRID_X.map(function (t) {
      var kind = INTAKE_EDIT.kinds[t] || 'text', raw = v[t.toLowerCase()];
      return kind === 'date' ? (validDate(raw) || '') : intakeCmp(kind, raw == null ? '' : raw);
    });
  }
  return [k, String(rowId), no, normName(v['property address']), normName(v['seller/borrower']),
    normName(v['directing customer']), normName(v['listing agent or loan officer']), normName(v['buyer agent']),
    normName(v['file status']), coe, actual ? 1 : 0, validDate(v['open date']), g, state];
}

// Pick lists the grid's editors offer, from one sheet's columns (the five share them).
function intakeGridOpts(cols) {
  var col = intakeColumns(cols), out = {};
  ['Type', 'Sales Rep', 'Title Company'].forEach(function (t) { var c = col(t); out[t] = (c && c.options) || []; });
  var s = col('File Status');
  out['File Status'] = ((s && s.options) || []).filter(function (o) { return INTAKE.closedStatuses.indexOf(String(o).trim().toLowerCase()) < 0; });
  return out;
}

function intakeIndexBuild(scratch) {
  var grids = intakeSearchGrids(!!scratch, INTAKE_GRID), rows = [], missed = [], opts = null;
  Object.keys(grids).forEach(function (k) {
    var g = grids[k];
    if (!g) { missed.push(TEAMS[k].label); return; }
    var titles = intakeTitles(g.columns), sec = {};
    if (!opts) opts = intakeGridOpts(g.columns);
    (g.rows || []).forEach(function (r) {
      var v = intakeRowVals(r, titles).v;
      if (!normName(v['escrow #'])) { sec[r.id] = normName(v['property address']); return; }  // section and marker rows
      var x = intakeIdxRow(k, r.id, v, r.parentId ? (sec[r.parentId] || '') : '');
      if (x) rows.push(x);
    });
  });
  rows.sort(function (a, b) { return a[11] < b[11] ? 1 : a[11] > b[11] ? -1 : 0; });  // newest opens first
  return { rows: rows, missed: missed, opts: opts || {} };
}

function intakeIdxKey(scratch) { return 'intakeIdx2' + (scratch ? 'S' : ''); }

// The cached index as its JSON text, or null.
function intakeIdxRaw(scratch) {
  try {
    var cache = CacheService.getScriptCache(), ck = intakeIdxKey(scratch), meta = cache.get(ck);
    if (!meta) return null;
    var p = meta.split(':'), n = Number(p[1]), keys = [];
    for (var i = 0; i < n; i++) keys.push(ck + '_' + p[0] + '_' + i);
    var parts = cache.getAll(keys), joined = '';
    if (!keys.every(function (x) { return parts[x] != null; })) return null;
    keys.forEach(function (x) { joined += parts[x]; });
    return joined;
  } catch (e) { return null; }
}

function intakeIdxGet(scratch) {
  try { var raw = intakeIdxRaw(scratch); return raw ? JSON.parse(raw) : null; } catch (e) { return null; }
}

// Chunks carry a stamp in their keys, so a reader never mixes two versions.
function intakeIdxPut(scratch, data) {
  try {
    var cache = CacheService.getScriptCache(), ck = intakeIdxKey(scratch), stamp = String(Date.now());
    var s = JSON.stringify(data), put = {}, size = 90000, c = 0;
    for (var j = 0; j < s.length; j += size) put[ck + '_' + stamp + '_' + (c++)] = s.substring(j, j + size);
    cache.putAll(put, INTAKE_IDX_TTL);
    cache.put(ck, stamp + ':' + c, INTAKE_IDX_TTL);
  } catch (e) { console.error('Index cache write failed: ' + e); }
}

// Server side (New Escrow's prefill): the index as an object.
function intakeFileIndex(scratch) {
  try {
    var hit = intakeIdxGet(!!scratch);
    if (!hit) {
      hit = intakeIndexBuild(!!scratch);
      if (!hit.missed.length) intakeIdxPut(!!scratch, hit);
    }
    return { ok: true, rows: hit.rows, missed: hit.missed, opts: hit.opts || {} };
  } catch (e) {
    return { ok: false, msg: esc(e.message || String(e)) };
  }
}

// Escrow Lookup's call: the cached index goes to the page as its JSON text, which the
// page parses, because returning 10,000+ rows as an object costs Apps Script about a
// second to convert (2026-11-03). { ok, json, edit } or { ok: false, msg }.
function intakeFileIndexJson(scratch) {
  try {
    var u = intakeUser();
    var edit = Object.keys(TEAMS).filter(function (k) { return intakeCanOpen(u, k); });
    var raw = intakeIdxRaw(!!scratch);
    if (!raw) {
      var built = intakeIndexBuild(!!scratch);
      if (!built.missed.length) intakeIdxPut(!!scratch, built);
      raw = JSON.stringify(built);
    }
    return { ok: true, json: raw, edit: edit };
  } catch (e) {
    return { ok: false, msg: esc(e.message || String(e)) };
  }
}

// Called by portalWarm every 10 minutes: a fresh read of every sheet replaces the cached
// index, which also picks up any change made outside the Hub. Skipped when a Hub write
// patched the index while this read was running, so a patch is never lost.
function intakeIndexWarm() {
  var t0 = Date.now(), data = intakeIndexBuild(false);
  if (data.missed.length) return;
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) return;
  try {
    if (Number(CacheService.getScriptCache().get('intakeIdxPatched') || 0) > t0) return;
    intakeIdxPut(false, data);
  } finally { try { lock.releaseLock(); } catch (e) {} }
}

// After a Hub write (inside its lock): re-read the one row and swap it into the cached
// index (gone: drop it). Returns the fresh index row, or null. On any failure the cache
// is cleared, so the next page load reads the sheets.
function intakeIndexPatch(key, rowId, scratch, gone) {
  try {
    var row = null, id = String(rowId);
    if (!gone) { var f = intakeFileRow(key, id, scratch); row = intakeIdxRow(key, id, f.v, f.section); }
    var data = intakeIdxGet(!!scratch);
    if (data) {
      var at = -1;
      for (var i = 0; i < data.rows.length; i++) { if (data.rows[i][0] === key && data.rows[i][1] === id) { at = i; break; } }
      if (at >= 0) { if (row) data.rows[at] = row; else data.rows.splice(at, 1); }
      else if (row) data.rows.unshift(row);
      intakeIdxPut(!!scratch, data);
    }
    if (!scratch) CacheService.getScriptCache().put('intakeIdxPatched', String(Date.now()), INTAKE_IDX_TTL);
    return row;
  } catch (e) {
    intakeIndexClear();
    return null;
  }
}

// Read-only timing check, run from the editor: the old and new duplicate-check reads,
// a cold index build, and a cached index read, in milliseconds (2026-11-03).
function intakeSpeedCheck() {
  var t = Date.now(), out = {};
  portalFetchGrids(); out.oldDupRead = Date.now() - t; t = Date.now();
  intakeSearchGrids(false, ['Escrow #', 'File Status', 'Actual COE', 'Property Address']); out.newDupRead = Date.now() - t; t = Date.now();
  var b = intakeIndexBuild(false); out.coldIndex = Date.now() - t; out.files = b.rows.length; out.kb = Math.round(JSON.stringify(b).length / 1024); t = Date.now();
  intakeIdxGet(false); out.cachedIndex = Date.now() - t;
  Logger.log(JSON.stringify(out));
  return out;
}

function intakeIndexClear() {
  try { CacheService.getScriptCache().removeAll(['intakeIdx', 'intakeIdxS', intakeIdxKey(false), intakeIdxKey(true)]); } catch (e) {}
}

// One row, fresh, with its columns and the label of the section it sits under.
function intakeFileRow(key, rowId, scratch) {
  var sheetId = intakeSheetId(key, scratch);
  var row = intakeApi('get', '/sheets/' + sheetId + '/rows/' + rowId + '?include=columns');
  var titles = intakeTitles(row.columns), x = intakeRowVals(row, titles), section = '';
  if (row.parentId) {
    try {
      var p = intakeApi('get', '/sheets/' + sheetId + '/rows/' + row.parentId + '?include=columns');
      section = normName(intakeRowVals(p, intakeTitles(p.columns)).v['property address']);
    } catch (e) {}
  }
  return { sheetId: sheetId, row: row, col: intakeColumns(row.columns), v: x.v, d: x.d, section: section };
}

// open | closed | canceled | preopen, from the row's own values and the section it sits
// under (a file under PRE-OPENS stays a pre-open until "Open it").
function intakeFileState(v, section) {
  if (normName(v['file status']).toLowerCase() === 'canceled') return 'canceled';
  if (validDate(v['actual coe'])) return 'closed';
  if (normName(section).toUpperCase() === INTAKE_EDIT.preopen) return 'preopen';
  return 'open';
}

// Where the file belongs: CANCELED, PRE-OPENS, or "MONTH YYYY" of Actual COE (else Projected COE).
function intakeSectionFor(v, section) {
  var st = intakeFileState(v, section);
  if (st === 'canceled') return INTAKE_EDIT.canceled;
  if (st === 'preopen') return INTAKE_EDIT.preopen;
  var d = validDate(v['actual coe']) || validDate(v['projected coe']);
  return d ? INTAKE_MONTHS[Number(d.substring(5, 7)) - 1] + ' ' + d.substring(0, 4) : '';
}

function intakeNiceSection(s) {
  return s === INTAKE_EDIT.canceled ? 'Canceled' : s === INTAKE_EDIT.preopen ? 'Pre-opens' : s.charAt(0) + s.slice(1).toLowerCase();
}

/* ---------- page ---------- */

function intakeFilePage(selfUrl, params) {
  var scratch = String(params && params.scratch || '') === '1';
  var key = String(params && params.t || '').toLowerCase(), rowId = String(params && params.r || '').replace(/[^0-9]/g, '');
  var base = esc(selfUrl) + '?page=file' + (scratch ? '&scratch=1' : '');
  var testBanner = scratch ? '<p class="imsg bad">TEST MODE: this reads and writes the scratch copies, not the team sheets.</p>' : '';
  if (!rowId || !TEAMS[key]) return intakeCss() + intakeFileSearchHtml(selfUrl, scratch, testBanner);

  var u = intakeUser(), f;
  try { f = intakeFileRow(key, rowId, scratch); }
  catch (e) {
    return intakeCss() + '<div class="pcard"><h2 class="ph2">Escrow Lookup</h2>' + testBanner + '<p class="pnote">Could not open that file: ' + esc(e.message) +
      '</p><a class="pbtn" href="' + base + '" target="_top">Escrow Lookup</a></div>';
  }
  var canEdit = intakeCanOpen(u, key), state = intakeFileState(f.v, f.section);
  var no = normName(f.v['escrow #']) || '(no Escrow #)';
  // Fields this file's state lets the person change. A pre-open's dates, status, and fees
  // are set together by "Open it".
  var editable = !canEdit ? [] : INTAKE_EDIT.always.concat(state === 'closed' ? ['Open Date', 'Projected COE', 'Escrow Fees', 'Actual COE', 'File Status']
               : state === 'preopen' ? []
               : ['Open Date', 'Projected COE', 'Escrow Fees', 'File Status']);
  var statusCol = f.col('File Status'), openStatuses = ((statusCol && statusCol.options) || []).filter(function (o) {
    return INTAKE.closedStatuses.indexOf(String(o).trim().toLowerCase()) < 0;
  });
  var lists = { client: [], agent: [] };
  if (canEdit) { try { lists.client = intakeList('client'); lists.agent = intakeList('agent'); } catch (e) {} }
  var before = {};
  var cells = INTAKE_EDIT.show.map(function (title) {
    var c = f.col(title);
    if (!c) return '';
    var t = title.toLowerCase(), raw = f.v[t], kind = INTAKE_EDIT.kinds[title] || 'text';
    var id = 'e' + c.id, lab = '<label class="ilab" for="' + id + '">' + esc(title) + '</label>';
    if (editable.indexOf(title) < 0) {
      var shown = /^\d{4}-\d{2}-\d{2}/.test(String(raw)) && validDate(raw) ? fullDate(validDate(raw)) : title === 'Escrow Fees' && raw !== '' ? money(num(raw))
                : title === 'Wholesale?' ? (raw === true ? 'Yes' : 'No') : normName(f.d[t]);
      // A pre-open's blank dates, status, and fees are set by "Open it", so say so instead of "blank".
      var empty = canEdit && state === 'preopen' && ['Open Date', 'Projected COE', 'File Status', 'Escrow Fees'].indexOf(title) >= 0 ? 'Set it in Open it below' : 'blank';
      return '<div class="ifield"><span class="ilab">' + esc(title) + '</span><div class="iro">' + (shown ? esc(shown) : '<span class="imut">' + empty + '</span>') + '</div></div>';
    }
    var cur = kind === 'date' ? validDate(raw) : kind === 'money' ? (raw === '' ? '' : String(num(raw))) : kind === 'check' ? intakeCmp(kind, raw) : normName(raw);
    before[title] = cur;
    var attrs = ' id="' + id + '" data-ed="' + esc(title) + '" data-kind="' + kind + '"';
    var el;
    if (kind === 'pick') {
      // An old value no longer on the list shows as it is and stays unless changed.
      var opts = c.options || [];
      el = '<select class="iin"' + attrs + '>' + (opts.indexOf(cur) >= 0 ? '' : '<option value="' + esc(cur) + '" selected>' + esc(cur || 'Choose...') + '</option>') +
        opts.map(function (o) { return '<option' + (o === cur ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
    } else if (kind === 'check') {
      el = '<select class="iin"' + attrs + '>' + ['No', 'Yes'].map(function (o) { return '<option' + (o === cur ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select>';
    } else if (kind === 'client' || kind === 'agent') {
      el = '<div class="ita"><input class="iin" data-ta="' + kind + '" autocomplete="off"' + attrs + ' value="' + esc(cur) + '"><div class="isug"></div></div>' +
        (kind === 'agent' ? '<div class="ihint">Co-listing: Agent A / Agent B.</div>' : '') + '<div class="inew" data-kind="' + kind + '"></div>';
    } else if (kind === 'status') {
      var listed = openStatuses.indexOf(cur) >= 0;
      el = '<select class="iin"' + attrs + '>' + (listed ? '' : '<option value="' + esc(cur) + '" selected>' + esc(cur || 'blank') + (state === 'canceled' || state === 'closed' ? ' (pick a status to reopen)' : '') + '</option>') +
        openStatuses.map(function (o) { return '<option' + (o === cur ? ' selected' : '') + '>' + esc(o) + '</option>'; }).join('') + '</select>';
    } else if (kind === 'date') {
      el = '<input class="iin" type="date"' + attrs + ' value="' + esc(cur) + '">';
    } else if (kind === 'money') {
      el = '<input class="iin" inputmode="decimal"' + attrs + ' value="' + esc(cur) + '">';
    } else {
      el = '<input class="iin" autocomplete="off"' + attrs + ' value="' + esc(cur) + '">';
    }
    return '<div class="ifield">' + lab + el + '</div>';
  }).join('');

  var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
  var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var where = f.section ? 'Under ' + esc(intakeNiceSection(f.section)) + ' on the ' + esc(TEAMS[key].label) + (scratch ? ' scratch copy' : ' sheet') + '.' : 'On the ' + esc(TEAMS[key].label) + ' sheet.';
  var note = !canEdit ? 'The Hub could not read your sign-in, so you can look at this file but not change it. Sign in with your Five Star Google account and reload.'
           : state === 'closed' ? 'This file closed on ' + esc(fullDate(validDate(f.v['actual coe']))) + '. To reopen it, pick a File Status and check Projected COE; Actual COE is cleared and it moves back under that month.'
           : state === 'canceled' ? 'This file is canceled. To reopen it, pick a File Status and check Projected COE; it moves back under that month.'
           : state === 'preopen' ? 'This is a pre-open: no offer yet, so it does not count as an opening. When it opens, use Open it below; it moves under its Projected COE month.'
           : 'Change what you need, then Save changes. A new Projected COE month moves the file to that month.';
  if (canEdit) note += ' To correct the Escrow #, ask Elizabeth Eidbo.';
  var acts = !canEdit ? '' :
    '<div class="iact"><button id="esave" class="pbtn big" type="button">Save changes</button></div>' +
    (state === 'preopen' ?
      '<div class="iacts">' +
        '<div class="iactbox"><b>Open it</b>' +
          '<div class="iactrow"><label class="ilab" for="oopen">Open Date</label><input id="oopen" class="iin" type="date" value="' + today + '" max="' + today + '"></div>' +
          '<div class="iactrow"><label class="ilab" for="ocoe">Projected COE</label><input id="ocoe" class="iin" type="date"></div>' +
          '<div class="iactrow"><label class="ilab" for="ostat">File Status</label><select id="ostat" class="iin"><option value="">Choose...</option>' +
            openStatuses.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select></div>' +
          '<div class="iactrow"><label class="ilab" for="ofee">Escrow Fees</label><input id="ofee" class="iin" inputmode="decimal" placeholder="1,250"></div>' +
          '<button id="eopen" class="pbtn" type="button">Open it</button></div>' +
        '<div class="iactbox"><b>Remove the pre-open</b><p class="ihint">Deletes the row from the sheet. Use it when the file is not going to open.</p>' +
          '<button id="eremove" class="pbtn ghost" type="button">Remove it</button></div>' +
      '</div>' : '') +
    (state === 'open' ?
      '<div class="iacts">' +
        '<div class="iactbox"><b>Close the file</b><div class="iactrow"><label class="ilab" for="ecoe">Actual COE</label>' +
          '<input id="ecoe" class="iin" type="date" value="' + today + '" max="' + today + '"></div>' +
          '<button id="eclose" class="pbtn" type="button">Close the file</button></div>' +
        '<div class="iactbox"><b>Cancel the file</b><p class="ihint">Sets File Status to Canceled and moves the file under Canceled.</p>' +
          '<button id="ecancel" class="pbtn ghost" type="button">Cancel the file</button></div>' +
      '</div>' : '');

  var fileUrl = base + '&t=' + esc(key) + '&r=' + esc(rowId);
  return intakeCss() +
    '<div class="pcard"><div class="ihead"><h2 class="ph2">' + esc(no) + ' · ' + esc(normName(f.v['property address'])) + '</h2>' +
      '<a class="pbtn ghost" href="' + base + '" target="_top">Escrow Lookup</a></div>' + testBanner +
    '<p class="pnote">' + where + ' ' + note + '</p>' +
    '<div id="ebody"><form class="igrid" onsubmit="return false">' + cells + '</form>' + acts + '</div>' +
    '<div id="imsg"></div></div>' +
    (canEdit ? '<script>' +
      'var BEFORE=' + JSON.stringify(before).replace(/</g, '\\u003c') + ',KEY=' + JSON.stringify(key) + ',RID=' + JSON.stringify(rowId) +
      ',SCR=' + (scratch ? 'true' : 'false') + ',FURL=' + JSON.stringify(fileUrl).replace(/</g, '\\u003c') + ',FIND=' + JSON.stringify(base).replace(/</g, '\\u003c') + ';' +
      'var TA=' + JSON.stringify(lists).replace(/</g, '\\u003c') + ';' + INTAKE_TA_JS + INTAKE_NEW_JS + INTAKE_EDIT_JS + '</script>' : '');
}

function intakeFileSearchHtml(selfUrl, scratch, testBanner) {
  var base = esc(selfUrl) + '?page=file' + (scratch ? '&scratch=1' : '');
  var labels = {};
  Object.keys(TEAMS).forEach(function (k) { labels[k] = TEAMS[k].label; });
  var inputs = INTAKE_FIND_FIELDS.map(function (title, i) {
    return '<div class="ifield"><label class="ilab" for="fi' + i + '">' + esc(title) + '</label>' +
      '<div class="ita"><input class="iin" id="fi' + i + '" data-fi="' + i + '" autocomplete="off" disabled placeholder="Start typing"><div class="isug"></div></div></div>';
  }).join('');
  var u = intakeUser(), names = { client: [], agent: [] };
  try { names.client = intakeList('client'); names.agent = intakeList('agent'); } catch (e) {}
  var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
  var cfg = { cols: INTAKE_GRID, x: INTAKE_GRID_X, kinds: INTAKE_EDIT.kinds, always: INTAKE_EDIT.always, me: u.team || '',
              today: Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd'), names: names };
  return intakeGridCss() + '<div class="pcard"><div class="ihead"><h2 class="ph2">Escrow Lookup</h2><button id="fclear" class="pbtn ghost" type="button">Clear</button></div>' + testBanner +
    '<p class="pnote">Type in any field to search; the Team and status boxes below narrow it too. Below, click a column heading to sort, filter under each heading, and click a cell to change it (Enter saves, Esc cancels). Open a file by its Escrow # to close or cancel it.</p>' +
    '<form class="igrid" onsubmit="return false">' + inputs + '</form>' +
    '<div id="imsg"></div><div id="gbar"></div><div id="gmsg"></div><div id="gwrap"></div></div>' +
    '<script>var SCR=' + (scratch ? 'true' : 'false') + ',BASE=' + JSON.stringify(base).replace(/</g, '\\u003c') +
    ',TL=' + JSON.stringify(labels).replace(/</g, '\\u003c') + ',GRIDCFG=' + JSON.stringify(cfg).replace(/</g, '\\u003c') + ';' +
    '(' + intakeGridClient.toString() + ')();' + INTAKE_FIND_JS + '</script>';
}

function intakeGridCss() {
  return '<style>' +
    '.gtools{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;margin:18px 0 8px;font-size:13px}' +
    '.gtools label{display:flex;gap:6px;align-items:center;font-weight:600;color:var(--navy)}' +
    '.gtools select{font:inherit;padding:5px 8px;border:1px solid var(--line);border-radius:7px;background:#fff}' +
    '.gtools input{accent-color:var(--navy);margin:0}' +
    '.gtools input[type=date]{font:inherit;padding:4px 6px;border:1px solid var(--line);border-radius:7px;background:#fff}' +
    '#gbar .gtools+.gtools{margin-top:0}' +
    '.gq{display:flex;gap:6px;align-items:center;font-weight:600;color:var(--navy)}' +
    '.gq button.on{background:var(--navy);color:#fff}' +
    '#gcount{font-size:13px;color:var(--mut);margin:0 0 8px}' +
    '.gscroll{overflow:auto;max-height:72vh;border:1px solid var(--line);border-radius:10px}' +
    '.gt{border-collapse:separate;border-spacing:0;font-size:13px;width:max-content;min-width:100%}' +
    '.gt th{position:sticky;top:0;z-index:2;background:#f4f6fb;border-bottom:1px solid var(--line);padding:6px 8px;text-align:left;vertical-align:top}' +
    '.gh{font-weight:700;color:var(--navy);cursor:pointer;white-space:nowrap;margin-bottom:5px;user-select:none}' +
    '.gf{font:inherit;font-size:12px;padding:4px 6px;border:1px solid var(--line);border-radius:6px;width:100%;min-width:90px;box-sizing:border-box;background:#fff}' +
    '.gt td{padding:6px 8px;border-bottom:1px solid #eef0f5;white-space:nowrap;max-width:260px;overflow:hidden;text-overflow:ellipsis}' +
    '.gt tr:hover td{background:#f8faff}' +
    '.gt td.ged{cursor:cell}.gt td.ged:hover{box-shadow:inset 0 0 0 1px #c7d2fe}' +
    '.gt td.gok{background:#ecfdf5}' +
    '.gt td.gnum{text-align:right}' +
    '.gin{font:inherit;font-size:13px;width:100%;min-width:150px;padding:3px 5px;border:1px solid var(--navy);border-radius:5px;box-sizing:border-box}' +
    '.gwait{color:var(--mut);font-style:italic}' +
    '.gno a{color:var(--navy);font-weight:700}' +
    'tr.gs-closed td,tr.gs-canceled td{color:#6b7280}' +
    '#gmsg{position:sticky;top:0;z-index:5}' +
    '</style>';
}

// Escrow Lookup's grid (2026-11-03, Joyce Priebe with Brett): every file in a sheet-style
// table, the same for every team. Opens on the person's team, open files, by Projected
// COE; a team switch and Open / Pre-opens / Closed / Canceled boxes set the scope, and
// typing in the search fields above searches every team and status. Click a heading to
// sort (again to reverse, a third time to clear), filter under each heading (dates by
// range: Today, This week, and so on), and click a cell to change it. A cell edit saves
// through intakeSaveFile, so it runs every check the file page runs and is logged the
// same way; the fields a cell may change follow the file page's rules for the file's
// state. Sort, filters, team, and scope are kept per person in that browser.
// Never called on the server: its source is sent to the page as-is, so it is plain
// browser JavaScript (no server globals) and must not contain a closing script tag.
function intakeGridClient() {
  var C = GRIDCFG, OPTS = {}, byId = {}, ix = {}, LS = 'hubGrid1', MAX = 500;
  // Fields the index row already carries (positions 2 to 11); the rest sit in r[12].
  var BASE = { 'Escrow #': 2, 'Property Address': 3, 'Seller/Borrower': 4, 'Directing Customer': 5,
               'Listing Agent or Loan Officer': 6, 'Buyer Agent': 7, 'File Status': 8, 'Open Date': 11 };
  C.x.forEach(function (t, i) { ix[t] = i; });
  var DISP = ['Escrow #', 'Team'].concat(C.cols.filter(function (t) { return t !== 'Escrow #'; }));
  function fresh() { return { team: C.me || '', show: { open: 1 }, sort: { c: 'Projected COE', d: 1 }, f: {} }; }
  var st = fresh();
  try { var sv = JSON.parse(localStorage.getItem(LS) || 'null'); if (sv && sv.show && sv.sort && sv.f) st = sv; } catch (e) {}
  function keep() { try { localStorage.setItem(LS, JSON.stringify(st)); } catch (e) {} }
  var wrap = document.getElementById('gwrap'), bar = document.getElementById('gbar'), gm = document.getElementById('gmsg');
  function e(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function kind(t) { return t === 'Team' ? 'team' : (C.kinds[t] || 'text'); }
  function val(r, t) {
    if (t === 'Team') return TL[r[0]] || r[0];
    if (BASE[t] != null) return r[BASE[t]] == null ? '' : r[BASE[t]];
    return r[12] ? r[12][ix[t]] : '';
  }
  function setVal(r, t, v) { if (BASE[t] != null) r[BASE[t]] = v; else if (r[12]) r[12][ix[t]] = v; }
  function rid(r) { return r[0] + ':' + r[1]; }

  // Dates are compared as yyyy-mm-dd strings; "today" is the server's date.
  function day(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function plus(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  var T = day(C.today), W = plus(T, -T.getDay());
  var RANGES = {
    today: [C.today, C.today], tomorrow: [iso(plus(T, 1)), iso(plus(T, 1))],
    week: [iso(W), iso(plus(W, 6))], nextweek: [iso(plus(W, 7)), iso(plus(W, 13))],
    month: [iso(new Date(T.getFullYear(), T.getMonth(), 1)), iso(new Date(T.getFullYear(), T.getMonth() + 1, 0))],
    nextmonth: [iso(new Date(T.getFullYear(), T.getMonth() + 1, 1)), iso(new Date(T.getFullYear(), T.getMonth() + 2, 0))],
    past: ['0000-00-00', iso(plus(T, -1))]
  };
  var DLAB = [['', 'Any'], ['today', 'Today'], ['tomorrow', 'Tomorrow'], ['week', 'This week'], ['nextweek', 'Next week'],
              ['month', 'This month'], ['nextmonth', 'Next month'], ['past', 'Before today'], ['blank', 'Blank']];
  var STATES = [['open', 'Open'], ['preopen', 'Pre-opens'], ['closed', 'Closed'], ['canceled', 'Canceled']];
  // A date filter is a preset key or a range "r:from:to" (either end may be blank; Brett,
  // 2026-11-03: a date range for Projected COE). Returns [from, to] or null.
  function rangeOf(q) {
    if (q && String(q).indexOf('r:') === 0) { var p = String(q).split(':'); return [p[1] || '0000-00-00', p[2] || '9999-12-31']; }
    return RANGES[q] || null;
  }
  function rangeLabel(q) {
    var g = rangeOf(q);
    if (!g) return 'Custom range';
    function d(s) { var p = s.split('-'); return +p[1] + '/' + +p[2] + '/' + p[0].slice(2); }
    return g[0] === '0000-00-00' ? 'Through ' + d(g[1]) : g[1] === '9999-12-31' ? 'From ' + d(g[0]) : d(g[0]) + ' to ' + d(g[1]);
  }

  function shown(r, t) {
    var v = val(r, t), k = kind(t);
    if (v === '' || v == null) return '';
    if (k === 'date') { var p = String(v).split('-'); return p[1] + '/' + p[2] + '/' + p[0].slice(2); }
    if (k === 'money') return '$' + Number(v).toLocaleString('en-US', { maximumFractionDigits: 2 });
    return v;
  }
  // The file page's rules: these fields in every state; a pre-open sets its dates,
  // status, and fees through Open it; Actual COE only on a closed file. A closed file
  // over a year old carries only its search fields, so it is changed on its file page.
  function can(r, t) {
    if (!r[12] || !EDIT[r[0]] || t === 'Escrow #' || t === 'Team') return false;
    if (C.always.indexOf(t) >= 0) return true;
    if (r[13] === 'preopen') return false;
    return (r[13] === 'closed' ? ['Open Date', 'Projected COE', 'Escrow Fees', 'Actual COE', 'File Status']
                               : ['Open Date', 'Projected COE', 'Escrow Fees', 'File Status']).indexOf(t) >= 0;
  }
  function listy(k) { return k === 'pick' || k === 'status' || k === 'check'; }
  function pass(r, t, q) {
    var k = kind(t), v = val(r, t);
    if (k === 'date') { if (q === 'blank') return !v; var g = rangeOf(q); return !g || (!!v && v >= g[0] && v <= g[1]); }
    if (listy(k)) return (q === '(blank)' ? '' : q) === v;
    var s = String(q).toLowerCase();
    if (k === 'money') { var n = s.replace(/[$,\s]/g, ''); return String(v).indexOf(n) >= 0; }
    return String(v).toLowerCase().indexOf(s) >= 0;
  }
  function scoped(r) { return (!st.team || r[0] === st.team) && !!st.show[r[13]]; }
  function filtered(r) {
    for (var t in st.f) { if (st.f[t] !== '' && st.f[t] != null && (ix[t] != null || BASE[t] != null) && !pass(r, t, st.f[t])) return false; }
    return true;
  }
  // Blanks sort last either way.
  function cmp(a, b) {
    var t = st.sort.c;
    if (!t) return 0;
    var k = kind(t), x = val(a, t), y = val(b, t);
    if (x === '' && y === '') return 0;
    if (x === '') return 1;
    if (y === '') return -1;
    if (k === 'money') { x = +x; y = +y; } else if (k !== 'date') { x = String(x).toLowerCase(); y = String(y).toLowerCase(); }
    return (x < y ? -1 : x > y ? 1 : 0) * st.sort.d;
  }

  function distinct(t) {
    var seen = {}, out = [];
    ROWS.forEach(function (r) { var v = val(r, t), key = v === '' ? '(blank)' : v; if (!seen[key]) { seen[key] = 1; out.push(key); } });
    return out.sort(function (a, b) { return a.toLowerCase() < b.toLowerCase() ? -1 : 1; });
  }
  function filterCtl(t) {
    var k = kind(t), q = st.f[t] == null ? '' : st.f[t];
    if (k === 'team') return '';
    if (k === 'date') return '<select class="gf" data-f="' + e(t) + '">' + DLAB.map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === q ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
      (String(q).indexOf('r:') === 0 ? '<option value="' + e(q) + '" selected>' + e(rangeLabel(q)) + '</option>' : '') + '</select>';
    if (listy(k)) return '<select class="gf" data-f="' + e(t) + '"><option value="">Any</option>' + distinct(t).map(function (o) {
      return '<option' + (o === q ? ' selected' : '') + '>' + e(o) + '</option>'; }).join('') + '</select>';
    return '<input class="gf" data-f="' + e(t) + '" value="' + e(q) + '" placeholder="Filter" autocomplete="off">';
  }

  function toolbar() {
    var teams = Object.keys(TL).map(function (k) { return '<option value="' + e(k) + '"' + (st.team === k ? ' selected' : '') + '>' + e(TL[k]) + '</option>'; }).join('');
    var q = st.f['Projected COE'] || '', g = q && q !== 'blank' ? rangeOf(q) : null;
    var from = g && g[0] !== '0000-00-00' ? g[0] : '', to = g && g[1] !== '9999-12-31' ? g[1] : '';
    bar.innerHTML = '<div class="gtools"><label>Team <select id="gteam"><option value="">All teams</option>' + teams + '</select></label>' +
      STATES.map(function (s) { return '<label><input type="checkbox" data-st="' + s[0] + '"' + (st.show[s[0]] ? ' checked' : '') + '> ' + s[1] + '</label>'; }).join('') +
      '</div><div class="gtools"><span class="gq">Projected COE ' + [['today', 'Today'], ['week', 'This week'], ['month', 'This month']].map(function (b) {
        return '<button type="button" class="pbtn ghost sm' + (q === b[0] ? ' on' : '') + '" data-q="' + b[0] + '">' + b[1] + '</button>'; }).join('') + '</span>' +
      '<label>From <input type="date" id="gfrom" value="' + e(from) + '"></label>' +
      '<label>To <input type="date" id="gto" value="' + e(to) + '"></label>' +
      '<button type="button" class="pbtn ghost sm" id="gclr">Clear filters</button>' +
      '<button type="button" class="pbtn ghost sm" id="greset">Reset view</button></div><div id="gcount"></div>';
  }
  function head() {
    wrap.innerHTML = '<div class="gscroll"><table class="gt"><thead><tr>' + DISP.map(function (t) {
      var on = st.sort.c === t, arrow = on ? (st.sort.d > 0 ? ' ▲' : ' ▼') : '';
      return '<th><div class="gh" data-s="' + e(t) + '" title="Sort by ' + e(t) + '">' + e(t) + arrow + '</div>' + filterCtl(t) + '</th>';
    }).join('') + '</tr></thead><tbody id="gbody"></tbody></table></div>';
  }
  function cell(r, t) {
    if (t === 'Escrow #') return '<td class="gno"><a href="' + e(furl(r)) + '" target="_top">' + e(val(r, t)) + '</a></td>';
    var cls = (can(r, t) ? 'ged' : '') + (kind(t) === 'money' ? ' gnum' : '');
    return '<td' + (cls ? ' class="' + cls + '"' : '') + (can(r, t) ? ' data-e="' + e(t) + '"' : '') + ' title="' + e(shown(r, t)) + '">' + e(shown(r, t)) + '</td>';
  }
  function rowHtml(r) { return '<tr data-r="' + e(rid(r)) + '" class="gs-' + e(r[13]) + '">' + DISP.map(function (t) { return cell(r, t); }).join('') + '</tr>'; }
  function showAll() {
    // The search fields, Team, the status boxes, and the column filters all apply
    // together (Brett, 2026-11-03). When a search also matches files the Team or status
    // boxes hide, the count says how many, so a closed or other-team file is one tick away.
    var search = fany(), list = [], hidden = 0;
    ROWS.forEach(function (r) {
      if (search && !fmatch(r, -1)) return;
      if (!filtered(r)) return;
      if (scoped(r)) list.push(r); else if (search) hidden++;
    });
    list.sort(cmp);
    var tb = document.getElementById('gbody');
    if (tb) tb.innerHTML = list.slice(0, MAX).map(rowHtml).join('');
    var n = list.length, c = document.getElementById('gcount');
    if (c) c.innerHTML = (n ? n.toLocaleString() + (n === 1 ? ' file' : ' files') + (n > MAX ? ', showing the first ' + MAX + '. Filter to narrow it.' : '.') : 'No file matches.') +
      (hidden ? ' ' + hidden.toLocaleString() + ' more ' + (hidden === 1 ? 'matches' : 'match') + ' on another team or status; change Team or tick Pre-opens, Closed, or Canceled to see ' + (hidden === 1 ? 'it' : 'them') + '.' : '');
    return list;
  }
  function redraw() { keep(); toolbar(); head(); showAll(); }

  function say(m, ok) {
    gm.innerHTML = '<p class="imsg ' + (ok ? 'good' : 'bad') + '">' + m + '</p>';
    if (ok) { var mine = gm.innerHTML; setTimeout(function () { if (gm.innerHTML === mine) gm.innerHTML = ''; }, 6000); }
  }
  function trOf(r) { return wrap.querySelector('tr[data-r="' + rid(r) + '"]'); }
  function repaint(r, t) {
    var tr = trOf(r);
    if (!tr) return;
    tr.outerHTML = rowHtml(r);
    var td = t ? trOf(r).querySelector('td[data-e="' + t + '"]') : null;
    if (td) { td.classList.add('gok'); setTimeout(function () { td.classList.remove('gok'); }, 1500); }
  }
  function same(k, a, b) {
    if (k === 'money') { var x = String(a).replace(/[$,\s]/g, ''); return (x === '' ? '' : String(parseFloat(x))) === String(b); }
    return a === b;
  }
  function unlisted(list, r) {
    return list.map(function (u) {
      return ' <b>' + e(u.name) + '</b> is not on the ' + e(u.noun) + ' list.' +
        (u.similar && u.similar.length ? ' Did you mean ' + u.similar.map(e).join(', ') + '? Click the cell again and pick one.' : '') +
        ' To add it as a new ' + e(u.noun) + ', <a href="' + e(furl(r)) + '" target="_top">open the file</a>.';
    }).join('');
  }
  function send(r, t, nv, cur, td) {
    td.innerHTML = '<span class="gwait">Saving...</span>';
    var ch = {}, bf = {};
    ch[t] = nv; bf[t] = cur;
    google.script.run.withSuccessHandler(function (res) {
      if (res.ok) {
        var nr = res.row;
        if (nr) { var i = ROWS.indexOf(r); if (i >= 0) ROWS[i] = nr; delete byId[rid(r)]; byId[rid(nr)] = nr; }
        else { setVal(r, t, nv); nr = r; }
        var tr = trOf(r);
        if (tr && nr !== r) tr.setAttribute('data-r', rid(nr));
        repaint(nr, t);
        say(res.msg, true);
      } else {
        td.innerHTML = e(shown(r, t));
        say(res.unlisted ? 'Nothing was saved.' + unlisted(res.unlisted, r) : res.msg, false);
      }
    }).withFailureHandler(function (er) {
      td.innerHTML = e(shown(r, t));
      say('Nothing was saved: ' + e(er.message), false);
    }).intakeSaveFile(r[0], r[1], ch, bf, '', SCR, { client: [], agent: [] });
  }
  function edit(td) {
    if (td.querySelector('.gin')) return;
    var r = byId[td.parentNode.getAttribute('data-r')], t = td.getAttribute('data-e');
    if (!r || !t) return;
    var k = kind(t), cur = val(r, t), sel = listy(k), el;
    if (sel) {
      var opts = k === 'check' ? ['No', 'Yes'] : (OPTS[t] || []).slice();
      var extra = opts.indexOf(cur) >= 0 ? '' : '<option value="' + e(cur) + '" selected>' + e(cur || 'Choose...') +
        (k === 'status' && (r[13] === 'closed' || r[13] === 'canceled') ? ' (pick a status to reopen)' : '') + '</option>';
      el = document.createElement('select');
      el.innerHTML = extra + opts.map(function (o) { return '<option' + (o === cur ? ' selected' : '') + '>' + e(o) + '</option>'; }).join('');
    } else {
      el = document.createElement('input');
      el.autocomplete = 'off';
      if (k === 'date') el.type = 'date';
      if (k === 'client' || k === 'agent') el.setAttribute('list', 'gdl-' + k);
      el.value = cur;
    }
    el.className = 'gin';
    td.textContent = '';
    td.appendChild(el);
    el.focus();
    var done = false;
    function finish(go) {
      if (done) return;
      done = true;
      var nv = String(el.value).trim().replace(/\s+/g, ' ');
      if (!go || same(k, nv, cur)) { td.innerHTML = e(shown(r, t)); return; }
      send(r, t, nv, cur, td);
    }
    el.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') { ev.preventDefault(); finish(true); }
      else if (ev.key === 'Escape') { ev.preventDefault(); finish(false); }
    });
    if (sel) el.addEventListener('change', function () { finish(true); });
    el.addEventListener('blur', function () { finish(!sel); });
  }

  var tmr;
  bar.addEventListener('change', function (ev) {
    var x = ev.target;
    if (x.id === 'gfrom' || x.id === 'gto') {
      var f = document.getElementById('gfrom').value, t = document.getElementById('gto').value;
      st.f['Projected COE'] = f || t ? 'r:' + f + ':' + t : '';
      [].forEach.call(bar.querySelectorAll('[data-q]'), function (b) { b.classList.remove('on'); });
      keep(); head(); showAll();
      return;
    }
    if (x.id === 'gteam') { st.team = x.value; }
    else if (x.getAttribute('data-st')) { if (x.checked) st.show[x.getAttribute('data-st')] = 1; else delete st.show[x.getAttribute('data-st')]; }
    else return;
    keep(); showAll();
  });
  bar.addEventListener('click', function (ev) {
    var b = ev.target.closest('button');
    if (!b) return;
    if (b.id === 'gclr') { st.f = {}; redraw(); }
    else if (b.id === 'greset') { st = fresh(); redraw(); }
    else if (b.getAttribute('data-q')) { var q = b.getAttribute('data-q'); st.f['Projected COE'] = st.f['Projected COE'] === q ? '' : q; redraw(); }
  });
  wrap.addEventListener('click', function (ev) {
    var h = ev.target.closest('.gh');
    if (h) {
      var t = h.getAttribute('data-s');
      if (st.sort.c !== t) st.sort = { c: t, d: 1 };
      else if (st.sort.d > 0) st.sort.d = -1;
      else st.sort = { c: '', d: 1 };
      keep(); head(); showAll();
      return;
    }
    var td = ev.target.closest('td[data-e]');
    if (td && !ev.target.closest('a')) edit(td);
  });
  function onFilter(ev) {
    var x = ev.target;
    if (!x.classList || !x.classList.contains('gf')) return;
    st.f[x.getAttribute('data-f')] = x.value;
    keep();
    if (x.getAttribute('data-f') === 'Projected COE') toolbar();
    clearTimeout(tmr);
    tmr = setTimeout(showAll, x.tagName === 'SELECT' ? 0 : 150);
  }
  wrap.addEventListener('input', onFilter);
  wrap.addEventListener('change', function (ev) { if (ev.target.tagName === 'SELECT' && ev.target.classList.contains('gf')) onFilter(ev); });

  window.GRID = {
    init: function (res) {
      OPTS = res.opts || {};
      byId = {};
      ROWS.forEach(function (r) { byId[rid(r)] = r; });
      ['client', 'agent'].forEach(function (k) {
        var dl = document.createElement('datalist');
        dl.id = 'gdl-' + k;
        dl.innerHTML = (C.names[k] || []).map(function (n) { return '<option value="' + e(n) + '">'; }).join('');
        document.body.appendChild(dl);
      });
      toolbar(); head();
    },
    show: showAll,
    // The search fields' suggestions count only files the view would show.
    inScope: function (r) { return scoped(r) && filtered(r); }
  };
}

// Search page: loads the file index once (intakeFileIndexJson), then every field filters as
// the person types. Each field's dropdown lists the distinct values that match it and
// every other filled field, with a file count; picking one narrows the list to exactly
// that value, and opens the file when only one is left. The list shows the 30 newest
// matches. Agent co-listings ("A / B") are matched one name at a time.
var INTAKE_FIND_JS =
  'var COLS=[2,3,4,5,6,7],ROWS=[],EDIT={},F=[],INS=[].slice.call(document.querySelectorAll("[data-fi]"));' +
  'var fm=document.getElementById("imsg"),fr=document.getElementById("fres");' +
  'function fe(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");}' +
  'function fk(s){return String(s).toLowerCase().replace(/&/g," and ").replace(/[^a-z0-9]+/g,"");}' +
  'function fd(s){if(!s)return "";var p=s.split("-");return ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+p[1]-1]+" "+(+p[2])+", "+p[0];}' +
  'function fparts(c,v){v=String(v||"");return c===6?v.split(/\\s+\\/\\s+/):[v];}' +
  'function fset(j){var v=INS[j].value.trim();F[j]={q:v,ql:v.toLowerCase(),k:fk(v),exact:F[j]&&F[j].exact&&F[j].q===v};}' +
  'function fhit(j,row){var f=F[j];if(!f||!f.q)return true;var c=COLS[j],v=row[c];' +
  '  if(f.exact)return fparts(c,v).some(function(p){return p.toLowerCase()===f.ql;});' +
  '  var s=String(v).toLowerCase();return s.indexOf(f.ql)>=0||(f.k.length>=2&&fk(v).indexOf(f.k)>=0);}' +
  'function fmatch(row,skip){for(var j=0;j<COLS.length;j++){if(j!==skip&&!fhit(j,row))return false;}return true;}' +
  'function furl(row){return BASE+"&t="+encodeURIComponent(row[0])+"&r="+row[1];}' +
  'function fopen(row){var a=document.createElement("a");a.href=furl(row);a.target="_top";document.body.appendChild(a);a.click();}' +
  'function fany(){return F.some(function(f){return f&&f.q;});}' +
  'function flist(){return GRID.show();}' +
  'INS.forEach(function(inp,j){' +
  '  F[j]={q:"",ql:"",k:"",exact:false};' +
  '  var box=inp.parentNode.querySelector(".isug"),c=COLS[j],hi=-1,items=[];' +
  '  function close(){box.style.display="none";hi=-1;}' +
  '  function pick(it){inp.value=it.v;F[j]={q:it.v,ql:it.v.toLowerCase(),k:fk(it.v),exact:true};close();var hits=flist();if(hits.length===1)fopen(hits[0]);}' +
  '  function render(){var f=F[j];if(!f.q){close();return;}' +
  '    var seen={},list=[];' +
  '    ROWS.forEach(function(r){if(!fmatch(r,j)||!GRID.inScope(r))return;fparts(c,r[c]).forEach(function(p){if(!p)return;var pl=p.toLowerCase();' +
  '      if(!(pl.indexOf(f.ql)>=0||(f.k.length>=2&&fk(p).indexOf(f.k)>=0)))return;' +
  '      if(!seen[pl]){seen[pl]={v:p,n:0,row:r,at:pl.indexOf(f.ql)};list.push(seen[pl]);}seen[pl].n++;});});' +
  '    list.sort(function(a,b){var x=a.at<0?99:a.at,y=b.at<0?99:b.at;return (x-y)||(b.n-a.n)||(a.v.toLowerCase()<b.v.toLowerCase()?-1:1);});' +
  '    items=list.slice(0,8);' +
  '    if(!items.length){box.innerHTML="<div class=\\"isn\\">No match"+(fany()?" with the other fields you filled in":"")+".</div>";box.style.display="block";return;}' +
  '    box.innerHTML=items.map(function(it,i){var sub=it.n>1?it.n+" files":fe(it.row[2])+" · "+fe(it.row[3])+" · "+fe(TL[it.row[0]]);' +
  '      return "<div class=\\"isi"+(i===hi?" on":"")+"\\" data-i=\\""+i+"\\">"+fe(it.v)+"<span class=\\"isub\\">"+sub+"</span></div>";}).join("");' +
  '    box.style.display="block";}' +
  '  var tmr;' +
  '  inp.addEventListener("input",function(){fset(j);hi=-1;render();clearTimeout(tmr);tmr=setTimeout(flist,150);});' +
  '  inp.addEventListener("focus",function(){if(F[j].q&&!F[j].exact)render();});' +
  '  inp.addEventListener("keydown",function(e){if(e.key==="Escape"){close();return;}if(box.style.display!=="block"||!items.length)return;' +
  '    if(e.key==="ArrowDown"){hi=Math.min(hi+1,items.length-1);render();e.preventDefault();}' +
  '    else if(e.key==="ArrowUp"){hi=Math.max(hi-1,0);render();e.preventDefault();}' +
  '    else if(e.key==="Enter"&&hi>=0){pick(items[hi]);e.preventDefault();}});' +
  '  box.addEventListener("mousedown",function(e){var t=e.target.closest(".isi");if(t){pick(items[+t.getAttribute("data-i")]);e.preventDefault();}});' +
  '  inp.addEventListener("blur",function(){setTimeout(close,150);});' +
  '});' +
  'document.getElementById("fclear").addEventListener("click",function(){INS.forEach(function(inp,j){inp.value="";F[j]={q:"",ql:"",k:"",exact:false};});flist();INS[0].focus();});' +
  'fm.innerHTML="<p class=\\"pnote\\">Loading every team\'s files...</p>";' +
  'google.script.run.withSuccessHandler(function(r){' +
  '  if(!r.ok){fm.innerHTML="<p class=\\"imsg bad\\">"+r.msg+"</p>";return;}' +
  '  if(r.json){var d=JSON.parse(r.json);r.rows=d.rows;r.missed=d.missed;r.opts=d.opts;}' +
  '  ROWS=r.rows;(r.edit||[]).forEach(function(k){EDIT[k]=1;});' +
  '  GRID.init(r);fm.innerHTML="";' +
  '  INS.forEach(function(inp){inp.disabled=false;});' +
  '  flist();' +
  '  if(r.missed&&r.missed.length)fm.insertAdjacentHTML("beforeend","<p class=\\"imsg bad\\">Could not read "+fe(r.missed.join(", "))+" just now, so those files are missing. Reload in a minute.</p>");' +
  '  INS[0].focus();})' +
  '.withFailureHandler(function(e){fm.innerHTML="<p class=\\"imsg bad\\">Could not load the files: "+fe(e.message)+". Reload the page.</p>";})' +
  '.intakeFileIndexJson(SCR);';

// File page: sends only the fields that changed (plus BEFORE, for the stale check).
// Close and Cancel carry any other edits on the page with them. Cancel asks twice.
var INTAKE_EDIT_JS =
  'function en(k,v){v=String(v==null?"":v).trim().replace(/\\s+/g," ");if(k==="money"){v=v.replace(/[$,]/g,"");return v===""?"":String(parseFloat(v));}return v;}' +
  'var em=document.getElementById("imsg");' +
  'function esay(t,ok){em.innerHTML="<p class=\\"imsg "+(ok?"good":"bad")+"\\">"+t+"</p>";}' +
  'function echanges(){var ch={};document.querySelectorAll("[data-ed]").forEach(function(el){var c=el.getAttribute("data-ed"),k=el.getAttribute("data-kind");' +
    'if(en(k,el.value)!==en(k,BEFORE[c]))ch[c]=el.value.trim();});return ch;}' +
  'var ebtns=[].slice.call(document.querySelectorAll("#ebody button"));' +
  'function ebusy(on){ebtns.forEach(function(b){b.disabled=on;});}' +
  'function esend(ch,action,label){' +
    'if(!Object.keys(ch).length){esay("Nothing has changed yet.",false);return;}' +
    'ebusy(true);esay(label,true);' +
    'google.script.run.withSuccessHandler(function(r){ebusy(false);' +
      'if(r.ok){document.getElementById("ebody").innerHTML="<div class=\\"tbtns\\"><a class=\\"pbtn\\" href=\\""+FURL+"\\" target=\\"_top\\">Open this file again</a><a class=\\"pbtn ghost\\" href=\\""+FIND+"\\" target=\\"_top\\">Escrow Lookup</a></div>";}' +
      'else if(r.unlisted)newShow(r.unlisted);' +
      'esay(r.msg,r.ok);})' +
    '.withFailureHandler(function(e){ebusy(false);esay("Nothing was saved: "+e.message,false);})' +
    '.intakeSaveFile(KEY,RID,ch,BEFORE,action,SCR,newAdds());}' +
  'document.getElementById("esave").addEventListener("click",function(){esend(echanges(),"","Saving...");});' +
  'var ec=document.getElementById("eclose");if(ec)ec.addEventListener("click",function(){var d=document.getElementById("ecoe").value;' +
    'if(!d){esay("Pick the Actual COE date first.",false);return;}var ch=echanges();ch["File Status"]="Closed";ch["Actual COE"]=d;esend(ch,"close","Closing...");});' +
  'var ex=document.getElementById("ecancel"),exArmed=0;if(ex)ex.addEventListener("click",function(){' +
    'if(!exArmed){exArmed=1;ex.textContent="Click again to cancel this file";setTimeout(function(){exArmed=0;ex.textContent="Cancel the file";},6000);return;}' +
    'exArmed=0;ex.textContent="Cancel the file";var ch=echanges();ch["File Status"]="Canceled";esend(ch,"cancel","Canceling...");});' +
  'var eo=document.getElementById("eopen");if(eo)eo.addEventListener("click",function(){' +
    'var od=document.getElementById("oopen").value,pc=document.getElementById("ocoe").value,st=document.getElementById("ostat").value,fe=document.getElementById("ofee").value.trim();' +
    'if(!od||!pc||!st||!fe){esay("To open it, fill in Open Date, Projected COE, File Status, and Escrow Fees.",false);return;}' +
    'var ch=echanges();ch["Open Date"]=od;ch["Projected COE"]=pc;ch["File Status"]=st;ch["Escrow Fees"]=fe;esend(ch,"open","Opening...");});' +
  'var er=document.getElementById("eremove"),erArmed=0;if(er)er.addEventListener("click",function(){' +
    'if(!erArmed){erArmed=1;er.textContent="Click again to remove this pre-open";setTimeout(function(){erArmed=0;er.textContent="Remove it";},6000);return;}' +
    'erArmed=0;ebusy(true);esay("Removing...",true);' +
    'google.script.run.withSuccessHandler(function(r){ebusy(false);' +
      'if(r.ok)document.getElementById("ebody").innerHTML="<div class=\\"tbtns\\"><a class=\\"pbtn\\" href=\\""+FIND+"\\" target=\\"_top\\">Escrow Lookup</a></div>";' +
      'esay(r.msg,r.ok);})' +
    '.withFailureHandler(function(e){ebusy(false);esay("Nothing was removed: "+e.message,false);})' +
    '.intakeRemovePreopen(KEY,RID,SCR);});';

/* ---------- save ---------- */

// Called from the file page. changes: { column title: new value } (only what changed);
// before: what the page showed for each editable field; action: '' | 'close' | 'cancel'.
// Writes nothing unless every check passes. Returns { ok, msg }.
function intakeSaveFile(key, rowId, changes, before, action, scratch, add) {
  var lock = LockService.getScriptLock();
  try {
    var u = intakeUser();
    key = String(key || '').toLowerCase();
    rowId = String(rowId || '').replace(/[^0-9]/g, '');
    if (!intakeCanOpen(u, key)) return { ok: false, msg: 'The Hub could not read your sign-in, or that team does not exist. Reload the page and try again. Nothing was saved.' };
    changes = changes || {}; before = before || {}; action = String(action || '');
    var names = Object.keys(changes);
    if (!names.length) return { ok: false, msg: 'Nothing has changed yet.' };

    lock.waitLock(20000);
    var f = intakeFileRow(key, rowId, scratch), state = intakeFileState(f.v, f.section);
    if (action === 'open' && state !== 'preopen') return { ok: false, msg: 'Only a pre-open can be opened this way. Nothing was saved.' };
    var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
    var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');

    // Stale check: every field being changed must still hold what the page showed.
    var moved = names.filter(function (n) {
      var kind = INTAKE_EDIT.kinds[n] || 'text';
      return Object.prototype.hasOwnProperty.call(before, n) && intakeCmp(kind, f.v[n.toLowerCase()]) !== intakeCmp(kind, before[n]);
    });
    if (moved.length) return { ok: false, msg: 'Someone changed ' + esc(moved.join(', ')) + ' on this file since you opened it. Open the file again to see the new values; nothing was saved.' };

    // Validate each change against the file's state and the column.
    var after = {}, cells = [], logged = [], unlisted = [], toAdd = [], lists = {};
    add = (add && typeof add === 'object') ? add : {};
    Object.keys(f.v).forEach(function (t) { after[t] = f.v[t]; });
    for (var i = 0; i < names.length; i++) {
      var n = names[i], kind = INTAKE_EDIT.kinds[n], c = f.col(n), val = changes[n];
      if (!kind || !c) return { ok: false, msg: esc(n) + ' cannot be changed in the Hub. Nothing was saved.' };
      if (kind === 'check') val = intakeCmp(kind, val) === 'Yes';
      else val = normName(val);
      if (val === '' && INTAKE_EDIT.required.indexOf(n) >= 0) return { ok: false, msg: esc(n) + ' cannot be blank. Nothing was saved.' };
      if (kind === 'pick' && (c.options || []).indexOf(val) < 0)
        return { ok: false, msg: '"' + esc(val) + '" is not a ' + esc(n) + ' choice on this sheet. Nothing was saved.' };
      if (kind === 'client' || kind === 'agent') {
        if (!lists[kind]) lists[kind] = intakeList(kind, true);
        var checked = intakeNamesCheck(kind, val, add, lists[kind], unlisted, toAdd);
        if (checked.err) return { ok: false, msg: checked.err };
        val = checked.val;
      }
      if (kind === 'date') {
        if (!val) return { ok: false, msg: n + ' needs a date. Nothing was saved.' };
        val = validDate(val);
        if (!val) return { ok: false, msg: n + ' needs a date. Nothing was saved.' };
      }
      if (kind === 'money') {
        var amt = num(val);
        if (!(amt > 0)) return { ok: false, msg: 'Escrow Fees needs a dollar amount. Nothing was saved.' };
        val = amt;
      }
      if (state === 'preopen' && action !== 'open' && ['Open Date', 'Projected COE', 'File Status', 'Escrow Fees'].indexOf(n) >= 0)
        return { ok: false, msg: 'This is a pre-open; use Open it to set ' + esc(n) + '. Nothing was saved.' };
      if (n === 'Open Date' && val > today) return { ok: false, msg: 'Open Date cannot be after today. Nothing was saved.' };
      if (n === 'File Status') {
        if ((c.options || []).indexOf(val) < 0) return { ok: false, msg: '"' + esc(val) + '" is not a File Status choice on this sheet. Nothing was saved.' };
        var low = val.toLowerCase();
        if (low === 'closed' && action !== 'close') return { ok: false, msg: 'Use Close the file to close it, so the Actual COE is set too. Nothing was saved.' };
        if (low === 'canceled' && action !== 'cancel') return { ok: false, msg: 'Use Cancel the file to cancel it. Nothing was saved.' };
      }
      if (n === 'Actual COE') {
        if (state !== 'closed' && action !== 'close') return { ok: false, msg: 'Actual COE is set by Close the file. Nothing was saved.' };
        if (val > today) return { ok: false, msg: 'Actual COE cannot be after today. Nothing was saved.' };
      }
      if (state === 'closed' && n !== 'Actual COE' && action) return { ok: false, msg: 'This file has closed. Reopen it first by picking a File Status and saving. Nothing was saved.' };
      after[n.toLowerCase()] = val;
      cells.push({ columnId: c.id, value: val, strict: false });
      var old = f.v[n.toLowerCase()];
      logged.push([n, kind === 'check' ? intakeCmp(kind, val) : String(val), kind === 'check' ? intakeCmp(kind, old) : String(old == null ? '' : old)]);
    }
    // Picking an open status on a closed file reopens it: Actual COE is cleared, so the
    // file goes back under its Projected COE month (Brett, 2026-11-03).
    var reopen = state === 'closed' && !action && changes['File Status'] !== undefined;
    if (reopen) {
      if (!validDate(after['projected coe'])) return { ok: false, msg: 'To reopen it, set Projected COE too. Nothing was saved.' };
      var ac = f.col('Actual COE'), oldCoe = f.v['actual coe'];
      cells = cells.filter(function (x) { return x.columnId !== ac.id; }).concat([{ columnId: ac.id, value: '', strict: false }]);
      logged = logged.filter(function (p) { return p[0] !== 'Actual COE'; }).concat([['Actual COE', '', String(oldCoe == null ? '' : oldCoe)]]);
      after['actual coe'] = '';
    }
    if (unlisted.length) return { ok: false, unlisted: unlisted,
      msg: (unlisted.length === 1 ? 'One name is' : unlisted.length + ' names are') +
        ' not on the list (see under the field). Pick a match or tick "Add it", then Save changes again. Nothing was saved.' };
    if (action === 'close' && !(changes['File Status'] && changes['Actual COE'])) return { ok: false, msg: 'Closing needs File Status Closed and an Actual COE. Nothing was saved.' };
    if (action === 'cancel' && state === 'closed') return { ok: false, msg: 'This file has closed. Reopen it first by picking a File Status and saving, then cancel it. Nothing was saved.' };
    if (action === 'open' && !(changes['Open Date'] && changes['Projected COE'] && changes['File Status'] && changes['Escrow Fees']))
      return { ok: false, msg: 'Opening needs Open Date, Projected COE, File Status, and Escrow Fees. Nothing was saved.' };

    // Placement: move only when the save changes where the file belongs. A pre-open
    // stays under PRE-OPENS until it is opened.
    var was = intakeSectionFor(f.v, f.section), goes = intakeSectionFor(after, action === 'open' ? '' : f.section), loc = null, target = null;
    if (goes && goes !== was && goes !== f.section) {
      var addr = f.col('Property Address');
      var sheet = intakeApi('get', '/sheets/' + f.sheetId + '?columnIds=' + addr.id);
      var marker = null;
      (sheet.rows || []).forEach(function (r) {
        var a = '';
        (r.cells || []).forEach(function (cell) { if (cell.columnId === addr.id) a = normName(cell.value); });
        if (!target && a.toUpperCase() === goes) target = r;
        if (target && !marker && r.parentId === target.id && a.toLowerCase() === INTAKE.insertMarker) marker = r;
      });
      if (!target) return { ok: false, msg: 'The ' + esc(TEAMS[key].label) + ' sheet has no ' + esc(intakeNiceSection(goes)) +
        ' section yet, so the file has nowhere to move. Check the date. If it is right, ask Elizabeth to add that year\'s month sections. Nothing was saved.' };
      loc = marker ? { siblingId: marker.id, above: true } : { parentId: target.id, toBottom: true };
    }

    intakeApi('put', '/sheets/' + f.sheetId + '/rows', [{ id: f.row.id, cells: cells }]);
    var when = new Date(), no = normName(f.v['escrow #']), verb = (action || (reopen ? 'reopen' : 'update')) + (scratch ? ' (test)' : ''), moveErr = '';
    if (loc) {
      var mv = { id: f.row.id };
      Object.keys(loc).forEach(function (x) { mv[x] = loc[x]; });
      try { intakeApi('put', '/sheets/' + f.sheetId + '/rows', [mv]); logged.push(['Section', goes, f.section]); }
      catch (e) { moveErr = e.message || String(e); }
    }
    // New names confirmed on the page join their list; test mode never touches the lists.
    var added = [], tag = scratch ? ' (test)' : '';
    toAdd.forEach(function (a) {
      if (scratch) { added.push(a); return; }
      try { if (intakeAddToList(a[0], a[1], u, when)) added.push(a); }
      catch (e) { console.error('List add failed for ' + a[1] + ': ' + e); }
    });
    intakeLog(logged.map(function (p) {
      return [when, u.email, verb, TEAMS[key].label, "'" + f.sheetId, "'" + f.row.id, no, p[0], "'" + p[1], "'" + p[2]];  // ' keeps "OCTOBER 2026" as text
    }).concat(added.map(function (a) {
      return [when, u.email, 'new ' + a[0] + tag, TEAMS[key].label, '', '', no, INTAKE_LISTS[a[0]].field, a[1]];
    })));
    try { CacheService.getScriptCache().removeAll(['portalTeam_' + key, 'portalPulse', 'intakePre_' + key]); } catch (e) {}
    var fresh = intakeIndexPatch(key, f.row.id, scratch);

    var what = action === 'close' ? 'Closed ' + esc(no) + ' on ' + esc(fullDate(after['actual coe'])) + '.'
             : action === 'cancel' ? 'Canceled ' + esc(no) + '.'
             : action === 'open' ? 'Opened ' + esc(no) + ' on ' + esc(fullDate(after['open date'])) + '.'
             : reopen ? 'Reopened ' + esc(no) + ' as ' + esc(after['file status']) + '; Actual COE cleared.'
             : 'Saved ' + esc(no) + ': ' + esc(names.join(', ')) + '.';
    if (moveErr) return { ok: false, msg: what + ' But the file could not be moved under ' + esc(intakeNiceSection(goes)) + ' (' + esc(moveErr) + '). Tell Brett; it is still under ' + esc(intakeNiceSection(f.section) || 'its old section') + '.' };
    return { ok: true, row: fresh, msg: what + (loc ? ' Moved under ' + esc(intakeNiceSection(goes)) + '.' : '') +
      (added.length ? (scratch ? ' Test: not added to the live list: ' : ' Added to the list: ') + added.map(function (a) { return esc(a[1]); }).join(', ') + '.' : '') };
  } catch (e) {
    return { ok: false, msg: esc(e.message || String(e)) };
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

/* ========================= PRE-OPENS ========================= */

// Deletes a pre-open (a row under PRE-OPENS that has not closed). Called from its file
// page and from the stale list on the team page. Returns { ok, msg }.
function intakeRemovePreopen(key, rowId, scratch) {
  var lock = LockService.getScriptLock();
  try {
    var u = intakeUser();
    key = String(key || '').toLowerCase();
    rowId = String(rowId || '').replace(/[^0-9]/g, '');
    if (!intakeCanOpen(u, key)) return { ok: false, msg: 'The Hub could not read your sign-in, or that team does not exist. Reload the page and try again. Nothing was removed.' };
    lock.waitLock(20000);
    var f = intakeFileRow(key, rowId, scratch);
    if (intakeFileState(f.v, f.section) !== 'preopen') return { ok: false, msg: 'This file is no longer a pre-open, so it was not removed. Open it again to see where it is.' };
    var no = normName(f.v['escrow #']), addr = normName(f.v['property address']);
    intakeApi('delete', '/sheets/' + f.sheetId + '/rows?ids=' + f.row.id);
    intakeLog([[new Date(), u.email, 'remove pre-open' + (scratch ? ' (test)' : ''), TEAMS[key].label, "'" + f.sheetId, "'" + f.row.id, no, 'Row', 'deleted', addr]]);
    try { CacheService.getScriptCache().removeAll(['portalTeam_' + key, 'portalPulse', 'intakePre_' + key]); } catch (e) {}
    intakeIndexPatch(key, f.row.id, scratch, true);
    return { ok: true, msg: 'Removed the pre-open ' + esc(no) + (addr ? ' (' + esc(addr) + ')' : '') + '.' };
  } catch (e) {
    return { ok: false, msg: esc(e.message || String(e)) };
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

// One team's pre-opens at least INTAKE_EDIT.staleDays old: [{ id, no, addr, client, days }],
// oldest first. Age runs from Open Date, else the row's created date. Cached 15 minutes;
// every Hub write for the team clears it. Fail-soft null.
function intakeStalePreopens(key) {
  try {
    var cache = CacheService.getScriptCache(), ck = 'intakePre_' + key;
    var hit = cache.get(ck);
    if (hit) return JSON.parse(hit);
    var sheetId = TEAMS[key].sheet;
    var col = intakeColumns(intakeApi('get', '/sheets/' + sheetId + '/columns?includeAll=true').data);
    var ids = ['Escrow #', 'Property Address', 'Directing Customer', 'Open Date'].map(col).filter(Boolean).map(function (c) { return c.id; });
    var g = intakeApi('get', '/sheets/' + sheetId + '?columnIds=' + ids.join(','));
    var titles = intakeTitles(g.columns), section = null, out = [], now = new Date().getTime();
    (g.rows || []).forEach(function (r) {
      var v = intakeRowVals(r, titles).v;
      if (!section && !normName(v['escrow #']) && normName(v['property address']).toUpperCase() === INTAKE_EDIT.preopen) { section = r.id; return; }
      if (!section || r.parentId !== section) return;
      var from = validDate(v['open date']) || String(r.createdAt || '').substring(0, 10);
      var days = from ? Math.floor((now - new Date(from + 'T12:00:00').getTime()) / 86400000) : 0;
      if (days >= INTAKE_EDIT.staleDays) out.push({ id: String(r.id), no: normName(v['escrow #']), addr: normName(v['property address']), client: normName(v['directing customer']), days: days });
    });
    out.sort(function (a, b) { return b.days - a.days; });
    try { cache.put(ck, JSON.stringify(out), 900); } catch (e) {}
    return out;
  } catch (e) { return null; }
}

// Team page card listing stale pre-opens with Open it (the file page) and Remove.
// Empty when there are none or the sheet cannot be read.
function intakeStaleCard(selfUrl, key) {
  var list = intakeStalePreopens(key);
  if (!list || !list.length) return '';
  var canEdit = intakeCanOpen(intakeUser(), key), base = esc(selfUrl) + '?page=file&t=' + esc(key) + '&r=';
  return intakeCss() + '<div class="pcard"><h2 class="ph2">Stale pre-opens</h2>' +
    '<p class="pnote">' + (list.length === 1 ? 'This pre-open has' : 'These ' + list.length + ' pre-opens have') + ' waited ' + INTAKE_EDIT.staleDays +
      ' days or more without opening. Open it when it opens, or remove it if it will not.</p>' +
    '<div class="scroll"><table class="ptable"><thead><tr><th>Escrow #</th><th>Property</th><th>Client</th><th>Days</th><th></th></tr></thead><tbody>' +
    list.map(function (p) {
      return '<tr id="sp' + esc(p.id) + '"><td><b>' + esc(p.no) + '</b></td><td>' + esc(p.addr) + '</td><td>' + esc(p.client) + '</td><td>' + p.days + '</td><td>' +
        (canEdit ? '<a class="pbtn sm" href="' + base + esc(p.id) + '" target="_top">Open it</a> <button class="pbtn ghost sm" type="button" data-rm="' + esc(p.id) + '">Remove</button>' :
          '<a class="pbtn ghost sm" href="' + base + esc(p.id) + '" target="_top">View</a>') + '</td></tr>';
    }).join('') + '</tbody></table></div><div id="spmsg"></div></div>' +
    (canEdit ? '<script>(function(){var K=' + JSON.stringify(key) + ',m=document.getElementById("spmsg");' +
      'document.querySelectorAll("[data-rm]").forEach(function(b){var armed=0;b.addEventListener("click",function(){' +
        'if(!armed){armed=1;b.textContent="Click again to remove";setTimeout(function(){armed=0;b.textContent="Remove";},6000);return;}' +
        'armed=0;b.disabled=true;b.textContent="Removing...";' +
        'google.script.run.withSuccessHandler(function(r){m.innerHTML="<p class=\\"imsg "+(r.ok?"good":"bad")+"\\">"+r.msg+"</p>";' +
          'if(r.ok){var tr=document.getElementById("sp"+b.getAttribute("data-rm"));if(tr)tr.remove();}else{b.disabled=false;b.textContent="Remove";}})' +
        '.withFailureHandler(function(e){b.disabled=false;b.textContent="Remove";m.innerHTML="<p class=\\"imsg bad\\">Nothing was removed: "+e.message+"</p>";})' +
        '.intakeRemovePreopen(K,b.getAttribute("data-rm"),false);});});})();</script>' : '');
}
