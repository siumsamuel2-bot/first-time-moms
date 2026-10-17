# Session Operations Guide — Internal Use

**Owner:** UX Designer
**Purpose:** Step-by-step internal process for running usability testing sessions once unblocked. Not for external distribution.

---

## 1. Pre-Run Checklist

### 1.1 Recruitment Confirmed
- [ ] Practice partner(s) signed BAA
- [ ] IRB exempt determination received (FIR-69)
- [ ] Screening survey live (Typeform/Google Forms)
- [ ] Minimum viable cohort confirmed (n >= required)
- [ ] Backup participants identified (2 extra)

### 1.2 Materials Ready
- [ ] Consent form finalized (`docs/consent-form-template.md`)
- [ ] Session recording setup tested (Zoom/Meet)
- [ ] Prototype or alpha build accessible
- [ ] Crisis resource card ready (988, PSI)
- [ ] Gift card funding confirmed
- [ ] Moderator guide printed/available

### 1.3 Logistics
- [ ] Scheduling link shared with participants (Calendly)
- [ ] Reminder cadence configured (48h → 24h → 1h)
- [ ] Evening/weekend slots available
- [ ] Backup device charged and ready
- [ ] Note-taker assigned per session

---

## 2. Session Day Procedure

### 2.1 Pre-Session (15 min before)
- [ ] Test audio/video/screen share
- [ ] Open moderator guide and session template
- [ ] Open recording tool (OBS or Zoom local recording)
- [ ] Review participant screener data
- [ ] Crisis resource card on screen-ready

### 2.2 Session Flow
| Segment | Duration | Key Actions |
|---------|----------|-------------|
| Welcome & consent | 5 min | Build rapport, explain no judgment, get consent, confirm recording, remind "you can stop anytime" |
| Warm-up | 5 min | Broad questions about postpartum experience — sets natural tone |
| Task scenarios | 30-40 min | Present tasks per test plan, think-aloud protocol, probe minimally |
| Debrief | 5-10 min | Overall impressions, likelihood to recommend, open feedback |
| Close | 2 min | Gift card delivery confirmation, crisis resource card share, thank you |

### 2.3 Moderator Do's and Don'ts
**Do:**
- Pause after the participant answers — they may have more to say
- Ask "What makes you say that?" to uncover reasoning
- Thank the participant for negative feedback — it's more valuable than praise
- Remind "we're testing the design, not you" if participant seems self-critical

**Don't:**
- Lead the participant ("Don't you think this is clear?")
- Explain the design intent during the task ("We designed it this way because...")
- Rescue the participant if they're stuck — observe what they do naturally
- Scroll too fast through screens — wait for participant to finish processing

### 2.4 Distress Protocol
If participant shows signs of distress (crying, shaking, sudden quiet, verbal alarm):
1. **Pause** — stop the task immediately
2. **Check in** — "How are you feeling right now?"
3. **Offer options** — "We can take a break, skip this section, or stop entirely."
4. **Crisis resources** — show crisis resource card (988, PSI)
5. **Do not leave them alone** — stay on call until they're stable
6. **Document** — note the distress episode in session template
7. **Follow up** — send crisis resources again via email within 24 hours

---

## 3. Post-Session Actions

### 3.1 Immediate (within 1 hour)
- [ ] Send gift card (if not already set up)
- [ ] Write 5-min post-session memo (free-write impressions before they fade)
- [ ] Log session in tracking spreadsheet
- [ ] Set recording file naming: `FIR174_P[ID]_[YYYY-MM-DD].mp4`
- [ ] Upload recording to encrypted drive

### 3.2 Within 24 Hours
- [ ] Annotate session template with key quotes and observations
- [ ] Flag critical issues to engineering (if any)
- [ ] Send follow-up email to participant with resources + thank you

### 3.3 Within 1 Week
- [ ] Transcribe recording (rev.com or manual for key segments)
- [ ] Add insights to affinity diagram (Miro board)
- [ ] Code quotes by theme
- [ ] Update synthesis template

---

## 4. Session Tracking Spreadsheet

Maintain a shared spreadsheet with columns:

| Session ID | Participant ID | Date | Time | Moderator | Note-taker | Flow Tested | Key Finding | Critical Issues? | Gift Card Sent | Recording Filed | Transcript Done |
|-----------|---------------|------|------|-----------|------------|-------------|-------------|-----------------|---------------|----------------|-----------------|

---

## 5. Issue Severity Classification

| Severity | Definition | Action Required |
|----------|-----------|----------------|
| **P0 — Critical** | User cannot complete task; clinical risk; causes panic | Stop and redesign before next session |
| **P1 — Major** | User can complete but with significant friction or confusion | Fix before pilot launch |
| **P2 — Minor** | User notices but adapts; cosmetic or preference issue | Fix post-pilot or backlog |
| **P3 — Enhancement** | Suggestion that improves experience but not required | Log for roadmap |

---

## 6. Escalation UX — Special Handling

Per `research/anxiety-sensitivity-validation-protocol.md`:

- Administer STAI-6 before and after each escalation scenario
- Monitor panic indicators checklist (verbal alarm, visible distress, hesitation >10s, negative misinterpretation)
- Scenario D (crisis flow) is optional — skip if participant shows any distress
- Track STAI-6 change scores per scenario across all participants
- Report any panic response immediately to CEO

Go/no-go criteria: if >20% panic response at any escalation layer, escalation flow must be redesigned before pilot.

---

## 7. Communication Templates

### 7.1 Participant Confirmation Email
Subject: Session Confirmed — Firstweeks Usability Study

Body: Date/time, Zoom link, what to expect, consent form link, reminder about gift card.

### 7.2 Gift Card Delivery
Subject: Thank You! Your Firstweeks Gift Card

Body: $X gift card link, crisis resources, contact info.

### 7.3 Critical Issue Alert to CEO/CTO
Slack/Email: "P0 issue found in [screen/flow]: [description]. Participant [ID] experienced [symptom]. Recommend [immediate action]."

---

## 8. Session Environment Requirements

| Requirement | Setup |
|------------|-------|
| Quiet space | Moderator should be in a private room; participant encouraged to find quiet space |
| Baby presence | Welcome — explicitly tell participants "baby can join, no need to arrange childcare" |
| Recording quality | Minimum 720p, stereo audio; test before each session |
| Backup connection | Mobile hotspot ready in case of internet drop |
| Screen sharing | Participant shares phone or desktop; have both options ready |
| Time zone | Confirm participant's time zone before scheduling |

---

## 9. Iteration Loop

After each 3-4 sessions, pause to review findings before continuing:
1. Review session notes and recordings
2. Identify emerging patterns
3. Adjust moderator guide if questions aren't working
4. Fix critical UX issues before next batch
5. Continue with remaining participants

---

**Document Owner:** UX Designer
**Last Updated:** July 23, 2026
**Status:** Ready for use once unblocked

**Related Docs:**
- `docs/user-testing-plan.md` — Full test plan
- `docs/phase-1-session-template.md` — Session notes template
- `docs/phase-1-recruitment-kit.md` — Recruitment materials template
- `research/anxiety-sensitivity-validation-protocol.md` — Escalation UX sub-protocol
- `research/interview-guide.md` — Interview guide
- `research/recruitment-screener.md` — Screener survey
- `research/synthesis-template.md` — Synthesis template
- `research/findings-report-template.md` — Findings report template
