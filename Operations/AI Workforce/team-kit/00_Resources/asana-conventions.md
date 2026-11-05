# Asana conventions

_Shared Core (team kit copy, scrubbed 2026-10-30). How Asana is used at Real Talk Media and Five Star, written so an agent can read the workspace and act in it without breaking the system. Brett's half captured by interview 2026-09-25; Elizabeth's half: answered 2026-10-12. This file is the source of truth for conventions: when Asana and this file disagree, ask, then update this file. Read before creating, updating, reading, or auditing anything in Asana._

## Scope as of 2026-09-25

Brett's Asana only. Team conventions come after the first Asana audit round and matter once Team Edition is in place. What is known about the team, for later: Elizabeth's World is project-based like Brett's, but as Director of Operations she reacts to issues that outrank what she planned; her team (Alyza, Krasny, Michelle, Princess) and Mark's editors (Patrick, Gerald, Dani) work in a repetitive environment where priorities look different.

## Brett's World (project 1194233924213542)

**Purpose.** The macro view. Brett prioritizes projects first and foremost, then pulls tasks from active projects into My Tasks when he is ready to work them. Anything that pops up lands in Active Tasks without displacing the bigger projects.

**Sections, top to bottom**

| Section | What it holds | Rule |
|---|---|---|
| Process | Capture inbox: anything new | Sorted daily (the Daily Recurring item "Clear Process section") into a section or My Tasks |
| Active Tasks | Standalone tasks Brett is actively working | The only items in Brett's World assigned to Brett; assignment is what puts them in My Tasks |
| Active Projects | Projects Brett is working, ordered by Rank | Only actual projects: a row whose Link field points to its own Asana project. A standalone task, even one with subtasks, goes in Active Tasks (Brett, 2026-09-28). Each row's Link points to the Asana project |
| Queue | Next up when an active slot opens | |
| Hold | In the pipeline, lower priority than Active and Queue, not ready to start | Active, Queue, Hold, top to bottom, is the project pipeline. Definitely on the roadmap; inactivity never moves an item to Someday Maybe (Brett, 2026-10-01) |
| Recurring | Recurring work that takes more than an hour or two, because that time gets blocked | Short recurring items (five to ten minutes) live only in My Tasks, never here |
| Someday Maybe | Ideas Brett does not want to forget that may or may not ever be done | Glanced at weekly: move up or delete |

Everything outside Active Tasks is a project, whether or not an Asana project exists for it yet.

Active means Brett is actively doing the project's tasks now. Queue is next up and waits on sequence. (Brett, 2026-09-28)

**The priority signal.** Section first, then Rank. An agent reading Brett's priorities looks at Active Projects ordered by Rank 1 to 6+, and at Active Tasks for what is in play today. Brett's World is roughly current; agents confirm the top three with Brett before acting on it.

**Fields**

| Field | Status | How it is used |
|---|---|---|
| Rank (1 to 6+) | Live | A person's priority. Orders Active Projects in Brett's World and the rows in every World, and Brett's day in My Tasks (1 first). Never used to order tasks inside a project (Brett, 2026-10-02) |
| Project Priority (1 to 6+) | Live | Orders tasks within each section of a project; the list view sorts by it ascending. Same options and colors as Rank. A day plan never writes it. Not added to episode projects or Finance Dept (Brett, 2026-10-02) |
| Lead (people) | Live | Who is responsible for a project task before it is assigned; sits to the left of Assignee in the list view. Every master task has a Lead. Default: the one assignee all its subtasks share; if they have more than one assignee or none, the project owner (Brett, 2026-09-30) |
| Status (Active, Queue, Hold, Recurring, Someday Maybe) | Live | Mirrors the section |
| Stage | Legacy | Do not set, do not read. Obsolete on the editor side (Elizabeth with Mark, 2026-10-12); no rule or view reads it |
| Estimated time (duration, minutes) | Live | On every task and subtask in every project, so Brett's day can be time-blocked from My Tasks. It is the person's hands-on time, not the agent's run time. Claude calculates it; when the work is unclear, Claude asks Brett. A master task with subtasks stays blank (the subtasks carry the time); Brett's World project rows (Active Projects, Queue, Hold, Someday Maybe) carry no Estimated time, because the project's own tasks carry it (Brett, 2026-10-01); a run whose work is not named yet gets a placeholder: the median Estimated time of its named siblings, or 30 min if none is named; Claude re-estimates it when it is named, before it is scheduled. Every estimate, placeholders included, is listed in the build plan Brett approves before the tasks are created in Asana (Brett, 2026-10-08) |
| Link | Live | A task that links to one asset (an Asana project or task, a Google Doc or Sheet, any URL) carries it in the Link field; two or more go in the description (Brett, 2026-09-28). On a Brett's World project row it is the Asana project |
| Priority (the older enum: Urgent, Recurring, Someday Maybe, Process, High, Medium, Low) | Legacy | Do not set, do not read |

