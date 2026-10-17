# User Testing Plan — Firstweeks Pilot

**To:** CEO, CTO, CMO
**From:** UX Designer
**Date:** July 23, 2026 (Updated from v1 June 5, 2026)

---

## Overview

This document outlines the user testing strategy for the Firstweeks pilot. We validate UX decisions with real first-time mothers and OB-GYN providers. Phase 1 concept validation (8 mothers) was completed in June 2026. Phase 2 usability testing and Phase 3 pilot are current focus.

## Testing Phases

### Phase 1: Concept Validation (Complete — June 2026)
**Timeline:** Completed June 2026
**Participants:** 8 first-time mothers (0-6 months postpartum)
**Method:** Remote moderated sessions using wireframe prototypes

**Outcome:** All escalation UX patterns validated for anxiety sensitivity. Research materials transferred to `research/` directory. Findings incorporated into wireframe iterations.

---

### Phase 2: Usability Testing (Alpha Build)
**Timeline:** TBD — blocked on CTO P0/P1 implementation
**Participants:** 12 first-time mothers + 4 OB-GYN providers
**Method:** Remote moderated sessions using alpha build

**Goals:**
- Validate task completion rates for core flows
- Measure time-on-task for onboarding (<5 min target)
- Test accessibility (touch targets, contrast, screen reader compatibility)
- Validate clinician dashboard triage workflow

**Tasks for Mothers:**
| # | Task | Success Metric |
|---|------|----------------|
| 1 | Complete onboarding | <5 min, no errors |
| 2 | Respond to daily check-in notification | <2 min, all questions answered |
| 3 | Find and use "Get Support" button | <30 sec to locate |
| 4 | Complete extended assessment | >80% completion rate |
| 5 | Review provider matches | Can explain differences between 3 providers |

**Tasks for Clinicians:**
| # | Task | Success Metric |
|---|------|----------------|
| 1 | Log in and view dashboard | <30 sec |
| 2 | Identify highest-priority patient | 100% accuracy |
| 3 | Send warm referral | <60 sec |
| 4 | Send message to patient | <45 sec |
| 5 | Mark patient as reviewed | <10 sec |

**Metrics to Track:**
- **Task success rate:** Target >85%
- **Time on task:** Compare to targets above
- **Error rate:** <5% of interactions
- **SUS (System Usability Scale):** Target >75
- **SEQ (Single Ease Question):** Target >6/7 per task

**Deliverables:**
- Quantitative dashboard (success rates, time-on-task)
- Heatmaps of click patterns
- Issue severity matrix (critical/major/minor)
- Recommended fixes before pilot

---

### Phase 3: Pilot Study (30 Mothers, 2 Practices)
**Timeline:** Target Aug-Sep 2026 (6-week pilot)
**Participants:** 30 first-time mothers (0-6 weeks pp) + 2 OB-GYN practices
**Method:** Longitudinal field study with in-app analytics + weekly surveys

**Goals:**
- Validate engagement patterns over time
- Measure escalation trigger accuracy
- Assess clinical workflow integration
- Identify edge cases not caught in lab testing
- Collect real-world postpartum symptom data

**Recruitment:**
- Partner with 2 pilot OB-GYN practices (CMO-led)
- Each practice recruits ~15 patients
- Incentive structure TBD (see CMO budget approval)

**Data Collection:**
| Source | Frequency | Metrics |
|--------|-----------|---------|
| In-app analytics | Continuous | Check-in completion rate, time-of-day patterns, escalation acceptance rate |
| Weekly survey (mothers) | Every 7 days | EPDS trend, app satisfaction (1-5), "Would you recommend?" |
| Clinician feedback | Weekly 15-min call | Workflow fit, false positive rate, referral quality |
| Support tickets | Continuous | Bug reports, feature requests, confusion points |

**Success Criteria for Pilot:**
| Metric | Target | Stretch |
|--------|--------|---------|
| Day 1 onboarding completion | >85% | >95% |
| Daily check-in adherence (day 7) | >70% | >80% |
| Escalation acceptance rate (when flagged) | >40% | >65% |
| Provider referral completion | >30% | >50% |
| NPS (mothers, exit survey) | >40 | >60 |
| Clinician satisfaction | >4/5 | >4.5/5 |
| Early complication caught | ≥1 | ≥3 |

**Edge Cases to Monitor:**
- Users who skip onboarding questions
- Users who miss 3+ consecutive check-ins
- Users who decline all escalation offers
- Clinicians who ignore dashboard alerts
- Technical failures (push notification delivery, API timeouts)
- Baby-related vs. mother-related symptom confusion

**Deliverables:**
- Pilot outcomes report with all metrics
- User quotes and case studies
- Prioritized product backlog for post-pilot
- Go/no-go recommendation for launch

---

## Recruitment Strategy

