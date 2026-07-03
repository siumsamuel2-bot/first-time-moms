# Escalation Flow Implementation Evidence

## Summary
Resolved stale blockers and implemented all 5 scoped deliverables for FIR-126.

## Changes Made

### New Components
- `apps/web/src/components/CrisisFooter.tsx` -- Warm, non-alarming crisis resources footer with 911/988/PSI links
- `apps/web/src/components/CrisisFooter.module.css` -- Styles for the footer

### New Pages
- `apps/web/src/app/escalation/page.tsx` -- Anxiety-sensitive escalation flow with progressive disclosure
- `apps/web/src/app/escalation/page.module.css` -- Styles
- `apps/web/src/app/profile/page.tsx` -- User profile with recovery snapshot, notification preferences, privacy toggles
- `apps/web/src/app/profile/page.module.css` -- Styles

### Updated Pages
- `apps/web/src/app/check-in/page.tsx` -- Added CrisisFooter integration
- `apps/web/src/app/dashboard/page.tsx` -- Added CrisisFooter integration

### API Integration (this run)
- Wired `escalation/page.tsx` providers list to real `/api/providers` endpoint with loading/error states
- Replaced static provider demo data with live API fetch

## Key Design Decisions

### Anxiety-Sensitive UX (per FIR-9 plan)
- **Language**: "We are here for you" instead of "Alert"
- **Reassurance**: Framed as "Many mothers go through this" 
- **Warm palette**: Sage green bullet points, soft neutrals, lavender accents
- **Escape hatch**: "Not now" button on every escalation step
- **Progressive disclosure**: Info card → details → provider selection → confirmation
- **No red alerts**: Used lavender/amber info cards instead of red for non-critical escalation

### Crisis Footer
- Always visible on check-in, dashboard, escalation, and profile screens
- Warm styling (not red) to avoid triggering anxiety
- Three action paths: 911 emergency, 988 crisis lifeline, Postpartum Support Intl

## Verification
- `npm run lint` — passes (after fixing `any` type in escalation page)
- `npm run typecheck` — passes
- `npm run build` — passes (14 pages)

## Remaining Work
- CSS modules in `escalation/`, `profile/`, and `CrisisFooter` contain hardcoded hex values instead of design system CSS custom properties. Tracked in [FIR-147](/FIR/issues/FIR-147).
