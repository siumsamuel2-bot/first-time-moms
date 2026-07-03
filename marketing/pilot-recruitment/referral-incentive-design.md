# Referral Incentive Design — Firstweeks Pilot Program

## Strategy Overview

Referral is the primary growth engine for Firstweeks. A product that catches a complication spreads through new-mom communities faster than any ad. The pilot builds the foundation for this flywheel.

---

## PILOT REFERRAL PROGRAM: "Share the Care"

### Mechanics (Double-Sided Incentive)

| Action | Referrer Reward | Referee Reward |
|--------|----------------|----------------|
| Qualified pilot application | Priority in waitlist processing | Priority in waitlist processing |
| Referee completes qualification | $10 Amazon gift card | Guaranteed pilot spot (if qualified) |
| Referee completes full 6-week pilot | Additional 10% lifetime discount (stacks with 50% = 60% total) | Standard pilot benefits |

### Why Double-Sided?
- New moms naturally share resources with each other
- A one-sided incentive feels like MLM. Double-sided feels like "I found something good and want you to benefit too"
- The reward ladder keeps referrers engaged after the initial share

---

## REFERRAL FLOW

### 1. In-App Referral Trigger

After completing Week 1 onboarding, participants see:

> "Know another new mom who could benefit from the pilot? Share your referral link. You both get rewarded."

**Display**: In-app card with personalized referral link and share buttons.

**Placement**: 
- Post Week 1 check-in completion screen
- Community tab sidebar
- Weekly report email footer

### 2. Share Options

- **Copy link**: `firstweeks.health/pilot?ref=USERCODE`
- **WhatsApp**: Pre-filled message template
- **Text message**: Pre-filled SMS template
- **Email**: Pre-filled email template
- **Instagram/Facebook DM**: Copy-paste message

### 3. Tracking

- Referral codes: unique alphanumeric, 6 characters (e.g., `MAMA9X`)
- Cookie-based + server-side attribution
- Track: click → qualification started → qualification completed → pilot completed
- Dashboard: "You've referred X moms. Rewards earned: Y."

---

## PRE-FILLED SHARE MESSAGES

### WhatsApp / Text Message

> Hey! I just joined a clinical pilot for a postpartum recovery app through my OB-GYN and it's actually really good. Daily check-ins, your doctor sees the results, and it's free for 6 weeks. They still have a few spots. Here's the link: https://firstweeks.health/pilot?ref=MAMA9X

### Email

**Subject**: Found something you might want — postpartum recovery pilot

**Body**:

Hey [Name]!

I'm doing this clinical pilot through [Practice Name] for a postpartum recovery app called Firstweeks and thought of you.

The short version: you do a quick daily check-in (2 minutes), the app monitors your recovery, and if something looks off your OB-GYN gets notified. It's a 6-week program and completely free during the pilot.

I've been using it for [X] weeks and the weekly reports alone are worth it — seeing your mood/sleep/recovery trends all in one place.

They're only taking 30 moms and I think there are still spots. Here's the link:

https://firstweeks.health/pilot?ref=MAMA9X

No pressure — just wanted to share!

💕

### Instagram DM

> Hey! I remember you mentioned struggling with the postpartum stuff. I'm doing this pilot through our OB-GYN — it's a recovery app with daily check-ins and your doctor actually monitors the results. Free for 6 weeks. Thought you might want the link: firstweeks.health/pilot?ref=MAMA9X

---

## PUBLIC LAUNCH REFERRAL PROGRAM (Post-Pilot)

### Program: "Mama Knows Best" Referral

**Mechanics**:

| Event | Referrer Reward | Referee Reward |
|-------|----------------|----------------|
| Friend signs up for free quiz | Unlock "Quiz Results Comparison" feature (see how your results differ) | Free Personalized Advice Quiz |
| Friend starts premium trial | 1 month free ($20 value) | 7-day extended trial ($10 → $0 for first week) |
| Friend converts to MammaSync Plus | 2 months free ($40 value) | $10 off first month ($20 → $10) |

**Viral Coefficient Target**: 0.5+ (every 2 users bring 1 new user through referral)

### Referral Leaderboard (Community Feature)

- Monthly top referrers earn: "Mama Advocate" badge
- Quarterly winner: Featured in community AMA + $100 wellness gift card

---

## COMMUNITY GROWTH MECHANICS

### 1. "Ask a Fellow Mama" Pairing

During onboarding, new users are paired with a pilot graduate (post-pilot) or another active user for a 7-day buddy period. This creates natural referral paths.

### 2. Group Challenge

Weekly community challenges (e.g., "Track your water intake for 7 days"). Participants can invite friends to join challenges even if they're not Firstweeks users — driving top-of-funnel awareness.

### 3. "Share Your Report" Feature

Users can generate a shareable "recovery snapshot" (anonymized summary card) to post on social media. Each card includes a referral CTA.

**Snapshot card includes**:
- Week number
- Mood emoji trend (☺️ → 😊 → 😊 → 😊 → 😊)
- "I've been tracking my recovery with Firstweeks for X weeks"
- Referral link

### 4. Provider-Driven Referral

Post-pilot: participating OB-GYN practices get co-branded referral cards to hand out at discharge. Each card has a practice-specific code that tracks conversions back to the provider — valuable for institutional sales (demonstrates patient engagement).

---

## INCENTIVE ECONOMICS

### Pilot (30 Users)

**Assumptions**:
- Average pilot participant refers 2 other moms
- 50% of referred moms qualify and join the waitlist
- Cost: $10 gift card × (30 × 2 × 0.5) = $300 max
- Lifetime discount cost: negligible at pilot scale

**Expected outcome**: 60+ waitlist signups from referrals, seeding pre-launch audience.

### Public Launch (Target: 1,000 users Month 1)

**Assumptions**:
- 20% of users refer at least 1 person
- Average referee conversion to trial: 15%
- Cost per conversion via referral: ~$5 (free month value)
- Cost per conversion via paid acquisition: ~$25–40

**Referral is 5–8x cheaper than paid acquisition.**

---

## MEASUREMENT DASHBOARD (Suggested Metrics)

| Metric | Target | Frequency |
|--------|--------|-----------|
| Referral link clicks | Tracked per cohort | Weekly |
| Qualification starts from referral | >20% of total applications | Weekly |
| Referral conversion rate (start → complete qualification) | >50% | Monthly |
| Viral coefficient | >0.5 | Monthly |
| Referral revenue vs. paid acquisition cost | Report quarterly | Quarterly |
| NPS of referred users vs. organic | Within 5 points | Monthly |

---

## IMPLEMENTATION NOTES

### Tech Requirements
- Unique referral code generation (linked to user ID)
- URL parameter tracking (`?ref=CODE`)
- Attribution window: 30 days from click
- Anti-fraud: rate limiting on code generation, IP-based duplicate detection
- Referral dashboard in user settings

### Email/SMS Integration
- SendGrid transactional email for referral confirmations
- Post-pilot: Twilio for SMS referral invites (opt-in only)

### Compliance
- No referral rewards for sharing PHI
- Clear disclosure: "Referral rewards are not medical advice or endorsement"
- CAN-SPAM compliant referral emails