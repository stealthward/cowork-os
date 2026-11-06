# Pre-opens: section map and decisions so far (2026-10-20)

_Personal Layer. Input for the pre-open thread (team sheets plus Hub New Escrow). Read live 2026-10-20 through the Smartsheet connector by the COO._

## Brett's decisions (2026-10-20)
- A pre-open is a file an agent opens before there is an offer on the property. Example: Team 9 row 403, 15581-VJ (7885 Via Montebello; blank Type, File Status, Open Date, fees).
- NEW OPENS becomes PRE-OPENS: one section directly above CANCELED, identical on all five active sheets.
- Pre-opens that never open need an aging rule (age not yet set). Five stale JD pre-opens (Refinance, $650 each, opened 2025-08 to 2025-12) were deleted 2026-10-20 under that intent.
- The Hub New Escrow form has to handle pre-opens (separate thread).

## Update, later 2026-10-20: section built
PRE-OPENS now sits directly above CANCELED on all five sheets, with every file under PRE-OPENS and CANCELED indented as a child; the template carries both rows. Section rowIds: JD PRE-OPENS 7863565875675012, CANCELED 4669463928999812; Team 3 PRE-OPENS 6146824794859396, CANCELED 6001273299330948; Team 5 PRE-OPENS 1027570006026116, CANCELED 6975073708730244; Team 7 PRE-OPENS 1237290207995780, CANCELED 6604871529981828; Team 9 PRE-OPENS 4878919281934212, CANCELED 251029925455748. What is left for the pre-open thread: Hub New Escrow pre-open option routed as the last child of PRE-OPENS (same pattern as CANCELED), Escrow Lookup moving a pre-open into its month once it opens, and the aging rule.

## State before the build (read 2026-10-20)

| Sheet | NEW OPENS | CANCELED | Note |
|---|---|---|---|
| FSE Unit JD (6403198558359428) | none | row 309 | Needs a PRE-OPENS row added above CANCELED |
| FSE Team 3 (339384860993412) | row 3788 | row 3791 | Rename the label to PRE-OPENS |
| FSE Team 5 (8144815540987780) | row 488 | row 490 | Rename the label to PRE-OPENS |
| FSE Team 7 (307047045588868) | row 5337 | row 5341 | Rename the label to PRE-OPENS |
| FSE Team 9 (2609780876437380) | rows 277 and 303, inside the 2015 and 2021 history | row 404 | Needs a PRE-OPENS row above CANCELED; the two legacy rows need a decision (relabel or remove) |
| New Year Unit Template (5134551832913796) | none | none | Elizabeth's rollover; add PRE-OPENS and CANCELED for uniformity |

Rows between NEW OPENS and CANCELED (Team 3: 3789 to 3790; Team 5: 489; Team 7: 5338 to 5340) were not read file by file.

## Dependents to check before the change
- Hub Intake.gs places by month section and moves cancels under CANCELED; the Dashboards mirror has no reference to NEW OPENS (grep 2026-10-20).
- The status workflow on every sheet fires on rows added with File Status Purchase Contract, Closed, or Canceled; a pre-open row should carry none of those until it opens.
- Revenue dashboards count opens by Open Date; decide whether a pre-open carries an Open Date.
