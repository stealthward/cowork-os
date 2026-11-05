/**
 * Five Star Portal pages — served from the same web app as the team dashboards.
 *
 *   <exec-url>?page=home       -> The Hub home (HR links, updates, contact)
 *   <exec-url>?page=team&t=key -> Team page (one template, per TEAMS entry)
 *   <exec-url>?page=resources  -> Team Resources hub (config-driven from TEAMS)
 *   <exec-url>?page=admin      -> Admin page (front desk + management tools)
 *   <exec-url>?page=calc       -> Escrow Fee Calculator (header action card)
 *   <exec-url>?page=forms      -> Take a Message / Support Request (&f=take|support;
 *                                 reached from the header action card, not the nav)
 *   <exec-url>?page=calendars  -> Company calendars (&cal=main|fsepto|rtmshoots|rtmpto;
 *                                 NOT &c=, which Google reserves on /exec and 404s)
 *   <exec-url>?page=directory  -> Company Directory (searchable, People sheet)
 *   <exec-url>?page=open&t=key -> New Escrow (Intake.gs, Hub intake Phase 1)
 *   <exec-url>?page=file       -> Escrow Lookup: find a file, then update it (Intake.gs, Hub intake Phase 2)
 *   <exec-url>?page=client|agent -> retired 2026-10-19; old links land on New Escrow
 *
 * Part of the Portal Rebuild project (replaces the Google Sites "Hub" pages in
 * phases; Sites stays live until cutover). Routing lives in doGet (Code.gs).
 *
 * CONFIG RULES
 *  - TEAMS (Code.gs) is the single config: each entry's `label` + `link` drives
 *    the Team Resources cards and the dashboard buttons. Adding a team there
 *    adds it everywhere. Never hardcode a team into a page.
 *  - CALC below is the single-formula fee schedule Brett approved 2026-08-28,
 *    derived from (and superseding) the per-tier rate table in the FSE Fee
 *    Calculator Sheets. Derivation and accuracy stats: this project's MEMORY.md.
 *    If fees change, update CALC here.
 *  - Links and Contact tabs on the FSE Portal Content sheet (added 2026-09-25,
 *    seeded by portalSetupLinks) are the live source for every link on Home,
 *    Team Resources, and Admin and for the office contact block. Renderers read
 *    them through portalConfig(); the PORTAL constants below are the fallback
 *    only when a tab is missing or unreadable. Edits go live on the next cache
 *    refresh (5-minute cache, portalWarm every 10 minutes), no deploy needed.
 *  - Access is the deployment's domain gate (brettward.net), same as dashboards.
 */

/* ========================= PORTAL CONFIG ========================= */

