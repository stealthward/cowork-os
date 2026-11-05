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

var TYPES  = ['BANK','CC','EXP','AR','REC','REG','FIN','COMM','PAY','TAX','AUDIT','CORP','CPA','LOAN'];
var DESC_SOURCES = ['FOLDER_ACCT','FOLDER_PARENT','ACCOUNT','VENDOR','FILENAME','NONE'];
var DATE_SOURCES = ['FOLDER_MONTH','FOLDER_YEAR','FILENAME_MONTH','FILENAME_DATE','FILENAME_YEAR'];
var SKIP_FOLDER = /archive|Invoices and Checks/i;

function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
    .setTitle('Five Star Finance')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
// Access is governed by Google Workspace: the Shared Drive controls the files,
// and the web app deployment controls who can open this page. No second gate here.
function getBootstrap() {
  var user = '';
  try { user = Session.getActiveUser().getEmail() || ''; } catch (e) {}
  return { user: user, dests: getDestinations(), accounts: listAccountFolders() };
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

/* ======================= ACCOUNTS (closed set) ======================= */

/**
 * The canonical account list. This exact token is used in THREE places -- the QuickBooks
 * account name, the Drive folder name, and the file name -- so they can never drift apart.
 * Every account carries its last 4: that is the account's real identity, and it means a
 * recon or register identifies itself without any name matching at all.
 */
var ACCOUNTS = [
  { token: 'CBT-General-5427',   last4: '5427',
    phrases: 'cbt general 5427|cbt general|general account|ca bank & trust|ca bank and trust|cbt operating',
    note: 'Operating account. The bank calls it the General Account.' },
  { token: 'CBT-Trust-7355',     last4: '7355',
    phrases: 'cbt trust 7355|cbt trust|trust account|escrow trust',
    note: 'Escrow trust account. Never match on "trust" alone.' },
  { token: 'CBT-Savings-2274',   last4: '2274',
    phrases: 'cbt savings 2274|new savings 2274|new savings', note: 'Savings' },
  { token: 'CBT-Savings-0678',   last4: '0678',
    phrases: 'cbt savings 0678|cbt savings', note: 'Savings' },
  { token: 'Chase-Sapphire-0083', last4: '0083',
    phrases: 'chase sapphire 0083|chase sapphire|new chase cc|chase', note: 'Credit card' },
  { token: 'Capital-One-1210',   last4: '1210',
    phrases: 'capital one 1210|capital one|cap one|capitalone|spark miles', note: 'Credit card' }
];

/** Punctuation- and case-insensitive key, so "Chase Sapphire" == "Chase-Sapphire". */
function acctKey(s) { return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }

/** The descriptor written into a filename: folder name with spaces turned into hyphens. */
function acctToken(name) { return String(name).trim().replace(/\s+/g, '-'); }

/** Find a folder by its token, treating spaces and hyphens as equal. */
function byName(folders, name) {
  var n = acctKey(name);
  for (var i = 0; i < folders.length; i++) if (acctKey(folders[i].name) === n) return folders[i];
  return null;
}

/**
 * The real account folders under 01 and 02. This IS the closed set -- the dashboard never
 * invents an account. A statement's "vendor" is always the bank, so statements must be named
 * by account, matched against these folders.
 */
function listAccountFolders() {
  var cfg = getConfig(), out = [];
  cfg.rules.forEach(function (r) {
    if (r.type !== 'BANK' && r.type !== 'CC') return;
    if (r.active !== 'YES') return;
    var root = openFolder(r.folderId); if (!root) return;
    var it = root.getFolders();
    while (it.hasNext()) {
      var f = it.next();
      if (SKIP_FOLDER.test(f.getName())) continue;
      out.push({ id: f.getId(), name: f.getName(), type: r.type, parent: r.num + ' ' + r.name });
    }
  });
  return out;
}

/** Alias table from the Accounts tab: last-4 and phrases -> account token. */
function getAccountAliases() {
  var sh = SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Accounts');
  if (!sh) return [];                       // absence is reported by validateConfig, not hidden here
  var v = sh.getDataRange().getValues();
  if (v.length < 2) return [];
  v.shift();
  return v.filter(function (r) { return r[0]; }).map(function (r) {
    return { token: String(r[0]).trim(), last4: String(r[1]).trim().replace(/\D/g, ''), phrases: String(r[2]).trim() };
  });
}

/**
 * Which account is this? Matches what the document says against the REAL folders -- never a
 * guess, never an invention.
 *
 * The INSTITUTION is deliberately excluded: four accounts share "California Bank & Trust", and
 * the word "Trust" sits inside the operating account's own QuickBooks name, so the bank name
 * cannot identify an account. Only the account number and the account label may.
 *
 * Order: (1) any 4-digit run against the alias table's last-4, (2) a last-4 already inside a
 * folder name, (3) alias phrases with the MOST SPECIFIC winning -- a longer phrase beats a
 * shorter coincidental one, and a genuine tie between two accounts refuses.
 */
function matchAccount(ai, folders, aliases) {
  var raw = String(ai.account_number || '');
  var hay = ((ai.account_name || '') + ' ' + raw).toLowerCase();

  var runs = [];
  var digits = raw.replace(/\D/g, '');
  if (digits.length >= 4) { runs.push(digits.slice(-4)); runs.push(digits.slice(0, 4)); }
  var found = (raw + ' ' + (ai.account_name || '')).match(/\d{4}/g) || [];
  found.forEach(function (d) { if (runs.indexOf(d) < 0) runs.push(d); });

  // 1. last-4 against the alias table (the authoritative mapping)
  for (var r = 0; r < runs.length; r++)
    for (var i = 0; i < aliases.length; i++)
      if (aliases[i].last4 && aliases[i].last4 === runs[r]) {
        var f1 = byName(folders, aliases[i].token);
        if (f1) { f1.matchedOn = 'account ending ' + runs[r]; return f1; }
      }

  // 2. last-4 already present in a folder name (CBT-Savings-2274)
  for (var q = 0; q < runs.length; q++)
    for (var j = 0; j < folders.length; j++)
      if (folders[j].name.indexOf(runs[q]) >= 0) { folders[j].matchedOn = 'account ending ' + runs[q]; return folders[j]; }

  // 3. alias phrases against the account label, most specific wins
  var hayN = acctKey(hay);
  var hits = [];
  for (var k = 0; k < aliases.length; k++) {
    if (!aliases[k].phrases) continue;
    var ps = aliases[k].phrases.split('|');
    for (var p = 0; p < ps.length; p++) {
      var ph = ps[p].trim(), phN = acctKey(ph);
      if (phN && hayN.indexOf(phN) >= 0) hits.push({ token: aliases[k].token, phrase: ph, len: phN.length });
    }
  }
  if (hits.length) {
    hits.sort(function (a, b) { return b.len - a.len; });
    var best = hits[0];
    var tie = hits.filter(function (h) { return h.len === best.len && h.token !== best.token; });
    if (!tie.length) {
      var f2 = byName(folders, best.token);
      if (f2) { f2.matchedOn = '"' + best.phrase + '" in the account name'; return f2; }
    }
  }
  return null;
}

/** Creates or rewrites the Accounts tab from the canonical ACCOUNTS list above. */
function buildAccountsTab() {
  var ss = SpreadsheetApp.openById(RULES_SHEET_ID);
  var head = ['Account Token (must match the folder name)', 'Last 4', 'Also matches (a|b|c)', 'Notes'];
  var rows = ACCOUNTS.map(function (a) { return [a.token, a.last4, a.phrases, a.note]; });

  var sh = ss.getSheetByName('Accounts'), created = false;
  if (!sh) {
    sh = ss.insertSheet('Accounts');
    created = true;
  } else if (sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn() || head.length).clearContent();
  }
  sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold').setBackground('#e8eaed');
  sh.setFrozenRows(1);
  [320, 90, 420, 300].forEach(function (w, i) { sh.setColumnWidth(i + 1, w); });
  sh.getRange(2, 1, rows.length, head.length).setValues(rows);
  return { ok: true, note: (created ? 'Accounts tab created with ' : 'Accounts tab rewritten with ') + rows.length + ' accounts.' };
}

/* ======================= ANALYZE (upload) ======================= */

function analyzeUpload(b64, name, mime) {
  try {
    // Only PDFs can be read. A spreadsheet or an image would fall back to guessing from the file
    // name, which is exactly what mislabels records -- so it is refused instead.
    if (mime !== 'application/pdf')
      return { ok: true, original: name, detected: {}, proposedName: '', needsReview: true,
               destination: { path: '', folderId: '',
                 note: 'This is not a PDF, so the document cannot be read. Save it as a PDF, or file it in Drive by hand.' } };

    var cfg = getConfig();
    var guess = { entity: 'FSE', type: '', date: '', descriptor: '' };
    var ai = extractWithClaude(b64);
    if (ai && ai.error) guess.aiError = ai.error;
    else if (ai) guess = mergeAi(guess, ai, cfg);

    var dest = resolveDestination(guess, cfg);
    var proposed = buildName(guess);
    var collision = null;
    if (proposed && dest.folderId) {
      var existing = findExistingFile(dest, proposed);
      if (existing) collision = { existingId: existing.getId(), existingName: proposed,
                                  keepBothName: uniqueName(dest, proposed) };
    }

    return { ok: true, original: name, detected: guess, proposedName: proposed, destination: dest, collision: collision,
             confidence: guess.confidence || (guess.descriptor && guess.date ? 'high' : 'low'),
             docType: guess.docType || '', classConfidence: guess.classConfidence || '',
             needsReview: !proposed || !dest.folderId,
             accountPick: !!dest.accountPick,
             matchedOn: guess.matchedOn || '', readAccount: guess.readAccount || '',
             rawVendor: guess.rawVendor || '', knownVendor: !!guess.knownVendor,
             source: 'claude' };
  } catch (e) { return { ok: false, error: String(e) }; }
}

