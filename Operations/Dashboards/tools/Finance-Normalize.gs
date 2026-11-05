/**
 * SUBFOLDER NAMING NORMALIZATION
 * Brings existing subfolders into the 1b convention:
 *   - Pure renames to bare years (Recon 2024 -> 2024, 2024 Audit -> 2024, etc.)
 *   - 03 AP + 04 Recs: rename months to YYYY-MM AND nest them under a YEAR folder
 *
 * SAFETY:
 *   - DRY_RUN = true logs the plan, changes nothing.
 *   - Every rename verifies the folder's CURRENT name matches what we expect; mismatch = skip
 *     (so anything you've already renamed by hand is left alone).
 *   - Idempotent: already-correct names/locations are skipped. Re-runnable.
 *   - IDs never change, so SOP links are preserved.
 *   - Single log Sheet. Fail-soft.
 *
 * NOT touched: "Invoices and Checks 7200-7299" (per your call), the 2025 folder in 03,
 * REeBroker Reports (mixed types - needs a separate decision), and anything under an Archive folder.
 *
 * RUN: runNormalize()
 */

const DRY_RUN = true;   // set to false to execute

// [id, newName, expectedCurrentName] -- pure renames
const RENAMES = [
  // 12 Trust Recons (main)
  ['1GpEj4nwRsSyG6FN4bX0Wv-R9AlmDuI3q','2012','Recon 2012'],
  ['1cDofDap1i4KlcikNFj_b2--6MssraWCN','2013','Recon 2013'],
  ['13_XZXmriJz_UVU-wuv797o6j2Sm35IpD','2014','Recon 2014'],
  ['1Oa1177QtngxiLMNr9CAKjQnW7JIvRaxD','2015','Recon 2015'],
  ['1rbB_l-UXHMs1y1XJliJTxXM85CCnJLl1','2016','Recon 2016'],
  ['117TIhpnJiVkgU-I5pxYd1vVjY3-wvu5m','2017','Recon 2017'],
  ['1BwXyi4A_CrAADLb-nkEACrdDM914Fn0f','2018','Recon 2018'],
  ['1SsOtXTbxrFaLiC3gpSi-VUh8G5t_8mT5','2019','Recon 2019'],
  ['1liMHWoNaTdOzz1w3h-cfukm8eDzlLsZH','2020','Recon 2020'],
  ['1LldXTSwRb-uRMrB046-rMkwzjcTO5NqE','2021','Recon 2021'],
  ['1TxV3uqp9i31eZ4G8IbJIEaRsnHbX1kSQ','2022','Recon 2022'],
  ['1migSPq7UMfy65O5HeVoBkQg8p58S3mw6','2023','Recon 2023'],
  ['1lfOOufB3lkJEByFqgV4RUtuvIBfuqxDW','2024','Recon 2024'],
  ['1kaKhEEekZdSPNWGiVUK3VDRSAuFxTNF_','2025','Recon 2025'],
  ['1tCmefzOlmbD9wT-6j9ydQJa8B7NF3jcG','2026','Recon 2026'],
  // 12 Carlsbad (now inside the new Carlsbad parent)
  ['10v00dMq0MHCpkU7hJPSjOAcxCzr1N6dI','2021','Carlsbad Recon 2021'],
  ['116LXwUHVUJ62x6oQBhhp0CAAwkF_Q0nV','2022','Carlsbad Recon 2022'],
  ['1sKWybRK61dQJmRpoDAEMrWPYxeSATknv','2023','Carlsbad Recon 2023'],
  ['1t54poHrgGmDzXXcc9NOxKazTPAcpA9Tv','2024','Carlsbad Recon 2024'],
  // 13 Five Star Audits
  ['1v3KCQVWWr5UYSs084hVxudrmo5e-vwvM','2021','2021 Audit'],
  ['1ad1NUExRRxZPzk4FCLCvRhICdQBApxTP','2022','2022 Audit'],
  ['1Mf9HRV9suwQZgKIQMm1Q6jKfsvSHmvIB','2023','2023 Audit'],
  ['1jPIvkBQjhwakVSinISMyV0y_u50-YBKf','2024','2024 Audit'],
  ['1itDO_AJHuo8L9CXJaaiHMQTbxCHYutqp','2025','2025 Audit'],
  // 07 Sales Commission Reports (all -> bare years)
  ['14m5ww8OLMkNM7Z7qbbn6RdygCjl-d2Lp','2016','2016 Media Commission Reports'],
  ['1LfEdQTW9YFYBawWsAnyIKy9gP72UjdjF','2017','2017 Media Commission Reports'],
  ['1jfh_Iq4278wrBqZg3KHnzNOgGlrD_vGj','2018','2018 Media Commission Reports'],
  ['1PaPzQsKu57UVJVn_UA_5CAEMR_wKLzMr','2019','2019 Media and Sales Commission Reports'],
  ['1K3vBPFAyAurmWE0W10yoi89xUyTWlZJP','2020','2020 Sales Commission Reports'],
  ['1PGu0WoNiFrG8kxeuseWOpdfbcpCrYBAY','2021','2021 Sales Commission Reports'],
  ['14EGNEHzMXw5pFXWdrvehcenIW_oyrgxy','2022','2022 Sales Commission Reports'],
  ['1Cmkg1E32cvwB9RoorVBbaeSJUxMO1eNM','2023','2023 Sales Commissions'],
  ['1L_jMaoZlDeiSzW7TpAQff3LmD3njkmCp','2024','2024 Sales Commission Reports'],
  ['1XhH4S0kbQK2yyHd-cEETltCCil0KHSJR','2025','2025 Sales Commissions'],
  ['128tj-ju56kwvc0JepLIx-tfsdSXwh9RW','2026','2026 Sales Commission Reports'],
  // 07 We Revive Reports (Sage = We Revive)
  ['1ozRWeKjw1BcD7LRzN1YMdhYuse00bTE-','2026','We Revive 2026'],
  ['1ED0Gw3IqufcqUAsT8IMmjmn_9f8of0j3','2025','We Revive 2025'],
  ['1-CxCVp7RDN_CvbbeqioM_p39ARt6K5Mb','2024','Sage 2024'],
  ['1lc32eukA1bJD7rG7jyLEKsIN2pcXZ6sM','2023','Sage 2023'],
  ['1ntQavaeO_T3B8wCamSlXMRh-Xr4Bd7Fc','2022','Sage 2022'],
  ['1UBOa2Ex43CUMTe_gVVhwnrUSkcxMVK2T','2021','Sage 2021'],
  // 07 Dwell West Reports
  ['1RM-iUEinC1NXg9F7vYr35uASAvki2HZt','2026','2026 Dwell West'],
  ['19aJBzw__KdvGuQ010RKkZbfiSRicnYfR','2025','2025 Dwell West'],
  // 05 Financial Statements
  ['13dGHxMCJpfALaP9fk8lENdq5c1wn7sy4','2026','2026 Five Star Escrow Financial Statements']
];

