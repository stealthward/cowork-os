# Cowork or Code

_Shared Core (team kit copy, scrubbed 2026-10-30)._

Two tabs in the same desktop app, same account, same connectors, same `~/.claude` config. The difference is what each one reads and how it is driven. This sheet decides where a task belongs. Live version with the same content: the "Cowork or Code" artifact in claude.ai/code/artifacts.

## The one question

Does the result need to exist as a file in a folder so it runs the same way next time (an agent file, a skill, a hook, a schedule that reads them)?

- Yes: Code.
- No: Cowork.
- Unsure: Code. It can do everything Cowork does; Cowork cannot read your agent files.

## Decision tree

Ask in order. Stop at the first answer that lands on a surface.

| # | Question | Yes | No |
|---|---|---|---|
| 1 | Am I building or changing an agent, a skill in `.claude/skills`, a hook, settings, or an eval a judge agent will read? | Code | Continue |
| 2 | Am I writing or modifying code (a script, an Apps Script project, an API sync, a repo)? | Code | Continue |
| 3 | Does the job need more than one agent (a judge, specialists per lane, a chief of staff routing across workstations)? | Code | Continue |
| 4 | Is the work mostly connectors and documents (Drive, Asana, Zoho, Gmail, Calendar, Smartsheet, Canva, a .docx or .xlsx out)? | Cowork, with the workstation folder attached | Continue |
| 5 | Does it run unattended on a schedule? | Connector or document work: Cowork scheduled task. Runs code or agent files: Code Routine on the folder | Continue |
| 6 | Still here? One agent, you in the loop. | Cowork. Both can be open on the same folder at once; they do not conflict. | |

## What each surface reads and runs

| Capability | Cowork | Code |
|---|---|---|
| Connectors (Drive, Asana, Zoho, Gmail) | Yes, first-class | Yes, via MCP |
| `CLAUDE.md` in the attached folder | Yes | Yes, always |
| `MEMORY.md` / workstation memory | Yes | Yes |
| Plugins and account skills | Yes | Yes |
| Skills stored in the folder (`.claude/skills/`) | No | Yes |
| Custom subagents (`.claude/agents/`) | Not confirmed; assume no | Yes, model and tools per agent |
| Nested delegation, agent teams, workflows | No | Yes |
| Permission modes, hooks, `settings.json` | No | Yes |
| Scheduled runs | Scheduled tasks on a session | Routines, `/loop`, cron |
| Document output (.docx, .xlsx, .pptx, PDF) | Yes, best here | Yes |
| Git, worktrees, test loops | No | Yes |
| Cloud or local | Either; local folder via the desktop link | Local folder; cloud sessions available |

## Your tasks, placed

| Task | Surface | Why |
|---|---|---|
| Weekly Operations review session | Cowork | Drive + Asana every run, you in the loop, one agent, .docx out |
| Zoho email template rebuild | Cowork | Skill exists; Zoho connector does the work |
| Asana task cleanup | Cowork | Skill exists; connector only |
| REInvest guest sourcing, investor database research | Cowork | Web research + Sheets/Drive output |
| Reel cut sheet from a Factory recording | Code | factory-cut-sheet skill: Plaud connector in, WhisperX timing on the GPU, verify and judge scripts, .docx out. Team fallback is the claude.ai show project |
| Escrow team training curriculum, .oft template standardization | Cowork | Document work, human review |
| Building a new Cowork plugin | Cowork | The plugin-builder skill runs here and delivers the .plugin file |
| Five Star open-fees dashboard, Personal Daily Brief (Apps Script) | Code | It is code. Edit, test, deploy from the project folder |
| CRMLS to Zoho data integrity sync | Code | Scripted, repeatable, scheduled. Stable as of 2026-09-23; not an active priority |
| Writing a subagent or a judge that scores against an eval | Code | `.claude/agents/` file; only Code invokes it |
| A chief-of-staff front door across workstations | Code | Routing rules in `CLAUDE.md`, lanes as subagent files |
| Scheduled exceptions report that runs code | Code | Routine on the folder so it picks up agents and scripts |
| Scheduled connector report (weekly Asana digest) | Cowork | Scheduled task on the workstation; no code involved |
| Creating a skill | Either | Draft in Cowork with skill-creator; store in `.claude/skills/` from Code if agents must call it |
| Writing or editing `CLAUDE.md` for a workstation | Either | Plain markdown; both surfaces read it |

## Signals a lane has outgrown Cowork

Any one of these justifies a Code version of that workstation. Until one appears, stay in Cowork.

- You want a judge: a second agent grades the output against a written eval before you read it. That is a subagent file.
- You want specialists: one lane split into sub-lanes on cheaper models (a Zoho specialist, a Smartsheet specialist).
- You want an unattended run that uses code or agents: a Routine that reads the folder's agent files and scripts, exceptions to your inbox.
- You want one front door: a chief of staff that routes across Operations, FSE ops and RTM. The workstation becomes a director file under it.

## Folder anatomy

A Cowork workstation (one agent; persona in `CLAUDE.md`; tools are the connectors; attach in Cowork):

```
Operations/
├── CLAUDE.md                 identity, lane, protocol
├── MEMORY.md                 systems, links, decisions
├── Operations Resources/
│   ├── Prompts.md
│   ├── Operations Eval.md
│   └── Operating Guide.docx
└── Operations Sessions/
    └── yyyy-mm-dd-name.docx
```

A Code workforce folder (many agents; each file sets its own model and tools; attach in the Code tab):

```
workforce/
├── CLAUDE.md                 chief of staff: routing rules
├── .claude/
│   ├── agents/
│   │   ├── escrow-pipeline.md    model: sonnet
│   │   ├── content-drafter.md
│   │   └── judge.md              reads evals/
│   ├── skills/
│   └── settings.json         permissions, hooks
├── evals/
└── logs/
```

## Unverified

Whether a Cowork session with a folder attached will find and use `.claude/agents/` files. Test in thirty seconds: one agent file, attach the folder in Cowork, ask "use the escrow-pipeline subagent." Until that passes, treat the answer as no.

---

Written 2026-09-08. Standing reference, stable name. Update when a task moves surfaces or a capability above changes.