/** Claude reads the PDF. Retries on transient overload (429/529/5xx). */
function extractWithClaude(b64) {
  var key = PropertiesService.getScriptProperties().getProperty('ANTHROPIC_API_KEY');
  if (!key) return { error: 'No ANTHROPIC_API_KEY in Script Properties' };

  var prompt =
    'You are reading a finance document for Five Star Escrow ("FSE"), an escrow company in San Diego.\n' +
    'These are the bills, statements, and records FSE files. Whether a bill has been paid does\n' +
    'not matter -- paid and unpaid both belong here. A bill or statement is a document stating a\n' +
    'specific amount owed to or by a named payee. Quotes, estimates, proposals, engagement\n' +
    'letters, order confirmations, and informational notices are NOT bills.\n\n' +
    'Classify it as exactly one doc_type:\n' +
    '  expense_invoice      - a bill or invoice stating an amount owed, from ANY payee: a vendor,\n' +
    '                         a government or regulatory body (e.g. DFPI), a tax authority\n' +
    '                         (property tax, county, city), an attorney or court, or a utility.\n' +
    '                         Paid or unpaid. Usually has ONE invoice or bill number.\n' +
    '  vendor_statement     - an account summary from a payee. Lists SEVERAL invoice numbers or\n' +
    '                         none. Often stamped "NOT A BILL" or "statement of open balances".\n' +
    '  bank_statement       - issued BY a bank for one account (California Bank & Trust).\n' +
    '  credit_card_statement- issued BY a card company (Chase, Capital One).\n' +
    '  register             - a QuickBooks transaction register for ONE account: rows of\n' +
    '                         date / num / payee / amount / running balance.\n' +
    '  recon_summary        - a reconciliation showing only balances and totals\n' +
    '                         (beginning balance, cleared, ending balance). Usually one page.\n' +
    '  recon_detail         - a reconciliation LISTING each cleared and uncleared transaction.\n' +
    '                         Usually several pages.\n' +
    '  payroll_report       - a payroll run for a semi-monthly period (1st-15th, or 16th-end of month).\n' +
    '                         The check date is AFTER the period ends.\n' +
    '  financial_statement  - a monthly compilation from Landmark: balance sheet and P&L.\n' +
    '  commission_report    - a sales or partner commission report.\n' +
    '  mileage_report       - a mileage or vehicle-expense reimbursement report for a named\n' +
    '                         person over a period (e.g. from MileIQ). Shows miles and a value.\n' +
    '  other                - none of the above: quotes, estimates, proposals, engagement\n' +
    '                         letters, order confirmations, informational notices.\n\n' +
    'Return ONLY this JSON, no prose, no markdown fences:\n' +
    '{"doc_type":"<one of the above>",' +
    '"vendor":"the issuing company, agency, or bank, or null",' +
    '"person":"the person a mileage or reimbursement report is for, else null",' +
    '"invoice_numbers":["every invoice number on the document; [] if none"],' +
    '"account_number":"the bank/card account number, last 4 is enough, or null",' +
    '"account_name":"the account label used, e.g. General Account / Trust / Savings 2274, or null",' +
    '"customer_number":"a customer or account number the invoice is billed under, e.g. a Customer No. printed on a bill, else null",' +
    '"pay_period_start":"YYYY-MM-DD, payroll only, else null",' +
    '"pay_period_end":"YYYY-MM-DD, payroll only, else null",' +
    '"date":"YYYY-MM-DD document date, or null",' +
    '"period":"the single month the document covers as YYYY-MM, or null. For an annual or fiscal-year document with no one month, use the month it was issued or is due, never a year range",' +
    '"confidence":"high|medium|low",' +
    '"classification_confidence":"high|medium|low"}\n\n' +
    'Rules:\n' +
    '  List EVERY invoice number separately. Never join them into one string.\n' +
    '  For payroll, give the PERIOD COVERED, not the check date.\n' +
    '  For a bank or credit card statement, "period" is the month the statement CLOSES, not the month\n' +
    '  the billing cycle opens. A card cycle running May 15 to June 13 is a JUNE statement (2026-06).\n' +
    '  Use the closing/ending date of the cycle, not the opening date and not the payment due date.\n' +
    '  If a field is not clearly present use null. Never invent a value.';

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
        var parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
        var nums = (parsed.invoice_numbers || []).filter(function (n) { return n != null && String(n).trim() !== ''; });
        parsed.invoiceCount = nums.length;
        parsed.invoice_number = (nums.length === 1) ? nums[0] : null;   // one = key; none/many = statement
        return parsed;
      }
      if (code === 429 || code === 529 || code >= 500) { Utilities.sleep(1200 * Math.pow(2, attempt)); continue; }
      return { error: 'API ' + code + ': ' + res.getContentText().slice(0, 200) };
    } catch (e) { if (attempt === 3) return { error: String(e) }; Utilities.sleep(1200 * Math.pow(2, attempt)); }
  }
  return { error: 'Anthropic is busy right now. Try again in a moment.' };
}

function mergeAi(guess, ai, cfg) {
  var map = { expense_invoice: 'EXP', vendor_statement: 'EXP', mileage_report: 'EXP',
              bank_statement: 'BANK', credit_card_statement: 'CC', register: 'REG',
              recon_summary: 'REC', recon_detail: 'REC', payroll_report: 'PAY',
              financial_statement: 'FIN', commission_report: 'COMM' };
  if (ai.doc_type && map[ai.doc_type]) guess.type = map[ai.doc_type];   // the document wins over the filename
  var mo = monthOf(ai.period) || monthOf(ai.date);   // a real YYYY-MM only; a year range like 2026-2027 yields none
  if (mo) guess.date = mo;                            // no valid month -> no date -> the file goes to Needs a name
  // The descriptor depends on WHAT the document is. A bank statement's "vendor" is the bank,
  // so using it would collapse every CBT account into one name. Accounts are a closed set.
  var t = guess.type;
  if (t === 'BANK' || t === 'CC') {
    var acct = matchAccount(ai, listAccountFolders(), getAccountAliases());
    guess.descriptor = acct ? acctToken(acct.name) : '';
    guess.accountId = acct ? acct.id : '';
    guess.matchedOn = acct ? acct.matchedOn : '';
    guess.readAccount = ai.account_number || ai.account_name || '';
  } else if (t === 'REG' || t === 'REC') {
    var a2 = matchAccount(ai, listAccountFolders(), getAccountAliases());
    guess.account = a2 ? acctToken(a2.name) : '';
    guess.matchedOn = a2 ? a2.matchedOn : '';
    guess.readAccount = ai.account_number || ai.account_name || '';
    var isTrust = a2 && /trust/i.test(a2.name);   // trust recon (folder 06) is one artifact, no _Detail/_Summary
    var suffix = isTrust ? ''
               : (ai.doc_type === 'recon_detail') ? '_Detail'
               : (ai.doc_type === 'recon_summary') ? '_Summary' : '';
    guess.descriptor = a2 ? acctToken(a2.name) + suffix : '';
    guess.scopeSuffix = suffix;
    guess.needsAccount = !a2;
  } else if (t === 'PAY') {
    var p = payPeriod(ai);
    guess.descriptor = p.label;
    if (p.month) guess.date = p.month;
  } else if (ai.doc_type === 'mileage_report') {
    var who = String(ai.person || '').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
    guess.descriptor = 'Mileage' + (who ? '-' + who : '');
  } else if (ai.vendor) {
    guess.descriptor = vendorToken(ai, cfg.vendors);
    guess.rawVendor = ai.vendor;
    guess.knownVendor = !!matchVendor(ai.vendor, cfg.vendors);
  }
  guess.confidence = ai.confidence || 'medium';
  guess.classConfidence = ai.classification_confidence || 'medium';
  guess.docType = ai.doc_type || '';
  return guess;
}

/* ======================= RULES ======================= */

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

/** A real YYYY-MM at the start of a string, or '' -- a fiscal-year range like "2026-2027" yields ''. */
function monthOf(s) {
  var m = String(s || '').match(/^(20\d{2})-(0[1-9]|1[0-2])/);
  return m ? m[1] + '-' + m[2] : '';
}

function buildName(g) {
  if (!g.date || !g.type) return '';
  var p = [g.date, g.entity, g.type];
  if (g.descriptor) p.push(g.descriptor);
  return p.join('_');
}

