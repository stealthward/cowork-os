# Client name merge list: attribution lookup

_COO, 2026-10-09. Personal Layer. Asana: "Client lookup: merge misspelled client names" (Operations Projects & Tasks, Task Queue, 1219372967310500). Status: approved by Brett 2026-10-09 (all of A, all B recommendations); shipped 2026-10-12 as 235 rows in the Client Merges tab plus the code rule (Dashboards CHANGELOG 2026-10-12)._

Source: the live attribution index on the FSE Client & Revenue Dashboard (Version 11), 1,204 clients from the five team sheets, read 2026-10-09. Scan: names compared after removing case, punctuation, "&"/"and", and generic words (Inc, LLC, Corp, Realty, Real Estate, Group), plus a one-or-two-letter typo check. 192 groups came back. They are sorted below into merges (A), judgment calls (B), and false matches left out (C).

Each row shows the name the lookup will show, then the spellings folded into it. Owner is the team on the newest file across all the spellings, computed from the index (checked in code, 2026-10-09), which is the team the lookup will show. Three "Show as" names are cleaned spellings not typed on any sheet (Fairway Independent Mortgage, Sentry Residential Inc, The Aguirre Team).

## Where the list lives (recommended)

Two layers, so the list stays short:

1. **A rule in code (both dashboards):** names match when they differ only by case, punctuation, spaces, "&" vs "and", or a trailing Inc, LLC, Corp, or Co. This alone covers about a third of the A rows (Bay Equity, LLC; Compass, Inc.; Seahorse Properties, Inc.) with no list entry.
2. **A "Client Merges" tab in the FSE Portal Content sheet** (two columns: Spelling on the sheet, Show as) for real misspellings and short or long names. Both dashboards read it on each refresh, so a new misspelling is fixed by adding a row, with no code change or deploy. Client Stats needs one new Google permission (read a spreadsheet), which Brett approves once on the first production deploy.

Revenue tables (Top Clients, % of Revenue) keep grouping by the raw name so they still reconcile to the Five Star Revenue Dashboard; only the lookups merge, per the task's done-when.

## A. Merge (spelling, punctuation, suffix, or the same company's short name)

