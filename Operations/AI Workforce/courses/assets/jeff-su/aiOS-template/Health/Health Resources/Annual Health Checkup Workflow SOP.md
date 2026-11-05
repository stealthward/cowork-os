# Annual Health Checkup Workflow SOP

_Health SOP for your annual health checkup, from pre-visit preparation through full report processing. Read before or after an annual checkup, or when the full report is available. Does not contain supplement details, your annual report, or the general health screening reference data (see `Health Screening Reference.md`)._

_See also: `Health/Health Resources/Health Screening Reference.md`._

---

## Purpose

End-to-end workflow for your annual health checkup. Covers pre-visit preparation, during-visit capture, and post-visit processing so nothing falls through the cracks.

---

## Trigger

You say "my next checkup is on [date]" or "health checkup coming up," or it is 2-3 weeks before your expected checkup window.

---

## Scope

**Includes:**
- Pre-visit preparation, visit capture checklist, same-day processing, full report processing, and trend-report save path.

**Does not include:**
- Your current medications and supplement stack.
- Your annual report values and trend narrative.
- Standalone screening reference data, which lives in `Health Screening Reference.md`.

---

## Inputs

- Health MEMORY.md active context.
- Your annual health checkup record or note thread.
- Your previous and current annual health report files.
- Any visit audio, notes, or transcripts you provide.

---

## Preconditions

- Use web verification for current medical screening guidelines before giving screening recommendations.
- Cross-reference checkup findings against your active conditions and specialist reports.
- Do not treat self-stated medical details as verified when report data is available.

---

## Steps

### Phase 1: Pre-Visit Preparation (2-3 weeks before)

1. **Load context.** Read Health MEMORY.md, your annual checkup record (any open follow-up items), and last year's full report.
2. **Review prior open items.** Check for any unresolved items from last year's visit that should inform this year's tests.
3. **Build a recommended test list.** Cross-reference:
   - Your multi-year trend data (cholesterol, blood pressure, etc.).
   - Your current active health conditions (from Health MEMORY.md).
   - Evidence-based screening guidelines for your age, **run a web search** for current published recommendations (e.g., USPSTF, ACS, and condition-specific bodies) for your age bracket. Do not rely on training data for medical guidelines; always verify against current published recommendations.
   - Any new symptoms or concerns you raise.
4. **Separate "keep" from "skip" from "add."** Produce a three-column recommendation:
   - **Keep:** Tests with clinical utility for your specific risk profile.
   - **Skip:** Tests commonly upsold at health centers without an evidence basis for your age and profile.
   - **Add:** Tests not in the standard package but warranted by your history.
5. **Customize the package.** If your provider allows it, contact the coordinator to add the tests you want and drop the ones you don't, with the estimated cost difference.
6. **Prepare for the visit:**
   - Bring any relevant prior specialist reports.
   - Bring questions for specific stations (prepared from open items and trend analysis).
   - Record audio during all consultations.
   - Fast from the night before if a blood draw is included.

### Phase 2: During Visit

You handle this yourself. The SOP here is just the capture checklist:

1. Record audio at every station.
2. Ask the coordinator about any clinically relevant tests that weren't pre-arranged.
3. Note any verbal recommendations that won't appear in the written report.
4. Collect contact details for next year.
5. Ask when the full report will be available.

### Phase 3: Post-Visit Processing (same day or next session)

1. **Analyze notes.** Read your audio transcription or notes. Deconstruct each station's findings, recommendations, and action items.
2. **Cross-reference with known conditions.** Compare today's findings against Health MEMORY.md entries (active conditions, dietary restrictions, pending specialist transitions). Flag any contradictions or updates.
3. **Reconcile specialist data.** If the checkup covered areas with existing specialist reports, compare what the general checkup doctor said against the specialist findings. Flag discrepancies.
4. **Write the record entry.** Add a dated entry to your annual checkup record using the Doctor Visit Processing workflow in Health CLAUDE.md (next actions, immediate tasks, and station-by-station findings).
5. **Update open items.** Add new follow-up items; check off resolved items from the prior year.
6. **Update Health MEMORY.md.** Add any new conditions, changed diagnoses, or updated management plans. Remove stale entries.

### Phase 4: Full Report Processing (when the report is available)

1. **Save the report** to your health records location.
2. **Extract, compare, and cross-reference.** Read the full report. Extract all lab values and compare against your multi-year trend table. Cross-reference every finding against active conditions and treatments in Health MEMORY.md. Flag:
   - Any new abnormal findings not present in prior years.
   - Any previously abnormal values that normalized (wins).
   - Any values trending in a concerning direction even if still within range.
   - Any imaging or lab finding that connects to an active condition.
   - Any previously abnormal value that was not retested this year (testing gap).
3. **Update trend analysis.** Produce an updated year-over-year comparison covering all available years, and save it as your persistent annual report.
4. **Update the record.** Add the full report findings to your annual checkup record.
5. **Revise next-year test recommendations** based on the actual report data.

---

## Verification

- The checkup record is updated with findings, tasks, and log.
- Health MEMORY.md reflects changed diagnoses, active conditions, and management plans.
- A persistent annual report is saved when full report processing is complete.
- Next-year testing recommendations are revised from actual report data.

---

## Outputs

- Annual checkup record entry.
- Updated Health MEMORY.md.
- A persistent annual health report when the full report is processed.
- Next-year recommended test list.

---

## Exceptions

- If the full report is not available, process visit notes but do not finalize report trends.
- If a guideline claim is needed, verify with current web sources before advising.
- If report findings conflict with specialist data, flag the discrepancy rather than reconciling silently.

---

## Related Files

- `Health/CLAUDE.md`
- `Health/Health Resources/Health Screening Reference.md`

---

## Changelog

- _Add your dated notes here as you adapt this SOP._

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
