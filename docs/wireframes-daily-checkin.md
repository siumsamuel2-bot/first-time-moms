# Daily Check-In Wireframes — Blueprint

## Screen 1: Push Notification

```
┌────────────────────────────┐
│                            │
│  Firstweeks                │
│  ──────────────────        │
│                            │
│  Your daily check-in is    │
│  ready. Takes 2 minutes.   │
│                            │
│         [Open]             │
│                            │
└────────────────────────────┘
```

**Specs:**
- Notification title: "Daily Check-In"
- Body: "Your daily check-in is ready. Takes 2 minutes."
- Tapping opens the check-in flow in-app
- Scheduled at user's chosen time (from onboarding)
- If not opened by +2 hours: gentle second push: "Maya, your check-in is waiting."

---

## Screen 2: Check-In Start

```
┌──────────────────────────────┐
│                              │
│  ┌────────────────────┐      │
│  │  Sun illustration   │      │
│  │  morning coziness   │      │
│  └────────────────────┘      │
│                              │
│  Good morning, Maya.         │
│                              │
│  Let's see how you're        │
│  doing today.                │
│                              │
│  2 minutes • 5 questions     │
│                              │
│  [Start Check-In]           │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Illustration: small, 120x120px, warm morning scene
- Heading: text-xl, warm-900
- Subtitle: text-sm, warm-500
- Duration indicator: "2 minutes • 5 questions" — very important to set expectations
- CTA: primary, full width

---

## Screen 3: Physical Questions

```
┌──────────────────────────────┐
│ [X]             2 of 5      │
│                              │
│  How is your incision        │
│  feeling today?              │  ← Question varies by profile
│                              │
│  ○ No pain                    │
│  ● Mild discomfort           │
│  ○ Moderate pain             │
│  ○ Severe pain               │
│                              │
│  ──── ──── ────              │
│                              │
│  How would you rate your     │
│  overall physical comfort?   │
│                              │
│  0 ○───○───○───○──●───○───○ 10│  Slider
│  │  Very uncomfortable   │  │
│  │  Very comfortable     │  │
│                              │
│  [Next ────────────────>]   │
│                              │
│  [Skip]                      │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Close button (X) top-left: returns to dashboard, saves current answers
- Question counter: "2 of 5" top-right
- Radio buttons for discrete answers (pain scale)
- Slider for continuous answers (comfort scale)
- "Skip" link = "prefer not to say" — subtle, text-sm, warm-500
- Questions vary by profile:
  - C-section: incision question included
  - Vaginal: perineal healing question instead
  - Breastfeeding: latch pain question added
  - Day 1-7: daily; day 8-30: every-other-day; day 31+: weekly

---

## Screen 4: Sleep Question

```
┌──────────────────────────────┐
│ [X]             3 of 5      │
│                              │
│  How was your sleep          │
│  last night?                 │
│                              │
│  Hours of uninterrupted      │
│  sleep:                      │
│                              │
│  0 ○──○──○──●──○──○──○──○ 8  │  Slider with labeled ticks
│  |  |  |  |  |  |  |  |    │
│  0  1  2  3  4  5  6  7  8  │
│                              │
│  ──── ──── ────              │
│                              │
│  Did you have trouble        │
│  falling asleep?             │
│                              │
│  ○ No    ● Yes               │
│                              │
│  [Next ────────────────>]   │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Sleep slider: 0-8 hours, labeled tick marks at each integer
- "Hours of uninterrupted sleep" is the key metric
- Follow-up: binary yes/no on trouble falling asleep
- Sleep data is weighted heavily in escalation scoring

---

## Screen 5: Mood Check

```
┌──────────────────────────────┐
│ [X]             4 of 5      │
│                              │
│  How have you been feeling   │
│  emotionally today?          │
│                              │
│  I have been able to         │
│  laugh and see the funny     │
│  side of things:             │
│                              │
│  ○ As much as ever           │
│  ○ Less than before          │
│  ○ Much less than before     │
│  ○ Not at all                │
│                              │
│  ──── ──── ────              │
│                              │
│  I have felt anxious or      │
│  worried:                    │
│                              │
│  ○ Not at all                │
│  ● Sometimes                 │
│  ○ Often                     │
│  ○ Very often                │
│                              │
│  [Next ────────────────>]   │
│                              │
└──────────────────────────────┘
```

**Specs:**
- EPDS-2 abbreviated version (2 questions instead of 5 for daily use)
- If baseline EPDS was high: show full 5-question version instead
- 4 radio buttons per question, same scale as onboarding
- "Prefer not to say" link below each

---

## Screen 6: Open Comment

```
┌──────────────────────────────┐
│ [X]             5 of 5      │
│                              │
│  Anything else you'd like    │
│  to share?                   │
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │  Free text...          │  │  Multiline input
│  │                        │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  This helps us understand    │
│  what you're going through.  │
│                              │
│  [Complete Check-In]        │
│                              │
│  [Skip]                      │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Multiline textarea: 4 lines tall, rounded border
- Optional — can be left blank
- "Skip" takes you to completion
- Character limit: 500
- This field is surfaced on the clinician dashboard for context

---

## Screen 7: Complete

```
┌──────────────────────────────┐
│                              │
│  ┌────────────────────┐      │
│  │  Checkmark anim     │      │
│  │  + gentle sparkle   │      │
│  └────────────────────┘      │
│                              │
│  You're all caught up!       │
│                              │
│  See you tomorrow at         │
│  10:00 AM.                   │
│                              │
│  ┌────────────────────────┐  │
│  │  Go to dashboard        │  │
│  └────────────────────────┘  │
│                              │
│  ────                        │
│  Need support? Tap here      │  ← If escalation flag active
│  to connect with a           │
│  postpartum specialist.      │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Checkmark animation (SVG draw, 400ms)
- Gentle sparkle particles (CSS animation, 600ms, non-distracting)
- "See you tomorrow" with their chosen check-in time
- Support link only appears if escalation engine has flagged concern (from previous check-ins)
- Support link: text-sm, rose-500, links to provider matching flow