## My Tasks (Brett's)

| Section | What it holds | Rule |
|---|---|---|
| Process | Tasks other people assign to Brett | When Claude assigns Brett a task, it sets the My Tasks section in the same call by due date (Today; Upcoming within 7 days; Later beyond), because Brett already agreed to the date; nothing Claude assigns is left in Process. A task another user assigns to Brett stays in Process and Brett sorts it himself (Brett, 2026-10-01). Asana never pulls from Process |
| Today | Due today | |
| Upcoming | Due within the next 7 days | Asana moves it up to Today |
| Later | Due more than 7 days out | Asana moves it up to Upcoming |
| Daily | Daily recurring items with no date | |

Incomplete tasks roll forward through Asana's own My Tasks behavior; agents do not act on it. (Brett, 2026-09-30)

## Portfolios

_Structure read from the workspace 2026-09-28; the portfolio cleanup will confirm or change it._

- Every project belongs in a portfolio. When a project is created, Claude recommends where it goes. (Brett, 2026-09-28)
- BW Personal holds Brett's personal work only: his own writing, learning, and personal lists (REACH, Brett's World, Parking Lot, BW Wishlist). A project that will involve the team, or that Elizabeth as Director of Operations should see because she runs similar work, goes in one status portfolio and one area portfolio even before any team task exists (AI Workforce: Active Projects and Operations). (Brett, 2026-09-28)
- A shared project sits in one status portfolio (Active Projects, Project Queue, Recurring) and one area portfolio (Operations, Production, Real Talk Worlds, Meetings, Social Calendars). Human Resources and Sales & Marketing were deleted 2026-10-02 and are recreated only when needed. (Brett, 2026-10-02)
- Production holds only active shoots and shows (episode projects, retainer shoots). A show or podcast still being built stays in Project Queue. (Brett, 2026-10-02)
- An archived project moves to the Archived portfolio nested in its area portfolio.
- A Someday Maybe project stays open (not archived) and sits only in the Someday Maybe portfolio (owned by Elizabeth), not in Project Queue or an area portfolio. (Brett, 2026-10-02)
- Every new project gets the Lead, Project Priority, Estimated time, and Link fields (not Rank, which belongs to Worlds and My Tasks), with Lead left of Assignee and Estimated time in the list view.

## Dates

- A due date on a task is the date it should be completed. Work that takes more than a day gets a start date plus a due date.
- Recurring tasks auto-advance their due date while incomplete; a recurring task showing due today or tomorrow is an instance awaiting completion, not a scheduling error.
- An agent never invents a date. A date comes from Brett, a deadline in a source document, or a convention in this file. No date is better than a made-up one.

## Tasks and subtasks

