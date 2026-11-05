/**
 * SOP LINK INVENTORY
 * Walks the finance SOP Google Doc across ALL tabs (including nested child tabs),
 * extracts every hyperlink, classifies it (Drive folder / file / Doc / Sheet / external),
 * and writes two tables to a new Google Sheet:
 *   1) "All Links"       — every link occurrence with its tab + section + anchor text
 *   2) "By Folder/File"  — unique Drive IDs with occurrence counts (the triage list)
 *
 * WHY: after we move + rename folders in place, links to preserved folders keep working
 * (the Drive ID never changes). Only links to ELIMINATED folders break. This script makes
 * that break-set known instead of guessed.
 *
 * RUN: inventorySOPLinks()  →  the output Sheet URL prints to the execution log.
 */

const CONFIG = {
  DOC_ID: '1C6nchwkLnOsL3MWwTm2EVy6tsIRnWPzHR14wkNdWALs',
  OUTPUT_SHEET_NAME: 'SOP Link Inventory'
};

function inventorySOPLinks() {
  const doc = DocumentApp.openById(CONFIG.DOC_ID);
  const rows = [];
  safeGetTabs(doc).forEach(tab => processTab(tab, rows));
  writeOutput(rows);
}

/** Flat list of {title, body} for every tab, including nested child tabs.
 *  Falls back to the single body if the doc isn't tabbed. */
function safeGetTabs(doc) {
  const out = [];
  try {
    const top = doc.getTabs();
    if (top && top.length) {
      const recurse = (tab, prefix) => {
        const title = (prefix ? prefix + ' / ' : '') + tab.getTitle();
        out.push({ title: title, body: tab.asDocumentTab().getBody() });
        (tab.getChildTabs() || []).forEach(child => recurse(child, title));
      };
      top.forEach(t => recurse(t, ''));
      return out;
    }
  } catch (e) {
    // getTabs unavailable or doc not tabbed — fall through to single body
  }
  out.push({ title: '(single body)', body: doc.getBody() });
  return out;
}

/** Iterate a tab's top-level children, tracking the nearest heading for context. */
function processTab(tab, rows) {
  const body = tab.body;
  let currentHeading = '';
  const n = body.getNumChildren();
  for (let i = 0; i < n; i++) {
    const child = body.getChild(i);
    if (child.getType() === DocumentApp.ElementType.PARAGRAPH) {
      const p = child.asParagraph();
      if (p.getHeading() !== DocumentApp.ParagraphHeading.NORMAL) {
        const h = p.getText().trim();
        if (h) currentHeading = h;
      }
    }
    extractLinks(child, tab.title, currentHeading, rows);
  }
}

/** Recursively find TEXT descendants (paragraphs, list items, table cells) and pull links. */
function extractLinks(element, tabTitle, heading, rows) {
  if (element.getType() === DocumentApp.ElementType.TEXT) {
    collectFromText(element.asText(), tabTitle, heading, rows);
    return;
  }
  if (typeof element.getNumChildren === 'function') {
    const n = element.getNumChildren();
    for (let i = 0; i < n; i++) {
      extractLinks(element.getChild(i), tabTitle, heading, rows);
    }
  }
}

/** Scan a Text element's attribute runs; merge adjacent runs that share a URL. */
function collectFromText(textEl, tabTitle, heading, rows) {
  const str = textEl.getText();
  if (!str) return;
  const idx = textEl.getTextAttributeIndices();
  let run = null; // { url, start, end }
  for (let i = 0; i < idx.length; i++) {
    const start = idx[i];
    const end = (i + 1 < idx.length) ? idx[i + 1] - 1 : str.length - 1;
    const url = textEl.getLinkUrl(start);
    if (url) {
      if (run && run.url === url && start === run.end + 1) {
        run.end = end;
      } else {
        if (run) pushRun(run, str, tabTitle, heading, rows);
        run = { url: url, start: start, end: end };
      }
    } else if (run) {
      pushRun(run, str, tabTitle, heading, rows);
      run = null;
    }
  }
  if (run) pushRun(run, str, tabTitle, heading, rows);
}

function pushRun(run, str, tabTitle, heading, rows) {
  const anchor = str.substring(run.start, run.end + 1);
  const info = classify(run.url);
  rows.push([tabTitle, heading, anchor, run.url, info.category, info.id, '']);
}

/** Classify a URL and extract its Drive ID where present. */
function classify(url) {
  const patterns = [
    { re: /\/drive\/folders\/([-\w]{20,})/, cat: 'Drive folder' },
    { re: /folderview\?id=([-\w]{20,})/,    cat: 'Drive folder' },
    { re: /\/file\/d\/([-\w]{20,})/,        cat: 'Drive file' },
    { re: /[?&]id=([-\w]{20,})/,            cat: 'Drive file' },
    { re: /document\/d\/([-\w]{20,})/,      cat: 'Google Doc' },
    { re: /spreadsheets\/d\/([-\w]{20,})/,  cat: 'Google Sheet' },
    { re: /presentation\/d\/([-\w]{20,})/,  cat: 'Google Slides' }
  ];
  for (const p of patterns) {
    const m = url.match(p.re);
    if (m) return { category: p.cat, id: m[1] };
  }
  return { category: /^https?:\/\//.test(url) ? 'external' : 'other', id: '' };
}

function writeOutput(rows) {
  const stamp = new Date().toISOString().slice(0, 10);
  const ss = SpreadsheetApp.create(CONFIG.OUTPUT_SHEET_NAME + ' — ' + stamp);

  // Sheet 1 — every link occurrence
  const s1 = ss.getActiveSheet().setName('All Links');
  const h1 = ['Tab', 'Section (nearest heading)', 'Anchor text', 'URL', 'Category', 'Drive ID', 'Migration status'];
  s1.getRange(1, 1, 1, h1.length).setValues([h1]).setFontWeight('bold');
  if (rows.length) s1.getRange(2, 1, rows.length, h1.length).setValues(rows);
  s1.setFrozenRows(1);

  // Sheet 2 — unique Drive folders/files (the triage list)
  const byId = {};
  rows.forEach(r => {
    const cat = r[4], id = r[5];
    if (!id || cat === 'external' || cat === 'other') return;
    if (!byId[id]) byId[id] = { cat: cat, count: 0, sample: r[2], url: r[3] };
    byId[id].count++;
  });
  const summary = Object.keys(byId)
    .map(id => [id, byId[id].cat, byId[id].count, byId[id].sample, byId[id].url, ''])
    .sort((a, b) => b[2] - a[2]);

  const s2 = ss.insertSheet('By Folder/File');
  const h2 = ['Drive ID', 'Category', 'Occurrences', 'Sample anchor', 'URL', 'Status (preserved / relink)'];
  s2.getRange(1, 1, 1, h2.length).setValues([h2]).setFontWeight('bold');
  if (summary.length) s2.getRange(2, 1, summary.length, h2.length).setValues(summary);
  s2.setFrozenRows(1);

  Logger.log('Total link occurrences: ' + rows.length);
  Logger.log('Unique Drive folders/files: ' + summary.length);
  Logger.log('OUTPUT SHEET: ' + ss.getUrl());
}
