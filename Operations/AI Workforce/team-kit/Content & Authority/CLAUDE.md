# Content & Authority

## Identity

This workstation covers all content production and authority-building activity for you and for RTM clients. Route here for: show production (The Factory, Rebuild), reel and segment direction, transcript analysis, guest research, content planning and calendars, scripting, caption writing, direct-to-camera content, and RTM client content strategy. Do not route BD pipeline management, email, or operations here.

This workstation owns show production end to end for every show: The Factory, Rebuild, SDMM, and List It Live. That includes guest research, episode briefs, shoots, and content packages. The Rebuild seam: Business Development owns the guest relationship (target selection, pre-show and post-show outreach, escrow conversion); this workstation owns the episode.

## Resources

| Resource | Read when... |
|---|---|
| voice-principles.md (in 00_Resources) | Writing any scripts, captions, show copy, or content on your behalf |
| content-frameworks.md (in 00_Resources) | Any content creation, scripting, or strategic direction — load alongside voice-principles.md |
| five-star-brand-summary.md and 2026-Five-Star-Escrow-Brand-Kit.pdf (in 00_Resources) | Building campaigns or branded assets for Five Star |
| RTM brand kit (in Canva, via the Canva connector) | Building campaigns or branded assets for Real Talk Media |
| REACH (Google Doc) | Developing content strategy or coaching content for RTM clients |
| Topic Tracker (Google Sheets) | Planning show topics, checking episode status, or scoring new ideas |
| factory-cut-sheet skill (Code, `.claude/skills/`) and the reel-cut-sheet engine | Building an editor-ready reel cut sheet from a Factory recording |
| Reel Cut Sheet System (folder in this workstation) | Auditing or changing the reel cut sheet engine, show contexts, or SOP; checking deployed state |

## Workflow

### The Factory (Brett + Danny + Valli)
1. Pull topic tracker — identify next episode topic (prioritize score 8-9, verify all three can contribute)
2. Build episode brief: topic framing, key questions, talking points per host
3. Shoot at RTM Studio (Thursday)
4. Cut reels with the factory-cut-sheet skill in Code (editor-ready landscape .docx with scores, takeaways, hooks, captions, and edit direction); the reviewer checks it in Word before it goes to the editor
5. Flag any longer-form segments (up to 10-12 min) separately for editing
6. Distribute: Instagram, LinkedIn, YouTube, Facebook

### Rebuild (Brett solo host)
1. Identify guest from existing client/partner pool or target list
2. Research guest: business, brand, content, public profile, credibility signals
3. Build guest brief: background, key talking points, questions that frame Brett as peer
4. Prep Brett with talking points and conversation anchors
5. Shoot at RTM Studio
6. Coordinate guest content package (video + clips as value exchange)
7. Distribute: Instagram, LinkedIn, YouTube, Facebook, podcast platforms

### Reel Cut Sheet (from a recording)
Production cut sheets are built in Claude Code on the builder's machine with the factory-cut-sheet skill (`.claude/skills/factory-cut-sheet`): Plaud connector for audio and transcript, WhisperX for timing, the reel-cut-sheet engine for the editorial work, a blind judge pass, then the landscape .docx. The team's fallback is the show's claude.ai project running the same engine as an account-level skill. Output never moves through the Google Drive connector. Do not hand-build a cut sheet outside the engine or invent a separate cut process.

The COO owns this system. Engine, show context, and pipeline changes happen against the Reel Cut Sheet System folder in this workstation (canonical), then deploy out as a skill install or a project instructions paste. The team SOP is canonical in its Google Doc. See that folder's CLAUDE.md.

### Direct-to-Camera Content
Follow the direct-to-camera outline in 00_Resources/content-frameworks.md section 6.

## Editorial Rules

Follow your voice principles in 00_Resources (voice-principles.md).

**Your authority positioning:**
_Write your own positioning here (what your credibility rests on, how it shows up in content). Never state a fixed year count; anchor on start dates._

**REACH applies to client content:**
When building content strategy or coaching content for RTM clients, apply REACH: Three Spheres, SOI/SOR/SOP, ideal client profiling, content pillars.

**Shoot plans come first:**
Every shoot has its own shoot plan, approved and with production on an earlier day; never plan and shoot on the same day. (Brett, 2026-10-29)

**Platform distribution:**
Every episode should produce cuts for Instagram, LinkedIn, YouTube, and Facebook. Caption tone adjusts per platform. Content does not change.
