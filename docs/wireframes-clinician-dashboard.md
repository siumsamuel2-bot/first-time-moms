# Clinician Dashboard Wireframes — Blueprint

**User:** Dr. Sarah Okonkwo, OB-GYN
**Device:** Desktop web (responsive, but primary target is desktop)
**Auth:** OAuth + SMS 2FA

---

## Screen 1: Login

```
┌──────────────────────────────────────────────────────────┐
│  Firstweeks Clinician                  [About] [Support] │
│  ──────────────────────────────────────────────────────  │
│                                                          │
│                    ┌──────────────────────┐              │
│                    │  🔒 Clinician Portal │              │
│                    │                      │              │
│                    │  Email               │              │
│                    │  ┌──────────────────┐│              │
│                    │  │ dr.sarah@...     ││              │
│                    │  └──────────────────┘│              │
│                    │                      │              │
│                    │  Password            │              │
│                    │  ┌──────────────────┐│              │
│                    │  │ ••••••••         ││              │
│                    │  └──────────────────┘│              │
│                    │                      │              │
│                    │  [Sign In]           │              │
│                    │                      │              │
│                    │  ──── ────           │              │
│                    │  Forgot password?    │              │
│                    └──────────────────────┘              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Specs:**
- Clean, professional layout — different visual language from patient app (cooler tones, less imagery)
- SMS 2FA sent after first factor
- "About" and "Support" links in header
- Contrast ratio: warm-900 on white — meets WCAG AAA

---

## Screen 2: Patient Dashboard

```
┌──────────────────────────────────────────────────────────┐
│  Firstweeks Clinician                          Dr. Sarah │
│  ──────────────────────────────────────────────────────  │
│                                                          │
│  Your Patients                    Sort: Severity ▼       │
│                                                          │
│  5 need attention  │  23 total  │  3 new today           │
│  ──────────────────────────────────────────────────────  │
│                                                          │
│  ┌────────────────────────────────────┬───┬───┬────────┐ │
│  │ Patient              │ Days │ Risk │   │          │ │
│  ├────────────────────────────────────┼───┼───┼────────┤ │
│  │ Maya Chen, 31        │  12  │  🔴 │   │ [Review] │ │
│  │ PP day 14, C-section │       │ High│   │          │ │
│  │ Flags: sleep, mood   │       │     │   │          │ │
│  ├────────────────────────────────────┼───┼───┼────────┤ │
│  │ Jessica Torres, 28   │   8  │  🟡 │   │ [Review] │ │
│  │ PP day 10, vaginal   │       │ Med │   │          │ │
│  │ Flags: pain          │       │     │   │          │ │
│  ├────────────────────────────────────┼───┼───┼────────┤ │
│  │ Rachel Kim, 34       │   5  │  🟢 │   │ [Review] │ │
│  │ PP day 7, emergency  │       │ Low │   │          │ │
│  │ C-section            │       │     │   │          │ │
│  ├────────────────────────────────────┼───┼───┼────────┤ │
│  │ ... 2 more flagged   │       │     │   │          │ │
│  └────────────────────────────────────┴───┴───┴────────┘ │
│                                                          │
│  ──── ──── ────                                           │
│  All Patients (23)  ›                                     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Specs:**
- Summary bar: "X need attention" with color-keyed badges, total count, new today
- Table/list view: patient name, days postpartum, risk indicator, key flags, action button
- Risk indicators:
  - 🟢 Green (low): monitor — no action needed
  - 🟡 Yellow (medium): review recommended within 24h
  - 🔴 Red (high): review recommended within 4h
  - 🔴+ Critical (high with icon): immediate attention (suicide flag)
- "Review" button opens patient detail view
- Sort dropdown: severity, name, days postpartum
- Queryable: search bar for patient name

---

## Screen 3: Patient Detail

