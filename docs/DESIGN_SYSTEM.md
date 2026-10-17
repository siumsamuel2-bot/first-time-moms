# Firstweeks Design System

**Status:** V2 — Single authoritative source  
**Implementation:** `packages/design-system/`  
**Docs:** `docs/design-system.md` (visual foundation), `design/escalation-flows/` (escalation components)  
**Last updated:** 2026-07-13

---

## Design Philosophy

Firstweeks' visual language communicates **warmth, credibility, and calm**. Every pixel reduces anxiety for exhausted new mothers and builds trust with clinical providers.

| Attribute | Meaning |
|-----------|---------|
| **Warm** | Nurturing, supportive, never clinical or cold |
| **Trustworthy** | Evidence-based, credible, transparent |
| **Calm** | Reduces anxiety, never creates urgency or alarm |
| **Empowering** | Builds confidence, celebrates progress |

---

## Brand Voice

| Context | Tone | Example |
|---------|------|---------|
| Onboarding | Warm, welcoming, informative | "Welcome to Firstweeks — your postpartum recovery partner." |
| Daily check-in | Gentle, conversational | "Good morning, Maya. Let's see how you're doing today." |
| Escalation | Calm, supportive, action-oriented | "We've noticed things have been a bit tougher this week. You're not alone." |
| Provider referral | Warm, empowering | "Here are 3 providers near you who specialize in postpartum support." |
| Clinician dashboard | Professional, clear, efficient | "5 patients need attention." |

### Words to avoid (patient-facing)
depression, disorder, warning, danger, alert, abnormal, failed, wrong

### Words to prefer
tough week, recovery pattern, support, connection, gentle, noticing, check-in, feeling unlike yourself

---

## Foundation (Visual Design)

See `docs/design-system.md` for complete foundation documentation:

- **Color palette**: Rose (primary), Sage (secondary), Warm (neutrals), Lavender/Amber/Coral (functional)
- **Escalation palette**: Esc-slate, esc-sage, esc-terracotta, esc-amber, esc-indigo, esc-berry, esc-crisis
- **Typography**: Inter, 7-step scale (xs 12px → 3xl 30px)
- **Spacing**: 4px base unit, 10-step scale (1→16)
- **Border radius**: sm 6px, md 10px, lg 16px, full 9999px
- **Shadows**: card, elevated, modal
- **Icons**: lucide-react, 24px stroke-width, rounded/soft style
- **Motion**: 3 animation classes (slide-down, scale-in, fade-in, shimmer)

### Token Implementation
- Design tokens: `packages/design-system/src/tokens.ts`
- Tailwind config: `packages/design-system/tailwind.config.ts`
- CSS custom properties: `apps/web/src/app/globals.css`

---

## Component Library

All components live in `packages/design-system/src/components/` and are exported from `packages/design-system/src/index.ts`.

### General Components

| Component | File | Variants |
|-----------|------|----------|
| Button | `Button.tsx` | primary, secondary, ghost, danger; sm/md/lg |
| Card | `Card.tsx` | default, elevated; CardHeader, CardTitle, CardDescription |
| ProgressBar | `ProgressBar.tsx` | sm/md; role="progressbar" |
| Slider | `Slider.tsx` | 0-8 hour scale with labeled ticks |
| OptionSelect | `OptionSelect.tsx` | radio-style with icon/emoji support |
| BottomSheet | `BottomSheet.tsx` | slide-up, 70% height, backdrop blur |
| Toast | `Toast.tsx` | info, success, warning; auto-dismiss |

### Escalation-Specific Components

| Component | File | Purpose |
|-----------|------|---------|
| EscalationBanner | `EscalationBanner.tsx` | 5-tier severity banner (ambient/nudge/elevated/urgent/crisis) |
| GuidedReflection | `GuidedReflection.tsx` | 3-question mini-assessment with progressive disclosure |
| WarmReferralCard | `WarmReferralCard.tsx` | Provider matching with photo, credentials, ratings |
| CrisisEntryPoint | `CrisisEntryPoint.tsx` | Crisis safety flow — warm tones, 988/741741 links |
| ReassuranceLoop | `ReassuranceLoop.tsx` | Post-escalation warmth (5 patterns) |

See `docs/handoff-escalation-components.md` for escalation component specs and `design/escalation-flows/anxiety-sensitive-escalation-spec.md` for state-by-state behavior.

---

## Page Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `page.tsx` | Landing page |
| `/onboarding` | `onboarding/page.tsx` | Multi-step profile setup (7 steps) |
| `/check-in` | `check-in/page.tsx` | Daily check-in with adaptive questions |
| `/dashboard` | `dashboard/page.tsx` | User home with escalation + providers |
| `/escalation` | `escalation/page.tsx` | 5-layer progressive disclosure escalation |
| `/profile` | `profile/page.tsx` | User profile, recovery snapshot, privacy |
| `/clinician` | `clinician/page.tsx` | OB-GYN dashboard for flagged patient review |

---

## Accessibility

- WCAG AA contrast (4.5:1 text, 3:1 large text)
- Touch targets minimum 44x44px (56x56px for emoji buttons)
- Screen reader: `role="alert"`, `role="alertdialog"`, `role="radiogroup"`, `aria-live="polite"`
- Focus management: auto-focus banners, trap focus in crisis dialog
- Respects `prefers-reduced-motion`: all animations become instant
- Reading level: target grade 6-8 (Flesch-Kincaid)
- Maximum 3 decisions per screen

---

## File Map

| Artifact | Path |
|----------|------|
| This document | `docs/DESIGN_SYSTEM.md` |
| Visual foundation | `docs/design-system.md` |
| Escalation UX research | `design/research/anxiety-sensitive-escalation-ux.md` |
| Escalation component spec | `design/escalation-flows/anxiety-sensitive-escalation-spec.md` |
| Escalation flow diagrams | `design/escalation-flows/escalation-5-layer-flow-diagrams.md` |
| Escalation component handoff | `docs/handoff-escalation-components.md` |
| CTO handoff | `docs/handoff-cto.md` |
| Wireframes: onboarding | `docs/wireframes-onboarding.md` |
| Wireframes: daily check-in | `docs/wireframes-daily-checkin.md` |
| Wireframes: escalation | `docs/wireframes-escalation.md` |
| Wireframes: clinician dashboard | `docs/wireframes-clinician-dashboard.md` |
| User journeys | `docs/user-journeys.md` |
| User testing plan | `docs/user-testing-plan.md` |
| UX research | `docs/ux-research.md` |
| Design tokens | `packages/design-system/src/tokens.ts` |
| Tailwind config | `packages/design-system/tailwind.config.ts` |
| Components | `packages/design-system/src/components/` |
