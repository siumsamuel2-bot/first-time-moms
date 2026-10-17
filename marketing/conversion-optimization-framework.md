# Conversion Optimization Framework — Firstweeks

## Overview

Framework for optimizing the user funnel from first touchpoint to paid subscriber. Covers the complete user lifecycle: acquisition → activation → retention → revenue → referral.

---

## Funnel Architecture

### Full User Journey

```
Acquisition                    Activation                 Retention              Revenue
─────────                     ──────────                 ─────────               ──────
Blog / Social / Referral  →   Landing Page            →  Day 1 Check-in       →  Trial Conversion
       ↓                          ↓                          ↓                       ↓
   Quiz Start             →   Quiz Complete           →  7-Day Streak          →  Premium Upgrade
       ↓                          ↓                          ↓                       ↓
   Email Capture          →   Welcome Email           →  Weekly Report        →  MammaSync Plus
       ↓                          ↓                          ↓                       ↓
   Trial Signup           →   Onboarding Complete     →  Community Join       →  Retention (Loyalty)
```

### Conversion Rate Benchmarks (Industry: Health/Wellness Apps)

| Stage | Industry Median | Firstweeks Target | Gap |
|-------|----------------|-------------------|-----|
| Landing page → Quiz start | 40% | 60% | +20% |
| Quiz start → Complete | 60% | 85% | +25% |
| Quiz complete → Email capture | 50% | 70% | +20% |
| Email capture → Trial signup | 8% | 15% | +7% |
| Trial signup → Onboarding complete | 60% | 80% | +20% |
| Day 1 check-in → 7-day streak | 25% | 50% | +25% |
| Trial → Paid conversion (30d) | 15% | 25% | +10% |
| Paid → Retained (90d) | 40% | 60% | +20% |

---

## Section 1: Acquisition-to-Activation Funnel

### 1A. Landing Page → Quiz Start

#### Current State
- Single landing page (`firstweeks.health/quiz`) with 3 headline variants
- CTA: "Get your personalized postpartum plan"
- Trust indicators below fold

#### Optimization Opportunities

**Above-the-Fold Optimizations**
- **Social proof bar**: "Join 500+ new moms tracking their recovery" (if applicable, otherwise "30 moms in clinical pilot")
- **Urgency cue**: "Free assessment — 89% of users discover something they didn't know"
- **Visual**: Mother + baby illustration or real user photo (A/B test illustration vs. photo)
- **Reduced friction**: Remove navigation menu to reduce exit paths
- **Sticky CTA**: On mobile, keep CTA button pinned to bottom of viewport

**A/B Test: Hero Section**
| Variant | Headline | Subheadline | Expected Lift |
|---------|----------|-------------|---------------|
| Control | "Is your postpartum recovery on track? Take our free 2-minute assessment." | "Clinically validated questions designed with OB-GYNs" | Baseline |
| A (Benefit) | "Know exactly how your recovery is going — in 2 minutes." | "Personalized report based on your delivery type, feeding plan, and mood" | +10% |
| B (Social Proof) | "82% of new moms discover a risk they didn't know they had." | "Our free quiz has helped thousands of mothers spot complications early" | +15% |

#### Implementation
- **Tool**: Google Optimize or VWO for server-side testing
- **Traffic split**: 50/50 for 2 weeks, then 70/30 toward winner
- **Sample size**: 500 visitors per variant for statistical significance
- **Success metric**: Quiz start rate (click to first question)

---

### 1B. Quiz Experience

#### Current State
- 7 questions, one per screen with progress bar
- Email wall before results
- Mobile-responsive design

#### Drop-off Risk Points
1. **Question 2 (Physical symptoms)**: Users may feel overwhelmed by medical options
2. **Question 6 (Medical history)**: Users may not know or may skip
3. **Email wall**: The critical friction point — highest drop-off

#### Optimizations

**Question-Level Improvements**
- **Question 2**: Add "I'm not sure" option — reduces anxiety, keeps users in funnel
- **Question 6**: Pre-tick "None of the above" as default — reduces cognitive load
- **Progress bar**: Show "X of 7 answered" instead of percentage (less pressure)
- **Back button**: Allow going back to change answers (builds trust)

**Email Wall Optimization**
- **Micro-commitment**: "We'll send your personalized report straight to your inbox"
- **Privacy reassurance**: "No spam. We never share your data."
- **Social proof beneath the input**: "Join 500+ moms who've taken this assessment"
- **Option to text results**: "Or text me the link" — SMS capture for higher engagement

