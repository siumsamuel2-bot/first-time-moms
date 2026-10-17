# Firstweeks — Go-to-Market Launch Strategy

**Owner:** CMO
**Status:** Final
**Date:** 2026-07-20
**Phase:** Pre-launch (pilot phase)

---

## 1. Launch Philosophy

Firstweeks will not launch with a spray-and-pray ad campaign. The market is trust-constrained — new mothers are bombarded with parenting apps. We earn trust through three gates:

1. **Clinical validation** (IRB + pilot data) → authority to sell to both moms and institutions
2. **Community roots** (authentic presence in mom spaces) → organic distribution without ad spend
3. **Referral mechanics** (built into the product experience) → viral coefficient without growth hacks

**Principle:** *A product that catches a complication spreads through new-mom communities faster than any ad.*

---

## 2. Launch Phases

### Phase 0: Pilot (Current — Jul–Sep 2026)

| Component | Status | Owner |
|-----------|--------|-------|
| OB-GYN practice recruitment (2 practices) | Blocked on human execution | CMO |
| IRB submission (WCG) | Blocked on human portal entry | CMO |
| Provider network (15 providers) | ✅ Complete | CMO |
| App ready for pilot | With CTO | CTO |
| Community seeding (Phase 1 content) | ✅ Drafted, needs CM | CMO |

**Goal:** 60 mothers through the pilot (30 per practice), validation data, first testimonials.

**Success metrics:**
- Onboarding completion ≥85%
- Check-in adherence D7 ≥70%
- Escalation acceptance ≥40%
- NPS ≥50

### Phase 1: Soft Launch (Oct–Nov 2026)

| Channel | Strategy | Budget |
|---------|----------|--------|
| Community (Reddit/FB/TikTok) | Phase 2-3 of content calendar | $0 + CM salary ($1.5-2k/mo) |
| Organic social (Instagram) | Momfluencer micro-influencer gifting | $0 (product gifting) |
| Referral loops | In-app share mechanics go live | $5-10/user |
| Blog + SEO | 12 published posts drive organic | $0 |
| OB-GYN word-of-mouth | Pilot practices refer colleagues | $0 |

**Trigger:** Pilot data shows ≥70% check-in adherence AND ≥1 complication caught.
**Goal:** 500 active users, 50 MammaSync Plus subscribers.
**CPA target:** $8-12 (organic-led, no paid ads).

### Phase 2: Growth (Dec 2026–Feb 2027)

| Channel | Strategy | Budget |
|---------|----------|--------|
| Paid social (Instagram/FB) | Retarget quiz takers, lookalike from pilot users | $3-5k/mo |
| Pinterest | SEO-driven evergreen content | $500/mo |
| Ambassador program | 10 community ambassadors | $500-1k/mo (gift cards) |
| UGC campaign | #MyFirstweeks | $0 (subscription rewards) |
| OB-GYN referral | Partner practices recommend to patients | Revenue share TBD |
| Institutional sales | Convert pilot practices → paid data customers | B2B sales motion |

**Trigger:** Phase 1 CPA validated, referral loop k-factor > 0.15.
**Goal:** 5,000 active users, 500 MammaSync Plus subscribers.
**Budget:** $5-7k/mo.

### Phase 3: Scale (Mar 2027+)

| Channel | Strategy |
|---------|----------|
| All digital channels | Scaled paid acquisition at validated CPA |
| Institutional | 10+ OB-GYN networks, outcome data licensing |
| Provider network | Expanded to 50+ providers across 10 metros |
| Content | Repurpose pilot data → white papers, case studies, conference presentations |

**Goal:** 50,000 active users, $1M+ ARR.

---

## 3. Channel Strategy

### 3.1 Community-Led Growth (Primary)

This is our #1 channel. Rationale:
- New moms trust peer recommendations over advertising (Nielsen: 92% trust peer recs)
- Zero CAC in Phase 0-1
- MOAT: authentic community presence cannot be bought