- Every master task is one of two kinds. The test: do its subtasks happen on different days? (Brett, 2026-10-01)
- **Spread master** (subtasks on different days: proof-of-concept runs, campaign pieces, chapters). Each subtask gets an assignee and a due date together, only through one of three triggers: it goes on a day in Brett's day plan; Brett approves a dated campaign plan counted back from a sourced milestone (the REInvest pattern); or a project's status automation creates and assigns it (the Discover La Jolla v2 pattern). The master is assigned to its Lead and dated with its last subtask's date or the sourced target. When every subtask is complete, the chief of staff's daily pass sets the master's due date to the completion day and completes it.
- **Session master** (all subtasks done in one sitting: an audit list, social review, a seeded eval set). The master is assigned to its Lead and dated. Its subtasks are never assigned or dated; they show under the master in My Tasks. The person completes the master at the end of the session.
- Both kinds: the master's Estimated time stays blank, because Asana totals its subtasks' time, assigned or not (Brett, verified 2026-10-01). A master is never assigned without a date.
- A task in a project is never assigned until it has a due date, because assigned tasks flood My Tasks. Until then the Lead field names who is responsible. (Brett, 2026-09-28) When a date is set on a task, by anyone or any trigger, the task is assigned to its Lead in the same step; if it is Brett's task, Claude sets its My Tasks section in the same call (see My Tasks, Process). (Brett, 2026-09-30; same call 2026-10-01)
- No task assigned to Brett waits on someone else's reply. A step that hands work to another person ends when Brett's side is sent; their follow-up lives in the email thread or in a task assigned to them. (Brett, 2026-11-04)
- Work that runs more than once (eval runs, content pieces, briefs, one file per platform) gets a master task with one numbered subtask per instance, named "N of total: what it is", in run order. A master already marked complete with instances left is reopened and the subtasks built under it. (Brett, 2026-09-28)
- Task descriptions are clear, concise, and written as the exact actions the person takes: Prerequisite and Done when first, then numbered steps. Each main step is a short bold title with lettered sub-steps beneath it; field names and field values in Asana or any other platform are in code formatting; a tool named in a step links to it; click paths use →. (Elizabeth, 2026-10-01) Every asset that exists is linked (Drive links for OS files). Any prompt that starts or ends a Claude thread sits in its own code block for copy-paste. Lists use native Asana bullets or numbering. No rationale, no narrative asides, never "notify Brett". Reasoning lives in the OS memory files. (Brett, 2026-09-28)
- Completed means the work was done. A task that is no longer needed (superseded, made irrelevant by other work, or dropped) is deleted, not completed, so Asana's history shows only real work. Its subtasks go with it. If the reason matters later, it goes in the OS memory files, not on the task. (Brett, 2026-10-19)
- A prerequisite is stated in a Prerequisites section of the description, and the due date sits after the prerequisite's due date. Asana dependencies are not used on recurring tasks because recurrence recreates them without dependencies.
- Subtasks that cannot recur are handled by templates; templates are not readable or editable by API, so a change to a live task description is copied into the template by hand in the Asana UI.

## Projects

- Every new project gets the Estimated time field, shown in the list view. (Brett, 2026-09-28)
- Brett and Elizabeth create projects. The team creates projects from templates (episode projects, team meeting projects).
- Every new project outside the BW Personal portfolio gets Elizabeth as project admin at creation. The connector adds members as Editor, so admin is set in the Share dialog. (Brett, 2026-09-30)
- Brett's World is the priority order for Brett's work. The AI Workforce project is the build tracker for the agent workforce; courses sit in Brett's World Queue as team resources. A Personal Layer project keeps its own protocol in its own folder.
- Never archive a project that has open tasks. Every open task is completed, closed, or moved first; a project with open tasks that looks stale gets audited, not archived. (Brett, 2026-10-01)
- Episode projects: Michelle creates each from its show template (for example "Discover East County MM/DD/YY"); its "Audit Project & Archive" task, assigned to Elizabeth and due 4 to 7 weeks after the air date, closes it out (read from the workspace, 2026-10-12). Meeting projects: not yet read.
- Operations Projects & Tasks: Task Queue holds single tasks; Project Pipeline holds larger initiatives that may become their own project (COO reading, 2026-10-12).
- Ask the Workforce: the loop project where a team member asks the workforce for help. Its tasks are requests, not scheduled work: they stay unassigned and undated and carry no Lead, Project Priority, or Estimated time, and the convention checks skip them. The loop run moves them between sections; the asker closes them (2026-10-30).
- World projects: the standard layout is Process, Active, Queue, Hold, Recurring (Someday Maybe on some). Cassie's and Michelle's still use Urgent / Not Urgent - Important, filed by legacy Priority rules; both are approved to move to the standard layout (Elizabeth, 2026-10-12). Read them by their current sections until converted. Devan's and Bonnie's Worlds archived (Brett, 2026-10-12).

## Daily planning (My Tasks)

