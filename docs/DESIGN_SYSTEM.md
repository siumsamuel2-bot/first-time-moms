# Firstweeks Design System

## Design Tokens

All tokens are defined as CSS custom properties in `apps/web/src/app/globals.css`.

### Brand Colors
| Token | Value | Usage |
|---|---|---|
| `--color-brand-500` | `#4a8f64` | Primary buttons, links, active states |
| `--color-brand-50` | `#f0f7f4` | Light brand backgrounds |
| `--color-brand-700` | `#315d43` | Strong text on brand bg |

### Semantic Colors
| Token | Usage |
|---|---|
| `--color-danger-*` | Escalation (critical alerts) |
| `--color-warning-*` | Medium-severity alerts |
| `--color-info-*` | Support/informational banners |
| `--color-success-*` | Positive affirmations |

### Typography
- **Font**: `Inter` (sans-serif) for UI; `Georgia` (serif) reserved for content
- **Scale**: `xs`(0.75rem) through `3xl`(1.875rem)

### Spacing
4-step scale: 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4rem

---

## Components

All in `apps/web/src/components/`.

### Button
- Variants: `primary`, `secondary`, `ghost`, `danger`
- Sizes: `sm`(2rem), `md`(2.5rem), `lg`(3rem)
- Supports `isLoading` state with spinner

### Card
- Variants: `default` (bordered), `elevated` (shadow), `warning`, `info`
- Sub-components: `CardHeader`, `CardBody`, `CardFooter`

### StepIndicator
- Multi-step progress for onboarding
- States: `upcoming`, `active`, `complete`

### QuestionCard
- Radio/multi-select input for recovery questions
- Supports `emoji`, `radio`, `scale` display modes

### MoodSelector
- 5-point emoji mood scale (Very Low → Great)
- Used in onboarding baseline and daily check-ins

### EscalationBanner
- Severity levels: `low`(info), `medium`(warning), `high`(warning), `critical`(danger)
- Action button for provider referral flow
- Designed to inform without causing panic

### ProviderCard
- Warm referral display with name, specialty, availability badge
- "Request contact" CTA for warm handoff

### ProgressBar
- Animated fill bar with label + percentage

---

## Page Routes

| Route | File | Description |
|---|---|---|
| `/` | `page.tsx` | Landing page with nav |
| `/onboarding` | `onboarding/page.tsx` | Multi-step profile setup |
| `/check-in` | `check-in/page.tsx` | Daily mood + PHQ-2 + recovery questions |
| `/dashboard` | `dashboard/page.tsx` | User home with escalation + providers |
| `/clinician` | `clinician/page.tsx` | OB-GYN flagged patient review |

---

## UX Design Decisions

### Emotional Safety
- Escalation banners use supportive language ("We notice things have been tough") — no alarmist phrasing
- Mood scale uses emoji + text (not numbered scales) to feel less clinical
- All clinical questions (PHQ-2) are framed conversationally

### Onboarding Sensitivity
- Mental health questions include "There are no wrong answers" framing
- Complications section is optional with "None of the above" option
- Progress indicator shows step progression for predictability

### Escalation Flow
- Daily check-in scores are computed but not shown to the mother — only the support response
- Provider matching is presented as "warm referral" (opt-in, not push)
- Clinician dashboard shows severity badges + expandable patient details
- 5+ consecutive flags triggers dashboard highlight for clinician review

### Accessibility
- All interactive elements use `aria-pressed` / `aria-label`
- Progress bars use `role="progressbar"`
- Color is never the sole differentiator (text labels accompany severity)
- Focus states use brand-colored rings