**Execution:** Consumer Referral Playbook (`community-pivot/consumer-referral-playbook.md`)

**3-layer referral architecture** (from `referral-loop-design.md`):
1. **Post-quiz share** — "Your results might help a friend"
2. **Check-in streak share** — "7 days tracking my recovery"
3. **"Catch It Early" card** — Share to warn a friend

### 3.2 OB-GYN Referral (Trust Anchor)

OB-GYN recommendation carries enormous weight with new mothers. Every enrolled pilot patient is a potential referral source.

**Execution:**
- In-app "Share with your OB" feature
- Digital brochures for waiting rooms
- Provider-to-patient referral cards with QR code → quiz

### 3.3 Content Marketing (SEO + Authority)

12 blog posts target high-intent keywords:
- "postpartum depression vs baby blues" (3.6K/mo searches)
- "newborn sleep 101" (2.4K/mo)
- "c-section recovery day by day" (1.8K/mo)
- "when to call the doctor postpartum" (high conversion intent)

**Distribution:** Pinterest (evergreen), Reddit (discussion), Instagram (Reels repurposing)

### 3.4 Paid Acquisition (Phase 2+ only)

**Never before Phase 2.** Paid ads before community validation = burning money on a trust problem.

**When ready:**
- Instagram/FB: Retarget quiz takers who didn't convert
- Pinterest: Promoted pins on high-SERP blog posts
- TikTok: Spark ads on top-performing organic UGC

---

## 4. Lead Magnet Funnel

```
Traffic source → Personalized Advice Quiz → Quiz results page
                                                  ↓
                                         Email capture
                                                  ↓
                                    Free trial (7 days)
                                                  ↓
                                    Premium ($10/mo) or MammaSync Plus ($20/mo)
```

**Quiz specs** (from `personalized-advice-quiz.md`):
- 7 questions → 6-page personalized report
- Page 6 = soft CTA to free trial
- Email capture gates the full report

**Conversion levers:**
- Post-quiz: "Your personalized plan is ready — start your free trial to unlock daily check-ins"
- D3 of trial: Community invitation
- D5 of trial: "You've checked in X days — upgrade to MammaSync Plus for full AI"
- D7: Trial expiry → conversion or retention offer

---

## 5. Conversion & Pricing

| Tier | Price | Features | Target |
|------|-------|----------|--------|
| Free quiz | $0 | Personalized report | 100% of traffic |
| Trial | $10/mo (first month) | Daily check-ins, community, basic insights | 15-20% of quiz takers |
| Premium | $10/mo | Trial continuation | 10% of trial users |
| MammaSync Plus | $20/mo | Full AI, priority community, provider sharing | 5% of premium users |
| Institutional | Custom | De-identified outcome data licensing | OB-GYN networks |

**Conversion optimization levers** (from `conversion-optimization-framework.md`):
- Quiz → trial: Inline CTA in results page 6
- Trial → premium: Streak-based retention emails
- Premium → Plus: "Flag sharing with your OB" unlock

---

## 6. Institutional Sales Pipeline

**Target:** Convert pilot practices → paid data subscribers post-pilot.

**Pricing** (from `institutional/pilot-pricing-sheet.md`):
- Basic: $1,000/mo (aggregate cohort dashboard + quarterly reports)
- Plus: $2,500/mo (real-time dashboards + custom QI analysis)
- Enterprise: $5,000/mo (full API access + dedicated data scientist)

**Pipeline** (from `institutional/pipeline-tracker.md`):
- 35 targets identified across 4 tiers
- Tier 1 (8 practices): Highest match with pilot criteria
- Tier 2 (12 practices): Regional OB-GYN networks
- Tier 3 (10): Academic medical centers
- Tier 4 (5): National payors and population health orgs

**Go-to-market for institutional:**
1. Pilot practices → case study → Tier 1 outreach
2. Conference presence (ACOG, SMFM) → Tier 2-3
3. Published pilot data → Tier 4