var PORTAL = {
  // Official "Full Logo - White" from the Canva FSE Brand Kit (kAGQTQCeLNk),
  // embedded as a 200x72 data URI so it renders inside the Apps Script sandbox.
  // Brand palette (same kit): #031356 navy, #ffffff, #c4c8d6 silver, #818591 grey.
  logoUrl: 'data:image/png;base64,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',
  // FSE star marks from the same brand kit, opacity baked in: white (10%) for
  // the header watermark, color (18%) for the team-card corners.
  starWhite: 'data:image/png;base64,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',
  starColor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAABACAYAAAC9S+EXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAilSURBVHhe7VxbUxpJFG4SQFBgFGOM8ZaYGI2JUXCzr6na2trKQypbuwV4zVq7D/kb/h8f98HaVGINCgMDIZHEEWQ0cS+1lYfkYX8Bs/X10Ng04CVBA+JXdQrD9Ih+nnP663POhJAGhGEYlmXDuCi+fw4BL+Jvu1VV94jvn4NDKmXY5Kg2GY1m3eK1c3BQXr0fDCub98896gCsrKgeJan7YPLGXrt4/RyEkKWlpQtKans0mshNgqhYTPOKa85BCJET2pW12I5/Pb59by2W8cup7UvimqbHiq63rKqbExE1N8GIUpTdy+K6pkckkhtCuIEkRlQisXdFXNfUQNIGMYwkRlQ0mr0qrm1aLC8vX1xX9TE5mpsUiZJVvU9c37R4Ecv1sgTOG8Iwkno3IK5vSsRifzvhSauRTZrAeQsrui8ez14T72lKhONbwyBEJMkkassXSeaGxHuaDs8TmU4+gTNZwBMlx7Sb4n1NBVk2rEoyc5eRQ19VfQw5SU6YSR3qPB7fHRbvbSqsJXf6eW9CMsdxhfcyEBVNZkfEe5sGsqy5EFYlIaZsj+IalDgjCmUWnPtQwBO/x5kHfuloNDtSSpTuY3WnePxdNyPKDEdtzDCMC+L3OfNQlPRlXjOZ57mtQXZdJCqS2LljNFs5WNM0e9FTCq+xl9lxVDPZGpEoJbl7N5VKFa83BdbU7eslCfzljn/9td7FrxGJwqumGXZ+zZnGxsZee0TNTtFwUnMTlIxE5paYqFEt4NchocvynoNfc6ZhGIbNMAxHPp9vgeFrkaTCugtsnWEYdryKaz4TZZ91XFhaL833tEgL1x0dwQFHx5PjW/vc4GFGHD/2EyKYIzjQIk1f4w3vmdcfDRRNWLNvgesH29yQ3T07TFqDtKa1rGl26LfV6OaNSOTtEAzpAP+Gdx9e0ul52mprD01YPTPf2KQZ31kwqyd03yYFJwn5rpuQJStyYTiWHceOC2limu4LK9v3qbCNZq/KsmwVqSnH4KLD1h4Yt0lzk7b2mXsNa/j5pRmf6ZnEms/nnfHXu8PIifxZEuSw6sTKin7M8KaeVfgw8QeoewtN2KSQn7gDI4Tca4P2Ut/ofSYh++LW3Eh2/IqyPfo89U4SKTg6uoIu80MPIYv+5Q6z8pA4GQv58TMR8pBKjb/++q9DVjJ3K5WW8Son9q6gLSb+6seHd95jEhWaKCMI73XM3CHSXAfp/M2NtVUN17uCLtK90FY0cU0tjDxEN9mKXTKZzA3REnJUK5aVWY8Qibv2UkP6sZ3+taqQhd0Euwo1z/SNiiYFrmPHc3rn+0jbwmVK1AkhoUF/QcnvFwFZmIXjudsn23H2BLxVySoLs2rGhYc047O7Zkepl9UIsrzRDiJACJ+sab1dzU1gNzudQ7Vr9pKZAyqQ9TlGSZubJB3BL0ikhOi63oJQAiEILUYQ6u8IPWgj1OPF+04WbQuXbVJwinlFqZdUMpOMquTSa3PjhDw99mEXah7nQT45w1bZsUjVx/74qvMKrkAXyznUOoIDyD1Ob6AXyp6Zs3PmKtQ6cljRg0Si6PvBKawVP+YgYAQomnw/Imoi6CEk71gs19uYJZnBRQfIrUiWNDdpp5rncKA8g5oV9FBpmGk0zNCASKX+bRXvazjYL03fMsONJys0YffOjxFysJ7ZP3pwYRbZpGGGoh5q7OI9jQua40xRWOJR3unb1U71KNbhoFoeZls+JGxV1fuOdjZrJLgCXeVEzfhQsRCXMiDXwJN4kvB1OL47nE5/ODE99lWB5F+Wp3Aug7o/AOUtrYxfls/sYNkDK61K8FIBYdc5O0pIeeGOB3a5MKe0EXbQR+K6MwGn95fe8rAL+Ql5fOhYNBQ17R5zzQg0G85ebupeaCvb7aS5KeJ8jGOFZW0t01OpHMwjEtEG+PCDEk99UXmk7hC8iO2/hCial36m0ylqGseP7fuYZlle1qp2WZ4/T0niuCJ2PHFdo8KC6kFJyEkhv909fQsXX2b+7OEnf6GHqj2hgGm8SGLrDgs/SAO03w/zxIYACv/VSEqnP5R0imFQ23Qscb20x8eACRc+/EDa6R94awtLOUnzfuIJ0BmndHp/AEM0s3aU8SMnid6CnCSGXwOPVT+wtngWbu6TVKhhm0X+Qrhl/PwI4mqkdHDMJGGHNkb5gr8ZfjvF8GvcSbyeR604jhRJKhTsWA0bDwDx4cbaRexrkSxoJwyZrXAPDOFQzLyqMWUCqqCUnILyBlmoqZudEOt64l3xvEaVNVrkMe0mWuyoX9MmpFCdhGHqjta602aIQXw2qkywoB5lehFUdyHUWgI4v134+DHvDr/EWW13yswpmbtryc3+Z8/SZec0PMBIn83jSijMcyiJEW0A3oOSLyO0MWTC4KIDu9h+qJneRMgPXiTijY2/e9GBZfkGuxlmNsVvwwMHXbP2XZ7sqSfGtJvQXKy7Uv8ygQ81mouKXmT9kM+3IenSXyyevVZNG1UDkvaqsjXIQlUMRfG9OpUJwYso8VIvKhBkdwXGCPleQi56o//TB2EYfZW9ioqkePdxkEhkOkFEtflz3tOeKek6kgmdj93FXa2Qk0jrTz3B4JL906e8J7m504/n6mrZFpL39hxm4a780Q9m9VRNsKABUOjRTeGVjub0BZworGWzH92Y8BVvqhWQf9AwMJsHpYkeVh8yoedpKxK2OT4T8kNMwrPYZeST0htODpABlWYJYF9TJlhIV/AKkjVIop0SafEE29FHAyoMq1H9hqi56MZx6jKhe6ENlUerZ/ZbWvj3BL5iI7Ey0PxEGDLNdcoyATvadD+duIOqdj9BC+g0PvizQJ984DTX6cgEqosC441AEA/8ny04/5maKzsljmHXDn0BpzkMOj9SjyF2VKArg0M02ljitS/EAytx/dpFJ3XrIEnXAr+nUq043hx/FrMyLIQsOqj31HA+qV4AsXvYefIo+B8TLb294hpDaAAAAABJRU5ErkJggg==',
  // Team Resources page, Resources column: renamed company dashboards + the
  // three escrow-wide links (Brett's 2026-09-11 naming; deployment IDs
  // verified in docs/dashboard-inventory.md).
  resourcesCol: [
    { label: 'Revenue Dashboard', url: 'https://script.google.com/a/macros/brettward.net/s/AKfycbwJXN0A-8eJuoMu95mqx-FNfmRxYqxfqWxu_Hq5JePPzU6RAuH1piT6fBjUwoQ_YH2q0Q/exec' },
    { label: 'Client Dashboard', url: 'https://script.google.com/a/macros/brettward.net/s/AKfycbwQbuSyct_NL-9ge4SMGZSEJ8jZo03JrzHir1HP_Rd-FBYIdOe0tC64p-hH5Ai579i0/exec' },
    { label: 'Client Attribution', url: 'https://script.google.com/a/macros/brettward.net/s/AKfycbwQbuSyct_NL-9ge4SMGZSEJ8jZo03JrzHir1HP_Rd-FBYIdOe0tC64p-hH5Ai579i0/exec' },
    { label: 'Training Handbook', url: 'https://drive.google.com/drive/folders/1RMYilp0xZRKIWLQ27Qh4NZfQZJ5csGZ4' },
    { label: 'Outlook Web Portal', url: 'https://controlpanel.msoutlookonline.net/Portal/ADUser/Login' }
  ],
  // Form embeds, harvested from the Sites editor 2026-09-09
  // (Operations/Portal Rebuild/2026-09-09-embed-link-inventory.md).
  formUrls: {
    takeMessage: 'https://app.smartsheet.com/b/form/145c02fb54a3416e9fae7be95f3de978',
    support: 'https://form.asana.com/?k=W1msJ0pEsIf9LCIOT4-X9Q&d=459051476492004&embed=true'
  },
  // Title Links as a matrix: six title companies x three link types (URLs
  // harvested from the live Sites Team Links & Resources page 2026-09-09;
  // WFG has no Proposed Insured link, rendered as a dash).
  titleMatrix: {
    cols: ['Rate Calculator', 'CPL', 'Supplementals'],
    rows: [
      { name: 'Chicago Title', urls: ['https://rates.fntg.com/?brand=chicago', 'https://cpl.mainspringservices.com/Generate/CT/SD', 'https://cpl.mainspringservices.com/proposedinsured/ct/sd/'] },
      { name: 'Fidelity', urls: ['https://rates.fntg.com/', 'https://lenderpackage.leadmarketer.com/', 'https://lenderpackage.leadmarketer.com/'] },
      { name: 'First American', urls: ['http://facc.firstam.com/', 'https://cpl.firstam.com/#', 'https://proposedinsured.firstam.com/#'] },
      { name: 'Lawyers', urls: ['https://rates.fntg.com/?brand=lawyers', 'https://cpl.mainspringservices.com/Generate/LT/SD', 'https://pi.mainspringservices.com/ProposedInsured/LT/SD'] },
      { name: 'Ticor', urls: ['https://rates.fntg.com/?brand=ticor', 'https://cpl.mainspringservices.com/Generate/TT/SD', 'https://cpl.mainspringservices.com/ProposedInsured/TT/SD'] },
      { name: 'WFG', urls: ['https://rates.wfgnationaltitle.com/', 'https://wfgtitle.com/cpl/', ''] }
    ]
  },
  // Escrow Links + Property Taxes, rendered as labeled text-link columns
  // (footer style; the white-pill walls retired 2026-09-11).
  linkCols: [
    { title: 'Escrow Links', groups: [
      { sub: 'Escrow Logins', links: [
        { label: 'CA Bank & Trust', url: 'https://www.calbanktrust.com/personal/' },
        { label: 'Fax Portal', url: 'https://www2.sea.telecomsvc.com/im/login.action' },
        { label: 'DocuSign', url: 'https://account.docusign.com/password' },
        { label: 'Notary Site', url: 'https://orders.signdocstoday.com/login' } ] },
      { sub: 'Processing', links: [
        { label: 'Title Resource Guide', url: 'https://docs.google.com/document/d/1j5wc4Ynv4b6Wctv57CZwin2L1t6Ytlyjc5rJRBsjC4M/edit?tab=t.fzozszsynz52' },
        { label: 'Refi Clauses', url: 'https://docs.google.com/document/d/1j5wc4Ynv4b6Wctv57CZwin2L1t6Ytlyjc5rJRBsjC4M/edit?tab=t.1z74nfbc8pc1' },
        { label: 'Sale Clauses', url: 'https://docs.google.com/document/d/1j5wc4Ynv4b6Wctv57CZwin2L1t6Ytlyjc5rJRBsjC4M/edit?tab=t.olh7fio92lv5' },
        { label: 'Escrow Acronyms', url: 'https://docs.google.com/document/d/1j5wc4Ynv4b6Wctv57CZwin2L1t6Ytlyjc5rJRBsjC4M/edit?tab=t.9e1zkmf7e7id' } ] },
      { sub: 'Other', links: [
        { label: 'Incoming Wire Instructions', url: 'https://drive.google.com/file/d/1MHtPxrSNSJCEfr__LICOFWRkuQmkHV58/view' },
        { label: 'Payoffs + HOA + Solar', url: 'https://docs.google.com/spreadsheets/d/14_4nol_qAOBnIL5N1Rw6PYnKV6ZMV-LA3h3Md5NSvpA/edit?gid=1114307310#gid=1114307310' },
        { label: 'CA Biz Entity Search', url: 'https://bizfileonline.sos.ca.gov/search/business' },
        { label: 'Tax Codes for Grant Deeds', url: 'https://www.lavote.gov/docs/rrcc/documents/documentary-transfer-tax-statutes.pdf?v=2' } ] } ] },
    { title: 'Property Taxes', groups: [
      { sub: '', links: [
        { label: 'San Diego County', url: 'https://wps.sdttc.com/WebPayments/CoSDTreasurer2/search' },
        { label: 'Los Angeles County', url: 'https://ttc.lacounty.gov/#' },
        { label: 'Orange County', url: 'https://taxbill.octreasurer.gov/' },
        { label: 'Riverside County', url: 'https://countytreasurer.org/tax-collector/how-pay-your-taxes' },
        { label: 'San Bernardino County', url: 'https://www.sbcountyatc.gov/tax-services/property-tax?redir=CurrentTaxes' } ] } ] }
  ],
  // Company calendars: IDs read from the live Sites calendar page embeds
  // 2026-09-09 (Shoots & Shows cross-confirmed via CalendarApp). Modes match
  // the Sites views: Main = agenda, the rest = month grid.
  calendars: [
    { key: 'main',      label: 'FSE Main',            id: 'kutcp4r629ecdepkri5dui02uk@group.calendar.google.com', mode: 'AGENDA' },
    { key: 'fsepto',    label: 'FSE PTO',             id: 'k9liaqvpqgsiuvro0bbm9e1oi8@group.calendar.google.com', mode: 'MONTH' },
    { key: 'rtmshoots', label: 'RTM Shoots & Shows',  id: 'c_7qdg6c0j5l2nt4q77a4cv8n1v0@group.calendar.google.com', mode: 'MONTH' },
    { key: 'rtmpto',    label: 'RTM PTO',             id: '53sqrr56s4cfodrdd13fojqva0@group.calendar.google.com', mode: 'MONTH' }
  ],
  // Office contact block, harvested from the current Hub footer (socials and
  // website read from the live Sites footer 2026-09-14). maps kept as reference.
  contact: {
    address: '10509 Vista Sorrento Pkwy, Ste 300, San Diego, CA 92121',
    addressLines: ['10509 Vista Sorrento Pkwy', 'Ste 300', 'San Diego, CA 92121'],
    phone: '(858) 386-4811',
    fax: '(888) 321-6084',
    hours: 'Mon - Fri : 8:30 AM - 5:00 PM',
    taxId: '38-3858972',
    dbo: '963-2665',
    site: 'http://fivestarescrow.com',
    maps: 'https://maps.app.goo.gl/fSQigq4gCU8ib5N58',
    social: {
      instagram: 'https://www.instagram.com/fivestarescrow/',
      facebook: 'https://www.facebook.com/FiveStarEscrow/',
      linkedin: 'https://www.linkedin.com/company/fivestarscrow/'
    }
  },
  // Team-page accent choices: brand palette only (lead types the word in the
  // TeamContent Accent column; anything else falls back to navy).
  accents: { navy: '#031356', gold: '#fbbf24', silver: '#c4c8d6', grey: '#818591' },
  // Home page Staff Resources column, in Brett's 2026-09-14 order. Company
  // Meeting Notes is the all-company recordings/notes Drive folder; Staff
  // Photos is the photoshoot folder (both renamed 2026-09-14).
  hrLinks: [
    { label: 'iSolved (Coastal Payroll)', url: 'https://www.coastalpayroll.net/' },
    { label: 'Insurance Portal (Ease)', url: 'https://starfive.ease.com/' },
    { label: '401k Portal', url: 'https://app.401go.com/accounts/login/' },
    { label: 'Employee Handbook', url: 'https://drive.google.com/file/d/1gLbOHrXIAnQheWHhmkCrzJoiLYILZHoB/view' },
    { label: 'Paid Holidays 2026', url: 'https://docs.google.com/document/d/1dHVrUQrCz_Iuv6kywUbJXS4MofeP6iHjoQMccXLEhEs/edit' },
    { label: 'Company Meeting Notes', url: 'https://drive.google.com/drive/folders/1wbCDRuV2fPuOyhd_vjyT3gZm3A3kOnJL' },
    { label: 'Staff Photos', url: 'https://drive.google.com/drive/folders/1Vxn7B_NrgcwgKR-shFlFgNCPDdyO97iC' }
  ],
  // Admin page (?page=admin): front desk daily tools in Brett's three groups
  // (2026-09-14), rendered as three columns. TrustLink, Unishippers, and the
  // PM Tenant Portal stay on their canonical entry URLs (session redirects
  // stripped, Brett's standing 2026-09-09 call).
  adminGroups: [
    [
      { label: 'FD Asana Tasks', url: 'https://app.asana.com/1/459051476492004/project/815275980771931/list/1204992268705951' },
      { label: 'Company Call Log', url: 'https://app.smartsheet.com/sheets/FwJc8h44CFH6MJCQRwpGvhWqJXW76MVPQJMcVmp1' },
      { label: 'Banking', url: 'https://drive.google.com/drive/folders/1F7GXiYB_nc-dD6mvMf9N_wi2FpsGSUF7' },
      { label: 'FTB Scans', url: 'https://drive.google.com/drive/folders/1ZfoA8G_rZngxkthvIVHWGMdg2NaLlSnC' },
      { label: 'TrustLink (Daily Banking)', url: 'https://mytrustlink.com/' }
    ],
    [
      { label: 'Food Orders', url: 'https://docs.google.com/document/d/1MzlDXhnmjrt3I2c5EyYO__8pl3_mwiZTQv7DR7-t4Rk/edit' },
      { label: 'Snack Requests', url: 'https://docs.google.com/document/d/1KBbbcbD4o23wpul2kG5KWeZ71gPNzrL_qz-78CGK2WQ/edit' },
      { label: 'FDA SOPs', url: 'https://drive.google.com/drive/folders/1hNgUt5Jngjz5H3VJoeFG6Gvlq39aGcwf' },
      { label: 'Resources', url: 'https://drive.google.com/drive/folders/1UWZUzZ4d2OpUwnPaM7SovfwEZwXjdmpn' },
      { label: 'PM Tenant Portal', url: 'https://stride.healthpeak.com/' }
    ],
    [
      { label: 'FedEx', url: 'https://www.fedex.com/secure-login/en-us/#/credentials' },
      { label: 'Unishippers', url: 'https://www.myunishippers.com/' },
      { label: 'Rapid Delivery', url: 'https://www.dwaybill.com/Rapideliver' }
    ]
  ],
  mgmtLinks: [
    { label: 'FSE Ops SOPs', url: 'https://drive.google.com/drive/folders/1zDC7tqacsqAEyUEu-nSPXbrK9dAbEdzl' },
    { label: 'Vendor Directory', url: 'https://docs.google.com/spreadsheets/d/1pBPjbzj--jWyWz0x4b-qEFCmOwqfQN00KslKq8HFM_w/edit?gid=947852506#gid=947852506' },
    { label: 'Emergency Contacts', url: 'https://app.smartsheet.com/sheets/Phpr67J9qFPwQ2fRGfgGGR2cJcR4FJXP2rm8hgH1' },
    { label: 'TrustLink (Recon Reports)', url: 'https://mytrustlink.com/' },
    { label: 'Intermedia Portal', url: 'https://cp.intermedia.net/ControlPanel/Login' }
  ]
};

// Shared escrow fee schedule — single formula (Brett approved 2026-08-28):
//   fee(P) = max( min( 1650 + 5.00*P/1k,  1900 + 4.50*P/1k,  5650 + 2.50*P/1k,
//                      cap 20000 ),  2.00*P/1k )
// The min() picks the segment (lines cross at $500K / ~$1.88M / ~$5.74M); the
// $2.00-per-$1,000 line (0.200%) governs above $10M. Replaces the per-$100K tier
// table; tracks it within a few percent and removes its non-monotonic cliffs.
// Split: seller and buyer each pay half; an INVESTOR seller pays flat $750 instead.
var CALC = {
  min: 100000,
  max: 30000000,
  segs: [ { base: 1650, perK: 5.00 },    // to ~$500K
          { base: 1900, perK: 4.50 },    // ~$500K to ~$1.88M
          { base: 5650, perK: 2.50 } ],  // ~$1.88M to ~$5.74M
  cap: 20000,        // flat through $9.99M
  floorPerK: 2.00,   // $2.00 per $1,000 (0.200%), governs $10M-$30M
  investorFlat: 750  // seller side when the seller is an investor
};

// Wholesale (Concurrent Close) schedule, flat per-tier fees from the updated
// rate schedule Brett supplied 2026-09-14 (supersedes the 03.30.2026 version).
// acqOwn is the WHOLESALER's rate only (the seller pays the standard schedule
// rate); dispo is the TOTAL for the 2nd leg, split evenly if both pay.
// Client name deliberately kept off the portal: the arrangement is being
// offered to multiple clients. If the schedule changes, update CALCW here.
var CALCW = {
  tiers: [ { to: 500000,  acqOwn: 1000, acqBoth: 2500, dispo: 1500 },
           { to: 1000000, acqOwn: 1000, acqBoth: 3250, dispo: 1750 },
           { to: 1500000, acqOwn: 1000, acqBoth: 4000, dispo: 2000 },
           { to: 2000000, acqOwn: 1000, acqBoth: 4500, dispo: 2250 },
           { to: null,    acqOwn: 1000, acqBoth: 5000, dispo: 2500 } ],
  loanProc: 200  // loan processing fee to escrow, as applicable
};