```
┌──────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                    Maya Chen, 31    │
│  ──────────────────────────────────────────────────────  │
│                                                          │
│  ┌─────── PROFILE ─────────────────────────────────────┐ │
│  │  Delivery: C-section (unplanned)  │  PP Day: 14     │ │
│  │  Complications: none              │  Feeding: Breast │ │
│  │  EPDS Baseline: 12/30            │  Check-in time:  │ │
│  │  Last check-in: Today, 10:02am   │  10:00 AM        │ │
│  └─────────────────────────────────────────────────────┘ │
│                                                          │
│  ┌─────── TREND ────────────────────────────────────────┐│
│  │  Emotional Wellbeing (last 7 days)                   ││
│  │  ┌─────────────────────────────────────────────────┐ ││
│  │  │ Mood ▁▁▂▃▃▄▅▆                                  │ ││
│  │  │ Sleep▁▁▁▂▂▃▄▄▅                                  │ ││
│  │  │ Pain ▁▁▁▁▂▃▄▄▅                                  │ ││
│  │  │                                    Less good →  │ ││
│  │  └─────────────────────────────────────────────────┘ ││
│  │  Trend worsening over 3+ days                        ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────── RECENT CHECK-INS ─────────────────────────────┐│
│  │  Today (10:02 AM)                                    ││
│  │  • Sleep: 2.5 hours interrupted                      ││
│  │  • Mood: "less than before" / "often anxious"        ││
│  │  • Pain: 6/10 at incision site                       ││
│  │  • Comment: "I feel like I'm failing at this"       ││
│  │                                                      ││
│  │  Yesterday (9:48 AM)                                 ││
│  │  • Sleep: 2 hours interrupted                        ││
│  │  • Mood: "much less than before" / "very often"      ││
│  │  • Pain: 5/10                                        ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────── ACTIONS ──────────────────────────────────────┐│
│  │  ┌──────────────────┐  ┌──────────────────────────┐  ││
│  │  │ Send warm        │  │ Send in-app message      │  ││
│  │  │ referral         │  │ [Compose]                │  ││
│  │  └──────────────────┘  └──────────────────────────┘  ││
│  │                                                      ││
│  │  ┌──────────────────┐  ┌──────────────────────────┐  ││
│  │  │ Mark reviewed    │  │ Escalate to specialist   │  ││
│  │  │ (remove from     │  │ (psychiatrist)           │  ││
│  │  │  active queue)   │  │                          │  ││
│  │  └──────────────────┘  └──────────────────────────┘  ││
│  └─────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Specs:**
- Profile card: delivery info, EPDS baseline, last check-in time
- Trend chart: sparkline for mood/sleep/pain over 7 days — mini line charts
- Check-in log: most recent entries, newest first, expandable to see full history
- Comment text: shown in full if short, truncated with "show more" if >100 chars
- Action buttons:
  - "Send warm referral" → opens provider selector (filtered to contracted providers)
  - "Send in-app message" → opens messaging modal
  - "Mark reviewed" → removes from active queue, logs to audit
  - "Escalate to specialist" → escalates to a psychiatrist (different workflow)
- Every action is logged in audit_log table (HIPAA)

---

## Screen 4: Send Warm Referral (Modal)

```
┌──────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐  │
│  │  Send Warm Referral                        [X]     │  │
│  │  ──────────────────────────────────────────       │  │
│  │                                                   │  │
│  │  Patient: Maya Chen                               │  │
│  │                                                   │  │
│  │  Available Providers (3):                         │  │
│  │                                                   │  │
│  │  ○ Dr. Amara Johnson — LMFT, PMH-C       2.3 mi  │  │
│  │    Postpartum anxiety, birth trauma               │  │
│  │    Accepting new: Yes  │ Contract: Active        │  │
│  │                                                   │  │
│  │  ○ Elena Martinez, LCSW — Perinatal MH   4.1 mi  │  │
│  │    Perinatal depression, adjustment                │  │
│  │    Accepting new: Yes  │ Contract: Active        │  │
│  │                                                   │  │
│  │  ○ Dr. Rachel Park — Psychiatrist        5.8 mi   │  │
│  │    Perinatal psychiatry, medication mgmt          │  │
│  │    Accepting new: Waitlist │ Contract: Active     │  │
│  │                                                   │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │ [Send Referral]                             │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Specs:**
- Modal/overlay — covers ~60% of screen width on desktop, full screen on mobile
- Radio selection: only one provider at a time
- Provider info: name, credentials, distance, specialty, insurance, availability
- "Send Referral" button: enabled only when a provider is selected
- On submit: creates escalation record, sends push to patient, sends email to provider
- Audit log entry: clinician ID, patient ID, provider ID, action: "referral_sent", timestamp

---

## Screen 5: Message Patient (Modal)

```
┌──────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐  │
│  │  Message Maya Chen                        [X]     │  │
│  │  ──────────────────────────────────────────       │  │
│  │                                                   │  │
│  │  Templates:                                       │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │ ✅ Hi [Name], I've reviewed your recent    │   │  │
│  │  │  check-ins and wanted to check in. How     │   │  │
│  │  │  are you feeling today?                     │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │ I've sent a referral to [Provider]. They   │   │  │
│  │  │ should reach out within 24 hours.           │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  │                                                   │  │
│  │  Message:                                         │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │                                            │   │  │
│  │  │  Pre-filled from template or free text     │   │  │
│  │  │                                            │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  │                                                   │  │
│  │  ┌────────────────────────────────────────────┐   │  │
│  │  │ [Send]                                      │   │  │
│  │  └────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

**Specs:**
- Message templates: pre-written, clinically reviewed, customizable
- Free text area: plain text, 1000 char limit
- "Send" sends an in-app push notification to the patient
- All messages are logged for HIPAA audit