### For Mothers (Phase 2 & 3)
1. **Partner with OB-GYN practices:** Pilot clinics share study flyer with eligible patients (CMO-led)
2. **Social media:** Instagram/Facebook ads targeting "new mothers" + "postpartum" interests (CMO-led)
3. **What to Expect community:** Post in forums (with moderator approval)
4. **Referral:** Snowball sampling from enrolled participants (up to 2 per participant)

**Incentive Structure (Pending CEO Budget Approval):**
- Phase 2 (usability): $100 gift card per session
- Phase 3 (pilot): $25-50/week per participant

**Screening Survey:**
```
1. Is this your first baby? (yes/no)
2. How old is your baby? (weeks/months)
3. What type of delivery did you have? (vaginal/C-section)
4. How are you feeding your baby? (breast/formula/both)
5. Have you ever been diagnosed with anxiety or depression? (yes/no/prefer not to say)
6. What state do you live in?
7. Would you be comfortable sharing your screen on a video call? (yes/no)
```

### For Clinicians (Dashboard Validation)
1. **Target list outreach:** Pilot practices (CMO-led)
2. **Incentive:** Free platform access during pilot + co-authorship on outcomes paper

---

## Anxiety-Sensitive Escalation Design Validation

Escalation UX is Firstweeks' highest clinical risk. Dedicated sub-protocol documented separately:

- **Protocol:** `research/anxiety-sensitivity-validation-protocol.md`
- **Participants:** 5-8 first-time mothers (added to Phase 2 cohort)
- **Safeguards:** STAI-6 pre/post measurement, crisis protocol, optional crisis scenario
- **Success threshold:** <15% panic response at any escalation layer

Go/no-go escalation criteria documented in the protocol — escalation flow is **red** if >20% panic response occurs during testing.

---

## Accessibility Testing

### WCAG 2.1 AA Compliance Checklist
- [ ] All text meets 4.5:1 contrast ratio (P0 — CTO)
- [ ] Touch targets ≥44x44px (P0 — CTO)
- [ ] Screen reader compatibility (VoiceOver, TalkBack) (P1)
- [ ] Keyboard navigation support (for web) (P1)
- [ ] Focus indicators visible (P1)
- [ ] Color is not sole means of conveying information (P0 — CTO)
- [ ] Error messages are descriptive and actionable (P1)
- [ ] Form labels are persistent (not placeholder-only) (P1)

**Testing Tools:**
- axe DevTools (browser extension)
- WAVE (web accessibility evaluation tool)
- Manual screen reader testing with NVDA + VoiceOver
- Color contrast analyzer

**Participants with Disabilities:**
- Recruit 2 participants with visual impairments for Phase 2
- Recruit 2 participants with motor impairments (test touch target sizes)

---

## Ethical Considerations

### Informed Consent
- Written consent form for all participants — template at `docs/consent-form-template.md`
- Clear explanation of data usage (HIPAA compliance)
- Right to withdraw at any time without penalty
- Separate consent for video recording

### Mental Health Safeguards
- All participants receive crisis resources upfront (988 Lifeline, Postpartum Support International)
- If participant indicates suicidal ideation during testing: pause session, provide resources, offer to connect with clinician
- Moderator trained in Mental Health First Aid
- IRB exempt determination pending (CMO — FIR-69)

### Privacy
- All data de-identified for analysis
- Video recordings stored on encrypted drive
- Participants assigned ID numbers (P01, P02, etc.)
- No real patient data in testing environment

---

## Timeline

| Milestone | Target | Dependencies | Owner |
|-----------|--------|-------------|-------|
| CTO P0/P1 implementation complete | TBD | Engineering sprints | CTO |
| Phase 2 usability sessions | +2 weeks from CTO complete | CTO build, CMO recruitment | UX + CMO |
| Phase 2 analysis | +1 week from sessions | Session recordings | UX |
| Pilot launch (Phase 3) | +1 week from Phase 2 | Phase 2 pass, practice readiness | All |
| Pilot duration (6 weeks) | 6 weeks from launch | Patient enrollment | All |
| Pilot analysis + go/no-go | +2 weeks from pilot end | Full dataset | UX + CEO |

**Note:** Pilot currently blocked on CTO P0/P1 fixes (6 items: red colors, warning icons, missing dismiss options, dead navigation) and CMO OB-GYN practice partnerships.

---

## Budget

| Item | Cost | Status |
|------|------|--------|
| Phase 2 incentives (12 × $100 + 4 × $100) | $1,600 | Pending CEO approval |
| Phase 3 incentives (30 participants) | TBD | Pending CEO + CMO |
| Recruitment ads (Instagram/Facebook) | $500 | Pending CMO |
| Transcription service (rev.com) | $400 | Available |
| UserTesting.com subscription (3 months) | $900 | Not yet purchased |
| **Total estimated** | **~$14,000** | **Pending approvals** |

