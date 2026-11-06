# Email Comms

_Read this when drafting an email or working in your inbox: replies, drafts, outbound, signature behavior, and formatting decisions. It contains the rules that apply only to email. It does NOT contain the cross-channel structure and decision rules, which live in `Comms HQ/CLAUDE.md` (Vertical Flow Structure, the pre-delivery scan, and the cross-channel guardrails all apply to email too). For the cross-workstation guardrail prohibiting Gmail drafts by default, see `00_Reference/Governance Rules - Communication.md` > Operational Guardrails. For universal voice, see `00_Reference/Voice Principles.md`._

---

## Email-Specific Tone Rules

_Your base tone lives in `00_Reference/Voice Principles.md`. These are the email-specific additions that layer on top._

- **Emojis, sparingly but naturally.** One emoji per email maximum, usually to soften a potentially awkward point: a sheepish emoji after admitting a scheduling mistake, a wink after a lighthearted aside. Never decorative.
- **Exclamation marks are common and genuine.** "Thanks!" and "Thanks!!" and exclamation marks in positive contexts are part of your warmth, not over-enthusiasm.
- **Humor when appropriate.** Light jokes and asides are fine, especially with people you know well. Parenthetical notes that show a bit of personality are welcome.
- **Numbered lists for options or sequences.** When presenting options or steps, use a numbered list. When giving context, use short paragraphs or bullets.

---

## Email-Only Behaviors

These apply only to email drafts. Cross-channel versions of similar behaviors live in `Comms HQ/CLAUDE.md` > Operating Rules.

- **Acknowledge a long email up front.** When an email runs long, open with a brief flag: "(apologies in advance for a longer email)."
- **Scheduling emails stay narrow.** The email's job is to get the meeting booked and set the agenda. Save strategy questions and open-ended prompts for the meeting itself. Don't pad with items that dilute the ask.

---

## Email Formatting

- **Match the destination's paste behavior.** Deliver email drafts as rendered text in chat, not inside a fenced code block. Bolding and links must survive the copy-paste into your compose window; a code block pastes literal markers instead.
- **Include and hyperlink available links.** When an email references an existing document, form, deliverable, or resource, hyperlink descriptive text directly to the source. Don't omit a known link to manage the recipient's review behavior; control the framing in the sentence around the link instead.
- **Embed text deliverables inline.** When an email includes a text deliverable the recipient will read or copy-paste elsewhere (a bio, an agenda, talking points, a blurb), include it in the body with clear delimiters (e.g., `== Title ==` / `== End ==`). Don't force them to open a separate attachment for text. Attachments are for binary files (images, PDFs, spreadsheets); text goes in the body.
- **Bold the key ask as a standalone line.** When the email has one clear action item, bold it and give it its own paragraph so it's impossible to miss on a skim. Don't bury the ask inside a paragraph of supporting details.
- **Segment context header for targeted sends.** When an email targets a specific subset of recipients rather than your full list, add a one-line context header above the greeting explaining why this reader is receiving it: "You're receiving this because you signed up for [X]." This orients the reader and reduces confused replies.
- **One thought, one paragraph.** Use line breaks between every distinct thought. Each topic shift, new piece of information, and ask gets its own short paragraph. Emails get read on phones; dense paragraphs get skimmed. When in doubt, break.
- **Use exact page or document names when referencing them.** When a draft references a specific document or page, use the full title exactly as it appears so the recipient can locate it. Don't abbreviate or paraphrase.
- **Structured data as bullet lists.** When a draft includes field-value pairs (banking details, addresses, event logistics), present each field as its own bullet, not as bold labels on consecutive lines. Bullets survive copy-paste with line breaks intact; consecutive bold lines often collapse into a single paragraph.
- **Signature behavior.** If your email client auto-appends a signature block to every outbound message, don't add one manually in the draft body, or you'll get duplication and formatting mismatches. The draft body ends at "Thanks!".

---

## Email-Specific Context Patterns

**Payment / invoicing emails:** brief and direct. "Please see attached for the invoice for [X]." No fluff.

**Thread naming convention (optional).** For ongoing relationships, a "Name x Name | Year Quarter" subject format keeps threads easy to find (e.g., "You x [NAME] | 2026 Q1 Thread"). Start a new thread when the topic shifts materially.

---

_This file was installed from Jeff Su's Cowork Academy AI Command Center template. When you revise this file, add a dated note here: `[YYYY-MM-DD] what changed`._
