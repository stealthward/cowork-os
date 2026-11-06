# Cloud test log

One line per failure in a cloud session: date | what failed | error.
2026-11-06 | Registry republish skipped (Stop hook): the live Systems Registry artifact has a row (cloud-test-inbox-triage-shadow) that the repo copy lacks, so publishing the repo file would delete it | repo registry-page/systems-registry.html is older than the live artifact; the row was added on the office PC and never synced to this repo
2026-11-06 | asana-specialist subagent (Friday report) | its tools list names the desktop Asana connector ID (mcp__34af40cf-...); the cloud connector is mcp__Asana__, so the worker would start with no Asana tools. The seat read Asana directly.
2026-11-06 | Friday report: registry snapshot refresh | desktop scheduled-task run history is not readable from the cloud; activity-snapshot.json left at 2026-10-30, render.py run without it.
2026-11-06 | Friday report: alertClears read | the registry page database (ArtifactData) was not read from the cloud session; cleared alerts taken from the 10/30 report.
2026-11-06 | Friday report: folders untouched 60+ days | a fresh git clone sets every file's modified time to the clone date, so folder age cannot be judged from disk; use git log per folder instead.
2026-11-06 | git push to origin (claude/fervent-noether-yfgjpq and main) | HTTP 403: "Claude does not have GitHub access to stealthward/cowork-os for your organization" (GitHub App not installed or GitHub link needs reconnecting). Commits are local only.
