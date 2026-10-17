# Anxiety Sensitivity Validation Protocol — FIR-89

**To:** CEO, CTO, CMO
**From:** UX Designer
**Date:** July 7, 2026
**Related:** [docs/user-testing-plan.md](/docs/user-testing-plan.md) (Phase 1 sub-protocol)

---

## Objective

Validate that Firstweeks' escalation UI does not trigger anxiety or panic in first-time mothers. This is a dedicated sub-study within Phase 1 concept validation, focused specifically on the anxiety-sensitive touchpoints of the app.

**Primary question:** Does the escalation flow cause false alarm or distress?

**Secondary questions:**
- Do mothers understand why the app is surfacing concern?
- Do they trust the recommendation and feel supported rather than diagnosed?
- Would they act on a warm referral?

---

## Participants

**Target:** 5-8 first-time mothers

### Recruitment Criteria

| Criterion | Target |
|-----------|--------|
| First-time mothers | 100% |
| Postpartum window | 0-12 weeks |
| Delivery type | Mixed: 50-75% vaginal, 25-50% C-section |
| Feeding method | Mixed: breast, formula, both |
| Age range | 25-40 |
| Mental health history | Include 1-2 participants with prior anxiety/depression history |
| Geographic | At least 2 states (to test referral availability perception) |

**Recruitment source:** Coordinate with CMO and pilot OB-GYN practices. Use the screening survey from [docs/user-testing-plan.md](/docs/user-testing-plan.md) with one addition: "Have you ever been diagnosed with anxiety or panic disorder?" (for stratified analysis).

**Incentive:** $75 gift card per participant (same as Phase 1).

---

## Test Scenarios

Three escalation layers are tested sequentially, each building on the previous. Each scenario is framed as a narrative to preserve ecological validity.

### Scenario A: Warm Check-In (Low-to-Medium Trigger)

**Narrative:** _"It's day 10 since you had your baby. You've had a few rough nights in a row — the baby is cluster-feeding and you're running on very little sleep. You open your daily check-in and see this message."_

**Screen tested:** Warm Check-In (Screen 1 from escalation wireframes)

**UX to validate:**
- _"We've noticed your recovery has been a bit tougher this week. You're not alone."_
- Binary choice: "Yes, I'm open to it" / "Not right now"

**Anxiety probes:**
- Pre-scenario: STAI-6 state anxiety self-report
- Post-scenario: STAI-6 state anxiety self-report
- "On a scale of 1-5, how concerning did this message feel?" (1 = not at all, 5 = very concerning)
- "What do you think the app is trying to tell you?" (free-text, comprehension check)
- "If you saw this at 3 AM while holding your baby, how would you feel?"

### Scenario B: Connection Offer (Medium Trigger)

**Narrative:** _"You answered the extra questions. Now the app shows you this next screen."_

**Screen tested:** Connection Offer (Screen 3 from escalation wireframes)

**Paths tested:**
- Path B1: User accepts ("Yes, please connect me")
- Path B2: User declines ("Not right now")

**UX to validate:**
- _"Based on what you've told us, we think you might benefit from talking with someone who specializes in postpartum care."_
- Followed by provider cards (Path B1) or reassurance + dashboard return (Path B2)

**Anxiety probes:**
- Pre-scenario: STAI-6
- Post-scenario: STAI-6
- "How did this message make you feel — supported, worried, judged, or something else?"
- "Do you understand why the app is suggesting this?"
- "Would this make you more or less likely to continue using the app?"
- Path B2 only: "Did declining feel okay, or did you feel pressured?"
- Comprehension check: "What would happen next if you said yes?"

### Scenario C: Provider Referral (Action Path)

**Narrative:** _"You said yes to getting connected. Here's what the app shows you next."_

**Screen tested:** Provider Matching + Referral Confirmation (Screens 4-5 from escalation wireframes)

**UX to validate:**
- Provider cards with name, photo, credentials, distance, insurance
- "Select" action to initiate referral
- Confirmation screen with "Referral sent!" + provider will reach out within 24 hours

**Anxiety probes:**
- Pre-scenario: STAI-6
- Post-scenario: STAI-6
- "How do you feel about a provider reaching out to you based on app data?"
- "Would you actually call or wait for them to contact you?"
- "What questions would you have before going through with a referral?"
- Trust check: "On a scale of 1-5, how much would you trust these provider recommendations?"

### Scenario D: Crisis Flow (Critical Trigger)

**Narrative:** _"This is a screen we hope very few people ever see. But we need to make sure it feels right. Imagine you've told the app you're having thoughts of harming yourself."_

