# Anxiety-Sensitive UX Patterns for Clinical Escalation

## Research Summary

This document synthesizes best practices from mental health apps, healthcare notification design, and trauma-informed design for the Firstweeks postpartum escalation UI.

---

## 1. Core Principles

### Principle 1: Normalize, Don't Alarm

Postpartum mothers already experience heightened anxiety. The escalation UI must frame findings as common and manageable, not as emergencies unless they truly are.

**Do:**
- "Many new moms experience this — here's what can help"
- "You're not alone. These patterns are common and treatable."
- Use "we" language: "We've noticed a pattern we want to share with you"

**Don't:**
- "WARNING: Your symptoms indicate possible postpartum depression"
- Red banners, sirens, or urgent-sounding language
- "You scored HIGH on depression screening"

### Principle 2: Provide Agency and Choice

Mothers in the postpartum window often feel a loss of control. The escalation UI must give them clear options and respect their autonomy.

**Do:**
- Present options as choices: "Here are paths forward — you choose what feels right"
- Always include a "not now, I'll revisit this" option
- Allow users to set their own follow-up reminders

**Don't:**
- Force a single action path
- "You must contact a provider immediately" (unless truly critical)
- Remove the ability to dismiss or defer

### Principle 3: Progressive Disclosure

Don't overwhelm. Reveal information in layers, starting with the gentlest interpretation and offering deeper clinical detail only when requested.

**Do:**
- Start with a warm, human summary
- Offer "Learn more about what these results mean" expandable sections
- Show crisis resources only when severity warrants it

**Don't:**
- Dump all clinical data on one screen
- Show raw scores without context
- Lead with the worst-case scenario

### Principle 4: Warm, Not Clinical

The tone should feel like a trusted friend who happens to be a clinician — not like a hospital chart.

**Do:**
- Conversational, empathetic copy
- Soft, warm color palette (lavender, sage, warm cream)
- Rounded shapes, organic illustrations
- Human photography showing real postpartum moments

**Don't:**
- Medical jargon without plain-language translations
- Cold blues and sterile whites
- Clinical forms and checklists

### Principle 5: Actionable, Not Abstract

Every escalation must lead to concrete, achievable next steps. "You might be depressed" without a path forward is harmful.

**Do:**
- 1-3 clear actions per screen
- "Talk to a provider who specializes in postpartum care"
- "Try this 2-minute grounding exercise"
- "Read stories from moms who've been here"

**Don't:**
- Vague suggestions ("consider reaching out")
- Links to generic mental health resources
- No follow-up mechanism

---

## 2. Severity-Based Escalation Tiers

### Tier 1: Mild Concern (1-2 days of concerning patterns)

**Trigger:** Slight elevation in sadness/fatigue, normal for postpartum

**UX Approach:**
- Light-touch in-app nudge
- Frame as self-care reminder
- No provider referral needed

**Sample Copy:**
> "We noticed you've had a couple of tough days. That's completely normal. Here's a gentle self-care reminder with tips from other moms who've been through this."

**Visual Design:**
- Soft amber/warm yellow accent
- Single card with 2-3 self-care suggestions
- Dismissible, no persistence

### Tier 2: Moderate Concern (3-4 days of consistent patterns)

**Trigger:** Sustained sadness + sleep disruption, potential PPD indicators

**UX Approach:**
- More prominent in-app message
- Option to explore provider matching
- Self-assessment questionnaire offer
- "Check in with yourself" framing

**Sample Copy:**
> "We've been checking in together for a few days now, and we want to make sure you're getting the support you deserve. Would you like to explore some options that have helped other moms feel more like themselves?"

**Visual Design:**
- Warm lavender/purple accent
- Expandable card with tiered options
- "Explore support options" primary CTA
- "I'm okay for now" secondary option
- Persists for 24 hours if dismissed

### Tier 3: Significant Concern (5+ days of patterns OR any critical flag)

**Trigger:** 5+ days of sleep disruption + sadness, or any suicidal ideation flag

**UX Approach:**
- Full-screen compassionate intervention
- Warm provider referral CTA
- Crisis resources prominently available
- Option to share with trusted contact

**Sample Copy:**
> "Your well-being matters deeply to us. We've noticed that the past several days have been especially hard, and we want to make sure you have the right support around you. There are wonderful providers who specialize in exactly what you're going through — and we can help you find one who feels right for you."

**Visual Design:**
- Soft rose/coral accent (warm but signals importance)
- Full-screen takeover with calming illustration
- "Find a provider" primary CTA
- "Crisis support" always visible at bottom
- Persists until user takes action (but always has a gentle dismiss)

---

## 3. Copywriting Guidelines

### Language Rules