// Month folders: rename to YYYY-MM AND nest under a YEAR folder created in the parent
const NEST = [
  { parentId:'1t3S7iWxyZI-1JSkSd_Jm4V30KTCX6fH3', year:'2026', months:[  // 03 AP
    ['1uy0LzOLPw8FGnBszMfJ8y3TV241QAp7Z','2026-01','January 2026'],
    ['1DlTyaALpNI-AIRs-hgccL079CSdk4TVv','2026-02','February 2026'],
    ['1FAaHUjEGGjA9oEpdgQkBum-l0OfKndU5','2026-03','March 2026'],
    ['16NFZfmbTVsutXhWD2BDKLmDXkpCX7h-6','2026-04','April 2026'],
    ['1rvPNrV_P7D-JN-PuPFdFz_4bJlRsW41-','2026-05','May 2026'],
    ['1LaDHBTPZGeAxBZCwjPCkpYHPTLNBez6l','2026-06','June 2026'],
    ['1njweO0YYSOHoyrCKvTPNOf2adyXiHkfn','2026-07','July 2026'],
    ['1s44MJ_JJz3D6O7RvyBXRjLq9cvAX6Zv1','2026-08','August 2026'],
    ['1PXxQgTw4em49DqYqN92XHn-Q7FE-Hu51','2026-09','September 2026'],
    ['1hu5VeRaGVHusnOlKDz4f5zySH56P86O8','2026-10','October 2026']
  ]},
  { parentId:'1jvd-dnJ3lbRkUytLfkNwygVj9FeqFBVM', year:'2026', months:[  // 04 Recs & Registers
    ['1cfRWCgLAF5Lnjhd-ap_xW-rpGq4yNHyC','2026-04','April 2026'],
    ['13XbOL8uI_WlFnW8EMalT7OObd4MwSceH','2026-05','May 2026'],
    ['1iZnFYd2xdBIqQi6kMX1_63rsx-KuYlrM','2026-06','June 2026']
  ]}
];