/* ========================= ROUTER ========================= */

function renderPortalPage(pg, selfUrl, params) {
  var body, title, sub = '', opts = null;
  if (pg === 'resources')      { title = 'Team Resources';        body = portalResources(selfUrl); sub = portalPulseBar(); }
  else if (pg === 'calc')      { title = 'Escrow Fee Calculator'; body = portalCalc(); }
  else if (pg === 'forms')     { title = 'Forms';                 body = portalForms(selfUrl, params); }
  else if (pg === 'home')      { title = 'The Hub';               body = portalHome(selfUrl); sub = portalPulseBar(); }
  else if (pg === 'admin')     { title = 'Admin';                 body = portalAdmin(selfUrl); }
  else if (pg === 'directory') { title = 'Company Directory';     body = portalDirectory(); }
  else if (pg === 'calendars') { title = 'Company Calendars';     body = portalCalendars(selfUrl, params); }
  else if (pg === 'open')      { title = 'New Escrow';            body = intakeOpenPage(selfUrl, params); pg = 'team'; }
  else if (pg === 'file')      { title = 'Escrow Lookup';         body = intakeFilePage(selfUrl, params); pg = 'team'; }
  else if (pg === 'client' || pg === 'agent') { title = 'New Escrow'; body = intakeOpenPage(selfUrl, params); pg = 'team'; }
  else if (pg === 'team') {
    var key = (params && params.t) ? String(params.t).toLowerCase() : '';
    if (!TEAMS[key]) { return renderPortalPage('resources', selfUrl, params); }
    else {
      var t = TEAMS[key];
      var c = portalContent();
      var tc = (c && c.teams && c.teams[key]) || {};
      title = t.label;
      sub = portalTeamPulseBar(key, t.label);
      opts = { motto: tc.motto || '', accent: portalAccent(tc.accent), switcher: portalTeamSwitcher(selfUrl, key) };
      body = portalTeam(selfUrl, key, t, c, tc, opts.accent);
    }
  }
  else {
    return HtmlService.createHtmlOutput(portalShell('Not found',
      '<div class="pcard"><p class="pnote">No page "' + esc(pg) + '". Use ?page=home, resources, calc, forms, team, directory, or calendars.</p></div>', '', selfUrl, ''))
      .setTitle('Five Star Portal').addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  return HtmlService.createHtmlOutput(portalShell(title, body, pg, selfUrl, sub, opts))
    .setTitle('Five Star — ' + title)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ========================= FORMS PAGE ========================= */

// Both team forms on one page, swapped by tabs (?page=forms&f=take|support).
// Server-rendered tabs so deep links work from Quick Actions on the home page.
function portalForms(selfUrl, params) {
  var takeOn = !(params && params.f === 'support');
  return '<div class="pcard">' +
    '<div class="ftabs">' +
      '<a class="ftab' + (takeOn ? ' on' : '') + '" href="' + esc(selfUrl) + '?page=forms&f=take" target="_top">Take a Message</a>' +
      '<a class="ftab' + (takeOn ? '' : ' on') + '" href="' + esc(selfUrl) + '?page=forms&f=support" target="_top">Support Request</a>' +
    '</div>' +
    '<p class="pnote">' + (takeOn
      ? 'Phone message intake. Submissions land in the Company Call Log.'
      : 'IT and platform issues. Submissions create FD Asana tasks.') + '</p>' +
    '<div class="fwrap"><iframe class="fframe" title="' + (takeOn ? 'Take a Message form' : 'Support Request form') + '" src="' +
      esc(takeOn ? PORTAL.formUrls.takeMessage : PORTAL.formUrls.support) + '"></iframe></div>' +
  '</div>';
}

/* ========================= LIVE PULSE ========================= */

// Company-wide month-to-date numbers for the hub header, from the same five
// team Smartsheets the dashboards read (full-sheet pulls, same revenue rules:
// closed = Actual COE in month, opened = Open Date in month, non-canceled).
// Cached 15 minutes so the hub loads instantly after the first visit; any
// failure returns null and the bar simply doesn't render.
// All five team Smartsheets in ONE parallel round trip (UrlFetchApp.fetchAll).
// Same report-then-sheet fallback semantics as safeFetchGrid, per team.
function portalFetchGrids() {
  var token = PropertiesService.getScriptProperties().getProperty('SMARTSHEET_TOKEN');
  if (!token) return null;
  var keys = Object.keys(TEAMS), reqs = [];
  keys.forEach(function (k) {
    var id = TEAMS[k].sheet;
    reqs.push({ url: 'https://api.smartsheet.com/2.0/reports/' + id + '?pageSize=5000', method: 'get', headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
    reqs.push({ url: 'https://api.smartsheet.com/2.0/sheets/' + id, method: 'get', headers: { Authorization: 'Bearer ' + token }, muteHttpExceptions: true });
  });
  var out = {};
  try {
    var res = UrlFetchApp.fetchAll(reqs);
    keys.forEach(function (k, i) {
      var g = null;
      [res[i * 2], res[i * 2 + 1]].forEach(function (r) {
        if (!g && r && r.getResponseCode() === 200) { try { g = JSON.parse(r.getContentText()); } catch (e) {} }
      });
      out[k] = g;
    });
  } catch (e) { return null; }
  return out;
}

// One team's pulse payload from its parsed records. Forecast matches the
// dashboards' "Projected This Month": Closed MTD + open files with a
// Projected COE inside the current month.
function portalTeamCompute(recs, ctx) {
  var closing = recs.filter(function (r) {
    return r.open && r.projDate && r.projDate >= ctx.today && r.projDate <= ctx.next7End;
  }).sort(function (a, b) { return a.projDate < b.projDate ? -1 : 1; })
    .map(function (r) { return { d: r.projDate, no: r.escrowNo, addr: r.address, client: r.account }; });
  var closed = sumFees(eventRows(recs, 'closed', 'mtd', ctx));
  return {
    closed: closed,
    opened: sumFees(eventRows(recs, 'opened', 'mtd', ctx)),
    forecast: closed + sumFees(eventRows(recs, 'projected', 'thisMonth', ctx)),
    month: monthFull(ctx.monthStart),
    closing: closing
  };
}

// Company-wide pulse. On a cold cache this fetches all five sheets in
// parallel and warms every per-team cache at the same time, so a single
// refresh (or the portalWarm trigger) primes the whole portal.
function portalPulse(force) {
  try {
    var cache = CacheService.getScriptCache();
    if (!force) {
      var hit = cache.get('portalPulse');
      if (hit) return JSON.parse(hit);
    }
    var grids = portalFetchGrids();
    if (!grids) return null;
    var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
    var ctx = dateContext(tz);
    var closed = 0, opened = 0, forecast = 0, closingN = 0;
    Object.keys(TEAMS).forEach(function (k) {
      var g = grids[k];
      if (!g) return;
      var d = portalTeamCompute(toRecords(g), ctx);
      closed += d.closed; opened += d.opened; forecast += d.forecast; closingN += d.closing.length;
      cache.put('portalTeam_' + k, JSON.stringify(d), 900);
    });
    var out = { closed: closed, opened: opened, forecast: forecast, closingN: closingN, month: monthFull(ctx.monthStart) };
    cache.put('portalPulse', JSON.stringify(out), 900);
    attrIndex(true, grids);   // client attribution index, same fetch (Dashboards.gs)
    return out;
  } catch (e) { return null; }
}

function portalPulseBar() {
  var p = portalPulse();
  if (!p) return '';
  return '<div class="pulse">' +
    '<span class="pi"><b>' + money(p.forecast) + '</b> ' + esc(p.month) + ' forecast</span>' +
    '<span class="pi"><b>' + money(p.opened) + '</b> opened MTD</span>' +
    '<span class="pi"><b>' + money(p.closed) + '</b> closed MTD</span>' +
    '<span class="pi"><b>' + String(p.closingN) + '</b> closing in the next 7 days</span>' +
  '</div>';
}

// Time-driven cache warmer: install once with portalSetupTriggers. Refreshes
// the company pulse, all five team payloads, and the content sheet every run,
// so no visitor ever pays for a cold Smartsheet fetch.
function portalWarm() {
  portalPulse(true);
  portalContent(true);
  try { intakeIndexWarm(); } catch (e) { console.error('intakeIndexWarm: ' + e); }  // Escrow Lookup's file index (2026-11-03)
}

// Run ONCE from the editor: replaces any existing portalWarm trigger with a
// fresh every-10-minutes one. First run asks for the script.scriptapp scope.
function portalSetupTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'portalWarm') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('portalWarm').timeBased().everyMinutes(10).create();
  Logger.log('portalWarm trigger installed (every 10 minutes).');
}

/* ========================= CONTENT SHEET ========================= */

// People + TeamContent from the FSE Portal Content sheet (created by
// portalSetup; leads edit it directly, no deploy needed). Cached 5 minutes;
// any failure returns null and pages degrade gracefully.
function portalContent(force) {
  try {
    var cache = CacheService.getScriptCache();
    if (!force) {
      var hit = cache.get('portalContent');
      if (hit) return JSON.parse(hit);
    }
    var id = PropertiesService.getScriptProperties().getProperty('CONTENT_SHEET_ID');
    if (!id) return null;
    var ss = SpreadsheetApp.openById(id);
    var pv = ss.getSheetByName('People').getDataRange().getValues();
    var people = [];
    for (var i = 1; i < pv.length; i++) {
      var r = pv[i];
      if (!r[2]) continue;
      people.push({
        group: String(r[0] || ''), team: String(r[1] || '').toLowerCase(),
        name: String(r[2] || ''), role: String(r[3] || ''), ext: String(r[4] || ''),
        email: String(r[5] || ''), cell: String(r[6] || ''), photo: String(r[7] || ''),
        fact: String(r[8] || ''), ord: Number(r[9]) || 999
      });
    }
    people.sort(function (a, b) { return a.ord - b.ord; });
    var tv = ss.getSheetByName('TeamContent').getDataRange().getValues();
    var teams = {};
    for (var j = 1; j < tv.length; j++) {
      var t = tv[j];
      if (!t[0]) continue;
      teams[String(t[0]).toLowerCase()] = {
        email: String(t[1] || ''), motto: String(t[2] || ''),
        accent: String(t[3] || ''), announcement: String(t[4] || '')
      };
    }
    // Links + Contact tabs (2026-09-25). Each is optional and fail-soft on its
    // own: an unreadable tab leaves its slot null and portalConfig falls back
    // to the PORTAL constants for that slot only.
    var links = null, contact = null;
    try {
      var lsh = ss.getSheetByName('Links');
      if (lsh) links = portalParseLinks(lsh.getDataRange().getValues());
    } catch (e1) { links = null; }
    try {
      var csh = ss.getSheetByName('Contact');
      if (csh) contact = portalParseContact(csh.getDataRange().getValues());
    } catch (e2) { contact = null; }
    var out = { people: people, teams: teams, links: links, contact: contact };
    cache.put('portalContent', JSON.stringify(out), 300);
    return out;
  } catch (e) { return null; }
}

// Brand-palette whitelist for team accents. Anything unrecognized -> navy.
function portalAccent(word) {
  var w = String(word || '').trim().toLowerCase();
  return PORTAL.accents[w] || PORTAL.accents.navy;
}

// Links tab -> the PORTAL-shaped structures the renderers consume.
// Columns: Page | Section | Group | Label | URL | SortOrder (extra columns are
// ignored). Page is home / resources / admin; Section names match the page
// headings; Group is the sub-heading (Escrow Logins, Column 1, a title company
// on Title Links). Rows sort by SortOrder, then sheet order. Rows without a
// Label are skipped; a blank URL is dropped everywhere except Title Links,
// where it renders as a dash. Returns null when the tab has no data rows so
// portalConfig falls back to the constants instead of rendering empty pages.
function portalParseLinks(values) {
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var r = values[i];
    var label = String(r[3] || '').trim();
    if (!label) continue;
    var ordRaw = r[5];
    var ord = (ordRaw === '' || ordRaw === null || isNaN(Number(ordRaw))) ? 999 : Number(ordRaw);
    rows.push({
      page: String(r[0] || '').trim().toLowerCase(), section: String(r[1] || '').trim().toLowerCase(),
      group: String(r[2] || '').trim(), label: label, url: String(r[4] || '').trim(), ord: ord, i: i
    });
  }
  if (!rows.length) return null;
  rows.sort(function (a, b) { return (a.ord - b.ord) || (a.i - b.i); });
  function section(page, name) {
    name = name.toLowerCase();
    return rows.filter(function (x) { return x.page === page && x.section === name; });
  }
  function flat(list) {
    return list.filter(function (x) { return x.url; }).map(function (x) { return { label: x.label, url: x.url }; });
  }
  function grouped(list) {
    var order = [], by = {};
    list.forEach(function (x) {
      if (!by.hasOwnProperty(x.group)) { by[x.group] = []; order.push(x.group); }
      if (x.url) by[x.group].push({ label: x.label, url: x.url });
    });
    return order.map(function (g) { return { sub: g, links: by[g] }; })
      .filter(function (g) { return g.links.length; });
  }
  var out = {};
  out.hrLinks = flat(section('home', 'Staff Resources'));
  out.resourcesCol = flat(section('resources', 'Resources'));
  out.mgmtLinks = flat(section('admin', 'Management'));
  out.adminGroups = grouped(section('admin', 'Front Desk & Admin')).map(function (g) { return g.links; });
  out.linkCols = [];
  var escrow = grouped(section('resources', 'Escrow Links'));
  if (escrow.length) out.linkCols.push({ title: 'Escrow Links', groups: escrow });
  var taxes = grouped(section('resources', 'Property Taxes'));
  if (taxes.length) out.linkCols.push({ title: 'Property Taxes', groups: taxes });
  var cols = PORTAL.titleMatrix.cols, names = [], byName = {};
  section('resources', 'Title Links').forEach(function (x) {
    if (!byName.hasOwnProperty(x.group)) { byName[x.group] = {}; names.push(x.group); }
    byName[x.group][x.label.toLowerCase()] = x.url;
  });
  out.titleMatrix = names.length ? { cols: cols, rows: names.map(function (n) {
    return { name: n, urls: cols.map(function (c) { return byName[n][c.toLowerCase()] || ''; }) };
  }) } : null;
  return out;
}

// Contact tab -> PORTAL.contact shape. Columns: Key | Value. Keys (case-
// insensitive): address1, address2, address3, phone, fax, hours, taxId, dbo,
// website, maps, instagram, facebook, linkedin. The tab is authoritative when
// readable (a blanked value hides that line); null when it has no rows.
function portalParseContact(values) {
  var kv = {}, any = false;
  for (var i = 1; i < values.length; i++) {
    var k = String(values[i][0] || '').trim().toLowerCase();
    if (!k) continue;
    kv[k] = String(values[i][1] || '').trim();
    any = true;
  }
  if (!any) return null;
  var lines = [kv.address1, kv.address2, kv.address3].filter(function (s) { return s; });
  return {
    address: lines.join(', '), addressLines: lines,
    phone: kv.phone || '', fax: kv.fax || '', hours: kv.hours || '',
    taxId: kv.taxid || '', dbo: kv.dbo || '', site: kv.website || '', maps: kv.maps || '',
    social: { instagram: kv.instagram || '', facebook: kv.facebook || '', linkedin: kv.linkedin || '' }
  };
}

// Live config for the link-driven pages (Home, Team Resources, Admin): the
// sheet tabs when readable, the PORTAL constants otherwise, slot by slot.
// Renderers call this instead of reading PORTAL.* directly.
function portalConfig() {
  var c = portalContent();
  var L = (c && c.links) || null, K = (c && c.contact) || null;
  return {
    hrLinks: L ? L.hrLinks : PORTAL.hrLinks,
    resourcesCol: L ? L.resourcesCol : PORTAL.resourcesCol,
    titleMatrix: L ? L.titleMatrix : PORTAL.titleMatrix,
    linkCols: L ? L.linkCols : PORTAL.linkCols,
    adminGroups: L ? L.adminGroups : PORTAL.adminGroups,
    mgmtLinks: L ? L.mgmtLinks : PORTAL.mgmtLinks,
    contact: K || PORTAL.contact,
    source: (L ? 'sheet' : 'code') + '/' + (K ? 'sheet' : 'code')
  };
}

/* ========================= TEAM PAGES ========================= */

// One team's pulse + Closing This Week payload, cached 15 minutes (the
// portalWarm trigger refreshes it before expiry). Fail-soft null.
function portalTeamData(key, force) {
  try {
    var cache = CacheService.getScriptCache();
    var ck = 'portalTeam_' + key;
    if (!force) {
      var hit = cache.get(ck);
      if (hit) return JSON.parse(hit);
    }
    var token = PropertiesService.getScriptProperties().getProperty('SMARTSHEET_TOKEN');
    if (!token) return null;
    var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
    var ctx = dateContext(tz);
    var g = safeFetchGrid(TEAMS[key].sheet, token);
    if (!g) return null;
    var out = portalTeamCompute(toRecords(g), ctx);
    cache.put(ck, JSON.stringify(out), 900);
    return out;
  } catch (e) { return null; }
}

function portalTeamPulseBar(key, label) {
  var d = portalTeamData(key);
  if (!d) return '';
  return '<div class="pulse">' +
    '<span class="pi"><b>' + money(d.forecast) + '</b> ' + esc(d.month) + ' forecast</span>' +
    '<span class="pi"><b>' + money(d.opened) + '</b> opened MTD</span>' +
    '<span class="pi"><b>' + money(d.closed) + '</b> closed MTD</span>' +
    '<span class="pi"><b>' + String(d.closing.length) + '</b> closing in the next 7 days</span>' +
  '</div>';
}

// Corner chips for hopping between team pages (wireframe call).
function portalTeamSwitcher(selfUrl, activeKey) {
  return '<div class="tswitch">' + Object.keys(TEAMS).map(function (k) {
    var short = TEAMS[k].label.replace(/^Team\s+/i, '');
    if (short.length > 4) short = short.split(' ')[0];
    return '<a class="tsw' + (k === activeKey ? ' on' : '') + '" href="' + esc(selfUrl) + '?page=team&t=' + esc(k) + '" target="_top">' + esc(short) + '</a>';
  }).join('') + '</div>';
}

// Headshot circle, or accent-tinted initials while HeadshotUrl is empty.
// Photos are pre-cropped squares (2026-09-16 batch), rendered as-is with
// object-fit cover; no in-page zoom.
function portalAvatar(p, accent, big) {
  var cls = big ? 'av avbig' : 'av';
  if (p.photo) return '<img class="' + cls + '" src="' + esc(p.photo) + '" alt="">';
  var parts = String(p.name).trim().split(/\s+/);
  var ini = (parts[0] ? parts[0].charAt(0) : '') + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : '');
  return '<span class="' + cls + ' avi" style="background:' + esc(accent || PORTAL.accents.navy) + '">' + esc(ini.toUpperCase()) + '</span>';
}

