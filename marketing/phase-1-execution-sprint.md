# Phase 1 Marketing Execution Sprint

**Owner:** CMO
**Status:** Ready — gates on pilot practice LOI + CM hire
**Dependencies:** FIR-69 (IRB), FIR-71 (Pilot enrollment), CM hire (FIR-138 consumable)

---

## Overview

All marketing materials are complete. This sprint plan bridges to execution — listing exactly what happens, when, and who does it, starting the moment the pilot greenlight is given.

---

## Sprint 0: Pre-Launch Setup (Week of Pilot LOI)

| # | Action | Owner | Materials Ready | Est. Time |
|---|--------|-------|-----------------|-----------|
| 1 | WCG IRB portal submission (~2h human time) | CEO/CMO | `docs/hipaa-wcg-irb/packet/` — all docs prepared | 2h |
| 2 | Send 5 CMO follow-up emails to priority practices | CMO (human) | `outreach/obgyn-pilot/cmo-followup-emails.md` | 30min |
| 3 | Phone blitz — call 15 practices using scripts | CMO (human) | `outreach/obgyn-pilot/wave2-phone-first-outreach.md` | 2h |
| 4 | Post CM job description & begin screening | CEO | `marketing/community-manager-job-description.md` | 1h |
| 5 | Verify blog posts render correctly on `/blog` | CMO | `apps/web/src/app/blog/` — all 12 posts | 30min |
| 6 | Set up Google Search Console + submit sitemap | CMO | Generate sitemap from blog posts | 1h |
| 7 | Deploy homepage + blog + quiz to production | CTO | Code is ready in staging | 1h |
| 8 | Configure quiz email capture integration (Mailchimp/SendGrid) | CTO | Quiz API route handles email capture | 2h |

**Exit criteria:** 1+ pilot LOI signed, IRB submitted, CM job posted

---

## Sprint 1: Soft Launch (Week 1-2 Post-Pilot LOI)

### Consumer Track

| Day | Action | Owner | Asset |
|-----|--------|-------|-------|
| Mon | Publish Blog Post 1: "The First 6 Weeks" — cross-post to Instagram + FB | CM | `marketing/blog/the-first-6-weeks-...` |
| Mon | Launch quiz lead magnet — promote in 3 new-mom FB groups (non-spam, value-first) | CM | `marketing/pilot-recruitment/community-outreach-templates.md` |
| Tue | Publish Blog Post 2: "PPD vs Baby Blues" — share in mental health circles | CM | `marketing/blog/postpartum-depression-vs-baby-blues.md` |
| Wed | Instagram Reel: "What I wish I knew about the 4th trimester" (UGC-style) | CM | `marketing/social-media-launch-plan.md` |
| Thu | Publish Blog Post 3: "Newborn Feeding Guide" | CM | `marketing/blog/the-ultimate-newborn-feeding-guide.md` |
| Fri | Community thread: "What's your biggest postpartum surprise?" in Firstweeks community | CM | `marketing/community-pivot/phase1-content-drafts.md` |
| Sat-Sun | Respond to all comments + DMs. Track which content resonates. | CM | — |

### Pilot Track

| Day | Action | Owner | Asset |
|-----|--------|-------|-------|
| Mon | Send pilot onboarding kit to signed practice | CMO | `marketing/pilot-onboarding-kit.md` |
| Tue | Schedule practice setup call (tech, champion, recruitment plan) | CMO | Onboarding kit → Section 2 (Setup Checklist) |
| Wed | Activate provider referral flow for practice's patients | CMO | `marketing/provider-onboarding-flow.md` |
| Thu | First patient recruitment push at practice (flyers + handout + OB recommendation) | Practice Champion | `marketing/pilot-recruitment/landing-page-copy.md` |
| Fri | Track pilot enrollment in pipeline tracker | CMO | `outreach/obgyn-pilot/pipeline-tracker.md` |

### Institutional Track (Pre-Pilot)

