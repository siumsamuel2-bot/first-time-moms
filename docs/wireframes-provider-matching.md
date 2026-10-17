# Wireframes: Provider Matching & Referral Flow

**Document Type:** UX Wireframes
**Status:** Final
**Issue:** FIR-83
**Designer:** UX Designer
**Date:** 2026-07-13
**Design System:** `docs/DESIGN_SYSTEM.md`
**Escalation Reference:** `docs/wireframes-escalation.md`

---

## Overview

The provider matching flow connects mothers to screened postpartum providers. It can be entered from three entry points and supports the full journey from discovery to post-connection follow-up.

### Entry Points

| Entry | Context | Where It Lands |
|-------|---------|----------------|
| **Escalation (Tier 4)** | User completed GuidedReflection, score >= 5 | Pre-filtered top 3 providers |
| **Dashboard "Get Support"** | User proactively seeks help | Provider search view |
| **Persistent footer** | Crisis resources | CrisisEntryPoint |
| **Dashboard recommendation card** | Post-escalation follow-up | Pre-filtered provider list |

### Users

- **Primary**: First-time mother, 0-12 weeks postpartum, sleep-deprived, looking for help but wants warm/low-pressure framing
- **Secondary**: Clinician (OB-GYN) sending a warm referral on behalf of a patient — see `docs/wireframes-clinician-dashboard.md`

---

## Screen 1: Provider Discovery

### Purpose
Let users find providers that match their needs. Warm, low-pressure framing. The search should feel like browsing a curated directory, not a clinical referral system.

### Visual Layout

```
┌──────────────────────────────────────────┐
│ ← Back                    Provider Name  │
│                                           │
│  "Support that fits your life"            │
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  🔍  Search by name, specialty...    ││
│  └──────────────────────────────────────┘│
│                                           │
│  Filter: [All] [Therapist] [Lactation]   ││
│  [Pelvic Floor] [OB-GYN]                 ││
│                                           │
│  Sort by: [Best match ▼]                  ││
│                                           │
│  ┌─ Provider Card ─────────────────────┐ │
│  │ ┌──────┐  Dr. Amara Johnson         │ │
│  │ │      │  LMFT, PMH-C               │ │
│  │ │ Photo│  ★★★★☆ · 2.3 mi           │ │
│  │ └──────┘  Postpartum anxiety,       │ │
│  │            birth trauma             │ │
│  │            Accepts Aetna, BCBS      │ │
│  │            [Request Contact]        │ │
│  └────────────────────────────────────┘ │
│                                           │
│  ┌─ Provider Card ─────────────────────┐ │
│  │ ┌──────┐  Sarah Mitchell, CNM       │ │
│  │ │      │  Certified Nurse Midwife    │ │
│  │ │ Photo│  ★★★★☆ · 5.1 mi           │ │
│  │ └──────┘  Lactation support,        │ │
│  │            postpartum check-ups     │ │
│  │            Accepts Cigna, BCBS      │ │
│  │            [Request Contact]        │ │
│  └────────────────────────────────────┘ │
│                                           │
│  ┌─ Provider Card ─────────────────────┐ │
│  │ ┌──────┐  Dr. Elena Torres          │ │
│  │ │      │  DPT, Pelvic Floor PT      │ │
│  │ │ Photo│  ★★★★★ · 3.8 mi           │ │
│  │ └──────┘  Diastasis recti,          │ │
│  │            C-section recovery       │ │
│  │            Accepts all major plans  │ │
│  │            [Request Contact]        │ │
│  └────────────────────────────────────┘ │
│                                           │
│  [Show 3 more providers →]                │
│                                           │
│  ────                                      │
│  Not sure what you need?                   │
│  → Take our quick matching quiz            │
│                                           │
│  ─────────────────────                     │
│  Crisis resources: 988 · PSI Helpline      │
└──────────────────────────────────────────┘
```

### Functional Specs

| Element | Behavior |
|---------|----------|
| Back button | Returns to previous screen (dashboard or escalation) |
| Search bar | Type-ahead search by name, specialty, or condition. Debounced 300ms. |
| Filter pills | Horizontal scroll. Tap to toggle. "All" selected by default. Active pill: brand-500 bg, white text. |
| Sort dropdown | Options: Best match (default), Distance, Rating, Availability |
| Provider card | Full card is tappable → opens Screen 2 (detail). "Request Contact" is a separate tap target. |
| Show more | Loads next 3 providers. If none: "No more providers in your area." |
| Matching quiz link | Opens GuidedReflection (same component as escalation) |
| Crisis footer | Always visible at bottom. Matches CrisisFooter component spec. |

