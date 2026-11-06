# LinkedIn hook swipe file

_Built 2026-10-29 by the research sidekick for hook rule 4.3a, item 16 (content-frameworks.md). Status: COMPLETE at 50 entries, with the caveats below. Swipes model the hook; they are never copied word for word (4.4). The copywriter reads this before writing LinkedIn hook options._

## Header

**Purpose.** Hooks from top-performing LinkedIn text posts, tagged so the copywriter can model them for Brett's own give-first posts (lane 10) aimed at persona 1, the top-producing agent and business builder.

**Sources (50 posts, 10 authors).**
- Named by Brett: Alex Hormozi (14 posts), Leila Hormozi (8), Dan Martell (5).
- Added, each writing for business builders or real estate professionals:
  - Ryan Serhant (4): real estate broker and founder who writes directly to agents.
  - Tom Ferry (1): real estate coach to agents.
  - Justin Welsh (6): one-person-business operator and LinkedIn creator.
  - Codie Sanchez (5): buys and teaches owning Main Street businesses.
  - Nick Huber (5): self-storage and real estate operator who writes for business owners.
  - Gary Vaynerchuk (1): writes to business owners.
  - Grant Cardone (1): real estate investor and sales trainer.
- "Top performer" here rests on each author's public standing as described in their LinkedIn profile snippets and search results. I did not see follower counts for most of them.

**Method.**
1. LinkedIn hides feeds behind a login, so I used public routes only: web search limited to linkedin.com to find indexed post pages, then a page reader on each public post URL. No Apify actor was run. Spend: $0.
2. Hook, reactions, comments, and text length come from the logged-out post page, captured 2026-10-29. I recorded the first sentence as the first line, and the second sentence as line 2 when it sits inside the roughly 140-character fold. The page reader does not preserve line breaks, so sentence boundaries stand in for them.
3. Dates are derived from the numeric ID in each post URL (LinkedIn encodes the posting time in it) and are UTC, accurate to about a day. LinkedIn's logged-out pages show only relative ages.
4. "Engagement relative to the author's typical post" is reactions divided by the median reactions of that author's posts in this file (shown only where the author has 4 or more posts here). It is a within-sample measure, not a measure against the author's whole feed.
5. Rule 4.3a tags (pattern, awareness, meat, components, lever, lane fit) are my judgment against 4.3 and 4.3a as written 2026-10-28. "Components" uses the numbering in 4.3 (1 Recency, 2 Relevancy, 3 Celebrity, 4 Proximity, 5 Conflict, 6 Unusual, 7 Ongoing). "below the minimum" means the first line carries only one component, under item 4's two. That does not mean the post underperformed.
6. Posts the reader flagged as video in the search title (the "[Video]" prefix) were left out of the 50 unless noted, since this is a text-post file. Two video-tagged posts did enter the 50 and are marked in the Media column. Four more video-tagged posts are in the Length section as a side sample.

**What I could not see.**
- **Reposts:** LinkedIn does not show a repost count on logged-out post pages, so all 50 read "n.s." (not shown). Getting reposts needs an Apify run (plan at the bottom, not run).
- **The authors' real top posts.** I could only reach posts that search engines had indexed. They are mostly 2022 to early 2024, plus one from Feb 2026, and none from 2025. So these are well-engaged posts from that window, not a verified top 50 of each feed. Dan Martell's and Tom Ferry's indexed posts are low in absolute reactions, and I judged them only against each other. Tom Ferry has one entry because the others I found had very low engagement.
- **A feed digest of Alex Hormozi's recent activity** came back from the first page-reader call with relative timestamps and no URLs. I could not tie it to specific posts, so none of it is used.
- **"See more" text.** Where a post ended in "…more" on the page, I say so; the visible text is what I counted. Posts so marked: entries 2, 4, 5, 16 (Leila "arrested"), 28 (Serhant first-agent post), and 39 (Codie "first deal"). For entries 2, 4, and 5 the full body may be longer.
- **Media.** The logged-out capture strips media. "Text only" in the Media column means no media element and no "[Video]" search-title tag were found, not that it was proven. Video was flagged only by the "[Video]" search-title prefix or a transcript block on the page.
- **Quote exactness.** Hooks went through a page reader that summarizes pages. A few hook strings (marked "as returned") may differ from LinkedIn in small ways such as an apostrophe. Open the link before using any hook as a model.
- **Character counts.** Line-1 counts are my own counts of the first sentence; full-post word and character counts are the page reader's counts and can be off by a few percent.

## The table

Columns: hook as posted (line 1 / line 2) | line 1 characters, with line 1 + 2 in parentheses | post date (UTC) | reactions / comments / reposts | reactions vs the author's median in this file | 4.3a pattern | awareness | meat | 4.3 components in the first line | value lever | fit for Brett's give-first lane (item 10: no Labels, no call to action, Yes-Questions only) | full post words / characters | media | link.

