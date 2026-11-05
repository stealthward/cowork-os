/**
 * San Diego Investor Registry — Apps Script backend (v3)
 * Bound to the "Investor_Registry_DB" Google Sheet.
 * Deploy as Web app: Execute as "Me", Access "Anyone with Google account".
 * Access control = per-partner access keys on the Partners tab (column access_key). Link = <web app URL>?key=<access_key>.
 *
 * Tabs: Entities, Contacts (one row per person), ContactLinks (contact_id ↔ entity_id, role), Relationships, Notes,
 *       Partners, Activity (user activity log), Deleted (archive of deleted records with reason), Config.
 */

const SHEETS = { entities: 'Entities', contacts: 'Contacts', links: 'ContactLinks', rel: 'Relationships', notes: 'Notes', partners: 'Partners', activity: 'Activity', deleted: 'Deleted', config: 'Config' };
const TITLE_RE = /^(managing |general |limited |sole )?(member|partner|manager|owner|principal|president|ceo|cfo|coo|founder|co-?founder|trustee|officer|director|agent|listing agent|broker|acquisitions?( manager)?|contact|vp|vice president)$/i;

function doGet(e) {
  const key = (e && e.parameter && e.parameter.key) ? String(e.parameter.key).replace(/[^A-Za-z0-9_-]/g, '') : '';
  const t = HtmlService.createTemplateFromFile('Index');
  t.key = key;
  return t.evaluate()
    .setTitle(cfg('title') || 'San Diego Investor Registry')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ---------- helpers ----------
function ss() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sh(name) { const s = ss().getSheetByName(name); if (!s) throw new Error('Missing tab: ' + name); return s; }
function readTab(name) {
  const s = ss().getSheetByName(name); if (!s) return [];
  const v = s.getDataRange().getValues(); if (v.length < 2) return [];
  const h = v[0].map(String); return v.slice(1).filter(r => r.some(x => x !== '')).map(r => { const o = {}; h.forEach((k, i) => o[k] = r[i]); return o; });
}
function cfg(key) { const rows = readTab(SHEETS.config); const r = rows.find(x => x.key === key); return r ? String(r.value) : ''; }
let CURRENT_KEY = '';
function me(key) {
  if (key !== undefined) CURRENT_KEY = String(key || '');
  const email = (Session.getActiveUser().getEmail() || '').toLowerCase();
  const admins = (cfg('admin_emails') + ',' + cfg('owner_email')).toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const adminKey = cfg('admin_key');
  const partners = readTab(SHEETS.partners).filter(p => p.id);
  const byKey = CURRENT_KEY ? partners.find(p => String(p.access_key || '') === CURRENT_KEY) : null;
  const byEmail = email ? partners.find(p => String(p.email || '').toLowerCase() === email) : null;
  const mine = byKey || byEmail;
  const isAdmin = (email && admins.includes(email)) || (adminKey && CURRENT_KEY === adminKey) || !!(mine && mine.can_edit_all === true);
  const who = mine ? mine.name : (email || 'unknown');
  if (!mine && !isAdmin) throw new Error('This link is not valid. Ask Brett for your partner link.');
  return { email, who, isAdmin, partnerId: mine ? mine.id : '', partnerName: mine ? mine.name : '', canEditAll: isAdmin };
}
function nowIso() { return new Date().toISOString(); }
function log(action, entityId, detail) {
  const w = me(); sh(SHEETS.activity).appendRow([nowIso(), w.who + (w.email ? ' <' + w.email + '>' : ''), action, entityId || '', String(detail || '').slice(0, 300)]);
}
function splitList(s) { return String(s || '').split(';').map(x => x.trim()).filter(Boolean); }
function findRow(sheetName, colName, value) {
  const s = sh(sheetName); const v = s.getDataRange().getValues(); const ci = v[0].indexOf(colName);
  for (let i = 1; i < v.length; i++) if (String(v[i][ci]) === String(value)) return i + 1;
  return 0;
}
function withLock(fn) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try { return fn(); } finally { lock.releaseLock(); }
}
function fmtDate(v) { if (v instanceof Date) return v.toISOString(); return String(v); }
function isTrue(v) { return v === true || String(v).toUpperCase() === 'TRUE'; }
function normName(s) { return String(s || '').toLowerCase().replace(/["'’.]/g, '').replace(/\s+/g, ' ').trim(); }
function makeId(s) {
  const base = String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40) || 'rec';
  return base + '-' + Utilities.getUuid().slice(0, 6);
}
function deleteRowsWhere(sheetName, colName, value) {
  const s = sh(sheetName); const v = s.getDataRange().getValues(); const ci = v[0].indexOf(colName); const removed = [];
  for (let i = v.length - 1; i >= 1; i--) if (String(v[i][ci]) === String(value)) { removed.push(v[i]); s.deleteRow(i + 1); }
  return { header: v[0], rows: removed.reverse() };
}

// ---------- read ----------
function getData(key) {
  const who = me(key);
  const partners = readTab(SHEETS.partners).filter(p => p.id).map(p => ({ id: p.id, name: p.name, company: p.company }));
  const people = readTab(SHEETS.contacts).filter(c => c.id).map(c => ({ id: c.id, name: c.name, title: c.title || '', email: c.email || '', phone: c.phone || '', notes: c.notes || '', links: [] }));
  const byPerson = {}; people.forEach(p => byPerson[p.id] = p);
  const links = readTab(SHEETS.links); const rels = readTab(SHEETS.rel); const notes = readTab(SHEETS.notes);
  const byEnt = {};
  const records = readTab(SHEETS.entities).filter(e => e.id).map(e => {
    const r = {
      id: e.id, entity: e.entity, aliases: splitList(e.aliases), group: e.family, address: e.address, city: e.city, state: e.state, zip: String(e.zip || ''),
      notes: e.notes, flags: splitList(e.flags), addedBy: e.added_by, addedDate: e.added_date ? fmtDate(e.added_date) : '', src: e.source_rows,
      flips: { count: Number(e.flips_count || 0), last: e.flips_last ? fmtDate(e.flips_last) : '', reports: String(e.flips_reports || '').split(',').map(s => s.trim()).filter(Boolean) },
      updated: e.updated_at ? fmtDate(e.updated_at) : '', updatedBy: e.updated_by, contacts: [], relationships: {}, relNotes: {}, noteLog: []
    };
    byEnt[r.id] = r; return r;
  });
  links.forEach(l => {
    const p = byPerson[l.contact_id], r = byEnt[l.entity_id]; if (!p || !r) return;
    p.links.push({ entityId: r.id, role: l.role || '' });
    r.contacts.push({ id: p.id, name: p.name, title: p.title, role: l.role || '', email: p.email, phone: p.phone, notes: p.notes });
  });
  rels.forEach(x => { const r = byEnt[x.entity_id]; if (r) { r.relationships[x.partner_id] = isTrue(x.has_relationship); if (x.notes) r.relNotes[x.partner_id] = x.notes; } });
  notes.forEach(n => { const r = byEnt[n.entity_id]; if (r) r.noteLog.push({ id: n.id, ts: fmtDate(n.timestamp), author: n.author, text: n.text }); });
  records.forEach(r => r.noteLog.sort((a, b) => b.ts.localeCompare(a.ts)));
  const activity = readTab(SHEETS.activity).slice(-12).reverse().map(a => ({ ts: fmtDate(a.timestamp), user: a.user, action: a.action, entityId: a.entity_id, detail: a.detail }));
  return { partners, records, people, me: who, activity, title: cfg('title') };
}
/** Full activity log (newest first). entityId optional. */
function getActivity(key, entityId, limit) {
  me(key);
  let rows = readTab(SHEETS.activity);
  if (entityId) rows = rows.filter(a => String(a.entity_id) === String(entityId));
  rows = rows.reverse().slice(0, limit || 500);
  return rows.map(a => ({ ts: fmtDate(a.timestamp), user: a.user, action: a.action, entityId: a.entity_id, detail: a.detail }));
}
/** Deleted-record archive (admin sees all; others see their own). */
function getDeleted(key) {
  const who = me(key);
  return readTab(SHEETS.deleted).reverse().filter(d => who.isAdmin || String(d.deleted_by).startsWith(who.who)).map(d => ({ id: d.id, type: d.type, recordId: d.record_id, name: d.name, reason: d.reason, by: d.deleted_by, ts: fmtDate(d.deleted_at) }));
}

// ---------- write: entities ----------
function saveEntity(key, rec) {
  return withLock(() => {
    const who = me(key); const ts = nowIso();
    const es = sh(SHEETS.entities); const hdr = es.getRange(1, 1, 1, es.getLastColumn()).getValues()[0];
    const col = n => hdr.indexOf(n) + 1;
    let row = rec.id ? findRow(SHEETS.entities, 'id', rec.id) : 0;
    const isNew = !row;
    if (isNew) {
      rec.id = makeId(rec.entity || (rec.contacts && rec.contacts[0] ? rec.contacts[0].name : 'record'));
      row = es.getLastRow() + 1;
      es.getRange(row, col('id')).setValue(rec.id);
      es.getRange(row, col('added_by')).setValue(who.who); es.getRange(row, col('added_date')).setValue(ts.slice(0, 10));
      es.getRange(row, col('flips_count')).setValue(0);
    }
    let flags = (rec.flags || []).map(f => String(f).trim()).filter(Boolean);
    // relationships: only partner columns this user may set; ticking a box clears that partner's "Confirm … relationship" flag
    const skipped = []; const partners = readTab(SHEETS.partners).filter(p => p.id);
    const rs = sh(SHEETS.rel); const rv = rs.getDataRange().getValues(); const rh = rv[0];
    Object.keys(rec.relationships || {}).forEach(pid => {
      const allowed = who.isAdmin || who.canEditAll || who.partnerId === pid;
      if (!allowed) { skipped.push(pid); return; }
      const val = !!rec.relationships[pid]; let found = 0;
      for (let i = 1; i < rv.length; i++) if (String(rv[i][rh.indexOf('entity_id')]) === rec.id && String(rv[i][rh.indexOf('partner_id')]) === pid) { found = i + 1; break; }
      if (found) {
        const cur = isTrue(rv[found - 1][rh.indexOf('has_relationship')]);
        if (cur !== val) { rs.getRange(found, rh.indexOf('has_relationship') + 1).setValue(val); rs.getRange(found, rh.indexOf('updated_at') + 1).setValue(ts); rs.getRange(found, rh.indexOf('updated_by') + 1).setValue(who.who); log('relationship', rec.id, (partners.find(p => p.id === pid) || {}).name + ' = ' + (val ? 'Yes' : 'No')); }
        if (rec.relNotes && rec.relNotes[pid] !== undefined) rs.getRange(found, rh.indexOf('notes') + 1).setValue(rec.relNotes[pid] || '');
      } else rs.appendRow([rec.id, pid, val, (rec.relNotes && rec.relNotes[pid]) || '', ts, who.who]);
      if (val) { const p = partners.find(x => x.id === pid); if (p) { const words = (p.company + ' ' + p.name).toLowerCase().split(/\s+/).filter(w => w.length > 2); const before = flags.length; flags = flags.filter(f => !(/confirm/i.test(f) && words.some(w => f.toLowerCase().includes(w)))); if (flags.length < before) log('resolve-flag', rec.id, 'auto: relationship confirmed for ' + p.name); } }
    });
    const set = (n, v) => es.getRange(row, col(n)).setValue(v);
    set('entity', rec.entity || ''); set('aliases', (rec.aliases || []).join('; ')); set('family', rec.group || '');
    set('address', rec.address || ''); set('city', rec.city || ''); set('state', rec.state || ''); set('zip', rec.zip || '');
    set('notes', rec.notes || ''); set('flags', flags.join('; ')); set('updated_at', ts); set('updated_by', who.who);
    // contacts: upsert people, then replace this entity's links
    const wanted = (rec.contacts || []).filter(c => c.name && String(c.name).trim());
    const ids = wanted.map(c => upsertPerson(c, who, ts));
    const ls = sh(SHEETS.links); const lv = ls.getDataRange().getValues(); const lh = lv[0];
    for (let i = lv.length - 1; i >= 1; i--) if (String(lv[i][lh.indexOf('entity_id')]) === rec.id) ls.deleteRow(i + 1);
    wanted.forEach((c, i) => ls.appendRow([ids[i], rec.id, c.role || '', ts, who.who]));
    log(isNew ? 'add' : 'edit', rec.id, rec.entity || (wanted[0] ? wanted[0].name : ''));
    return { id: rec.id, skipped };
  });
}
/** Create or update a person row; returns the contact id. Links an unnamed-id contact to an existing person with the same name. */
function upsertPerson(c, who, ts) {
  const cs = sh(SHEETS.contacts); const v = cs.getDataRange().getValues(); const h = v[0]; const ci = n => h.indexOf(n);
  let row = 0;
  if (c.id) { for (let i = 1; i < v.length; i++) if (String(v[i][ci('id')]) === String(c.id)) { row = i + 1; break; } }
  if (!row) { const nn = normName(c.name); for (let i = 1; i < v.length; i++) if (normName(v[i][ci('name')]) === nn) { row = i + 1; c.id = String(v[i][ci('id')]); break; } }
  if (!row) {
    c.id = makeId('c-' + c.name);
    cs.appendRow([c.id, String(c.name).trim(), c.title || '', c.email || '', c.phone || '', c.notes || '', ts, who.who]);
    log('add-contact', '', String(c.name).trim());
    return c.id;
  }
  const cur = v[row - 1]; const upd = {};
  const fields = ['name', 'title', 'email', 'phone', 'notes'];
  fields.forEach(f => { if (c[f] !== undefined && String(c[f] || '').trim() !== String(cur[ci(f)] || '').trim()) upd[f] = String(c[f] || '').trim(); });
  if (Object.keys(upd).length) {
    Object.keys(upd).forEach(f => cs.getRange(row, ci(f) + 1).setValue(upd[f]));
    cs.getRange(row, ci('updated_at') + 1).setValue(ts); cs.getRange(row, ci('updated_by') + 1).setValue(who.who);
    log('edit-contact', '', String(cur[ci('name')]) + ': ' + Object.keys(upd).join(', '));
  }
  return c.id;
}
function addNote(key, entityId, text) {
  if (!text || !String(text).trim()) throw new Error('Note is empty.');
  return withLock(() => {
    const who = me(key); const ts = nowIso(); const id = makeId('n');
    sh(SHEETS.notes).appendRow([id, entityId, ts, who.who, String(text).trim()]);
    log('note', entityId, String(text).trim().slice(0, 120));
    return { id, ts, author: who.who, text: String(text).trim() };
  });
}
function resolveFlag(key, entityId, flag) {
  return withLock(() => {
    const who = me(key); const row = findRow(SHEETS.entities, 'id', entityId); if (!row) throw new Error('Record not found.');
    const es = sh(SHEETS.entities); const hdr = es.getRange(1, 1, 1, es.getLastColumn()).getValues()[0]; const fc = hdr.indexOf('flags') + 1;
    const flags = splitList(es.getRange(row, fc).getValue()).filter(f => f !== flag);
    es.getRange(row, fc).setValue(flags.join('; ')); es.getRange(row, hdr.indexOf('updated_at') + 1).setValue(nowIso()); es.getRange(row, hdr.indexOf('updated_by') + 1).setValue(who.who);
    log('resolve-flag', entityId, flag); return flags;
  });
}
function deleteEntity(key, entityId, reason) {
  return withLock(() => {
    const who = me(key); if (!who.isAdmin) throw new Error('Only an admin can delete an entity.');
    reason = String(reason || '').trim(); if (reason.length < 5) throw new Error('Give a reason for the deletion (at least 5 characters).');
    const row = findRow(SHEETS.entities, 'id', entityId); if (!row) throw new Error('Record not found.');
    const es = sh(SHEETS.entities); const hdr = es.getRange(1, 1, 1, es.getLastColumn()).getValues()[0]; const vals = es.getRange(row, 1, 1, hdr.length).getValues()[0];
    const name = String(vals[hdr.indexOf('entity')] || ''); const snap = { entity: { header: hdr, row: vals } };
    es.deleteRow(row);
    snap.links = deleteRowsWhere(SHEETS.links, 'entity_id', entityId); snap.rel = deleteRowsWhere(SHEETS.rel, 'entity_id', entityId); snap.notes = deleteRowsWhere(SHEETS.notes, 'entity_id', entityId);
    archive('entity', entityId, name, reason, who, snap);
    log('delete', entityId, name + ' | reason: ' + reason); return true;
  });
}

// ---------- write: contacts ----------
function saveContact(key, c) {
  return withLock(() => {
    const who = me(key); const ts = nowIso();
    if (!c.name || !String(c.name).trim()) throw new Error('Name is required.');
    const id = upsertPerson(c, who, ts);
    if (Array.isArray(c.links)) {
      const ls = sh(SHEETS.links); const lv = ls.getDataRange().getValues(); const lh = lv[0];
      for (let i = lv.length - 1; i >= 1; i--) if (String(lv[i][lh.indexOf('contact_id')]) === id) ls.deleteRow(i + 1);
      const seen = new Set(); c.links.filter(l => l.entityId && !seen.has(l.entityId) && seen.add(l.entityId)).forEach(l => ls.appendRow([id, l.entityId, l.role || '', ts, who.who]));
      log('edit-contact', '', String(c.name).trim() + ': entities = ' + c.links.length);
    }
    return { id };
  });
}
function deleteContact(key, contactId, reason) {
  return withLock(() => {
    const who = me(key);
    reason = String(reason || '').trim(); if (reason.length < 5) throw new Error('Give a reason for the deletion (at least 5 characters).');
    const row = findRow(SHEETS.contacts, 'id', contactId); if (!row) throw new Error('Contact not found.');
    const cs = sh(SHEETS.contacts); const hdr = cs.getRange(1, 1, 1, cs.getLastColumn()).getValues()[0]; const vals = cs.getRange(row, 1, 1, hdr.length).getValues()[0];
    const name = String(vals[hdr.indexOf('name')] || ''); const snap = { contact: { header: hdr, row: vals } };
    cs.deleteRow(row);
    snap.links = deleteRowsWhere(SHEETS.links, 'contact_id', contactId);
    const ents = snap.links.rows.map(r => r[snap.links.header.indexOf('entity_id')]);
    archive('contact', contactId, name, reason, who, snap);
    log('delete-contact', ents[0] || '', name + (ents.length ? ' (unlinked from ' + ents.length + ' entit' + (ents.length > 1 ? 'ies' : 'y') + ')' : '') + ' | reason: ' + reason);
    return true;
  });
}
function archive(type, recordId, name, reason, who, snapshot) {
  sh(SHEETS.deleted).appendRow([makeId('d'), type, recordId, name, reason, who.who + (who.email ? ' <' + who.email + '>' : ''), nowIso(), JSON.stringify(snapshot)]);
}
/** Admin: restore a deleted entity or contact from the archive. */
function restoreDeleted(key, deletedId) {
  return withLock(() => {
    const who = me(key); if (!who.isAdmin) throw new Error('Only an admin can restore.');
    const ds = sh(SHEETS.deleted); const v = ds.getDataRange().getValues(); const h = v[0]; let row = 0;
    for (let i = 1; i < v.length; i++) if (String(v[i][h.indexOf('id')]) === deletedId) { row = i + 1; break; }
    if (!row) throw new Error('Archive entry not found.');
    const d = v[row - 1]; const snap = JSON.parse(d[h.indexOf('snapshot')]);
    const put = (sheetName, part) => { if (!part) return; const s = sh(sheetName); const hdr = s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0]; const rows = part.row ? [part.row] : part.rows; rows.forEach(r => { const out = hdr.map(c => { const i = part.header.indexOf(c); return i >= 0 ? r[i] : ''; }); s.appendRow(out); }); };
    if (d[h.indexOf('type')] === 'entity') { put(SHEETS.entities, snap.entity); put(SHEETS.links, snap.links); put(SHEETS.rel, snap.rel); put(SHEETS.notes, snap.notes); }
    else { put(SHEETS.contacts, snap.contact); put(SHEETS.links, snap.links); }
    ds.deleteRow(row);
    log('restore', d[h.indexOf('record_id')], d[h.indexOf('type')] + ': ' + d[h.indexOf('name')]); return true;
  });
}

// ---------- partners ----------
function addPartner(key, name, company, email) {
  return withLock(() => {
    const who = me(key); if (!who.isAdmin) throw new Error('Only an admin can add a partner.');
    const id = makeId(name); const accessKey = Utilities.getUuid().replace(/-/g, '').slice(0, 20); sh(SHEETS.partners).appendRow([id, name, company, (email || '').toLowerCase(), false, accessKey]);
    const ids = readTab(SHEETS.entities).map(e => e.id); const rs = sh(SHEETS.rel); const ts = nowIso();
    ids.forEach(eid => rs.appendRow([eid, id, false, '', ts, who.who]));
    log('partner', '', name + ' (' + company + ')'); return { id, accessKey };
  });
}
function partnerLinks(key) {
  const who = me(key); if (!who.isAdmin) throw new Error('Admin only.');
  const url = ScriptApp.getService().getUrl();
  return readTab(SHEETS.partners).filter(p => p.id).map(p => ({ id: p.id, name: p.name, company: p.company, link: p.access_key ? url + '?key=' + p.access_key : '(no key set)' }));
}
function rotateKey(key, partnerId) {
  const who = me(key); if (!who.isAdmin) throw new Error('Admin only.');
  const s = sh(SHEETS.partners); const v = s.getDataRange().getValues(); const h = v[0];
  for (let i = 1; i < v.length; i++) if (String(v[i][h.indexOf('id')]) === partnerId) { const k = Utilities.getUuid().replace(/-/g, '').slice(0, 20); s.getRange(i + 1, h.indexOf('access_key') + 1).setValue(k); log('rotate-key', '', partnerId); return ScriptApp.getService().getUrl() + '?key=' + k; }
  throw new Error('Partner not found.');
}

// ---------- maintenance (run from the editor; safe to re-run) ----------
function setupKeys() {
  const ps = sh(SHEETS.partners); const v = ps.getDataRange().getValues(); let h = v[0].map(String);
  let kc = h.indexOf('access_key');
  if (kc < 0) { kc = h.length; ps.getRange(1, kc + 1).setValue('access_key'); }
  for (let i = 1; i < v.length; i++) if (v[i][0] && !v[i][kc]) ps.getRange(i + 1, kc + 1).setValue(Utilities.getUuid().replace(/-/g, '').slice(0, 20));
  const cs = sh(SHEETS.config); const cv = cs.getDataRange().getValues();
  if (!cv.some(r => r[0] === 'admin_key')) cs.appendRow(['admin_key', Utilities.getUuid().replace(/-/g, '').slice(0, 20)]);
  return 'keys ready';
}
/** v2 → v3: Contacts becomes one row per person (+title), links move to ContactLinks, Deleted tab added. Backs up the old tab first. */
function migrateV3() {
  const wb = ss();
  if (wb.getSheetByName(SHEETS.links)) return 'already migrated';
  const old = readTab(SHEETS.contacts); const ts = nowIso();
  wb.getSheetByName(SHEETS.contacts).copyTo(wb).setName('Contacts_v2_backup');
  const groups = {}; const order = [];
  old.forEach(c => { const k = normName(c.name); if (!k) return; if (!groups[k]) { groups[k] = []; order.push(k); } groups[k].push(c); });
  const people = [], links = [], verify = [];
  order.forEach(k => {
    const rows = groups[k]; const first = rows[0];
    const titles = [], emails = [], phones = [], notes = [];
    rows.forEach(c => {
      const role = String(c.role || '').trim();
      const isTitle = TITLE_RE.test(role);
      if (isTitle && role) titles.push(role);
      if (c.email && !emails.includes(String(c.email).trim().toLowerCase())) emails.push(String(c.email).trim().toLowerCase());
      if (c.phone && !phones.map(p => p.replace(/\D/g, '')).includes(String(c.phone).replace(/\D/g, ''))) phones.push(String(c.phone).trim());
      if (c.notes && !notes.includes(String(c.notes).trim())) notes.push(String(c.notes).trim());
      links.push([first.id, c.entity_id, isTitle ? '' : role, ts, 'migration v3']);
    });
    let note = notes.join(' | ');
    if (emails.length > 1) note = (note ? note + ' | ' : '') + 'Other emails: ' + emails.slice(1).join(', ');
    if (phones.length > 1) note = (note ? note + ' | ' : '') + 'Other phones: ' + phones.slice(1).join(', ');
    if (emails.length > 1 || phones.length > 1) { note = 'VERIFY merged contact (' + rows.length + ' rows had different email/phone). ' + note; verify.push({ name: first.name, entityId: first.entity_id }); }
    const title = titles[0] ? titles[0].replace(/\b\w/g, ch => ch.toUpperCase()) : '';
    people.push([first.id, String(first.name).trim(), title, emails[0] || '', phones[0] || '', note, ts, 'migration v3']);
  });
  const cs = wb.getSheetByName(SHEETS.contacts); cs.clear();
  cs.getRange(1, 1, 1, 8).setValues([['id', 'name', 'title', 'email', 'phone', 'notes', 'updated_at', 'updated_by']]);
  if (people.length) cs.getRange(2, 1, people.length, 8).setValues(people);
  const ls = wb.insertSheet(SHEETS.links); ls.getRange(1, 1, 1, 5).setValues([['contact_id', 'entity_id', 'role', 'updated_at', 'updated_by']]);
  if (links.length) ls.getRange(2, 1, links.length, 5).setValues(links);
  if (!wb.getSheetByName(SHEETS.deleted)) wb.insertSheet(SHEETS.deleted).getRange(1, 1, 1, 8).setValues([['id', 'type', 'record_id', 'name', 'reason', 'deleted_by', 'deleted_at', 'snapshot']]);
  // flag entities whose merged contact needs verification
  const es = sh(SHEETS.entities); const ev = es.getDataRange().getValues(); const eh = ev[0]; const fc = eh.indexOf('flags');
  verify.forEach(vf => { for (let i = 1; i < ev.length; i++) if (String(ev[i][0]) === String(vf.entityId)) { const f = splitList(ev[i][fc]); f.push('Verify merged contact: ' + vf.name); es.getRange(i + 1, fc + 1).setValue(f.join('; ')); ev[i][fc] = f.join('; '); break; } });
  sh(SHEETS.activity).appendRow([ts, 'Cowork (migration v3)', 'migrate', '', old.length + ' contact rows -> ' + people.length + ' people, ' + links.length + ' links, ' + verify.length + ' to verify']);
  return 'migrated: ' + old.length + ' rows -> ' + people.length + ' people, ' + links.length + ' links, verify ' + verify.length;
}

// ---------- bulk import (run from the editor with a JSON payload; safe to re-run) ----------
function normEnt(s) { return String(s || '').toLowerCase().replace(/\(.*?\)/g, '').split(/\s[-–]\s/)[0].replace(/[^a-z0-9 ]/g, ' ').replace(/\b(llc|inc|corp|corporation|co|ltd|lp|the)\b/g, '').replace(/\s+/g, ' ').trim(); }
function isSinglePropertyLLC(name) { return /^\d+\s+\S+.*\b(st|street|ave|avenue|dr|drive|rd|road|way|wy|ln|lane|blvd|ct|court|pl|place|cir|circle|ter|hwy)\b/i.test(String(name || '')); }
/**
 * rows: [{kind:'clients'|'prospects', entityRaw, people:[{name,title}], address, city, state, zip, notes}]
 * opts: {source, addedBy, partnerId (relationship to set for kind=clients), prospectFlag, addPeopleFor:['prospects']}
 */
function importRows(rows, opts) {
  opts = opts || {}; const ts = nowIso(); const who = { who: opts.addedBy || 'Cowork (import)', email: '' };
  const es = sh(SHEETS.entities); const ev = es.getDataRange().getValues(); const eh = ev[0].map(String); const ec = n => eh.indexOf(n);
  const index = {}; // normalized name/alias -> row number
  for (let i = 1; i < ev.length; i++) { const id = ev[i][ec('id')]; if (!id) continue; const n = normEnt(ev[i][ec('entity')]); if (n) index[n] = index[n] || i + 1; splitList(ev[i][ec('aliases')]).forEach(a => { const k = normEnt(a); if (k && !index[k]) index[k] = i + 1; }); }
  const people = readTab(SHEETS.contacts); const links = readTab(SHEETS.links);
  const linked = {}; links.forEach(l => { linked[l.entity_id] = linked[l.entity_id] || new Set(); const p = people.find(x => String(x.id) === String(l.contact_id)); if (p) linked[l.entity_id].add(normName(p.name)); });
  const out = { added: [], updated: [], contactsAdded: [], skipped: [], unchanged: 0 };
  const addPeopleFor = opts.addPeopleFor || ['prospects'];
  rows.forEach(r => {
    const raw = String(r.entityRaw || '').trim(); const key = normEnt(raw);
    if (!key && !(r.people || []).length) { out.skipped.push('(blank row)'); return; }
    let row = key ? index[key] : 0;
    if (!row && key) { const k2 = normEnt(raw.split(/\s*[\/(]/)[0]); if (k2 && index[k2]) row = index[k2]; }
    const src = opts.source || 'import';
    if (row) {
      const rec = ev[row - 1]; let changed = [];
      const fill = (col, val) => { if (val && !String(rec[ec(col)] || '').trim()) { es.getRange(row, ec(col) + 1).setValue(val); rec[ec(col)] = val; changed.push(col); } };
      fill('address', r.address); fill('city', r.city); fill('state', r.state); fill('zip', r.zip);
      if (r.notes && !String(rec[ec('notes')] || '').toLowerCase().includes(String(r.notes).toLowerCase().slice(0, 40))) { const nv = (String(rec[ec('notes')] || '') + (rec[ec('notes')] ? ' | ' : '') + src + ': ' + r.notes).slice(0, 2000); es.getRange(row, ec('notes') + 1).setValue(nv); rec[ec('notes')] = nv; changed.push('notes'); }
      const id = String(rec[ec('id')]);
      if (addPeopleFor.includes(r.kind)) (r.people || []).forEach(p => { const nn = normName(p.name); if (!nn || (linked[id] && linked[id].has(nn))) return; const cid = upsertPerson({ name: p.name, title: p.title || '' }, who, ts); sh(SHEETS.links).appendRow([cid, id, '', ts, who.who]); linked[id] = linked[id] || new Set(); linked[id].add(nn); out.contactsAdded.push(p.name + ' -> ' + (rec[ec('entity')] || id)); changed.push('contact'); });
      if (r.kind === 'clients' && opts.partnerId) { const rs = sh(SHEETS.rel); const rv = rs.getDataRange().getValues(); let found = 0; for (let i = 1; i < rv.length; i++) if (String(rv[i][0]) === id && String(rv[i][1]) === opts.partnerId) { found = i + 1; break; } if (found) { if (!isTrue(rv[found - 1][2])) { rs.getRange(found, 3).setValue(true); rs.getRange(found, 5).setValue(ts); rs.getRange(found, 6).setValue(who.who); changed.push('relationship'); } } else { rs.appendRow([id, opts.partnerId, true, '', ts, who.who]); changed.push('relationship'); } }
      if (changed.length) { es.getRange(row, ec('updated_at') + 1).setValue(ts); es.getRange(row, ec('updated_by') + 1).setValue(who.who); out.updated.push((rec[ec('entity')] || id) + ' [' + [...new Set(changed)].join(',') + ']'); } else out.unchanged++;
      return;
    }
    // new record
    if (opts.createFor && !opts.createFor.includes(r.kind)) { out.skipped.push(raw + ' (no match; new records not created for ' + r.kind + ')'); return; }
    const single = isSinglePropertyLLC(raw);
    if (single && !(r.people || []).length) { out.skipped.push(raw + ' (single-property LLC, no principal)'); return; }
    if (!raw && !(r.people || []).length) { out.skipped.push('(no entity, no people)'); return; }
    const entityName = single ? '' : raw.replace(/\s+/g, ' ').trim();
    const flags = []; if (!entityName) flags.push('Company missing'); if (r.kind === 'prospects' && opts.prospectFlag) flags.push(opts.prospectFlag);
    let notes = (single ? 'Single-property LLC: ' + raw + '. ' : '') + 'Source: ' + src + '.' + (r.notes ? ' ' + r.notes : '');
    const id = makeId(entityName || (r.people[0] ? r.people[0].name : 'record'));
    const rowVals = eh.map(c => ({ id, entity: entityName, aliases: '', family: '', address: r.address || '', city: r.city || '', state: r.state || '', zip: r.zip || '', notes, flags: flags.join('; '), added_by: who.who, added_date: ts.slice(0, 10), source_rows: '', flips_count: 0, flips_last: '', flips_reports: '', updated_at: ts, updated_by: who.who })[c] ?? '');
    es.appendRow(rowVals);
    if (entityName) index[normEnt(entityName)] = es.getLastRow();
    (r.people || []).forEach(p => { if (!p.name) return; const cid = upsertPerson({ name: p.name, title: p.title || '' }, who, ts); sh(SHEETS.links).appendRow([cid, id, '', ts, who.who]); out.contactsAdded.push(p.name + ' -> ' + (entityName || id)); });
    const rs = sh(SHEETS.rel); readTab(SHEETS.partners).filter(p => p.id).forEach(p => rs.appendRow([id, p.id, r.kind === 'clients' && p.id === opts.partnerId, '', ts, who.who]));
    out.added.push(entityName || ('(contact) ' + r.people.map(p => p.name).join(' & ')));
  });
  sh(SHEETS.activity).appendRow([ts, who.who, 'import', '', (opts.source || 'import') + ': ' + out.added.length + ' added, ' + out.updated.length + ' updated, ' + out.contactsAdded.length + ' contacts linked, ' + out.skipped.length + ' skipped']);
  return out;
}
