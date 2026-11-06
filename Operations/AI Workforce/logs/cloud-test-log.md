# Cloud test log

One line per failure in a cloud session: date | what failed | error.
2026-11-06 | Registry republish skipped (Stop hook): the live Systems Registry artifact has a row (cloud-test-inbox-triage-shadow) that the repo copy lacks, so publishing the repo file would delete it | repo registry-page/systems-registry.html is older than the live artifact; the row was added on the office PC and never synced to this repo
