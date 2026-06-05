# Onboarding Wireframes — Blueprint

## Screen 1: Welcome

```
┌──────────────────────────────┐
│                              │
│  ┌────────────────────┐      │
│  │  Illustration:      │      │
│  │  Mother + baby      │      │
│  │  warm tones,        │      │
│  │  safe embrace       │      │
│  └────────────────────┘      │
│                              │
│  Welcome to Firstweeks       │
│  Your postpartum recovery    │
│  partner                     │
│                              │
│  We'll help you track your   │
│  recovery and connect you    │
│  with support when you       │
│  need it.                    │
│                              │
│  [Get Started ──────────>]   │
│                              │
│  Already have an account?    │
│  [Sign In]                   │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Illustration: 200x200px, centered, warm rose tones
- Heading: text-2xl, warm-900
- Body: text-base, warm-500
- CTA: Button variant="primary" size="xl" fullWidth
- Bottom link: text-sm, rose-500

---

## Screen 2: Delivery Details

```
┌──────────────────────────────┐
│ [Back]           Step 1 of 5 │
│ ━━━━━━━━━○━━━━━━━━━━━━━━━━  │  Progress 20%
│                              │
│  When did you give birth?    │
│                              │
│  ┌────────────────────────┐  │
│  │  June 2, 2026          ▼│  │  Date picker
│  └────────────────────────┘  │
│                              │
│  What type of delivery?      │
│                              │
│  ┌────────────────────────┐  │
│  │ ○ Vaginal delivery     │  │  OptionSelect
│  ├────────────────────────┤  │
│  │ ○ Cesarean section     │  │
│  ├────────────────────────┤  │
│  │ ○ Emergency C-section  │  │
│  └────────────────────────┘  │
│                              │
│  Any complications?          │
│  ┌────────────────────────┐  │
│  │  ┌───────────────────┐ │  │
│  │  │ preeclampsia     x│ │  │  Tag input
│  │  └───────────────────┘ │  │
│  │  ┌───────────────────┐ │  │
│  │  │ hemorrhage      x│ │  │
│  │  └───────────────────┘ │  │
│  │  [Add complication]    │  │
│  └────────────────────────┘  │
│                              │
│  [Continue ────────────>]   │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Back button: ghost variant, left-aligned
- Step indicator: "Step X of Y" right-aligned, text-sm text-warm-500
- Progress bar: full width below header
- Date picker: click opens a month calendar (simplified, no time)
- Option cards: vertical layout, 3 options
- Complications: free-text tags with "x" dismiss, "prefer not to say" as the last option
- Continue: primary, full width, bottom of screen

**Edge case: Emergency C-section selected → profile tagged for higher monitoring; no visual change to user**

---

## Screen 3: Feeding Plan

```
┌──────────────────────────────┐
│ [Back]           Step 2 of 5 │
│ ━━━━━━━━━━━━━━○━━━━━━━━━━━━  │  Progress 40%
│                              │
│  How are you feeding         │
│  your baby?                  │
│                              │
│  ┌────────────────────────┐  │
│  │  🤱  Breastfeeding     │  │  OptionSelect with icons
│  ├────────────────────────┤  │
│  │  🍼  Formula feeding   │  │
│  ├────────────────────────┤  │
│  │  Both                  │  │
│  └────────────────────────┘  │
│                              │
│  [Continue ────────────>]   │
│                              │
└──────────────────────────────┘

--- If breastfeeding selected: ---

│  How is breastfeeding going? │
│                              │
│  ┌────────────────────────┐  │
│  │ ○ Going well!          │  │
│  ├────────────────────────┤  │
│  │ ○ Some challenges      │  │
│  │   (show support opt)   │  │
│  └────────────────────────┘  │
│                              │
│  [Continue ────────────>]   │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Grid layout (2 columns) for 3 options? No — vertical is better for readability on mobile
- Icons: 24px, left-aligned in the option cards
- Conditional follow-up only for breastfeeding
- If "Some challenges": show a gentle info card: "Many new mothers experience breastfeeding challenges. We have resources to help."

---

## Screen 4: Mental Health Baseline

```
┌──────────────────────────────┐
│ [Back]           Step 3 of 5 │
│ ━━━━━━━━━━━━━━━━━━━━○━━━━━━  │  Progress 60%
│                              │
│  How are you feeling?        │
│                              │
│  These questions help us     │
│  understand how you're       │
│  doing emotionally. There    │
│  are no wrong answers.       │
│                              │
│  ──── ──── ──── ────        │
│                              │
│  In the past 7 days...       │
│                              │
│  I have been able to laugh   │
│  and see the funny side:     │
│                              │
│  ○ As much as ever           │
│  ○ Less than before          │
│  ○ Much less than before     │
│  ○ Not at all                │
│                              │
│  ──── ──── ──── ────        │
│                              │
│  I have felt anxious or      │
│  worried for no reason:      │
│                              │
│  ○ Not at all                │
│  ○ Sometimes                 │
│  ○ Often                     │
│  ○ Very often                │
│                              │
│  [Continue ────────────>]    │
│                              │
└──────────────────────────────┘
```

**Specs:**
- 5 EPDS questions, 1 at a time (swipe or next-button)
- Each question: text-lg label, 4 radio options below
- "Prefer not to say" link below each set of options (small, warm-500)
- Trigger warning BEFORE first question: "These questions are about your emotional wellbeing. If you're not ready to answer, you can skip."
- If total >= 10: flag profile internally, DO NOT show any alarm to user, continue onboarding normally

---

## Screen 5: Check-In Time

```
┌──────────────────────────────┐
│ [Back]           Step 4 of 5 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━○━━  │  Progress 80%
│                              │
│  When should we check in?    │
│                              │
│  Pick a time that works      │
│  for your daily check-in.    │
│  We'll send you a gentle     │
│  reminder.                   │
│                              │
│  ┌────────────────────────┐  │
│  │  Time:  10:00 AM       │  │  Wheel picker
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  ☐ Send SMS backup     │  │  Toggle
│  │  (in case I miss the   │  │
│  │   notification)        │  │
│  └────────────────────────┘  │
│                              │
│  [Continue ────────────>]   │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Time picker: simplified, only shows AM/PM hours (not minutes) — reduces cognitive load
- Default: 10:00 AM
- SMS toggle: checked by default

---

## Screen 6: Complete

```
┌──────────────────────────────┐
│                              │
│  ┌────────────────────┐      │
│  │  Checkmark anim     │      │
│  │  celebration        │      │
│  └────────────────────┘      │
│                              │
│  You're all set, Maya!       │
│                              │
│  Your first check-in is      │
│  tomorrow at 10:00 AM.       │
│                              │
│  We'll ask you a few quick   │
│  questions each day to       │
│  track your recovery.        │
│                              │
│  ┌────────────────────────┐  │
│  │  Go to my dashboard     │  │
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Checkmark illustration: animated draw (SVG path animation, 800ms)
- Heading: text-2xl, warm-900
- Body: text-base, warm-500, centered
- CTA: primary, full width
- No "back" — onboarding is complete; user enters the main app