**A/B Test: Email Wall Design**
| Variant | Description | Expected Lift |
|---------|-------------|---------------|
| Control | Standard email input + button | Baseline |
| A | Email + phone option (tabs) | +5% capture rate |
| B | Email with social proof ticker below input | +10% capture rate |
| C | "Get results instantly" — no wall, but prompt to create account for full report | +20% but lower quality |

---

### 1C. Results Page → Trial Conversion

#### Current State
- 6-page personalized PDF report
- Trial CTA at end: "Start your 7-day free trial of Firstweeks Premium ($10/month after)"
- Upgrade path to MammaSync Plus ($20/month)

#### Optimization Opportunities

**Report Format**
- **Interactive web report** instead of PDF: Higher engagement, easier CTA placement
- **Sticky CTA bar**: After scroll threshold, show persistent "Start your free trial" bar
- **Personalized urgency**: "Your top concern is [X]. Firstweeks helps you track [X] daily."

**Trial Conversion Flow**
1. Immediately after report delivery — capitalize on emotional peak
2. **Social proof moment**: "You're not alone. Other moms with your profile [X] saw [Y] improvement"
3. **Scarcity**: "Your personalized report is saved for 7 days. Start your trial to keep tracking."
4. **Low-friction signup**: Email + password only (no credit card for free trial)

**A/B Test: Trial CTA**
| Variant | CTA Copy | Expected Lift |
|---------|----------|---------------|
| Control | "Start your free 7-day trial" | Baseline |
| A | "Continue your recovery journey — start free" | +8% |
| B | "Your personalized plan is ready. See what happens next." | +12% |
| C | No CTA on report (email only) | -15% (control wins) |

---

## Section 2: Activation & Onboarding Funnel

### 2A. Welcome Email → App Download

#### Current Flow
1. Welcome email with app links
2. Onboarding call scheduling
3. Consent form signing

#### Drop-off Points
- **Email to download**: Average app install rate from email is 25-35%
- **Multi-step onboarding**: Each additional step drops 15-20% of users

#### Optimizations
- **Deep link directly to app store** with pre-filled invite code
- **SMS fallback**: Send download link via SMS for higher open rates
- **Reduced steps**: Combine consent + onboarding scheduling into one screen
- **Progress indicator**: Show "4 steps to your first check-in" with checkmarks

**A/B Test: Onboarding Friction**
| Variant | Flow | Expected Lift |
|---------|------|---------------|
| Control | Email → App download → Account creation → Onboarding call scheduling | Baseline |
| A | Email with deep link → Account creation in-app → Onboarding call scheduled from app | +15% completion |
| B | SMS link → App download → Quick 2-min in-app onboarding → Schedule call optional | +25% completion |

---

### 2B. In-App Onboarding → First Check-In

#### Current Flow (From Wireframes)
- Welcome → Delivery details → Feeding plan → Mental health baseline → Check-in time → Complete

#### Friction Points
1. **5 screens**: Industry best practice for health apps is 3-4 screens max
2. **EPDS questions (Screen 4)**: Heavy emotional lift on Day 0
3. **No value preview**: User gives information for 3+ screens before seeing any value

#### Optimizations

**Progressive Onboarding**
- **Screen 1+2**: Merge Welcome + Delivery Details (user is motivated here)
- **Screen 3**: Feeding plan (keep standalone — branching logic matters)
- **Screen 4**: Mental health — move 2 of 5 questions to Day 1 check-in (reduces initial friction)
- **Screen 5**: Check-in time (keep)
- **Complete**: Show dashboard preview with mock data so user sees the value

**First Check-In Timing**
- **Same-day onboarding → next-day check-in**: 24-hour gap causes 30% drop-off
- **Better: First check-in immediately after onboarding**: "Your first check-in is ready now. It takes 2 minutes."
- **If user completes first check-in same day**: Push notification at chosen time for Day 2

**A/B Test: Onboarding Length**
| Variant | Screens | Expected Lift |
|---------|---------|---------------|
| Control | 5 screens (current) | Baseline |
| A | 3 screens (merge welcome + delivery + feeding, shorten EPDS) | +20% completion |
| B | 4 screens with mock dashboard preview after screen 2 | +15% completion |

---

## Section 3: Retention & Engagement

### 3A. Daily Check-In Habit

#### Current Design
- Push notification at chosen check-in time
- 2-3 questions adapted to profile
- Open comment optional

#### Optimization Opportunities

