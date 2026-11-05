/**
 * FINANCE FILING ENGINE (Sheet-driven)
 * One watcher for the ENTIRE Five Star Finance tree. Reads its rules from the
 * "Finance Filing Rules" Sheet in 00 Reference -- no folder logic lives in this code.
 *
 * HOW IT WORKS
 *   Drop the ORIGINAL downloaded file into the right folder. Don't rename it.
 *   The engine finds it, derives date + descriptor per the Rules tab, and renames it to:
 *       YYYY-MM_ENTITY_TYPE_Descriptor        (or YYYY / YYYY-MM-DD per Date Source)
 *   If it can't derive a descriptor, it does NOT guess -- it flags:
 *       2026-05_FSE_AP_RENAME_original-name
 *   Search Drive for "RENAME" to find everything pending.
 *
 * SETUP
 *   1. Run buildRulesSheet() (separate script) once. Copy the Sheet ID below.
 *   2. Paste that ID into RULES_SHEET_ID.
 *   3. Leave DRY_RUN = true, run watchOnce(), read the log Sheet.
 *   4. Set DRY_RUN = false, then run setUp() once to install the hourly trigger.
 *   To stop: removeTriggers().
 *
 * Adding a folder, vendor, or record type = edit the Sheet. Never this file.
 */

var DRY_RUN = true;
var RULES_SHEET_ID = '';                 // <-- paste the Finance Filing Rules Sheet ID
var NOTIFY_EMAIL   = '';                 // optional: emailed only when something changes
var LOG_TO_SHEET   = true;

var SKIP_FOLDER = /archive/i;            // never touch archive subtrees
var MAX_FILES = 5000;

// ---------- triggers ----------
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
  LOG.length = 0; STATS = { renamed: 0, flagged: 0, skipped: 0, errors: 0 };
  log('FILING ENGINE - DRY_RUN=' + DRY_RUN + '  ' + new Date().toISOString());

  var cfg = loadConfig();
  if (!cfg) { log('!! could not load rules sheet'); finish(); return; }

  cfg.rules.forEach(function (r) {
    if (r.active !== 'YES' || !r.folderId) return;
    var root = openFolder(r.folderId);
    if (!root) { log('!! cannot open ' + r.folderNum + ' ' + r.folderName); return; }
    log('--- ' + r.folderNum + ' ' + r.folderName + ' ---');
    walk(root, r, cfg, 0, []);
  });

  finish();
}

/** Recursively walk a rule's folder, renaming files at any depth (archives skipped). */
function walk(folder, rule, cfg, depth, ancestry) {
  if (STATS.renamed + STATS.flagged + STATS.skipped > MAX_FILES) return;
  if (SKIP_FOLDER.test(folder.getName())) return;

  var files = folder.getFiles();
  while (files.hasNext()) handleFile(files.next(), folder, rule, cfg, ancestry);

  var subs = folder.getFolders();
  while (subs.hasNext()) {
    var sub = subs.next();
    if (SKIP_FOLDER.test(sub.getName())) continue;
    walk(sub, rule, cfg, depth + 1, ancestry.concat([folder.getName()]));
  }
}

function handleFile(f, parent, rule, cfg, ancestry) {
  var name = f.getName();
  if (isCanonical(name)) { STATS.skipped++; return; }

  var date = resolveDate(rule.dateSource, name, parent, ancestry);
  if (!date) { log('  ? no date for "' + name + '" in ' + parent.getName()); STATS.flagged++; return; }

  var desc = resolveDescriptor(rule, name, parent, ancestry, cfg);
  var target = date + '_' + rule.entity + '_' + rule.type + (desc ? '_' + desc : '');
  var flagged = false;
  if (rule.descriptorSource !== 'NONE' && !desc) {
    target = date + '_' + rule.entity + '_' + rule.type + '_RENAME_' + sanitize(stripExt(name));
    flagged = true;
  }
  target = uniqueIn(parent, target, f);
  if (name === target) { STATS.skipped++; return; }

  if (DRY_RUN) {
    log('  ' + (flagged ? 'FLAG ' : 'RENAME') + ' "' + name + '" -> "' + target + '"');
    flagged ? STATS.flagged++ : STATS.renamed++;
    return;
  }
  try {
    f.setName(target);
    log('  ' + (flagged ? 'flagged' : 'renamed') + ' "' + name + '" -> "' + target + '"');
    flagged ? STATS.flagged++ : STATS.renamed++;
  } catch (e) { log('  !! "' + name + '": ' + e.message); STATS.errors++; }
}