### Edge Cases

| Condition | Behavior |
|-----------|----------|
| No providers match filters | "No providers match your search. Try expanding filters." + CTA to clear all filters |
| No providers in area | "We're building our network in your area." + alternative resources + "Notify me" CTA |
| 0 results from search | "No providers match '[query]'. Try searching for a specialty or condition." |
| Network error loading providers | Inline error: "Couldn't load providers. Check your connection." + Retry button |
| Loading | 3 skeleton cards with shimmer animation. 300ms minimum display to prevent flash. |

### Accessibility

- Filter pills: `role="tablist"`, each pill `role="tab"` with `aria-selected`
- Provider cards: `role="article"`, `aria-label="Provider: [name], [specialty]"`
- Sort dropdown: standard `select` with `aria-label="Sort providers by"`
- Search: `<input>` with `aria-label="Search providers"`

---

## Screen 2: Provider Detail

### Purpose
Full provider profile with comprehensive information before the user decides to request contact. Builds trust and helps the user feel confident in their choice.

### Visual Layout

```
┌──────────────────────────────────────────┐
│ ← Provider Discovery                     │
│                                           │
│  ┌────────────────────────────────────┐  │
│  │     Provider photo (large)          │  │
│  └────────────────────────────────────┘  │
│                                           │
│  Dr. Amara Johnson                        │  text-2xl, warm-900
│  LMFT, PMH-C · She/Her                    │  text-base, warm-500
│                                           │
│  ★★★★☆ (12 reviews)                       │
│  Licensed in: Texas, California           │
│  Languages: English, Spanish              │
│                                           │
│  ──── About ────                          │
│  Dr. Johnson specializes in perinatal     │
│  mental health with 8 years of experience │
│  supporting new mothers through anxiety,  │
│  birth trauma, and postpartum adjustment. │
│                                           │
│  ──── Specialties ────                    │
│  ☑ Postpartum anxiety                     │
│  ☑ Birth trauma                           │
│  ☑ Perinatal OCD                          │
│  ☑ Parenting transition                   │
│                                           │
│  ──── Location ────                       │
│  📍 245 Main St, Suite 200                │
│     Austin, TX 78701                      │
│     2.3 mi away · Street parking          │
│     [Open in Maps →]                      │
│                                           │
│  ──── Insurance Accepted ────             │
│  Aetna, BCBS, Cigna, United Healthcare   │
│  Sliding scale available                  │
│                                           │
│  [Request Contact]                        │  primary CTA, full-width
│                                           │
│  [Not right now]                          │  ghost link
└──────────────────────────────────────────┘
```

### Functional Specs

| Element | Behavior |
|---------|----------|
| Photo | 120x120px circular crop. Default: initials on rose-100 background. |
| Rating | Star display. Tappable → bottom sheet with full review list. |
| Open in Maps | Opens native maps app with provider address. |
| Request Contact | Opens confirmation bottom sheet (Screen 3). |
| Not right now | Returns to provider discovery list. No penalty. |

### Trust Signals

- License information (state, number) — collapsed by default with "Show credentials" expand
- "Verified by Firstweeks" badge on provider photo
- Review count displayed prominently
- "Board certified" / "PMH-C" certification badges
- "Seen by [X] other mothers this month" for social proof

### Empty/Error States

| Condition | Behavior |
|-----------|----------|
| Provider no longer available | Toast: "This provider is currently not accepting new patients." → Return to list. Offering similar providers. |
| Photo fails to load | Default avatar with initials. No broken image icon. |

---

## Screen 3: Request Contact — Confirmation Bottom Sheet

### Purpose
Confirm the user wants to share their information with the provider. Sets expectations for the next steps.

### Visual Layout (Bottom Sheet — 60% height)

