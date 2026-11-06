# Social audit: Facebook

_Platform file for the mandatory social content audit. Read with social-audit.md (shared core, window, cost, output). Built 2026-10-14._

**Role in the brand system** (Content Authority & Social Media Playbook 15): community dialogue, relationship maintenance, referral visibility.

## Pull

| Data | Actor | Listed price (2026-10-14) |
|---|---|---|
| Business Page posts and public personal-profile posts | apify/facebook-posts-scraper | $0.005 per post |

**Page and personal profile.** Many agents post mainly on a personal profile. Apify can pull a personal profile when the profile and its posts are set to public (Brett confirmed, 2026-10-14). Pull both the Page and the personal profile when both exist. If the actor will not take the profile URL, pick a profile actor with search-actors and log it. Posts limited to friends cannot be pulled: report the profile as not public, audit what is public, and add "Facebook personal profile (not public)" to Manual Review Priorities. Never log in to read a profile.

## What to look for

| # | Check | What good looks like |
|---|---|---|
| 1 | Page basics | Page name, category, about, and contact match the website and GBP; Page linked from the website |
| 2 | Active or abandoned | A Page with no posts in 180 days is a liability: report it as inactive with the last post date |
| 3 | Conversation | Comments and replies on posts; the agent answers; posts invite local dialogue |
| 4 | Community content | Local events, businesses, homeowner help, neighborhood news: the 75 side |
| 5 | Relationship maintenance | Client recognition, home anniversaries, thank-yous, life moments (Sphere of Influence) |
| 6 | Longer commentary | Market takes or stories with a point of view, not one-line listing shares |
| 7 | Video | Native video or Lives, and how observed engagement compares with links and images |
| 8 | Groups | Any local group the agent runs or visibly leads (note only; group content is not pulled) |

Failure modes to name: auto-posted Instagram crops, listing links with no comment, a Page that duplicates a dormant brokerage template.