- Brett's day is built in My Tasks. Work is pulled from Active Projects in Brett's World in Rank order, then by Project Priority within each project's section, plus Active Tasks.
- Build the day in this order: (1) read My Tasks for what Brett already has on today and what he has finished; if he has ranked today's tasks, that Rank is his decided order and the plan fills the remaining time after them and ranks the additions; if they carry no Rank, recommend what to work on and the order, and Brett decides; (2) read Brett's World Active Projects by Rank (the rows in its Active Projects section, the projects Brett is personally working on); (3) within each active project, read its tasks and subtasks by section, Rank, and due date; a spread master's subtask due today is assigned to Brett for today; a session master is placed on the day as one task; (4) if time is left before his stop time or about 360 min, recommend tasks to fill it (see "Filling open time" below). (Brett, 2026-09-29; step 4 revised 2026-10-02)
- Tasks already dated for today load into My Tasks Today as they are. When time is left, the chief of staff recommends additions in priority order, each with a reason. Only the tasks Brett approves are assigned and dated. (Brett, 2026-10-02)
- Putting a task on a day means assigning it to Brett and setting that day as its due date. The day is set when the task moves, never earlier.
- Target load is about 6 hours (360 min) of Estimated time per day, calendar events included. My Tasks shows the total per day. The unscheduled time covers estimates that run over and work that comes up unplanned.
- Every calendar event gets a task in My Tasks only (assigned to Brett, due that day, no project). Its Estimated time is the event's length plus travel both ways when travel is needed; the description states origin, destination, and travel minutes. Claude calculates travel from the Five Star office and back unless Brett or the calendar names another origin; addresses and known travel times are in brett-profile.md, Locations. (Brett, 2026-09-28; default origin 2026-09-30)

- Capacity is 5 days a week, about 30 hours of planned time. (Brett, 2026-09-28)
- Weekly hours go to active projects by what their next dated milestone needs; whatever is left goes by Rank. Every active project carries dated milestones, from Brett or a source deadline. Task due dates are calculated backward from the milestone using the tasks' Estimated time and the project's weekly hours, labeled as a calculation, and set only after Brett approves them. A gate that passes on evidence (AI Workforce) still gets a target date; a missed target becomes a question, not a pass. (Brett, 2026-09-28)
- Focus blocks over switching: Brett works best in long single-project blocks. The day plan groups a project's work into blocks of several hours, or a whole day, rather than mixing projects through the day. (Brett, 2026-09-28)
- REACH chapters and other long writing go in 4-hour blocks on days with about four clear hours; a meeting or Studio inside the window rules that day out. Never spread writing as daily slices. (Brett, 2026-10-21)
- When tasks move to make room, higher priorities stay on the nearest day with room and lower priorities move to later dates; never skip a day with room without saying why. (Brett, 2026-10-21)
- Similar tasks run back to back for flow. Inside a project block they are grouped by type of work; short tasks of the same type (calls, email, reviews) are batched across projects. (Brett, 2026-09-30)
- A task that advances more than one project is marked in its description ("Also moves: ...") and is scheduled first within its block.

## Review rhythm

- Daily: clear Process, email triage, inbox zero, time block (the Daily Recurring item in My Tasks).
- Weekly: the Weekly Asana Review task, which includes the Someday Maybe glance.
- The Friday written report (the COO agent, once defined) is read before the Monday team meeting.

## Automation rules

_Read by the COO 2026-10-12 from each rule's data in the browser (the Asana API does not expose rules): 57 open projects (Personal Layer projects not read) and all 18 project templates. 34 projects and 8 templates have rules; every rule is on. A rule runs as its owner. Re-read when a template or World changes._

### What an agent's own writes set off

| Agent write | Fires in | What happens | Rule for agents |
|---|---|---|---|
| Assign a task | Episode projects (Discover, The Factory, Devore Connection) and their templates, Shoot and Agent Profile Video templates, Producers Circle and Paid Retainer projects, RTM, Podcasts, and FSE Social Calendars, List It Live / Market Movers Recurring, All Company Meeting, RTM Team Meeting | Assigned to Alyza, Patrick, Gerald, or Dani: task added to Production Task Overview. Assigned to Michelle, Mark, Patrick, Gerald, Dani, Alyza (Cassie in meeting projects and Shoot): task added to that person's World, Process section, which then fires the World's own "added" rule. Assigning Brett fires nothing anywhere | Assign team members in these projects only through the three triggers in Tasks and subtasks; the task will appear in Production Task Overview and their World |
| Set a due date | Operations Projects & Tasks (Brett), Design Projects & Tasks (Elizabeth) | A task in Process that gets a date moves to Task Queue | Expected routing; nothing to avoid |
| Move a task to a section | Task Force - Client WOW Program (Elizabeth) | Action items: due date set 3 days out. Reference: dates cleared. Milestones / Touchpoints: automated comment posted | Do not move tasks between sections there; the automation would set a date no source supplied |
| Set Status | Brett's World (Brett); Worlds of Mark, Gerald, Patrick, Alyza, Princess, Krasny, Dani (Elizabeth) | Active, Queue, Hold, Recurring move the task to the matching section. One way only: moving a section never sets Status. No Status value moves a task to Someday Maybe | Set Status and section in the same call so they agree |
| Set legacy Priority | Brett's World (Someday Maybe); Michelle's and Cassie's Worlds (every value) | Moves the task to the matching section | Still never set it. In Michelle's and Cassie's Worlds, Priority is what files tasks into sections |
| Complete a task | FSE Partner Campaign, Five Star Branding & Talent Plan, Real Stars SOP Buildout (Brett); both "TEMPLATE: New Project - Board" templates; Task Force (Elizabeth) | Moves to Completed (Task Force: re-added to the project) | Harmless |
| Add a task to a project (create or multi-home) | Every team World; Design Projects & Tasks; Podcasts and FSE Social Calendars; Producers Circle 30 Min and 2 Hr, Paid Retainer Shoots; Support Tickets | Worlds and Design: moved to Process. Social Calendars: moved to Social Posts or Ideas. Retainer projects: moved to Scheduling Prep Call, template subtasks added, Project Status set. Support Tickets: AI renames the task, sets Urgency, rewrites the description, sets Ticket Status to Ready to Start, and once Urgency is set, emails admin@fivestarescrow.com through Gmail | Never create or multi-home a task into Support Tickets or a retainer project without Brett's go in the thread; it sends email or builds subtasks |

