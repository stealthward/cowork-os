/**
 * FIVE STAR FINANCE DASHBOARD  -- Code.gs
 *
 * The finance department's single console. No one opens Apps Script.
 *   FILE     -- drop a document; Claude reads it; confirm; it's named and filed.
 *   SWEEP    -- scan folders for unnamed files. Preview, then Apply.
 *   QC       -- pending RENAME files, recent activity.
 *   SETTINGS -- add vendors / rules, with validation. Admins only.
 *
 * The "Finance Filing Rules" Sheet is the source of truth. The dashboard is the only
 * sanctioned way to edit it. Nothing is written without an explicit human click.
 *
 * SETUP
 *   Script Properties:  ANTHROPIC_API_KEY = sk-ant-...
 *   Deploy > New deployment > Web app  (Execute as: Me)
 */

var RULES_SHEET_ID = '1v90dN7akcuirp6E0ynqZhfpMzOsNH7_pNAxN6Rtm3Ds';
var FINANCE_ROOT   = '1B31ALr30hdpYme255GiMuPbSDl8upuLU';
var MODEL          = 'claude-sonnet-4-6';
var MIN_YEAR       = 2026;

var ADMINS = ['brett@brettward.net', 'felicia@brettward.net'];   // only these can change settings
var TYPES  = ['BANK','CC','EXP','AR','REC','REG','FIN','COMM','PAY','TAX','AUDIT','CORP','CPA','LOAN'];
var SKIP_FOLDER = /archive|Invoices and Checks/i;

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Five Star Finance')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
function isAdmin() {
  var e = (Session.getActiveUser().getEmail() || '').toLowerCase();
  return ADMINS.indexOf(e) >= 0;
}
function getBootstrap() {
  return { admin: isAdmin(), user: Session.getActiveUser().getEmail(), dests: getDestinations() };
}

/* ======================= CONFIG ======================= */

function getConfig() {
  var ss = SpreadsheetApp.openById(RULES_SHEET_ID);
  var rv = ss.getSheetByName('Rules').getDataRange().getValues(); rv.shift();
  var rules = rv.filter(function (r) { return r[3]; }).map(function (r, i) {
    return { row: i + 2, active: String(r[0]).trim().toUpperCase(), num: String(r[1]).trim(), name: r[2],
             folderId: String(r[3]).trim(), depth: String(r[4]), entity: String(r[5]).trim(),
             type: String(r[6]).trim().toUpperCase(), descSrc: String(r[7]).trim(), dateSrc: String(r[8]).trim() };
  });
  var vv = ss.getSheetByName('Vendors').getDataRange().getValues(); vv.shift();
  var vendors = vv.filter(function (r) { return r[0]; }).map(function (r, i) {
    return { row: i + 2, match: String(r[0]).trim(), token: String(r[1]).trim(), acctRule: String(r[2]).trim() };
  });
  return { rules: rules, vendors: vendors };
}

function getDestinations() {
  return getConfig().rules.filter(function (r) { return r.active === 'YES'; })
    .map(function (r) { return { num: r.num, name: r.name, type: r.type, folderId: r.folderId }; });
}

/* ======================= ANALYZE (upload) ======================= */

function analyzeUpload(b64, name, mime) {
  try {
    var cfg = getConfig();
    var guess = guessFromFilename(name, cfg);
    var ai = null;

    if (mime === 'application/pdf') {           // always read the document; a filename cannot classify
      ai = extractWithClaude(b64);
      if (ai && ai.error) guess.aiError = ai.error;
      else if (ai) guess = mergeAi(guess, ai, cfg);
    }

    var dest = resolveDestination(guess, cfg);
    var proposed = buildName(guess);
    if (proposed && dest.folderId) proposed = uniqueName(dest, proposed);

    return { ok: true, original: name, detected: guess, proposedName: proposed, destination: dest,
             confidence: guess.confidence || (guess.descriptor && guess.date ? 'high' : 'low'),
             docType: guess.docType || '', classConfidence: guess.classConfidence || '',
             needsReview: !proposed || !dest.folderId,
             source: (ai && !ai.error) ? 'claude' : 'filename' };
  } catch (e) { return { ok: false, error: String(e) }; }
}