**Habit Loop**
1. **Trigger**: Push notification + SMS fallback
2. **Action**: 2-minute check-in
3. **Reward**: Animated confirmation + streak counter
4. **Investment**: Data builds weekly report (delayed reward)

**Streak Mechanics**
- **3-day streak**: "You're building momentum!" badge
- **7-day streak**: First weekly report unlocks
- **14-day streak**: "Recovery Tracker" badge + shareable graphic
- **Missed day**: "We saved your spot. Pick up where you left off." (no streak reset on Day 1 miss)

**A/B Test: Notification Timing**
| Variant | Strategy | Expected Lift |
|---------|----------|---------------|
| Control | Fixed time (user-chosen) | Baseline |
| A | Adaptive (learn when user usually checks in) | +10% completion |
| B | Fixed time + SMS backup at 4pm if no response | +20% completion |

---

### 3B. Weekly Report Engagement

#### Current Design
- Sunday email delivery with link to in-app report
- Report shows trends: mood, sleep, feeding, physical symptoms

#### Optimizations
- **Push notification Sunday morning**: "Your weekly recovery report is ready"
- **In-app badge**: Red dot on report icon until viewed
- **Shareable highlight card**: "This week I tracked ___ days of recovery. Here's my trend." → Social share
- **Partner notification**: Option to auto-share summary with Care Circle member

**A/B Test: Report Format**
| Variant | Format | Expected Lift |
|---------|--------|---------------|
| Control | PDF-style report in-app | Baseline |
| A | Interactive chart (scrollable, tappable data points) | +15% views |
| B | Video summary (30-sec animated recap with voiceover) | +25% views |

---

### 3C. Community Engagement

#### Current Design
- Moderated topic-based Circles
- Weekly challenges, AMAs, badges

#### Retention Drivers
- **Social accountability**: "Your Circle has 80% check-in rate this week"
- **Peer recognition**: "Mama of the Week" spotlight
- **Expert access**: Monthly AMA drives return visits

**Key Metric**: Community engagement correlates with 2x retention at 30 days.

---

## Section 4: Trial-to-Paid Conversion

### 4A. Pricing Page Optimization

#### Current Pricing
- **Premium Trial**: $10/month (first 7 days free)
- **MammaSync Plus**: $20/month (full AI analyses + community)
- **Annual discount**: Not yet defined

#### Pricing Page Structure
1. **Hero**: "Choose your recovery journey"
2. **Free** (after trial ends): Basic check-ins, weekly email digest
3. **Premium** ($10/mo): Personalized daily check-ins, AI analysis, weekly reports, priority support
4. **MammaSync Plus** ($20/mo): Everything in Premium + unlimited community access, expert AMAs, Care Circle, advanced analytics, partner/support person access

#### A/B Test: Pricing Anchoring
| Variant | Structure | Expected Lift |
|---------|-----------|---------------|
| Control | Free / Premium $10 / Plus $20 | Baseline |
| A | Show Plus $20 first (anchor), then Premium $10 | +15% Premium conversion |
| B | Annual pricing: Premium $8/mo billed annually ($96/yr) vs $10/mo | +20% annual conversion |

---

### 4B. Trial Nurture Sequence

#### Trigger-Based Emails (Beyond Standard Sequence)

| Day | Trigger | Email Goal |
|-----|---------|------------|
| 1 | First check-in complete | "You're off to a great start — here's what to expect this week" |
| 3 | 3-day streak | "3 days in a row! Your data is already showing patterns" |
| 5 | Low engagement (no check-in in 48h) | "We miss you. Here's a 30-second check-in to keep your streak." |
| 7 | Weekly report available | "Your first weekly report is ready. Here's what the data says." |
| 10 | Trial halfway | "Halfway through your trial. Here's what you've built." |
| 13 | Trial ends tomorrow | "Tomorrow your trial ends. Here's what you'll keep vs. lose." |
| 14 | Trial expired (not converted) | "Your trial ended. Here's a special offer to continue." |
| 21 | 7 days post-trial | "We saved your data for 30 days. Come back anytime." |

---

### 4C. Conversion Barriers & Solutions

| Barrier | User Thought | Solution |
|---------|-------------|----------|
| Price sensitivity | "$10/month for an app?" | Show ROI: "Cost of one latte per week. Cost of missed complication: priceless." |
| Commitment fear | "What if I stop using it?" | "Pause anytime. Your data stays for 30 days." |
| Value unclear | "What do I actually get?" | 7-day trial shows value before asking for payment |
| Trust | "Is my data safe?" | HIPAA badge, encryption explainer, "your data, your control" messaging |
| Decision paralysis | "Free vs Premium vs Plus?" | "Start Premium free. Upgrade anytime." (reduce upfront decision) |