| # | Author | Hook | L1 chars | Date | R / C / Rp | vs median | Pattern | Awareness | Meat | Components | Lever | Lane 10 fit | Words / chars | Media | Link |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Alex Hormozi | If you don't want their life, don't take their advice. | 54 | 2024-03-19 | 1,560 / 213 / n.s. | 1.30 | Conditionals | Problem Aware | Education | 2, 5 | status | Yes | 10 / 54 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_if-you-dont-want-their-life-dont-take-activity-7175891771854319618-8GgL) |
| 2 | Alex Hormozi | The goal of good writing? Make the reader feel like their eyes are rolling downhill. / It takes more effort to stop than to keep going. | 84 (133) | 2023-08-14 | 713 / 100 / n.s. | 0.59 | Statements | Solution Aware | Education | 2, 6 | reduced effort | Adapt: rhetorical question lead, flip to a flat claim; body promotes his event | 43 / 263 (visible; "more") | Text only | [post](https://www.linkedin.com/posts/alexhormozi_the-goal-of-good-writing-make-the-reader-activity-7096884079744147456--3rk) |
| 3 | Alex Hormozi | "When I was 20 I wanted to be a millionaire…Now that I'm a millionaire, I want to be 20." | 88 | 2023-11-02 | 2,473 / 317 / n.s. | 2.06 | Provocative claims | Unaware | Story | 3, 6 | status | Yes | 54 / 270 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_when-i-was-20-i-wanted-to-be-a-millionaire-activity-7125860820000903168-zGve) |
| 4 | Alex Hormozi | All audience-growing content does one thing - it rewards the people consuming it. | 81 | 2023-07-20 | 686 / 91 / n.s. | 0.57 | Statements | Solution Aware | Education | 2 only (below the minimum) | reduced effort | Yes | 53 / 332 (visible; "more") | Text only | [post](https://www.linkedin.com/posts/alexhormozi_all-audience-growing-content-does-one-thing-activity-7087864434013913089--M_P) |
| 5 | Alex Hormozi | We need someone to believe in us. As much (or more) than we believe in ourselves. | 81 | 2023-05-07 | 1,673 / 143 / n.s. | 1.39 | Statements | Unaware | Education | 2 only (below the minimum) | status | Yes | 16 / 81 (visible; "more") | Text only | [post](https://www.linkedin.com/posts/alexhormozi_we-need-someone-to-believe-in-us-as-much-activity-7061067171241566208-pL6O) |
| 6 | Alex Hormozi | For anyone who needs to hear this: You never feel like you know what you're doing... / Figuring it out isn't part of the game (tail as returned) | 84 (123) | 2023-11-29 | 4,836 / 403 / n.s. | 4.02 | Provocative claims | Unaware | Education | 2, 5 | certainty | Adapt: "For anyone who needs to hear this" is a broad Label and meta lead-in; open on the claim | 49 / 269 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_for-anyone-who-needs-to-hear-this-you-never-activity-7135491552021270529-YPAi) |
| 7 | Alex Hormozi | There's a big difference between becoming known and becoming respected. / Don't let an algorithm convince you otherwise. | 71 (118) | 2023-11-30 | 1,014 / 147 / n.s. | 0.84 | Provocative claims | Problem Aware | Education | 2, 5 | status | Yes | 17 / 118 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_theres-a-big-difference-between-becoming-activity-7136053650216415232-Vx8d) |
| 8 | Alex Hormozi | There are 30 million businesses in the USA If they can figure it out so can you. | 80 | 2023-05-15 | 1,686 / 109 / n.s. | 1.40 | Conditionals | Unaware | Education | 2 only (below the minimum) | certainty | Yes | 17 / 80 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_there-are-30-million-businesses-in-the-usa-activity-7063988924917903361-yCNp) |
| 9 | Alex Hormozi | The biggest difference between small and big business owners? Time... | 69 | 2023-11-22 | 1,055 / 187 / n.s. | 0.88 | Statements | Solution Aware | Education | 2, 5 | money | Adapt: rhetorical question; rewrite as a flat claim | 54 / 339 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_the-biggest-difference-between-small-and-activity-7132922482814029826-I8WT) |
| 10 | Alex Hormozi | How to build a terrible business: Sell stuff anyone else can sell and compete on price. | 87 | 2023-12-26 | 802 / 108 / n.s. | 0.67 | Provocative claims | Problem Aware | Education | 2, 5 | money | Yes | 16 / 87 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_how-to-build-a-terrible-business-sell-stuff-activity-7145508036227268608-adAB) |
| 11 | Alex Hormozi | It takes every entrepreneur different amounts of time to realize, That on a long enough time horizon... | 103+ (reader cut) | 2024-01-12 | 1,218 / 173 / n.s. | 1.01 | Statements | Unaware | Education | 2 only (below the minimum) | certainty | Yes, but the point is withheld past the fold, so a weak model | 38 / 216 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_it-takes-every-entrepreneur-different-amounts-activity-7151603279330705408-gg4m) |
| 12 | Alex Hormozi | What people think it takes to grow a business: / -Zillion SOPs -AI everything -Content posting machine (line break inferred) | 46 (100) | 2023-12-08 | 1,096 / 286 / n.s. | 0.91 | Provocative claims | Problem Aware | Education | 2, 5 | reduced effort | Yes | 35 / 254 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_what-people-think-it-takes-to-grow-a-business-activity-7138922507117412353-GoL9) |
| 13 | Alex Hormozi | 100's of people with no other option. / + Tiny van with bad coffee & crappy sandwiches. | 37 (86) | 2023-07-30 | 2,667 / 256 / n.s. | 2.22 | Narratives | Unaware | Story | 2, 6 | money | Yes | 51 / 276 | Text only | [post](https://www.linkedin.com/posts/alexhormozi_100s-of-people-with-no-other-option-tiny-activity-7091531212871081985-hZeF) |
| 14 | Alex Hormozi | If you're starting out, give your stuff away for free. / When people say no, ask them why. | 54 (88) | 2023-10-05 | 1,185 / 192 / n.s. | 0.99 | Conditionals | Problem Aware | Education | 2, 5 | money | Yes | 45 / 262 | Video (search-title "[Video]" tag) | [post](https://www.linkedin.com/posts/alexhormozi_if-youre-starting-out-give-your-stuff-away-activity-7115553327915900928-gAq_) |
| 15 | Leila Hormozi | The day after I graduated college, I moved out to California with about $5,000. | 79 | 2023-10-31 | 280 / 42 / n.s. | 0.62 | Narratives | Unaware | Story | 3, 6 | status | Yes, needs Brett's own documented story | 82 / 446 | Text only | [post](https://www.linkedin.com/posts/leilahormozi_the-day-after-i-graduated-college-i-moved-activity-7125203673298657280-rgnI) |
| 16 | Leila Hormozi | In a matter of 18 months, I got arrested about six times. | 57 | 2023-10-11 | 472 / 74 / n.s. | 1.05 | Admission | Unaware | Story | 5, 6 | status | Yes, needs Brett's own documented story | 155 / 814 (visible; "more") | Text only | [post](https://www.linkedin.com/posts/leilahormozi_in-a-matter-of-18-months-i-got-arrested-activity-7117897288626130945-PqXp) |
| 17 | Leila Hormozi | When I was 23, Alex & I started our first business. | 51 | 2023-10-15 | 431 / 52 / n.s. | 0.95 | Narratives | Unaware | Story | 3 only (below the minimum) | status | Yes; body ends on a Yes-Question | 142 / 845 | Text only | [post](https://www.linkedin.com/posts/leilahormozi_when-i-was-23-alex-i-started-our-first-activity-7119398573686800384-Cp3b) |
| 18 | Leila Hormozi | People constantly question why their business isn't growing. / I know the reason. | 60 (79) | 2023-11-23 | 348 / 39 / n.s. | 0.77 | Statements | Problem Aware | Education | 2 only (below the minimum) | money | Yes | 66 / 396 | Text only | [post](https://www.linkedin.com/posts/leilahormozi_people-constantly-question-why-their-business-activity-7133492666977198081-vsrJ) |
| 19 | Leila Hormozi | The true job of a CEO is to assemble a team. | 44 | 2023-08-23 | 489 / 43 / n.s. | 1.08 | Statements | Solution Aware | Education | 2 only (below the minimum) | reduced effort | Yes | 57 / 314 | Text only | [post](https://www.linkedin.com/posts/leilahormozi_the-true-job-of-a-ceo-is-to-assemble-a-team-activity-7100134155807506432-p-Rk) |
| 20 | Leila Hormozi | Communicating with your team requires three critical steps: / 1. Saying your intention. 2. Writing your intention. | 59 (112) | 2023-06-01 | 390 / 50 / n.s. | 0.86 | Lists | Solution Aware | Education | 2 only (below the minimum) | certainty | Yes | 26 / 175 | Text only | [post](https://www.linkedin.com/posts/leilahormozi_communicating-with-your-team-requires-three-activity-7070036270952894464-DxaK) |
| 21 | Leila Hormozi | Before Gym Launch - Alex Hormozi and I flew out and launched 33 gyms ourselves. / We ate at 7-Eleven, slept in Extended Stays... | 79 (126) | 2023-05-21 | 973 / 83 / n.s. | 2.15 | Narratives | Unaware | Story | 3, 6 | status | Adapt: opens on a brand and credential; open mid-scene instead | 49 / 274 | Text only | [post](https://www.linkedin.com/posts/leilahormozi_beforegym-launch-alex-hormoziand-i-flew-activity-7066140599724171264-55MI) |
| 22 | Leila Hormozi | I wish I knew this in my early 20s. | 35 | 2024-02-22 | 520 / 65 / n.s. | 1.15 | Admission | Unaware | Education | 2 only (below the minimum) | status | No: vague setup (core 8); works only if attached media carries the point | 9 / 35 | Text only | [post](https://www.linkedin.com/posts/leilahormozi_i-wish-i-knew-this-in-my-early-20s-activity-7166485042695786497-KeCE) |
| 23 | Dan Martell | I fired myself from my own company six times in two years. / Best decision I ever made. | 58 (85) | 2026-02-23 | 345 / 147 / n.s. | 1.31 | Admission | Solution Aware | Story | 5, 6 | reduced effort | Yes | 428 / 2,537 | Text only | [post](https://www.linkedin.com/posts/dmartell_i-fired-myself-from-my-own-company-six-times-activity-7431753453221326848-8tX3) |
| 24 | Dan Martell | I've haven't shared this story before. (as posted) / This was me at 20. | 38 (57) | 2024-04-13 | 472 / 119 / n.s. | 1.79 | Narratives | Unaware | Story | 6 only (below the minimum) | status | Adapt: meta lead-in; the second line leans on an image I could not confirm | 480 / 2,596 | Text only | [post](https://www.linkedin.com/posts/dmartell_ive-havent-shared-this-story-before-activity-7184961860373282818-V2P5) |
| 25 | Dan Martell | Eleven years ago, my life took a turn that I never saw coming. / Picture this: I'm in the Bahamas, surrounded by what should... | 62 (125) | 2023-12-31 | 264 / 33 / n.s. | 1.00 | Narratives | Unaware | Story | 6 only (below the minimum) | status | Yes, needs Brett's own documented story | 253 / 1,367 | Text only | [post](https://www.linkedin.com/posts/dmartell_eleven-years-ago-my-life-took-a-turn-that-activity-7147358095839535104-e74J) |
| 26 | Dan Martell | I've met a lot of billionaires, here's what some of them taught me: / Lesson #1: Slow down to go fast. | 67 (100) | 2023-10-25 | 230 / 17 / n.s. | 0.87 | Lists | Solution Aware | Education | 2, 3 | status | Adapt: "here's what" is a meta announcement; lead with Lesson #1 | 356 / 2,059 | Unconfirmed (comments mention a photo) | [post](https://www.linkedin.com/posts/dmartell_ive-met-a-lot-of-billionaires-heres-what-activity-7123054566790615040-Opxn) |
| 27 | Dan Martell | If you want to grow a business you don't grow to hate… then you need to learn how to buy back your time. | 104 | 2023-01-17 | 36 / 22 / n.s. | 0.14 | Conditionals | Problem Aware | Education | 2, 5 | reduced effort | Adapt: hook fits; the post is a book-launch ask with a comment CTA | 226 / 1,258 | Text only | [post](https://www.linkedin.com/posts/dmartell_if-you-want-to-grow-a-business-you-dont-activity-7020956678791520256-HcXk) |
| 28 | Ryan Serhant | When I first became a real estate agent back in 2008 (at the very beginning of the housing crisis), it was an intensely (reader cut) | 121+ | 2024-02-27 | 626 / 38 / n.s. | 1.00 | Narratives | Unaware | Story | 2, 5 | status | Yes, needs Brett's own documented story | 167+ / 936+ (visible; "more") | Video (transcript on page; inferred) | [post](https://www.linkedin.com/posts/ryanserhant_when-i-first-became-a-real-estate-agent-back-activity-7168359578831704064-Br0T) |
| 29 | Ryan Serhant | I was burnt out. Completely and utterly exhausted. / I wanted to quit... | 49 (69) | 2023-03-06 | 913 / 42 / n.s. | 1.45 | Admission | Problem Aware | Story | 2, 5 | reduced effort | Yes | 561 / 2,947 | Text only | [post](https://www.linkedin.com/posts/ryanserhant_i-was-burnt-out-completely-and-utterly-exhausted-activity-7038555947715166208-Ph0Q) |
| 30 | Ryan Serhant | I got this message on Facebook today: "How many homes do I have to sell to make $175K as a real estate agent in Wisconsin?" | 123 | 2023-02-16 | 594 / 51 / n.s. | 0.95 | Narratives | Problem Aware | Demonstration | 1, 2, 3 | money | Yes | 210 / 1,176 | Text only | [post](https://www.linkedin.com/posts/ryanserhant_i-got-this-message-on-facebook-today-how-activity-7032005561764212736-kloD) |
| 31 | Ryan Serhant | When I was 24, I gave up on my dreams… and it was the best decision I've ever made! | 83 | 2023-05-24 | 631 / 41 / n.s. | 1.00 | Provocative claims | Unaware | Story | 5, 6 | status | Yes | 553 / 2,942 | Text only | [post](https://www.linkedin.com/posts/ryanserhant_when-i-was-24-i-gave-up-on-my-dreams-and-activity-7067186216407851009-WzsI) |
| 32 | Tom Ferry | If you have the budget. Grow your farms. / Think about this. | 40 (58) | 2023-11-22 | 45 / 6 / n.s. | n/a (1 post) | Conditionals | Solution Aware | Education | 2, 3 | money | Yes; the stat arrives past the fold, so lead with it | 31 / 154 | Text only | [post](https://www.linkedin.com/posts/tomferry1_if-you-have-the-budget-grow-your-farms-activity-7133092761729171456-cHGY) |
| 33 | Justin Welsh | I call myself a solopreneur. / That's actually a lie. | 28 (51) | 2022-10-11 | 1,718 / 289 / n.s. | 0.94 | Admission | Problem Aware | Story | 5, 6 | status | Adapt: body closes on an engagement question ("Who's yours?"), not a Yes-Question | 118 / 676 | Text only | [post](https://www.linkedin.com/posts/justinwelsh_i-call-myself-a-solopreneur-thats-actually-activity-6985645853747126273-eT-N) |
| 34 | Justin Welsh | 2023 Recap: / - Did $2.317M as a solopreneur at ~90% margins. | 11 (59) | 2024-01-01 | 1,922 / 633 / n.s. | 1.06 | Ridiculous Results | Solution Aware | Testimonial | 1, 3 | money | Yes, Brett's own documented figures only; body ends with a follow CTA | 497 / ~2,700 (est.) | Text only | [post](https://www.linkedin.com/posts/justinwelsh_2023-recap-did-2317m-as-a-solopreneur-activity-7147575604199006208-guuB) |
| 35 | Justin Welsh | I wrote my first LinkedIn post on October 30th, 2018. / I heard complete crickets. | 53 (80) | 2023-04-26 | 2,949 / 657 / n.s. | 1.62 | Narratives | Problem Aware | Story | 3, 7 | speed | Adapt: body ends with a join link (CTA) | 181 / 1,083 | Unconfirmed (body says graphics are shown below) | [post](https://www.linkedin.com/posts/justinwelsh_i-wrote-my-first-linkedin-post-on-october-activity-7057036105841270784-2kht) |
| 36 | Justin Welsh | Had a call last week with a new solopreneur looking to scale to $100k. / Here are the 5 pieces of advice I shared: | 69 (111) | 2023-10-28 | 1,543 / 597 / n.s. | 0.85 | Lists | Problem Aware | Education | 1, 2, 3 | money | Adapt: body ends with a waitlist link (CTA); "Here are" is a meta announcement | 397 / 2,353 | Text only | [post](https://www.linkedin.com/posts/justinwelsh_had-a-call-last-week-with-a-new-solopreneur-activity-7124005429839319040-whUu) |
| 37 | Justin Welsh | Easlo is a 20-year-old solopreneur making $150k+ per year selling Notion templates. | 82 | 2023-02-28 | 2,393 / 345 / n.s. | 1.31 | Ridiculous Results | Solution Aware | Testimonial | 3, 6 | money | Yes, needs a documented third-party story | 27 / 160 | Text only | [post](https://www.linkedin.com/posts/justinwelsh_easlo-is-a-20-year-old-solopreneur-making-activity-7036395113098436609-ykHB) |
| 38 | Justin Welsh | Solopreneurship forces skill development. | 41 | 2024-03-26 | 1,007 / 737 / n.s. | 0.55 | Statements | Solution Aware | Education | 2 only (below the minimum) | speed | Adapt: body ends with a call to action | 76 / 507 | Text only | [post](https://www.linkedin.com/posts/justinwelsh_solopreneurship-forces-skill-development-activity-7178227679169544192-ayiX) |
| 39 | Codie Sanchez | My first deal, I did EVERYTHING wrong. / Now, every biz I buy has these 5 things: ↓ ↓ ↓ | 38 (85) | 2023-06-27 | 532 / 91 / n.s. | 1.36 | Admission | Problem Aware | Education | 3, 5 | certainty | Yes | 60 / 352 (visible; "more") | Text only | [post](https://www.linkedin.com/posts/codiesanchez_my-first-deal-i-did-everything-wrong-activity-7079443799277490178-_g2i) |
| 40 | Codie Sanchez | I just heard about how an internet friend built a $30M/year business at 19. | 75 | 2023-03-16 | 148 / 36 / n.s. | 0.38 | Ridiculous Results | Solution Aware | Testimonial | 1, 3, 6 | money | Yes, needs a documented third-party story | 422 / n.c. | Text only | [post](https://www.linkedin.com/posts/codiesanchez_i-just-heard-about-how-an-internet-friend-activity-7042117320294432768-cgGP) |
| 41 | Codie Sanchez | If it will make you money, but degrade your reputation... / Don't do it. | 57 (70) | 2023-04-16 | 217 / 34 / n.s. | 0.55 | Conditionals | Problem Aware | Education | 2, 5 | money | Yes | 17 / 102 | Text only | [post](https://www.linkedin.com/posts/codiesanchez_if-it-will-make-you-money-but-degrade-your-activity-7053417838748803072-s3RN) |
| 42 | Codie Sanchez | If you want to make the wrong decision for you, ask for everyone's advice. | 74 | 2023-06-11 | 434 / 86 / n.s. | 1.11 | Conditionals | Problem Aware | Education | 2, 5 | certainty | Yes | 14 / 74 | Text only | [post](https://www.linkedin.com/posts/codiesanchez_if-you-want-to-make-the-wrong-decision-for-activity-7073649087404728322-JQ1s) |
| 43 | Codie Sanchez | Personal growth hack: Be the dumbest one in your friend group, then move on when you're not. | 92 | 2023-07-09 | 391 / 106 / n.s. | 1.00 | Commands | Solution Aware | Education | 2, 6 | speed | Yes | 17 / 92 | Text only | [post](https://www.linkedin.com/posts/codiesanchez_personal-growth-hack-be-the-dumbest-one-activity-7083791932346257408-t-sS) |
| 44 | Nick Huber | I bought a self storage facility in October 2020 for $1.2 million. / Today it's worth over $5 million. | 66 (100) | 2023-05-22 | 2,118 / 150 / n.s. | 6.94 | Ridiculous Results | Solution Aware | Testimonial | 3, 6 | money | Yes, Brett's own documented figures only | 372 / 2,013 | Text only | [post](https://www.linkedin.com/posts/sweatystartup_i-bought-a-self-storage-facility-in-october-activity-7066450647440654336-c4xw) |
| 45 | Nick Huber | News flash: Most companies don't want extremely driven employees. / They don't want growth of risk or change. | 65 (107) | 2023-08-19 | 305 / 34 / n.s. | 1.00 | Provocative claims | Problem Aware | Education | 2, 5 | status | Yes | 128 / 679 | Text only | [post](https://www.linkedin.com/posts/sweatystartup_news-flash-most-companies-dont-want-extremely-activity-7098677989009227777-THCH) |
| 46 | Nick Huber | The best business models are simple. / They are clear. They are concise. | 36 (70) | 2023-04-10 | 229 / 24 / n.s. | 0.75 | Statements | Solution Aware | Education | 2 only (below the minimum) | reduced effort | Yes | 261 / 1,567 | Text only | [post](https://www.linkedin.com/posts/sweatystartup_the-best-business-models-are-simple-they-activity-7051301459262390273-wtuu) |
| 47 | Nick Huber | When we built our self storage facility from the ground up I didn't get a feasibility study or talk to any self storage operators. | 130 | 2023-07-19 | 169 / 13 / n.s. | 0.55 | Admission | Problem Aware | Story | 2, 5 | certainty | Yes | 151 / 814 | Text only | [post](https://www.linkedin.com/posts/sweatystartup_when-we-built-our-self-storage-facility-from-activity-7087440984325722112-GAk_) |
| 48 | Nick Huber | How I made $2 million in the self storage business: | 51 | 2022-12-28 | 578 / 79 / n.s. | 1.90 | Ridiculous Results | Solution Aware | Demonstration | 3, 6 | money | Adapt: the whole post is a newsletter-join ask (CTA); the 24-word body has no give-first content | 24 / 145 | Text only | [post](https://cy.linkedin.com/posts/sweatystartup_how-i-made-2-million-in-the-self-storage-activity-7013880931266560000-R4hp) |
| 49 | Gary Vaynerchuk | If you have a business, ask yourself this question... / Do you want a community... or do you want customers? | 53 (106) | 2022-06-02 | 1,379 / 129 / n.s. | n/a (1 post) | Questions | Problem Aware | Education | 2, 5 | status | No: open question, not a Yes-Question (core 10); question openers measure lowest on LinkedIn (item 13) | 170 / 909 | Text only | [post](https://www.linkedin.com/posts/garyvaynerchuk_if-you-have-a-business-ask-yourself-this-activity-6938216080209264640-yfQG) |
| 50 | Grant Cardone | Many people ask me how I got started in real estate. / Here's a quick summary: I started out as an employee and got good at the sales game. | 52 (137) | 2023-09-25 | 479 / 58 / n.s. | n/a (1 post) | Narratives | Unaware | Story | 2, 3 | status | Adapt: a setup line; body ends with promotional links (CTA) | 76 / 429 | Text only | [post](https://www.linkedin.com/posts/grantcardone_many-people-ask-me-how-i-got-started-in-real-activity-7112156564639096832-Ecx3) |

Notes on the table: "n.c." = the page reader could not give a character count. "~2,700 (est.)" for entry 34 is the reader's estimate. "+" after a character count means the reader cut the first sentence short, so the true count is higher. Entry 34's ratio of 1.06 reflects Justin Welsh's high typical engagement; its absolute 1,922 reactions and 633 comments are among the highest here.

Lane fit totals: 35 Yes, 13 Adapt, 2 No. Entries with only one 4.3 component in line 1: 13 of 50 (marked "below the minimum"); 4.3a item 4 asks for two.

## Length from the Apify run (2026-10-29, use this first)

Source: Apify harvestapi/linkedin-profile-posts, run pBQaIEkwGFZgCyjkq, dataset lGHcUlDqEFdg3REEh, 1,000 original posts (100 per author, no reposts or quote posts present), all dated 2025-01-29 to 2026-10-29. Cost about $2.00 (calculation from $0.002 per post; billed amount not read back). Words counted by script on the full post text. Media is inferred from the post object: video, image, document, link, or none (text). "Ratio" is a post's reactions plus comments plus shares divided by that author's median. Computed by the CMO from the dataset.

### Caption length by media type, all ten authors

| Media | Posts | Median words | Middle half (words) | Median characters |
|---|---|---|---|---|
| Native video | 272 | 28.5 | 12 to 86 | 166 |
| Image | 421 | 109 | 0 to 215 | 606 |
| Text only | 307 | 24 | 15 to 51 | 129 |

### Video caption length, by author

| Author | Video posts (of 100) | Median video caption (words) | All-post median (words) |
|---|---|---|---|
| Alex Hormozi | 35 | 16 | 9 |
| Leila Hormozi | 22 | 22 | 7 |
| Dan Martell | 45 | 10 | 16.5 |
| Ryan Serhant | 44 | 33.5 | 36 |
| Grant Cardone | 61 | 195 | 68.5 |
| Gary Vaynerchuk | 32 | 44.5 | 15 |
| Nick Huber | 24 | 10 | 34 |
| Tom Ferry | 5 | 56 | 16 |
| Codie Sanchez | 4 | 86.5 | 220.5 |
| Justin Welsh | 0 | none | 205.5 |

### Does caption length track engagement on video?

- Within each author (video posts only, captions of 50 words or fewer versus longer), there is no consistent direction. Shorter was ahead for Gary Vaynerchuk (1.26 vs 0.77), Grant Cardone (1.57 vs 1.00), and Leila Hormozi (1.08 vs 0.92); longer was ahead for Ryan Serhant (1.21 vs 0.96) and Dan Martell (1.39 vs 0.96, only 3 long posts); Alex Hormozi was even (1.00 vs 1.00).
- Across all video posts, the 201 to 400 word group had the highest median ratio (1.40), but it is 14 posts, mostly Grant Cardone and Ryan Serhant, so it reflects those authors more than length.
- The 20 strongest video posts by ratio have a median caption of 33 words; 14 of the 20 are under 70 words.

**Reading:** these operators caption native video short. The typical caption is about 30 words, three quarters are under about 85 words, and length does not reliably move engagement within an author. Brett's 300+ word reel narratives are far outside how this group captions video. This agrees with Brett's read for video posts specifically. Long posts in this set are mostly image or text posts (Welsh, Codie Sanchez).

## Length, earlier logged-out sample (superseded by the Apify run above)

All counts are for the visible post body from the logged-out page. Word and character counts come from the page reader, not a word counter, so treat them as accurate to a few percent. Posts marked "more" may be longer than counted. The medians below use words. The comparison point is Brett's reel narratives, which run 300+ words.

### Median and range of words, by author

| Group | Posts | Median words | Range | Posts over 300 words |
|---|---|---|---|---|
| All 50 | 50 | 63 | 9 to 561 | 9 |
| Alex Hormozi | 14 | 40.5 | 10 to 54 | 0 |
| Leila Hormozi | 8 | 61.5 | 9 to 155 | 0 |
| Dan Martell | 5 | 356 | 226 to 480 | 3 |
| The three Brett named, combined | 27 | 49 | 9 to 480 | 3 |
| Alex and Leila only | 22 | 47 | 9 to 155 | 0 |
| The other seven authors, combined | 23 | 151 | 14 to 561 | 7 |
| Ryan Serhant | 4 | 381.5 | 167+ to 561 | 2 |
| Justin Welsh | 6 | 149.5 | 27 to 497 | 2 |
| Codie Sanchez | 5 | 17 | 14 to 422 | 1 |
| Nick Huber | 5 | 151 | 24 to 372 | 1 |
| Tom Ferry, Gary Vaynerchuk, Grant Cardone | 1 each | 31, 170, 76 | n/a | 0 |

Character medians where I have them: Alex Hormozi 258, Leila Hormozi 355, Dan Martell 2,059.

**Does the data support Brett's read?** Half of it. For Alex and Leila Hormozi it holds strongly: Alex's longest post is 54 words, Leila's longest is 155, and neither author has a post near 300 words. For Dan Martell it does not hold in this sample: his 5 posts run 226 to 480 words (median 356), and 3 of 5 are over 300, which is as long as a reel narrative. Four of the other seven authors (Serhant, Welsh, Huber, Gary Vaynerchuk) also include posts of 170 to 561 words. So "short" describes the Hormozis, not LinkedIn operators in general. Dan's sample is only 5 posts and none is more recent than 2024 except one from Feb 2026, so treat this as a signal, not a finding.

### Native video versus text only

The page reader cannot see media, so video was detected only by a "[Video]" search-title tag or a transcript block on the page. Within the 50, two posts qualify: entry 14 (Alex Hormozi, 45 words) and entry 28 (Ryan Serhant, 167+ words visible, truncated). I added four more video-tagged posts as a side sample, not part of the 50:

| Side sample (video-tagged) | Visible words | Reactions / comments |
|---|---|---|
| Alex Hormozi, "The longer I learn about sales..." (2023-12-06, ID 7138200862333538304) | 106 (truncated) | 1,483 / 187 |
| Alex Hormozi, "The thing they don't tell you is: The long way is the shortcut." (2023-12-02, ID 7136494372509945857) | 49 (truncated) | 2,725 / 204 |
| Alex Hormozi, "Want to stay poor? Hold onto this belief." (2023-05-18, ID 7065076084458827777) | 38 (truncated) | 844 / 87 |
| Dan Martell, "Naval Ravikant has this concepts called the 4 Levels of luck" (2023-04-18, ID 7053860608491802624) | 11 (truncated to line 1) | 10 / 2 |

| Group | Posts | Median words | Range |
|---|---|---|---|
| Video-tagged (2 in the 50 plus 4 side sample) | 6 | 47 | 11 to 167+ |
| Text only (48 of the 50; no media detected) | 48 | 63 | 9 to 561 |

Two limits on this table. The video group is 6 posts, mostly Alex Hormozi, whose text posts are also short, so I cannot separate "video" from "Alex." And the video captions visible on the page are cut at "more," so true caption lengths are likely longer than shown. The only defensible reading is that the video-tagged captions I could see were short, 38 to 106 words for the three Hormozi examples. Getting a real video split needs the Apify run below.

### Does length track engagement here?

No consistent relationship in this set.
- Within each author, I split posts at that author's own median length and compared the median of reactions-vs-median. Alex Hormozi: longer 0.99, shorter 1.01 (no difference). Leila Hormozi: longer 0.86, shorter 1.12 (shorter slightly ahead, 4 posts each). Justin Welsh: longer 1.06, shorter 0.94 (longer slightly ahead). Dan Martell: his two longest posts (428 and 480 words) scored 1.31 and 1.79, his shortest (226) scored 0.14, but that one is a book-launch ask with a CTA, so length is confounded. Codie Sanchez, Nick Huber, and Serhant are mixed.
- The 15 posts that beat their author's median by 1.3x or more range from 10 to 561 words (median 51). They appear at both ends: 10 to 60 words for most Hormozi entries, 372 to 561 words for Nick Huber's $1.2M-to-$5M post, Dan Martell's two longest, and Ryan Serhant's burnout post.
- I did not compute a formal correlation. With 50 posts, 10 authors, and mixed topics, I would not trust one.
- Absolute reactions track the author's audience far more than length, so I would not compare across authors.

### Sourced guidance on LinkedIn post length

I found no peer-reviewed study and no LinkedIn guidance on ideal length. Sources conflict. Each figure below is tied to what I opened or what a search result reported.

| Source | Type | What it says | Basis and caveat |
|---|---|---|---|
| [LinkedIn Help, "Post and share updates"](https://www.linkedin.com/help/linkedin/answer/a528176) | Platform guidance | A post can be up to 3,000 characters. | Reported by a search result; I did not open the page. LinkedIn gives no ideal length. |
| [Hootsuite, "Social media post length, ideal sizes for each platform"](https://blog.hootsuite.com/ideal-social-media-post-length/) | Vendor blog (a social media management tool) | Aim to make the key message clear within the first 150 characters; "See more" cuts off around 140 characters; native video 30 to 90 seconds; LinkedIn articles 1,900 to 2,000 words. | I opened it. The 140 figure rests on a Shopify ad example; the video range has no source; the article figure comes from Paul Shapiro's analysis of 3,000+ top LinkedIn articles, which is articles, not posts. |
| [Supergrow, "How Long Should a LinkedIn Post Be?"](https://www.supergrow.ai/blog/how-long-should-a-linkedin-post-be) | Vendor blog (a LinkedIn scheduling tool); opinion, no dataset named | Standard posts 1,300 to 1,600 characters; over 2,000 characters sees a 35% engagement drop; video captions 500 to 800 characters; "See more" cutoff about 140 to 210. | I opened it. The page says "the data clearly shows" but names no dataset or method for any length figure. |
| [AuthoredUp, "LinkedIn video posts"](https://authoredup.com/blog/linkedin-video-posts) | Vendor study (a LinkedIn post-writing tool) | Video posts with captions of 20+ sentences got 1.13x the median reach of all video posts; captions under 5 sentences got 0.73x. | I opened it. The page does not state the dataset size or date range for the caption analysis. The 36,946-video dataset, March 2025 to February 2026, is cited for its video-length analysis. Published 2026-04-17, updated 2026-08-11. |
| AuthoredUp dataset of 372,126 posts, as reported by a search-result summary of vendor blogs | Vendor study, secondhand | Posts of 1,301 to 2,500 characters earned about 27% higher engagement than posts under 400 characters. | I did not open the original. Treat as unverified. |
| An unnamed guide quoting "LinkedIn's own analysis of 540,000 posts," as reported in search results | Unverified claim | Posts of 1,200+ characters get about 3x the engagement of shorter ones. | Could not trace to a LinkedIn publication. Do not cite as platform guidance. |
| A search-result blog on video ads | Opinion | Keep video captions under 500 characters. | Named only in a search summary; no dataset. |

Two readings follow, both qualified. First, the vendor guidance centers on roughly 1,000 to 2,000 characters (about 150 to 300 words) for standard posts, which is longer than Alex Hormozi and Leila Hormozi write in this set (median 258 and 355 characters). Their posts did well anyway, so those vendor ranges do not describe these authors. Second, for native video captions the sources disagree, from under 500 characters to 500 to 800 characters to 20+ sentences, and none is from LinkedIn. Nothing here supports a firm caption rule for Brett.

## Five patterns that recur most among the top performers

"Top performers" = the 15 posts at 1.3x or more of their author's median (entries 1, 3, 5, 6, 8, 13, 21, 23, 24, 29, 35, 37, 39, 44, 48), checked against the other 35.

1. **Narrative that opens mid-scene or in a dated moment, outcome withheld (Narratives, 10 of 50; 4 of the 15 top).** Examples: entries 13, 21, 24, 35. Line 1 gives a time, a place, or a plain scene and stops. Fits lane 10 as a Story meat if Brett has a documented story.
2. **A concrete figure in line 1 or line 2, often as a before and after (Ridiculous Results, 5 of 50; 3 of the 15 top).** Examples: entries 44 ($1.2 million to over $5 million, the top outlier at 6.94x), 48, 37. Eighteen of 50 carry a numeral in line 1; 8 of the 15 top do (3, 13, 21, 35, 37, 44, 48 and 8). This is the Celebrity component (3) doing the work. Fits lane 10 only with Brett's own documented figures.
3. **Plain admission or reversal in the first sentence (Admission, 7 of 50; 3 of the 15 top).** Examples: entries 23, 29, 39 ("I fired myself from my own company six times in two years," "I was burnt out," "I did EVERYTHING wrong"). The loss or mistake is stated with no cushioning. Fits lane 10.
4. **A short, flat claim that pushes against a belief, or an "If you... then" line (Provocative claims and Conditionals, 14 of 50; 4 of the 15 top, plus one flat Statement, entry 5).** Examples: entries 1, 3, 6, 8. The line stands alone with no setup. Entry 6 leads the set at 4.02x, but its "For anyone who needs to hear this" opener is the one part to leave out.
5. **A short first line with a second beat inside the fold (median line 1 is 63.5 characters; 44 of 50 are 88 characters or fewer).** Line 1 sets the situation and line 2 turns it or delivers the payoff, as in entries 33, 35, 44 ("Today it's worth over $5 million"). The turn lands above the roughly 140-character fold. Consistent with 4.3a item 13.

What did not recur among the top performers: Questions (1 of 50, entry 49, and it did not beat its author), Labels, and openers that announce the post ("Here's how," "Here are").

## Apify run (done 2026-10-29 on Brett's go)

Run pBQaIEkwGFZgCyjkq, dataset lGHcUlDqEFdg3REEh, 1,000 posts, about $2.00. The length findings are in "Length from the Apify run" above. The 50-hook table above has not yet been refreshed from this dataset; it still reflects the logged-out sample. The plan as written before the run:

This file reached 50 without Apify. The gaps an actor would close are repost counts, a verified top-posts ranking per author, 2025 to 2026 posts, and real media type (native video versus text) for the length question.

- **Actor:** harvestapi/linkedin-profile-posts ("LinkedIn Profile Posts Scraper (No Cookies)"). Store listing: https://apify.com/harvestapi/linkedin-profile-posts. Rated 4.4 from 55 ratings; 12,792 monthly users.
- **Price (BRONZE tier, from the Store listing):** $0.002 per post, $0.00005 per actor start. Reactions and comments are separate paid events and stay off.
- **Input:** `targetUrls` = the 10 profile URLs (the three Brett named, plus Ryan Serhant, Tom Ferry, Justin Welsh, Codie Sanchez, Nick Huber, Gary Vaynerchuk, Grant Cardone); `maxPosts` = 100; `includeReposts` = false; `scrapeReactions` = false; `scrapeComments` = false.
- **Estimated cost:** 10 profiles x 100 posts = 1,000 posts x $0.002 = $2.00, plus under $0.01 in start fees. A 3-profile run (the Hormozis and Dan Martell, 300 posts) would cost about $0.60. I did not confirm whether the output includes repost counts or a media-type field; I would check the actor's output schema (fetch-actor-details) before the run.
- **Run only on Brett's go.**