/** Claude reads the PDF. Retries on transient overload (429/529/5xx). */
function extractWithClaude(b64) {
  var key = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!key) return { error: 'No ANTHROPIC_API_KEY in Script Properties' };

  var prompt =
    'You are reading a financial document for Five Star Escrow ("FSE"). Every document here has ALREADY been paid.\n' +
    'Return ONLY a JSON object, no prose, no markdown fences:\n' +
    '{"doc_type":"expense|bank_statement|credit_card_statement|financial_statement|reconciliation|commission_report|other",' +
    '"vendor":"issuing company, or null","invoice_number":"or null","account_number":"or null",' +
    '"date":"YYYY-MM-DD document date, or null","period":"YYYY-MM if a monthly statement, or null",' +
    '"confidence":"high|medium|low","classification_confidence":"high|medium|low"}\n' +
    'doc_type "expense" covers any vendor invoice, bill, receipt, or vendor account statement.\n' +
    '"confidence" = how clearly you could read the text. "classification_confidence" = how sure you are of doc_type.\n' +
    'If a field is not clearly present use null. Never invent values.';

  var payload = { model: MODEL, max_tokens: 1000, messages: [{ role: 'user', content: [
    { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: b64 } },
    { type: 'text', text: prompt }] }] };

  for (var attempt = 0; attempt < 4; attempt++) {
    try {
      var res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
        method: 'post', contentType: 'application/json',
        headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        payload: JSON.stringify(payload), muteHttpExceptions: true });
      var code = res.getResponseCode();
      if (code === 200) {
        var data = JSON.parse(res.getContentText());
        var text = (data.content || []).filter(function (c) { return c.type === 'text'; })
                                       .map(function (c) { return c.text; }).join('\n');
        return JSON.parse(text.replace(/```json|```/g, '').trim());
      }
      if (code === 429 || code === 529 || code >= 500) { Utilities.sleep(1200 * Math.pow(2, attempt)); continue; }
      return { error: 'API ' + code + ': ' + res.getContentText().slice(0, 200) };
    } catch (e) { if (attempt === 3) return { error: String(e) }; Utilities.sleep(1200 * Math.pow(2, attempt)); }
  }
  return { error: 'Anthropic is busy right now. Try again in a moment.' };
}

function mergeAi(guess, ai, cfg) {
  var map = { expense: 'EXP', bank_statement: 'BANK', credit_card_statement: 'CC',
              financial_statement: 'FIN', reconciliation: 'REC', commission_report: 'COMM' };
  if (ai.doc_type && map[ai.doc_type]) guess.type = map[ai.doc_type];   // the document wins over the filename
  if (ai.period) guess.date = ai.period;
  else if (ai.date) guess.date = String(ai.date).slice(0, 7);
  if (ai.vendor) {
    var tok = matchVendor(ai.vendor, cfg.vendors) ||
              String(ai.vendor).replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    // Stable key only where the vendor supplies one (First American). Otherwise plain vendor; collisions get _1/_2.
    if (/first american/i.test(ai.vendor) && ai.account_number)
      tok = 'First-American_' + ai.account_number + (ai.invoice_number ? '_' + ai.invoice_number : '');
    guess.descriptor = tok;
  }
  guess.confidence = ai.confidence || 'medium';
  guess.classConfidence = ai.classification_confidence || 'medium';
  guess.docType = ai.doc_type || '';
  return guess;
}

/* ======================= RULES ======================= */

function guessFromFilename(name, cfg) {
  var base = stripExt(name), g = { entity: 'FSE', type: '', date: '', descriptor: '' };
  if (/stmt|statement/i.test(base) && /chase|capital|cap one/i.test(base)) g.type = 'CC';
  else if (/stmt|statement/i.test(base) && /trust|savings|general|cbt/i.test(base)) g.type = 'BANK';
  else if (/recon/i.test(base)) g.type = 'REC';
  else if (/commission|werevive|we revive/i.test(base)) g.type = 'COMM';
  else if (/compilation|financial statement/i.test(base)) g.type = 'FIN';
  else g.type = 'EXP';
  g.date = monthFrom(base);
  if (g.type === 'EXP') { var v = matchVendor(base, cfg.vendors); if (v) g.descriptor = v; }
  return g;
}

