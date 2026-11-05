/**
 * FINANCE DRIVE MIGRATION
 * Executes the reorg in Finance-Records-Structure-Spec §4:
 *   Phase 1 — FSE reorg (rename in place, create parents, move folders, build subfolders)
 *   Phase 2 — RTM scaffold + move Nano/CB&T invoices in
 *   Phase 3 — Extract stale banking + legacy finance + Recons out of the Five Star Management drive
 *
 * SAFE BY DESIGN:
 *   - DRY_RUN = true logs every action and changes NOTHING. Review, then set false and re-run.
 *   - Idempotent: skips folders already named/placed correctly, so re-running is safe.
 *   - Every op is wrapped — a single failure logs and continues instead of aborting.
 *   - All moves preserve folder IDs, so existing SOP links keep working.
 *
 * RUN: runMigration()  (or a single phase: phase1_FSE / phase2_RTM / phase3_Management)
 * A full log prints to the execution log AND is saved to a new "Migration Log" Sheet.
 *
 * NOTE: cross-drive folder moves require you to be a Manager on both shared drives.
 */

const DRY_RUN = true;   // <-- leave true for the first run. Set to false to execute.

const CFG = {
  FSE_FINANCE: '1B31ALr30hdpYme255GiMuPbSDl8upuLU',   // "Five Star Finance" (5 Star Ownership drive)
  RTM_FINANCE: '1cwf_OMUNo_u1i0-cTarYo6PweX295nf0',   // "Real Talk Finance" (RTM Ownership drive)

  f: { // folders/files already in / under FSE Finance
    bankStmts:     '1QYRrHPDYGeaobxQr2eSaUBHk78NRRpvv',
    ccStmts:       '1zXE5xxY6pEf8ZnByeGHd3bjwMH4bo_AV',
    chase:         '1Rfh21tovv9Z-zSm9ncahhXMS2HeiPdfO',
    capone:        '15YRVvbbxq0uMMQHSCL7h71QR0llQQasJ',
    invoices:      '1t3S7iWxyZI-1JSkSd_Jm4V30KTCX6fH3',
    recsRegisters: '11HitwRhlH-NZPpbDpl0CIZpOO_nytUsB',
    financials:    '17s7nzVnlIah5kFGUiT9kVaewcoogs18a',
    tax:           '1hf0jNL_LZpnkvzgZDHp6eXKrHFwvVKfQ',
    insurance:     '1ClDGH4WYzSKPKDlE2DHmd3CkbrgUG0wp',
    werevive:      '1kZQ8BmJ3gE6El-26guedZOXQHuz6IYq9',
    salesComm:     '17wW9LaCVkEFHTGBGSBE1CNLR1FXpqwlO',
    partners:      '1QPCqsNpuYNRohdfLxk1-BBLbgBchkR4f',
    k401:          '1W4rOgnl0pD9jQyHv8F9d-iLDwauOKRZT',
    offerLetters:  '1jGih42EqK6JidKdAMEqwdZGhc3j1Ur04',
    bonuses:       '1zoKOdHHK1Qc0U9t-JBkt67hW8swbuZwZOMy1rjwQZpU',
    propTax:       '1gXxaEIrbQF5ARy-O-StEDReEU1ID9k29',
    audit:         '1bvUQbJBZPMzwKPISlAIeY9-pAcL1opR2',
    erc:           '1CqMgK_p6ghuIO8734_md8NqJlG1-piAp',
    ppp:           '1tjTkf3UB8ZzFMy38sy_QbZCpjiaow7XH',
    dfpiNotice:    '1ANAPSJ82oTFP0mAulmHWTeiXk4QnGatM',
    nanoInvoices:  '18FNCXxS2NFKoIycNMXAG9Z3WWYhb3-z_',   // → RTM (RTM issued)
    cbtInvoices:   '1jzBsjK7V7U4THKq_hlGPBWndRhZV8tQj'     // → RTM (RTM issued)
  },

  mgmt: { // in the Five Star Management drive (0AOFRHPXATtZMUk9PVA)
    silvergate:    '1wiT3I8grXsDduM1hWi9qnJCCH2CR_aeD',
    botw:          '1O_0UqdvPzjiiOhk7sHKcmYsI0RpA961V',
    nano:          '1Be55TLDoAd0hIFf9Hcazessk25Gs6Wv0',
    nanoLoose:     '1dhMvJb_EfUTO2opgLju_wVbqs1Zchk-3',
    accounting:    '1E26gMfghEnQZylSWpTDAydW8B-wJy_9p',
    banking:       '1tWJPLjasMUNKEJQkp6ZnaZPotpcYXk3C',
    financeLegacy: '1ANQK4q3rViY7tjqflDvoRruVW-GzK24b',
    rtmAmazon:     '1xA3lMUcgNyfvShqzML7naU6_cQ1Pm9s5',   // active → RTM
    authDoc:       '1G1-2Bo1Nf0VUFouOcO33aGfUNCWjqLDT9PylQfx3q9A', // active → FSE Corporate
    recons:        '1jvd-dnJ3lbRkUytLfkNwygVj9FeqFBVM'     // live → FSE 04
  }
};

