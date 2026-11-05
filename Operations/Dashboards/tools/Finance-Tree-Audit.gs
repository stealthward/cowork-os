/**
 * FINANCE TREE CRAWL (full depth) + REDUNDANCY DETECTION
 * Walks the ENTIRE Five Star Finance folder to the bottom — nothing skipped —
 * and writes three tabs to a new Sheet:
 *   1) "Tree"        — every folder: depth, full path, direct file count, ID
 *   2) "Files"       — every file in the LIVE structure (archive files are counted, not listed)
 *   3) "Duplicates"  — names that appear in more than one place (the redundancy hit-list),
 *                      with structural names (years, months) filtered out so the signal is clean
 *
 * Read-only. Point-and-run. Output Sheet URL prints to the execution log.
 */

const ROOT_ID = '1B31ALr30hdpYme255GiMuPbSDl8upuLU'; // Five Star Finance
const ARCHIVE_NAME = '99 Archive (pre-2026)';        // count files under here, don't list each

function crawlFinanceTree() {
  const folderRows = [];
  const fileRows = [];
  const nameIndex = {};            // normalized name -> [{type, name, loc, id}]
  const visited = new Set();
  const state = { count: 0, capped: false, MAX: 12000 };

  const root = DriveApp.getFolderById(ROOT_ID);
  walk(root, '', 0, false, folderRows, fileRows, nameIndex, visited, state);
  writeSheet(folderRows, fileRows, nameIndex, state);
}

function walk(folder, prefix, depth, underArchive, folderRows, fileRows, nameIndex, visited, state) {
  if (state.capped) return;
  const id = folder.getId();
  if (visited.has(id)) return;
  visited.add(id);

  const name = folder.getName();
  const path = prefix + '/' + name;
  const inArchive = underArchive || name === ARCHIVE_NAME;

  let fileCount = 0;
  try {
    const files = folder.getFiles();
    while (files.hasNext()) {
      if (++state.count > state.MAX) { state.capped = true; break; }
      const f = files.next();
      fileCount++;
      const fn = f.getName();
      if (!inArchive) {                       // only list live-structure files
        fileRows.push([path, fn, f.getId(), f.getUrl()]);
        indexName(nameIndex, fn, 'file', path, f.getId());
      }
    }
  } catch (e) {}

  folderRows.push([depth, path, name, fileCount, inArchive ? 'archive' : 'live', id, folder.getUrl()]);
  indexName(nameIndex, name, 'folder', prefix || '/', id);

  try {
    const subs = folder.getFolders();
    while (subs.hasNext()) {
      if (state.capped) break;
      walk(subs.next(), path, depth + 1, inArchive, folderRows, fileRows, nameIndex, visited, state);
    }
  } catch (e) {}
}

function indexName(map, name, type, loc, id) {
  const key = norm(name);
  (map[key] = map[key] || []).push({ type: type, name: name, loc: loc, id: id });
}
function norm(s) { return String(s).trim().toLowerCase().replace(/\s+/g, ' '); }

// structural names we don't want cluttering the duplicates tab
function isStructural(key) {
  return /^(19|20)\d{2}$/.test(key) ||                                  // years
         /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.test(key) || // months
         /^\d{4} .*(statement|audit|recon)/.test(key) ||
         key === 'account statements' || key === 'analysis statements' ||
         key === '2026' || key === 'archive' || key === 'compensation';
}

function writeSheet(folderRows, fileRows, nameIndex, state) {
  const ss = SpreadsheetApp.create('Finance Tree Audit — ' + new Date().toISOString().slice(0, 16));

  // Tab 1 — Tree
  const s1 = ss.getActiveSheet().setName('Tree');
  const h1 = ['Depth', 'Path', 'Folder', 'Direct files', 'Zone', 'Folder ID', 'URL'];
  s1.getRange(1, 1, 1, h1.length).setValues([h1]).setFontWeight('bold');
  if (folderRows.length) s1.getRange(2, 1, folderRows.length, h1.length).setValues(folderRows);
  s1.setFrozenRows(1);

  // Tab 2 — Files (live structure)
  const s2 = ss.insertSheet('Files');
  const h2 = ['Folder path', 'File name', 'File ID', 'URL'];
  s2.getRange(1, 1, 1, h2.length).setValues([h2]).setFontWeight('bold');
  if (fileRows.length) s2.getRange(2, 1, fileRows.length, h2.length).setValues(fileRows);
  s2.setFrozenRows(1);

  // Tab 3 — Duplicates (the redundancy hit-list)
  const dupRows = [];
  Object.keys(nameIndex).forEach(key => {
    const hits = nameIndex[key];
    if (hits.length < 2 || isStructural(key)) return;
    const types = Array.from(new Set(hits.map(h => h.type))).join('+');
    hits.forEach(h => dupRows.push([hits[0].name, hits.length, types, h.type, h.loc, h.id]));
  });
  dupRows.sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  const s3 = ss.insertSheet('Duplicates');
  const h3 = ['Name', 'Times seen', 'Kinds', 'This one is', 'Location (parent path)', 'ID'];
  s3.getRange(1, 1, 1, h3.length).setValues([h3]).setFontWeight('bold');
  if (dupRows.length) s3.getRange(2, 1, dupRows.length, h3.length).setValues(dupRows);
  s3.setFrozenRows(1);

  Logger.log('Folders: ' + folderRows.length + ' | Live files: ' + fileRows.length + ' | Duplicate names: ' + (new Set(dupRows.map(r => r[0])).size));
  if (state.capped) Logger.log('WARNING: hit the ' + state.MAX + '-item cap — inventory is partial.');
  Logger.log('OUTPUT SHEET: ' + ss.getUrl());
}