// Profile card overlay shared by team rosters and the Directory. `list` is the
// people array the page rendered; showProfile(i) indexes into it. The modal is
// built with DOM calls (textContent), so sheet text can't inject markup.
function portalProfileKit(list, accent) {
  var slim = list.map(function (p) {
    return { n: p.name, r: p.role, g: p.group, e: p.ext, m: p.email, c: p.cell, f: p.fact, ph: p.photo };
  });
  var json = JSON.stringify(slim).replace(/</g, '\\u003c');
  return '<div id="pmask" class="pmask"><div class="pmodal" id="pmodal"></div></div>' +
  '<script>(function(){var P=' + json + ',AC=' + JSON.stringify(String(accent || PORTAL.accents.navy)) + ';' +
  'var mask=document.getElementById("pmask"),box=document.getElementById("pmodal");' +
  'function el(t,c,tx){var e=document.createElement(t);if(c)e.className=c;if(tx!=null)e.textContent=tx;return e;}' +
  'function ini(n){var a=String(n).trim().split(/\\s+/);return((a[0]||"").charAt(0)+(a.length>1?a[a.length-1].charAt(0):"")).toUpperCase();}' +
  'window.showProfile=function(i){var p=P[i];if(!p)return;box.innerHTML="";' +
    'if(p.ph){var im=document.createElement("img");im.className="av avbig";im.src=p.ph;im.alt="";box.appendChild(im);}' +
    'else{var av=el("span","av avbig avi",ini(p.n));av.style.background=AC;box.appendChild(av);}' +
    'box.appendChild(el("div","pmname",p.n));' +
    'box.appendChild(el("div","pmrole",p.r+(p.g?" \\u00b7 "+p.g:"")));' +
    'var ch=el("div","pmchips");' +
    'if(p.e)ch.appendChild(el("span","pmchip","ext "+p.e));' +
    'if(p.m){var a1=el("a","pmchip go",p.m);a1.href="mailto:"+p.m;ch.appendChild(a1);}' +
    'if(p.c&&p.c.indexOf("TODO")<0){var a2=el("a","pmchip go",p.c);a2.href="tel:"+p.c.replace(/[^0-9+]/g,"");ch.appendChild(a2);}' +
    'box.appendChild(ch);' +
    'if(p.f){var f=el("div","pmfact",p.f);box.appendChild(f);}' +
    'var x=el("button","pmx","\\u00d7");x.onclick=hideProfile;box.appendChild(x);' +
    'mask.style.display="flex";};' +
  'window.hideProfile=function(){mask.style.display="none";};' +
  'mask.addEventListener("click",function(e){if(e.target===mask)hideProfile();});' +
  'document.addEventListener("keydown",function(e){if(e.key==="Escape")hideProfile();});' +
  '})();</script>';
}

// The standardized team page: announcement + roster (from the content sheet),
// Your Tools (from TEAMS config), Closing This Week (from the team Smartsheet).
function portalTeam(selfUrl, key, t, c, tc, accent) {
  var roster = c ? c.people.filter(function (p) { return p.team === key; }) : [];
  var ann = tc.announcement ? '<div class="pcard acard" style="border-left:4px solid ' + esc(accent) + '">' +
    '<h2 class="ph2">Team Announcement</h2><p class="atext">' + esc(tc.announcement) + '</p></div>' : '';

  var rosterInner = roster.length ? '<div class="rgrid">' + roster.map(function (p, i) {
      return '<button class="rperson" type="button" onclick="showProfile(' + i + ')">' +
        portalAvatar(p, accent) + '<span class="rname">' + esc(p.name.split(' ')[0]) + '</span></button>';
    }).join('') + '</div>'
    : '<p class="pnote">Roster loads from the FSE Portal Content sheet.</p>';
  var teamMail = tc.email ? '<a class="pmchip go tmail" href="mailto:' + esc(tc.email) + '">' + esc(tc.email) + '</a>' : '';

  var tools = '<div class="pcard"><h2 class="ph2">Your Tools</h2>' +
    '<p class="pnote">The calculator, Take a Message, and Support live in the header on every page.</p>' +
    '<div class="tbtns">' +
    '<a class="pbtn" href="' + esc(selfUrl) + '?page=open&t=' + esc(key) + '" target="_top">New Escrow</a>' +
    '<a class="pbtn" href="' + esc(selfUrl) + '?page=file" target="_top">Escrow Lookup</a>' +
    '<a class="pbtn" href="' + esc(selfUrl) + '?team=' + esc(key) + '" target="_top">' + esc(t.label) + ' Dashboard</a>' +
    (t.link ? '<a class="pbtn" href="' + esc(t.link) + '" target="_blank" rel="noopener">' + esc(t.label) + ' Smartsheet</a>' : '') +
  '</div></div>' +
    intakeStaleCard(selfUrl, key);  // pre-opens past INTAKE_EDIT.staleDays (Intake.gs; empty when none)

  var d = portalTeamData(key);
  var closing;
  if (!d) closing = '<p class="pnote">Closing data is unavailable right now.</p>';
  else if (!d.closing.length) closing = '<p class="pnote">Nothing on the books for the next 7 days.</p>';
  else closing = '<div class="scroll"><table class="ptable"><thead><tr><th>Proj COE</th><th>Escrow #</th><th>Property</th><th>Client</th></tr></thead><tbody>' +
    d.closing.map(function (r) {
      return '<tr><td>' + esc(labelFromISO(r.d, true)) + '</td><td>' + esc(r.no) + '</td><td>' + esc(r.addr) + '</td><td>' + esc(r.client) + '</td></tr>';
    }).join('') + '</tbody></table></div>';

  return ann +
    '<div class="teamgrid">' +
      '<div class="pcard"><h2 class="ph2">Team Roster</h2>' + rosterInner + teamMail + '</div>' +
      tools +
    '</div>' +
    '<div class="pcard"><h2 class="ph2">Closing This Week</h2>' + closing + '</div>' +
    portalProfileKit(roster, accent);
}