/**
 * Where does this document go? The path comes from the rule's Depth Pattern in the Rules sheet,
 * not from code. Every route that was hardcoded here drifted out of date when the Drive was
 * reorganised; the ones read from the sheet did not.
 *
 * Pattern tokens:
 *   [YYYY]      the year          -- a date folder, created on demand
 *   [YYYY-MM]   the month         -- a date folder, created on demand
 *   [ACCT]      the account folder -- a closed set, never created
 *   *           a human picks the subfolder -> the dashboard will not file it
 *   anything else is a literal folder name and must already exist
 */
function resolveDestination(g, cfg) {
  var rule = null;
  // Reconciliations live in two places: the trust account has its own folder (06, a DFPI
  // compliance record); every other account's recon goes to 04. The trust rule is the one
  // whose descriptor source is FIXED:Trust -- no hardcoded folder numbers.
  if (g.type === 'REC') {
    var wantTrust = /trust/i.test(g.account || g.descriptor || '');
    for (var t = 0; t < cfg.rules.length; t++) {
      var r0 = cfg.rules[t];
      if (r0.active !== 'YES' || r0.type !== 'REC') continue;
      if (/^FIXED:Trust/i.test(r0.descSrc || '') === wantTrust) { rule = r0; break; }
    }
  }
  if (!rule) for (var i = 0; i < cfg.rules.length; i++)
    if (cfg.rules[i].active === 'YES' && cfg.rules[i].type === g.type) { rule = cfg.rules[i]; break; }

  if (!rule) return { path: '', folderId: '', note: 'No active rule for type "' + g.type + '" - add one in Settings' };
  if (!g.date) return { path: '', folderId: '', note: 'No date could be read from this document' };

  var year = g.date.slice(0, 4), month = g.date.slice(0, 7);
  var base = rule.num + ' ' + rule.name;
  var pat = String(rule.depth || '').trim();

  // "*" = the subfolder is a human decision. Commission reports are spreadsheets filed by hand.
  if (pat.indexOf('*') >= 0)
    return { path: '', folderId: '', note: 'These are filed by hand in ' + base + '. The dashboard does not place them.' };

  // [ACCT] = the account's own folder. Accounts are a closed set, so this is never created.
  if (/\[ACCT\]/i.test(pat)) {
    if (!g.accountId) {
      var haveList = getAccountAliases().length;
      return { path: '', folderId: '', accountPick: true,
               note: haveList ? 'This account number is not in the Accounts list. Add it under Settings.'
                              : 'The Accounts list has not been set up yet. Go to Settings and click "Set up accounts list".' };
    }
    var tail = pat.split('/').slice(1).map(function (x) { return patternToken(x, year, month); }).filter(Boolean);
    return { path: base + '/' + g.descriptor + (tail.length ? '/' + tail.join('/') : ''),
             folderId: g.accountId, sub: tail };
  }

  var sub = pat ? pat.split('/').map(function (x) { return patternToken(x, year, month); }).filter(Boolean) : [];
  return { path: base + (sub.length ? '/' + sub.join('/') : ''), folderId: rule.folderId, sub: sub };
}

function patternToken(tok, year, month) {
  tok = String(tok).trim();
  if (/^\[YYYY\]$/i.test(tok)) return year;
  if (/^\[YYYY-MM\]$/i.test(tok)) return month;
  if (/^\[FLAT\]$/i.test(tok)) return '';
  return tok;                       // a literal folder name
}

/**
 * Next free name if one is already taken. READ-ONLY -- this runs during preview, before the
 * person has agreed to anything, so it must never touch a file. An earlier version renamed the
 * existing file to _1 to make the pair symmetric; that meant merely looking at a document
 * silently renamed a filed record. Preview never writes.
 */
function findExistingFile(dest, name) {
  try {
    var f = DriveApp.getFolderById(dest.folderId);
    for (var i = 0; i < (dest.sub || []).length; i++) {
      var it = f.getFoldersByName(dest.sub[i]);
      if (!it.hasNext()) return null;                    // path not built yet -> nothing to collide with
      f = it.next();
    }
    var files = f.getFilesByName(name);
    while (files.hasNext()) { var file = files.next(); if (!isShortcut(file)) return file; }
    return null;
  } catch (e) { return null; }
}

function uniqueName(dest, name) {
  try {
    var f = DriveApp.getFolderById(dest.folderId);
    for (var i = 0; i < (dest.sub || []).length; i++) {
      var it = f.getFoldersByName(dest.sub[i]);
      if (!it.hasNext()) return name;                    // folder not created yet -> no collision possible
      f = it.next();
    }
    if (!f.getFilesByName(name).hasNext()) return name;
    var k = 2; while (f.getFilesByName(name + '_' + k).hasNext()) k++;
    return name + '_' + k;
  } catch (e) { return name; }
}

/* ======================= COMMIT ======================= */

function commitUpload(b64, mime, finalName, folderId, subPath) {
  try {
    var folder = DriveApp.getFolderById(folderId);
    (subPath || []).forEach(function (seg) { folder = childFolder(folder, seg); });
    var bytes = Utilities.base64Decode(b64);
    // a real (non-shortcut) file with this exact name already sitting here? e.g. the same document
    // dropped twice in one batch, which the preview-time collision check cannot see yet.
    var it = folder.getFilesByName(finalName), existing = null;
    while (it.hasNext()) { var ef = it.next(); if (!isShortcut(ef)) { existing = ef; break; } }
    if (existing) {
      if (existing.getSize() === bytes.length)                           // byte-identical: same document, do not duplicate
        return { ok: true, duplicate: true, name: finalName, url: existing.getUrl(), folder: folder.getName() };
      finalName = uniqueName({ folderId: folder.getId(), sub: [] }, finalName);   // different content, same name: keep both
    }
    var file = folder.createFile(Utilities.newBlob(bytes, mime, finalName));
    file.setName(finalName);
    logActivity(finalName, folder.getName());
    return { ok: true, url: file.getUrl(), folder: folder.getName(), name: finalName,
             keptBoth: !!existing, shortcut: maybeShortcut(file, finalName) };
  } catch (e) { return { ok: false, error: String(e) }; }
}

/**
 * Replace an existing document's contents in place. The file keeps its ID, so its 04 shortcut
 * stays valid and Drive keeps the previous version in history -- a rollback, not a loss. Used when
 * a document is reissued or corrected rather than newly filed.
 */
function replaceFile(b64, mime, existingId, finalName) {
  try {
    if (typeof Drive === 'undefined' || !(Drive.Files && Drive.Files.update))
      return { ok: false, error: 'The Drive service is not enabled. In the editor: Services (+) > Drive API > Add.' };
    var blob = Utilities.newBlob(Utilities.base64Decode(b64), mime, finalName);
    Drive.Files.update({}, existingId, blob, { supportsAllDrives: true });   // same ID, new revision
    var file = DriveApp.getFileById(existingId);
    var folderName = file.getParents().hasNext() ? file.getParents().next().getName() : '';
    logActivity(finalName + ' (replaced)', folderName);
    return { ok: true, url: file.getUrl(), folder: folderName, replaced: true,
             shortcut: maybeShortcut(file, finalName) };   // idempotent: ensures the 04 pointer exists
  } catch (e) { return { ok: false, error: String(e) }; }
}

/**
 * A statement lives once, in 01 or 02. The accountants need to see it in the month they are
 * reconciling, so 04 gets a shortcut pointing at it. Creating the pointer here means a duplicate
 * copy can never come back.
 *
 * Trust is excluded: it is reconciled in 06, not 04. Anything else is reported back to the
 * screen rather than failing quietly -- if the Drive service is off, the person should know the
 * pointer is missing, not discover it at month end.
 */
function maybeShortcut(file, name) {
  var m = name.match(/^(20\d{2})-(\d{2})_(?:FSE|RTM)_(BANK|CC)_(.+)$/);
  if (!m) return null;                                   // not a statement; nothing to point at

  var month = m[1] + '-' + m[2];
  try {
    var cfg = getConfig(), rule04 = null;
    for (var i = 0; i < cfg.rules.length; i++)
      if (cfg.rules[i].active === 'YES' && String(cfg.rules[i].num).replace(/^0/, '') === '4') { rule04 = cfg.rules[i]; break; }
    if (!rule04) return { ok: false, note: 'No shortcut: folder 04 is not set up yet.' };

    var root = DriveApp.getFolderById(rule04.folderId);
    var mf = childFolder(childFolder(root, m[1]), month);
    if (mf.getFilesByName(name).hasNext()) return { ok: true, note: 'already in ' + month };
    createShortcut(file.getId(), mf.getId(), name);
    return { ok: true, note: 'shortcut added to 04/' + month };
  } catch (e) {
    return { ok: false, note: 'Filed, but the shortcut into 04 failed: ' + e };
  }
}
/**
 * Date folders are just time passing, so they are created on demand. A NAMED folder is
 * structure: if one is missing, the filing rules point somewhere wrong, and inventing it would
 * quietly build a second home for records that already have one. So it fails instead.
 */
function childFolder(parent, name) {
  var it = parent.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  if (!/^20\d{2}(-(0[1-9]|1[0-2]))?$/.test(name))
    throw new Error('The folder "' + name + '" does not exist under "' + parent.getName() +
                    '". The dashboard only creates year and month folders, so this means a filing rule ' +
                    'points at the wrong place. Check the Depth Pattern in the Rules sheet.');
  return parent.createFolder(name);
}

/* ======================= QC ======================= */

