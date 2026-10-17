# UX Status Update — July 12, 2026

**To:** CEO
**From:** UX Designer

---

## UX Review of Engineering Implementation

Reviewed all 5 core pages built by the CTO against the wireframe specs. Found and fixed the following issues:

### Onboarding (`apps/web/src/app/onboarding/page.tsx`)
- **Added trigger warning** before EPDS mental health questions ("There are no wrong answers. If you are not ready, you can skip.")
- **Replaced simplified mood questions** with proper EPDS-5 (5 questions, 4-point scale matching the validated Edinburgh scale)
- **Added "Prefer not to say"** on every EPDS question + a "Skip all wellness questions" escape hatch
- **Added C-section auto-tagging** — emergency C-section automatically tags profile for higher-touch monitoring (internal only, no visual change)
- **Added check-in time screen** (step 4) with time picker and SMS backup toggle — matches wireframe
- **Fixed step order** to match wireframe: Welcome → Delivery → Feeding → Mental Health → Schedule → Consent → Complete
- **Added feeding follow-up** — if breastfeeding, shows "How is it going?" with support card for challenges
- **Added complications section** in delivery details with "None of the above" and tag-style inputs

### Escalation Flow (`apps/web/src/app/escalation/page.tsx`)
- **Added warm check-in step** (Screen 1) — starts with nurturing illustration and "We have noticed your recovery has been a bit tougher this week" — no clinical alarm language
- **Removed alarmist language** — replaced "maternal mental health specialist", "medical situation" with "postpartum support", "recovery pattern"
- **Added extended EPDS assessment** (Screen 2) — 5 questions with 4-point scale, "Prefer not to say" on each, progress dots
- **Added connection offer screen** (Screen 3) — "Based on what you have shared, we think you might benefit from talking with someone" — opt-in only
- **Added declined path** — "That is completely okay. We will check in again in a few days. You can always tap 'Get Support' from your dashboard."
- **Fixed provider flow** — uses "No thanks, not now" instead of back button
- **Added crisis screen** — "You matter." with warm tones (no red), 988 and 741741 links, clinician auto-notify note

### Daily Check-In (`apps/web/src/app/check-in/page.tsx`)
- **Added welcome screen** — "Good morning. Let's see how you are doing today. 2 minutes · 5 questions"
- **Replaced MoodSelector for sleep** with 0-8 hour selector with labeled ticks (hours of uninterrupted sleep)
- **Added EPDS-2 mood questions** (abbreviated) — matches wireframe spec for daily use
- **Added open comment field** — "Anything else you would like to share?" with 500 character limit
- **Added "Prefer not to say"** on physical comfort, sleep, and each mood question
- **Fixed escalation language** — removed "speak with someone", replaced with warm, supportive framing

### Clinician Dashboard (`apps/web/src/app/clinician/page.tsx`)
- **Added icons alongside severity colors** — RiskBadge now shows ⚠/▲/◆/● with text labels (color is never the sole indicator)
- **Completed referral modal** — provider dropdown, clinical note field, proper send flow (was a placeholder)
- **Added crisis auto-notify indicator** — patient detail shows clinician notification status

### Dashboard (`apps/web/src/app/dashboard/page.tsx`)
- **Added dismiss support** for escalation banner — user can dismiss and a subtle "Support available" card appears instead
- **Fixed escalation copy** — removed clinical language, uses warm "We noticed things have been a bit tougher this week"

---

## Design System Compliance Gaps

| Component | Needed Action |
|-----------|--------------|
| `EscalationBanner` in `apps/web/components/` | Consider replacing with `packages/design-system` version (5-tier system) |
| `ProviderCard` in `apps/web/components/` | Consider replacing with `WarmReferralCard` from design system (richer display) |
| `CrisisFooter` in `apps/web/components/` | Consider replacing with `CrisisEntryPoint` from design system |

The web app's local components are functional but do not use the escalation color palette (sage/amber/terracotta/berry/indigo/crisis) defined in the design system tokens.

---

## Next Steps

1. **Phase 1 concept validation** — Ready to recruit 8 mothers upon budget approval
2. **Mobile UI design review** — Need to review the React Native prototype against these updated flow fixes
3. **Provider matching UX** — The provider selection UI in escalation flow could benefit from `WarmReferralCard` with photos, ratings, and specialties
4. **HIPAA audit trail** — Confirm all clinician dashboard actions are logged to audit table

---

## Decisions Needed

| Decision | Recommendation |
|----------|----------------|
| **Phase 1 concept validation** | Can begin immediately with $14K budget |
| **Design system migration** | Move web app to use `packages/design-system` components? (~2 day engineering effort) |
| **Mobile escalation prototype** | Ensure React Native prototype matches these updated wireframes |

---

**Document Owner:** UX Designer
**Last Updated:** July 12, 2026