// ---- run entry points ----
function runMigration() { LOG.length = 0; banner(); phase1_FSE(); phase2_RTM(); phase3_Management(); saveLog(); }
function phase1_FSE()   { if (!LOG.length) banner(); _p1(); if (arguments.length === 0) saveLog(); }
function phase2_RTM()   { if (!LOG.length) banner(); _p2(); if (arguments.length === 0) saveLog(); }
function phase3_Management() { if (!LOG.length) banner(); _p3(); if (arguments.length === 0) saveLog(); }

function _p1() {
  const FIN = DriveApp.getFolderById(CFG.FSE_FINANCE);
  log('=== PHASE 1: FSE reorg ===');

  rename(CFG.f.bankStmts, '01 Bank Statements');
  rename(CFG.f.ccStmts,   '02 Credit Card Statements');
  rename(CFG.f.invoices,  '03 AP - Invoices & Checks');
  rename(CFG.f.financials,'05 Financial Statements');
  rename(CFG.f.tax,       '08 Tax');
  rename(CFG.f.insurance, '10 Insurance');

  const commissions = child(FIN, '06 Commissions');
  const payroll     = child(FIN, '07 Payroll & Benefits');
  const loans       = child(FIN, '09 Loans & Financing');
  const corp        = child(FIN, '11 Corporate & Licenses');
  const archive     = child(FIN, '99 Archive (pre-2026)');
  child(archive, 'Bank Statements');

  move(CFG.f.werevive,  commissions);
  move(CFG.f.salesComm, commissions);
  move(CFG.f.partners,  commissions);

  move(CFG.f.k401, payroll);
  const comp = child(payroll, 'Compensation');
  move(CFG.f.offerLetters, comp);
  move(CFG.f.bonuses,      comp);

  const tax = open(CFG.f.tax);
  if (tax) { move(CFG.f.propTax, tax); move(CFG.f.audit, tax); move(CFG.f.erc, tax); }

  move(CFG.f.ppp, loans);
  move(CFG.f.dfpiNotice, corp);

  const bank = open(CFG.f.bankStmts);
  if (bank) ['CBT-Operating','CBT-Savings-2274','CBT-Savings-0678','CBT-Trust']
    .forEach(a => child(child(bank, a), '2026'));
  const chase = open(CFG.f.chase); if (chase) child(chase, '2026');
  const cap   = open(CFG.f.capone); if (cap) child(cap, '2026');
}

function _p2() {
  const RTM = DriveApp.getFolderById(CFG.RTM_FINANCE);
  log('=== PHASE 2: RTM scaffold + moves ===');
  child(child(child(RTM, '01 Bank Statements'), 'WellsFargo'), '2026');
  child(child(child(RTM, '02 Credit Card Statements'), 'AmazonChase'), '2026');
  const ar = child(RTM, '03 Invoices Issued (AR)');
  child(child(RTM, '04 Recs'), '2026');
  child(child(RTM, '05 Commissions'), '2026');
  child(child(RTM, '06 Billing - Stripe'), '2026');
  child(RTM, '07 Tax & Corporate');
  child(RTM, '99 Archive');
  move(CFG.f.nanoInvoices, ar);   // cross-drive
  move(CFG.f.cbtInvoices,  ar);   // cross-drive
}