### Fields only the team sets

An agent never writes these; each one assigns, dates, or completes tasks.

| Field | Projects | What it does |
|---|---|---|
| Editing Status | Episode projects and templates, Shoot template, retainer projects (owners Michelle, Elizabeth, Brett) | Assigns the stage owner: Curating and QC Review to Alyza, Editing Reels and Reel Revisions to Patrick, Editing Long Form and Long Form Revisions to Gerald, Manager Review to Mark (Gerald in Devore Connection). Curating also sets the due date 1 day out. Completed completes the task. The Factory adds Creating Cut Sheet (assigns Brett, sets a due date) and Review Cut Sheet (assigns Mark, sets a due date) |
| Editing Status, status-automation pattern | Templates "Discover La Jolla MM/DD/YY" and "Discover La Jolla MM/DD/YY v2" | Each stage adds template subtasks instead of assigning; Completed completes. No open project is built from these yet |
| Project Status | Producers Circle 30 Min and 2 Hr, Paid Retainer Shoots (Elizabeth) | Moves sections, adds template subtasks, sets Editing Status; Assets Delivered completes the task |
| Ticket Status | Support Tickets (Elizabeth) | Moves sections; Resolved assigns Elizabeth, completes the task, and clears Project Priority |

### Rules by project

| Project or template | Rule (owner) | Trigger | Action |
|---|---|---|---|
| Episode projects: Discover East County, Ramona, La Jolla, The Factory, Devore Connection | Add assigned tasks to Production Task Overview (Michelle) | Assigned | If Alyza, Patrick, Gerald, or Dani: add to Production Task Overview |
| Same | Add Tasks to Worlds / Add to Worlds When Task is Assigned / Create QC Subtask (Michelle) | Assigned | Add to the assignee's World, Process. Discover East County has no Alyza branch |
| Same | When Editing Status is Changed (Michelle) | Editing Status | See Fields only the team sets |
| Template Discover East County MM/DD/YY; Discover La Jolla V1 | Same three rules (Elizabeth) | As above | As above |
| Templates Discover La Jolla MM/DD/YY and v2 | Same three rules (Brett; the MM/DD/YY template's Editing Status rule is Elizabeth's) | As above | Editing Status adds template subtasks |
| Template Shoot: [Client Name]; Agent Profile Video | Production Task Overview, Worlds (Cassie included), Editing Status (Elizabeth) | Assigned; Editing Status | As above |
| Producers Circle 30 Min and 2 Hr, Paid Retainer Shoots | Production Task Overview; When Project Status is Changed; When Editing Status is Changed; New Submission (Elizabeth) | Assigned; Project Status; Editing Status; added | As above |
| Brett's World | Five section rules (Brett) | Status Active, Queue, Hold, Recurring; Priority Someday Maybe | Move to the matching section |
| Team Worlds: Mark, Gerald, Patrick, Alyza, Princess, Krasny, Dani | Added → Process; Move Sections RE: Status Field Value (Elizabeth) | Added; Status | Process; matching section |
| Michelle's and Cassie's Worlds | Four section rules each (Elizabeth) | Priority | Matching section |
| Operations Projects & Tasks | When Task is moved to a section (Brett) | Due date set | If in Process: move to Task Queue |
| Design Projects & Tasks | Two rules (Elizabeth) | Added; due date set | Process; Process to Task Queue |
| Support Tickets | Eight rules, one off ("Task received") (Elizabeth) | Added; Ticket Status | See tables above |
| RTM, Podcasts, FSE Social Calendars; List It Live / Market Movers Recurring | Add Tasks to Worlds; added → section (Elizabeth) | Assigned; added | World Process; Social Posts or Ideas |
| All Company Meeting (Elizabeth); RTM Team Meeting (Cassie) | When Task is assigned | Assigned | Cassie (and Mark): their World, Process |
| Task Force - Client WOW Program | Six rules (Elizabeth) | Section, completion, combined | Dates, comments, completion |
| FSE Partner Campaign, Five Star Branding & Talent Plan, Real Stars SOP Buildout; both New Project - Board templates | One rule each (Brett) | Completed | Move to Completed |

