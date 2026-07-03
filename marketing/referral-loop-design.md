# Referral Loop Design — Firstweeks Growth Engine

## Philosophy
"A product that catches a complication spreads through new-mom communities faster than any ad." — Company goal

The referral loop targets two key truths about new mothers:
- **Trust**: Recommendations from other moms carry more weight than ads
- **Vulnerability**: New moms with complications seek validation and solutions urgently

## Three-Layer Referral Architecture

### Layer 1 — Product-Driven (Viral Core)
**Trigger**: User identifies a potential complication or receives personalized insight
**Action**: One-tap share of the app / specific insight / checklist
**Channels**: WhatsApp, iMessage, Instagram Stories, Facebook Groups
**Copy**: "Firstweeks flagged my symptoms early. Every new mom should have this."

#### Implementation: In-App "SOS Share"
- When the app detects a moderate-to-high risk condition, present an "Share with someone who cares" button
- Generates a personalized share card:
  - "I just used Firstweeks to check my recovery. They're offering free assessments for new moms."
  - Unique referral link (attributed to the sharer)
- Share to: WhatsApp, Text, Email, Social

#### Implementation: "Care Team" Invitation
- User can invite their partner, mother, or friend to the app as their "Care Circle"
- Care Circle members get:
  - Read-only access to the mom's check-in summary (not full data)
  - Alerts if the mom misses check-ins or reports concerning symptoms
  - Educational content about supporting postpartum recovery
- **Referral bonus**: If the invited Care Circle member refers another new mom, the original mom gets credit

---

### Layer 2 — Incentive-Driven (Paid Growth)
**Program**: "MammaMates"

#### Referrer Rewards (The Mom)
- **1 successful referral** (trial started): 1 free week of MammaSync Plus
- **3 successful referrals**: 1 free month of MammaSync Plus
- **5 successful referrals**: 3 free months + "MammaMates Ambassador" badge in community
- **10+ successful referrals**: Free lifetime MammaSync Plus + quarterly wellness box

#### Referee Reward (The Friend)
- **Extended trial**: 14 days free instead of the standard 7
- **Onboarding bonus**: Personal welcome call from a postpartum nurse

#### Mechanics
- Each user gets a unique referral link (`firstweeks.health/join?ref=USERID`)
- Conversion tracking: Trial start → Trial completion → Paid conversion
- Rewards distributed automatically upon successful trial completion (day 7)
- Fraud prevention: IP + device fingerprinting to prevent self-referrals

---

### Layer 3 — Community-Driven (Organic)
**Program**: "Firstweeks Circles"

#### Structure
- Moderated topic-based groups within the app
- Topics: "March 2025 Babies", "C-Section Recovery", "Exclusive Pumpers", "NICU Moms"
- Each Circle has a "Share & Invite" button

#### Viral Mechanics
- **Weekly Check-In Share**: User can share their weekly summary to social media with a "Compare with me" link
- **Badge Collecting**: Users earn badges (e.g., "14-Day Streak", "Mood Master", "Lactation Hero") that auto-generate shareable graphics
- **Expert AMAs**: Monthly AMAs with lactation consultants, pelvic floor PTs, and sleep coaches. Users get 3 invites to share with friends.
- **Group Challenges**: "The 6-Week Check-In Challenge" — groups of 5+ moms who all complete daily check-ins for 6 weeks earn group rewards (e.g., group wellness class, swag box)

---

## Referral Funnel & Metrics

| Stage | Metric | Monthly Target |
|-------|--------|----------------|
| App opens | DAUs | 500 |
| Share prompt views | % of active users | 20% |
| Share actions initiated | % of prompt views | 15% |
| Shares completed (sent) | % of initiated | 70% |
| Link clicks from shares | CTR | 40% |
| Landing page visits | Unique | 500 |
| Trial signups from referral | Conversion to trial | 10% |
| Paid conversions from referral | Conversion to paid | 25% |

### Key Tracking Metrics
- **Viral Coefficient (k)**: Number of new users each existing user generates. Target: k > 0.3
- **Referral Rate**: % of weekly active users who share. Target: 10%
- **Time to First Share**: Average days from signup to first share. Target: < 7 days
- **Referral Quality**: % of referred users who convert to paid vs. organic. Target: 2x organic rate

---

## Technical Requirements
- **Referral Link Generation**: Unique, trackable, short URLs (e.g., `firstweeks.health/r/abc123`)
- **Attribution**: Cookie + localStorage + server-side tracking across channels
- **Reward Engine**: Automated credit application upon qualifying action (trial completion)
- **Fraud Detection**: Rate limiting, IP/device analysis, referral velocity checks
- **Analytics Dashboard**: Real-time viral coefficient, referral funnel, top referrers
- **Mobile Deep Linking**: Link → opens app if installed, otherwise App Store / landing page
- **Push Notifications**: "Sarah just joined using your link — she's your 3rd referral! You're 2 away from a free month."

---

## Activation Email Sequence for Referred Users
1. **Welcome** (immediately after signup): "Your friend [Name] thought you'd love Firstweeks. Here's your extended 14-day trial."
2. **Day 2**: "Complete your first check-in and see why [Name] recommended this."
3. **Day 5**: "[Name] has checked in 5 times. Start your streak today."
4. **Day 10**: "Your trial is halfway through. Here's what other new moms are saying." (social proof)
5. **Day 13**: "Tomorrow your trial ends. Here's what you'll miss if you don't upgrade."
6. **Day 14 (if not converted)**: "We'd love to keep you on the journey. Here's a special offer just for you."

---

## A/B Testing Plan
| Test | Hypothesis | Success Metric |
|------|-----------|----------------|
| Share prompt timing | Showing share prompt after a "win" moment (e.g., completing 7-day streak) will increase share rate by 25% | Share rate |
| Reward structure | Double-sided rewards (both referrer and referee get rewarded) will increase referral rate by 30% | Referral rate |
| Referral copy | "Gift a free month" vs. "Join my group" | Link click-through rate |
| Social proof | Showing "3 of your friends are already on Firstweeks" on landing page | Trial signup rate |
| Care Circle | Users who invite a Care Circle member have 2x LTV | LTV of users vs. non- invitees |