function _p3() {
  const FIN = DriveApp.getFolderById(CFG.FSE_FINANCE);
  const RTM = DriveApp.getFolderById(CFG.RTM_FINANCE);
  const archive = child(FIN, '99 Archive (pre-2026)');
  const archiveBank = child(archive, 'Bank Statements');
  const corp = child(FIN, '11 Corporate & Licenses');
  log('=== PHASE 3: Five Star Management extraction ===');

  // bank statements out of Management
  move(CFG.mgmt.silvergate, archiveBank);
  move(CFG.mgmt.botw,       archiveBank);
  move(CFG.mgmt.nano,       archiveBank);
  move(CFG.mgmt.nanoLoose,  archiveBank);

  // pull the two ACTIVE items out of the legacy finance folder first
  move(CFG.mgmt.rtmAmazon, RTM);
  move(CFG.mgmt.authDoc,   corp);

  // legacy finance folders → archive
  move(CFG.mgmt.accounting,    archive);
  move(CFG.mgmt.banking,       archive);
  move(CFG.mgmt.financeLegacy, archive);

  // Recons → live top-level 04, with current recs/registers nested inside
  rename(CFG.mgmt.recons, '04 Recs & Registers');
  move(CFG.mgmt.recons, FIN);
  const recons = open(CFG.mgmt.recons);
  if (recons) move(CFG.f.recsRegisters, recons);
}

// ---- helpers ----
const LOG = [];
function banner() { log('MIGRATION — DRY_RUN = ' + DRY_RUN + '  (' + new Date().toISOString() + ')'); }
function log(s) { LOG.push(s); Logger.log(s); }

function open(id) {
  try { return DriveApp.getFolderById(id); } catch (e) {}
  try { return DriveApp.getFileById(id); } catch (e) {}
  log('  !! cannot open ' + id);
  return null;
}
function nm(x) { try { return x.getName(); } catch (e) { return '(new)'; } }

function child(parent, name) {          // idempotent create; returns folder (or a stub in dry-run)
  if (!parent) return null;
  try {
    const it = parent.getFoldersByName(name);
    if (it.hasNext()) return it.next();
  } catch (e) {}
  if (DRY_RUN) { log('  CREATE  "' + name + '" in "' + nm(parent) + '"'); return stub(name); }
  const f = parent.createFolder(name); log('  CREATED "' + name + '"'); return f;
}
function stub(name) { return { _stub: true, getName: () => name, getFoldersByName: () => ({ hasNext: () => false }), createFolder: n => stub(n) }; }

function rename(id, newName) {
  const f = open(id); if (!f) return;
  const cur = nm(f);
  if (cur === newName) { log('  name ok "' + newName + '"'); return; }
  if (DRY_RUN) { log('  RENAME  "' + cur + '" -> "' + newName + '"'); return; }
  try { f.setName(newName); log('  RENAMED "' + cur + '" -> "' + newName + '"'); }
  catch (e) { log('  !! rename failed "' + cur + '": ' + e.message); }
}

function move(id, dest) {
  const it = open(id); if (!it || !dest) return;
  const name = nm(it);
  if (DRY_RUN || dest._stub) { log('  MOVE    "' + name + '" -> "' + nm(dest) + '"'); return; }
  try { it.moveTo(dest); log('  MOVED   "' + name + '" -> "' + nm(dest) + '"'); }
  catch (e) { log('  !! move failed "' + name + '": ' + e.message); }
}

function saveLog() {
  const ss = SpreadsheetApp.create('Migration Log — ' + (DRY_RUN ? 'DRY RUN' : 'LIVE') + ' — ' + new Date().toISOString().slice(0, 16));
  const rows = LOG.map(l => [l]);
  ss.getActiveSheet().getRange(1, 1, rows.length, 1).setValues(rows);
  Logger.log('LOG SHEET: ' + ss.getUrl());
}