No rules: AI Workforce, Production Task Overview, EE's World, Felicia's World, REInvest, REACH, Finance Dept, Front Desk Tasks - San Diego, both Inventory projects, Parking Lot, BW Wishlist, Podcast Product Launch, FAQ Videos Phase 2, List It Live 3.0, REbuild Podcast Build Out, both Escrow projects, Production Process Audit, and the other 10 templates.

## What an agent may do in Asana

From `.claude/autonomy-boundaries.md`: create and update tasks in the projects its agent file names, in the bullet format above; never complete a task, except the spread-master close-out in Tasks and subtasks, a task Brett names for completion in the thread, and the thread's own task at thread close; a task assigned to someone else, a recurring task, a task in a project with a completion rule, or Max Income only when Brett names that exact task; verified-done completion waits for proof of concept (Brett, 2026-09-30; completion levels 2026-10-01); never move a task to another project; delete a task only with Brett's explicit approval in the thread naming that task: one the agent created, or any task Brett deems no longer needed, whoever created it (restorable from Asana trash for 30 days; Brett, 2026-09-30; deemed-unneeded tasks 2026-10-19); never change a milestone or a field that drives an automation (listed in Automation rules) until the production process audit lands; never assign a subtask automatically when its master is created; never assign a task that has no due date; never invent a date. Approval in the Asana loop is a like on the agent's comment or the Approved field; silence is not approval.

## Elizabeth's half (answered 2026-10-12)

Settled 2026-10-12 without her: Priority legacy and Link per this file; episode lifecycle and Task Queue vs Project Pipeline read from the workspace; Devan's and Bonnie's Worlds archived. Answered on her task "Asana conventions: two questions": Stage retired as legacy (confirmed with Mark); Cassie's and Michelle's Worlds approved for the standard layout. Automation rules read by the COO 2026-10-12 (see Automation rules).

### Earlier note

Her task: https://app.asana.com/1/459051476492004/project/1203416244972577/task/1218849178962868. Covers the fields she created (Priority, Project Priority, Stage, Lead, Estimated time, Link), how episode and meeting projects are created and archived, the sections every World project should have, Task Queue versus Project Pipeline in Operations Projects & Tasks, and the automation rules an agent must not trip. Her answers get merged here and this file's date bumps.

## Change log

