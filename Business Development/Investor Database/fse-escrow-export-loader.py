import json, re, csv
from collections import defaultdict
d = json.load(open('data.json'))
rows = list(csv.DictReader(open('/root/.claude/uploads/1e78e17c-91e3-539c-aa0b-bb5720358016/0fcd0719-Export.csv', encoding='utf-8', errors='replace')))
TS = '2026-09-02T22:00:00Z'
NID = 'neil-dutta'; VID = 'jakob-hedger'
if not any(p['id'] == NID for p in d['partners']):
    d['partners'].append({'id': NID, 'name': 'Neil Dutta', 'company': 'ARV Finance'})
for r in d['records']:
    for p in d['partners']: r['relationships'].setdefault(p['id'], False)
PIDS = [p['id'] for p in d['partners']]

def base(name):
    n = re.sub(r',?\s+an?\s+(california|delaware|nevada|nebraska|florida)\s+(limited liability company|corporation|limitited liabilty company|limited liability company)\.?$', '', name.strip(), flags=re.I)
    return re.sub(r'\s+', ' ', n).strip().rstrip(',')
def norm(s):
    s = s.lower().replace('&', 'and'); s = re.sub(r'[^a-z0-9 ]', ' ', s)
    s = re.sub(r'\b(llc|inc|corp|corporation|a ca limited liability co)\b', '', s); return re.sub(r'\s+', ' ', s).strip()
def slug(s): return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')[:40]
reg = {}
for r in d['records']:
    if r['entity']: reg.setdefault(norm(r['entity']), r)
    for a in r['aliases']: reg.setdefault(norm(re.sub(r'\(.*?\)', '', a)), r)
def find_by_contact(name):
    for r in d['records']:
        if not r['entity'] and any(c['name'].lower() == name.lower() for c in r['contacts']): return r
def upsert_contact(r, first, last, email, phone):
    name = f'{first.strip()} {last.strip()}'.strip()
    if not name: return
    for c in r['contacts']:
        cn = c['name'].lower(); ln = last.strip().lower()
        if cn == name.lower() or (ln and ln in cn and first.strip().lower().split(' ')[0] in cn):
            if email and not c['email']: c['email'] = email
            if phone and not c['phone']: c['phone'] = phone
            return
    r['contacts'].append({'name': name, 'role': '', 'email': email, 'phone': phone, 'notes': ''})
existing_ids = {r['id'] for r in d['records']}
def add(entity, group='', notes='', flags=()):
    i = slug(entity or 'contact'); n = 2
    while i in existing_ids: i = f'{slug(entity or "contact")}-{n}'; n += 1
    existing_ids.add(i)
    r = {'id': i, 'entity': entity, 'aliases': [], 'contacts': [], 'address': '', 'city': '', 'state': '', 'zip': '', 'group': group, 'notes': notes,
         'relationships': {p: False for p in PIDS}, 'relationshipNotes': '', 'flags': list(flags), 'addedBy': 'Cowork (Five Star escrow export)', 'addedDate': '2026-09-02', 'src': [], 'created': TS, 'flips': {'count': 0}}
    d['records'].append(r); reg[norm(entity)] = r; return r