function getQcData() { return { pending: findPending(), recent: getRecent() }; }
function findPending() {
  var out = [], it = DriveApp.searchFiles('title contains "RENAME" and trashed = false'), n = 0;
  while (it.hasNext() && n < 100) {
    var f = it.next(); n++;
    if (isShortcut(f)) continue;
    if (f.getName().indexOf('_RENAME_') < 0) continue;
    var p = f.getParents();
    out.push({ id: f.getId(), name: f.getName(), url: f.getUrl(),
               mime: f.getMimeType(), folder: p.hasNext() ? p.next().getName() : '' });
  }
  return out;
}
function getRecent() { var r = PropertiesService.getScriptProperties().getProperty('RECENT_ACTIVITY'); return r ? JSON.parse(r).slice(0, 15) : []; }
function logActivity(name, folder) {
  var p = PropertiesService.getScriptProperties(), l = getRecent();
  l.unshift({ name: name, folder: folder, at: new Date().toISOString() });
  p.setProperty('RECENT_ACTIVITY', JSON.stringify(l.slice(0, 30)));
}

/** Apply a corrected name to a file Verify flagged as mislabeled. Confirmed by the human first. */
function applyVerifyFix(fileId, newName) {
  try {
    var f = DriveApp.getFileById(fileId);
    var parent = f.getParents(); parent = parent.hasNext() ? parent.next() : null;
    if (parent) { var k = 1, base = newName; while (nameTaken(parent, newName, f)) { k++; newName = base + '_' + k; } }
    var old = f.getName();
    f.setName(newName);
    logActivity(newName, parent ? parent.getName() : '');
    return { ok: true, from: old, to: newName, url: f.getUrl() };
  } catch (e) { return { ok: false, error: String(e) }; }
}

/* ======================= FIX IN PLACE (QC queue) ======================= */

/**
 * Reads a flagged file straight from Drive, asks Claude what it is, and proposes a new name.
 * Does NOT rename. Returns a proposal for the human to confirm.
 * The existing name already carries the correct date/entity/type -- only the descriptor is missing.
 */
function proposeFix(fileId) {
  try {
    var f = DriveApp.getFileById(fileId);
    var name = f.getName();
    if (isShortcut(f)) return { ok: false, error: 'This is a shortcut, not a document. Handle the original in its home folder.' };
    if (f.getMimeType() !== 'application/pdf')
      return { ok: false, error: 'Only PDFs can be read automatically. Rename this one in Drive.' };

    var m = name.match(/^(20\d{2}(?:-\d{2}){0,2})_(FSE|RTM)_([A-Z]{2,5})_RENAME_(.*)$/);
    if (!m) return { ok: false, error: 'This file is not in the expected RENAME format.' };
    var datePart = m[1], entity = m[2], type = m[3], original = m[4];

    var b64 = Utilities.base64Encode(f.getBlob().getBytes());
    var ai = extractWithClaude(b64);
    if (ai.error) return { ok: false, error: ai.error };
    if (!ai.vendor) return { ok: false, error: 'Could not find a company name in this document. Rename it manually.' };

    var cfg = getConfig();
    var tok = vendorToken(ai, cfg.vendors);
    var parent = f.getParents(); parent = parent.hasNext() ? parent.next() : null;
    var proposed = datePart + '_' + entity + '_' + type + '_' + tok;

    // Only statements (no invoice number) can legitimately collide; a true duplicate gets _2 for review.
    if (parent) { var k = 1, base = proposed; while (nameTaken(parent, proposed, f)) { k++; proposed = base + '_' + k; } }

    return { ok: true, fileId: fileId, current: name, proposed: proposed,
             vendor: ai.vendor, confidence: ai.confidence || 'medium', original: original };
  } catch (e) { return { ok: false, error: String(e) }; }
}

/**
 * Decides the vendor token from a Claude reading.
 * Rule: include the invoice number ONLY when the document has exactly one (an invoice).
 * None or several = a statement -> account/vendor + month is the key, no number.
 * First American always keeps its account number (it identifies the service line).
 */
function vendorToken(ai, vendors) {
  var tok = matchVendor(ai.vendor, vendors) ||
            String(ai.vendor).replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
  var one = (ai.invoiceCount === 1 && ai.invoice_number) ? cleanNum(ai.invoice_number) : '';

  if (/first american/i.test(ai.vendor)) {
    var acct = ai.customer_number || ai.account_number;   // First American prints a Customer No.; keep account + invoice
    var base = 'First-American' + (acct ? '_' + cleanNum(acct) : '');
    return base + (one ? '_' + one : '');
  }
  return tok + (one ? '_' + one : '');
}
/**
 * Payroll is named by the PERIOD it covers, not the check date -- the document states
 * "Period Begin Date" and "Period End Date". A check dated 7/5 for the second half of June
 * belongs to June's books. Reading the end day from the document means short months are
 * automatically right (February reads 16-28, not 16-30).
 */
function payPeriod(ai) {
  var st = String(ai.pay_period_start || ''), en = String(ai.pay_period_end || '');
  var ms = st.match(/^(20\d{2})-(\d{2})-(\d{2})$/), me = en.match(/^(20\d{2})-(\d{2})-(\d{2})$/);
  if (ms && me) return { month: ms[1] + '-' + ms[2], label: ms[3] + '-' + me[3] };
  if (ms) return { month: ms[1] + '-' + ms[2], label: '' };
  return { month: '', label: '' };
}