- 2026-11-04: No task assigned to Brett waits on someone else's reply (Brett).
- 2026-10-30: Ask the Workforce exempt from the field and assignment rules; its tasks are requests.
- 2026-10-21: Daily planning: long writing (REACH) in 4-hour blocks; when tasks move, higher priorities stay closest and lower priorities move later (Brett).
- 2026-10-19: Irrelevant tasks are deleted, not completed; an agent may delete any task Brett names as no longer needed, on his yes in the thread (Brett).
- 2026-10-12: Stage retired as legacy; Cassie's and Michelle's Worlds approved for the standard layout (Elizabeth).
- 2026-10-12: Automation rules section: every rule in 57 open projects and 18 templates, what an agent's writes set off, and the fields only the team sets (COO reading, Brett's request).
- 2026-10-12: Episode project lifecycle, Task Queue vs Project Pipeline, World layouts, and Stage usage recorded from a workspace read; Devan's and Bonnie's Worlds archived (Brett).
- 2026-10-08: Unnamed runs carry a placeholder estimate (median of named siblings, else 30 min), shown in the build plan before creation; replaces "stays blank until named" (Brett).
- 2026-10-02: Someday Maybe projects sit only in the Someday Maybe portfolio (supersedes "stay in Project Queue"); Production is active shoots and shows only; Human Resources and Sales & Marketing portfolios removed from the area list (Brett, audit round 2 portfolio placements).
- 2026-10-01: Description format: bold step titles, lettered sub-steps, code-formatted field names and values (Elizabeth).
- 2026-10-01: Process holds only tasks other users assign to Brett; Claude sets the My Tasks section by due date whenever it assigns Brett a task (Brett).
- 2026-10-01: Hold means on the roadmap (never moved to Someday Maybe for inactivity); Someday Maybe projects stay open in Project Queue (Brett, session audit).
- 2026-10-02: Rank is a person's priority (Worlds, Brett's day in My Tasks); Project Priority orders tasks inside a project. AI Workforce and REACH moved from Rank to Project Priority, Priority Today deleted, Rank added to Felicia's World (Brett).
- 2026-10-02: Open time in the day plan is filled by recommendation with a reason per task; additions are written only on Brett's approval (Brett).
- 2026-10-01: Brett's World project rows carry no Estimated time (Brett, Asana audit).
- 2026-10-01: Agent completion: on Brett's word in the thread and the thread's own task at close; others' tasks, recurring tasks, completion-rule projects, and Personal Layer projects only when Brett names the task; verified-done completion at proof of concept (Brett).
- 2026-10-01: Two kinds of master: spread (subtasks assigned and dated through the three triggers; master assigned and dated; chief of staff closes it) and session (master assigned and dated; subtasks never assigned or dated; the person closes it). Master Estimated time stays blank because Asana totals subtasks. Replaces the 2026-09-30 "masters stay unassigned" rules and the subtask sequencing-date line (Brett).
- 2026-10-01: Never archive a project with open tasks; stale-looking projects with open tasks get audited (Brett, Asana audit round 2).

- 2026-10-01: The chief of staff's Daily proposes moving dated Process tasks in My Tasks to Today, Upcoming, or Later; Asana never pulls from Process (Brett).

- 2026-09-30: Travel for calendar tasks is calculated from the Five Star office by default (Brett).
- 2026-09-30: My Tasks sections and the Process sort rule; master Lead default; master close-out by the chief of staff (assigned to Lead, dated the completion day, completed); a dated task is assigned to its Lead; Elizabeth as admin on new projects outside BW Personal; similar tasks grouped in the day plan (Brett).
- 2026-09-30: Subtask assignee and due date only through three triggers: day plan, approved campaign plan, status automation (Brett, via the chief of staff handoff).
- 2026-09-30: An agent may delete a task it created, with Brett's explicit per-task approval in the thread (Brett).
- 2026-09-29: Day order step 1: a Rank on today's My Tasks items is Brett's decided order; unranked means the chief of staff recommends and Brett decides (Brett).
- 2026-09-29: Subtask rule: never assigned automatically at creation, assigned individually when placed on a day or in a campaign plan; masters stay unassigned (Brett).
- 2026-09-29: Day-building order in Daily planning: My Tasks first, then Active Projects, then each project's tasks and subtasks; subtasks due today are assigned, masters never (Brett).
- 2026-09-28: Weekly capacity, milestone-driven hours, backward-scheduled due dates, focus blocks (Brett).
- 2026-09-28: Portfolio rule refined: BW Personal is personal work only; team-bound or Director-of-Operations-visible projects go in shared portfolios (Brett).
- 2026-09-28: Active means Brett is actively doing the project's tasks; Queue waits on sequence (Brett).
- 2026-09-28: Portfolios section; Active Projects holds only rows with their own Asana project; single linked asset goes in the Link field (Brett).
- 2026-09-28: Daily planning in My Tasks: about 6 hours per day including calendar events and travel (Brett).
- 2026-09-28: Estimated time on every task and subtask, hands-on minutes, calculated by Claude; field on every new project (Brett).
- 2026-09-28: Lead left of Assignee; numbered subtasks for repeated work; action-first descriptions with links and prompts (Brett).
- 2026-09-28: Lead field, assign-only-with-a-due-date rule, Rank within sections (Brett).
- 2026-09-25: created from Brett's interview (eight questions) plus the standing rules already in root CLAUDE.md, a Personal Layer project's MEMORY.md, and autonomy-boundaries.md.
