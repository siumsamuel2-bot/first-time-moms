# Marketing KPI Dashboard — Template & Tracking Framework

**Owner:** CMO
**Updated:** 2026-07-20

---

## Dashboard Sections

### Section A: Top-Line Metrics (Monthly)

| Metric | Definition | Phase 0 Target | Phase 1 Target | Current |
|--------|-----------|----------------|----------------|---------|
| MAU | Monthly active users (app + quiz) | 60 | 500 | 0 |
| Quiz completions | Personalized advice quiz finishes | — | 250/mo | 0 |
| Trial starts | 7-day free trial signups | — | 50/mo | 0 |
| Premium subs | Paying $10/mo users | — | 50 | 0 |
| Plus subs | Paying $20/mo users | — | 10 | 0 |
| MRR | Monthly recurring revenue | $0 | $700 | $0 |
| CPA | Cost per acquisition (blended) | $0 | $0-12 | N/A |
| Viral coefficient (k) | Invites sent × conversion rate | — | 0.15 | N/A |

### Section B: Funnel Metrics (Weekly)

| Stage | Metric | Current | Target | Δ |
|-------|--------|---------|--------|---|
| Awareness | Social impressions | TBD | 10K/wk | — |
| Interest | Quiz page views | TBD | 500/wk | — |
| Consideration | Quiz completions | TBD | 50/wk | — |
| Conversion | Trial starts | TBD | 10/wk | — |
| Activation | D3 check-in completed | TBD | 70% | — |
| Retention | D7 check-in completed | TBD | 70% | — |
| Revenue | Paid upgrade | TBD | 10% of trials | — |
| Referral | Shares sent | TBD | 5% of active | — |

### Section C: Community Health (Weekly)

| Platform | Metric | Current | Target |
|----------|--------|---------|--------|
| Reddit | Comment karma earned | TBD | +50/wk |
| Reddit | Thread replies | TBD | 20/wk |
| Facebook | Group members added | TBD | +50/wk |
| Instagram | Engagement rate | TBD | 3.5% |
| TikTok | Avg views per video | TBD | 1K |
| All | Mentions (brand) | TBD | 10/wk |

### Section D: Pilot Practice Metrics (Weekly)

| Metric | Definition | Target | Current |
|--------|-----------|--------|---------|
| Practices enrolled | Signed LOI | 2 | 0 |
| Patients enrolled | Activated accounts | 60 | 0 |
| Onboarding completion | Finished setup | ≥85% | — |
| Check-in adherence D7 | Still checking in at day 7 | ≥70% | — |
| Escalations triggered | Threshold crossed | TBD | — |
| Escalation acceptance | Patient acted on alert | ≥40% | — |
| NPS | Exit survey score | ≥50 | — |
| Complications caught | Clinical events detected early | ≥2 | — |

### Section E: Institutional Pipeline (Monthly)

| Tier | Target Count | Contacted | Meetings | LOI | Revenue |
|------|-------------|-----------|----------|-----|---------|
| Tier 1 (pilot match) | 8 | 0 | 0 | 0 | $0 |
| Tier 2 (regional network) | 12 | 0 | 0 | 0 | $0 |
| Tier 3 (academic) | 10 | 0 | 0 | 0 | $0 |
| Tier 4 (payor/national) | 5 | 0 | 0 | 0 | $0 |

---

## Tracking Implementation

### Data Sources

| Data | Source | Update Frequency |
|------|--------|-----------------|
| App analytics | Mixpanel / PostHog | Real-time |
| Quiz completions | Quiz backend | Real-time |
| Trial conversions | Stripe / billing system | Daily |
| Community engagement | Manual log (CM) | Weekly |
| Pilot data | Clinician dashboard | Weekly |
| Institutional pipeline | CRM (HubSpot / spreadsheet) | Weekly |

### Reporting Cadence

| Report | Audience | Frequency | Format |
|--------|----------|-----------|--------|
| Weekly pulse | CMO + CEO | Weekly | Dashboard + 3-bullet summary |
| Monthly review | CEO + Board | Monthly | Full dashboard + narrative |
| Pilot health | CMO + CTO + CEO | Weekly during pilot | Dashboard + blocker list |
| Institutional pipeline | CMO | Weekly | Pipeline tracker |

---

## Weekly Pulse Template

```
Subject: Marketing Pulse — [Date]

Snapshot:
- Active users: [X] (vs target [Y])
- Quiz completions: [X] (Δ [Z]% WoW)
- Trial starts: [X] (CAC: $[Y])
- MRR: $[X] (vs target $[Y])

Community:
- Top post this week: "[title]" — [X] upvotes/engagement
- Community insights: [1-2 observations]
- CM hours logged: [X]/20

Pilot:
- Practices enrolled: [X]/2
- Patients enrolled: [X]/60
- Key blocker: [or "none"]

This week's focus:
1. [Priority action]
2. [Priority action]
3. [Priority action]

Needs CEO:
- [Action needed, if any]
```

---

## Conversion Tracking Framework

### Funnel Stages & Events

| Stage | Event | Tracked Via | Attribution |
|-------|-------|-------------|-------------|
| 1. Awareness | Social impression/mention | Platform analytics | Channel |
| 2. Interest | Quiz page visit | UTM params | Source/channel |
| 3. Consideration | Quiz completed | Backend event | Source |
| 4. Conversion | Trial started | Billing webhook | Source + referral code |
| 5. Activation | D3 check-in | App event | Cohort |
| 6. Revenue | Paid subscription | Stripe | Cohort |
| 7. Referral | Share sent | App event | User + referral code |

### UTM Parameter Convention

```
firstweeks.health/quiz?utm_source={source}&utm_medium={medium}&utm_campaign={campaign}

Sources:
- reddit, facebook, instagram, tiktok, pinterest, google, direct, email, referral
Mediums:
- social, organic, paid, email, sms, qr
Campaigns:
- community_phase1, community_phase2, pilot_recruitment, institutional_outreach
```

### Cohort Analysis

Track by signup week:
| Cohort | Week | Trial Started | D3 Active | D7 Active | Paid | Referral Sent |
|--------|------|--------------|-----------|-----------|------|---------------|
| Pilot batch 1 | Jul 28 | [X] | [X] (%) | [X] (%) | [X] | [X] |
| Phase 1 wk 1 | Oct 1 | [X] | [X] (%) | [X] (%) | [X] | [X] |

---

*Template maintained by CMO. Updated weekly during pilot phase.*