| Avoid | Use Instead |
|-------|-------------|
| "Depression" / "Anxiety" | "Feeling unlike yourself" / "Tougher days than usual" |
| "Score" / "Result" / "Diagnosis" | "What we're noticing" / "Pattern" |
| "You should" / "You need to" | "Many moms find it helpful to..." / "You might consider..." |
| "Alert" / "Warning" / "Flag" | "Checking in" / "We want to share" / "Heads up" |
| "Crisis" / "Emergency" | "Immediate support" (framed as resource, not label) |
| "Escalate" / "Refer" | "Connect" / "Match" / "Introduce" |

### Key Phrases Bank

**Opening:**
- "We've been on this journey together for [X] days..."
- "Checking in — how are you really doing?"
- "We wanted to share something we've noticed..."

**Normalizing:**
- "This is more common than most moms realize"
- "1 in 5 new moms experience this — you're in good company"
- "Your body and mind have been through so much. It makes sense."

**Offering Help:**
- "Would you like to explore what support could look like?"
- "We've matched you with providers who really get postpartum"
- "No pressure — this is here when you're ready"

**Crisis (only when necessary):**
- "If you're having thoughts of harming yourself or your baby, please reach out now"
- "You don't have to go through this alone — help is a call away"
- "988 Suicide & Crisis Lifeline: Call or text 988"

---

## 4. Visual Design Guidelines

### Color Palette for Escalation States

| State | Accent Color | Usage |
|-------|-------------|-------|
| Normal | Sage green (#7C9A7E) | Default state, check-in complete |
| Mild concern | Warm amber (#D4A853) | Gentle nudge, non-persistent |
| Moderate concern | Soft lavender (#8B7DA8) | Noticeable but calm, semi-persistent |
| Significant concern | Warm rose (#C97D7B) | Prominent but warm, persistent |
| Crisis resources | Always visible (#E8D5D5 bg) | Subtle persistent footer |

### Typography

- Headlines: 24px, semi-bold, with comfortable line height (1.4)
- Body: 16px, regular, high readability line height (1.6)
- Crisis line: 14px, always visible, warm color on light background
- No all-caps except for 988 crisis number

### Iconography

- Organic, hand-drawn style where possible
- Nature-inspired: leaves, gentle waves, sunrise
- Avoid: red exclamation marks, sirens, warning triangles, hospital crosses

### Animation

- Subtle fades (300ms ease-in-out)
- Soft scale transforms (never bounce or shake)
- Parallax-like slow movements in background illustrations
- No flashing, blinking, or pulsing elements

---

## 5. Notification Design

### Push Notifications

**Never:**
- Send alarming diagnostic language
- Use all-caps or excessive punctuation
- Reveal specific clinical data in notification body

**Always:**
- Use the mother's name when possible
- Keep it warm and brief
- Point to in-app experience, not raw data

**Sample Notifications:**

| Severity | Notification Copy |
|----------|------------------|
| Check-in reminder | "Hi Sarah — time for your daily check-in. How are you feeling today?" |
| Mild pattern | "Sarah, we put together some self-care ideas for you. Want to take a look?" |
| Moderate pattern | "Sarah, we've got some support options we'd love to share when you have a moment." |
| Significant concern | "Sarah, your well-being matters. We've prepared some personalized support for you." |

---

## 6. Crisis Resource Integration

### Always-Available (Persistent Footer)

Every screen in the app should have a subtle, always-visible footer:

> "If you need immediate support: Call or text **988** (Suicide & Crisis Lifeline) or text **HOME** to 741741 (Crisis Text Line)"

Design: Light warm background, 14px text, no icon — just present and calm.

### On Escalation Screens

For Tier 3 (significant concern) screens, the crisis footer becomes slightly more prominent but remains warm — never alarming:

> "If you're having thoughts of hurting yourself or your baby, please reach out now: **988** (call/text) or go to your nearest ER. You are not alone, and you deserve support right now."

---

## 7. User Testing Checklist

When testing escalation UI with postpartum mothers:

- [ ] Does the language feel supportive or clinical?
- [ ] Do users understand what action they should take?
- [ ] Does the UI create any anxiety or panic?
- [ ] Is the crisis line visible without being alarming?
- [ ] Do users feel they have a choice in how to proceed?
- [ ] Is the dismissal option findable and non-judgmental?
- [ ] Do users trust the provider matching suggestion?
- [ ] Would they recommend this to another new mom?

---

## 8. References & Further Reading

- Trauma-Informed Design Principles (SAMHSA)
- Postpartum Support International clinical guidelines
- Woebot Health conversational agent design patterns
- Apple Human Interface Guidelines — HealthKit
- NHS Digital service manual — mental health patterns
- WCAG 2.1 AA accessibility standards for health apps