**Screen tested:** Critical Escalation (Screen 6 from escalation wireframes)

**UX to validate:**
- _"You matter. Help is available right now."_
- Crisis resources: 988 Lifeline, Crisis Text Line
- Footer: "A clinician has also been notified"

**Anxiety probes (carefully moderated — see safeguards):**
- Pre-scenario: STAI-6
- Post-scenario: STAI-6
- "Does this screen feel calming or alarming?"
- "Would you use these resources?"
- "How does knowing a clinician was auto-notified make you feel?"
- "Is there anything on this screen that would make you hesitate to reach out?"

**Important:** This scenario is optional. If the participant shows any sign of distress during earlier scenarios, skip Scenario D. The moderator makes the call.

---

## Session Structure

**Total time:** 45-60 minutes per participant
**Format:** Remote moderated (Zoom/Google Meet), screen sharing
**Recording:** With consent (video + audio + screen)

| Segment | Duration | Activity |
|---------|----------|----------|
| Welcome & consent | 5 min | Build rapport, explain no judgment, review consent, share screen |
| Warm-up | 3 min | "Tell me a bit about your postpartum experience so far." |
| Scenario A: Warm Check-In | 8 min | STAI-6 pre → present wireframe → STAI-6 post → probe questions |
| Scenario B: Connection Offer | 10 min | STAI-6 pre → present B1 & B2 paths → STAI-6 post → probe questions |
| Scenario C: Provider Referral | 10 min | STAI-6 pre → present matching + confirmation → STAI-6 post → probe |
| Scenario D: Crisis Flow (optional) | 8 min | STAI-6 pre → present crisis screen → STAI-6 post → probe |
| Debrief | 5-10 min | Overall impressions, trust, likelihood to recommend, closing |
| Resources | 2 min | Provide crisis resource card (988, PSI) regardless of content |

---

## Metrics

### Primary Metrics

| Metric | Instrument | Target |
|--------|------------|--------|
| Panic/anxiety response | STAI-6 (pre/post per scenario) + behavioral observation | <15% clinically significant anxiety increase at any layer |
| Comprehension of referral intent | Post-scenario free-text coded by researcher | >80% correctly state "app is connecting me to professional support" |
| Likelihood to act on warm referral | 5-point Likert | >70% would act (rating 4-5) |

### Secondary Metrics

| Metric | Instrument | Target |
|--------|------------|--------|
| Perceived support vs. alarm | 5-point semantic differential | Mean >4.0 toward "supportive" |
| Trust in recommendation | 5-point Likert | Mean >3.5 |
| Panic indicators (behavioral) | Moderator notes: hesitation, visible distress, verbal "this scares me" | <15% at any layer |
| Feature understanding | Free-text comprehension coding | >90% understand what each escalation layer offers |
| Would decline escalation vs. feel relief | Binary + rationale | Qualitative report |

### Panic Indicators (Moderator Checklist)

Moderator marks ticks during session:

- [ ] Verbal statement of fear/panic/alarm
- [ ] Visible distress (crying, shaking, sudden quiet)
- [ ] Request to stop or skip
- [ ] Hesitation >10s before responding to screen
- [ ] Negative misinterpretation ("they think I'm crazy")
- [ ] Concern about data privacy related to screening

---

## Analysis Plan

### Quantitative

1. Compute STAI-6 change scores (post - pre) for each scenario per participant
2. Flag participants with STAI-6 increase >1 SD as "anxiety responders"
3. Calculate proportion of panic indicators per scenario
4. Aggregate Likert ratings across participants

### Qualitative

1. Transcribe session recordings (via rev.com)
2. Code free-text responses for themes:
   - **Trust:** "I trust them" / "They seem to know what they're doing"
   - **Alarm:** "This is scary" / "I'd be worried"
   - **Confusion:** "I don't understand why they're asking"
   - **Relief:** "I'm glad someone noticed" / "This is helpful"
   - **Stigma:** "I'd feel judged" / "They're labeling me"
3. Build affinity diagram of emotional responses per escalation layer

### Report Structure

1. Executive summary with go/no-go recommendation
2. Per-scenario quantitative results (STAI-6, Likert, panic rate)
3. Qualitative themes with representative quotes
4. Comparison across escalation layers (does anxiety decrease or increase with each step?)
5. Risk assessment: which UX patterns need redesign before pilot
6. Recommended changes to escalation UI, language, or flow
7. Revised success criteria for Phase 2

---

## Success Criteria