---

## 7. Timeline & Milestones

| Date | Milestone | Owner |
|------|-----------|-------|
| Jul 20-25 | IRB submission (WCG portal) | CEO/CMO (human action) |
| Jul 20-25 | OB-GYN pilot follow-ups (emails + calls) | CEO/CMO (human action) |
| Jul 25 | Pilot practices committed | CMO |
| Jul 25 | Community manager hired | CMO |
| Jul 28 | Pilot kickoff | CMO + CTO |
| Jul 28 | Community seeding begins (Phase 1) | CM |
| Aug 11 | Community Phase 2 begins (soft Firstweeks mentions) | CM |
| Aug 25 | First pilot data snapshot | CTO |
| Sep 11 | Pilot concludes | All |
| Sep 18 | Pilot results + go/no-go | CEO |
| Oct 1 | Phase 1 soft launch (public) | CMO |
| Dec 1 | Phase 2 growth (paid acquisition begins) | CMO |
| Mar 1 | Phase 3 scale | CMO |

---

## 8. Key Metrics Dashboard

### Consumer Metrics
| Metric | Phase 0 | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|---------|
| Active users | 60 (pilot) | 500 | 5,000 | 50,000 |
| Quiz completions/mo | — | 250 | 2,500 | 25,000 |
| Trial starts/mo | — | 50 | 500 | 5,000 |
| Premium subs | — | 50 | 500 | 5,000 |
| MammaSync Plus subs | — | 10 | 100 | 1,000 |
| MRR | $0 | $700 | $7,000 | $70,000 |
| CPA | $0 (organic) | $0-12 | $8-12 | $10-15 |
| Viral coefficient (k) | — | 0.15 | 0.30 | 0.50 |

### Pilot Metrics
| Metric | Target | Actual |
|--------|--------|--------|
| Onboarding completion | ≥85% | — |
| Check-in adherence D7 | ≥70% | — |
| Escalation acceptance | ≥40% | — |
| NPS | ≥50 | — |
| Complications caught | ≥2 | — |

### Institutional Metrics
| Metric | Phase 0-2 | Phase 3 |
|--------|-----------|---------|
| Pilot practices enrolled | 2 | — |
| Pipeline targets | 35 identified | — |
| Paid institutional customers | 0 | 10+ |
| Institutional MRR | $0 | $25,000+ |

---

## 9. Competitive Positioning

| Competitor | Focus | Weakness | Firstweeks Advantage |
|------------|-------|----------|---------------------|
| What to Expect | General parenting | No clinical tracking | AI symptom monitoring |
| BabyCenter | Community + content | No personalization | Personalized daily check-ins |
| Peanut | Social networking | No clinical layer | Clinical-grade screening |
| Mahmee | Postpartum care coordination | Provider-facing only | B2C + B2B dual model |
| Ovia Health | Fertility + pregnancy | Postpartum is afterthought | Built for fourth trimester |

**Firstweeks MOAT:**
1. Clinical-grade AI symptom tracking (not just content/community)
2. OB-GYN referral loop (trusted recommendation)
3. Dual B2C + B2B model (consumer-to-institutional data flywheel)
4. Community-first growth (authentic, not paid)

---

## 10. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Pilot practices don't commit | Medium | Critical | CEO warm intros; fallback to direct consumer pilot |
| IRB delayed beyond Aug | Low | High | WCG IRB is fastest ($4k express track); prepped and ready |
| Community manager hire | Medium | Medium | Phases start before hire using drafted content; automate with Buffer |
| Viral coefficient < 0.15 | Medium | Medium | Lower CPA expectations; Phase 2 remains organic-only longer |
| Competitor launches similar feature | Low | Medium | Firstweeks' clinical validation + community = 6-month head start |
| Privacy concerns from users | Low | High | HIPAA-compliant from day one; transparent data policy in onboarding |

---

*Produced by CMO. Next review: Aug 1, 2026 (post-pilot kickoff).*
