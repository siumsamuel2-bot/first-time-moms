# Onboarding Opt-In Consent Language — De-Identified Data Use

**Reviewer:** CMO
**Date:** June 18, 2026
**Status:** Reviewed — implementation-ready
**IRB Requirement:** FIR-68 / FIR-64

---

## Reviewed Language (for onboarding UI)

### Screen Title: Help Improve Postpartum Care

**Headline:** Share your data anonymously to help other moms

**Body:**

Firstweeks is committed to improving postpartum recovery for all mothers. With your permission, we may use your check-in data in de-identified, aggregate form for:

- **Research publications** that advance postpartum care knowledge
- **Quality improvement reports** shared with participating OB-GYN practices
- **Product improvements** that make Firstweeks better for everyone

**What this means for you:**

- We remove your name, contact info, and any identifying details before use
- We only share grouped, de-identified trends — never individual responses
- Your data is processed per HIPAA Safe Harbor standards (no 18 identifiers)
- Your individual data is never sold to third parties

**Your choice:**

- ✅ **Yes, I consent** — You can withdraw at any time from Settings > Privacy
- ❌ **No, thanks** — You'll still get full app functionality. No impact on your experience.

Withdrawing consent removes future data from our research pipeline. Data already used in completed aggregate analyses cannot be retroactively removed.

> You can change this anytime in Settings > Privacy. Questions? Contact compliance@firstweeks.health.

**Two buttons:**
- `I Consent — Help Improve Care`
- `No Thanks — Skip This`

---

## Where This Language Appears

1. **Onboarding flow** — After `feeding` step, before `complete`
2. **Settings > Privacy** — Toggle to withdraw consent at any time
3. **Consent form template** (docs/consent-form-template.md) — Updated for study participants

---

## Coverage of IRB Requirements

| Requirement | Covered | Location |
|---|---|---|
| De-identified data may be used in aggregate research products | Yes | "Research publications", "Quality improvement reports", "grouped, de-identified trends" |
| No individual-level data is shared | Yes | "never individual responses", "We remove your name, contact info, and any identifying details" |
| Users can withdraw consent at any time | Yes | "You can withdraw at any time from Settings > Privacy" + Settings toggle |

---

## Recommendations

1. **Legal review** — This language should be reviewed by legal counsel before going live
2. **Withdrawal mechanism** — Settings > Privacy toggle must be implemented (CTO ticket needed)
3. **Consent audit trail** — Store consent timestamp + version + user decision in user profile for IRB audit
4. **Future contact** — If institutional buyers require broader data use, a new consent screen must be presented; this language covers Firstweeks' own product/research use only

---

## References

- [FIR-64: Obtain IRB exempt determination](/FIR/issues/FIR-64)
- [IRB Strategy Memo](/marketing/institutional/irb-strategy-memo.md)
- [HIPAA Summary](/outreach/obgyn-pilot/materials/hipaa-summary.md)
- [Data Dictionary](/marketing/institutional/data-dictionary.md)
- [FIR-68: Review user consent language](/FIR/issues/FIR-68)