/* ========================= DIRECTORY ========================= */

// Native searchable directory off the same People sheet as the rosters.
// Rows open the shared profile card.
function portalDirectory() {
  var c = portalContent();
  if (!c || !c.people.length) {
    return '<div class="pcard"><p class="pnote">The directory is unavailable right now. Try again in a minute.</p></div>';
  }
  var rows = '', lastGroup = '';
  c.people.forEach(function (p, i) {
    if (p.group !== lastGroup) {
      lastGroup = p.group;
      rows += '<tr class="ghead"><td colspan="4">' + esc(p.group) + '</td></tr>';
    }
    var s = (p.name + ' ' + p.role + ' ' + p.email + ' ' + p.group).toLowerCase();
    rows += '<tr class="drow" data-s="' + esc(s) + '" onclick="showProfile(' + i + ')">' +
      '<td class="dname">' + esc(p.name) + '<span class="drole">' + esc(p.role) + '</span></td>' +
      '<td>' + esc(p.ext) + '</td>' +
      '<td class="demail">' + esc(p.email) + '</td>' +
      '<td>' + esc(p.cell.indexOf('TODO') < 0 ? p.cell : '') + '</td></tr>';
  });
  return '<div class="pcard">' +
    '<input id="dsearch" class="dsearch" type="search" placeholder="Search by name, role, or team..." autocomplete="off">' +
    '<div class="scroll"><table class="ptable dtable"><thead><tr><th>Name</th><th>Ext</th><th>Email</th><th>Cell</th></tr></thead>' +
    '<tbody id="dbody">' + rows + '</tbody></table></div>' +
    '<p class="pnote rhint">Tap a row for the full profile card.</p></div>' +
    portalProfileKit(c.people, PORTAL.accents.navy) +
    '<script>(function(){var q=document.getElementById("dsearch"),tb=document.getElementById("dbody");' +
    'q.addEventListener("input",function(){var v=q.value.trim().toLowerCase();' +
      'var trs=tb.rows,i,gh=null,vis=0;' +
      'for(i=0;i<trs.length;i++){var r=trs[i];' +
        'if(r.className.indexOf("ghead")>=0){if(gh)gh.style.display=vis?"":"none";gh=r;vis=0;continue;}' +
        'var on=!v||(r.getAttribute("data-s")||"").indexOf(v)>=0;' +
        'r.style.display=on?"":"none";if(on)vis++;}' +
      'if(gh)gh.style.display=vis?"":"none";});' +
    '})();</script>';
}

/* ========================= CALENDARS ========================= */

// Four company calendars, one embed, server-rendered tabs (?page=calendars&cal=key).
// The tab param is `cal`, not `c`: Google reserves `c` on /exec URLs and serves
// a Drive error page before doGet ever runs (found the hard way, 2026-09-09).
function portalCalendars(selfUrl, params) {
  var want = (params && params.cal) ? String(params.cal).toLowerCase() : '';
  var cur = PORTAL.calendars[0];
  PORTAL.calendars.forEach(function (c) { if (c.key === want) cur = c; });
  var tabs = PORTAL.calendars.map(function (c) {
    return '<a class="ftab' + (c.key === cur.key ? ' on' : '') + '" href="' + esc(selfUrl) + '?page=calendars&cal=' + esc(c.key) + '" target="_top">' + esc(c.label) + '</a>';
  }).join('');
  var src = 'https://calendar.google.com/calendar/embed?src=' + encodeURIComponent(cur.id) +
    '&mode=' + cur.mode + '&ctz=America%2FLos_Angeles&wkst=1&showPrint=0&showCalendars=0&showTz=0';
  return '<div class="pcard">' +
    '<div class="ftabs">' + tabs + '</div>' +
    '<div class="fwrap"><iframe class="calframe" title="' + esc(cur.label) + ' calendar" src="' + esc(src) + '"></iframe></div>' +
  '</div>';
}

/* ========================= HOME & ADMIN ========================= */

