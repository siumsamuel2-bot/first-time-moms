# Escalation & Provider Matching Wireframes — Blueprint

## UX Principle

**Never say "depression", "disorder", "warning", or "alert" to the patient.** Frame everything as "recovery pattern" or "we've noticed things have been tougher." The goal is connection, not diagnosis.

---

## Screen 1: Warm Check-In (Triggered)

**Trigger:** 3+ days of sleep disruption (<3h) + low mood scores

```
┌──────────────────────────────┐
│                              │
│  ┌────────────────────┐      │
│  │  Hand holding       │      │
│  │  illustration       │      │
│  └────────────────────┘      │
│                              │
│  Hi Maya,                    │
│                              │
│  We've noticed your recovery │
│  has been a bit tougher      │
│  this week. You're not       │
│  alone — many new mothers    │
│  go through this.            │
│                              │
│  Would you be open to        │
│  answering a few more        │
│  questions so we can         │
│  understand better?          │
│                              │
│  ┌────────────────────────┐  │
│  │  Yes, I'm open to it   │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  Not right now          │  │  Ghost button
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Illustration: hand-holding or nurturing imagery, soft warm tones
- Language: warm, supportive, avoids clinical terminology
- Two clear choices: yes/no, both equally valid
- If "Not right now": dismisses the escalation prompt, continues normal check-ins, does NOT clear the internal flag
- Internal state: escalation record created at `reviewing` status

---

## Screen 2: Extended Assessment

```
┌──────────────────────────────┐
│                  2 of 5      │
│                              │
│  In the past 7 days...       │
│                              │
│  I have felt sad or          │
│  miserable:                  │  Full EPDS continuation
│                              │
│  ○ Not at all                │
│  ○ Sometimes                 │
│  ○ Often                     │
│  ● Very often                │
│                              │
│  ──── ──── ────              │
│                              │
│  I have been so unhappy      │
│  that I have had trouble     │
│  sleeping:                   │
│                              │
│  ○ Not at all                │
│  ○ Sometimes                 │
│  ○ Often                     │
│  ● Very often                │
│                              │
│  [Next ────────────────>]   │
│                              │
│  [Prefer not to say]         │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Full EPDS (10 questions) — 2 per screen, swipeable
- Same styling as onboarding EPDS screens
- "Prefer not to say" on each screen
- Answers feed into the escalation scoring engine

---

## Screen 3: Connection Offer

**Shown after extended assessment is complete. Score determines which version.**

```
┌──────────────────────────────┐
│                              │
│  ┌────────────────────┐      │
│  │  Warm connection    │      │
│  │  illustration       │      │
│  └────────────────────┘      │
│                              │
│  Thank you for sharing,      │
│  Maya.                       │
│                              │
│  Based on what you've told   │
│  us, we think you might      │
│  benefit from talking with   │
│  someone who specializes     │
│  in postpartum care.         │
│                              │
│  Would you like us to        │
│  connect you?                │
│                              │
│  ┌────────────────────────┐  │
│  │  Yes, please connect   │  │
│  │  me                    │  │  Primary
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  Not right now          │  │  Ghost
│  └────────────────────────┘  │
│                              │
│  ──── ──── ────              │
│  About this recommendation   │  Info link
│                              │
└──────────────────────────────┘
```

**Specs:**
- Primary CTA: "Yes, please connect me" — positive action language
- Secondary: "Not right now" — equally valid, no guilt
- Info link at bottom: "About this recommendation" → opens a bottom sheet explaining how the recommendation works (transparency builds trust)

**If NO:**
```
┌──────────────────────────────┐
│  That's completely okay.     │
│                              │
│  We'll check in with you     │
│  again in a few days.        │
│                              │
│  If you change your mind,    │
│  you can always tap          │
│  "Get Support" from your     │
│  dashboard.                  │
│                              │
│  ┌────────────────────────┐  │
│  │  Back to dashboard      │  │
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

---

## Screen 4: Provider Matching

```
┌──────────────────────────────┐
│ [Back]       Find Support    │
│                              │
│  We found 3 providers near   │
│  you who specialize in       │
│  postpartum support.         │
│                              │
│  ┌────────────────────────┐  │
│  │  ┌──────────────────┐  │  │
│  │  │ Photo            │  │  │
│  │  └──────────────────┘  │  │
│  │  Dr. Amara Johnson     │  │
│  │  LMFT, PMH-C           │  │
│  │  ★★★★☆  2.3 mi       │  │
│  │  Specializes in:       │  │
│  │  postpartum anxiety,   │  │
│  │  birth trauma          │  │
│  │  Accepts: Blue Cross   │  │
│  │  [Select]              │  │  Outline button
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  ... Provider 2 ...    │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  ... Provider 3 ...    │  │
│  └────────────────────────┘  │
│                              │
│  [No thanks, not now]       │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Up to 3 providers, sorted by distance + availability
- Each card: photo, name, credentials, rating, distance, specialties, insurance
- "Select" button: outline/ghost variant
- Provider cards open a detail view on tap (more reviews, full bio, map)
- "No thanks, not now" at bottom: ghost button, returns to dashboard
- If no providers available in area: "We're searching for providers in your area. We'll notify you as soon as one becomes available."

---

## Screen 5: Referral Confirmation

```
┌──────────────────────────────┐
│                              │
│  ┌────────────────────┐      │
│  │  Paper plane        │      │
│  │  sent animation     │      │
│  └────────────────────┘      │
│                              │
│  Referral sent!              │
│                              │
│  We've sent your information │
│  to Dr. Amara Johnson.       │
│                              │
│  She'll reach out within     │
│  24 hours to schedule an     │
│  appointment.                │
│                              │
│  In the meantime:            │
│  ┌────────────────────────┐  │
│  │  ☎️ Call their office   │  │  (617) 555-0142
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  Back to dashboard      │  │
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

**Specs:**
- Animation: paper plane sending (SVG, 600ms)
- Header: "Referral sent!" — positive, forward-looking
- Shows provider name and phone number
- 24-hour expectation setting
- Dashboard will show a "Support" card with provider status

---

## Screen 6: Critical Escalation (Self-Harm)

**Shown only if user indicates suicidal ideation or self-harm.**

```
┌──────────────────────────────┐
│                              │
│  ┌────────────────────┐      │
│  │  Heart + shield      │      │
│  │  illustration       │      │
│  └────────────────────┘      │
│                              │
│  You matter.                 │
│                              │
│  Help is available right     │
│  now. Please reach out.      │
│                              │
│  ┌────────────────────────┐  │
│  │  📞 Call 988            │  │  988 Suicide & Crisis
│  │  (Suicide & Crisis      │  │  Lifeline
│  │   Lifeline)             │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │  📱 Text HOME to       │  │  Crisis Text Line
│  │  741741                 │  │
│  └────────────────────────┘  │
│                              │
│  ────                        │
│  A clinician has also been   │
│  notified and will reach     │
│  out within 30 minutes.      │
│                              │
└──────────────────────────────┘
```

**Specs:**
- This screen uses the app's warm palette — NOT red or alarming colors
- No "warning" or "danger" language
- Clear, actionable crisis resources with tappable phone/text links
- Footer: clinician auto-notified (gives a sense of safety net)
- Auto-trigger: clinician dashboard high-priority alert, SMS to on-call clinician