function matchVendor(text, vendors) {
  var lo = String(text).toLowerCase();
  for (var i = 0; i < vendors.length; i++) {
    var v = vendors[i]; if (!v.match) continue;
    if (v.acctRule && v.acctRule.indexOf('ACCT_FROM_FILENAME:') === 0) {
      var accts = v.acctRule.substring(19).split('|');
      for (var a = 0; a < accts.length; a++) {
        var mm = String(text).match(new RegExp('\\b' + accts[a] + '[_-]?(\\d+)?'));
        if (mm) return v.token + '_' + accts[a] + (mm[1] ? '_' + mm[1] : '');
      }
    }
    if (lo.indexOf(v.match.toLowerCase()) >= 0) {
      if (v.acctRule && v.acctRule.indexOf('ACCT_FROM_FILENAME:') === 0) {
        var ac = v.acctRule.substring(19).split('|');
        return v.token + '_' + (/software/i.test(text) ? ac[1] : ac[0]);
      }
      return v.token;
    }
  }
  return '';
}

function buildName(g) {
  if (!g.date || !g.type) return '';
  var p = [g.date, g.entity, g.type];
  if (g.descriptor) p.push(g.descriptor);
  return p.join('_');
}

function resolveDestination(g, cfg) {
  var rule = null;
  for (var i = 0; i < cfg.rules.length; i++)
    if (cfg.rules[i].active === 'YES' && cfg.rules[i].type === g.type) { rule = cfg.rules[i]; break; }
  if (!rule) return { path: '', folderId: '', note: 'No active rule for type "' + g.type + '" - add one in Settings' };
  if (!g.date) return { path: '', folderId: '', note: 'No date found - choose a destination' };

  var year = g.date.slice(0, 4), month = g.date.slice(0, 7), base = rule.num + ' ' + rule.name;
  if (g.type === 'EXP')  return { path: base + '/' + year + '/' + month, folderId: rule.folderId, sub: [year, month] };
  if (g.type === 'BANK' || g.type === 'CC') {
    var acct = g.descriptor || '';
    return { path: base + '/' + (acct || '[account]') + '/' + year, folderId: rule.folderId,
             sub: acct ? [acct, year] : [], note: acct ? '' : 'Pick the account folder' };
  }
  if (g.type === 'COMM') {
    var sub = /werevive/i.test(g.descriptor || '')
      ? ['FSE Partners', 'Partner Reports', 'We Revive Reports', year] : ['Sales Commission Reports', year];
    return { path: base + '/' + sub.join('/'), folderId: rule.folderId, sub: sub };
  }
  return { path: base + '/' + year, folderId: rule.folderId, sub: [year] };
}

/** Append _1/_2 only when a same-named file already exists in the destination. */
function uniqueName(dest, name) {
  try {
    var f = DriveApp.getFolderById(dest.folderId);
    for (var i = 0; i < (dest.sub || []).length; i++) {
      var it = f.getFoldersByName(dest.sub[i]);
      if (!it.hasNext()) return name;                    // folder not created yet -> no collision possible
      f = it.next();
    }
    if (!f.getFilesByName(name).hasNext()) return name;
    var inc = f.getFilesByName(name);                    // first collision: rename incumbent to _1
    if (inc.hasNext()) { var x = inc.next(); if (!/_\d+$/.test(x.getName())) x.setName(name + '_1'); }
    var k = 2; while (f.getFilesByName(name + '_' + k).hasNext()) k++;
    return name + '_' + k;
  } catch (e) { return name; }
}

/* ======================= COMMIT ======================= */

function commitUpload(b64, mime, finalName, folderId, subPath) {
  try {
    var folder = DriveApp.getFolderById(folderId);
    (subPath || []).forEach(function (seg) { folder = childFolder(folder, seg); });
    var file = folder.createFile(Utilities.newBlob(Utilities.base64Decode(b64), mime, finalName));
    file.setName(finalName);
    logActivity(finalName, folder.getName());
    return { ok: true, url: file.getUrl(), folder: folder.getName() };
  } catch (e) { return { ok: false, error: String(e) }; }
}
function childFolder(p, n) { var it = p.getFoldersByName(n); return it.hasNext() ? it.next() : p.createFolder(n); }