// The Hub home: Staff Resources vertical pill column (order and names per
// Brett 2026-09-14), the FSE Main preview, and the full contact block from
// the current Hub footer (tax ID, DBO license, website, socials, phone, fax,
// hours) beside the map.
function portalHome(selfUrl) {
  var cfg = portalConfig();
  var staff = '<div class="band"><h2 class="bh2">Staff Resources</h2><div class="chipcol">' +
    cfg.hrLinks.map(function (l) {
      return '<a class="chip" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
    }).join('') + '</div></div>';

  var holSrc = 'https://calendar.google.com/calendar/embed?src=' + encodeURIComponent(PORTAL.calendars[0].id) +
    '&mode=AGENDA&ctz=America%2FLos_Angeles&showPrint=0&showCalendars=0&showTz=0&showTitle=0';
  var cal = '<div class="pcard"><h2 class="ph2">Upcoming on FSE Main</h2>' +
    '<div class="fwrap"><iframe class="holframe" loading="lazy" title="FSE Main calendar" src="' + esc(holSrc) + '"></iframe></div>' +
    '<p class="pnote rhint"><a class="plink" href="' + esc(selfUrl) + '?page=calendars" target="_top">All company calendars</a></p></div>';

  var c = cfg.contact;
  var digits = String(c.phone || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
  var telHref = 'tel:+1' + digits;
  var svgHead = '<svg class="socsvg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  var icIg = svgHead + '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>';
  var icFb = svgHead + '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>';
  var icLi = svgHead + '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>';
  var soc = '<div class="socrow">' +
    (c.social.instagram ? '<a class="soc" href="' + esc(c.social.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + icIg + '</a>' : '') +
    (c.social.facebook ? '<a class="soc" href="' + esc(c.social.facebook) + '" target="_blank" rel="noopener" aria-label="Facebook">' + icFb + '</a>' : '') +
    (c.social.linkedin ? '<a class="soc" href="' + esc(c.social.linkedin) + '" target="_blank" rel="noopener" aria-label="LinkedIn">' + icLi + '</a>' : '') +
  '</div>';
  var contact = '<div class="pcard ctcard"><h2 class="ph2">Contact & Office Details</h2><div class="twocol">' +
    '<div>' +
      c.addressLines.map(function (ln, i, arr) { return '<p class="ctline' + (i === arr.length - 1 ? ' ctgap' : '') + '">' + esc(ln) + '</p>'; }).join('') +
      (c.phone ? '<p class="ctline ctnw">Phone: <a class="ctlink" href="' + esc(telHref) + '">' + esc(c.phone) + '</a></p>' : '') +
      (c.fax ? '<p class="ctline ctnw">Fax: ' + esc(c.fax) + '</p>' : '') +
      (c.hours ? '<p class="ctline">' + esc(c.hours) + '</p>' : '') +
    '</div>' +
    '<div>' +
      (c.taxId ? '<p class="ctline ctnw">Tax ID: ' + esc(c.taxId) + '</p>' : '') +
      (c.dbo ? '<p class="ctline ctnw ctgap">DBO License: ' + esc(c.dbo) + '</p>' : '') +
      (c.site ? '<p class="ctline ctgap"><a class="ctlink" href="' + esc(c.site) + '" target="_blank" rel="noopener">FiveStarEscrow.com</a></p>' : '') +
      soc +
    '</div>' +
  '</div></div>';
  var map = '<div class="band"><div class="fwrap"><iframe class="mapframe" loading="lazy" title="Office map" src="' +
    esc('https://www.google.com/maps?q=' + encodeURIComponent(c.address) + '&output=embed') + '"></iframe></div></div>';

  return '<div class="homegrid">' + staff + cal + '</div>' +
    '<div class="homegrid">' + map + contact + '</div>';
}

// Admin page: front desk tools in three grouped columns + management links.
function portalAdmin(selfUrl) {
  function llink(l) {
    return '<a class="llink" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
  }
  var cfg = portalConfig();
  var groups = cfg.adminGroups.map(function (g) {
    return '<div class="lcol"><div class="llist">' + g.map(llink).join('') + '</div></div>';
  }).join('');
  return '<div class="band"><h2 class="bh2">Front Desk & Admin</h2><div class="lcols">' + groups + '</div></div>' +
    '<div class="band"><h2 class="bh2">Management</h2><div class="llist mcol">' + cfg.mgmtLinks.map(llink).join('') + '</div></div>';
}

/* ========================= PAGES ========================= */

// Team Resources (2026-09-11 round two): one band with Escrow Teams (team-page
// pills; Dashboard/Smartsheet live on the team pages) and Resources columns,
// the Title Links matrix, then Escrow Links and Property Taxes as text-link
// columns. Teams stay config-driven from TEAMS.
function portalResources(selfUrl) {
  var cfg = portalConfig();
  var teams = Object.keys(TEAMS).map(function (k) {
    return '<a class="chip" href="' + esc(selfUrl) + '?page=team&t=' + esc(k) + '" target="_top">' + esc(TEAMS[k].label) + '</a>';
  }).join('');
  var res = cfg.resourcesCol.map(function (l) {
    return '<a class="chip" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
  }).join('');
  var top = '<div class="band">' +
    '<div class="bgroup"><h3 class="colh">Escrow Team Pages</h3><div class="chipgrid">' + teams + '</div></div>' +
    '<div><h3 class="colh">Resources</h3><div class="chipgrid">' + res + '</div></div>' +
  '</div>';

  var tm = cfg.titleMatrix || { cols: [], rows: [] };
  var thead = '<tr><th></th>' + tm.cols.map(function (c) { return '<th>' + esc(c) + '</th>'; }).join('') + '</tr>';
  var trows = tm.rows.map(function (r) {
    return '<tr><td class="btname">' + esc(r.name) + '</td>' + r.urls.map(function (u) {
      return '<td>' + (u ? '<a class="blink" href="' + esc(u) + '" target="_blank" rel="noopener">Open</a>' : '<span class="bdash">—</span>') + '</td>';
    }).join('') + '</tr>';
  }).join('');
  var title = tm.rows.length ? '<div class="band"><h2 class="bh2">Title Links</h2>' +
    '<div class="scroll"><table class="btable"><thead>' + thead + '</thead><tbody>' + trows + '</tbody></table></div></div>' : '';

  var sections = cfg.linkCols.map(function (s) {
    var groups = s.groups.map(function (g) {
      var ls = g.links.map(function (l) {
        return '<a class="llink" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
      }).join('');
      return '<div class="lcol">' + (g.sub ? '<h3 class="colh">' + esc(g.sub) + '</h3>' : '') + '<div class="llist">' + ls + '</div></div>';
    }).join('');
    return '<div class="band"><h2 class="bh2">' + esc(s.title) + '</h2><div class="lcols">' + groups + '</div></div>';
  }).join('');

  return top + title + '<div class="lgrid">' + sections + '</div>';
}

// Interactive fee calculator, two sections. Standard: the CALC formula with
// seller / buyer split and the investor-seller flat toggle (which also shows
// the seller credit: normal seller half minus the flat fee). Wholesale
// (Concurrent): flat CALCW tiers, all three scenario fees at once.
function portalCalc() {
  var json = JSON.stringify(CALC).replace(/</g, '\\u003c');
  var wjson = JSON.stringify(CALCW).replace(/</g, '\\u003c');
  return '' +
  '<div class="pcard calcwrap">' +
    '<h2 class="ph2">Standard</h2>' +
    '<label class="plabel" for="cprice">Sale price</label>' +
    '<div class="cin"><span class="cdollar">$</span>' +
      '<input id="cprice" inputmode="numeric" autocomplete="off" placeholder="850,000"></div>' +
    '<div id="cout" class="cout"><p class="pnote">Enter a sale price to see the escrow fee.</p></div>' +
    '<div class="sgrid">' +
      '<div class="scard"><div class="slab">Seller</div><div class="sval" id="sellv">—</div>' +
        '<div class="scredit" id="scred" hidden></div>' +
        '<label class="inv"><input type="checkbox" id="invck"> Investor seller · flat ' + money(CALC.investorFlat) + '</label></div>' +
      '<div class="scard"><div class="slab">Buyer</div><div class="sval" id="buyv">—</div></div>' +
    '</div>' +
    '<p class="chint">The fee splits evenly between seller and buyer. The investor toggle sets the seller side to a flat ' + money(CALC.investorFlat) + '; the buyer side is unchanged.</p>' +
  '</div>' +
  '<div class="pcard"><details class="sched"><summary class="ph2 schedsum">Fee Schedule<span class="schedtip">reference · tap to view</span></summary>' +
    '<p class="pnote">One formula: the lowest of three base-plus-rate lines ($1,650 + $5.00/$1,000 · $1,900 + $4.50/$1,000 · $5,650 + $2.50/$1,000), capped at $20,000 through $9.9M, then 0.200% of price from $10M to $30M.</p>' +
    '<div id="ctable" class="scroll"></div></details></div>' +
  '<div class="pcard calcwrap">' +
    '<h2 class="ph2">Wholesale (Concurrent Close)</h2>' +
    '<label class="plabel" for="wprice">Purchase price</label>' +
    '<div class="cin"><span class="cdollar">$</span>' +
      '<input id="wprice" inputmode="numeric" autocomplete="off" placeholder="850,000"></div>' +
    '<div class="sgrid wgrid">' +
      '<div class="scard"><div class="slab">Acquisition (1st Leg) · wholesaler pays own</div><div class="sval" id="wacq1">—</div><div class="whint">wholesaler rate · seller pays standard</div></div>' +
      '<div class="scard"><div class="slab">Acquisition (1st Leg) · buyer pays both</div><div class="sval" id="wacq2">—</div><div class="whint">FSBO, assignment, or CAR</div></div>' +
      '<div class="scard"><div class="slab">Disposition (2nd Leg) · total</div><div class="sval" id="wdisp">—</div><div class="whint">if both pay, split evenly</div></div>' +
    '</div>' +
    '<p class="chint">Additional fee where applicable: loan processing to escrow ' + money(CALCW.loanProc) + '.</p>' +
  '</div>' +
  '<div class="pcard"><details class="sched"><summary class="ph2 schedsum">Wholesale Fee Schedule<span class="schedtip">reference · tap to view</span></summary>' +
    '<p class="pnote">Flat per-tier fees. The acquisition wholesaler rate covers the wholesaler side only (the seller pays the standard rate); the disposition fee is the total for that leg, split evenly if both parties pay.</p>' +
    '<div id="wtable" class="scroll"></div></details></div>' +
  '<script>(function(){var C=' + json + ';var W=' + wjson + ';' +
  'var q=document.getElementById("cprice"),o=document.getElementById("cout"),sv=document.getElementById("sellv"),bv=document.getElementById("buyv"),iv=document.getElementById("invck"),sc=document.getElementById("scred");' +
  'function money(n){n=Math.round(n);var s=String(Math.abs(n)),r="";while(s.length>3){r=","+s.slice(-3)+r;s=s.slice(0,-3);}return(n<0?"-$":"$")+s+r;}' +
  'function fee(p){var m=1/0,i,f;for(i=0;i<C.segs.length;i++){f=C.segs[i].base+C.segs[i].perK*p/1000;if(f<m)m=f;}if(C.cap<m)m=C.cap;f=C.floorPerK*p/1000;return f>m?f:m;}' +
  'function how(p){var fl=C.floorPerK*p/1000,m=1/0,mi=-1,i,f;' +
    'for(i=0;i<C.segs.length;i++){f=C.segs[i].base+C.segs[i].perK*p/1000;if(f<m){m=f;mi=i;}}' +
    'if(C.cap<m){m=C.cap;mi=-2;}' +
    'if(fl>m)return"0.200% of sale price";' +
    'if(mi===-2)return money(C.cap)+" flat";' +
    'var s=C.segs[mi];return money(s.base)+" + $"+s.perK.toFixed(2)+" per $1,000";}' +
  'function blank(msg){o.innerHTML=msg;sv.textContent="\\u2014";bv.textContent="\\u2014";sc.hidden=true;}' +
  'function render(){' +
    'var raw=q.value.replace(/[$,\\s]/g,"");var p=parseFloat(raw);' +
    'if(!raw){blank(\'<p class="pnote">Enter a sale price to see the escrow fee.</p>\');return;}' +
    'if(!(p>0)){blank(\'<p class="pnote">Enter a valid number.</p>\');return;}' +
    'if(p<C.min){blank(\'<div class="cmsg">Below the standard schedule ($100K minimum). Check with management for a quote.</div>\');return;}' +
    'if(p>C.max){blank(\'<div class="cmsg">Above the standard schedule ($30M maximum). Check with management for a quote.</div>\');return;}' +
    'var t=Math.round(fee(p));' +
    'var seller=Math.round(t/2),buyer=t-seller,half=seller;' +
    'if(iv.checked){seller=C.investorFlat;sc.hidden=false;sc.textContent="Seller credit: "+money(half-C.investorFlat);}else{sc.hidden=true;}' +
    'var total=seller+buyer;' +
    'var note=iv.checked?("Investor seller "+money(seller)+" + buyer "+money(buyer)):' +
      '(how(p)+" \\u00b7 "+(t/p*100).toFixed(3)+"% of "+money(p));' +
    'o.innerHTML=\'<div class="cfee">\'+money(total)+\'</div><div class="chow">\'+note+\'</div>\';' +
    'sv.textContent=money(seller);bv.textContent=money(buyer);}' +
  'q.addEventListener("input",render);iv.addEventListener("change",render);' +
  'var rows="",p,t,ps=[];' +
  'for(p=100000;p<=2000000;p+=100000)ps.push(p);' +
  'for(p=2500000;p<=6000000;p+=500000)ps.push(p);' +
  'for(var i=0;i<ps.length;i++){t=Math.round(fee(ps[i]));rows+="<tr><td>"+money(ps[i])+"</td><td class=\\"num\\">"+money(t)+"</td><td class=\\"num\\">"+money(Math.round(t/2))+"</td></tr>";}' +
  'rows+="<tr><td>$6M \\u2013 $9.9M</td><td class=\\"num\\">"+money(C.cap)+" flat</td><td class=\\"num\\">"+money(C.cap/2)+"</td></tr>";' +
  'rows+="<tr><td>$10M \\u2013 $30M</td><td class=\\"num\\">0.200% of price</td><td class=\\"num\\">half</td></tr>";' +
  'document.getElementById("ctable").innerHTML=\'<table class="ptable"><thead><tr><th>Sale price</th><th class="num">Total fee</th><th class="num">Per side</th></tr></thead><tbody>\'+rows+\'</tbody></table>\';' +
  'var wq=document.getElementById("wprice"),w1=document.getElementById("wacq1"),w2=document.getElementById("wacq2"),w3=document.getElementById("wdisp");' +
  'function wtier(p){for(var i=0;i<W.tiers.length;i++){var t=W.tiers[i];if(t.to===null||p<=t.to)return t;}}' +
  'function wrender(){var raw=wq.value.replace(/[$,\\s]/g,"");var p=parseFloat(raw);' +
    'if(!raw||!(p>0)){w1.textContent="\\u2014";w2.textContent="\\u2014";w3.textContent="\\u2014";return;}' +
    'var t=wtier(p);w1.textContent=money(t.acqOwn);w2.textContent=money(t.acqBoth);w3.textContent=money(t.dispo);}' +
  'wq.addEventListener("input",wrender);' +
  'var wrows="";' +
  'for(var wi=0;wi<W.tiers.length;wi++){var wt=W.tiers[wi];' +
    'var lab=wt.to===null?money(W.tiers[wi-1].to+1)+" and above":(wi===0?"$0 \\u2013 "+money(wt.to):money(W.tiers[wi-1].to+1)+" \\u2013 "+money(wt.to));' +
    'wrows+="<tr><td>"+lab+"</td><td class=\\"num\\">"+money(wt.acqOwn)+"</td><td class=\\"num\\">"+money(wt.acqBoth)+"</td><td class=\\"num\\">"+money(wt.dispo)+"</td></tr>";}' +
  'document.getElementById("wtable").innerHTML=\'<table class="ptable"><thead><tr><th>Purchase price</th><th class="num">Acq \\u00b7 wholesaler own</th><th class="num">Acq \\u00b7 buyer both</th><th class="num">Dispo \\u00b7 total</th></tr></thead><tbody>\'+wrows+\'</tbody></table>\';' +
  'q.focus();})();</script>';
}

/* ========================= SHELL & STYLES ========================= */

// Navy Hub chrome, two-layer header (2026-09-11 redesign): logo left, greeting
// (and team switcher) right, serif title, then nav pills left with the
// universal action card right (Take a Message / Support / Calculator). The
// action card replaces the old home Quick Actions and the Forms and
// Fee Calculator nav pills, so both actions ride on every page.
function portalShell(title, body, active, selfUrl, sub, opts) {
  var tz = Session.getScriptTimeZone() || 'America/Los_Angeles';
  var hour = Number(Utilities.formatDate(new Date(), tz, 'H'));
  var hello = hour < 12 ? 'Good morning' : (hour < 17 ? 'Good afternoon' : 'Good evening');
  var first = '';
  try {
    var em = String(Session.getActiveUser().getEmail() || '');
    if (em.indexOf('@') > 0) {
      first = em.split('@')[0].split(/[._-]/)[0];
      first = first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
    }
  } catch (e) {}
  var greet = hello + (first ? ', ' + first : '');
  var nav =
    '<a class="pnav' + (active === 'home' ? ' on' : '') + '" href="' + esc(selfUrl) + '?page=home" target="_top">Home</a>' +
    '<a class="pnav' + (active === 'resources' || active === 'team' ? ' on' : '') + '" href="' + esc(selfUrl) + '?page=resources" target="_top">Team Resources</a>' +
    '<a class="pnav' + (active === 'admin' ? ' on' : '') + '" href="' + esc(selfUrl) + '?page=admin" target="_top">Admin</a>' +
    '<a class="pnav' + (active === 'calendars' ? ' on' : '') + '" href="' + esc(selfUrl) + '?page=calendars" target="_top">Calendars</a>' +
    '<a class="pnav' + (active === 'directory' ? ' on' : '') + '" href="' + esc(selfUrl) + '?page=directory" target="_top">Directory</a>';
  return portalCss() +
    '<link rel="preconnect" href="https://fonts.googleapis.com">' +
    '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">' +
    '<div class="phead">' +
      (PORTAL.starWhite ? '<img class="pheadstar" src="' + PORTAL.starWhite + '" alt="">' : '') +
      '<div class="pheadin">' +
      '<div class="phrow">' +
        '<img class="plogo" src="' + PORTAL.logoUrl + '" alt="Five Star Escrow">' +
        '<div class="phright"><div class="pgreet">' + esc(greet) + '</div>' + ((opts && opts.switcher) || '') + '</div>' +
      '</div>' +
      '<h1 class="ptitle">' + esc(title) +
        (opts && opts.motto ? ' <span class="pmotto">“' + esc(opts.motto) + '”</span>' : '') + '</h1>' +
      '<div class="pnavrow"><div class="pnavs">' + nav + '</div>' + portalActionCard(selfUrl) + '</div>' +
      (sub || '') +
    '</div></div>' +
    '<div class="pwrap">' + body +
      '<div class="pfoot">Five Star Escrow · Team Portal</div>' +
    '</div>';
}

// The universal action card: hand-drawn inline SVG icons (external icon sets
// don't load inside the Apps Script sandbox).
function portalActionCard(selfUrl) {
  var svgHead = '<svg class="pai" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  var icPhone = svgHead + '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
  var icHead = svgHead + '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>';
  var icCalc = svgHead + '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></svg>';
  function ab(qs, label, icon) {
    return '<a class="pab" href="' + esc(selfUrl) + qs + '" target="_top">' + icon + '<span>' + label + '</span></a>';
  }
  return '<div class="pact">' +
    ab('?page=forms&f=take', 'Take a Message', icPhone) +
    ab('?page=forms&f=support', 'Support', icHead) +
    ab('?page=calc', 'Calculator', icCalc) +
  '</div>';
}

function portalCss() {
  return '<style>' +
  ':root{--navy:#031356;--navy2:#0a2170;--ink:#1e293b;--mut:#64748b;--line:#dde3ef;--bg:#e3e8f2;--card:#ffffff;--gold:#fbbf24}' +
  '*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:"Open Sans",-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}' +
  '.phead{background:linear-gradient(130deg,#020e40 0%,#031356 45%,#12277d 100%);color:#fff;padding:24px 20px 22px;position:relative;overflow:hidden}' +
  '.pheadstar{position:absolute;right:-24px;top:-26px;height:220px;pointer-events:none}' +
  '.pheadin{max-width:880px;margin:0 auto;position:relative}' +
  '.phrow{display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:8px}' +
  '.plogo{height:54px;display:block}' +
  '.phright{display:flex;flex-direction:column;align-items:flex-end;gap:8px}' +
  '.pgreet{font-size:15px;color:#c4c8d6;text-align:right}' +
  '.plogo-fb{font-family:"Playfair Display",serif;font-weight:700;letter-spacing:.14em;font-size:15px;color:#fff}' +
  '.ptitle{font-family:"Playfair Display",serif;font-weight:700;font-size:30px;margin:2px 0 14px;color:#fff;text-align:center}' +
  '.pmotto{font-size:16px;font-weight:400;font-style:italic;color:#c4c8d6;font-family:"Playfair Display",serif;margin-left:6px;white-space:nowrap}' +
  '.pnavrow{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap}' +
  '.pnavs{display:flex;gap:8px;flex-wrap:wrap}' +
  '.pnav{font-size:13px;font-weight:600;color:#dbe3ff;text-decoration:none;padding:7px 13px;border:1px solid rgba(255,255,255,.25);border-radius:999px}' +
  '.pnav.on{background:#fff;color:var(--navy);border-color:#fff}' +
  '.pact{display:flex;gap:2px;background:#fff;border-radius:12px;padding:5px;box-shadow:0 8px 20px rgba(2,8,40,.4)}' +
  '.pab{display:flex;flex-direction:column;align-items:center;gap:3px;padding:7px 12px 6px;border-radius:9px;text-decoration:none;color:var(--navy);font-size:10.5px;font-weight:700;letter-spacing:.01em;white-space:nowrap}' +
  '.pab:hover{background:var(--bg)}' +
  '.pai{width:20px;height:20px}' +
  '.tswitch{display:flex;gap:6px}' +
  '.tsw{font-size:11.5px;font-weight:700;color:#dbe3ff;text-decoration:none;border:1px solid rgba(255,255,255,.3);border-radius:7px;padding:4px 9px}' +
  '.tsw.on{background:#fff;color:var(--navy);border-color:#fff}' +
  '.pulse{display:flex;gap:8px 26px;flex-wrap:wrap;margin-top:16px;padding-top:13px;border-top:1px solid rgba(255,255,255,.16);font-size:12.5px;color:#c4c8d6}' +
  '.pi b{color:#fff;font-weight:700;font-size:15px;margin-right:6px}' +
  '.pwrap{max-width:880px;margin:0 auto;padding:22px 20px 30px}' +
  '.pcard{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;margin-bottom:16px;box-shadow:0 2px 6px rgba(3,19,86,.08)}' +
  '.band{background:linear-gradient(130deg,#020e40 0%,#031356 55%,#0a2170 100%);color:#fff;border-radius:14px;padding:20px;margin-bottom:16px;box-shadow:0 4px 12px rgba(3,19,86,.22)}' +
  '.bh2{font-family:"Playfair Display",serif;font-size:20px;font-weight:700;color:#fff;margin:0 0 12px}' +
  '.band .chip{border:none}' +
  '.band .ctline{color:#e8ecfa}' +
  '.twocol{display:grid;grid-template-columns:1fr 1fr;gap:20px 28px}' +
  '@media(max-width:640px){.twocol{grid-template-columns:1fr}}' +
  '.colh{font-size:14px;text-transform:uppercase;letter-spacing:.07em;font-weight:700;color:#b9c2e4;margin:0 0 10px}' +
  '.bgroup{margin-bottom:18px}' +
  '.lgrid{display:grid;grid-template-columns:2fr 1fr;gap:0 16px;align-items:start}' +
  '@media(max-width:700px){.lgrid{grid-template-columns:1fr}}' +
  '.socrow{display:flex;gap:10px;margin-top:12px}' +
  '.soc{width:36px;height:36px;border-radius:50%;background:#fff;color:var(--navy);display:inline-flex;align-items:center;justify-content:center}' +
  '.soc:hover{background:#e8ecfa}' +
  '.socsvg{width:17px;height:17px}' +
  '.ctlink{color:#fff;font-weight:600;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(255,255,255,.45)}' +
  '.ctlink:hover{text-decoration-color:#fff}' +
  '.chipcol{display:flex;flex-direction:column;gap:8px;align-items:stretch}' +
  '.chipcol .chip{text-align:center;padding:9px 12px}' +
  '.llist{display:flex;flex-direction:column;gap:7px}' +
  '.llink{color:#fff;text-decoration:none;font-size:13.5px;font-weight:600}' +
  '.llink:hover{text-decoration:underline;text-underline-offset:3px}' +
  '.lcols{display:grid;grid-template-columns:repeat(3,1fr);gap:18px 24px}' +
  '@media(max-width:640px){.lcols{grid-template-columns:1fr}}' +
  '.ctnw{white-space:nowrap}' +
  '.ctcard .ctlink{color:var(--navy);text-decoration-color:rgba(3,19,86,.35)}' +
  '.ctcard .ctlink:hover{text-decoration-color:var(--navy)}' +
  '.ctcard .soc{background:var(--navy);color:#fff}' +
  '.ctcard .soc:hover{background:var(--navy2)}' +
  '.ctcard .ph2{margin:0 0 16px}' +
  '.ctcard .ctline{margin:0 0 10px}' +
  '.ctcard .ctline.ctgap{margin-bottom:18px}' +
  '.lcol{min-width:0}' +
  '.lcol:only-child{grid-column:1/-1}' +
  '.mcol{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:8px 28px}' +
  '.btable{width:100%;border-collapse:collapse;font-size:13.5px;color:#fff;table-layout:fixed}' +
  '.btable th:first-child{width:25%}' +
  '.btable th{text-align:left;font-size:13.5px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;color:#b9c2e4;padding:6px 14px 6px 0;border-bottom:1px solid rgba(255,255,255,.25)}' +
  '.btable td{padding:9px 14px 9px 0;border-bottom:1px solid rgba(255,255,255,.12)}' +
  '.btname{font-weight:700}' +
  '.blink{color:#fff;font-weight:600;text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(255,255,255,.45)}' +
  '.blink:hover{text-decoration-color:#fff}' +
  '.bdash{color:#9aa6d4}' +
  '.ph2{font-family:"Playfair Display",serif;font-size:20px;font-weight:700;color:var(--navy);margin:0 0 6px}' +
  '.pnote{font-size:13px;color:var(--mut);margin:0 0 14px}' +
  '.tbtns{display:flex;gap:8px;flex-wrap:wrap}' +
  '.pbtn{display:inline-block;background:var(--navy);color:#fff;font-size:13px;font-weight:600;text-decoration:none;padding:8px 14px;border-radius:8px}' +
  '.pbtn:hover{background:var(--navy2)}' +
  '.pbtn.ghost{background:#fff;color:var(--navy);border:1px solid var(--navy)}' +
  '.pbtn.big{font-size:14px;padding:11px 18px}' +
  '.plabel{display:block;font-size:13.5px;text-transform:uppercase;letter-spacing:.06em;font-weight:700;color:var(--mut);margin-bottom:8px}' +
  '.cin{display:flex;align-items:center;gap:8px;border:2px solid var(--navy);border-radius:10px;padding:4px 14px;max-width:340px;background:#fff}' +
  '.cdollar{font-size:20px;font-weight:700;color:var(--navy)}' +
  '#cprice{border:none;outline:none;font-size:22px;font-weight:700;color:var(--ink);width:100%;padding:8px 0;font-family:inherit;background:transparent}' +
  '.cout{margin-top:16px;min-height:52px}' +
  '.cfee{font-family:"Playfair Display",serif;font-size:38px;font-weight:700;color:var(--navy);line-height:1.1}' +
  '.chow{font-size:13px;color:var(--mut);margin-top:6px}' +
  '.cmsg{font-size:14px;font-weight:600;color:#92400e;background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:12px 14px;max-width:520px}' +
  '.sgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-top:16px;max-width:520px}' +
  '.scard{background:linear-gradient(130deg,#020e40 0%,#0a2170 100%);border-radius:12px;padding:14px}' +
  '.slab{font-size:13px;text-transform:uppercase;letter-spacing:.06em;font-weight:700;color:#c4c8d6}' +
  '.sval{font-family:"Playfair Display",serif;font-size:26px;font-weight:700;color:#fff;margin-top:4px}' +
  '.inv{display:flex;align-items:center;gap:7px;font-size:12.5px;color:#e8ecfa;margin-top:10px;cursor:pointer;user-select:none}' +
  '.inv input{accent-color:var(--navy);width:15px;height:15px;margin:0}' +
  '.chint{font-size:12px;color:var(--mut);margin:12px 0 0}' +
  '.wgrid{max-width:760px}' +
  '.whint{font-size:11.5px;color:#c4c8d6;margin-top:4px}' +
  '.scredit{font-size:12.5px;font-weight:600;color:#86efac;margin-top:6px}' +
  '.ftabs{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}' +
  '.ftab{font-size:14px;font-weight:600;color:var(--navy);text-decoration:none;border:1px solid var(--navy);border-radius:999px;padding:8px 18px}' +
  '.ftab.on{background:var(--navy);color:#fff}' +
  '.fwrap{border:1px solid var(--line);border-radius:10px;overflow:hidden}' +
  '.fframe{width:100%;height:1500px;border:0;display:block}' +
  '.schedsum{cursor:pointer;user-select:none;margin:0}' +
  '.schedtip{font-size:12px;font-weight:400;font-family:"Open Sans",sans-serif;color:var(--mut);margin-left:10px}' +
  'details.sched[open] .schedsum{margin-bottom:10px}' +
  '.scroll{overflow-x:auto}' +
  '.ptable{width:100%;border-collapse:collapse;font-size:13.5px}' +
  '.ptable th{text-align:left;font-size:12.5px;text-transform:uppercase;letter-spacing:.05em;font-weight:700;color:var(--mut);padding:6px 10px 6px 0;border-bottom:1px solid var(--line)}' +
  '.ptable td{padding:7px 10px 7px 0;border-bottom:1px solid #eef2f7}' +
  '.ptable .num{text-align:right;font-weight:600;color:var(--navy)}' +
  '.pfoot{text-align:center;font-size:12px;color:var(--mut);margin-top:6px}' +
  '.acard{background:#fffdf4}' +
  '.atext{font-size:14.5px;color:var(--ink);margin:0;white-space:pre-line}' +
  '.teamgrid{display:grid;grid-template-columns:1.2fr 1fr;gap:16px}' +
  '@media(max-width:700px){.teamgrid{grid-template-columns:1fr}}' +
  '.rgrid{display:flex;gap:16px;flex-wrap:wrap;margin:6px 0 4px}' +
  '.rperson{display:flex;flex-direction:column;align-items:center;gap:6px;background:none;border:none;padding:4px;cursor:pointer;font-family:inherit;border-radius:10px}' +
  '.rperson:hover{background:var(--bg)}' +
  '.rname{font-size:12.5px;font-weight:600;color:var(--ink)}' +
  '.rhint{margin:6px 0 0}' +
  '.av{width:80px;height:80px;border-radius:50%;object-fit:cover;display:inline-flex;align-items:center;justify-content:center}' +
  '.avbig{width:96px;height:96px}' +
  '.avi{color:#fff;font-weight:700;font-size:24px;letter-spacing:.03em}' +
  '.avbig.avi{font-size:28px}' +
  '.tmail{display:inline-block;margin-top:8px}' +
  '.pmask{display:none;position:fixed;inset:0;background:rgba(3,19,86,.45);z-index:50;align-items:center;justify-content:center;padding:20px}' +
  '.pmodal{position:relative;background:#fff;border-radius:16px;padding:26px 26px 22px;max-width:340px;width:100%;display:flex;flex-direction:column;align-items:center;gap:8px;box-shadow:0 18px 50px rgba(3,19,86,.35);text-align:center}' +
  '.pmname{font-family:"Playfair Display",serif;font-size:22px;font-weight:700;color:var(--navy)}' +
  '.pmrole{font-size:13px;color:var(--mut)}' +
  '.pmchips{display:flex;flex-direction:column;gap:7px;width:100%;margin-top:8px}' +
  '.pmchip{font-size:13.5px;font-weight:600;color:var(--ink);border:1px solid var(--line);border-radius:9px;padding:8px 12px;background:var(--bg)}' +
  '.pmchip.go{color:var(--navy);text-decoration:none}' +
  '.pmchip.go:hover{border-color:var(--navy)}' +
  '.pmfact{font-size:13px;color:var(--mut);font-style:italic;border-top:1px solid var(--line);padding-top:10px;margin-top:6px;width:100%}' +
  '.pmx{position:absolute;top:8px;right:12px;background:none;border:none;font-size:24px;color:var(--mut);cursor:pointer;line-height:1}' +
  '.dsearch{width:100%;max-width:340px;font-size:15px;font-family:inherit;padding:10px 14px;border:2px solid var(--navy);border-radius:10px;outline:none;margin-bottom:14px}' +
  '.dtable .ghead td{font-family:"Playfair Display",serif;font-size:15px;font-weight:700;color:#fff;background:linear-gradient(130deg,#020e40 0%,#0a2170 100%);background-clip:padding-box;padding:9px 14px;border-radius:8px;border-bottom:none;border-top:10px solid var(--card)}' +
  '.drow{cursor:pointer}' +
  '.drow:hover td{background:var(--bg)}' +
  '.dname{font-weight:600;color:var(--navy)}' +
  '.drole{display:block;font-size:11.5px;font-weight:400;color:var(--mut)}' +
  '.demail{word-break:break-all}' +
  '.chipgrid{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 10px}' +
  '.chip{font-size:12.5px;font-weight:600;color:var(--navy);text-decoration:none;border:1px solid var(--line);border-radius:8px;padding:7px 11px;background:#fff}' +
  '.chip:hover{background:#e8ecfa}' +
  '.calframe{width:100%;height:760px;border:0;display:block;background:#fff}' +
  '.holframe{width:100%;height:340px;border:0;display:block;background:#fff}' +
  '.mapframe{width:100%;height:300px;border:0;display:block}' +
  '.homegrid{display:grid;grid-template-columns:1fr 1.3fr;gap:16px}' +
  '@media(max-width:700px){.homegrid{grid-template-columns:1fr}}' +
  '.homegrid .pcard,.homegrid .band{margin-bottom:16px}' +
  '.ctline{font-size:14px;color:var(--ink);margin:0 0 8px}' +
  '.plink{color:var(--navy);font-weight:600;text-decoration:none}' +
  '@media(max-width:640px){.ptitle{font-size:24px}.cfee{font-size:32px}.pmotto{white-space:normal}.phrow{flex-direction:column;align-items:flex-start}.phright{align-items:flex-start}.pgreet{text-align:left}.pnavrow{flex-direction:column;align-items:stretch}.pact{justify-content:space-around}}' +
  '</style>';
}

/* ========================= ONE-OFF SETUP (run from the editor) ========================= */

// Run > portalSetup, ONCE. Creates the "FSE Portal Content" spreadsheet with
// People and TeamContent tabs, seeded from the FSE Company Directory Doc
// (harvested 2026-09-09; Doc 1lsD19rNXSP235zhVQEiWuGj6fgondY5HHYbxZtMD7Qk),
// stores CONTENT_SHEET_ID in Script Properties, and logs the calendar
// name-to-ID map for the Calendars page build. First run asks for new
// authorizations (Sheets, Calendar, Drive). Safe to re-run: aborts if
// CONTENT_SHEET_ID already exists.
function portalSetup() {
  var props = PropertiesService.getScriptProperties();
  if (props.getProperty('CONTENT_SHEET_ID')) {
    Logger.log('CONTENT_SHEET_ID already set (' + props.getProperty('CONTENT_SHEET_ID') + '). Aborting to avoid duplicates.');
    return;
  }

  // Group, teamKey ('' = not an escrow team roster row), Name, Role, Ext, Email, Cell
  var PEOPLE_SEED = [
    ['Management', '', 'Brett Ward', 'Owner', '600', 'brett@brettward.net', '858-405-3333'],
    ['Management', '', 'Heather Bayes', 'Partner & Senior Escrow Officer', '602', 'hbayes@fivestarescrow.com', '619-249-5195'],
    ['Management', '', 'Jennifer Decker', 'Branch Manager', '604', 'jdecker@fivestarescrow.com', '858-212-1312'],
    ['Management', '', 'Elizabeth Eidbo', 'Director of Operations', '702', 'admin@fivestarescrow.com', '714-266-9632'],
    ['Management', '', 'Cassie Pellegrini', 'Director of Client Success', '701', 'cassie@fivestarescrow.com', '619-402-6002'],
    ['Management', '', 'Isabella Sandford', 'Front Desk Admin', '601', 'fda@fivestarescrow.com', '619-403-1509'],
    ['Team 1', 'jd', 'Jennifer Decker', 'Branch Manager & Escrow Officer', '604', 'jdecker@fivestarescrow.com', '858-212-1312'],
    ['Team 3', 'team3', 'Breana Harris', 'Escrow Officer', '608', 'bharris@fivestarescrow.com', '443-994-7872'],
    ['Team 3', 'team3', 'Vickie Jamison', 'Escrow Officer', '614', 'vjamison@fivestarescrow.com', '760-305-2777'],
    ['Team 3', 'team3', 'Joyce Priebe', 'Escrow Assistant', '606', 'jpriebe@fivestarescrow.com', '623-696-7867'],
    ['Team 5', 'team5', 'Charli Medellin', 'Escrow Officer', '618', 'cmedellin@fivestarescrow.com', '801-664-6172'],
    ['Team 5', 'team5', 'Liz Ruiz', 'Escrow Assistant', '616', 'lruiz@fivestarescrow.com', '626-841-2343'],
    ['Team 7', 'team7', 'Sydney Rohlfs', 'Escrow Officer', '610', 'srohlfs@fivestarescrow.com', '503-718-8779'],
    ['Team 7', 'team7', 'Nat Hyman', 'Escrow Assistant', '612', 'nhyman@fivestarescrow.com', '303-818-3753'],
    ['Team 9', 'team9', 'Vickie Jamison', 'Escrow Officer', '614', 'vjamison@fivestarescrow.com', '760-305-2777'],
    ['HR / Finance', '', 'Brooke Lenander', 'HR / Accounting', '', 'brooke@hqoffice365.com', ''],
    ['HR / Finance', '', 'Felicia Ward', 'Director of Finance', '', 'felicia@fivestarescrow.com', ''],
    ['Property Management', '', 'Britney Ross', 'Property Manager', '', 'bross@healthpeak.com', '858-260-2038'],
    ['Property Management', '', 'Kiley Cramer', 'Asst. Property Manager', '', 'kcramer@healthpeak.com', 'TODO: complete from Directory Doc']
  ];

  // teamKey, teamEmail, motto, accent, announcement (leads fill the last three)
  var TEAM_SEED = [
    ['jd',    'team1@fivestarescrow.com', '', '', ''],
    ['team3', 'team3@fivestarescrow.com', '', '', ''],
    ['team5', 'team5@fivestarescrow.com', '', '', ''],
    ['team7', 'team7@fivestarescrow.com', '', '', ''],
    ['team9', 'team9@fivestarescrow.com', '', '', '']
  ];

  var ss = SpreadsheetApp.create('FSE Portal Content');
  var people = ss.getActiveSheet().setName('People');
  people.getRange(1, 1, 1, 10).setValues([[
    'Group', 'TeamKey', 'Name', 'Role', 'Ext', 'Email', 'Cell', 'HeadshotUrl', 'FunFact', 'SortOrder'
  ]]).setFontWeight('bold');
  var rows = PEOPLE_SEED.map(function (r, i) { return r.concat(['', '', i + 1]); });
  people.getRange(2, 1, rows.length, 10).setValues(rows);
  people.setFrozenRows(1);

  var team = ss.insertSheet('TeamContent');
  team.getRange(1, 1, 1, 5).setValues([[
    'TeamKey', 'TeamEmail', 'Motto', 'Accent', 'Announcement'
  ]]).setFontWeight('bold');
  team.getRange(2, 1, TEAM_SEED.length, 5).setValues(TEAM_SEED);
  team.setFrozenRows(1);

  props.setProperty('CONTENT_SHEET_ID', ss.getId());
  Logger.log('Created FSE Portal Content: ' + ss.getUrl());

  Logger.log('--- Calendars visible to this account (name => id) ---');
  CalendarApp.getAllCalendars().forEach(function (c) {
    Logger.log('"' + c.getName() + '" => ' + c.getId());
  });
}

// Run > portalSetupLinks, ONCE (2026-09-25): adds the Links and Contact tabs
// to the FSE Portal Content sheet, seeded from the PORTAL constants so the
// first sheet-driven render is identical to the coded one. Aborts if either
// tab already exists. From then on the sheet is the source for those pages
// (portalConfig); the constants are only the fallback if a tab is unreadable.
// Needs no new authorization (Sheets scope granted by portalSetup).
function portalSetupLinks() {
  var id = PropertiesService.getScriptProperties().getProperty('CONTENT_SHEET_ID');
  if (!id) { Logger.log('CONTENT_SHEET_ID missing; run portalSetup first.'); return; }
  var ss = SpreadsheetApp.openById(id);
  if (ss.getSheetByName('Links') || ss.getSheetByName('Contact')) {
    Logger.log('Links or Contact tab already exists. Aborting to avoid duplicates.');
    return;
  }
  var rows = [], n = 0;
  function add(page, section, group, l) { n += 10; rows.push([page, section, group, l.label, l.url, n]); }
  PORTAL.hrLinks.forEach(function (l) { add('home', 'Staff Resources', '', l); });
  PORTAL.resourcesCol.forEach(function (l) { add('resources', 'Resources', '', l); });
  PORTAL.titleMatrix.rows.forEach(function (r) {
    r.urls.forEach(function (u, i) { add('resources', 'Title Links', r.name, { label: PORTAL.titleMatrix.cols[i], url: u }); });
  });
  PORTAL.linkCols.forEach(function (s) {
    s.groups.forEach(function (g) { g.links.forEach(function (l) { add('resources', s.title, g.sub, l); }); });
  });
  PORTAL.adminGroups.forEach(function (g, i) {
    g.forEach(function (l) { add('admin', 'Front Desk & Admin', 'Column ' + (i + 1), l); });
  });
  PORTAL.mgmtLinks.forEach(function (l) { add('admin', 'Management', '', l); });

  var links = ss.insertSheet('Links');
  links.getRange(1, 1, 1, 6).setValues([['Page', 'Section', 'Group', 'Label', 'URL', 'SortOrder']]).setFontWeight('bold');
  links.getRange(2, 1, rows.length, 6).setValues(rows);
  links.setFrozenRows(1);

  var c = PORTAL.contact;
  var kv = [
    ['address1', c.addressLines[0] || ''], ['address2', c.addressLines[1] || ''], ['address3', c.addressLines[2] || ''],
    ['phone', c.phone], ['fax', c.fax], ['hours', c.hours], ['taxId', c.taxId], ['dbo', c.dbo],
    ['website', c.site], ['maps', c.maps],
    ['instagram', c.social.instagram], ['facebook', c.social.facebook], ['linkedin', c.social.linkedin]
  ];
  var contact = ss.insertSheet('Contact');
  contact.getRange(1, 1, 1, 2).setValues([['Key', 'Value']]).setFontWeight('bold');
  contact.getRange(2, 1, kv.length, 2).setValues(kv);
  contact.setFrozenRows(1);

  CacheService.getScriptCache().remove('portalContent');
  Logger.log('Links tab: ' + rows.length + ' rows. Contact tab: ' + kv.length + ' rows. Content cache cleared.');
}
