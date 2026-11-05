/**
 * FINANCE FILING WATCHER  ("drop it and forget it")
 * A time-driven Apps Script that watches the AP month folders and the bank/CC statement
 * folders. Anything dropped in raw gets renamed to the canonical convention automatically.
 * Felicia never renames a file by hand -- she drops the ORIGINAL download in, untouched.
 *
 * WHAT IT NAMES
 *   03 AP / [YYYY] / [YYYY-MM]     -> YYYY-MM_FSE_AP_[Vendor]           (month from folder)
 *       First American keeps its native [account]_[invoice] key:
 *       "21219_837603.pdf"          -> 2026-05_FSE_AP_First-American_21219_837603
 *   01 Bank Statements / [Acct] / [YYYY] -> YYYY-MM_FSE_BANK_[Acct]     (month from filename)
 *   02 Credit Card Statements / [Card] / [YYYY] -> YYYY-MM_FSE_CC_[Card]
 *
 * UNKNOWN VENDOR -> flagged, never guessed:
 *       2026-05_FSE_AP_RENAME_<original-name>
 *   Search Drive for "RENAME" to find every pending file.
 *
 * SETUP (once):
 *   1. Paste into a NEW Apps Script project. Run setUp() once and authorize.
 *      -> installs an hourly trigger and sends nothing until files appear.
 *   2. Set NOTIFY_EMAIL below to get a summary only when something is renamed or flagged.
 *   3. To test first: leave DRY_RUN = true and run watchOnce() manually, check the log.
 *      Then set DRY_RUN = false. The trigger uses whatever DRY_RUN is set to.
 *
 * To stop it: run removeTriggers().
 */

var DRY_RUN = true;                       // set to false once the dry run looks right
var NOTIFY_EMAIL = '';                    // e.g. 'brett@brettward.net'  ('' = no email)

var AP_YEARS   = ['1ngdjcZtG_qNF5KLLtlOsDZBcIJF1EEla'];  // 03 AP / 2026  (add next year's folder here)
var BANK_ROOT  = '1QYRrHPDYGeaobxQr2eSaUBHk78NRRpvv';    // 01 Bank Statements
var CC_ROOT    = '1zXE5xxY6pEf8ZnByeGHd3bjwMH4bo_AV';    // 02 Credit Card Statements
var SKIP_FOLDER = /archive/i;

// Vendor rules: token is a string, or a function(base) -> string.
var VENDOR_RULES = [
  { re: /first american|^\s*2(1219|2067)_/i, token: function (base) {
      var m = base.match(/\b(21219|22067)[_-]?(\d+)?/);
      if (m) return 'First-American_' + m[1] + (m[2] ? '_' + m[2] : '');
      return /software/i.test(base) ? 'First-American_22067' : 'First-American_21219';
    } }
  // Add vendors here as needed:  { re: /canon/i, token: 'Canon' }
];

// ---------- setup ----------
function setUp() {
  removeTriggers();
  ScriptApp.newTrigger('watchOnce').timeBased().everyHours(1).create();
  Logger.log('Hourly trigger installed. DRY_RUN = ' + DRY_RUN);
}
function removeTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  Logger.log('Triggers removed.');
}

// ---------- main ----------
function watchOnce() {
  LOG.length = 0; CHANGES = 0; FLAGS = 0;
  AP_YEARS.forEach(scanApYear);
  scanStatements(BANK_ROOT, 'BANK');
  scanStatements(CC_ROOT, 'CC');
  if (LOG.length) Logger.log(LOG.join('\n'));
  if (NOTIFY_EMAIL && (CHANGES || FLAGS)) {
    MailApp.sendEmail(NOTIFY_EMAIL,
      'Finance filing watcher: ' + CHANGES + ' renamed, ' + FLAGS + ' flagged',
      LOG.join('\n'));
  }
}

function scanApYear(yearId) {
  var yf = openFolder(yearId); if (!yf) return;
  var months = yf.getFolders();
  while (months.hasNext()) {
    var mf = months.next(), mname = mf.getName();
    if (!/^20\d{2}-\d{2}$/.test(mname)) continue;
    var files = mf.getFiles();
    while (files.hasNext()) {
      var f = files.next(), name = f.getName();
      if (/^20\d{2}-\d{2}_FSE_AP_/.test(name)) continue;      // already canonical
      var base = stripExt(name);
      var vendor = matchVendor(base) || genericVendor(base);
      var target = vendor ? (mname + '_FSE_AP_' + vendor)
                          : (mname + '_FSE_AP_RENAME_' + sanitize(base));
      target = uniqueIn(mf, target, f);
      apply(f, name, target, vendor ? 'renamed' : 'FLAGGED');
    }
  }
}

