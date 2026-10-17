# Anxiety-Sensitive Escalation — Design Specification

**Document Type:** Engineering Specification
**Status:** Draft
**Applies To:** Patient-facing mobile/web app, clinician dashboard
**Designer:** UX Designer
**Last Updated:** 2026-07-07

---

## Table of Contents

1. Color Tokens — Escalation Palette
2. Component: AlertBanner — States & Behavior
3. Component: GuidedReflection — States & Behavior
4. Component: WarmReferralCard — States & Behavior
5. Component: CrisisEntryPoint — States & Behavior
6. Copy Patterns — Tone Guidelines
7. Progressive Disclosure Layer Specs
8. Notification Timing Rules
9. Reassurance Loop Patterns
10. Accessibility Requirements

---

## 1. Color Tokens — Escalation Palette

The escalation palette sits alongside the main brand palette (Rose/Sage/Warm). No reds are used in patient-facing escalation UI. Reds are reserved exclusively for the clinician dashboard.

### Token Definitions

| Token | Hex | Role | Usage |
|-------|-----|------|-------|
| `--esc-slate-50` | `#F1F5F9` | Background | Default escalation card bg, neutral state |
| `--esc-slate-100` | `#E2E8F0` | Border | Card borders, dividers on escalation cards |
| `--esc-slate-200` | `#CBD5E1` | Muted | Secondary text on escalation cards |
| `--esc-slate-600` | `#475569` | Text | Body copy on escalation cards |
| `--esc-slate-800` | `#1E293B` | Heading | Headlines on escalation cards |
| `--esc-sage-50` | `#F0FDF4` | Background | Mild concern tier card bg |
| `--esc-sage-100` | `#DCFCE7` | Border | Mild concern card border |
| `--esc-sage-500` | `#22C55E` | Accent | Mild concern indicator dot, icon |
| `--esc-terracotta-50` | `#FEF2F0` | Background | Moderate concern tier card bg |
| `--esc-terracotta-100` | `#FEE2DE` | Border | Moderate concern card border |
| `--esc-terracotta-500` | `#E07A5F` | Accent | Moderate concern indicator dot, icon |
| `--esc-amber-50` | `#FFFBEB` | Background | Mild nudge, check-in pattern notice |
| `--esc-amber-100` | `#FEF3C7` | Border | Nudge card border |
| `--esc-amber-500` | `#F59E0B` | Accent | Nudge indicator dot |
| `--esc-indigo-50` | `#EEF2FF` | Background | Provider matching cards |
| `--esc-indigo-100` | `#E0E7FF` | Border | Provider card border |
| `--esc-indigo-500` | `#6366F1` | Accent | Provider CTA, referral badge |
| `--esc-berry-50` | `#FDF2F8` | Background | Significant concern tier card bg |
| `--esc-berry-100` | `#FCE7F3` | Border | Significant concern card border |
| `--esc-berry-500` | `#EC4899` | Accent | Significant concern indicator, icon |
| `--esc-crisis-50` | `#FFF1F2` | Background | Crisis resource footer bg |
| `--esc-crisis-100` | `#FFE4E6` | Border | Crisis resource card border |
| `--esc-crisis-600` | `#E11D48` | Text | Crisis hotline number (only text, no bg) |
| `--esc-crisis-icon` | `#BE123C` | Icon | Crisis heart-shield icon fill |

### Palette Visualization by Severity

```
Normal / No concern    → Sage-50 bg, Sage-500 accent
Mild nudge (1-2d)     → Amber-50 bg, Amber-500 accent
Moderate (3-4d)       → Terracotta-50 bg, Terracotta-500 accent
Significant (5+d)     → Berry-50 bg, Berry-500 accent
Provider referral     → Indigo-50 bg, Indigo-500 accent
Crisis                → Crisis-50 bg, Crisis-600 text
```

### Implementation

Add to `packages/design-system/src/tokens.ts`:
```ts
export const escalationColors = {
  slate: { 50: '#F1F5F9', 100: '#E2E8F0', 200: '#CBD5E1', 600: '#475569', 800: '#1E293B' },
  sage:  { 50: '#F0FDF4', 100: '#DCFCE7', 500: '#22C55E' },
  terracotta: { 50: '#FEF2F0', 100: '#FEE2DE', 500: '#E07A5F' },
  amber:  { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B' },
  indigo: { 50: '#EEF2FF', 100: '#E0E7FF', 500: '#6366F1' },
  berry:  { 50: '#FDF2F8', 100: '#FCE7F3', 500: '#EC4899' },
  crisis: { 50: '#FFF1F2', 100: '#FFE4E6', 600: '#E11D48', icon: '#BE123C' },
}
```

---

## 2. Component: AlertBanner

A contextual banner that appears at the top of the dashboard or check-in completion screen when the escalation engine detects a pattern.