# buyer base name -> existing registry key (normalized) or ('new', entity, group, notes) or ('single', contact) or ('person',)
MAP = {
 '1 Way Home Real Estate and Mortgage Services Inc': '1 way home real estate and mortgage services',
 '4614 Winona, LLC': ('single',), '5425 Brockbank Development LLC': ('single',), '5545 Red River Dr LLC': ('single',),
 'ADM Home Improvement': 'adm home improvements', 'AKD Ventures, Inc.': 'akd ventures', 'AKD VENTURES, INC.': 'akd ventures',
 'Alper LLC': 'alper', 'Arbib Brothers LLC': ('new', 'Arbib Brothers LLC', 'Arbib', ''), 'ATK Real Estate LLC': 'atk',
 'BIYS Properties LLC': 'biys', 'Blooming Town Investments LLC': 'blooming town investments', 'Bodhi Homes, LLC': 'bodhi homes',
 'BRCSM Flips LLC': 'brcsm flips', 'BRH Investments LLC': ('new', 'BRH Investments LLC', '', 'Bought from Melcam Holdings (Five Star file 2025-12).'),
 'CRF Holdings LLC': 'crf holdings', 'Criss Cove LLC': 'criss', 'CS Global Development LLC': 'cs global',
 'D & K Development Group LLC': ('new', 'D & K Development Group LLC', '', 'Bought from New Fresh Investments (Five Star file 2026-03).'),
 'DA Group Investments LLC': 'da group investments', 'Elizabeth Katherine McElhinny, P.A.': ('new', 'Elizabeth Katherine McElhinny, P.A.', '', 'Florida corporation; Set Solution Home Buyers.'),
 'Epik Solutions LLC': 'epik solutions', 'Etzae Real Estate Investments LLC': 'etzae real estate investments',
 'Fidelity Management & Construction Inc.': ('new', 'Fidelity Management & Construction Inc', '', ''),
 'First American Portfolio Corporation, Inc': ('new', 'First American Portfolio Corporation', '', ''),
 'Garibay Home Renewal LLC': 'garibay', 'Golden State Investment Properties LLC': 'golden state investment properties', 'Good Deposits LLC': 'good deposits',
 'Green Home & Yard LLC': 'green home and yard', 'Hammer Property Investments LLC': ('new', 'Hammer Property Investments LLC', '', ''),
 'HL4 Bravo, LLC': 'hl4 bravo', 'Imperial Power LLC': ('new', 'Imperial Power LLC', '', ''), 'IRBOV LLC': 'irbov', 'JB Roberts Inc.': 'jb roberts',
 'Jin, Lijun': ('person', 'Lijun Jin'), 'KBCM LLC': 'kbcm', 'KD Developers LLC': 'kd developers', 'Kelly H Investments, LLC': 'kelly inv',
 'L.A. Construction Group Investments LLC': 'la construction investments', 'LDJ Enterprises Inc.': 'ldj enterprises', 'LMP 1, LLC': 'lmp 1', 'LSCR LLC': 'lscr',
 "M&M Residential's LLC": ('new', "M&M Residential's LLC", '', ''), 'M&S Homes Inc.': ('new', 'M&S Homes Inc', '', ''), 'MC Fair Investments, LLC': ('new', 'MC Fair Investments LLC', '', 'Folio Properties. Bought from New Fresh Investments (2026-03).'),
 'MIK Home S Corporation': 'mik homes', 'MNA Investment Properties LLC': 'mna investment properties', 'Montes Real Estate Investments LLC': 'montes real estate investments',
 'MS&MCNULTY LLC': ('new', 'MS&McNulty LLC', '', ''), 'Mylocal LLC': 'mylocal', 'N D Audo Investments LLC': 'n d audo', 'North County Investment Group LLC': ('new', 'North County Investment Group LLC', '', ''),
 'Omniluxe Properties LLC': 'omniluxe properties', 'ONQU REALTY INC': 'onqu realty', 'OP Investments LLC': 'op investments', 'Orca Properties, Inc.': 'orca properties',
 'Pacific Peak Capital LLC': 'pacific peak capital', 'Palm Tree Street LLC': 'palm tree street', 'Picket Fences D&C Inc.': 'picket fences dandc',
 'RCH USA LLC': ('new', 'RCH USA LLC', 'Kesler Ruiz de Chavez', ''), 'RDRE Holdings LLC': ('new', 'RDRE Holdings LLC', '', 'Nebraska LLC (Porchlight SoCal). Not the Daly/See RDRE Group.'),
 'REJ Holdings SD LLC': 'rej holdings sd', 'RMS Property Consulting, Inc.': 'rms property consulting', 'Rubicon Realty LLC': 'rubicon realty',
 'S and S Home Services': ('new', 'S and S Home Services', '', 'Bought from Melcam Holdings (2026-04).'), 'Sapphire and Sea LLC': 'sapphire and sea', 'SEV Holdings LLC': 'sev holdings',
 'Shammo Homes LLC': 'shammo homes', 'SIPNA, LLC': ('new', 'SIPNA LLC', '', ''), 'Solidarity Projects Inc': 'solidarity projects', 'Sonoca Corporation': 'sonoca',
 'Stanekzai, Farhad': ('person', 'Farhad Stanekzai'), 'Tarbh Dubh Property Group LLC': 'tarbh dubh property', 'Taylor Builders, Inc.': 'taylor builders',
 'The Kaas Trust, dated July 20, 2023': ('new', 'The Kaas Trust', '', 'Trust used as investment vehicle (Bakersfield).'),
 'The One Group Investment Fund LLC': 'the one group investment fund', 'The Pasto Family 2010 Trust dated July 30, 2011': ('new', 'The Pasto Family 2010 Trust', '', 'Trust used as investment vehicle; two Vertigo purchases in 2026.'),
 'TNT Homewerx LLC': 'tnt homewerx', 'Trotter Door & Trim Inc': 'trotter door and trim', 'V.C.T. Inc.': 'vct silver strand management', 'Van Coast, LLC': ('new', 'Van Coast LLC', '', ''),
 'Waverly 92056 LLC': 'waverly', 'Waypoint Development, LLC': 'waypoint development', 'White Whale Properties Inc.': 'white whale properties', 'Williard Realty LLC': 'williard realty',
 'Yosemite Property Fund LLC': 'yosemite property fund',
}
RENAME = {'atk': 'ATK Real Estate LLC', 'biys': 'BIYS Properties LLC', 'criss': 'Criss Cove LLC', 'cs global': 'CS Global Development LLC', 'garibay': 'Garibay Home Renewal LLC',
 'kelly inv': 'Kelly H Investments LLC', 'la construction investments': 'L.A. Construction Group Investments LLC', 'mik homes': 'MIK Home S Corporation', 'n d audo': 'N D Audo Investments LLC',
 'waverly': 'Waverly 92056 LLC', 'adm home improvements': 'ADM Home Improvement', 'sonoca': 'Sonoca Corporation', 'picket fences dandc': 'Picket Fences D&C Inc', 'tarbh dubh property': 'Tarbh Dubh Property Group LLC'}