| Criterion | Minimum | Stretch |
|-----------|---------|---------|
| Panic response at any escalation layer | <15% of participants | <5% |
| Comprehension of referral intent | >80% | >95% |
| Would act on warm referral | >70% | >85% |
| STAI-6 increase at Warm Check-In (Scenario A) | <0.5 SD mean change | <0.2 SD |
| STAI-6 increase at Connection Offer (Scenario B) | <0.5 SD mean change | <0.3 SD |
| Perceived support score (across all layers) | >4.0 / 5.0 | >4.5 / 5.0 |

**Go/No-Go Decision Rules:**
- **Red (stop):** >20% panic response at any layer OR STAI-6 mean increase >1 SD at Warm Check-In → redesign escalation flow before proceeding
- **Yellow (proceed with changes):** 15-20% panic response OR comprehension <70% → modify specific screens and retest
- **Green (proceed):** All criteria met → advance to Phase 2 usability testing

---

## Participant Safeguards

### Pre-Session

- All participants receive crisis resource card upon scheduling (988 Lifeline, Postpartum Support International)
- Moderator reviews mental health first aid protocol before each session
- Participant is reminded: "You can skip any question or stop at any time"

### During Session

- Moderator monitors for distress signals (see panic indicators checklist)
- If participant shows significant distress: pause, offer water, ask if they want to continue
- If participant indicates suicidal ideation during session: activate crisis protocol (provide resources, offer to connect with clinician, do not leave them alone)
- Scenario D (crisis flow) is optional — moderator decides based on participant state

### Post-Session

- All participants receive crisis resource card again (email follow-up)
- Moderator debriefs with participant: "How are you feeling? Is there anything you want to talk about?"
- 24-hour follow-up email with resources and thank-you

### Moderator Requirements

- Minimum: Mental Health First Aid certification (8-hour course)
- Preferred: Clinical background or experience with sensitive user research
- At least 2 moderators for the study (can debrief with each other)

---

## Materials Needed

1. **Wireframe prototypes** (Figma or interactive PDF): All 6 escalation screens
2. **STAI-6 forms** (digital, administered via simple survey tool)
3. **Consent form** (from [docs/user-testing-plan.md](/docs/user-testing-plan.md) Appendix A)
4. **Moderator guide** (this protocol in condensed form)
5. **Crisis resource card** (printed PDF for screen share + email)
6. **Recording setup** (Zoom/Meet with cloud recording + local backup)
7. **Data tracking sheet** (participant ID, demographics, STAI-6 scores per scenario, panic indicators)

---

## Timeline

| Activity | Owner | Duration |
|----------|-------|----------|
| Finalize protocol + get approval | UX Designer | Day 1 |
| Recruit 5-8 participants (via CMO + pilot clinics) | CMO | Days 2-7 |
| Schedule sessions | UX Designer | Days 5-8 |
| Run sessions (5-8 × 60 min) | UX Designer + co-moderator | Days 8-12 |
| Transcribe recordings | rev.com | Days 12-14 |
| Analyze data (quant + qual) | UX Designer | Days 14-18 |
| Write report + recommendations | UX Designer | Days 18-20 |
| Present to CEO + team | UX Designer | Day 21 |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Participant becomes distressed during session | Medium | High | Moderator trained in MHFA; crisis protocol; optional Scenario D |
| Small sample (n=5-8) limits statistical power | High | Medium | Focus on qualitative themes + effect sizes, not p-values |
| Recruitment delays (hard to find 0-12 week postpartum mothers) | High | Medium | Start recruitment early; offer flexible scheduling; use OB-GYN practices |
| Participant misunderstands wireframes as real app | Low | Medium | Clear framing: "These are rough mockups, not a real app" |
| Social desirability bias (participants under-report anxiety) | Medium | Medium | Anonymous STAI-6 (participant ID only); moderator emphasizes honesty |

---

## Related Documents

| Document | Link |
|----------|------|
| Full user testing plan | [docs/user-testing-plan.md](/docs/user-testing-plan.md) |
| Escalation wireframes | [docs/wireframes-escalation.md](/docs/wireframes-escalation.md) |
| User journeys (escalation flow) | [docs/user-journeys.md](/docs/user-journeys.md) |
| UX research (personas, design principles) | [docs/ux-research.md](/docs/ux-research.md) |
| UX status report | [docs/ux-status-report.md](/docs/ux-status-report.md) |
| Consent form template | [docs/user-testing-plan.md](/docs/user-testing-plan.md#appendix-a-consent-form-template) |

---

**Document Owner:** UX Designer
**Last Updated:** July 7, 2026
**Next Review:** After sessions complete (Day 21)