**Note:** Pilot incentive budget ($350) documented in FIR-174 requires CEO approval. Does not include staff time.

---

## Next Steps

1. **CEO approval:** Confirm budget and timeline
2. **CMO coordination:** Begin recruitment for Phase 1
3. **Legal review:** Consent forms, HIPAA compliance
4. **Tool setup:** UserTesting.com account, analytics infrastructure
5. **Team training:** Research ethics, mental health first aid

---

## Appendix A: Consent Form Template

```
FIRSTWEEKS USER STUDY CONSENT FORM

Study Title: Firstweeks Postpartum App Usability Testing
Principal Investigator: [Name]
Contact: [Email/Phone]

Purpose:
You are invited to participate in a research study to test the Firstweeks app, 
a postpartum recovery support tool. Your feedback will help improve the app 
for future users.

Procedures:
- You will be asked to complete tasks using the Firstweeks app
- Your screen and voice will be recorded
- You will complete a brief survey after the session
- Session duration: 60 minutes

Risks:
- Some questions may touch on sensitive emotional topics
- You may skip any question or stop at any time
- Crisis resources will be provided

Benefits:
- You will receive a $75 Amazon gift card
- Your feedback will improve postpartum care for other mothers

Confidentiality:
- Your data will be de-identified
- Recordings stored on encrypted drives
- Only research team will have access

Voluntary Participation:
- Your participation is voluntary
- You may withdraw at any time without penalty

By signing below, you consent to participate in this study.

Signature: ________________________  Date: __________
Print Name: _______________________
```

---

## Appendix B: Moderator Guide (Phase 1)

### Opening Script (5 min)
"Hi [Name], thank you so much for joining us today. My name is [Moderator], and I'll be facilitating this session. 

Today we're testing an app called Firstweeks — it's designed to support first-time mothers in the postpartum period. We want to make sure it feels helpful, not overwhelming.

A few things to know:
- We're testing the design, not you. If something is confusing, that's on us, not you.
- There are no right or wrong answers. We want your honest reaction.
- You can pause or stop at any time.
- Some questions are about emotions — if anything feels uncomfortable, just say 'pass' and we'll move on.

Do you have any questions before we begin?"

### Warm-Up Questions (5 min)
1. "Tell me about your experience as a new mom — what's been the biggest surprise?"
2. "What apps or tools have you found helpful since becoming a parent?"
3. "How do you typically prefer to receive health information — app, website, in-person, phone calls?"

### Task Scenarios

**Task 1: Onboarding (20 min)**
"Imagine you just got home from the hospital with your baby. A friend recommended this app. Let's walk through setting it up."

[Share screen with Welcome wireframe]
- "What's your first impression?"
- "What would you expect to happen next?"

[Progress through 6 onboarding screens]
- "How are you feeling about the length?"
- "Are any questions confusing or uncomfortable?"
- "At what point would you want to stop?"

**Task 2: Daily Check-In (15 min)**
"It's day 5. You're holding your baby at 10 AM and you get a notification from the app."

[Show notification mockup]
- "What would you do?"

[Show check-in flow]
- "How long would you be willing to spend on this?"
- "Are these questions you'd actually want to answer?"

**Task 3: Escalation (15 min)**
"Let's imagine you've had a tough week. The baby hasn't been sleeping, you're feeling overwhelmed. The app notices and sends you this message."

[Show Warm Check-In screen]
- "How does this make you feel?"
- "Would you want to continue, or would this feel intrusive?"
- "What would make you more likely to accept support?"

[If yes to provider referral]
[Show Provider Matching screen]
- "How would you decide which provider to choose?"

**Task 4: Debrief (5 min)**
- "What was the most helpful part?"
- "What was the most frustrating part?"
- "On a scale of 1-10, how likely would you be to recommend this to a friend? Why?"
- "Is there anything you wish the app did that it doesn't?"

### Closing
"Thank you so much. Your feedback is incredibly valuable. Here's how you'll receive your gift card. If you have any thoughts later, here's my email. We really appreciate your time!"

---

## Appendix C: Clinician Interview Guide

**Context:** 30-min semi-structured interview with OB-GYN providers

1. "Tell me about your current postpartum follow-up process."
2. "What's the hardest part about identifying patients who need extra support?"
3. "How do you currently decide when to refer to mental health specialists?"
4. [Show clinician dashboard wireframe] "How would this fit into your workflow?"
5. "What information do you need at a glance to triage patients?"
6. "What would make you more or less likely to use this tool?"
7. "What are your concerns about patient-facing escalation features?"
8. "How would you want to be notified about high-priority patients?"
9. "What's your ideal referral workflow?"
10. "Would you use this in your practice? What would it take?"

---

**Document Owner:** UX Designer
**Last Updated:** June 5, 2026
**Next Review:** After Phase 1 testing (Week 3)