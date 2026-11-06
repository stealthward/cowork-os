/**
 * FINANCE CLEANUP
 * Fixes the mess from the migration + files the known stragglers. Specifically:
 *   1) Trash the 4 empty CBT-* placeholder folders + the "this can be deleted" folder
 *      — ONLY after verifying each contains zero files at any depth (hard safety).
 *   2) Rename the real bank-account folders to the CBT- convention.
 *   3) Move three stragglers to their proper homes.
 *
 * NOT handled here (needs human judgment — do these by hand):
 *   - Merging the two audit trees (08 Tax/Annual Audit vs Meetings/Five Star Audits)
 *   - Consolidating the loose Landmark Financials PDFs into 05
 *
 * SAFETY:
 *   - DRY_RUN = true logs the plan and changes nothing.
 *   - Deletes use trash (recoverable ~30 days), never permanent, and ONLY on verified-empty folders.
 *   - Each op checks the folder's current name matches what we expect; mismatch = skip + warn.
 *   - Single log Sheet. Idempotent. Fail-soft.
 *
 * RUN: runCleanup()
 */

const DRY_RUN = true;   // set to false to execute

const FIN   = '1B31ALr30hdpYme255GiMuPbSDl8upuLU'; // Five Star Finance
const AP03  = '1t3S7iWxyZI-1JSkSd_Jm4V30KTCX6fH3'; // 03 AP - Invoices & Checks
const CORP  = '1Jv-WULAsYftdxpzXVU8wMOlJG7dQEszr'; // 11 Corporate & Licenses
const PPP   = '1tjTkf3UB8ZzFMy38sy_QbZCpjiaow7XH'; // 09 Loans & Financing / PPP Loan

// [expected name, id] — trashed ONLY if the name matches AND zero files at any depth
const EMPTY_TO_TRASH = [
  ['CBT-Operating',       '1Kj9yqdiAuSeED2AwIIxOLYYwz4U_uLQ4'],
  ['CBT-Savings-2274',    '1_9oGApEprBEYpvRsdgoFTLDRm62gCx18'],
  ['CBT-Savings-0678',    '1uyMGPJi-_BL0mnkHllRfY4AaUpAMldNy'],
  ['CBT-Trust',           '1J81xGCpmv4NQ01JeGRcZ0Ab8gOR6TmJI'],
  ['this can be deleted', '1V_6JFEaogekU3FGiVNksjoiBFuZTgrXz']
];

// [id, newName, expected current name] — the REAL account folders
const BANK_RENAMES = [
  ['1FMcIkB5nw_VpToJj7zE0p0kPzHmDKfz-', 'CBT-Operating',    'General Account'],
  ['1NtR67j82y5lK404bM94gvE4NKTJ81o6C', 'CBT-Savings-2274', 'Savings 2274'],
  ['12VmVUlvob2oeaEebBuAAcOxoOHHTaejx', 'CBT-Savings-0678', 'Savings 0678'],
  ['1S6zfG3upF_uA-4fawGWZ2p5WFMbozXv3', 'CBT-Trust',        'Trust Account']
];

// [id, destId, label]
const MOVES = [
  ['1tjO3tL2IRQLzy5ThCKCRcxrFOHQQGkQt', AP03, 'Real Talk Invoices for Five Star -> 03 AP'],
  ['1G1-2Bo1Nf0VUFouOcO33aGfUNCWjqLDT9PylQfx3q9A', CORP, 'Authorization to Release Financial Info -> 11 Corporate & Licenses'],
  ['1HcijSHZ2snhjRN-Zs5h2hcCNUbQWXfeR', PPP, 'PPP Loan Forgiveness pdf -> 09/PPP Loan']
];

function runCleanup() {
  LOG.length = 0;
  log('CLEANUP — DRY_RUN = ' + DRY_RUN + '  (' + new Date().toISOString() + ')');
  trashEmpties();
  renameBanks();
  moveStragglers();
  saveLog();
}

function trashEmpties() {
  log('--- Trash empty placeholders (verified-empty only) ---');
  EMPTY_TO_TRASH.forEach(function (row) {
    var expected = row[0], id = row[1];
    var f = openFolder(id);
    if (!f) return;
    var cur = f.getName();
    if (cur.trim() !== expected.trim()) { log('  SKIP (name mismatch: "' + cur + '" != "' + expected + '") ' + id); return; }
    var files = deepFileCount(f);
    if (files > 0) { log('  SKIP (NOT empty — ' + files + ' file(s) inside) "' + cur + '"'); return; }
    if (DRY_RUN) { log('  TRASH "' + cur + '" (empty ✓)'); return; }
    try { f.setTrashed(true); log('  TRASHED "' + cur + '"'); }
    catch (e) { log('  !! trash failed "' + cur + '": ' + e.message); }
  });
}

function renameBanks() {
  log('--- Rename real bank-account folders to CBT- convention ---');
  BANK_RENAMES.forEach(function (row) {
    var id = row[0], newName = row[1], expected = row[2];
    var f = openFolder(id);
    if (!f) return;
    var cur = f.getName();
    if (cur === newName) { log('  name ok "' + newName + '"'); return; }
    if (cur.trim() !== expected.trim()) { log('  SKIP (unexpected name "' + cur + '") ' + id); return; }
    if (DRY_RUN) { log('  RENAME "' + cur + '" -> "' + newName + '"'); return; }
    try { f.setName(newName); log('  RENAMED "' + cur + '" -> "' + newName + '"'); }
    catch (e) { log('  !! rename failed "' + cur + '": ' + e.message); }
  });
}

function moveStragglers() {
  log('--- Move stragglers ---');
  var destCache = {};
  MOVES.forEach(function (row) {
    var id = row[0], destId = row[1], label = row[2];
    var item = openItem(id);
    if (!item) { log('  !! cannot open source ' + id + ' (' + label + ')'); return; }
    var dest = destCache[destId] || (destCache[destId] = openFolder(destId));
    if (!dest) { log('  !! cannot open dest ' + destId); return; }
    if (DRY_RUN) { log('  MOVE ' + label); return; }
    try { item.moveTo(dest); log('  MOVED ' + label); }
    catch (e) { log('  !! move failed (' + label + '): ' + e.message); }
  });
}

// ---- helpers ----
var LOG = [];
function log(s) { LOG.push(s); Logger.log(s); }

function openFolder(id) { try { return DriveApp.getFolderById(id); } catch (e) { log('  !! cannot open folder ' + id); return null; } }
function openItem(id) {
  try { return DriveApp.getFolderById(id); } catch (e) {}
  try { return DriveApp.getFileById(id); } catch (e) {}
  return null;
}

function deepFileCount(folder) {
  var total = 0;
  try {
    var files = folder.getFiles();
    while (files.hasNext()) { files.next(); total++; if (total > 5000) return total; }
    var subs = folder.getFolders();
    while (subs.hasNext()) { total += deepFileCount(subs.next()); if (total > 5000) return total; }
  } catch (e) {}
  return total;
}

function saveLog() {
  var ss = SpreadsheetApp.create('Cleanup Log — ' + (DRY_RUN ? 'DRY RUN' : 'LIVE') + ' — ' + new Date().toISOString().slice(0, 16));
  var rng = ss.getActiveSheet().getRange(1, 1, LOG.length, 1);
  rng.setNumberFormat('@');
  rng.setValues(LOG.map(function (l) { return [l]; }));
  Logger.log('LOG SHEET: ' + ss.getUrl());
}