```
┌──────────────────────────────────────────┐
│  ────                                     │  drag handle
│                                           │
│  ┌────────────────────┐                   │
│  │  Paper plane icon   │                   │  gentle animation
│  └────────────────────┘                   │
│                                           │
│  Share your info with Dr. Johnson?        │  text-xl, warm-900
│                                           │
│  We'll share your:                        │
│    • First name and first initial          │
│    • Phone number                          │
│    • Reason: "Looking for postpartum      │
│      support"                              │
│                                           │
│  She'll reach out within 24 hours.        │
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  Yes, share my information           ││  primary
│  └──────────────────────────────────────┘│
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  Edit what I share                   ││  ghost
│  └──────────────────────────────────────┘│
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  Not right now                       ││  ghost
│  └──────────────────────────────────────┘│
│                                           │
│  Your information is encrypted and        │
│  only shared with this provider.          │
└──────────────────────────────────────────┘
```

### Edit What I Share

If user taps "Edit what I share":

```
┌──────────────────────────────────────────┐
│  ← Back                                   │
│                                           │
│  Choose what to share                     │
│                                           │
│  ☑ First name and initial                 │
│  ☑ Phone number                           │
│  ☐ Email address                          │
│  ☑ Reason for reaching out                │
│  ☐ Additional note:                       │
│  ┌──────────────────────────────────┐    │
│  │  Optional message to provider...  │    │
│  └──────────────────────────────────┘    │
│                                           │
│  [Save and continue]                      │
└──────────────────────────────────────────┘
```

### Specs

- "Yes, share" sends the referral request
- "Edit what I share" pushes to a thin sub-flow (2 extra screens max)
- "Not right now" returns to provider detail
- Phone and reason required; email and note optional
- All data shared flagged in audit log with explicit consent timestamp

---

## Screen 4: Request Sent — Confirmation

### Purpose
Confirm the request was sent. Sets the 24-hour expectation and provides alternative contact methods.

### Visual Layout

```
┌──────────────────────────────────────────┐
│                                           │
│  ┌────────────────────┐                   │
│  │  Checkmark circle   │                   │
│  │  + confetti         │                   │  SVG animation
│  └────────────────────┘                   │
│                                           │
│  Request sent!                             │  text-2xl, warm-900
│                                           │
│  Your info has been shared with           │  text-base, warm-700
│  Dr. Amara Johnson. She'll reach out      │
│  within 24 hours.                         │
│                                           │
│  ────                                      │
│                                           │
│  In the meantime:                         │  text-sm, warm-500
│  • 📞 Call the office: (512) 555-0142     │  tappable tel: link
│  • 📅 Book online: [Book appointment →]   │  external link
│  • 💬 Read about what to expect:          │  in-app content
│    [First therapy session guide →]        │
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  Back to dashboard                   ││  primary
│  └──────────────────────────────────────┘│
│                                           │
│  [Find another provider]                  │  ghost link
└──────────────────────────────────────────┘
```

### Dashboard Integration

After request sent, the dashboard gains a "Support" card:

```
┌──────────────────────────────────────────┐
│  Your Support Connection                  │
│                                           │
│  Dr. Amara Johnson — Awaiting response    │
│  ● Request sent Today 10:32 AM            │
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  Expected reply within 24 hours       ││
│  └──────────────────────────────────────┘│
│                                           │
│  [View details] · [Cancel request]        │
└──────────────────────────────────────────┘
```

### Specs

- Animation: checkmark scales in (400ms spring), confetti particles (gentle, soft colors, 600ms)
- Phone number: `tel:` link, opens phone app
- Book online: external link, opens in browser
- Dashboard card persists until provider responds or user cancels

---

## Screen 5: Provider Accepted — Connected

### Purpose
Notify the user that the provider accepted and facilitate scheduling.

### Trigger
Provider accepts the referral request.

### Visual Layout

