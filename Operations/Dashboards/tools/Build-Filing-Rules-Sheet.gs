/**
 * BUILD FILING RULES SHEET
 * Run ONCE. Creates "Finance Filing Rules" in 00 Reference -- the routing table the
 * watcher and the Claude filing Skill both read. After this, Felicia edits the Sheet;
 * nobody edits code.
 *
 * RUN: buildRulesSheet()   -> prints the Sheet URL. Save that URL; the watcher needs it.
 */

var REFERENCE_FOLDER = '1XsHLakFqbVlE0d77oNBzNn1MlexHv_DS'; // 00 Reference

function buildRulesSheet() {
  var ss = SpreadsheetApp.create('Finance Filing Rules');
  DriveApp.getFileById(ss.getId()).moveTo(DriveApp.getFolderById(REFERENCE_FOLDER));

  buildRulesTab(ss);
  buildVendorTab(ss);
  buildReadMeTab(ss);

  Logger.log('RULES SHEET: ' + ss.getUrl());
  Logger.log('Copy that URL/ID into the watcher script (RULES_SHEET_ID).');
}

function buildRulesTab(ss) {
  var sh = ss.getActiveSheet().setName('Rules');
  var headers = ['Active','Folder #','Folder Name','Folder ID','Depth Pattern','Entity','Type','Descriptor Source','Date Source','Notes'];

  var rows = [
    ['NO','00','Reference','1XsHLakFqbVlE0d77oNBzNn1MlexHv_DS','','','','','','Excluded - no records'],
    ['YES','01','Bank Statements','1QYRrHPDYGeaobxQr2eSaUBHk78NRRpvv','[ACCT]/[YYYY]','FSE','BANK','FOLDER_ACCT','FILENAME_MONTH','Acct token from folder name'],
    ['YES','02','Credit Card Statements','1zXE5xxY6pEf8ZnByeGHd3bjwMH4bo_AV','[ACCT]/[YYYY]','FSE','CC','FOLDER_ACCT','FILENAME_MONTH','Acct token from folder name'],
    ['YES','03','AP - Invoices & Checks','1t3S7iWxyZI-1JSkSd_Jm4V30KTCX6fH3','[YYYY]/[YYYY-MM]','FSE','AP','VENDOR','FOLDER_MONTH','Vendor from filename; see Vendors tab'],
    ['NO','04','Recs & Registers','1jvd-dnJ3lbRkUytLfkNwygVj9FeqFBVM','[YYYY]/[YYYY-MM]','FSE','REC','','FOLDER_MONTH','TBD - blocked on shortcuts vs duplicate statements'],
    ['YES','05','Financial Statements','17s7nzVnlIah5kFGUiT9kVaewcoogs18a','[YYYY]','FSE','FIN','NONE','FILENAME_MONTH','Landmark monthly compilations'],
    ['YES','06','Trust Recons','10oIqj6YX204nY3RA16kqtG7aK6-OXUmt','[YYYY]','FSE','REC','FIXED:Trust','FILENAME_MONTH','Carlsbad subtree -> FIXED:Trust-Carlsbad'],
    ['YES','07','Commissions & Partners','1mSjIsfcvuxy-JYo3VSYk3nU4kQ6_Q_2R','*/[YYYY]','FSE','COMM','FOLDER_PARENT','FILENAME_MONTH','Sales Commission Reports -> Sales; Partner folder -> partner name'],
    ['NO','08','Compensation & Benefits','1QhgKPx5BwS16LUfWIDUfny6pxJK5RoS0','','','','','','Excluded - per-employee HR docs, no date rule fits'],
    ['YES','09','CPA','1sOJOb8-CUYxUHZEqXa-_i_1EZrw-zEd8','[FLAT]','FSE','CPA','FILENAME','FILENAME_DATE','Notices, agreements, memos'],
    ['YES','10','Tax','1hf0jNL_LZpnkvzgZDHp6eXKrHFwvVKfQ','*/[YYYY]','FSE','TAX','FILENAME','FILENAME_YEAR','Year-level records'],
    ['YES','11','Five Star Audits','1er-uNQyxCWT-UdtmYahdvdt1T6i9rPlf','[YYYY]','FSE','AUDIT','FILENAME','FOLDER_YEAR','Year from folder'],
    ['YES','12','Corporate & Licenses','1Jv-WULAsYftdxpzXVU8wMOlJG7dQEszr','[FLAT]','FSE','CORP','FILENAME','FILENAME_DATE','Notices, agreements, memos'],
    ['NO','13','Quickbooks Backups','1UwyTar1jFnVqjBMpxMSVI8thtFmNpWPh','[YYYY]','FSE','','','','Excluded - QB names its own backups'],
    ['YES','14','Loans & Financing','176YImSIum4UojJ-eeLONvnBC6XwHPcyX','*/[FLAT]','FSE','LOAN','FILENAME','FILENAME_DATE','Dormant; PPP only']
  ];

  sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#e8eaed');
  sh.getRange(2,1,rows.length,headers.length).setValues(rows);
  sh.setFrozenRows(1);
  sh.getRange(2,1,rows.length,1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(['YES','NO'], true).build());
  // grey out inactive rows
  for (var i = 0; i < rows.length; i++) {
    if (rows[i][0] === 'NO') sh.getRange(i+2,1,1,headers.length).setBackground('#f3f3f3').setFontColor('#999999');
  }
  [60,70,220,300,150,70,80,140,140,320].forEach(function(w,i){ sh.setColumnWidth(i+1,w); });
}