| Show as | Folds in | Owner after merge |
|---|---|---|
| 1st Class Real Estate | 1st Claass Real Estate; 1st Class; 1st Class RE; 1st Class Real Estate Sd | Team 7, Apr 2024 |
| Acre Investment Real Estate | ACRE; Acre Investment | Team 3 |
| Acropolis Enterprise Inc | Acropolis Enterprise | Team 3 |
| Active Realty Inc | Active Realty | Team 7 |
| Aligned Mortgage | Alighed Mortgage; Aligned Morgage | Team 3 |
| Allison James Estates & Homes | Allison James & Estates; Allison James Estate; Allison James Estates | Team 3 |
| American Capital | Ameircan Capital | Team 7 |
| American Pacific Mortgage | American Pacfic Mortgage; American Pacific Mortgage Corp; American pacific Mortgageg; American Pacific Mortg; American Pacific Mrtg; American Pacific mtg | Team 7 |
| Apartment Consultants Inc | Apartment Consultants Inc. | Team 3 |
| Axcel Broker Inc | Axcel Broker; Axcel Broker Inc.; Axcel Brokers; Axel Broker; Axel Broker Inc | Team 7 |
| Bay Equity LLC | Bay Equity; Bay Equity, LLC; BayEquity | Team 7 |
| Bennion Deville Homes | Bennion Deville Home | Team 7 |
| Berkshire Hathaway | Berkshire Hatahaway; Bershire Hathaway | Team 7 |
| Berkshire Hathaway HomeServices | Berkshire Hathaway HomeService | Team 7, Dec 2022 |
| Better Homes and Gardens Real Estate | Better Homes & Gardens | Team 3 |
| Big Block Realty | Big Block; Big Block Realty Inc; Big Block Realty, Inc. | Team 7, Jan 2024 |
| Binesh Realty Group | Binesh Realty | Team 3 |
| Broadwater Realty | Broadwater | Team 3 |
| BTM Management | BTM Managment | Team 7 |
| Burke Real Estate Consultants | Burke Real Estate Consultants Inc.; Burker Real Estate Consultants | Team 3 |
| Burns Financial | Burn Financial | Team 3 |
| C2 Financial Corp | C2 Finacial; C2 Financial; C2Financial | Team 7 (Jen D., Nov 2021) |
| CA Mortgage Planners | CA Mortgage Planner | Team 7 |
| CA Res | CA-Res | Team 3 |
| Cal Pacific Real Estate | Cal Pacific | Team 3 |
| Caliber Home Loans | Cailber Home Loans; Cailiber Home loans | Team 7 |
| California Options Real Estate | California Option Real Estate; California Options | Team 3 |
| Camden Mckay Realty | Camden Mckay | Team 3 |
| Castro Group Real Estate | Castro Group | Team 7 (Charli M., Jul 2024) |
| Class Realty Group | Class Realty | Team 3 |
| Coastal Premier Properties | Coastal Premier; Coastal Premier Real Estate | Team 3 |
| Coastal Realty Solutions | Coastal Realty Solution | Team 7 |
| Coldwell Banker | Coldwell Banker Re; Coldwellbanker | Team 3 |
| Coldwell Banker Borrego | Coldwell Banker Borrega | Team 3 |
| Coldwell Banker West | Coldwell Banker Westq; Colwell Banker West | Team 3 |
| Coleman Jordan Real Estate | Coleman Jordan | Team 3 |
| Compass | Comapass Inc; Comass; Compass Inc; Compass Inc.; Compass Realty; Compass, Inc; Compass, Inc. | Team 3 |
| Cornerstone Mortgage | Conerstone Mortgage | Team 7 |
| CrossCountry | Cross Country; CrossCounty | Team 7 (Sydney R., Jan 2025) |
| Damico Realty | Damico; Damico Real Estate; Daminco Realty Group | Team 3 |
| Daniel Winnick | Daniel S. Winnick | Team 3 |
| Danny Davis Real Estate | Danny Davis | Team 7 (Brett W., Aug 2026) |
| David Vitale | Dave Vitale; David M vitale; David M. Vitale | Team 7 |
| DD Ventures Inc | DD Ventures | Team 7 |
| Douglas Elliman | Douglas Elliman Real Estate; Douglass Eliman | Team 3 |
| Dynasty Real Estate | Dynasty | Team 3 |
| eMortgage Capital | E mortgage Capital Inc | Team 7 |
| Ensign Realty | Ensign; Ensign Real estate | Team 7 (Jun 2019) |
| Executive Funding Group | Executive Funding | Team 7 |
| eXp Realty | eXp; EXP Realty | Team 7 |
| eXp Realty of California | eXp of California; eXp Realty of Californa; EXP Realty of California, Inc. | Team 3 |
| Fairway Independent Mortgage | Fairway Independant Mrtg; Fairway Independant mtg; Fairway Independent mtg; Fairway Mortage; Fairway Mortgage | Team 7 |
| Finance for Americans Corp | Finance for americans | Team 7 (Sep 2016) |
| Finance of America | Finace of America | Team 7 |
| Fine & Coastal Real Estate | Fine & Coastal; Fine and Coastal real estate | Team 7 |
| First Liberty Real Estate | First Liberty; First Liberty RE | Team 9 |
| First Nations Home Finance | First Nation Home Finance; First Nations Home Financce; First Nations Home Finance Corp.; First Nations Home; First Nations; First Nations Home Mtg; First Nations Mtg | Team 7 |
| First Team Real Estate | First Team; First Team RE | Team 3 |
| FirstCal | First Cal | Team 3 |
| Frontline Realty Group | Frontline; Frontline Realty | Team 7 |
| Gemstone Real Estate | Gemstone | Team 3 |
| Gillespie Realty | Gillespie Real Estate; Gillespie Realty, inc. | Team 7 |
| GM Lending Team | GM lendingTeam | Team 7 |
| Global Mortgage | Global Mortagage; Gobal Mortgage | Team 7 |
| Green Heights Realty | GreenHeights Realty Inc | Team 7 |
| Guaranteed Rate | Guarantee Rate; Guarenteed Rate | Team 7 |
| Harcourts Prime Properties | Harcourts Prime; Harcourts Prime Realty | Team 3 |
| Hawthorn & Albatross | Hawthorn & Albratross; Hawthorne & Albatross | Team 5 (Oct 7, 2026) |
| Help-U-Sell | Help U Sell; Help U Sell Real Estate | Team 7 (Jan 2015) |
| Highgarden Real Estate | Highgarden RE; Highgarden Realty | Team 3 |
| Home Financing Specialists | Home FInancing Specialist | Team 7 |
| HomePerqs | HomePerq's Inc. | Team 3 |
| HomePlus Mortgage | Homplus Mortgage | Team 7 |
| HomeServices Lending | Homerservices lending | Team 7 |
| HomeSmart Realty | Home Smart; Home Smart Realty; HomeSmart | Team 3 (Mar 2023) |
| HomeSmart Realty West | Home Smart Realty West; Home Smart West | Team 3 |
| Homeowners Financial Group | Homeowners Financial | Team 7 |
| John Bradford Inc | John Bradford; John Bradford Inc. | Team 7 |
| JR St. Julien | J.R. St Julien; JR St Julien | Team 3 |
| Kam Financial and Realty | Kam Financial | Team 7 |
| Keller Williams Realty | Keller Wiliams; Keller Wililams; Keller Willams; Keller Willams Realty; Keller William; Keller William Realty; Keller Williams; Keller Williams realty | Team 3 (Sep 2024) |
| Keller Williams La Jolla | Keller Williams -La Jolla; Keller Williams- La Jolla; Keller Williams-La Jolla | Team 7 |
| Keller Williams SD Metro | Keller William Metro; Keller William SD Metro; Keller Williams Metro | Team 3 |
| Kurt Luli-Kinsey | Kurt Luli Kinsey; Kurt luli-Kinsey | Team 9 (Sep 2026) |
| La Costa Sales & Rentals | La Costa Sales and rentals | Team 7 |
| Lenders Realty | Lender's Realty | Team 7 |
| Live.Love.San Diego Homes | Live.Love. San Diego Homes; Live.Love.San Diego | Team 3 |
| LKM Realty | LKM | Team 7 |
| Make It Happen Realty | Makeithappen Realty | Team 3 |
| Maple Holdings LLC | Maple Holding; Maple Holding Co; Maple Holdings | Team 7 |
| McCammon | McCamon | Team 7 |
| MNM Real Estate | MNM | Team 9 |
| Morgan Stanley | Morgan Stanely | Team 3 (May 2023) |
| Mountain Trust Realty | Mounatin Trust; Mountain Trust | Team 3 |
| New Leaf Realty | New Leaf | Team 7 |
| North Compass Realty | North Compas Realty; North Compass | JD Unit (Oct 2024) |
| One Choice Realty | Once Choice Realty | Team 3 |
| OneTrust | One Trust | Team 7 |
| Opes Real Estate Group | Opes Real Estate | Team 3 |
| Pacific Sotheby's International Realty | Pacific Sotheby's International; Pacific Sotheby's Int'l Realty; Pacific Southeby's Intl Realty; Pacific Sothbys; Pacific Sotheby's; Pacific Sothebys; Pacific Sotherby; Pacific Sotheyby's; Pacific Southeby's; Pacific Southebys; PacificSotheby's | Team 3 (May 2023) |
| Pasas Realty | Pasas; Pasas Properties | Team 7 |
| Pemberley Realty Inc | Pemberley Realty | Team 3 |
| Presidio Real Estate | Presidio | Team 7 |
| PrimeLending | Prime Lending | Team 7 (Jul 2026) |
| PrimeSource | Prime Source; Primesource | Team 3 |
| Professional Realty Group | Professional Realty | Team 7 |
| Ranch & Coast | Ranch and Coast; Ranch&Coast | JD Unit (Jan 2025) |
| RDRE Group LLC | RDRE Group | Team 7 |
| RE/MAX | Re/Max; Remax | Team 3 (Dec 2023) |
| RE/MAX Associates | Re/Max Associates; ReMax Associates | Team 7 (Jan 2020) |
| RE/MAX United | Re/Max United; ReMax United | Team 7 |
| Real Estate eBroker | RE Broker; RE eBroker; Real Estate E Broker; Real Estate EBroker Inc.; Real Estate eBroker, Inc.; ReBroker; ReEBroker; REeBroker Group | Team 7 (Jan 2024) |
| Realty One Group | Realty One | Team 7 (May 2019) |
| Rebecca Monge & Alysha Tanksley | Rebecca Monge / Alysha Tanksley | Team 7 |
| Renew Lending Inc | Renew Lending | Team 3 |
| Royal Integrity Realty | Royal Integrity | Team 9 |
| San Diego Brokerage | San Diego Bokerage | Team 7 |
| San Diego Sunrise Realty | San Diego Sunrise | Team 7 |
| San Terra Properties | San Terra | Team 7 |
| Sand & Sea Realty | San & Sea; Sand & Sea; Sand & Sea Realty Inc.; Sand &Sea Realty; Sand and Sea; Sand and Sea Realty | Team 3 (May 2024) |
| Scott & Quinn | Scott and Quinn | Team 7 |
| Seahorse Properties Inc | Seahorse Properties; Seahorse Properties Inc.; Seahorse Properties, Inc. | Team 3 |
| Sentry Residential Inc | Sentry Residential; Sentry Residential Inc. | Team 3 |
| Shatwell Real Estate | Shatwell Real Estate, Inc. | Team 7 |
| Shawna Scott, Broker | Shawna Scott Broker | Team 7 |
| Shera Realty Group | Shera Realty | Team 7 |
| Shore Capital Corp | Shore Capital; Shore Capital Corp. | Team 3 |
| Short Sale Experts Inc | Short sale experts | Team 7 |
| Short Sale San Diego Realty | Short Sale San Diego | Team 7 |
| Sill Realty Group | Sill Realty | Team 7 |
| Skyline Financial | Skyline Fianncial; SKyline Finacial; Skyline Finanacial; Skyline Financal; Skyline Financial Corp; Skyline Finncial | Team 7 |
| Smart Choice Realty | Smart Choice | Team 7 |
| SNL Realty | SNL | Team 7 |
| Solutions Real Estate | Solutions RE | Team 7 (Apr 2019) |
| Stasik Homes Real Estate | Stasik Home Real Estate | Team 7 |
| Sterling Investment Group | Sterling Investment; Sterling Investments | Team 3 |
| Stone Bridge Mortgage Inc | Stone Bridge Mortgage | Team 3 |
| SURE Realty | SURE Real Estate | Team 3 |
| Synergy One | Synergy Once; Syngergy One; Syngery One | Team 3 |
| Ten X Realty | Ten X; Ten X Reatly; Tenxrealty | Team 3 |
| The Aguirre Team | Aguirre Team; The Agurrie Team | Team 3 (Sep 2021) |
| The Avenue Home Collective | The Avenue Collection; The Avenue Home Collection | Team 7 (Feb 2023) |
| The Blu Summit Real Estate Group | The Blu Summit Real Estate | Team 3 |
| The Broker Network | Broker Network | Team 7 |
| The Comana Company | Comana Company | Team 3 |
| The Greenhouse Group | Green House Group; Greenhouse; GreenHouse Group; GreenHouse Group, Inc.; The Green House Group | Team 7 |
| The Guiltinan Group | Guiltinan Group | Team 7 |
| Three Arch Capital | Three Ach Capital; Three Arch Captial | Team 3 |
| Treehouse Mortgage Corp | Treehouse Mortgage | Team 3 |
| Veritas Mortgage Company Inc. | Veritas Mortgage Company | Team 7 |
| Verus Realty Group | Verus; Verus Realty; Versus Realty | Team 3 |
| Veterans United | Verterans United; Veterans Unites | Team 7 |
| Wenhe Mortgage & Realty | Wenhe Mortgage; Wenhe Mortgage & Real Estate; Wenhe Mortgage and Realty | Team 3 |
| WeRevive | We Revive; WeReive | Team 7 |
| Whissel Realty | Whissell Realty | Team 7 |
| Windermere Homes & Estates | Windermere Homes and Estates | Team 3 |

