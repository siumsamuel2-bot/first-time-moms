# User Journeys — Firstweeks

## Journey 1: Onboarding (Day 0)

**User:** Maya, 3 days postpartum, holding her baby while trying to complete onboarding one-handed.

| Step | Screen | Questions | UX Notes |
|------|--------|-----------|----------|
| 1 | Welcome | — | Warm illustration of mother + baby; "Welcome to Firstweeks — your postpartum recovery partner" |
| 2 | Delivery details | Delivery date, delivery type (vaginal / C-section / emergency C-section), any complications | Calendar picker for date; large touch targets; "prefer not to say" for complications |
| 3 | Feeding plan | Breastfeeding / formula / both | Follow-up if breastfeeding: "Are you experiencing any pain or difficulty?" with "yes, I'd like support" and "no, going well" |
| 4 | Mental health baseline | Edinburgh Postnatal Depression Scale (EPDS) — 5 questions | Each question on a 4-point scale; trigger warning before starting: "These questions help us understand how you're feeling. There are no wrong answers." |
| 5 | Check-in time | "What time of day works best for your daily check-in?" | Large clock picker; default to 10am; "We'll send you a gentle reminder" |
| 6 | Profile created | Summary of what you shared; "Your daily check-in starts tomorrow" | Clear CTA: "Go to my dashboard" |

**State machine transitions:**
```
Welcome → DeliveryDetails → FeedingPlan → MentalHealth → CheckInTime → Complete
```

**Edge cases:**
- User closes app mid-onboarding → resume from last completed step (saved to localStorage, synced on reconnect)
- Emergency C-section → auto-tag profile for higher-touch monitoring
- EPDS score >= 10 → flag for clinician awareness but do NOT alarm user; continue onboarding normally

---

## Journey 2: Daily Check-In (Ongoing)

**User:** Maya, 10 days postpartum. Gets a push notification at 10am.

| Step | Screen | UX Notes |
|------|--------|----------|
| 1 | Notification | "Your daily check-in is ready. Takes 2 minutes." |
| 2 | Check-in start | "Good morning, Maya. Let's see how you're doing today." Subtle illustration. |
| 3 | Physical questions | 2-3 questions adapted to her profile (C-section recovery, breastfeeding). Pain scale (0-10), bleeding check, incision check. |
| 4 | Sleep question | "How was your sleep last night?" "Hours of uninterrupted sleep?" Slider 0-8. |
| 5 | Mood question | "How have you been feeling emotionally?" EPDS-2 (two abbreviated questions from the full scale). |
| 6 | Open comment | "Anything else you'd like to share?" Free text, optional. |
| 7 | Complete | Animated confirmation. "You're all caught up. See you tomorrow." |

**Question selection logic:**
- Vaginal delivery: skip incision questions
- C-section: include incision pain and wound check
- Breastfeeding: include latch pain, engorgement check
- EPDS baseline high: include all 5 mood questions instead of abbreviated 2
- Days 1-7: daily questions; days 8-30: every-other-day; day 31+: weekly

**Edge cases:**
- No response by 2pm → gentle push "Your daily check-in is waiting"
- No response by 6pm → SMS fallback with link to check-in
- 2 consecutive missed check-ins → clinician dashboard flag

---

## Journey 3: Escalation (Alert)

**Trigger:** Maya has reported 3+ days of sleep disruption (<3 hours) + low mood.

**CRITICAL UX RULE: Never say "depression" or "disorder." Frame as "recovery pattern."**

| Step | Screen | UX Notes |
|------|--------|----------|
| 1 | Warm check-in | "Maya, we've noticed your recovery has been a bit tougher this week. You're not alone — many new mothers go through this." |
| 2 | Check-in extension | 5 additional questions (full EPDS); "prefer not to say" available on every question |
| 3 | Connection offer | "Based on what you've shared, we think you might benefit from talking with someone who specializes in postpartum care. Would you like us to help connect you?" Binary choice: yes / not right now |
| 4 | Provider match (if yes) | "Here are 3 providers near you who specialize in postpartum support and have availability this week." Show name, photo, specialty, location, insurance accepted. |
| 5 | Confirm referral | "We'll send your info to [Provider Name]. They'll reach out within 24 hours." User can also choose to call directly. |
| 6 | Follow-up | Clinician dashboard notified. Escalation logged. Follow-up check-in in 48 hours. |

**If user declines connection:**
- "That's completely okay. We'll check in with you again in a few days. If you change your mind, you can always tap 'Get Support' from your dashboard."
- Dashboard shows a subtle "Support available" card — not a flashing warning

**Severity levels:**
| Level | Trigger | UX Response |
|-------|---------|------------|
| Low (1-2) | Mild symptoms < 3 days | No alert. Continue daily check-in. |
| Medium (3-4) | Moderate symptoms 3-5 days | Warm check-in + extended assessment. Offer connection. |
| High (5-6) | High symptoms 3+ days | Auto-flag to clinician + offer connection + same-day callback option |
| Critical | Suicidal ideation or self-harm | Immediate crisis resources displayed; hotline number; clinician auto-called |

---

## Journey 4: Clinician Review (Doctor Side)

**User:** Dr. Sarah Okonkwo, opening the Firstweeks dashboard during morning rounds.

| Step | Screen | UX Notes |
|------|--------|----------|
| 1 | Login | OAuth with professional email; SMS 2FA |
| 2 | Dashboard | List of flagged patients sorted by severity. "5 patients need attention." Color coding: yellow (medium) / red (high) / critical (red + icon). |
| 3 | Patient detail | 3-day trend of check-in responses. EPDS trajectory. Key symptoms timeline. |
| 4 | Action panel | "Send warm referral" → generates referral to nearest contracted provider. "Send message" → in-app message to patient. "Mark reviewed" → removes from active queue. |
| 5 | Referral confirmation | "Referral sent to [Provider]. Patient notified." |