### Visual Structure

```
┌──────────────────────────────────────────┐
│ [icon]  Headline text                     │
│         Supporting body text (optional)   │
│         [Primary CTA]  [Ghost link]       │
│                          [× dismiss]      │
└──────────────────────────────────────────┘
```

### States

#### State: Default (Mild Nudge — Tier 1)

| Property | Value |
|----------|-------|
| Background | `--esc-amber-50` |
| Border | `--esc-amber-100`, 1px, radius `--radius-md` |
| Icon | `Sun` (lucide), `--esc-amber-500` fill, 20px |
| Headline | 16px, `--esc-slate-800`, weight 600 |
| Body | 14px, `--esc-slate-600`, weight 400 |
| CTA | `primary` button variant, brand color |
| Dismiss | X icon, `--esc-slate-200`, 32x32px touch target |
| Animation | Fade in 300ms ease-out, slide down 8px |
| Persistence | Dismissible. Removes from view on dismiss. Reappears if new data triggers same tier within 24h. |

#### State: Moderate Concern (Tier 2)

| Property | Value |
|----------|-------|
| Background | `--esc-terracotta-50` |
| Border | `--esc-terracotta-100`, 1.5px, radius `--radius-md` |
| Icon | `Heart` (lucide), `--esc-terracotta-500` fill, 20px |
| Headline | 16px, `--esc-slate-800`, weight 600 |
| Body | 14px, `--esc-slate-600`, weight 400 |
| CTA | `primary` button variant, brand color |
| Secondary link | "Not right now" — ghost button |
| Dismiss | X icon, `--esc-slate-200`, 32x32px touch target |
| Animation | Fade in 300ms ease-out, slide down 8px |
| Persistence | Dismissible. Returns in 24h if escalation pattern continues. |

#### State: Significant Concern (Tier 3)

| Property | Value |
|----------|-------|
| Background | `--esc-berry-50` |
| Border | `--esc-berry-100`, 2px, radius `--radius-md` |
| Icon | `Shield` (lucide), `--esc-berry-500` fill, 24px |
| Headline | 18px, `--esc-slate-800`, weight 600 |
| Body | 15px, `--esc-slate-600`, weight 400 |
| CTA | `primary` button — "Talk to someone who can help" |
| Secondary | "I'll think about it" — ghost button |
| Notes | "A clinician has been notified" (subtle, small, 13px `--esc-slate-200`) |
| Dismiss | Available but gently discouraged: shows a confirmation sheet "Are you sure? Support is available." |
| Animation | Fade in 400ms ease-out, scale 0.98→1 |
| Persistence | Persists until user takes action OR dismisses with confirmation. Pushes to top of dashboard. |

#### State: Crisis (Self-Harm Flag)

This is NOT rendered as a banner. See CrisisEntryPoint component below.

#### Empty State

No escalation = no banner. Dashboard shows "You're doing great — check in again tomorrow" card instead.

#### Error State

If escalation engine fails to compute:
- Fallback: show generic "How are you feeling today?" card (same visual as empty state)
- Log error silently, no user-facing error
- Retry on next check-in completion

#### Loading State

When fetching escalation status:
- Skeleton placeholder: 60px tall, `--warm-100` bg, rounded `--radius-md`, shimmer animation (300ms loop)
- Max duration: 3s before falling back to empty state

### Interaction Specs

- **Tap CTA**: Navigates to GuidedReflection (Tier 1-2) or WarmReferralCard (Tier 3)
- **Tap dismiss (Tier 1-2)**: Banner slides up and out (200ms). State saved in local storage + server.
- **Tap dismiss (Tier 3)**: Opens confirmation bottom sheet:
  - Title: "Support is here when you need it"
  - Body: "These options will remain available from your dashboard."
  - Buttons: "Keep support visible" (primary) | "Dismiss for now" (ghost)
- **Swipe to dismiss**: Allowed on Tier 1-2. Disabled on Tier 3.

### States Summary

| State | BG | Border | Icon | Headline Example | Persistence |
|-------|----|--------|------|------------------|-------------|
| Empty | — | — | — | — | — |
| Loading | Skeleton | — | — | — | ≤3s |
| Mild | Amber-50 | Amber-100 | Sun | "A couple of tough days — that's normal" | Dismissible |
| Moderate | Terracotta-50 | Terracotta-100 | Heart | "We've noticed a pattern worth checking" | Returns 24h |
| Significant | Berry-50 | Berry-100 | Shield | "You've been having a really tough week" | Confirmation to dismiss |
| Error | Warm-100 | Warm-200 | — | "How are you feeling today?" | Retry on next check-in |

---

## 3. Component: GuidedReflection