/* ======================= SWEEP (on demand, not a trigger) ======================= */

function runSweep(apply) {
  var cfg = getConfig(), out = [], stats = { renamed: 0, flagged: 0, skipped: 0 };
  cfg.rules.forEach(function (r) {
    if (r.active !== 'YES' || !r.folderId) return;
    var root = openFolder(r.folderId); if (!root) return;
    sweepFolder(root, r, cfg, [], out, stats, apply);
  });
  return { ok: true, apply: !!apply, items: out.slice(0, 300), stats: stats };
}

function sweepFolder(folder, rule, cfg, anc, out, stats, apply) {
  if (SKIP_FOLDER.test(folder.getName())) return;
  var files = folder.getFiles();
  while (files.hasNext()) {
    var f = files.next(), name = f.getName();
    if (isCanonical(name)) { stats.skipped++; continue; }
    var ctxYear = nearestYear(anc.concat([folder.getName()])) || (name.match(/\b(20\d{2})\b/) || [])[1];
    if (ctxYear && parseInt(ctxYear, 10) < MIN_YEAR) { stats.skipped++; continue; }

    var date = sweepDate(rule.dateSrc, name, folder, anc);
    if (!date) { stats.skipped++; continue; }
    var desc = sweepDesc(rule, name, folder, anc, cfg);
    var target = date + '_' + rule.entity + '_' + rule.type + (desc ? '_' + desc : '');
    var flagged = false;
    if (rule.descSrc !== 'NONE' && !desc) {
      target = date + '_' + rule.entity + '_' + rule.type + '_RENAME_' + sanitize(stripExt(name));
      flagged = true;
    }
    if (name === target) { stats.skipped++; continue; }

    var k = 1, t = target;
    while (nameTaken(folder, t, f)) { k++; t = target + '_' + k; }
    var item = { from: name, to: t, folder: folder.getName(), flagged: flagged };
    if (apply) { try { f.setName(t); } catch (e) { item.error = String(e); } }
    out.push(item);
    flagged ? stats.flagged++ : stats.renamed++;
  }
  var subs = folder.getFolders();
  while (subs.hasNext()) {
    var s = subs.next();
    if (!SKIP_FOLDER.test(s.getName())) sweepFolder(s, rule, cfg, anc.concat([folder.getName()]), out, stats, apply);
  }
}

function sweepDate(src, name, parent, anc) {
  var pn = parent.getName();
  if (src === 'FOLDER_MONTH') return /^20\d{2}-\d{2}$/.test(pn) ? pn : null;
  if (src === 'FOLDER_YEAR')  return /^20\d{2}$/.test(pn) ? pn : nearestYear(anc);
  if (src === 'FILENAME_YEAR') { var yy = name.match(/\b(20\d{2})\b/); return yy ? yy[1] : nearestYear(anc.concat([pn])); }
  return monthFrom(name);
}
function sweepDesc(rule, name, parent, anc, cfg) {
  var src = rule.descSrc;
  if (src === 'NONE') return '';
  if (src === 'FOLDER_ACCT' || src === 'FOLDER_PARENT') return partnerToken(nearestNonYear(anc.concat([parent.getName()])));
  if (src === 'VENDOR') return matchVendor(stripExt(name), cfg.vendors);
  if (src.indexOf('FIXED:') === 0) {
    var fx = src.substring(6);
    if (anc.concat([parent.getName()]).join('/').toLowerCase().indexOf('carlsbad') >= 0) fx += '-Carlsbad';
    return fx;
  }
  return '';
}
function partnerToken(s) {
  if (!s) return '';
  s = s.replace(/\bReports?\b/gi, '').replace(/\bClosed\b/gi, '').replace(/[-\s]*20\d{2}\b/g, '')
       .replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (/we\s*revive/i.test(s)) return 'WeRevive';
  if (/sales commission/i.test(s)) return 'Sales';
  return s.replace(/\s+/g, '-');
}