| Day | Action | Owner | Asset |
|-----|--------|-------|-------|
| Mon | Research contact info for Tier 1 targets #1-5 (Mayo, Cleveland Clinic, Johns Hopkins, Brigham, Northwestern) | CMO | `marketing/institutional/pipeline-tracker.md` |
| Wed | Draft LinkedIn outreach for Tier 1 | CMO | `marketing/institutional/outreach-templates.md` |
| Fri | Prepare data preview deck for when pilot data is available | CMO | `marketing/institutional/pilot-conversion-playbook.md` |

### KPI Tracking

| Metric | Target (Week 1) | Measurement |
|--------|-----------------|-------------|
| Quiz completions | 50+ | `kpi-dashboard-template.md` |
| Email captures | 30+ | Quiz API → DB |
| Blog visitors | 200+ | Google Analytics |
| Instagram followers | +50 | Native analytics |
| Pilot patients enrolled | 5+ | Pipeline tracker |
| Practice satisfaction | NPS ≥ 8 | Weekly check-in with champion |

**Sprint 1 exit:** 5+ pilot patients enrolled, 50+ quiz completes, CM fully ramped

---

## Sprint 2: Community Building (Week 3-4)

| Day | Action | Owner |
|-----|--------|-------|
| Week 3 Mon | Launch referral loop: "Share Firstweeks, get 1 free week of Plus" | CMO + CM |
| Week 3 Tue | Publish Blog Post 4: "How Partners Can Help" + partner-targeted social | CM |
| Week 3 Thu | Firstweek community event: "Ask the OB-GYN" live Q&A | CM + Practice Champion |
| Week 4 Mon | Launch ambassador program — recruit 5 power users | CM |
| Week 4 Wed | Publish case study: pilot patient testimonial (with consent) | CMO |
| Week 4 Fri | Publish Blog Post 5: "Newborn Sleep 101" | CM |

### Sprint 2 Goals

| Metric | Target |
|--------|--------|
| Active referral codes | 25+ |
| Community members | 50+ |
| Pilot patients enrolled | 15+ (of 30 target) |
| Blog subscribers | 100+ |
| MammaSync Plus trial starts | 10+ |

---

## Sprint 3: Growth & Optimization (Week 5-6)

- Launch first A/B test on quiz landing page CTA (per `conversion-optimization-framework.md`)
- Begin Instagram ad experiments ($500 budget for audience testing)
- Publish Blogs 6-9
- Recruit ambassador cohort #1 (5 moms)
- First pilot patient outcome data snapshot for institutional case study

---

## Ongoing Cadence

| Frequency | Action | Owner |
|-----------|--------|-------|
| Daily | Monitor quiz completions, email captures, pilot enrollment | CM |
| Daily | Community engagement (respond to comments, DMs, group posts) | CM |
| Weekly | Blog post publish (per 90-day calendar) | CM |
| Weekly | Instagram Reels (2x/week) | CM |
| Weekly | CMO pipeline review + CEO status update | CMO |
| Bi-weekly | Practice check-in calls | CMO |
| Monthly | Content calendar review + optimization | CMO + CM |
| Monthly | Conversion metrics deep-dive | CMO |

---

## Human-Dependent Bottleneck Log

| Bottleneck | Unblocks | Owner | Status |
|------------|----------|-------|--------|
| WCG IRB portal submission | Institutional outreach (Tier 1) | CEO/CMO | Needs human |
| Pilot LOI signed | Sprint 1 start | CEO/CMO | Needs human |
| CM hired | Sprint 1 consumer track | CEO | Needs human |
| Pilot follow-up calls | Sprint 0 completion | CMO | Needs human |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Pilot enrollment < 5 by Sprint 2 | Medium | High | Activate OB referral scripts; offer $25 incentive per enrolled patient |
| Quiz conversion < 5% to email | Low | Medium | A/B test CTA copy; add social proof (testimonial) |
| Community manager ramp > 2 weeks | Medium | Medium | Pre-record SOP walkthrough; buddy with CMO for week 1 |
| IRB takes > 4 weeks | Medium | High | File as exempt; call WCG for status weekly |
| Blog traffic < 100/week | Low | Low | SEO optimization pass; cross-post to Medium |

---

*Prepared by CMO. Gates on pilot LOI, IRB submission, and CM hire.*