function runNormalize() {
  LOG.length = 0;
  log('NORMALIZE - DRY_RUN = ' + DRY_RUN + '  (' + new Date().toISOString() + ')');

  log('--- Renames ---');
  RENAMES.forEach(function (r) { rename(r[0], r[1], r[2]); });

  NEST.forEach(function (grp) {
    var parent = openFolder(grp.parentId);
    log('--- Nest ' + grp.year + ' months under ' + (parent ? parent.getName() : grp.parentId) + ' ---');
    if (!parent) return;
    var yearFolder = ensureChild(parent, grp.year);
    grp.months.forEach(function (m) {
      rename(m[0], m[1], m[2]);
      moveInto(m[0], yearFolder);
    });
  });

  saveLog();
}

// ---- helpers ----
var LOG = [];
function log(s) { LOG.push(s); Logger.log(s); }
function nm(x) { try { return x.getName(); } catch (e) { return '(new)'; } }
function openFolder(id) { try { return DriveApp.getFolderById(id); } catch (e) { log('  !! cannot open ' + id); return null; } }

function rename(id, newName, expected) {
  var f = openFolder(id); if (!f) return;
  var cur = f.getName();
  if (cur === newName) { log('  name ok "' + newName + '"'); return; }
  if (cur.trim() !== expected.trim()) { log('  SKIP (name is "' + cur + '", expected "' + expected + '") ' + id); return; }
  if (DRY_RUN) { log('  RENAME "' + cur + '" -> "' + newName + '"'); return; }
  try { f.setName(newName); log('  RENAMED "' + cur + '" -> "' + newName + '"'); }
  catch (e) { log('  !! rename failed "' + cur + '": ' + e.message); }
}

function ensureChild(parent, name) {
  if (!parent) return null;
  try { var it = parent.getFoldersByName(name); if (it.hasNext()) return it.next(); } catch (e) {}
  if (DRY_RUN) { log('  CREATE "' + name + '" in "' + nm(parent) + '"'); return { _stub: true, getName: function(){return name;} }; }
  var f = parent.createFolder(name); log('  CREATED "' + name + '"'); return f;
}

function moveInto(id, dest) {
  var f = openFolder(id); if (!f || !dest) return;
  if (dest._stub) { log('  MOVE "' + nm(f) + '" -> "' + nm(dest) + '"'); return; }
  var destId = dest.getId();
  try { var ps = f.getParents(); while (ps.hasNext()) { if (ps.next().getId() === destId) { log('  in place "' + nm(f) + '"'); return; } } } catch (e) {}
  if (DRY_RUN) { log('  MOVE "' + nm(f) + '" -> "' + nm(dest) + '"'); return; }
  try { f.moveTo(dest); log('  MOVED "' + nm(f) + '" -> "' + nm(dest) + '"'); }
  catch (e) { log('  !! move failed "' + nm(f) + '": ' + e.message); }
}

function saveLog() {
  var ss = SpreadsheetApp.create('Normalize Log - ' + (DRY_RUN ? 'DRY RUN' : 'LIVE') + ' - ' + new Date().toISOString().slice(0, 16));
  var rng = ss.getActiveSheet().getRange(1, 1, LOG.length, 1);
  rng.setNumberFormat('@');
  rng.setValues(LOG.map(function (l) { return [l]; }));
  Logger.log('LOG SHEET: ' + ss.getUrl());
}