## B. Judgment calls (recommendation shown)

| Names | Question | Recommend |
|---|---|---|
| Adam Sussely-House (Team 7, 2026) / Adam Sussley-House (JD, 2025) | Same person, which spelling? | Merge as "Adam Sussely-House" (newest file) |
| Joanna Lindberg / Joanne Lindberg (both JD, Jun 2026) | Same person? | Merge as "Joanne Lindberg" (newest file) |
| Marc Lotzof / Marc Lotzoff (Team 3) | Same person? | Merge as "Marc Lotzof" (newest file) |
| Mike Sadiakian / Mike Sadikian (Team 3) | Same person? | Merge as "Mike Sadikian" |
| Montel Graves (Team 3, Nov 2025) / Montele Graves (Team 9, Aug 2026) | Same person? Merge moves him to Team 9 | Merge as "Montel Graves", owner Team 9 |
| Sandi Crosby / Sandra Crosby (Team 7) | Same person? | Merge as "Sandra Crosby" |
| Aligned; Alligned | Same as Aligned Mortgage? | Merge into Aligned Mortgage |
| Alison James; Allison James | Same as Allison James Estates & Homes? | Merge into Allison James Estates & Homes |
| American Pacific; American Pacifc; Ameircan Pacific; Amiercan Pacific; American Pacific Corp | Same as American Pacific Mortgage? | Merge into American Pacific Mortgage |
| American Dream Homes; American Dream Real Estate; American Dreams; American Dreams Real Estate (all Team 7) | One brokerage? | Merge as "American Dreams Real Estate" |
| Berkshire Hathaway / Berkshire Hathaway HomeServices | One brand? | Keep apart (franchise offices differ) |
| Coldwell Banker / Coldwell Banker Realty | One brand? | Keep apart (franchise offices differ) |
| eXp Realty / eXp Realty of California | One company? | Merge into eXp Realty |
| eMortgage / eMortgage Capital | Same lender? | Merge into eMortgage Capital |
| Encore; Encore Group; Encore Real Estate; Encore Realty (Teams 7 and 9) | One company? | Keep apart (unclear, teams differ) |
| Four Seasons (JD); Four Seasons Properties; Four Seasons Realty | One company? | Keep apart |
| Gold Coast (Team 5) / Gold Coast Real Estate (Team 3) | One company? | Merge, owner Team 5 (Aug 2021) |
| Fianance Corp of America / Finance of America | Same lender? | Keep apart |
| HomePlus (Team 7) / HomePlus Real Estate (Team 3) / HomePlus Mortgage | One company? | Keep apart |
| LX Properties / LX Realty | One company? | Keep apart |
| Mission Realty / Mission Realty Group | One company? | Keep apart (teams differ) |
| Skyline / Skyline Homes | Same as Skyline Financial? "Skyline" shares its newest date with Skyline Financial | Merge "Skyline" into Skyline Financial; keep Skyline Homes apart |
| Stone Bridge / Stonebridge | Same as Stone Bridge Mortgage? | Merge each other as "Stonebridge"; keep apart from the mortgage company |
| Synergy / Synergy 1 | Same as Synergy One? | Merge "Synergy 1" into Synergy One; keep "Synergy" apart |
| Treehouse | Same as Treehouse Mortgage Corp? | Merge |
| TSDHB; TSDHB !!; TSDHB 11; TSDHB 111; TSDHB11 | One client typed with stray characters? | Merge as "TSDHB" |
| Windermere (Team 5) / Windermere Real Estate (Team 7) | One brand? | Keep apart |

## C. False matches, left out

Different companies the scan grouped by shared generic words: CMG Financial, H5 Financial, HGG Financial, J & J Financial, JMJ Financial (with C2 Financial); DEM Financial (with Kam Financial); eMortgage, Realty Rx and Mortgage, RJC Mortgage, RPM Mortgage, VRB Mortgage; Amwest Funding Corp / Pac West Funding; Homepoint / Shore Point Real Estate; Home Realty West / West Realty; Home North County / North County; Premier Homes / Premier Properties / Premier Realty; Real Broker (a different brokerage from Real Estate eBroker); Treehouse vs The Greenhouse Group.

## Not covered

The scan finds near spellings. It does not find two names for one client that share no spelling (a team name vs a broker's name). Those get added as rows in the Client Merges tab when someone spots one.