for k, new in RENAME.items():
    r = reg.get(k)
    if r and norm(r['entity']) != norm(new):
        r['aliases'].append(r['entity'] + ' (as on FSE files)'); r['entity'] = new; reg[norm(new)] = r

hits = defaultdict(list); created = []
for row in rows:
    b = base(row['Buyer Name']); m = MAP.get(b)
    if m is None: print('UNMAPPED', b); continue
    if isinstance(m, str):
        r = reg.get(m)
        if not r: print('NOKEY', m); continue
    elif m[0] == 'new':
        r = reg.get(norm(m[1])) or add(m[1], m[2], m[3]); created.append(m[1]) if r['created'] == TS else None
    elif m[0] == 'single':
        first, last = row['Buyer Contact First Name'], row['Buyer Contact Last Name']
        nm = f'{first.strip()} {last.strip()}'
        r = find_by_contact(nm) or add('', '', f'Flips under a single-property LLC ({b}).', ['Company missing']); created.append(nm) if r['created'] == TS else None
    else:
        nm = m[1]; r = find_by_contact(nm) or add('', '', 'Individual buyer, no entity named.', ['Company missing'])
        if r['created'] == TS: created.append(nm); r['contacts'].append({'name': nm, 'role': '', 'email': '', 'phone': '', 'notes': ''})
    upsert_contact(r, row['Buyer Contact First Name'], row['Buyer Contact Last Name'], row['Buyer Email'].strip(), row['Buyer Work Phone'].strip())
    if isinstance(m, tuple) and m[0] == 'person':
        c = r['contacts'][0]; c['email'] = c['email'] or row['Buyer Email'].strip(); c['phone'] = c['phone'] or row['Buyer Work Phone'].strip()
    hits[r['id']].append(row)

