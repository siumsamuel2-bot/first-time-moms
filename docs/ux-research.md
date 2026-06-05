# UX Research — Firstweeks: Postpartum App for First-Time Mothers

## Primary Persona: Maya Chen

**Demographics:** 31 years old, lives in Austin TX, marketing manager, married.

**Motherhood context:** Gave birth to her first child (daughter) 3 days ago via unplanned C-section after 28 hours of labor. Currently breastfeeding but struggling with latch. Sleeping in 45-minute increments. Has not left the house since returning from hospital.

**Technographic:** Heavy iPhone user, uses Instagram and What to Expect app, prefers apps that "just work" without manuals. Anxious about doing everything wrong.

**Emotional state:** Exhausted, overwhelmed with visitors, feels guilty she's not enjoying every moment. Has had two crying spells today. Would not self-identify as depressed ("I'm just tired").

**Frustrations:**
- Pediatrician discharge papers are overwhelming — conflicting advice everywhere
- Google searches about baby symptoms lead to worst-case scenarios
- Partner tries to help but doesn't understand what she's feeling physically
- Her mom says "just sleep when the baby sleeps" — impossible and patronizing

**What she needs from Firstweeks:**
- Permission to feel what she's feeling without judgment
- Targeted, relevant questions — not generic "how are you?" checklists
- Clear action only when something actually needs attention
- A feeling that someone knowledgeable is watching her back

## Secondary Persona: Dr. Sarah Okonkwo

**Demographics:** 45 years old, OB-GYN, runs a practice with 3 other providers in Chicago.

**Context:** Signed up for the Firstweeks pilot to improve postpartum follow-up. Currently her practice calls every patient at 2 weeks and 6 weeks — but most issues surface before the 2-week call.

**Needs from clinician dashboard:**
- At-a-glance view of which patients are flagging
- Enough context to triage without reading charts
- Warm referral workflow — send a vetted provider name to the patient instantly

## Guiding Design Principles

1. **Safety over engagement.** Never optimize for retention at the cost of causing anxiety. If there's nothing to report, the app should say "you're doing fine" and get out of the way.

2. **Clinical credibility without clinical coldness.** Warm language, but never dismissive. Avoid toxic positivity ("you've got this, mama!").

3. **Reduce cognitive load.** Postpartum brain fog is real. Every screen should need the minimum possible decisions. Default to the gentlest option.

4. **Escalation without alarm.** The app will sometimes need to alert a mother. The framing must be: "We've noticed something — let's get you connected with someone who can help." Not: "WARNING: DEPRESSION DETECTED."

5. **Progressive disclosure.** Collect information in small, natural steps. Never ask for everything at once.

## Key UX Risks

| Risk | Mitigation |
|------|-----------|
| False positives in escalation cause panic | Use warm referral language, never clinical warnings; frame as "let's connect you" |
| Onboarding feels too long for exhausted mother | Save-and-continue; no more than 3 questions per screen; show progress bar |
| User forgets daily check-in | Push notification at a time they choose during onboarding; allow snooze by 2 hours |
| Sensitive questions feel intrusive | Frame every question with "why we ask"; allow "prefer not to say" on every question |
| Clinicians ignore dashboard | Keep it to top 10 flagged patients; one-click warm referral generation |
