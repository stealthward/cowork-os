# Supplier Contract Eval

**What "good" looks like before we sign.**

**Owner:** Dana Whitfield, Director of Procurement
**Used by:** the contract-review agent, on every inbound supplier contract
**Version:** 3.2 (updated August 2026)
**Pass bar:** weighted score of 4.0+, no single criterion below 3, zero auto-fails

---

## How to score

Score each criterion 1 to 5. Write your reasoning first, then the number.
If the contract is missing what you need, do not guess. Mark it "cannot assess" and escalate to Dana.

## The criteria

**1. Risk allocation (25%)**
A 5: every major risk sits with the party best able to control it, and liability caps are mutual and at least 2x annual contract value.
A 1: we carry uncapped exposure for things the supplier controls.

**2. Termination and exit (20%)**
A 5: we can exit for convenience on 60 days notice or less, with a written transition plan and no penalty after year one.
A 1: we are locked in with no exit short of supplier breach.

**3. Pricing and payment (20%)**
A 5: pricing is fixed for the initial term, increases are capped at CPI or 3% (whichever is lower), payment terms are net 45 or better.
A 1: the supplier can raise prices unilaterally mid-term.

**4. Data, IP, and confidentiality (15%)**
A 5: we own everything we put in and everything built for us, and the supplier may not use our data for anything beyond delivering the service.
A 1: ownership is silent or ambiguous on either point.

**5. Service levels and remedies (10%)**
A 5: SLAs are specific and measurable, with automatic credits we do not have to chase.
A 1: "commercially reasonable efforts" with no remedy attached.

**6. Renewal terms (10%)**
A 5: renewal requires our affirmative signature, at then-agreed pricing.
A 1: auto-renews for a full term unless we object inside a narrow window.

## Automatic fails (score is irrelevant, do not approve)

- Unlimited or uncapped liability on our side
- Supplier may use our data to train their models
- Governing law outside the US without prior legal sign-off
- Any clause surviving termination longer than 3 years, except confidentiality

## When a human steps in

Escalate to Dana before any recommendation if: contract value exceeds $250k, any criterion scores below 3, or any auto-fail triggers.

## Keeping this eval sharp

When a human reviewer disagrees with the agent's score, we fix this document, not just that one score. Every miss becomes a line in the next version.