---

## Section 5: Referral Loop Conversion

### 5A. Referral Funnel Optimization

#### Current (From Referral Loop Design)
- In-app "SOS Share" when moderate-to-high risk detected
- "MammaMates" program with tiered rewards
- "Firstweeks Circles" community-driven sharing

#### Optimization: Share Prompt Timing

**High-Conversion Moments to Prompt Share:**
1. **After completing 7-day streak**: "You've tracked a full week! Share your progress with a friend."
2. **After receiving weekly report**: "Your Week 2 report is in. Would another mom benefit from this?"
3. **After escalation resolved**: "Your alert was reviewed. Every mom deserves this safety net."
4. **After positive emotion**: "You rated your mood 'good' 5 days this week. Share what's working."

**A/B Test: Share Prompt Timing**
| Variant | Timing | Expected Lift |
|---------|--------|---------------|
| Control | Static prompt on share screen | Baseline |
| A | Post-win moment (7-day streak complete) | +30% share rate |
| B | Post-escalation (alert reviewed) | +20% share rate |

---

### 5B. Referral Landing Page

For referred users landing at `firstweeks.health/join?ref=USERID`:

- **Personalized headline**: "[Referrer Name] thought you'd love Firstweeks"
- **Social proof**: "Join [Referrer Name] on their recovery journey"
- **Extended trial**: "14 days free (instead of 7) — your welcome gift from [Referrer Name]"
- **Care Circle invite**: "Track alongside [Referrer Name] — invite them to your Care Circle"

---

## Section 6: Analytics & Measurement Framework

### 6A. Core Conversion Dashboard

| Metric | Where to Track | Frequency | Owner |
|--------|---------------|-----------|-------|
| Landing → Quiz start % | GA4 / Mixpanel | Daily | CMO |
| Quiz completion % | Custom event | Daily | CMO |
| Email capture rate | SendGrid / API | Daily | CMO |
| Trial signup rate | App analytics | Daily | CMO |
| Onboarding completion % | In-app analytics | Daily | CMO |
| Day 1 → Day 7 retention | Mixpanel | Weekly | CMO |
| Trial → Paid conversion | Stripe / RevenueCat | Weekly | CMO |
| Paid retention (30/60/90d) | RevenueCat | Monthly | CMO |
| Referral viral coefficient (k) | Custom dashboard | Weekly | CMO |
| Average revenue per user (ARPU) | RevenueCat | Monthly | CMO |

### 6B. Weekly Optimization Cycle

```
Monday     → Review conversion dashboard, identify biggest drop-off
Tuesday    → Formulate hypothesis + design experiment
Wednesday  → Deploy A/B test (Google Optimize / VWO)
Thursday   → Monitor results, check statistical significance
Friday     → Document findings, decide: implement / iterate / kill
```

### 6C. Experiment Log Template

| Date | Experiment | Variant | Sample Size | Result | Decision |
|------|-----------|---------|-------------|--------|----------|
| — | — | — | — | — | — |

---

### 6D. Leading Indicator Targets (Pre-Launch)

Before we have real user data, these are the proxy metrics to optimize:

| Proxy Metric | Target | Validation |
|-------------|--------|------------|
| Email signup → Welcome email open rate | >50% | SendGrid data |
| Quiz preview share rate (social) | >5% of viewers | Social platform analytics |
| Landing page scroll depth (75%+) | >40% | GA4 scroll tracking |
| Blog → Quiz CTA click rate | >8% | GA4 event tracking |
| Community waitlist → App download | >30% | Custom event tracking |

---

## Section 7: Urgency & Scarcity Tactics

### When to Use
- **Pilot launch window**: "30 spots. 6 weeks. Apply by [Date]."
- **Trial expiration**: "Your 7-day trial ends in [X] days."
- **Referral bonus**: "Invite 3 friends for a free month — offer ends [Date]."

### When NOT to Use
- Never on clinical/health features ("This life-saving feature is only available for 24 hours" — unethical)
- Never on mental health resources
- Never on crisis/hotline content

### Ethical Scarcity Framework
- Scarcity applies to **pricing, access, time-limited offers** — never to health outcomes
- Always pair urgency with educational value
- "Last chance" only for actual, non-renewable windows (pilot spots, not generic offers)

---

*Created: July 8, 2026 | CMO, Firstweeks*
