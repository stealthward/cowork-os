# Specialist Visit Processing SOP

_Health SOP for processing findings from specialist visits into your Health notes and memory. Read when you share notes, audio, or a transcript from a specialist appointment. Does not contain annual checkup processing or screening-reference data._

_See also: `Health/Health Resources/Annual Health Checkup Workflow SOP.md` | `Health/Health Resources/Health Screening Reference.md`._

---

## Purpose

Process findings from any specialist visit (respiratory, ENT, dermatology, etc.) into your Health record and MEMORY.md.

---

## Trigger

You share notes, audio, or a transcript from a specialist appointment.

---

## Scope

**Includes:**
- Specialist visit notes, audio, transcript, and finding processing.
- Cross-reference against your annual checkup and Health MEMORY.md.

**Does not include:**
- The annual checkup workflow.
- Supplement register updates, unless a specialist explicitly changes supplement or medication guidance.
- General screening guidance.

---

## Inputs

- Specialist visit notes, audio, transcript, or report.
- Health MEMORY.md.
- Your most recent annual health report and relevant specialist history.

---

## Preconditions

- Load the Doctor Visit Processing workflow in Health CLAUDE.md.
- Confirm which visit or specialist the notes belong to before updating memory.

---

## Steps

1. Follow the Doctor Visit Processing workflow in Health CLAUDE.md (analyze, summarize, route to the correct record, write entry, reconcile).
2. Cross-reference specialist findings against your most recent annual checkup report and Health MEMORY.md.
3. Update Health MEMORY.md with any new diagnoses, changed treatment plans, or resolved conditions.

---

## Verification

- The correct record receives the visit entry.
- Health MEMORY.md captures new diagnoses, changed treatment plans, or resolved conditions.
- Specialist findings are checked against your current annual report and active context.

---

## Outputs

- A visit entry in the correct record.
- Updated Health MEMORY.md entries where needed.
- Flagged discrepancies or follow-up actions.

---

## Exceptions

- If the visit data is incomplete, label what was missing and do not infer clinical conclusions.
- If specialist guidance contradicts prior checkup findings, flag the conflict and preserve both sources.

---

## Related Files

- `Health/CLAUDE.md` > Doctor Visit Processing
- `Health/Health Resources/Annual Health Checkup Workflow SOP.md`
- `Health/Health Resources/Health Screening Reference.md`

---

## Changelog

- _Add your dated notes here as you adapt this SOP._

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