// ---------- date resolution ----------
function resolveDate(src, name, parent, ancestry) {
  var pn = parent.getName();
  switch (src) {
    case 'FOLDER_MONTH': return /^20\d{2}-\d{2}$/.test(pn) ? pn : null;
    case 'FOLDER_YEAR':  return /^20\d{2}$/.test(pn) ? pn : nearestYear(ancestry);
    case 'FILENAME_MONTH': return fileMonth(name, parent, ancestry);
    case 'FILENAME_YEAR':  var y = name.match(/\b(20\d{2})\b/); return y ? y[1] : nearestYear(ancestry.concat([pn]));
    case 'FILENAME_DATE':  return fileDate(name);
    default: return null;
  }
}

function nearestYear(list) {
  for (var i = list.length - 1; i >= 0; i--) if (/^20\d{2}$/.test(list[i])) return list[i];
  return null;
}

/** month from filename ("05-26", "05.16.26", "May 26", "May 2026"), year from folder if needed */
function fileMonth(name, parent, ancestry) {
  var year = nearestYear(ancestry.concat([parent.getName()]));
  var mm = null;
  var m = name.match(/\b(\d{1,2})[.\-](\d{1,2})[.\-](\d{2,4})\b/);
  if (m && +m[1] >= 1 && +m[1] <= 12) { mm = pad(+m[1]); if (!year) year = expandYear(m[3]); }
  if (!mm) { m = name.match(/\b(\d{1,2})-(\d{2})\b/); if (m && +m[1] >= 1 && +m[1] <= 12) { mm = pad(+m[1]); if (!year) year = expandYear(m[2]); } }
  if (!mm) {
    var names = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    var lo = name.toLowerCase();
    for (var i = 0; i < 12; i++) if (lo.indexOf(names[i].substring(0,3)) >= 0) { mm = pad(i+1); break; }
  }
  if (!year) { var y = name.match(/\b(20\d{2})\b/); if (y) year = y[1]; }
  return (mm && year) ? (year + '-' + mm) : null;
}

function fileDate(name) {
  var m = name.match(/\b(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{2,4})\b/);
  if (m && +m[1] <= 12) return expandYear(m[3]) + '-' + pad(+m[1]) + '-' + pad(+m[2]);
  m = name.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (m) return m[1] + '-' + m[2] + '-' + m[3];
  return null;
}
function expandYear(y) { return y.length === 2 ? '20' + y : y; }

// ---------- descriptor resolution ----------
function resolveDescriptor(rule, name, parent, ancestry, cfg) {
  switch (rule.descriptorSource) {
    case 'NONE':          return '';
    case 'FOLDER_ACCT':   return token(nearestNonYear(ancestry.concat([parent.getName()])));
    case 'FOLDER_PARENT': return token(nearestNonYear(ancestry.concat([parent.getName()])));
    case 'VENDOR':        return matchVendor(stripExt(name), cfg.vendors);
    case 'FILENAME':      return cleanFilename(stripExt(name));
    default:
      if (rule.descriptorSource.indexOf('FIXED:') === 0) {
        var fixed = rule.descriptorSource.substring(6);
        var path = ancestry.concat([parent.getName()]).join('/').toLowerCase();
        if (path.indexOf('carlsbad') >= 0) fixed = fixed + '-Carlsbad';
        return fixed;
      }
      return '';
  }
}
function nearestNonYear(list) {
  for (var i = list.length - 1; i >= 0; i--) if (!/^20\d{2}(-\d{2})?$/.test(list[i])) return list[i];
  return null;
}