/* ======================= QC ======================= */

function getQcData() { return { pending: findPending(), recent: getRecent() }; }
function findPending() {
  var out = [], it = DriveApp.searchFiles('title contains "RENAME" and trashed = false'), n = 0;
  while (it.hasNext() && n < 100) {
    var f = it.next(); n++;
    if (f.getName().indexOf('_RENAME_') < 0) continue;
    var p = f.getParents();
    out.push({ name: f.getName(), url: f.getUrl(), folder: p.hasNext() ? p.next().getName() : '' });
  }
  return out;
}
function getRecent() { var r = PropertiesService.getScriptProperties().getProperty('RECENT_ACTIVITY'); return r ? JSON.parse(r).slice(0, 15) : []; }
function logActivity(name, folder) {
  var p = PropertiesService.getScriptProperties(), l = getRecent();
  l.unshift({ name: name, folder: folder, at: new Date().toISOString() });
  p.setProperty('RECENT_ACTIVITY', JSON.stringify(l.slice(0, 30)));
}

/* ======================= SETTINGS (admins only) ======================= */

function getSettings() {
  if (!isAdmin()) return { ok: false, error: 'Not authorized' };
  var cfg = getConfig();
  return { ok: true, rules: cfg.rules, vendors: cfg.vendors, types: TYPES, folders: listFinanceFolders() };
}

/** Folder picker source -- nobody types a folder ID. */
function listFinanceFolders() {
  var out = [], it = DriveApp.getFolderById(FINANCE_ROOT).getFolders();
  while (it.hasNext()) { var f = it.next(); out.push({ id: f.getId(), name: f.getName() }); }
  return out.sort(function (a, b) { return a.name.localeCompare(b.name); });
}

function addVendor(match, token, acctRule) {
  if (!isAdmin()) return { ok: false, error: 'Not authorized' };
  match = String(match || '').trim().toLowerCase();
  token = String(token || '').trim().replace(/\s+/g, '-');
  if (!match || !token) return { ok: false, error: 'Both a match phrase and a token are required.' };
  var cfg = getConfig();
  for (var i = 0; i < cfg.vendors.length; i++) {
    if (cfg.vendors[i].match.toLowerCase() === match) return { ok: false, error: 'That match phrase already exists.' };
    if (cfg.vendors[i].token.toLowerCase() === token.toLowerCase())
      return { ok: false, error: 'Token "' + token + '" is already used by "' + cfg.vendors[i].match + '".' };
  }
  SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Vendors')
    .appendRow([match, token, String(acctRule || '').trim(), 'added via dashboard ' + new Date().toISOString().slice(0, 10)]);
  return { ok: true };
}

function setRuleActive(row, active) {
  if (!isAdmin()) return { ok: false, error: 'Not authorized' };
  SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Rules').getRange(row, 1).setValue(active ? 'YES' : 'NO');
  return { ok: true };
}

function addRule(r) {
  if (!isAdmin()) return { ok: false, error: 'Not authorized' };
  if (!r.folderId) return { ok: false, error: 'Choose a folder.' };
  var type = String(r.type || '').toUpperCase();
  if (TYPES.indexOf(type) < 0) return { ok: false, error: 'Type must be one of: ' + TYPES.join(', ') };
  try { DriveApp.getFolderById(r.folderId); } catch (e) { return { ok: false, error: 'That folder does not exist or is not accessible.' }; }
  var cfg = getConfig();
  for (var i = 0; i < cfg.rules.length; i++)
    if (cfg.rules[i].active === 'YES' && cfg.rules[i].type === type)
      return { ok: false, error: 'Type "' + type + '" is already claimed by ' + cfg.rules[i].num + ' ' + cfg.rules[i].name + '. Deactivate that rule first.' };
  SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Rules')
    .appendRow(['YES', r.num || '', r.name || '', r.folderId, r.depth || '', 'FSE', type,
                r.descSrc || 'NONE', r.dateSrc || 'FILENAME_MONTH',
                'added via dashboard ' + new Date().toISOString().slice(0, 10)]);
  return { ok: true };
}

