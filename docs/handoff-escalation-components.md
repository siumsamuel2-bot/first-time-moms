# Handoff: Escalation UI Components

**Issue:** FIR-87 — Component library additions for escalation UI
**Designer:** UX Designer
**Date:** 2026-07-07

---

## Summary

Five escalation components added to `@firstweeks/design-system` (`packages/design-system/src/components/`). All components use the escalation color palette defined in `tokens.ts` and `tailwind.config.ts`. Build and typecheck pass clean.

---

## Components

### 1. EscalationBanner (`EscalationBanner.tsx`)

**Rewritten** with 5-tier system using CVA variants:

| Tier | Tailwind Classes | Visual | Use Case |
|------|-----------------|--------|----------|
| `ambient` | `bg-esc-sage-50 border-esc-sage-100` | Sage bg | No concern, positive reinforcement |
| `nudge` | `bg-esc-amber-50 border-esc-amber-100` | Amber bg | 1-2 days pattern |
| `elevated` | `bg-esc-terracotta-50 border-esc-terracotta-100` | Terracotta bg | 3-4 days pattern |
| `urgent` | `bg-esc-berry-50 border-esc-berry-100` | Berry bg | 5+ days pattern |

Props include: `title`, `description`, `actionLabel`/`onAction`, `secondaryLabel`/`onSecondary`, `showClinicianNote`, `dismissible`/`onDismiss`.

### 2. GuidedReflection (`GuidedReflection.tsx`)

3-question max mini-assessment with progressive disclosure. Full-screen flow:

- Progress dots at top (3 steps)
- One question per screen with emoji/slider/YN controls passed as `children`
- `onAnswer` render prop for custom question types
- "Prefer not to say" on every screen
- `onComplete(answers)` returns `Record<string, string>`
- `onSkip` / `onPreferNotToSay` callbacks

### 3. WarmReferralCard (`WarmReferralCard.tsx`)

Provider matching card with screened provider info:

- Photo circle (initials fallback), name, credentials, star rating
- Specialty badges, insurance text, distance
- "Request Contact" button with sent state
- `onRequestContact(providerId)` / `onViewDetails(providerId)` callbacks

### 4. CrisisEntryPoint (`CrisisEntryPoint.tsx`)

Dedicated safety flow — no reds, no alarm language:

- Heart+shield SVG illustration
- "You matter." headline (self-harm) or "Immediate support resources" (footer entry)
- Call 988 (tel:) and Text HOME (sms:) buttons
- Optional clinician-notified note
- "I understand, return to dashboard" dismiss

### 5. ReassuranceLoop (`ReassuranceLoop.tsx`)

Validated + next step + escape hatch pattern. Supports 5 kinds via `kind` prop:

| Kind | When Used |
|------|-----------|
| `post-submission` | After reflection/referral completion |
| `next-day-followup` | Next-day check-in post escalation |
| `milestone` | After 3 days of positive check-ins |
| `positive-checkin` | Daily check-in completion (no concern) |
| `provider-followup` | Provider referral follow-up loop |

Each kind has a primary action, optional secondary, and escape hatch.

---

## Design Token Changes

Added `escalation` palette to `tokens.ts`:

```
slate {50, 100, 200, 600, 800}, sage {50, 100, 500},
terracotta {50, 100, 500}, amber {50, 100, 500},
indigo {50, 100, 500}, berry {50, 100, 500},
crisis {50, 100, 600, icon}
```

Tailwind classes: `esc-slate-*`, `esc-sage-*`, `esc-terracotta-*`, `esc-amber-*`, `esc-indigo-*`, `esc-berry-*`, `esc-crisis-*`

---

## Animation Classes Added

| Class | Keyframe | Duration |
|-------|----------|----------|
| `animate-slide-down` | Slide 8px + fade | 300ms ease-out |
| `animate-scale-in` | Scale 0.98→1 | 400ms ease-out |
| `animate-fade-in` | Opacity 0→1 | 200ms ease-out |
| `animate-shimmer` | BG position sweep | 1.5s infinite linear |

---

## Reference Spec

Full detailed spec with color tokens, copy patterns, progressive disclosure, notification timing, and accessibility requirements: `design/escalation-flows/anxiety-sensitive-escalation-spec.md`
