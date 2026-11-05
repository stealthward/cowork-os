/**
 * 2026 AP + FINANCIALS RENAME
 * Fully automated rename for the two folders where it's safe:
 *   03 AP - Invoices & Checks / 2026 / 2026-MM  -> month from FOLDER, vendor from FILENAME
 *   05 Financial Statements / Landmark Financials -> month from FILENAME (monthly compilations)
 *
 * Nothing reads file contents. Everything comes from the folder path + existing filename.
 *
 * AP naming:
 *   - Vendor derived by stripping trailing dates/numbers from the filename.
 *       "Canon 05.16.26"                -> 2026-05_FSE_AP_Canon
 *       "First American Software 03.31.26" -> 2026-03_FSE_AP_First-American-Software
 *   - If no vendor can be derived (e.g. "Invoice-30-268874"), it is FLAGGED, keeping the
 *     known parts + original name so it self-surfaces:
 *       -> 2026-05_FSE_AP_RENAME_Invoice-30-268874
 *     Search Drive for "RENAME" to find every pending file.
 *
 * FIN naming:  "Five Star Escrow January 2026 Compilation" -> 2026-01_FSE_FIN
 *   - Non-monthly / non-2026 docs (e.g. 2025 audit letters) are left alone and logged for review.
 *
 * SAFETY: DRY_RUN first, idempotent, collision-suffixing (_2, _3), single log Sheet.
 * SCOPE: 2026 only. 04 Recs is intentionally NOT touched.
 *
 * RUN: runRename()
 */

const DRY_RUN = true;   // set to false to execute

const AP_2026      = '1ngdjcZtG_qNF5KLLtlOsDZBcIJF1EEla'; // 03 AP / 2026 (holds 2026-MM month folders)
const FIN_LANDMARK = '1bY39-A-mWQ4K0s5R3GB2WSn3mgJDRMn6'; // 05 / Landmark Financials (loose monthly files)

function runRename() {
  LOG.length = 0;
  log('AP + FIN RENAME - DRY_RUN = ' + DRY_RUN + '  (' + new Date().toISOString() + ')');
  processAP();
  processFinancials();
  saveLog();
}

// ---- 03 AP ----
function processAP() {
  var parent = openFolder(AP_2026); if (!parent) return;
  log('=== 03 AP / 2026 ===');
  var months = parent.getFolders();
  while (months.hasNext()) {
    var mf = months.next();
    var mname = mf.getName();
    if (!/^20\d{2}-\d{2}$/.test(mname)) { log('  skip non-month folder "' + mname + '"'); continue; }
    log('  -- ' + mname + ' --');
    var seen = {};
    var files = mf.getFiles();
    while (files.hasNext()) renameInvoice(files.next(), mname, seen);
  }
}

function renameInvoice(f, prefix, seen) {
  var name = f.getName();
  if (/^20\d{2}-\d{2}_FSE_AP_/.test(name)) { log('    ok "' + name + '"'); return; }
  var base = stripExt(name);
  var vendor = extractVendor(base);
  var target = vendor ? (prefix + '_FSE_AP_' + vendor)
                       : (prefix + '_FSE_AP_RENAME_' + sanitize(base));
  target = dedupe(target, seen);
  if (name === target) { log('    ok "' + name + '"'); return; }
  var tag = vendor ? 'RENAME' : 'FLAG  ';
  if (DRY_RUN) { log('    ' + tag + ' "' + name + '" -> "' + target + '"'); return; }
  try { f.setName(target); log('    done  "' + name + '" -> "' + target + '"'); }
  catch (e) { log('    !! "' + name + '": ' + e.message); }
}

function extractVendor(base) {
  var s = ' ' + base + ' ';
  s = s.replace(/\b\d{1,2}[.\-\/]\d{1,2}[.\-\/]\d{2,4}\b/g, ' ');  // 03.31.26 / 3-31-2026
  s = s.replace(/\b\d{1,2}[.\-]\d{2}\b/g, ' ');                     // 05-26
  s = s.replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{0,4}\b/gi, ' '); // May 26 / March
  s = s.replace(/\b20\d{2}\b/g, ' ');                               // 2026
  s = s.replace(/_\d+/g, ' ');                                     // _001
  s = s.replace(/\b\d{3,}\b/g, ' ');                               // long numbers (invoice #s)
  s = s.replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s) return null;
  if (/^(invoice|report|statement|receipt|payment|bill|scan|img|image|document|doc|file)$/i.test(s)) return null;
  if (!/[a-z]/i.test(s)) return null;                               // must contain a letter
  return s.replace(/\s+/g, '-');
}

// ---- 05 Financials ----
function processFinancials() {
  var parent = openFolder(FIN_LANDMARK); if (!parent) return;
  log('=== 05 Financial Statements / Landmark Financials ===');
  var seen = {};
  var files = parent.getFiles();
  while (files.hasNext()) {
    var f = files.next(); var name = f.getName();
    if (/^20\d{2}-\d{2}_FSE_FIN/.test(name)) { log('  ok "' + name + '"'); continue; }
    var my = parseMonthYear(name);
    if (!my) { log('  REVIEW (not a monthly 2026 financial; may belong in 13) "' + name + '"'); continue; }
    var target = dedupe(my + '_FSE_FIN', seen);
    if (name === target) { log('  ok "' + name + '"'); continue; }
    if (DRY_RUN) { log('  RENAME "' + name + '" -> "' + target + '"'); continue; }
    try { f.setName(target); log('  done "' + name + '" -> "' + target + '"'); }
    catch (e) { log('  !! "' + name + '": ' + e.message); }
  }
}

function parseMonthYear(name) {
  var map = { january:'01', february:'02', march:'03', april:'04', may:'05', june:'06',
              july:'07', august:'08', september:'09', october:'10', november:'11', december:'12' };
  var y = name.match(/\b(20\d{2})\b/);
  if (!y || y[1] !== '2026') return null;          // 2026 only
  var lower = name.toLowerCase(), mm = null;
  for (var k in map) { if (lower.indexOf(k) >= 0) { mm = map[k]; break; } }
  return mm ? (y[1] + '-' + mm) : null;
}

// ---- helpers ----
var LOG = [];
function log(s) { LOG.push(s); Logger.log(s); }
function openFolder(id) { try { return DriveApp.getFolderById(id); } catch (e) { log('  !! cannot open ' + id); return null; } }
function stripExt(n) { var i = n.lastIndexOf('.'); return i > 0 ? n.substring(0, i) : n; }
function sanitize(s) { return s.replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); }
function dedupe(t, seen) { var out = t, k = 1; while (seen[out]) { k++; out = t + '_' + k; } seen[out] = true; return out; }
function saveLog() {
  var ss = SpreadsheetApp.create('AP-FIN Rename Log - ' + (DRY_RUN ? 'DRY RUN' : 'LIVE') + ' - ' + new Date().toISOString().slice(0, 16));
  var rng = ss.getActiveSheet().getRange(1, 1, LOG.length, 1);
  rng.setNumberFormat('@');
  rng.setValues(LOG.map(function (l) { return [l]; }));
  Logger.log('LOG SHEET: ' + ss.getUrl());
}
