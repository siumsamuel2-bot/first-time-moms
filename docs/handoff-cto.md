# Design Handoff — CTO

## Overview

This document summarizes all UX/design deliverables and provides an implementation roadmap for the engineering team.

## Deliverables Created

| Artifact | Location | Description |
|----------|----------|-------------|
| UX Research | `docs/ux-research.md` | Personas (Maya Chen, Dr. Sarah Okonkwo), design principles, risk register |
| User Journeys | `docs/user-journeys.md` | 4 journey maps: Onboarding, Daily Check-In, Escalation, Clinician Review |
| Design System Doc | `docs/design-system.md` | Brand voice, color palette, typography, spacing, shadows, micro-interactions |
| Wireframes: Onboarding | `docs/wireframes-onboarding.md` | 6 screens with specs, edge cases, state transitions |
| Wireframes: Check-In | `docs/wireframes-daily-checkin.md` | 7 screens with specs, question logic, escalation triggers |
| Wireframes: Escalation | `docs/wireframes-escalation.md` | 6 screens (warm → assessment → referral → crisis) |
| Wireframes: Clinician | `docs/wireframes-clinician-dashboard.md` | 5 screens (login → dashboard → patient detail → referral modal → message modal) |
| Design System Package | `packages/design-system/` | Tailwind config, design tokens, 7 React components |
| Tailwind Config | `apps/web/tailwind.config.ts` | Extends design system config |
| PostCSS Config | `apps/web/postcss.config.js` | Tailwind + autoprefixer |
| CSS Foundation | `packages/design-system/src/styles.css` | Base styles, component classes, utilities |

## Component Inventory

| Component | File | States | Notes |
|-----------|------|--------|-------|
| Button | `packages/design-system/src/components/Button.tsx` | default, hover, active, disabled, focus | 5 variants, 4 sizes, fullWidth option |
| Card | `packages/design-system/src/components/Card.tsx` | default, elevated | CardHeader, CardTitle, CardDescription sub-components |
| ProgressBar | `packages/design-system/src/components/ProgressBar.tsx` | determinate | 2 sizes, optional percentage label |
| Slider | `packages/design-system/src/components/Slider.tsx` | default, active | Label + optional min/max labels, tabular-nums value |
| OptionSelect | `packages/design-system/src/components/OptionSelect.tsx` | selected, unselected | Icon support, vertical or grid layout, radio indicator |
| BottomSheet | `packages/design-system/src/components/BottomSheet.tsx` | open, closed | Overlay + handle, scrollable body, slide-up animation |
| Toast | `packages/design-system/src/components/Toast.tsx` | visible (auto-dismiss) | 3 types (success, info, warning) |

## Implementation Priority

### Phase 1 — Core UX (Current Sprint)
1. Set up Tailwind in `apps/web` — config + CSS import in `layout.tsx`
2. Implement onboarding flow (`/onboarding/page.tsx`)
   - Wire up onboarding state machine (`packages/shared/src/onboarding.ts` needs implementation)
   - 6 screens using OptionSelect, Slider, ProgressBar, Button
   - Save profile to DB via API on completion
3. Implement dashboard shell (`/dashboard/page.tsx`)
   - Shows user info, next check-in time, support card (if applicable)

### Phase 2 — Daily Check-In
4. Implement check-in flow (`/check-in/page.tsx`)
   - Dynamic questions based on profile type
   - POST to `/api/check-in` on completion
   - Handle escalation trigger response
5. Push notification setup (Expo push for mobile, browser push for web)

### Phase 3 — Escalation & Provider
6. Warm check-in + extended assessment screens
7. Provider matching flow with real provider data
8. Crisis screen with hotline numbers

### Phase 4 — Clinician Dashboard
9. Authentication flow (NextAuth)
10. Patient dashboard with severity sorting
11. Patient detail view with trend charts
12. Warm referral + messaging modals

### Phase 5 — Mobile
13. Scaffold `apps/mobile/` with Expo
14. Reuse shared types from `packages/shared`
15. Reuse design tokens from `packages/design-system`

## Key UX Requirements Engineering Must Follow

1. **Never use clinical alarm language** in patient-facing UI. No "depression", "disorder", "warning", "danger". Use "recovery pattern", "tough week", "support", "connection".
2. **Touch targets ≥ 44x44px** on all interactive elements.
3. **Body text never below 16px** on mobile (prevents zoom).
4. **"Prefer not to say"** on every sensitive question.
5. **Partial save** on onboarding — if user closes mid-flow, resume from last step.
6. **Color is never the sole indicator** — always pair with text labels and icons.
7. **Audit log** every clinician action for HIPAA compliance.
8. **EPDS score ≥ 10** = internal flag only, no visual change for the patient.

## Missing Implementations to Coordinate

| Gap | Owner | Blocking |
|-----|-------|----------|
| `packages/shared/src/onboarding.ts` — stub only, needs state machine logic | Engineering | Onboarding flow |
| `apps/web/src/app/(api)/auth/[...nextauth]/route.ts` — empty directory | Engineering | Auth |
| `apps/mobile/` — empty directory | Engineering | Phase 5 |

## Design Review Process

1. Engineering implements screens from wireframe blueprints
2. QA on staging at each phase milestone
3. UX review: visual fidelity, accessibility, copy, micro-interactions
4. User testing with pilot participants