```
┌──────────────────────────────────────────┐
│                                           │
│  ┌────────────────────┐                   │
│  │  Two hearts icon    │                   │
│  └────────────────────┘                   │
│                                           │
│  Great news!                               │  text-2xl, warm-900
│                                           │
│  Dr. Johnson has received your            │  text-base, warm-700
│  information and is looking forward       │
│  to connecting with you.                  │
│                                           │
│  She'll reach out to schedule an          │
│  appointment within 24 hours.             │
│                                           │
│  ────                                      │
│                                           │
│  Next steps:                              │
│  • 📞 Expect a call from (512) 555-0142   │
│  • First session is typically 60 min     │
│  • Have your insurance card ready        │
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  Back to dashboard                   ││  primary
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

### Dashboard Update

```
┌──────────────────────────────────────────┐
│  ✓ Connected with Dr. Amara Johnson       │
│                                           │
│  Status: Awaiting appointment schedule    │
│  ┌──────────────────────────────────────┐│
│  │  [Reschedule] [Message provider]     ││
│  │  [Cancel connection]                 ││
│  └──────────────────────────────────────┘│
└──────────────────────────────────────────┘
```

---

## Screen 6: Provider Declined — Alternative

### Purpose
Handle the case where a provider is unavailable, with a warm fallback.

### Trigger
Provider declines or doesn't respond within 48 hours.

### Visual Layout

```
┌──────────────────────────────────────────┐
│                                           │
│  That provider is unavailable             │  text-xl, warm-900
│                                           │
│  Don't worry — we have other providers    │  text-base, warm-700
│  who specialize in the same area.         │
│                                           │
│  We recommend:                            │
│                                           │
│  ┌─ Provider Card ─────────────────────┐ │
│  │  Sarah Mitchell, CNM                │ │
│  │  ★★★★☆ · Accepting new patients    │ │
│  │  Specializes in: postpartum care,   │ │
│  │  lactation support                  │ │
│  │  [Request Contact]                  │ │
│  └────────────────────────────────────┘ │
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  Show more providers                 ││  secondary
│  └──────────────────────────────────────┘│
│                                           │
│  ────                                      │
│  Would you like us to notify you when      │
│  new providers join your area?             │
│  [Yes, notify me]                          │
│                                           │
│  [Back to dashboard]                      │
└──────────────────────────────────────────┘
```

---

## Screen 7: Follow-Up & Check-In Loop

### Purpose
Maintain connection after referral is sent. Check in at intervals to gather feedback and track outcomes.

### Timeline

| Time | Touchpoint | Channel | Response |
|------|-----------|---------|----------|
| +1h | "Your referral was sent to Dr. Johnson." | In-app toast | — |
| +24h | "Has Dr. Johnson reached out yet?" | Push + in-app | Yes / Not yet |
| +48h | If "Not yet": "Would you like us to follow up?" | Push + in-app | Yes please / I'll wait |
| +7d | "How's everything going with your support?" | In-app | 👍 / 👎 / Prefer not to say |
| +14d | Care quality survey (optional) | In-app | 3 questions |

### Follow-Up Check-In Screen

```
┌──────────────────────────────────────────┐
│  Checking in — how's the connection?      │  text-lg, warm-900
│                                           │
│  Has Dr. Johnson reached out to you?      │  text-base, warm-700
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  Yes, we connected ✓                 ││  option
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │  Not yet ✕                           ││  option
│  └──────────────────────────────────────┘│
│                                           │
│  [Prefer not to say]                      │
│                                           │
│  ────                                      │
│  Need help now? Call 988 or text HOME     │
│  to 741741 — available 24/7              │
└──────────────────────────────────────────┘
```

### Post-Connection Feedback (for quality tracking)

```
┌──────────────────────────────────────────┐
│  How was your first session?              │  text-lg
│                                           │
│  ┌──────────────────────────────────────┐│
│  │  😊 Great — I felt heard            ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │  😐 Okay — still figuring it out    ││
│  └──────────────────────────────────────┘│
│  ┌──────────────────────────────────────┐│
│  │  🙁 Not great — not a good fit      ││
│  └──────────────────────────────────────┘│
│                                           │
│  [Prefer not to say]                      │
│                                           │
│  (Feedback is anonymous and helps us      │
│   improve provider matching)              │
└──────────────────────────────────────────┘
```

---

## Filters & Sorting Detail

### Filter Options

| Filter | Values | Behavior |
|--------|--------|----------|
| Specialty | All, Therapist, Lactation, Pelvic Floor, OB-GYN | Mutex (selecting one clears others). "All" resets to default. |
| Insurance | All, Aetna, BCBS, Cigna, United, Cigna, Sliding scale | Multi-select. Providers matching ANY selected insurance shown. |
| Availability | Any time, Morning, Afternoon, Evening, Weekends | Single-select. Based on provider calendar. |
| Virtual only | Toggle | When on, only shows providers offering telehealth. |
| Accepting new | Toggle (default on) | When on, filters to providers accepting new patients. |

### Sorting Options

| Sort | Logic | Default? |
|------|-------|----------|
| Best match | Combination of rating + distance + specialty match score | ✓ Default |
| Distance | Nearest first | |
| Rating | Highest first | |
| Availability | Soonest availability first | |

### Filter Bar Visual (when expanded)

```
┌──────────────────────────────────────────┐
│  ← Back                    Clear all [x] │
│                                           │
│  ──── Specialty ────                      │
│  [All] [Therapist] [Lactation]            │
│  [Pelvic Floor] [OB-GYN]                  │
│                                           │
│  ──── Insurance ────                      │
│  ☐ Aetna   ☐ BCBS   ☐ Cigna              │
│  ☐ United  ☐ Sliding scale               │
│                                           │
│  ──── Availability ────                   │
│  [Any] [Morning] [Afternoon]             │
│  [Evening] [Weekends]                     │
│                                           │
│  Virtual only  ═══════════════○           │  toggle off
│  Accepting new patients  ═══════════●    │  toggle on
│                                           │
│  [Apply filters]                          │  primary CTA
└──────────────────────────────────────────┘
```

---

## State Machine

```
[Discovery] ──tap card──► [Detail]
    │                        │
    │                        ├──Request Contact──► [Confirmation Sheet]
    │                        │                        │
    │                        │                        ├──Confirm──► [Sent]
    │                        │                        │              │
    │                        │                        │              ├──Provider accepts──► [Connected]
    │                        │                        │              │
    │                        │                        │              ├──Provider declines──► [Alternative]
    │                        │                        │              │
    │                        │                        │              └──No response 48h──► [Alternative]
    │                        │                        │
    │                        │                        └──Dismiss──► [Discovery / Dashboard]
    │                        │
    │                        └──Back──► [Discovery]
    │
    ├──filter/sort──► [Filtered list]
    │
    ├──search──► [Search results]
    │
    └──"Not right now"──► [Dashboard]
