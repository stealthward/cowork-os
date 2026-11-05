# Lesson 8.01: Business Ops Prompts

Use these prompts to follow along while you build your own Business Ops workstation. Your results may look different because your workspace, meetings, and connected accounts are different from mine. Focus on the purpose of each step, answer any clarifying questions based on your own setup, and use plain English if Cowork makes a choice you want to change.

## Before You Start

1. Open a fresh Cowork session with the root folder of your AI Command Center mounted.
2. Replace `<YOUR_MEETING_TRANSCRIPTS_FOLDER_URL>` in Prompt 2 with the Google Drive folder where your own meeting transcripts are saved.
3. Keep Cowork's approval and permission checks visible. They are part of the workflow.
4. These prompts preserve the wording used in the lesson, including the occasional typo. The only privacy change is that my private Google Drive folder URL has been replaced with a placeholder.

---

## 1. Create the Business Ops Workstation

This creates the new workstation and asks Cowork to load the workspace rules it needs before changing your system.

```text
Let’s create a Business Ops workstation. Help me give it a clear and precise role and scope. Basically I want this workstation to help me with operational tasks like processing meeting notes and operational follow-through across my workspace.

Before producing output: load root CLAUDE.md and MEMORY.md, identify relevant workstations via routing map, load their CLAUDE.md, MEMORY.md, and any cross-referenced files for this output type. State what you loaded and which rules govern the output before proceeding.
```

If Cowork asks clarifying questions, answer them based on what you want Business Ops to own.

---

## 2. Process the Latest Meeting

This records your transcript folder as a reusable source, fetches the latest transcript, and turns it into useful follow-through.

```text
Great. By the way, all of my meeting transcripts are automatically saved in this Google Drive folder (<YOUR_MEETING_TRANSCRIPTS_FOLDER_URL>), so make a note of that somewhere. Then I want you to fetch the latest meeting transcript and process it by giving me a concise recap, what I need to do next, what AI can help me with, and a complete recap email draft. Give me all that in chat for me to review.
```

---

## 3. Turn the Workflow Into a Skill

This asks Cowork to turn the meeting workflow you just tested into a reusable skill.

```text
Ok this is awesome. This  process is exactly the kind of thing I want to reuse, so let’s turn what we just did into a skill called process-latest-meeting, where you will pull the last meeting transcript from my transcript folder and process it like you did just now. Follow Skill creation conventions.
```

---

## 4. Run the First Session Audit

This checks the new workstation and workflow for missing steps, cleanup, and useful improvements.

```text
Ok let's run the session audit skill now
```

---

## 5. Approve the First Audit Findings

Use this only if your audit presents the same two choices shown in the lesson. Otherwise, review your own findings and approve only the changes you want.

```text
1. Approved
2. Go ahead and delete
```

---

## 6. Create the Weekly Meeting-Preparation Task

This creates a report-only scheduled task that prepares you for the coming week's meetings.

```text
Let’s set up a scheduled task for every Monday at 6AM. It should review every meeting in the coming week (Monday to Sunday) and prepare me using the calendar invite, prior meeting transcripts, and context related to the work. The report should be informative and actionable (i.e. use action-first headlines). The output should be readable and follow our standard findings format.
```

Answer Cowork's clarifying questions based on your calendar, preferred level of detail, and where you want the report delivered.

After the task is created, click **Run now** once so Cowork can request any Calendar or Drive permissions before the first unattended run.

---

## 7. Run the Second Session Audit

This checks the scheduled task and any workspace changes it exposed.

```text
/session-audit
```

---

## 8. Approve the Second Audit Findings

Use this only after reviewing the findings Cowork presents in your workspace.

```text
Go ahead, everything is approved
```

---

## 9. Create the Meeting Lifecycle SOP

This documents the complete before-and-after meeting process so another person can follow it.

```text
So we recently just created a skill that processes notes after a meeting and a scheduled task that prepares us for upcoming meetings. I want you to create an SOP that captures that entire meeting lifecycle and save it inside the Business Ops workstation. Put simply, if I were to hand the SOP off to a new hire on the team with no context, they should know what to do before and after the meeting.
```

---

## 10. Correct an Overly Cowork-Specific SOP

Use this if the first SOP describes Cowork instead of giving a new team member a clear process they can follow.

```text
The SOP is way too Cowork-specific. A new team member who doesn't use Cowork will be so confused. The SOP should be broad enough so the new team member knows exactly how to prep for meetings beforehand and how to process meetings after, and we can add inline comments around what to do in Cowork if they use Cowork.

Try again.
```

---

## 11. Run the Third Session Audit

This checks the completed meeting lifecycle and looks for improvements worth carrying into future work.

```text
/session-audit
```

---

## 12. Approve the Third Audit Findings

Use this only after reviewing the findings Cowork presents in your workspace.

```text
All approved + proceed
```

## What to Look For

By the end, you should have five different surfaces doing five different jobs:

- Business Ops instructions define what the workstation owns.
- Business Ops memory holds changing operational context.
- The SOP explains the process a person should follow.
- The skill performs the repeatable post-meeting workflow.
- The scheduled task brings meeting preparation to you at the right time.

Your exact files, audit findings, and clarifying questions may differ from the lesson. That is expected.

---

_Prepared by Jeff Su for Cowork Academy Lesson 8.01._
