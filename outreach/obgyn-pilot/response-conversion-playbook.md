# Response Conversion Playbook — Turning Replies into Signed LOIs

**Purpose:** CEO began executing the follow-up wave on 2026-09-28 (5 personalized emails + 15 practice calls). This playbook defines exactly how every inbound response gets converted into a signed pilot LOI within 7 days. Speed is the whole game: a reply answered in <4 hours converts at roughly 3-5x the rate of one answered the next day.

**Owner:** CMO (drafting/response copy) + designated human sender (sending/dialing)
**Version:** 1.0 — 2026-09-30
**Companion docs:** `materials/meeting-prep-guide.md`, `materials/loi-template.md`, `materials/pilot-overview.md`, `materials/hipaa-summary.md`, `cmo-followup-emails.md`, `pipeline-tracker.md`

---

## 1. Service-Level Agreements (non-negotiable)

| Trigger | Action | SLA |
|---------|--------|-----|
| Any inbound reply (email/LinkedIn/voicemail) | Acknowledge + advance to next step | **4 business hours** |
| Hot reply | Send Calendly link + pilot one-pager | **Same day** |
| Call-back request / live pick-up | Call placed | **Same day, second attempt within 24h** |
| Meeting held | Thank-you + requested materials | **Within 24h** |
| Verbal "yes, let's do it" | LOI sent for signature | **Within 48h** |
| No reply after touch 3 | Move to nurture list; stop cadence | Day 14 |

**Escalation trigger:** any hot lead untouched for >24h → comment on [FIR-71](/FIR/issues/FIR-71) tagging CEO. Every hot lead that goes cold is a missed pilot slot.

---

## 2. Triage Matrix

Classify every response within one working session, then log it in the **Response Tracking Log** in `pipeline-tracker.md`.

| Signal | Tier | Action | Owner |
|--------|------|--------|-------|
| "Interested — send info / let's talk", asks about pilot scope, cost, or timeline | 🔥 **Hot** | Reply with Calendly link + `materials/pilot-overview.md` + `materials/hipaa-summary.md`; propose 2 specific time slots | Sender, then CMO |
| "Sounds interesting, forward some information" | 🟡 **Warm** | Send the info packet + one question to re-engage ("Should we include your practice manager?") | Sender |
| "Not right now / bad timing / re-contact in X" | ⚪ **Not-now** | Confirm date, set calendar reminder, add to 6-week nurture; no further pushes | CMO |
| "You should talk to [name/department]" | 🔵 **Referral** | Thank + ask for the warm intro; log new contact as a target row | Sender |
| "Not a fit / decline" | ⛔ **Decline** | Thank them, ask one diagnostic question ("What would have made this a fit?"), close the row | CMO |
| Voicemail / no answer | 📞 **No-contact** | Second attempt within 24h at a different time of day; then email + voicemail combo; max 3 attempts | Sender |

**Hot-lead definition (any one qualifies):** asks for a meeting; mentions a quality-improvement or readmission goal; names a champion; asks about the LOI/BAA; mentions budget authority.

---

## 3. Reply Templates (paste-ready)

### 3.1 Hot — meeting request