function cleanNum(n) { return String(n).replace(/^#+/, '').replace(/[^\w-]/g, ''); }

/** Renames the existing file in place. Called only after the human confirms. */
function applyFix(fileId, newName) {
  try {
    var f = DriveApp.getFileById(fileId);
    var old = f.getName();
    f.setName(newName);
    var p = f.getParents();
    logActivity(newName, p.hasNext() ? p.next().getName() : '');
    return { ok: true, from: old, to: newName, url: f.getUrl() };
  } catch (e) { return { ok: false, error: String(e) }; }
}

/* ======================= ORGANIZE 04 (one-time backlog) ======================= */

/**
 * Creates a Drive shortcut. DriveApp cannot do this -- only the Drive API can -- so the
 * Drive service must be enabled under Services in the editor. Handles both v2 and v3
 * of the advanced service, since which one is added varies.
 */
function createShortcut(targetId, folderId, name) {
  if (typeof Drive === 'undefined')
    throw new Error('The Drive service is not enabled. In the editor: Services (+) > Drive API > Add.');
  if (Drive.Files && Drive.Files.create) {          // v3
    return Drive.Files.create({
      name: name, mimeType: 'application/vnd.google-apps.shortcut',
      shortcutDetails: { targetId: targetId }, parents: [folderId]
    }, null, { supportsAllDrives: true }).id;
  }
  return Drive.Files.insert({                        // v2
    title: name, mimeType: 'application/vnd.google-apps.shortcut',
    shortcutDetails: { targetId: targetId }, parents: [{ id: folderId }]
  }, null, { supportsAllDrives: true }).id;
}

/** The already-filed original, if it exists: 01|02 / [Account] / [Year] / [name] */
function findFiledOriginal(accountFolderId, year, name) {
  try {
    var af = DriveApp.getFolderById(accountFolderId);
    var yf = af.getFoldersByName(year);
    if (!yf.hasNext()) return null;
    var it = yf.next().getFilesByName(name);
    while (it.hasNext()) { var f = it.next(); if (!isShortcut(f)) return f; }
    return null;
  } catch (e) { return null; }
}

/**
 * Every filed statement gets a shortcut in its 04 month folder, so the accountants see it without
 * the file existing twice. Missing month folders are CREATED: a statement with nowhere to point is
 * worse than an empty folder, and the folder being there early is deliberate.
 *
 * Bounded by MIN_YEAR: reconciliations began January 2026 (when Landmark came on), so nothing
 * earlier gets an 04 folder even though 01 and 02 hold years of older statements.
 *
 * Idempotent -- only adds what is missing, so a half-finished run is fixed by running it again.
 * Trust is excluded; it is reconciled in 06.
 */
function ensureShortcuts(root04, out, apply) {
  var cfg = getConfig();
  cfg.rules.forEach(function (r) {
    if (r.active !== 'YES' || (r.type !== 'BANK' && r.type !== 'CC')) return;
    var rootAcc = openFolder(r.folderId); if (!rootAcc) return;
    var accts = rootAcc.getFolders();
    while (accts.hasNext()) {
      var a = accts.next();
      if (SKIP_FOLDER.test(a.getName())) continue;
      var years = a.getFolders();
      while (years.hasNext()) {
        var y = years.next(), yName = y.getName();
        if (!/^20\d{2}$/.test(yName)) continue;
        if (parseInt(yName, 10) < MIN_YEAR) continue;      // predates the reconciliations
        var files = y.getFiles();
        while (files.hasNext()) {
          var f = files.next();
          if (isShortcut(f)) continue;
          var n = f.getName();
          var m = n.match(/^(20\d{2}-\d{2})_(?:FSE|RTM)_(?:BANK|CC)_/);
          if (!m) continue;

          // Look without creating -- preview must not write.
          var y04It = root04.getFoldersByName(yName);
          var y04 = y04It.hasNext() ? y04It.next() : null;
          var mf = null;
          if (y04) { var mIt = y04.getFoldersByName(m[1]); mf = mIt.hasNext() ? mIt.next() : null; }
          if (mf && mf.getFilesByName(n).hasNext()) continue;   // pointer already there

          out.push({ name: n, folder: m[1], to: n, note: mf ? '' : 'creates folder ' + m[1] });
          if (apply) {
            try {
              var target = childFolder(childFolder(root04, yName), m[1]);
              if (!target.getFilesByName(n).hasNext()) createShortcut(f.getId(), target.getId(), n);
            } catch (e) { }
          }
        }
      }
    }
  });
}

/**
 * One-time cleanup of folder 04. Reads every document that isn't already named correctly:
 *   - a statement  -> replaced by a shortcut to the real file in 01/02.
 *                     If no original exists, the copy is moved home first, then shortcutted.
 *   - anything else -> renamed in place. No copies are ever made.
 * Preview (apply = false) writes nothing. Files are trashed, never deleted, so a mistake is
 * recoverable from the Drive bin for 30 days.
 */
function organize04(apply) {
  var cfg = getConfig(), rule04 = null;
  for (var i = 0; i < cfg.rules.length; i++)
    if (cfg.rules[i].active === 'YES' && String(cfg.rules[i].num).replace(/^0/, '') === '4') { rule04 = cfg.rules[i]; break; }
  if (!rule04) return { ok: false, error: 'Folder 04 has no active rule yet. Click "Set up Recs & Registers" first.' };

  var root = openFolder(rule04.folderId);
  if (!root) return { ok: false, error: 'Cannot open folder 04.' };

  var out = { rename: [], shortcut: [], moveHome: [], missing: [], skip: [], errors: [] };
  var years = root.getFolders();
  while (years.hasNext()) {
    var yf = years.next();
    if (!/^20\d{2}$/.test(yf.getName())) continue;
    var months = yf.getFolders();
    while (months.hasNext()) {
      var mf = months.next();
      if (!/^20\d{2}-\d{2}$/.test(mf.getName())) continue;

      var files = mf.getFiles();
      while (files.hasNext()) {
        var f = files.next(), name = f.getName();
        if (isShortcut(f)) continue;
        if (isCanonical(name)) continue;
        if (f.getMimeType() !== 'application/pdf') { out.skip.push({ name: name, folder: mf.getName(), why: 'not a PDF' }); continue; }

        var ai;
        try { ai = extractWithClaude(Utilities.base64Encode(f.getBlob().getBytes())); }
        catch (e) { out.skip.push({ name: name, folder: mf.getName(), why: String(e) }); continue; }
        if (ai.error) { out.skip.push({ name: name, folder: mf.getName(), why: ai.error }); continue; }

        var guess = mergeAi({ entity: 'FSE', type: '', date: '', descriptor: '' }, ai, cfg);
        var proposed = buildName(guess);
        if (!proposed) { out.skip.push({ name: name, folder: mf.getName(), why: 'could not work out a name' }); continue; }

        var monthNote = (guess.date !== mf.getName()) ? 'document is ' + guess.date + ' but sits in ' + mf.getName() : '';

        // ---- statements: the real file lives in 01/02; 04 gets a pointer ----
        if (guess.type === 'BANK' || guess.type === 'CC') {
          if (!guess.accountId) { out.skip.push({ name: name, folder: mf.getName(), why: 'account not recognised' }); continue; }
          var year = guess.date.slice(0, 4);
          var original = findFiledOriginal(guess.accountId, year, proposed);

          if (original) {
            out.shortcut.push({ name: name, folder: mf.getName(), to: proposed, note: monthNote });
            if (apply) {
              try { createShortcut(original.getId(), mf.getId(), proposed); f.setTrashed(true); }
              catch (e) { out.errors.push(name + ': ' + e); }
            }
          } else {
            out.moveHome.push({ name: name, folder: mf.getName(), to: proposed,
                                dest: guess.descriptor + '/' + year, note: monthNote });
            if (apply) {
              try {
                var af = DriveApp.getFolderById(guess.accountId);
                var yTarget = childFolder(af, year);
                f.moveTo(yTarget); f.setName(proposed);
                createShortcut(f.getId(), mf.getId(), proposed);
              } catch (e) { out.errors.push(name + ': ' + e); }
            }
          }
          continue;
        }

        // ---- registers, recons, payroll: rename where they sit ----
        var target = proposed, k = 1;
        while (nameTaken(mf, target, f)) { k++; target = proposed + '_' + k; }
        out.rename.push({ name: name, folder: mf.getName(), to: target, note: monthNote });
        if (apply) { try { f.setName(target); } catch (e) { out.errors.push(name + ': ' + e); } }
      }
    }
  }

  // Finally: add any statement pointer that is missing from a month 04 is already working on.
  try { ensureShortcuts(root, out.missing, apply); } catch (e) { out.errors.push('Shortcuts: ' + e); }

  return { ok: true, apply: !!apply, rename: out.rename, shortcut: out.shortcut,
           moveHome: out.moveHome, missing: out.missing, skip: out.skip, errors: out.errors,
           counts: { rename: out.rename.length, shortcut: out.shortcut.length,
                     moveHome: out.moveHome.length, missing: out.missing.length,
                     skip: out.skip.length } };
}

/* ======================= VERIFY (audit: does the name match the document?) ======================= */

/**
 * Reads every PDF in the expense folders for a given year and compares the vendor found
 * INSIDE the document to the vendor written in the filename.
 * Read-only. Renames nothing. Returns three buckets: match / mismatch / unreadable.
 *
 * This is the check that catches a file named for one vendor but containing another's document.
 */
function verifyExpenses(year) {
  year = String(year || new Date().getFullYear());
  var cfg = getConfig();
  var rule = null;
  for (var i = 0; i < cfg.rules.length; i++) if (cfg.rules[i].type === 'EXP') { rule = cfg.rules[i]; break; }
  if (!rule) return { ok: false, error: 'No EXP rule found.' };

  var root = openFolder(rule.folderId);
  if (!root) return { ok: false, error: 'Cannot open the expenses folder.' };
  var yIt = root.getFoldersByName(year);
  if (!yIt.hasNext()) return { ok: false, error: 'No ' + year + ' folder.' };

  var out = { match: [], mismatch: [], unreadable: [], flagged: [], dupes: [] };
  var months = yIt.next().getFolders();
  var seenNames = {};

  while (months.hasNext()) {
    var mf = months.next();
    if (!/^20\d{2}-\d{2}$/.test(mf.getName())) continue;
    var files = mf.getFiles();
    while (files.hasNext()) {
      var f = files.next(), name = f.getName();
      if (isShortcut(f)) continue;   // shortcuts point at the real file elsewhere; never handle them here

      // duplicate-name detection (Drive allows two files with the same name)
      var key = mf.getName() + '/' + name;
      if (seenNames[key]) { seenNames[key].push(f.getId()); }
      else seenNames[key] = [f.getId()];

      if (name.indexOf('_RENAME_') >= 0) { out.flagged.push({ name: name, folder: mf.getName(), url: f.getUrl() }); continue; }
      if (f.getMimeType() !== 'application/pdf') { out.unreadable.push({ name: name, folder: mf.getName(), why: 'not a PDF', url: f.getUrl() }); continue; }

      var m = name.match(/^20\d{2}-\d{2}_(?:FSE|RTM)_EXP_(.+)$/);
      if (!m) { out.unreadable.push({ name: name, folder: mf.getName(), why: 'unexpected name format', url: f.getUrl() }); continue; }
      var claimed = m[1];

      var ai;
      try { ai = extractWithClaude(Utilities.base64Encode(f.getBlob().getBytes())); }
      catch (e) { out.unreadable.push({ name: name, folder: mf.getName(), why: String(e), url: f.getUrl() }); continue; }

      if (ai.error) { out.unreadable.push({ name: name, folder: mf.getName(), why: ai.error, url: f.getUrl() }); continue; }
      if (!ai.vendor) { out.unreadable.push({ name: name, folder: mf.getName(), why: 'no vendor in document', url: f.getUrl() }); continue; }

      var found = matchVendor(ai.vendor, cfg.vendors) ||
                  String(ai.vendor).replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
      if (/first american/i.test(ai.vendor) && ai.account_number)
        found = 'First-American_' + ai.account_number + (ai.invoice_number ? '_' + ai.invoice_number : '');

      if (vendorsAgree(claimed, ai.vendor, found, cfg.vendors)) out.match.push({ name: name, folder: mf.getName() });
      else out.mismatch.push({ id: f.getId(), name: name, folder: mf.getName(), claimed: claimed,
                               actual: ai.vendor, suggested: name.replace(/_EXP_.*$/, '_EXP_' + found),
                               url: f.getUrl() });
    }
  }
  // Resolve duplicates: read each colliding file and propose a distinct name.
  out.dupes = [];
  Object.keys(seenNames).forEach(function (k) {
    var ids = seenNames[k];
    if (ids.length < 2) return;
    var folder = k.split('/')[0], baseName = k.substring(folder.length + 1);
    ids.forEach(function (fid) {
      var entry = { id: fid, name: baseName, folder: folder };
      try {
        var f = DriveApp.getFileById(fid);
        if (isShortcut(f) || f.getMimeType() !== 'application/pdf') { entry.suggested = ''; out.dupes.push(entry); return; }
        var m = baseName.match(/^(20\d{2}(?:-\d{2}){0,2})_(FSE|RTM)_([A-Z]{2,5})/);
        if (!m) { entry.suggested = ''; out.dupes.push(entry); return; }
        var ai = extractWithClaude(Utilities.base64Encode(f.getBlob().getBytes()));
        if (!ai.error && ai.vendor) {
          entry.actual = ai.vendor;
          entry.suggested = m[1] + '_' + m[2] + '_' + m[3] + '_' + vendorToken(ai, cfg.vendors);
        } else entry.suggested = '';
      } catch (e) { entry.suggested = ''; }
      out.dupes.push(entry);
    });
  });

    return { ok: true, year: year, counts: { match: out.match.length, mismatch: out.mismatch.length,
           unreadable: out.unreadable.length, flagged: out.flagged.length, dupes: out.dupes.length }, detail: out };
}

/**
 * Do the claimed token and the document's vendor refer to the same company?
 * Consults the Vendors table so a legal name in the document (e.g. "Department of Financial
 * Protection and Innovation") matches its short token ("DFPI").
 */
function vendorsAgree(claimed, rawVendor, found, vendors) {
  var norm = function (x) { return String(x).toLowerCase().replace(/[^a-z0-9]/g, ''); };
  var a = norm(claimed), b = norm(found), raw = String(rawVendor).toLowerCase();
  if (!a || !b) return false;
  if (a === b) return true;

  // The filename token (a) is the leading part before any account/invoice suffix. Compare on that.
  var aLead = norm(String(claimed).split('_')[0]);

  // If the filename's token maps to a vendor in the table, and the document text contains that
  // vendor's match phrase, they agree -- e.g. token "DFPI" whose document reads the full legal name.
  for (var i = 0; i < vendors.length; i++) {
    var vt = norm(vendors[i].token), vm = vendors[i].match.toLowerCase();
    if ((vt === a || vt === aLead) && raw.indexOf(vm) >= 0) return true;   // token matches + phrase in document
    if (raw.indexOf(vm) >= 0 && (a.indexOf(vt) === 0 || aLead === vt)) return true;
  }
  // Same vendor with an extra numeric key (Canon vs Canon_1234)
  var an = a.replace(/[0-9]/g, ''), bn = b.replace(/[0-9]/g, '');
  if (an && bn && (an.indexOf(bn) === 0 || bn.indexOf(an) === 0)) return true;

  // Acronym match: filename token "DFPI" vs document "Department of Financial Protection and Innovation".
  if (acronymOf(rawVendor) === norm(String(claimed).split('_')[0])) return true;
  return false;
}

/** First letters of the significant words -> lowercase acronym. Skips filler words. */
function acronymOf(phrase) {
  var skip = { of: 1, and: 1, the: 1, for: 1, a: 1, an: 1, to: 1, in: 1, '&': 1 };
  return String(phrase).toLowerCase().split(/[^a-z0-9]+/)
    .filter(function (w) { return w && !skip[w]; })
    .map(function (w) { return w[0]; }).join('');
}

/* ======================= SETTINGS (admins only) ======================= */

function getSettings() {
  var cfg = getConfig();
  return { ok: true, rules: cfg.rules, vendors: cfg.vendors, accounts: getAccounts(),
           types: TYPES, descSources: DESC_SOURCES, dateSources: DATE_SOURCES,
           folders: listFinanceFolders(), accountFolders: listAccountFolders() };
}

/** Folder picker source -- nobody types a folder ID. */
function listFinanceFolders() {
  var out = [], it = DriveApp.getFolderById(FINANCE_ROOT).getFolders();
  while (it.hasNext()) { var f = it.next(); out.push({ id: f.getId(), name: f.getName() }); }
  return out.sort(function (a, b) { return a.name.localeCompare(b.name); });
}

function addVendor(match, token, acctRule) {
  match = String(match || '').trim().toLowerCase();
  token = String(token || '').trim().replace(/\s+/g, '-');
  if (!match || !token) return { ok: false, error: 'Both a match phrase and a token are required.' };
  var cfg = getConfig();
  for (var i = 0; i < cfg.vendors.length; i++) {
    if (cfg.vendors[i].match.toLowerCase() === match) return { ok: false, error: 'That match phrase already exists.' };
  }
  SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Vendors')
    .appendRow([match, token, String(acctRule || '').trim(), 'added via dashboard ' + new Date().toISOString().slice(0, 10)]);
  return { ok: true };
}

function editVendor(row, match, token) {
  row = parseInt(row, 10);
  match = String(match || '').trim().toLowerCase();
  token = String(token || '').trim().replace(/\s+/g, '-');
  if (!match || !token) return { ok: false, error: 'Both a match phrase and a name are required.' };
  var cfg = getConfig();
  for (var i = 0; i < cfg.vendors.length; i++) {
    if (cfg.vendors[i].row === row) continue;                       // skip the row being edited
    if (cfg.vendors[i].match.toLowerCase() === match) return { ok: false, error: 'Another vendor already matches "' + match + '".' };
  }
  var sh = SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Vendors');
  if (!(row >= 2 && row <= sh.getLastRow())) return { ok: false, error: 'That vendor is no longer there.' };
  sh.getRange(row, 1, 1, 2).setValues([[match, token]]);
  sh.getRange(row, 4).setValue('edited via dashboard ' + new Date().toISOString().slice(0, 10));
  return { ok: true };
}

function removeVendor(row) {
  row = parseInt(row, 10);
  var sh = SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Vendors');
  if (!(row >= 2 && row <= sh.getLastRow())) return { ok: false, error: 'That vendor is no longer there.' };
  sh.deleteRow(row);
  return { ok: true };
}

/* ---------- Accounts (closed set, tied to Drive folders) ---------- */
function getAccounts() {
  var sh = SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Accounts');
  if (!sh) return [];
  var v = sh.getDataRange().getValues(); if (v.length < 2) return [];
  var out = [];
  for (var r = 1; r < v.length; r++) {
    if (!String(v[r][0] || '').trim()) continue;
    out.push({ row: r + 1, token: String(v[r][0]).trim(), last4: String(v[r][1] || '').trim(),
               phrases: String(v[r][2] || '').trim(), notes: String(v[r][3] || '').trim() });
  }
  return out;
}

function editAccount(row, token, last4, phrases) {
  row = parseInt(row, 10);
  token = String(token || '').trim();
  if (!token) return { ok: false, error: 'An account name is required.' };
  var accts = getAccounts();
  for (var i = 0; i < accts.length; i++)
    if (accts[i].row !== row && accts[i].token.toLowerCase() === token.toLowerCase())
      return { ok: false, error: 'Another account already uses "' + token + '".' };
  var sh = SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Accounts');
  if (!(row >= 2 && row <= sh.getLastRow())) return { ok: false, error: 'That account is no longer there.' };
  sh.getRange(row, 1, 1, 3).setValues([[token, String(last4 || '').trim(), String(phrases || '').trim()]]);
  return { ok: true };
}

function addAccount(token, last4, phrases, notes) {
  token = String(token || '').trim();
  if (!token) return { ok: false, error: 'An account name is required.' };
  var accts = getAccounts();
  for (var i = 0; i < accts.length; i++)
    if (accts[i].token.toLowerCase() === token.toLowerCase()) return { ok: false, error: 'That account already exists.' };
  var folders = listAccountFolders(), hasFolder = false;                 // the token must match a real 01/02 folder
  for (var j = 0; j < folders.length; j++) if (folders[j].name === token) { hasFolder = true; break; }
  if (!hasFolder) return { ok: false, error: 'No folder named "' + token + '" exists under Bank or Credit Card Statements. Create the account folder in Drive first, then add it here.' };
  SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Accounts')
    .appendRow([token, String(last4 || '').trim(), String(phrases || '').trim(),
                String(notes || '').trim() || 'added via dashboard ' + new Date().toISOString().slice(0, 10)]);
  return { ok: true };
}

/* ---------- Rules ---------- */
function validRuleFields(o) {
  if (TYPES.indexOf(o.type) < 0) return 'Type "' + o.type + '" is not one of the allowed types.';
  if (DESC_SOURCES.indexOf(o.descSrc) < 0 && !/^FIXED:.+/.test(o.descSrc)) return 'Descriptor source "' + o.descSrc + '" is not valid.';
  if (o.dateSrc && DATE_SOURCES.indexOf(o.dateSrc) < 0) return 'Date source "' + o.dateSrc + '" is not valid.';
  if (!o.folderId || !openFolder(o.folderId)) return 'That folder could not be found in Drive.';
  return '';
}

function editRule(row, folderId, folderName, depth, entity, type, descSrc, dateSrc) {
  row = parseInt(row, 10);
  var o = { folderId: String(folderId || '').trim(), type: String(type || '').trim().toUpperCase(),
            descSrc: String(descSrc || '').trim(), dateSrc: String(dateSrc || '').trim() };
  var err = validRuleFields(o); if (err) return { ok: false, error: err };
  var sh = SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Rules');
  if (!(row >= 2 && row <= sh.getLastRow())) return { ok: false, error: 'That rule is no longer there.' };
  sh.getRange(row, 3, 1, 7).setValues([[String(folderName || '').trim(), o.folderId, String(depth || '').trim(),
    String(entity || 'FSE').trim().toUpperCase(), o.type, o.descSrc, o.dateSrc]]);
  return { ok: true };
}

function addRule(folderId, folderName, num, depth, entity, type, descSrc, dateSrc, notes) {
  var o = { folderId: String(folderId || '').trim(), type: String(type || '').trim().toUpperCase(),
            descSrc: String(descSrc || '').trim(), dateSrc: String(dateSrc || '').trim() };
  var err = validRuleFields(o); if (err) return { ok: false, error: err };
  SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Rules')                 // new rules start OFF, turned on deliberately
    .appendRow(['NO', String(num || '').trim(), String(folderName || '').trim(), o.folderId, String(depth || '').trim(),
      String(entity || 'FSE').trim().toUpperCase(), o.type, o.descSrc, o.dateSrc,
      String(notes || '').trim() || 'added via dashboard ' + new Date().toISOString().slice(0, 10)]);
  return { ok: true };
}

function setRuleActive(row, active) {
  SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Rules').getRange(row, 1).setValue(active ? 'YES' : 'NO');
  return { ok: true };
}

function addRule(r) {
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

/**
 * One-click repair. Writes the agreed configuration into the Rules sheet:
 *   - Deactivates 09,10,11,12,14 (the FILENAME descriptor mangles names and mis-years files)
 *   - Clears the duplicate REC type on rule 04 (06 Trust Recons owns REC)
 * Idempotent. Safe to run any time.
 */
function applyRecommendedConfig() {
  var sh = SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Rules');
  var vals = sh.getDataRange().getValues();
  var OFF = ['9','09','10','11','12','14'];
  var changed = [];
  for (var i = 1; i < vals.length; i++) {
    var num = String(vals[i][1]).trim();
    var row = i + 1;
    // 05's records live in "Landmark Financials", not a year folder. The sheet said [YYYY],
    // which would have created a second home the first time one was filed.
    if ((num === '5' || num === '05') && String(vals[i][4]).trim() !== 'Landmark Financials/[YYYY]') {
      sh.getRange(row, 5).setValue('Landmark Financials/[YYYY]');
      changed.push('Rule 05: path corrected to Landmark Financials/[YYYY]');
    }
    if (OFF.indexOf(num) >= 0 && String(vals[i][0]).trim().toUpperCase() !== 'NO') {
      sh.getRange(row, 1).setValue('NO');
      changed.push('Rule ' + num + ' ' + vals[i][2] + ' -> off');
    }
    // NOTE: folder 04 legitimately owns non-trust REC now (06 owns the trust recon, marked
    // FIXED:Trust). Only clear REC from the original dormant 04 row -- never from an active one.
    if ((num === '4' || num === '04') && String(vals[i][0]).trim().toUpperCase() === 'NO' &&
        String(vals[i][6]).trim().toUpperCase() === 'REC') {
      sh.getRange(row, 7).setValue('');
      changed.push('Rule 04 (inactive row): cleared leftover type REC');
    }
  }
  return { ok: true, changed: changed };
}

/** One-time: give 04 Recs & Registers its three rules (registers, bank recons, payroll). */
function setUp04() {
  var sh = SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Rules');
  var vals = sh.getDataRange().getValues();
  var fid = '', added = [];
  for (var i = 1; i < vals.length; i++) {
    var num = String(vals[i][1]).trim();
    if (num === '4' || num === '04') { fid = String(vals[i][3]).trim(); break; }
  }
  if (!fid) return { ok: false, error: 'Could not find folder 04 in the Rules sheet.' };

  var have = {}, dormantRow = 0;
  for (var j = 1; j < vals.length; j++) {
    if (String(vals[j][3]).trim() !== fid) continue;
    if (String(vals[j][0]).trim().toUpperCase() === 'YES') have[String(vals[j][6]).trim().toUpperCase()] = true;
    else if (!dormantRow && !String(vals[j][6]).trim()) dormantRow = j + 1;   // the original blank-type row
  }

  var wanted = [
    ['REG', 'ACCOUNT', 'Transaction registers, one per account'],
    ['REC', 'ACCOUNT', 'Bank/CC reconciliations (Detail and Summary). Trust recons go to 06.'],
    ['PAY', 'PERIOD',  'Payroll reports, named by pay period']
  ];
  wanted.forEach(function (w) {
    if (have[w[0]]) return;
    var row = ['YES', '04', 'Recs & Registers', fid, '[YYYY]/[YYYY-MM]', 'FSE', w[0], w[1], 'FOLDER_MONTH',
               w[2] + ' - set up via dashboard ' + new Date().toISOString().slice(0, 10)];
    if (dormantRow) { sh.getRange(dormantRow, 1, 1, row.length).setValues([row]); dormantRow = 0; }
    else sh.appendRow(row);
    added.push(w[0]);
  });
  return { ok: true, note: added.length ? 'Added rules for: ' + added.join(', ') : 'Folder 04 already set up.' };
}

/** Health check -- run after any change. */
function validateConfig() {
  var cfg = getConfig(), issues = [], claimed = {};
  cfg.rules.forEach(function (r) {
    if (r.active !== 'YES') return;
    try { DriveApp.getFolderById(r.folderId); }
    catch (e) { issues.push({ level: 'error', msg: 'Rule ' + r.num + ' ' + r.name + ': folder not found or no access.' }); }
    if (TYPES.indexOf(r.type) < 0) issues.push({ level: 'error', msg: 'Rule ' + r.num + ': type "' + r.type + '" is not in the approved list.' });
    var key = r.type + (/^FIXED:Trust/i.test(r.descSrc || '') ? ':trust' : '');
    if (claimed[key]) issues.push({ level: 'error', msg: 'Type "' + r.type + '" is claimed by both rule ' + claimed[key] + ' and ' + r.num + '.' });
    else claimed[key] = r.num;
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

  // Accounts: statements can only be named if the account list exists and points at real folders.
  var acctSheet = SpreadsheetApp.openById(RULES_SHEET_ID).getSheetByName('Accounts');
  if (!acctSheet) {
    issues.push({ level: 'error', msg: 'No Accounts tab. Bank and credit card statements cannot be named. Click "Set up accounts list".' });
  } else {
    var al = getAccountAliases(), folders = listAccountFolders();
    if (!al.length) issues.push({ level: 'error', msg: 'The Accounts tab is empty. Click "Set up accounts list".' });
    al.forEach(function (a) {
      if (!byName(folders, a.token))
        issues.push({ level: 'error', msg: 'Account "' + a.token + '" has no matching folder in 01 or 02.' });
    });
    folders.forEach(function (f) {
      var hit = false;
      al.forEach(function (a) { if (acctKey(a.token) === acctKey(f.name)) hit = true; });
      if (!hit) issues.push({ level: 'warn', msg: 'Folder "' + f.name + '" is not in the Accounts tab. Statements for it cannot be matched automatically.' });
    });
  }
  return { ok: true, issues: issues, ruleCount: cfg.rules.length, vendorCount: cfg.vendors.length,
           accountCount: getAccountAliases().length };
}

/* ======================= utils ======================= */
/* ======================= RE-FILE ONE PASTED FILE ======================= */

/** Pull a Drive file ID out of whatever link or id was pasted. */
function fileIdFromInput(input) {
  var s = String(input || '').trim();
  var m = s.match(/\/d\/([a-zA-Z0-9_-]{20,})/)          // .../file/d/ID/...
       || s.match(/[?&]id=([a-zA-Z0-9_-]{20,})/)          // ...?id=ID
       || s.match(/^([a-zA-Z0-9_-]{20,})$/);              // a bare id
  return m ? m[1] : '';
}

/**
 * Reads one pasted file and works out its correct name AND correct destination. Renames it,
 * and if it belongs in a different folder, moves it there (creating date folders and the 04
 * shortcut for statements). One paste, one confirm, fully filed.
 *
 * apply=false previews: shows the proposed name, where it would move, and whether anything
 * actually changes. apply=true does it. Nothing happens to a file already named and placed right.
 */
function refileOne(input, apply) {
  var id = fileIdFromInput(input);
  if (!id) return { ok: false, error: 'That does not look like a Drive link. Open the file in Drive, copy the link, and paste it here.' };

  var f;
  try { f = DriveApp.getFileById(id); }
  catch (e) { return { ok: false, error: 'Could not open that file. Check the link and that you have access.' }; }

  if (isShortcut(f)) return { ok: false, error: 'That is a shortcut, not the real file. Open the original and paste its link.' };
  if (f.getMimeType() !== 'application/pdf')
    return { ok: false, error: 'Only PDFs can be read. This is not a PDF, so it must be filed by hand.' };

  var cfg = getConfig();
  var ai;
  try { ai = extractWithClaude(Utilities.base64Encode(f.getBlob().getBytes())); }
  catch (e) { return { ok: false, error: 'Could not read the document: ' + e }; }
  if (ai.error) return { ok: false, error: 'Could not read the document: ' + ai.error };

  var guess = mergeAi({ entity: 'FSE', type: '', date: '', descriptor: '' }, ai, cfg);
  var curParent = f.getParents(); curParent = curParent.hasNext() ? curParent.next() : null;
  var fm = curParent ? monthOf(curParent.getName()) : '';   // in a month folder (03/04) the folder sets the month; a bad folder falls back to the document
  if (fm) guess.date = fm;
  var proposed = buildName(guess);
  if (!proposed) return { ok: false, error: 'The document could not be identified well enough to name it.' };

  var dest = resolveDestination(guess, cfg);
  if (!dest.folderId) return { ok: false, error: dest.note || 'Could not work out where this belongs.', name: proposed };

  // Where does it sit now vs where should it go?
  var curName = f.getName();

  // Resolve the true destination folder (creating date folders only).
  var targetFolder = DriveApp.getFolderById(dest.folderId);
  (dest.sub || []).forEach(function (seg) { targetFolder = childFolder(targetFolder, seg); });

  var willMove = !curParent || curParent.getId() !== targetFolder.getId();
  var willRename = acctKey(curName) !== acctKey(proposed);

  if (!apply) {
    return { ok: true, apply: false, id: id, from: curName, to: proposed,
             currentFolder: curParent ? curParent.getName() : '(unknown)',
             destPath: dest.path, willMove: willMove, willRename: willRename,
             noop: !willMove && !willRename };
  }

  if (!willMove && !willRename)
    return { ok: true, apply: true, noop: true, to: proposed, destPath: dest.path,
             url: f.getUrl(), note: 'Already named and filed correctly. Nothing to change.' };

  // De-collide within the destination, then rename and move.
  var finalName = proposed, k = 1;
  while (nameTaken(targetFolder, finalName, f)) { k++; finalName = proposed + '_' + k; }
  f.setName(finalName);
  if (willMove) f.moveTo(targetFolder);

  var scNote = '';
  var sc = maybeShortcut(f, finalName);
  if (sc && sc.note) scNote = sc.note;

  logActivity(finalName, targetFolder.getName());
  return { ok: true, apply: true, to: finalName, destPath: dest.path, url: f.getUrl(),
           moved: willMove, renamed: willRename, shortcut: scNote };
}

/* ======================= SPOT CHECK (pick a folder, verify its names) ======================= */

/**
 * The folders a spot check can target, drilled down to the YEAR so a check stays small.
 * For account-based rules (01/02) that means one entry per account per year; for the
 * date-based rules (03/04/05/06) it means one entry per year. The "*" commission folder is
 * excluded -- those are spreadsheets, filed by hand, and cannot be read.
 */
function listCheckableFolders() {
  var cfg = getConfig(), out = [];
  var nowY = new Date().getFullYear();
  var minY = Math.max(MIN_YEAR, nowY - 1);   // rolling window: current year and the one before, floored at MIN_YEAR
  cfg.rules.forEach(function (r) {
    if (r.active !== 'YES' || !r.folderId) return;
    if (String(r.depth || '').indexOf('*') >= 0) return;          // human-managed, not readable
    var root = openFolder(r.folderId); if (!root) return;
    var base = r.num + ' ' + r.name;
    var isAcct = /\[ACCT\]/i.test(r.depth || '');

    if (isAcct) {
      var accts = root.getFolders();
      while (accts.hasNext()) {
        var a = accts.next();
        if (SKIP_FOLDER.test(a.getName())) continue;
        var ys = a.getFolders();
        while (ys.hasNext()) {
          var y = ys.next();
          if (!/^20\d{2}$/.test(y.getName())) continue;
          var yi = parseInt(y.getName(), 10); if (yi < minY || yi > nowY) continue;
          out.push({ id: y.getId(), label: base + ' / ' + a.getName() + ' / ' + y.getName() });
        }
      }
    } else {
      // literal named prefix (e.g. 05 Landmark Financials) then year, or just year
      var pat = String(r.depth || '').split('/');
      var literal = pat.length && !/^\[/.test(pat[0]) ? pat[0] : '';
      var container = root;
      if (literal) { var lit = root.getFoldersByName(literal); if (!lit.hasNext()) return; container = lit.next(); }
      var years = container.getFolders();
      while (years.hasNext()) {
        var yy = years.next();
        if (!/^20\d{2}$/.test(yy.getName())) continue;
        var yyi = parseInt(yy.getName(), 10); if (yyi < minY || yyi > nowY) continue;
        out.push({ id: yy.getId(), label: base + (literal ? ' / ' + literal : '') + ' / ' + yy.getName() });
      }
    }
  });
  out.sort(function (a, b) { return a.label < b.label ? -1 : 1; });
  return out;
}

/**
 * Reads every PDF inside one chosen folder (and its month subfolders, if any), recomputes the
 * name from the document, and compares. Returns correct / mismatch / unreadable. A mismatch
 * carries the suggested name and the file id so the UI can offer a one-click fix.
 *
 * This is the general check the expense-only "Check documents" never was: it works for any
 * folder because it rebuilds the whole name from the document rather than checking one field.
 */
function spotCheckFolder(folderId) {
  var folder = openFolder(folderId);
  if (!folder) return { ok: false, error: 'That folder could not be opened.' };
  var cfg = getConfig();
  var out = { match: [], mismatch: [], unreadable: [] };

  function checkFile(f, folderName, monthFolder) {
    var name = f.getName();
    if (isShortcut(f)) return;
    if (name.indexOf('_RENAME_') >= 0) { out.unreadable.push({ name: name, folder: folderName, why: 'flagged, awaiting a name' }); return; }
    if (f.getMimeType() !== 'application/pdf') { out.unreadable.push({ name: name, folder: folderName, why: 'not a PDF (cannot be read)' }); return; }
    if (!isCanonical(name)) { out.unreadable.push({ name: name, folder: folderName, why: 'name is not in the expected format' }); return; }

    var ai;
    try { ai = extractWithClaude(Utilities.base64Encode(f.getBlob().getBytes())); }
    catch (e) { out.unreadable.push({ name: name, folder: folderName, why: String(e) }); return; }
    if (ai.error) { out.unreadable.push({ name: name, folder: folderName, why: ai.error }); return; }

    var guess = mergeAi({ entity: 'FSE', type: '', date: '', descriptor: '' }, ai, cfg);
    var fm = monthOf(monthFolder);                     // 03/04 file sits in a month folder -> the folder sets the month
    if (fm) guess.date = fm;
    var proposed = buildName(guess);
    if (!proposed) { out.unreadable.push({ name: name, folder: folderName, why: 'could not work out a name from the document' }); return; }

    if (acctKey(proposed) === acctKey(name)) out.match.push({ name: name, folder: folderName });
    else out.mismatch.push({ id: f.getId(), name: name, folder: folderName, suggested: proposed, url: f.getUrl() });
  }

  // files directly in the folder
  var files = folder.getFiles();
  while (files.hasNext()) checkFile(files.next(), folder.getName(), folder.getName());
  // one level of month subfolders (03/04 use [YYYY]/[YYYY-MM])
  var subs = folder.getFolders();
  while (subs.hasNext()) {
    var sub = subs.next();
    if (SKIP_FOLDER.test(sub.getName())) continue;
    var sf = sub.getFiles();
    while (sf.hasNext()) checkFile(sf.next(), folder.getName() + '/' + sub.getName(), sub.getName());
  }

  out.match.sort(); 
  return { ok: true, folder: folder.getName(),
           counts: { match: out.match.length, mismatch: out.mismatch.length, unreadable: out.unreadable.length },
           match: out.match, mismatch: out.mismatch, unreadable: out.unreadable };
}

/**
 * Rename a mismatch to its correct name AND fix the 04 shortcut that points at it, if any.
 * A statement renamed in 01/02 leaves its 04 shortcut showing the old name; this repairs both.
 */
function applySpotFix(fileId, newName) {
  var res = applyVerifyFix(fileId, newName);          // renames the real file, de-collides
  if (!res.ok) return res;

  // If this is a statement, re-point/rename its shortcut in 04.
  try {
    var m = res.to.match(/^(20\d{2})-(\d{2})_(?:FSE|RTM)_(?:BANK|CC)_/);
    if (m && typeof Drive !== 'undefined') {
      var cfg = getConfig(), rule04 = null;
      for (var i = 0; i < cfg.rules.length; i++)
        if (cfg.rules[i].active === 'YES' && String(cfg.rules[i].num).replace(/^0/, '') === '4') { rule04 = cfg.rules[i]; break; }
      if (rule04) {
        var root = DriveApp.getFolderById(rule04.folderId);
        var yIt = root.getFoldersByName(m[1]);
        if (yIt.hasNext()) {
          var mIt = yIt.next().getFoldersByName(m[1] + '-' + m[2]);
          if (mIt.hasNext()) {
            var mf = mIt.next(), sc = mf.getFiles();
            while (sc.hasNext()) {
              var s = sc.next();
              if (isShortcut(s) && s.getName() === res.from) { s.setName(res.to); res.shortcut = 'renamed'; break; }
            }
          }
        }
      }
    }
  } catch (e) { res.shortcutNote = 'File renamed; shortcut not updated: ' + e; }
  return res;
}

function openFolder(id) { try { return DriveApp.getFolderById(id); } catch (e) { return null; } }
function isShortcut(f) { try { return f.getMimeType() === 'application/vnd.google-apps.shortcut'; } catch (e) { return false; } }
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