def note(r, t):
    if t not in r['relationshipNotes']: r['relationshipNotes'] = (r['relationshipNotes'] + ' ' + t).strip()
for r in d['records']:
    rs = hits.get(r['id'])
    if not rs: continue
    vrev = [x for x in rs if 'VREV' in x['Seller Name'].upper()]
    arv = [x for x in rs if 'ARV FINANCE' in x['Lender Name'].upper()]
    fa = [x for x in rs if 'FIRST AMERICAN' in x['Title Company Name'].upper()]
    sellers = sorted({base(x['Seller Name']) for x in rs if 'VREV' not in x['Seller Name'].upper()})
    from datetime import datetime
    dts = sorted(datetime.strptime(x['Close Date'][:10], '%m/%d/%Y') for x in rs)
    span = dts[0].strftime('%b %Y') + (' to ' + dts[-1].strftime('%b %Y') if dts[-1].strftime('%b %Y') != dts[0].strftime('%b %Y') else '')
    if vrev:
        r['relationships'][VID] = True
        r['relationshipNotes'] = r['relationshipNotes'].replace('Vertigo: bought from or sold to Vertigo on Five Star files (Team 3, 2025-2026).', '').replace('Vertigo: counterparty on Vertigo-directed file (Team 3).', '').strip()
        r['relationshipNotes'] = re.sub(r'Vertigo: (counterparty on Vertigo-directed file|repeat buyer on Vertigo-directed files) \(Team 3[^)]*\)\.', '', r['relationshipNotes']).strip()
        note(r, f'Vertigo: bought {len(vrev)} propert{"y" if len(vrev)==1 else "ies"} from SD VREV on Five Star files ({span}).')
    if arv:
        r['relationships'][NID] = True
        note(r, f'ARV Finance: lender on {len(arv)} of these Five Star files.')
    if sellers:
        note(r, f'Bought from {", ".join(sellers)} on Five Star files.')
    if fa:
        note(r, f'Title: First American on {len(fa)} of {len(rs)} files.')
    r['flags'] = [f for f in r['flags'] if not f.startswith('Added from FSE escrow records') and not f.startswith('Add contact')]
    if r['entity'] and not r['contacts']: r['flags'].append('Add contact')

# resolve earlier "Confirm Vertigo" flags with new evidence
def resolve(entity_prefix, text, keep_vertigo=None):
    for r in d['records']:
        if r['entity'].lower().startswith(entity_prefix.lower()):
            r['flags'] = [f for f in r['flags'] if f != 'Confirm Vertigo relationship']
            r['relationshipNotes'] = re.sub(r'Vertigo: ".*?" file \(Team 3, [0-9-]+\) may be this entity\.', '', r['relationshipNotes']).strip()
            note(r, text)
resolve('Improve Imperial', 'Vertigo: "Imperial LLC/VREV" was Imperial Power LLC, a different entity. No Vertigo relationship shown.')
resolve('RDRE Group', 'Vertigo: "VREV/RDRE Holdings" was RDRE Holdings LLC (Nebraska), a different entity. No Vertigo relationship shown.')
# Vertigo record itself: ARV relationship (ARV lends on Vertigo resales) stays a judgment call; leave unchecked.
vert = next(r for r in d['records'] if r['entity'].startswith('Vertigo Real Estate'))
vert['aliases'] = [a for a in vert['aliases'] if not a.startswith('SD Vrev')] + ['SD VREV LLC', 'SDVREV', 'Vertigo Real Estate Investments']
d['log'].append({'ts': TS, 'action': f'Loaded Five Star escrow export (109 files, Nov 2025 to Sep 2026): added partner Neil Dutta (ARV Finance), contact emails and phones for {len(hits)} entities, {len(created)} records added; Vertigo and ARV relationships marked from seller and lender fields'})
json.dump(d, open('data.json', 'w'))
print(len(d['records']), 'records;', len(hits), 'entities hit;', len(created), 'created;', sum(1 for r in d['records'] if r['relationships'][NID]), 'ARV yes;', sum(1 for r in d['records'] if r['relationships'][VID]), 'Vertigo yes')