function scanStatements(rootId, type) {
  var root = openFolder(rootId); if (!root) return;
  var accts = root.getFolders();
  while (accts.hasNext()) {
    var acct = accts.next(), an = acct.getName();
    if (SKIP_FOLDER.test(an)) continue;
    var token = an.trim().replace(/\s+/g, '-');
    var years = acct.getFolders();
    while (years.hasNext()) {
      var yf = years.next(), yr = yf.getName();
      if (!/^20\d{2}$/.test(yr)) continue;
      var files = yf.getFiles();
      while (files.hasNext()) {
        var f = files.next(), name = f.getName();
        if (/^20\d{2}-\d{2}_FSE_(BANK|CC)_/.test(name)) continue;
        var mm = monthFrom(name);
        if (!mm) { flag('  ? no month in "' + name + '" (' + an + '/' + yr + ')'); continue; }
        var target = uniqueIn(yf, yr + '-' + mm + '_FSE_' + type + '_' + token, f);
        apply(f, name, target, 'renamed');
      }
    }
  }
}

// ---------- naming ----------
function matchVendor(base) {
  for (var i = 0; i < VENDOR_RULES.length; i++) {
    if (VENDOR_RULES[i].re.test(base)) {
      var t = VENDOR_RULES[i].token;
      return (typeof t === 'function') ? t(base) : t;
    }
  }
  return null;
}

function genericVendor(base) {
  var s = ' ' + base + ' ';
  s = s.replace(/\b\d{1,2}[.\-\/]\d{1,2}[.\-\/]\d{2,4}\b/g, ' ');
  s = s.replace(/\b\d{1,2}[.\-]\d{2}\b/g, ' ');
  s = s.replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{0,4}\b/gi, ' ');
  s = s.replace(/\b20\d{2}\b/g, ' ');
  s = s.replace(/_\d+/g, ' ').replace(/\b\d{3,}\b/g, ' ');
  s = s.replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s || !/[a-z]/i.test(s)) return null;
  if (/^(invoice|report|statement|receipt|payment|bill|scan|img|image|document|doc|file)$/i.test(s)) return null;
  return s.replace(/\s+/g, '-');
}

// month from "05-26", "05.16.26", "May 26", "May 2026"
function monthFrom(name) {
  var m = name.match(/\b(\d{1,2})[.\-](\d{1,2})[.\-]\d{2,4}\b/); // 05.16.26 -> month = first
  if (m) { var a = +m[1]; if (a >= 1 && a <= 12) return pad(a); }
  m = name.match(/\b(\d{1,2})-(\d{2})\b/);                        // 05-26
  if (m) { var b = +m[1]; if (b >= 1 && b <= 12) return pad(b); }
  var names = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  var lower = name.toLowerCase();
  for (var i = 0; i < 12; i++) if (lower.indexOf(names[i].substring(0, 3)) >= 0) return pad(i + 1);
  return null;
}

// ---------- plumbing ----------
var LOG = [], CHANGES = 0, FLAGS = 0;
function apply(f, oldName, target, kind) {
  if (oldName === target) return;
  if (DRY_RUN) { LOG.push('  [dry] ' + kind + ': "' + oldName + '" -> "' + target + '"'); (kind === 'renamed' ? CHANGES++ : FLAGS++); return; }
  try { f.setName(target); LOG.push('  ' + kind + ': "' + oldName + '" -> "' + target + '"'); (kind === 'renamed' ? CHANGES++ : FLAGS++); }
  catch (e) { LOG.push('  !! failed "' + oldName + '": ' + e.message); }
}
function flag(msg) { LOG.push(msg); FLAGS++; }
function openFolder(id) { try { return DriveApp.getFolderById(id); } catch (e) { LOG.push('  !! cannot open ' + id); return null; } }
function stripExt(n) { var i = n.lastIndexOf('.'); return i > 0 ? n.substring(0, i) : n; }
function sanitize(s) { return s.replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); }
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function uniqueIn(folder, target, self) {
  var out = target, k = 1;
  while (taken(folder, out, self)) { k++; out = target + '_' + k; }
  return out;
}
function taken(folder, name, self) {
  var it = folder.getFilesByName(name);
  while (it.hasNext()) { if (it.next().getId() !== self.getId()) return true; }
  return false;
}
