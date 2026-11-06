/**
 * HISTORICAL STATEMENT CRAWL
 * Walks the legacy locations where old bank statements live, classifies every
 * folder/file by bank + year, and writes an inventory to a new Google Sheet:
 *   1) "Folders"  — the pick-list: path, bank, years, file count, folder ID
 *   2) "Files"    — every file (so loose statements are visible), with bank + year
 *   3) "By Bank"  — summary counts per bank
 *
 * Read-only. Moves nothing. This is the map we build the archive sweep from.
 *
 * SETUP: none — uses DriveApp. Just paste, save, run crawlHistoricalStatements().
 * The output Sheet URL prints to the execution log.
 */

const ROOTS = [
  { id: '0AOFRHPXATtZMUk9PVA',                  label: 'Old Five Star drive' },   // whole legacy shared drive
  { id: '1m-4U9_wjeCmfgC2h45AnuWE0znJ7_Pf4',    label: 'Silvergate hub' },        // 2016–2020 by-year + loose
  { id: '0B-ddB3YsQx9cRkdfMEFLcUlmNzA',         label: 'My Drive Silvergate copy' }
];

// Branches to NOT descend into (non-finance / legal-hold / HR).
const SKIP_NAME = /subpoena|interview|former employees|meeting agenda|data backup/i;

const MAX_ITEMS = 8000; // safety cap

function crawlHistoricalStatements() {
  const folderRows = [];
  const fileRows = [];
  const visited = new Set();
  const state = { count: 0, capped: false };

  ROOTS.forEach(root => {
    let start;
    try {
      start = DriveApp.getFolderById(root.id);
    } catch (e) {
      folderRows.push([root.label, '(could not open — check access/resourceKey)', root.id, '', '', '', root.id, '']);
      return;
    }
    crawl(start, '', root.label, folderRows, fileRows, visited, state);
  });

  writeSheet(folderRows, fileRows, state);
}

function crawl(folder, prefix, rootLabel, folderRows, fileRows, visited, state) {
  if (state.capped) return;
  const id = folder.getId();
  if (visited.has(id)) return;
  visited.add(id);

  const name = folder.getName();
  if (SKIP_NAME.test(name)) return;                 // don't descend into excluded branches
  const path = prefix + '/' + name;

  // Files in this folder
  let fileCount = 0;
  try {
    const files = folder.getFiles();
    while (files.hasNext()) {
      if (++state.count > MAX_ITEMS) { state.capped = true; break; }
      const f = files.next();
      const nm = f.getName();
      fileCount++;
      fileRows.push([rootLabel, path, nm, guessBank(nm + ' ' + path), guessYears(nm), f.getId(), f.getUrl()]);
    }
  } catch (e) { /* skip unreadable */ }

  folderRows.push([rootLabel, path, name, guessBank(name + ' ' + path), guessYears(name), fileCount, id, folder.getUrl()]);

  // Recurse
  try {
    const subs = folder.getFolders();
    while (subs.hasNext()) {
      if (state.capped) break;
      crawl(subs.next(), path, rootLabel, folderRows, fileRows, visited, state);
    }
  } catch (e) { /* skip unreadable */ }
}

function guessBank(s) {
  s = s.toLowerCase();
  if (/silvergate|sivergate|\bsg\b/.test(s)) return 'Silvergate';
  if (/bank of the west|\bbotw\b/.test(s))   return 'Bank of the West';
  if (/nano/.test(s))                        return 'Nano Banc';
  if (/cb&t|\bcbt\b|cal(ifornia)? bank|calbanktrust/.test(s)) return 'CB&T';
  if (/chase/.test(s))                       return 'Chase';
  if (/capital ?one/.test(s))                return 'Capital One';
  if (/wells ?fargo/.test(s))                return 'Wells Fargo';
  return '';
}

function guessYears(s) {
  const m = (s || '').match(/20[0-2]\d/g);
  return m ? Array.from(new Set(m)).sort().join(', ') : '';
}

function writeSheet(folderRows, fileRows, state) {
  const ss = SpreadsheetApp.create('Historical Statement Inventory — ' + new Date().toISOString().slice(0, 10));

  // Tab 1 — Folders (pick-list)
  const s1 = ss.getActiveSheet().setName('Folders');
  const h1 = ['Source root', 'Path', 'Folder name', 'Bank', 'Years', 'File count', 'Folder ID', 'URL'];
  s1.getRange(1, 1, 1, h1.length).setValues([h1]).setFontWeight('bold');
  if (folderRows.length) s1.getRange(2, 1, folderRows.length, h1.length).setValues(folderRows);
  s1.setFrozenRows(1);

  // Tab 2 — Files (detail; surfaces loose statements)
  const s2 = ss.insertSheet('Files');
  const h2 = ['Source root', 'Folder path', 'File name', 'Bank', 'Year(s)', 'File ID', 'URL'];
  s2.getRange(1, 1, 1, h2.length).setValues([h2]).setFontWeight('bold');
  if (fileRows.length) s2.getRange(2, 1, fileRows.length, h2.length).setValues(fileRows);
  s2.setFrozenRows(1);

  // Tab 3 — By Bank summary
  const byBank = {};
  folderRows.forEach(r => { const b = r[3] || '(unclassified)'; byBank[b] = byBank[b] || { folders: 0, files: 0 }; byBank[b].folders++; byBank[b].files += Number(r[5]) || 0; });
  fileRows.forEach(r => { /* files already counted via folder file counts; skip double-count */ });
  const s3 = ss.insertSheet('By Bank');
  const h3 = ['Bank', 'Folders', 'Files'];
  s3.getRange(1, 1, 1, h3.length).setValues([h3]).setFontWeight('bold');
  const sum = Object.keys(byBank).map(b => [b, byBank[b].folders, byBank[b].files]).sort((a, b) => b[2] - a[2]);
  if (sum.length) s3.getRange(2, 1, sum.length, h3.length).setValues(sum);
  s3.setFrozenRows(1);

  Logger.log('Folders inventoried: ' + folderRows.length);
  Logger.log('Files inventoried: ' + fileRows.length);
  if (state.capped) Logger.log('WARNING: hit the ' + MAX_ITEMS + '-item cap — inventory is partial.');
  Logger.log('OUTPUT SHEET: ' + ss.getUrl());
}
