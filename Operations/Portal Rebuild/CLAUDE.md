# Portal Rebuild

## Project Identity

Replace The Hub (Google Sites, site ID `1e0-0GYClYn3m6CdClBVlmuJDLrvglq6b`, published at sites.google.com/brettward.net/fivestarportal) with a more functional portal built on the existing Unit Dashboards Apps Script deployment. End state: one config-driven web app serving the landing page, embedded dashboards, and a single shared fee calculator, with team additions requiring only a one-line config change. Belongs to the Operations workstation. The old Sites portal stays live until cutover.

## Workflow

1. Read MEMORY.md in this folder for current phase and decisions.
2. Reference `portal-inventory.md` for the complete map of what the current portal contains.
3. Build in phases (see Project Status in MEMORY.md). Phase boundaries are Brett-approval gates.
4. Log meaningful build changes in the Dashboards project CHANGELOG (`Operations/Dashboards/CHANGELOG.md`) since the portal shares that codebase.
5. On cutover, update `Operations/Dashboards/docs/sop-new-team-setup.md` (Step 4 collapses into the config edit) and archive this project.

## Project Rules

- Everything stays auth-gated to the brettward.net Workspace domain. No public pages.
- The fee calculator uses one shared rate table (verified identical across all teams, 2026-08-28). No per-team copies.
- Portal structure is config-driven: the TEAMS list generates nav, dashboard views, and team links. Never hardcode a team into a page.
- No embed URL, form destination, or external link gets migrated without being verified against the live Sites page or its editor first.