function matchVendor(base, vendors) {
  for (var i = 0; i < vendors.length; i++) {
    var v = vendors[i];
    if (!v.match) continue;
    if (base.toLowerCase().indexOf(v.match.toLowerCase()) >= 0 || acctPrefixHit(base, v)) {
      if (v.acctRule && v.acctRule.indexOf('ACCT_FROM_FILENAME:') === 0) {
        var accts = v.acctRule.substring(19).split('|');
        for (var a = 0; a < accts.length; a++) {
          var re = new RegExp('\\b' + accts[a] + '[_-]?(\\d+)?');
          var m = base.match(re);
          if (m) return v.token + '_' + accts[a] + (m[1] ? '_' + m[1] : '');
        }
        if (/software/i.test(base)) return v.token + '_' + accts[1];
        return v.token + '_' + accts[0];
      }
      return v.token;
    }
  }
  return cleanFilename(base);
}
function acctPrefixHit(base, v) {
  if (!v.acctRule || v.acctRule.indexOf('ACCT_FROM_FILENAME:') !== 0) return false;
  var accts = v.acctRule.substring(19).split('|');
  for (var i = 0; i < accts.length; i++) if (base.indexOf(accts[i]) === 0) return true;
  return false;
}

function cleanFilename(base) {
  var s = ' ' + base + ' ';
  s = s.replace(/\b\d{1,2}[.\-\/]\d{1,2}[.\-\/]\d{2,4}\b/g, ' ');
  s = s.replace(/\b\d{1,2}[.\-]\d{2}\b/g, ' ');
  s = s.replace(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{0,4}\b/gi, ' ');
  s = s.replace(/\b20\d{2}\b/g, ' ').replace(/_\d+/g, ' ').replace(/\b\d{3,}\b/g, ' ');
  s = s.replace(/[_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!s || !/[a-z]/i.test(s)) return '';
  if (/^(invoice|report|statement|receipt|payment|bill|scan|img|image|document|doc|file)$/i.test(s)) return '';
  return s.replace(/\s+/g, '-');
}

// ---------- config ----------
function loadConfig() {
  if (!RULES_SHEET_ID) return null;
  try {
    var ss = SpreadsheetApp.openById(RULES_SHEET_ID);
    var rv = ss.getSheetByName('Rules').getDataRange().getValues(); rv.shift();
    var rules = rv.filter(function (r) { return r[3]; }).map(function (r) {
      return { active: String(r[0]).trim().toUpperCase(), folderNum: r[1], folderName: r[2], folderId: String(r[3]).trim(),
               depth: r[4], entity: String(r[5]).trim(), type: String(r[6]).trim(),
               descriptorSource: String(r[7]).trim(), dateSource: String(r[8]).trim() };
    });
    var vv = ss.getSheetByName('Vendors').getDataRange().getValues(); vv.shift();
    var vendors = vv.filter(function (r) { return r[0]; }).map(function (r) {
      return { match: String(r[0]).trim(), token: String(r[1]).trim(), acctRule: String(r[2]).trim() };
    });
    return { rules: rules, vendors: vendors };
  } catch (e) { log('!! rules sheet: ' + e.message); return null; }
}

// ---------- plumbing ----------
var LOG = [], STATS = {};
function log(s) { LOG.push(s); Logger.log(s); }
function isCanonical(n) { return /^20\d{2}(-\d{2}){0,2}_(FSE|RTM)_[A-Z]{2,5}(_|$)/.test(n); }
function openFolder(id) { try { return DriveApp.getFolderById(id); } catch (e) { return null; } }
function stripExt(n) { var i = n.lastIndexOf('.'); return i > 0 ? n.substring(0, i) : n; }
function sanitize(s) { return s.replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); }
function token(s) { return s ? s.trim().replace(/\s+/g, '-') : ''; }
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
function finish() {
  var summary = 'renamed ' + STATS.renamed + ', flagged ' + STATS.flagged + ', skipped ' + STATS.skipped + ', errors ' + STATS.errors;
  log('DONE: ' + summary);
  if (LOG_TO_SHEET && (STATS.renamed || STATS.flagged || STATS.errors)) {
    var ss = SpreadsheetApp.create('Filing Engine Log - ' + (DRY_RUN ? 'DRY' : 'LIVE') + ' - ' + new Date().toISOString().slice(0,16));
    var rng = ss.getActiveSheet().getRange(1,1,LOG.length,1);
    rng.setNumberFormat('@'); rng.setValues(LOG.map(function (l) { return [l]; }));
    Logger.log('LOG SHEET: ' + ss.getUrl());
  }
  if (NOTIFY_EMAIL && (STATS.renamed || STATS.flagged || STATS.errors)) {
    MailApp.sendEmail(NOTIFY_EMAIL, 'Finance filing engine: ' + summary, LOG.join('\n'));
  }
}