function buildVendorTab(ss) {
  var sh = ss.insertSheet('Vendors');
  var headers = ['Match (text in filename)','Canonical Vendor Token','Account Key Rule','Notes'];
  var rows = [
    ['first american','First-American','ACCT_FROM_FILENAME:21219|22067','Native file "21219_837603"; legacy: "software" in name = 22067, else 21219'],
    ['canon','Canon','',''],
    ['anthropic','Anthropic','',''],
    ['greenfolders','Greenfolders','',''],
    ['scoreapp','ScoreApp','',''],
    ['landmark','Landmark','',''],
    ['lee keary','Lee-Keary','',''],
    ['dfpi','DFPI','','Regulatory invoice']
  ];
  sh.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold').setBackground('#e8eaed');
  sh.getRange(2,1,rows.length,headers.length).setValues(rows);
  sh.setFrozenRows(1);
  [240,220,260,420].forEach(function(w,i){ sh.setColumnWidth(i+1,w); });
}

function buildReadMeTab(ss) {
  var sh = ss.insertSheet('Read Me');
  var lines = [
    ['Finance Filing Rules - how this works'],
    [''],
    ['This Sheet drives automated filing. The watcher script and the Claude filing Skill both read it.'],
    ['To change how files are named, edit this Sheet. Do not edit code.'],
    [''],
    ['NAMING PATTERN:  YYYY-MM_ENTITY_TYPE_Descriptor       (or YYYY-MM-DD_... for dated docs)'],
    ['Keep names as short as possible without losing context. Drop redundant words.'],
    ['TYPE vocabulary (closed - do not invent new codes):'],
    ['   BANK, CC, AP, AR, REC, REG, FIN, COMM, PAY, TAX, AUDIT, CORP, CPA, LOAN'],
    [''],
    ['RULES TAB COLUMNS'],
    ['Active               YES = the watcher files this folder. NO = left alone.'],
    ['Depth Pattern        Where files live under the folder. [FLAT] = directly inside. * = any subfolder.'],
    ['Descriptor Source    Where the descriptor comes from:'],
    ['                       FOLDER_ACCT    - the account/card folder name (e.g. CBT-Trust)'],
    ['                       FOLDER_PARENT  - the parent folder name (e.g. a partner name)'],
    ['                       VENDOR         - matched from the filename via the Vendors tab'],
    ['                       FILENAME       - cleaned from the existing filename'],
    ['                       FIXED:xyz      - always the literal text xyz'],
    ['                       NONE           - no descriptor'],
    ['Date Source          Where the date comes from:'],
    ['                       FOLDER_MONTH   - the YYYY-MM folder it sits in'],
    ['                       FOLDER_YEAR    - the YYYY folder it sits in'],
    ['                       FILENAME_MONTH - month parsed from the filename'],
    ['                       FILENAME_DATE  - full date parsed from the filename'],
    ['                       FILENAME_YEAR  - year parsed from the filename'],
    [''],
    ['IF A FILE CANNOT BE NAMED, it is not guessed. It is renamed with a RENAME flag:'],
    ['   2026-05_FSE_AP_RENAME_original-name'],
    ['Search Drive for "RENAME" to find every file still needing a descriptor.'],
    [''],
    ['HOW TO FILE:  drop the ORIGINAL downloaded file into the right folder. Do not rename it.'],
    ['The watcher renames it automatically.'],
    [''],
    ['MAINTENANCE'],
    ['- New year: create the [YYYY] folder. The watcher finds it automatically.'],
    ['- New vendor: add a row to the Vendors tab.'],
    ['- New record type: add a row here and set Active = YES.'],
    ['- 04 Recs & Registers is TBD pending the shortcuts-vs-duplicate-statements decision.'],
    ['- Archive subfolders are always skipped. Only 2026-forward is on convention.']
  ];
  sh.getRange(1,1,lines.length,1).setValues(lines);
  sh.getRange(1,1).setFontWeight('bold').setFontSize(12);
  sh.setColumnWidth(1, 760);
}