A full-screen or bottom-sheet flow that walks the user through a structured check-in after an AlertBanner interaction. The goal is to gather more data and determine the right support path — without the user feeling "tested."

### Visual Structure

```
┌──────────────────────────────────────────┐
│  Screen 1 of 3                            │
│  [progress bar: ●●○]                      │
│                                           │
│  [gentle illustration — leaves/wave]       │
│                                           │
│  "Let's check in together"                │
│                                           │
│  "Over the past few days, how have you    │
│   been feeling overall?"                   │
│                                           │
│  [😢] [🙁] [😐] [🙂] [😊]                │
│  Very    Low   Okay   Good  Great         │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │          Continue                │    │
│  └──────────────────────────────────┘    │
│                                           │
│  [Prefer not to say]                      │
└──────────────────────────────────────────┘
```

### States

#### State: Default (In Progress)

- Progress indicator at top: 3 steps, filled circles for completed, hollow for upcoming
- One question per screen
- Question type adapts to the data gap:
  - Mood: 5-point emoji scale (same as daily check-in)
  - Sleep: "Hours of uninterrupted sleep last night?" Slider (0-8)
  - Support: "Have you had someone to talk to?" Y/N
  - Overwhelm: "Have you felt overwhelmed by everything?" 4-point scale
- "Prefer not to say" link below every question
- Continue button: disabled until selection made (or "Prefer not to say" tapped)
- Illustration: gentle, abstract, organic (leaves, waves, soft shapes) — NOT clinical

#### State: Complete