> Subject: Re: [original] — 20 minutes for Firstweeks pilot
>
> Hi [Name] — glad this landed. The fastest path is a 20-minute intro call: [Calendly link] (or Tue 10am / Thu 2pm ET if that's easier).
>
> In the meantime, here's the one-page pilot overview [attachment] and our HIPAA summary [attachment]. Short version: 6 months, 200 postpartum patients, zero cost to your practice, and you keep your identifiable data — we work from de-identified outcomes under a BAA.
>
> I'll hold a slot for you through [date +2 business days].
>
> [Signature]

### 3.2 Warm — information request

> Subject: Re: [original] — Firstweeks pilot packet
>
> Hi [Name] — attached are the pilot overview and HIPAA summary. Two things worth flagging: the pilot is fully funded by Firstweeks (no cost, ~4-6 hours/month of staff time total), and practices get monthly de-identified outcome dashboards for QI.
>
> Would it be useful to include your practice manager or medical director on a 20-minute walkthrough? [Calendly link]
>
> [Signature]

### 3.3 Not-now — dated re-contact

> Subject: Re: [original] — I'll check back [date]
>
> Understood, [Name]. I'll circle back the week of [date + 6 weeks]. If anything changes before then — a QI initiative, a new champion, or a grant deadline the pilot could support — just reply and I'll pick it up immediately.
>
> [Signature]

### 3.4 Referral — warm hand-off request

> Subject: Re: [original] — thank you
>
> Appreciate the pointer to [referral name]. Would you be comfortable making a brief intro? One line is enough: "Firstweeks is running a postpartum outcomes pilot — worth 20 minutes." I'll take it from there and keep you looped in.
>
> [Signature]

### 3.5 Decline — diagnostic close

> Subject: Re: [original]
>
> Thanks for the straight answer, [Name]. One question so we learn: was it the timing, the clinical fit, or something else? Either way — if postpartum readmissions become a priority, I'll check back in [quarter].
>
> [Signature]

---

## 4. Meeting Booking Flow

1. Hot reply → send Calendly link **with two concrete alternatives** (links alone convert worse than links + options).
2. On booking: auto-confirmation email must attach `materials/pilot-overview.md`.
3. Send a reminder 24h before with the agenda (from `materials/meeting-prep-guide.md`).
4. Hold a backup slot for every booking; practices no-show at ~30% on cold intros.
5. **Log the booking row immediately** in the Meeting Pipeline table of `pipeline-tracker.md`.

---

## 5. Meeting → LOI Fast Path (7 days)

| Day | Step | Artifact |
|-----|------|----------|
| 0 | 20-min intro call per `materials/meeting-prep-guide.md`; qualify High/Medium/Low | Meeting notes |
| 0-1 | Thank-you email + requested materials within 24h | pilot overview, HIPAA summary |
| 1-2 | If **High**: 30-min demo with CTO/clinical lead (record if allowed) | demo script |
| 2-3 | Compliance walkthrough: BAA + data-flow summary with their compliance officer | `materials/hipaa-summary.md` |
| 3-5 | Send LOI draft for redlines | `materials/loi-template.md` |
| 5-7 | Signature — non-binding, so speed beats perfection | Signed LOI |
| 7 | Log LOI signed; open pilot onboarding per `marketing/pilot-onboarding-kit.md` | [FIR-125](/FIR/issues/FIR-125) |

**LOI rules:**
- Send the LOI the moment interest is verbal — do not wait for the compliance call to finish. It is explicitly non-binding (Section 5 of the template).
- Push back on material redlines beyond BAA/scope wording to CEO; everything else is acceptable.
- Target signatory: practice manager or medical director (the champion, not billing).

---

## 6. Objection Add-Ons (beyond `meeting-prep-guide.md`)

| Objection | Response |
|-----------|----------|
| "How did you get my info?" | Honest answer: public practice directories + ACOG chapter listings; direct them to `pilot@firstweeks.health` to opt out. Never be evasive — healthcare decision-makers punish it. |
| "Are you HIPAA certified?" | "We sign a BAA before any data flows, and the pilot runs on de-identified outcomes only. I'll send our HIPAA summary today." |
| "We're being pitched by [incumbent]" | "Portals track records; we detect complications between the 2-week and 6-week visits. Happy to be the postpartum-specific layer." |
| "No budget" | "The pilot is free — Firstweeks funds it because we need your outcomes data for validation." |
| "Our patients won't engage" | "Twice-weekly check-ins at 3-5 questions; our development cohorts sustained >60% week-4 retention. Pilot results are shared monthly so you can judge for yourself." |

---

## 7. Tracking Discipline

Every response — hot or cold — gets one row in the **Response Tracking Log** of `pipeline-tracker.md`:

`Date | Practice | Contact | Method | Response | Interest (Hot/Warm/Not-now/Referral/Decline) | Next Step | Owner`

Update the **Metrics Summary** the same day: response rate, meetings booked, LOIs signed. The CEO report is generated from this table — stale tracker = stale reporting.

**Weekly (every Monday):** CMO reviews the tracker, flags leads >5 days without a next step, and posts a pipeline digest on [FIR-71](/FIR/issues/FIR-71).

---

## 8. Definition of Done for FIR-71

- [ ] ≥2 signed pilot LOIs (goal: practices from the priority 5)
- [ ] ≥3 meetings booked from the current wave
- [ ] Every response logged in `pipeline-tracker.md`
- [ ] Pilot recruitment handoff opened: [FIR-125](/FIR/issues/FIR-125) (30 mothers)

---

*Response Conversion Playbook v1.0 — Firstweeks CMO, 2026-09-30*
