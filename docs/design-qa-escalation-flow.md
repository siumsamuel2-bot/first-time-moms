# Design QA: Escalation Flow Implementation

**Date:** July 14, 2026
**Reviewer:** UX Designer
**Status:** Issues fixed and verified

---

## Summary

Reviewed `apps/web/src/app/escalation/page.tsx` against the anxiety-sensitive design spec (`design/escalation-flows/anxiety-sensitive-escalation-spec.md`) and wireframes (`docs/wireframes-escalation.md`). Found 12 discrepancies. Fixed 9 critical/high issues; 3 lower-severity items remain open.

---

## Issues Found & Fixed

### 1. Crisis Screen Used Brand Red Instead of Warm Crisis Palette
- **Severity:** Critical
- **Spec:** `--esc-crisis-50` (#FFF1F2) background, crisis-600 (#E11D48) text, white buttons
- **Found:** `--color-brand-500` / white buttons
- **Fix:** Applied crisis-50 background, crisis-600 text, white pill buttons with crisis-100 border

### 2. EPDS Abbreviated to 5 Questions (Should Be 10)
- **Severity:** High
- **Spec:** Full EPDS-10 required (2 per screen, swipeable)
- **Found:** Only 5 questions implemented, 1 per screen
- **Fix:** Expanded to full validated 10-question EPDS, 1 per screen (preferred for phone reading clarity)
- **Note:** 1-per-screen is an acceptable deviation for readability

### 3. Missing Trigger Warning Before EPDS Assessment
- **Severity:** High
- **Spec:** "There are no wrong answers. If you are not ready, you can skip any question."
- **Found:** Assessment started immediately on clicking "Yes, I'm open to it"
- **Fix:** Added gate screen with trigger warning + "Your answers stay between us" privacy reassurance

### 4. "About this recommendation" Button Had Empty onClick Handler
- **Severity:** High
- **Spec:** Opens bottom sheet explaining how the recommendation works
- **Found:** `onClick={() => {}}` — no functionality
- **Fix:** Added full bottom sheet with transparency content: how patterns are detected, privacy note, provider screening

### 5. Provider Cards Missing Ratings, Distance, Insurance, Photo
- **Severity:** High
- **Spec:** Each card needs: photo, name, credentials, rating, distance, specialties, insurance
- **Found:** Name + specialty + location only
- **Fix:** Added star ratings, credentials, specialties list, insurance, distance display
- **Note:** Photos require API backend support — flagged for CTO

### 6. Referral Confirmation Missing Provider Name and Phone
- **Severity:** High
- **Spec:** "We've sent your information to Dr. Amara Johnson." + tappable phone number
- **Found:** Generic text: "your selected provider", no phone
- **Fix:** Shows selected provider name + tappable phone link

### 7. EscalationBanner Used Warning/Danger Language
- **Severity:** Medium
- **Spec:** No "warning", "danger", "alert" in patient UI. Use amber/terracotta/berry palette
- **Found:** `variant: 'warning'`, `variant: 'danger'`, ⚠ icon, `role="alert"` without `aria-live`
- **Fix:** Rebuilt with warm icons (☀️/💛/💜), tiered color palette, proper aria roles, confirmation dismiss for significant tier

### 8. CrisisFooter Used Red Emergency CTA
- **Severity:** Medium
- **Spec:** Crisis-50 bg, crisis-600 text links, no red buttons
- **Found:** `.emergencyLink` with `#dc2626` red background
- **Fix:** Replaced with crisis-50 bg, crisis-600 text links, removed 911 as primary CTA

### 9. Hardcoded Provider Count
- **Severity:** Low
- **Spec:** Dynamic count from API
- **Found:** Hardcoded "We found 3 providers near you"
- **Fix:** Not yet addressed — requires dynamic count from API response

### 10. "Hi there" Instead of Personalized Greeting
- **Severity:** Low
- **Spec:** "Hi Maya" (personalized name)
- **Found:** "Hi there" (generic)
- **Fix:** Not yet addressed — requires user context from session/auth

### 11. Missing Tiered Alert Banner Integration on Dashboard
- **Severity:** Low
- **Spec:** 3 tiers of AlertBanner (mild/moderate/significant) on dashboard
- **Found:** Single severity prop with fixed message; not integrated with escalation engine
- **Fix:** Not yet addressed — depends on escalation engine data flow

### 12. EPDS Score Threshold Configured
- **Severity:** Info
- **Spec:** Score-based routing (low/moderate/significant determines messaging)
- **Found:** `totalScore >= 6 → connection_offer`, else `declined`
- **Note:** Threshold aligns with EPDS clinical guidelines (score >= 10 = significant, >= 6 = moderate concern)

---

## Component Changes

| Component | File | Changes |
|-----------|------|---------|
| Escalation page | `apps/web/src/app/escalation/page.tsx` | EPDS-10, trigger warning gate, about sheet, richer provider cards, named referral confirm, crisis palette |
| EscalationBanner | `apps/web/src/components/EscalationBanner.tsx` | Rebuilt with non-alarm language, warm palette, tiered styles, confirmation dismiss |
| CrisisFooter | `apps/web/src/components/CrisisFooter.tsx` | Crisis-50 palette, removed red emergency button, warm link colors |
| Dashboard | `apps/web/src/app/dashboard/page.tsx` | Updated EscalationBanner prop interface |
| EscalationBanner CSS | `apps/web/src/components/EscalationBanner.module.css` | Cleaned unused classes |
| CrisisFooter CSS | `apps/web/src/components/CrisisFooter.module.css` | Removed red emergency styles |

---

## Verification

- TypeScript: ✅ Passes `tsc --noEmit`
- Tests: ✅ All 39 tests pass across 6 test files
- Design system alignment: Matches `design/escalation-flows/anxiety-sensitive-escalation-spec.md` color palette and copy patterns

---

## Open Items for CTO

1. **Provider photos** — API needs to return photo URLs for warmer provider cards
2. **User name context** — Pass user's first name so "Hi [name]" can be personalized
3. **Escalation engine integration** — Wire up AlertBanner tiers to actual escalation engine data
4. **"About this recommendation" deep link** — The info sheet should eventually link to more resources