/** Health check -- run after any change. */
function validateConfig() {
  var cfg = getConfig(), issues = [], claimed = {};
  cfg.rules.forEach(function (r) {
    if (r.active !== 'YES') return;
    try { DriveApp.getFolderById(r.folderId); }
    catch (e) { issues.push({ level: 'error', msg: 'Rule ' + r.num + ' ' + r.name + ': folder not found or no access.' }); }
    if (TYPES.indexOf(r.type) < 0) issues.push({ level: 'error', msg: 'Rule ' + r.num + ': type "' + r.type + '" is not in the approved list.' });
    if (claimed[r.type]) issues.push({ level: 'error', msg: 'Type "' + r.type + '" is claimed by both rule ' + claimed[r.type] + ' and ' + r.num + '.' });
    else claimed[r.type] = r.num;
    if (r.entity !== 'FSE' && r.entity !== 'RTM') issues.push({ level: 'warn', msg: 'Rule ' + r.num + ': entity "' + r.entity + '" is unusual.' });
  });
  var seen = {};
  cfg.vendors.forEach(function (v) {
    if (!v.token) { issues.push({ level: 'error', msg: 'Vendor "' + v.match + '" has no token.' }); return; }
    var t = v.token.toLowerCase();
    if (seen[t]) issues.push({ level: 'warn', msg: 'Vendor token "' + v.token + '" is used more than once.' });
    seen[t] = 1;
  });
  if (!PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY'))
    issues.push({ level: 'error', msg: 'ANTHROPIC_API_KEY is not set. Documents cannot be read.' });
  return { ok: true, issues: issues, ruleCount: cfg.rules.length, vendorCount: cfg.vendors.length };
}

/* ======================= one-time maintenance ======================= */
/** Sweep _FSE_AP_ -> _FSE_EXP_ on already-renamed files. Preview first. */
function migrateApToExp(apply) {
  var out = [], it = DriveApp.searchFiles('title contains "_FSE_AP_" and trashed = false'), n = 0;
  while (it.hasNext() && n < 500) {
    var f = it.next(); n++;
    var old = f.getName();
    if (old.indexOf('_FSE_AP_') < 0) continue;
    var neu = old.replace('_FSE_AP_', '_FSE_EXP_');
    out.push({ from: old, to: neu });
    if (apply) { try { f.setName(neu); } catch (e) { out[out.length - 1].error = String(e); } }
  }
  return { ok: true, apply: !!apply, items: out, count: out.length };
}

/* ======================= utils ======================= */
function openFolder(id) { try { return DriveApp.getFolderById(id); } catch (e) { return null; } }
function isCanonical(n) { return /^20\d{2}(-\d{2}){0,2}_(FSE|RTM)_[A-Z]{2,5}(_|$)/.test(n); }
function stripExt(n) { var i = n.lastIndexOf('.'); return i > 0 ? n.substring(0, i) : n; }
function sanitize(s) { return s.replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); }
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function nearestYear(l) { for (var i = l.length - 1; i >= 0; i--) if (/^20\d{2}$/.test(l[i])) return l[i]; return null; }
function nearestNonYear(l) { for (var i = l.length - 1; i >= 0; i--) if (!/^20\d{2}(-\d{2})?$/.test(l[i])) return l[i]; return null; }
function nameTaken(folder, name, self) {
  var it = folder.getFilesByName(name);
  while (it.hasNext()) if (it.next().getId() !== self.getId()) return true;
  return false;
}
function monthFrom(s) {
  var m = s.match(/\b(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{2,4})\b/);
  if (m && +m[1] >= 1 && +m[1] <= 12) return (String(m[3]).length === 2 ? '20' + m[3] : m[3]) + '-' + pad(+m[1]);
  m = s.match(/\b(\d{1,2})-(\d{2})\b/);
  if (m && +m[1] >= 1 && +m[1] <= 12) return '20' + m[2] + '-' + pad(+m[1]);
  var names = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  var lo = s.toLowerCase(), y = s.match(/\b(20\d{2})\b/);
  for (var i = 0; i < 12; i++) if (lo.indexOf(names[i].substring(0, 3)) >= 0 && y) return y[1] + '-' + pad(i + 1);
  return null;
}