```
┌──────────────────────────────────────────┐
│  ┌────────────────────┐                   │
│  │  Warm thank-you     │                   │
│  │  illustration       │                   │
│  └────────────────────┘                   │
│                                           │
│  "Thank you for sharing, Maya."            │
│                                           │
│  "Based on what you've shared, here's     │
│   what we recommend..."                    │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │   Connect with a provider        │    │  → WarmReferralCard
│  └──────────────────────────────────┘    │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │   Try a grounding exercise       │    │  → In-app 2-min breathing
│  └──────────────────────────────────┘    │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │   Not right now                   │    │  → Dismiss; returns to dashboard
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

Recommended actions shown: top 2 based on score (if mild, grounding exercise is primary; if moderate, provider connect is primary).

#### State: Skipped (User taps "Prefer not to say" on all questions)

- Gentle acknowledgment: "That's okay — we'll check in again tomorrow."
- Redirects to dashboard
- Internal flag persists; no change to escalation state
- Next check-in will include a softer version: "No pressure to share — just a simple check-in today?"

#### Error State

If the reflection engine fails to save responses:
- Show inline toast: "Your responses were saved. Let's continue." (optimistic save assumed)
- Retry silently in background
- If retry fails after 3 attempts: show "Connection issue — your responses will be saved when you're back online." Store in local queue.

### Mobile Specs

- Full-screen view (not bottom sheet) on mobile
- Bottom sheet (70% height) on tablet/desktop
- Keyboard avoidance: when slider is active, view shifts up to keep CTA visible
- Touch targets: emoji buttons 56x56px minimum

### Interaction Specs

- **Swipe back**: Allowed — previous question reappears with saved answer
- **Progress bar tap**: NOT interactive (decoration only)
- **Session timeout**: If inactive for 5 minutes, save current progress and show timeout overlay: "We saved your spot. Come back anytime." → returns to dashboard
- **Partial save**: Each question answer saved as user taps Continue. Resumable if interrupted.

---

## 4. Component: WarmReferralCard

A visually warm, opt-in card that presents screened providers. Used after GuidedReflection indicates moderate-to-significant concern, or when a user proactively navigates to "Get Support" from dashboard.

### Visual Structure

```
┌──────────────────────────────────────────┐
│  ┌────────────────────────────────────┐  │
│  │  We found providers who specialize  │  │
│  │  in postpartum support              │  │
│  └────────────────────────────────────┘  │
│                                           │
│  ┌─ Provider Card ────────────────────┐  │
│  │ ┌──────┐  Dr. Amara Johnson        │  │
│  │ │ Photo│  LMFT, PMH-C              │  │
│  │ └──────┘  ★★★★☆  (12 reviews)     │  │
│  │            Postpartum anxiety       │  │
│  │            Birth trauma             │  │
│  │            Accepts Aetna, BCBS     │  │
│  │            📍 2.3 mi away          │  │
│  │            [Request Contact]        │  │
│  └────────────────────────────────────┘  │
│                                           │
│  ... Provider Card 2 ...                  │
│  ... Provider Card 3 ...                  │
│                                           │
│  [Not right now — I'll explore later]     │
└──────────────────────────────────────────┘
```

### States

#### State: Default (Providers Available)

- Background: `--esc-indigo-50`
- Max 3 providers shown. Sorted by: availability > distance > rating
- Each card has: photo, name, credentials, rating, specialties, insurance accepted, distance
- "Request Contact" button: `primary` variant, brand-500
- "Not right now" at bottom: ghost button

#### State: No Providers Available

```
┌──────────────────────────────────────────┐
│  "We're building our provider network    │
│   in your area."                          │
│                                           │
│  "In the meantime:"                       │
│  • Try this 2-minute grounding exercise   │
│  • Read stories from other new moms       │
│  • Talk to your OB-GYN at your next       │
│    appointment                            │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │  Notify me when providers join   │    │
│  └──────────────────────────────────┘    │
│                                           │
│  [Back to dashboard]                      │
└──────────────────────────────────────────┘
```

- "Notify me when providers join" creates an interest flag (no commitment)
- Alternative resources shown as bullet list with links

#### State: Request Sent

```
┌──────────────────────────────────────────┐
│  ┌────────────────────┐                   │
│  │  Paper plane        │                   │
│  │  animation          │                   │
│  └────────────────────┘                   │
│                                           │
│  "Referral sent!"                          │
│                                           │
│  We've sent your information to            │
│  Dr. Amara Johnson.                        │
│                                           │
│  She'll reach out within 24 hours to       │
│  schedule an appointment.                  │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │  📞 (617) 555-0142               │    │  → tappable phone link
│  └──────────────────────────────────┘    │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │  Back to dashboard               │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

- Animation: SVG paper plane, 600ms, ease-out
- Phone number is tappable (tel: link)
- Dashboard gains a "Support" card showing referral status

#### State: Request Confirmed (Provider Accepted)

- Dashboard badge updates to: "Connected with Dr. Johnson — appointment scheduled for [date]"
- Push notification sent: "Great news — Dr. Johnson has received your information and will be in touch."

#### State: Request Declined (Provider unavailable)

- Dashboard badge updates to: "That provider is currently unavailable. Let's find another."
- Secondary provider automatically offered (or user can browse again)

#### Loading State

- Skeleton cards: 3 placeholder rectangles, rounded `--radius-md`, `--warm-100` bg, shimmer
- Spinner on "Request Contact" button while request is processing

#### Error State

- If provider list fails to load: "We're having trouble loading providers. Please check your connection and try again."
- Retry button: "Try again"
- If request fails to send: toast "We couldn't send your request. Please try again." + retry on button

### Interaction Specs

- **Tap provider card**: Opens detail bottom sheet (full bio, more reviews, map of location, all accepted insurances)
- **Tap "Request Contact"**: Confirmation sheet: "Share your name and preferred contact method with Dr. Johnson? She'll reach out within 24 hours." [Yes, share] [Cancel]
- **Phone number**: Tappable tel: link, opens phone app natively
- **Swipe to dismiss**: NOT available — user must explicitly choose "Not right now"

---

## 5. Component: CrisisEntryPoint

Full-screen view shown when the escalation engine detects self-harm indicators, OR when the user taps "Immediate support" from the persistent footer. This is the ONLY component that uses crisis palette.

### Visual Structure

```
┌──────────────────────────────────────────┐
│                                           │
│  ┌────────────────────┐                   │
│  │  Heart + shield     │                   │
│  │  illustration       │                   │
│  └────────────────────┘                   │
│                                           │
│  "You matter."                            │
│                                           │
│  "Help is available right now."           │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │  📞 Call 988                      │    │  Crisis-600 text
│  │  Suicide & Crisis Lifeline        │    │  White bg
│  └──────────────────────────────────┘    │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │  📱 Text HOME to 741741          │    │  Crisis-600 text
│  │  Crisis Text Line                 │    │  White bg
│  └──────────────────────────────────┘    │
│                                           │
│  ── ── ──                                │
│  A clinician has been notified and         │
│  will reach out within 30 minutes.        │
│                                           │
│  ┌──────────────────────────────────┐    │
│  │  I understand, return to         │    │  Ghost button
│  │  dashboard                       │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

### States

#### State: Default (Crisis — Self-Harm Flag)

| Property | Value |
|----------|-------|
| Background | `--esc-crisis-50` (soft pink) |
| Illustration | Heart + shield, `--esc-crisis-icon` |
| Headline | "You matter." 28px, `--esc-slate-800`, weight 700 |
| Subhead | "Help is available right now." 18px, `--esc-slate-600`, weight 500 |
| Call 988 button | White bg, `--esc-crisis-600` text, 16px semi-bold, full-width, pill radius |
| Text HOME button | Same style |
| Clinician note | 14px, `--esc-slate-200`, weight 400, centered |
| Return button | Ghost button, `--esc-slate-500` text, 16px |

#### State: User Accessed from Footer (No Self-Harm Flag)

Same visual but headline changes to:
- "Immediate support resources"
- Subhead: "These resources are available 24/7 if you need someone to talk to."
- Tone: slightly less urgent but same warm design
- No clinician auto-notification
- "Return to dashboard" remains

#### Loading State

- Instant render — cached static content. No loading state.
- Hotline numbers are hardcoded, not fetched from API.

#### Error State

- N/A (static content, no network dependency)

### Interaction Specs

- **Call 988**: Opens `tel:988` natively
- **Text HOME**: Opens SMS compose with pre-filled "HOME" to 741741
- **Clinician note**: Static text (no interaction)
- **Return button**: Single tap, navigates to dashboard
- **Hardware back**: Allowed, returns to dashboard
- **Swipe to dismiss**: Disabled
- **Auto-navigate**: NOT done — user must actively tap a resource. No auto-redirects.

---

## 6. Copy Patterns — Tone Guidelines

### Core Tone Principles

1. **Conversational, not clinical.** Write like a knowledgeable friend, not a chart.
2. **Permission-giving.** Use "it's okay to feel this way" patterns.
3. **Agency-first.** Offer choices; use "you can" not "you should."
4. **Lowest alarm possible.** Frame concerns as common patterns, not diagnoses.
5. **No toxic positivity.** Never minimize genuine struggle. Acknowledge hardship.

### Copy Pattern Library

#### Headline Patterns

| Context | Pattern | Example |
|---------|---------|---------|
| Mild concern | "[X]X days of tough days — that's normal" | "A couple of tough days — that's completely normal" |
| Moderate concern | "We've noticed a pattern worth checking" | "We've noticed a pattern we want to check in on" |
| Significant concern | "You've been having a really [X] time" | "You've been having a really tough week" |
| Crisis | "You matter." / "Help is here." | "You matter. Help is available right now." |
| Provider offer | "Here's who can help" | "Here are providers who specialize in postpartum support" |
| Check-in ask | "Let's check in together" | "Let's check in together — just a few quick questions" |

#### Body Copy Patterns

| Context | Pattern | Example |
|---------|---------|---------|
| Normalizing | "This is more common than most [X] realize" | "This is more common than most new moms realize" |
| Empathy | "Your body and mind have been through so much" | "Your body and mind have been through so much. It makes sense to feel this way." |
| Offering help | "Many [X] find it helpful to [Y]" | "Many new moms find it helpful to talk with someone who specializes in postpartum care" |
| Reducing pressure | "No pressure — [X] when you're ready" | "No pressure at all — these options are here when you're ready" |
| Acknowledging dismiss | "That's completely okay. [X]" | "That's completely okay. We'll check in again in a few days." |
| Privacy | "Your answers stay between us" | "Your answers stay between us — nothing is shared without your permission" |

#### Word Choice Rules

| Avoid | Use Instead | Reason |
|-------|-------------|--------|
| Depression / Anxiety | "Feeling unlike yourself" / "Tougher days" | Reduces labeling anxiety |
| Score / Result / Diagnosis | "What we're noticing" / "Pattern" | Avoids clinical framing |
| You should / You need to | "You might consider" / "Many moms find it helpful" | Preserves agency |
| Alert / Warning / Flag | "Checking in" / "Heads up" | Reduces alarm |
| Escalate / Refer | "Connect" / "Match" / "Introduce" | Warmer framing |
| Suffering from | "Going through" / "Experiencing" | Less pathologizing |
| Abnormal / Not normal | "Different than usual" / "A change" | Normalizes variation |
| Failed / Wrong | "Didn't work as expected" / "Not quite right" | Non-judgmental |
| But | "And" / "At the same time" | "But" negates preceding empathy |
| Always / Never (advice) | "Often" / "Usually" / "In our experience" | Avoids absolutism |

#### Button Copy Standards

| Action | Label | Notes |
|--------|-------|-------|
| Accept help | "Yes, please connect me" | Positive, forward-looking |
| Decline help | "Not right now" | Never "No" — leaves door open |
| Dismiss mild | — | X icon only |
| Dismiss significant | "I understand, I'll check back" | Gentle, not final-sounding |
| Proceed | "Continue" or "Next" | Generic forward |
| Complete | "Done" or "Back to dashboard" | Completion action |
| Learn more | "About this recommendation" | Transparency, trust-building |
| Crisis action | "Call 988" or "Text HOME" | Direct, actionable |

### Per-Severity Tone Scaling

| Severity | Warmth | Urgency | Directness | Example Headline |
|----------|--------|---------|------------|------------------|
| No concern | High | None | Low | "You're doing great — keep up the great work" |
| Mild (1-2d) | High | Very low | Low | "A couple of tough days — that's totally normal" |
| Moderate (3-4d) | High | Low | Medium | "We've noticed a pattern — let's check in" |
| Significant (5+d) | High | Medium | High | "You've had a really tough week — let's find support" |
| Crisis | High | High | Very high | "You matter — help is available right now" |

Urgency is conveyed through CTA prominence (button style, position), NOT through alarm language or red colors.

---

## 7. Progressive Disclosure Layer Specs

The escalation flow uses 4 disclosure layers. Information is progressively revealed — the user never sees raw clinical data without choosing to.

### Layer 0: Notification / Lock Screen

- Copy: "Firstweeks has an update for you, [name]."
- No clinical data in notification body
- Tap opens Layer 1 in-app

### Layer 1: Warm Invitation (AlertBanner)

- Shows: first name, normalizing statement, gentle CTA
- Hides: any scores, clinical terms, severity level
- Action: "Check in" → Layer 2 | "Not now" → dismiss

**Spec:**
- Max 3 lines of text
- No numbers, scores, or percentages
- Single CTA (primary) + optional ghost link

### Layer 2: Guided Reflection (Question Flow)

- Shows: one question at a time, mood/sleep/support scales
- Hides: aggregated scores, EPDS results, escalation tier
- Action: complete all 3 questions → Layer 3 | Prefer not to say → dashboard

**Spec:**
- 3 screens max (reduced from 10-question EPDS when in escalation context; full EPDS only if user opts in)
- Progress bar visible
- "Prefer not to say" on every screen
- Each answer saved independently

### Layer 3: Support Recommendation

- Shows: personalized recommendation based on answers (provider connect, grounding exercise, or check back tomorrow)
- Hides: raw algorithm output, comparison to thresholds, numeric scores
- Action: "Connect with a provider" → Layer 4 | "Try exercise" → in-app | "Not right now" → dashboard

**Spec:**
- Show top 2 recommendations. Primary = most impactful. Secondary = alternative.
- "About this recommendation" link at bottom → opens bottom sheet explaining how recommendations work (no clinical jargon)
- Never show: "Your score was X, which indicates Y"

### Layer 4: Provider Detail (WarmReferralCard)

- Shows: provider name, photo, specialties, insurance, distance
- Hides: alternative providers unless user scrolls or taps "see more"
- Action: "Request Contact" → confirmation → sent state

**Spec:**
- Max 3 providers shown. "See more" link if >3 available
- Provider detail bottom sheet with full bio, reviews, map
- "How we match you" info link for transparency

### Trigger for Layer Advancement

| From | To | Trigger |
|------|----|---------|
| 0 → 1 | Lock screen → App | User taps notification |
| 1 → 2 | AlertBanner → Reflection | User taps primary CTA |
| 2 → 3 | Reflection → Recommendation | User completes all questions |
| 3 → 4 | Recommendation → Referral | User selects "Connect with provider" |
| 3 → Dashboard | Any layer | User selects "Not right now" / dismiss |
| 4 → Dashboard | Referral → Home | User completes or defers referral |

### Deep Link Behavior

- **From push notification**: Open directly to Layer 1 (AlertBanner equivalent in-app)
- **From dashboard "Get Support"**: Open to Layer 2 (skip banner)
- **From persistent footer**: Open CrisisEntryPoint directly (Layer 4, crisis variant)
- **From clinician referral**: Open to Layer 4 with specific provider pre-selected

---

## 8. Notification Timing Rules

### Types

| Type | Trigger | Timing | Priority |
|------|---------|--------|----------|
| Daily check-in reminder | Time preference from onboarding | User-set time ± 30min | Normal |
| Check-in follow-up | No check-in after 4h of scheduled time | 4h after scheduled time | Normal |
| Mild escalation | 1-2 days of pattern detected | After next check-in completion | Low |
| Moderate escalation | 3-4 days of pattern detected | After next check-in completion | Normal |
| Significant escalation | 5+ days, any flag | Immediate (within 60s of scoring) | High |
| Crisis escalation | Self-harm flag | Immediate (within 30s) | Critical |
| Provider contact | Provider matched/confirmed | Within 5 min of match | Normal |
| Provider follow-up | No action after 48h of referral | 48h after referral | Low |

### Frequency Capping

| Rule | Limit |
|------|-------|
| Max push notifications per day | 3 |
| Min interval between pushes | 2 hours |
| Max escalation notifications per week | 5 |
| Cooldown after "Not right now" | 24h before next escalation push |
| Cooldown after crisis dismissal | 12h before re-notification (if same pattern, suppress) |

### Delivery Rules

**Daily check-in reminder:**
- Send at user's preferred time (set during onboarding)
- If pending after 30 min, send gentle reminder: "Hi [name] — your daily check-in is waiting"
- If still pending 4h after scheduled: escalate to second reminder (slightly more prominent notification)
- If missed entirely: log skip, no penalty, next day's check-in starts fresh

**Escalation notifications:**
- Mild: ONLY in-app (no push). Alert appears on next check-in complete screen.
- Moderate: In-app banner + push notification (1 per 24h).
- Significant: In-app full-screen + push notification (immediate) + SMS escalation to emergency contact if configured.
- Crisis: In-app full-screen + push notification (immediate) + SMS to on-call clinician + notification to emergency contact.

**Provider notifications:**
- "Provider matched": Push notification within 5 min
- "Provider reached out": Push notification immediately
- "Check-in on referral": In-app only, no push

### Snooze Behavior

User can snooze daily check-in reminder by 2 hours (one button tap in notification).
User CANNOT snooze escalation notifications (Tier 2+).
User CAN dismiss escalation notifications but will see them in-app.

### Quiet Hours

- Default quiet hours: 10 PM — 7 AM (configurable in settings)
- Crisis notifications: ALWAYS deliver, bypass quiet hours
- Significant escalation: ALWAYS deliver, bypass quiet hours
- Moderate/mild: Queue until after quiet hours end
- Daily check-in: Never scheduled during quiet hours (user chooses their time)
- Provider matched: Queue until after quiet hours

### Implementation Notes

- Push notification scheduling uses a queue service with delay processing
- All notification text is server-side rendered to support localization
- Analytics: track notification open rate, time-to-open, action taken
- HIPAA: notification bodies must never contain PHI beyond first name

---

## 9. Reassurance Loop Patterns

A reassurance loop is a UX pattern that confirms the user is okay after an escalation moment. It prevents the "I just told the app I'm struggling and now I feel worse" effect.

### Pattern 1: Post-Submission Reassurance

After completing any escalation-related action (reflection, referral request, crisis resource view):

```
┌──────────────────────────────────────────┐
│  "Thank you for sharing how you're        │
│   feeling. That takes strength."           │
│                                           │
│  "You're not in this alone."              │
│                                           │
│  [Back to dashboard]                      │
└──────────────────────────────────────────┘
```

**Timing:** Shown for 3 seconds before transitioning to dashboard (auto-advance with skip button).

### Pattern 2: Next-Day Follow-Up

After an escalation event, the next day's check-in starts with:

```
┌──────────────────────────────────────────┐
│  "Hi Maya — checking in after yesterday. │
│   How are you feeling today?"             │
│                                           │
│  [I'm feeling better]                     │
│  [About the same]                         │
│  [Worse than yesterday]                   │
└──────────────────────────────────────────┘
```

**Spec:**
- Single-tap response (no slider, no scale)
- Response feeds into escalation engine
- "I'm feeling better" → closes escalation loop (downgrade tier)
- "About the same" → maintain current tier
- "Worse than yesterday" → escalate tier, offer immediate support

### Pattern 3: Milestone Reassurance

After 3 days of positive check-ins following an escalation:

```
┌──────────────────────────────────────────┐
│  "Hey, we just wanted to say —            │
│   you've been doing great this week."     │
│                                           │
│  "We're here whenever you need us."       │
│                                           │
│  [Thanks! ❤️]                             │
└──────────────────────────────────────────┘
```

**Spec:**
- Celebration illustration (gentle confetti, warm tones)
- Only shown ONCE per escalation cycle
- Serves as positive reinforcement without being dismissive

### Pattern 4: Provider Follow-Up Loop

After a referral is sent, the app checks in at intervals:

| Time | Touchpoint | Channel |
|------|-----------|---------|
| +1h | "Your referral was sent to Dr. Johnson." | In-app toast |
| +24h | "Has Dr. Johnson reached out yet?" | In-app + push |
| +48h | Did they reach out? Yes → "Great! How was it?" / No → "Let us know if you want us to follow up" | Push |
| +7d | "How's everything going with your support?" | In-app |

**Spec:**
- Each follow-up is 1-tap response (Yes/No or 👍/👎)
- Responses logged for care quality tracking
- User can opt out of follow-ups at any time
- "Not right now" suppresses the current check but reschedules for next interval

### Pattern 5: "You're Okay" Embedded Pattern

After a no-concern check-in, the completion screen includes a subtle positive micro-copy:

```
┌──────────────────────────────────────────┐
│  Check-in complete ✓                      │
│                                           │
│  "You're doing well. Keep listening        │
│   to what your body needs."               │
│                                           │
│  Next check-in: Tomorrow at 9 AM          │
└──────────────────────────────────────────┘
```

**Spec:**
- Rotating messages (pool of 12) to avoid feeling robotic
- Examples: "You're doing well." / "Taking care of yourself matters." / "One day at a time — you've got this."
- Never shown consecutively with same message
- Reset after escalation events so it doesn't feel dismissive

### Pattern 6: Post-Crisis Warm Handoff

After a crisis event, the following touchpoints activate:

| Time | Action | Channel |
|------|--------|---------|
| Immediate | In-app crisis resources shown + clinician notified | In-app + backend |
| +30 min | Clinician should have reached out. App asks: "Did you get the support you needed?" | In-app push |
| +24h | "Checking in on you today. How are you feeling?" | Push + in-app |
| +72h | "Would you like to continue with ongoing support?" | Push + in-app |
| +7d | Care quality survey (optional, anonymous) | In-app |

**Spec:**
- Crisis follow-ups have highest delivery priority
- All crisis follow-up notifications bypass quiet hours for first 72h
- User can opt out of all follow-ups at any point
- If clinician confirm they made contact, the 30-min check is suppressed
- Crisis follow-up content uses same warm, non-alarm language

---

## 10. Accessibility Requirements

### Color & Contrast

- All text/background combos meet WCAG AA (4.5:1 for normal text, 3:1 for large text)
- Color is NEVER the sole indicator of severity — always paired with icon + text label
- Crisis hotline numbers: minimum 16px, bold, high contrast against white bg

### Touch Targets

- All interactive elements: minimum 44x44px
- Emoji buttons in mood selector: 56x56px
- Dismiss X icons: 32x32px visible area, 44x44px touch padding
- Provider card tap area: entire card (not just text)

### Screen Reader Support

| Element | aria-* Attributes |
|---------|-------------------|
| AlertBanner | `role="alert"`, `aria-live="polite"` |
| CrisisEntryPoint | `role="alertdialog"`, `aria-describedby` for resources |
| GuidedReflection | `role="form"`, `aria-labelledby` for question |
| Mood selector | `role="radiogroup"`, each option `role="radio"` |
| Progress bar | `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax` |
| Provider card | `role="article"`, `aria-label="Provider: [name]"` |
| Dismiss buttons | `aria-label="Dismiss notification"` |
| Toast notifications | `role="status"`, `aria-live="polite"` |

### Focus Management

- AlertBanner: auto-focus when rendered (for screen readers)
- CrisisEntryPoint: trap focus within the dialog
- GuidedReflection: focus moves to question text on screen transition
- Bottom sheets: focus first interactive element on open; restore focus on close
- Keyboard: All actions navigable via Tab + Enter/Space

### Reduced Motion

- Respect `prefers-reduced-motion`: all animations become instant (0ms)
- No parallax or parallax-like effects when reduced motion is enabled
- Slide transitions become instant fades (0ms duration)
- Paper plane animation becomes static checkmark

### Cognitive Accessibility

- Reading level: target grade 6-8 (Flesch-Kincaid)
- Maximum decision count per screen: 3 (excluding "Prefer not to say")
- Consistent back button behavior: always returns to previous screen
- Timeout warnings: session timeout at 5 min inactivity with save + overlay
- Clear error recovery: all errors show actionable retry paths

---

## Appendix A: State Transition Diagram

```
[No concern]
    │
    ▼ (1-2 days pattern)
[Mild concern] ──dismiss──► [No concern]
    │
    ▼ (3-4 days)
[Moderate concern] ──dismiss/24h──► [Moderate concern] (returns in 24h)
    │                                  │
    ├──CTA──► [GuidedReflection]        │
    │           │                       │
    │           ├──complete──► [Recommendations]
    │           │                │
    │           │                ├──provider──► [WarmReferralCard]
    │           │                │                │
    │           │                │                ├──request──► [Referral sent]
    │           │                │                └──dismiss──► [Dashboard]
    │           │                │
    │           │                ├──exercise──► [In-app exercise] ──► [Dashboard]
    │           │                └──dismiss──► [Dashboard]
    │           │
    │           └──skip──► [Dashboard]
    │
    ▼ (5+ days)
[Significant concern] ──confirm-dismiss──► [Dashboard] (24h return)
    │
    ├──CTA──► [GuidedReflection] ──► [Recommendations]
    │                                         │
    │                                         └──provider──► [WarmReferralCard]
    │
    └──clinician notified (backend only)
    │
    ▼ (self-harm flag)
[Crisis]
    │
    ├──clinician notified (immediate)
    ├──emergency contact notified (if configured)
    ├──Call 988 / Text HOME
    └──acknowledge──► [Post-crisis follow-up cycle]
```

## Appendix B: File Map

| Artifact | Path |
|----------|------|
| This spec | `design/escalation-flows/anxiety-sensitive-escalation-spec.md` |
| Escalation wireframes | `docs/wireframes-escalation.md` |
| Design system | `docs/DESIGN_SYSTEM.md` + `docs/design-system.md` |
| UX research | `docs/ux-research.md` |
| User journeys | `docs/user-journeys.md` |
| Design token package | `packages/design-system/src/tokens.ts` |
| Component library | `packages/design-system/src/components/` |
