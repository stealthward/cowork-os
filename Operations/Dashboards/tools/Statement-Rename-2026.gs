/**
 * 2026 STATEMENT RENAME (bank + CC)
 * Walks each account/card's 2026 folder under 01 Bank Statements and 02 Credit Card
 * Statements, reads the month from the existing filename ("... MM-YY", e.g. "Chase 06-26"),
 * and renames to the canonical convention:
 *     2026-MM_FSE_BANK_[Account]_Statement.pdf
 *     2026-MM_FSE_CC_[Card]_Statement.pdf
 * Account/card + type come from the folder path; month comes from the filename. No PDF parsing.
 *
 * SCOPE: 2026 only. Older years are left as-is.
 *
 * SAFETY:
 *   - DRY_RUN = true logs every proposed rename, changes nothing.
 *   - Skips files already in canonical form (idempotent, re-runnable).
 *   - Files with no readable MM-YY are flagged and skipped (never guessed).
 *   - Files whose year isn't 26 are flagged as possible misfiles and skipped.
 *   - Collision guard: if the target name already exists in the folder, it flags and skips.
 *   - "Archive …" account folders are skipped. Single log Sheet.
 *
 * RUN: renameStatements()
 */

const DRY_RUN = true;   // set to false to execute

const YEAR = '2026';
const BANK_PARENT = '1QYRrHPDYGeaobxQr2eSaUBHk78NRRpvv'; // 01 Bank Statements
const CC_PARENT   = '1zXE5xxY6pEf8ZnByeGHd3bjwMH4bo_AV'; // 02 Credit Card Statements
const SKIP_ACCOUNT = /archive/i;

function renameStatements() {
  LOG.length = 0;
  log('STATEMENT RENAME - DRY_RUN = ' + DRY_RUN + '  (' + new Date().toISOString() + ')');
  processParent(BANK_PARENT, 'BANK');
  processParent(CC_PARENT, 'CC');
  saveLog();
}

function processParent(parentId, type) {
  var parent = openFolder(parentId); if (!parent) return;
  log('=== ' + parent.getName() + '  (' + type + ') ===');
  var accts = parent.getFolders();
  while (accts.hasNext()) {
    var acct = accts.next();
    var acctName = acct.getName();
    if (SKIP_ACCOUNT.test(acctName)) { log('  skip "' + acctName + '"'); continue; }
    var token = acctName.trim().replace(/\s+/g, '-');   // "Chase Sapphire" -> "Chase-Sapphire"
    var yf = childByName(acct, YEAR);
    if (!yf) { log('  (no ' + YEAR + ' folder in "' + acctName + '")'); continue; }
    log('  -- ' + acctName + '/' + YEAR + ' --');
    renameFilesIn(yf, type, token);
  }
}

function renameFilesIn(folder, type, token) {
  var files = folder.getFiles();
  while (files.hasNext()) {
    var f = files.next();
    var name = f.getName();
    if (isCanonical(name)) { log('    ok "' + name + '"'); continue; }

    var mmyy = extractMonthYear(name);
    if (!mmyy) { log('    !! no MM-YY in "' + name + '" - SKIP (name manually)'); continue; }
    if (mmyy.yy !== '26') { log('    SKIP (year ' + mmyy.yy + ' != 26, possible misfile) "' + name + '"'); continue; }

    var newName = YEAR + '-' + mmyy.mm + '_FSE_' + type + '_' + token + '_Statement' + getExt(name);
    if (name === newName) { log('    ok "' + name + '"'); continue; }
    if (nameTaken(folder, newName, f)) { log('    !! target exists "' + newName + '" - SKIP (two files, one month?)'); continue; }

    if (DRY_RUN) { log('    RENAME "' + name + '" -> "' + newName + '"'); continue; }
    try { f.setName(newName); log('    RENAMED "' + name + '" -> "' + newName + '"'); }
    catch (e) { log('    !! failed "' + name + '": ' + e.message); }
  }
}

// month = first 1-2 digits, year = the two digits after the dash; validates month 1-12
function extractMonthYear(name) {
  var m = name.match(/(\d{1,2})-(\d{2})\b/);
  if (!m) return null;
  var mm = parseInt(m[1], 10);
  if (mm < 1 || mm > 12) return null;
  return { mm: (mm < 10 ? '0' + mm : '' + mm), yy: m[2] };
}
function isCanonical(name) { return /^20\d{2}-\d{2}_FSE_(BANK|CC)_/.test(name); }
function getExt(name) { var i = name.lastIndexOf('.'); return i > 0 ? name.substring(i) : ''; }
function childByName(folder, name) { var it = folder.getFoldersByName(name); return it.hasNext() ? it.next() : null; }
function nameTaken(folder, newName, self) {
  var it = folder.getFilesByName(newName);
  while (it.hasNext()) { if (it.next().getId() !== self.getId()) return true; }
  return false;
}

// ---- helpers ----
var LOG = [];
function log(s) { LOG.push(s); Logger.log(s); }
function openFolder(id) { try { return DriveApp.getFolderById(id); } catch (e) { log('  !! cannot open ' + id); return null; } }
function saveLog() {
  var ss = SpreadsheetApp.create('Statement Rename Log - ' + (DRY_RUN ? 'DRY RUN' : 'LIVE') + ' - ' + new Date().toISOString().slice(0, 16));
  var rng = ss.getActiveSheet().getRange(1, 1, LOG.length, 1);
  rng.setNumberFormat('@');
  rng.setValues(LOG.map(function (l) { return [l]; }));
  Logger.log('LOG SHEET: ' + ss.getUrl());
}