```

---

## Edge Cases

| Case | Behavior |
|------|----------|
| Provider no longer accepting | Show "Unavailable" badge on card. Tap shows toast: "This provider is not currently accepting new patients." Offer alternatives. |
| User requests multiple providers | Allowed. Each request is independent. Dashboard shows all active requests. |
| User cancels request | Available from dashboard support card. Cancellation logged. Provider notified. |
| Provider calendar integration | For Phase 2. Phase 1: provider calls patient directly. |
| Insurance mismatch | Provider card shows insurance. If user's insurance not listed, show "Contact provider to verify coverage" note. |
| Language preference | If user set language preference in onboarding, filter/sort providers by language. Show language badge on card. |
| 3 AM mode | Full dark theme support. All illustrations use reduced brightness variants. No auto-play animations. |
| Network offline | Queue referral request locally. Send when connectivity returns. Show pending indicator on dashboard. |

---

## Analytics Events

| Event | Trigger |
|-------|---------|
| `provider_search` | User enters search query |
| `provider_filter_applied` | User applies filters |
| `provider_card_tapped` | User taps provider card |
| `provider_request_contact` | User taps "Request Contact" |
| `provider_request_confirmed` | User confirms sharing |
| `provider_request_cancelled` | User cancels request |
| `provider_detail_maps` | User taps "Open in Maps" |
| `provider_followup_response` | User responds to follow-up check-in |
| `provider_connection_feedback` | User rates first session |

---

## File References

| Artifact | Path |
|----------|------|
| This document | `docs/wireframes-provider-matching.md` |
| Escalation wireframes (Tier 4) | `docs/wireframes-escalation.md` |
| Escalation component spec | `design/escalation-flows/anxiety-sensitive-escalation-spec.md` |
| WarmReferralCard component | `packages/design-system/src/components/WarmReferralCard.tsx` |
| Design system | `docs/DESIGN_SYSTEM.md` |
| CrisisEntryPoint component | `packages/design-system/src/components/CrisisEntryPoint.tsx` |
| Clinician dashboard | `docs/wireframes-clinician-dashboard.md` |
| User journeys | `docs/user-journeys.md` |
