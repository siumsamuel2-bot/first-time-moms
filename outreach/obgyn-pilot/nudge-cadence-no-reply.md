# No-Reply Nudge Cadence — Sep 28 Follow-up Wave

**Purpose:** The Sep 28 wave (5 personalized emails + 15 practice calls) has produced 0 logged replies after 48 hours. Wave 1 died from cadence failure, not message failure. This document pre-drafts every touch for the no-reply path so the human sender never has to write copy under time pressure, and gives an audit checklist to catch replies that arrived but were never logged.

**Companion docs:** `response-conversion-playbook.md` (triage + reply copy), `cmo-followup-emails.md` (the emails being nudged), `pipeline-tracker.md` (logging), `materials/loi-drafts-priority5.md`
**Owner:** CMO (copy) + human sender (send/dial/log)
**Version:** 1.0 — 2026-09-30
**Wave start:** 2026-09-28 → cadence dates below are anchored to it

---

## 0. FIRST: Inbox Audit (do this before sending anything new)

If replies arrived Sep 28–30 but weren't logged, the 4-hour SLA in the playbook is already burning. Run these searches in the sending inbox (Gmail syntax; adjust for Outlook):

**By practice name (priority 5):**
```
after:2026/09/27 ("Bloom Women's" OR "Associates in Women's Health" OR "Summit Women's" OR "Women's Health Center" OR "Pacific Women's Healthcare")
```

**By subject thread:**
```
after:2026/09/27 subject:(Firstweeks OR postpartum OR pilot)
```

**Catch-all for anything missed (including LinkedIn notifications forwarded to email):**
```
after:2026/09/27 (in:inbox OR in:updates) (pilot OR "20 minutes" OR Calendly OR LOI)
```

**Also check:**
- Voicemail transcriptions on the phone used for the 15 practice calls
- LinkedIn message inbox (separate from email)
- Calendly bookings/reschedules tab directly
- Spam/junk folder for auto-replies ("out of office", practice management system auto-ack)

**For every hit:** triage per playbook §2, then log one row in the Response Tracking Log of `pipeline-tracker.md` the same day. If a Hot reply exists → playbook §3.1 immediately, ignore the rest of this document for that practice.

---

## 1. Cadence Schedule

Applies to any practice with **no reply** at the checkpoint. Day 0 = Sep 28.

| Touch | Date | Channel | Copy below | Skip rule |
|-------|------|---------|-----------|-----------|
| — | Sep 30 | — | Inbox audit (§0) | Stop for that practice if reply found |
| Touch 2 | **Oct 1** (Day 3) | Email | §2.1 | Skip if replied or call connected |
| Touch 3 | **Oct 3** (Day 5) | Email + phone attempt | §2.2 + §3.1 | Skip if replied |
| Touch 4 | **Oct 5** (Day 7) | Call + voicemail | §3.2 (VM script) | Skip if replied |
| Touch 5 | **Oct 8** (Day 10) | Email — close-out | §2.3 | Sent to all still-silent |
| — | Oct 12 (Day 14) | — | Move to nurture list, stop cadence (playbook §1) | — |

**Rules:**
- Any reply at any point → stop this cadence, enter playbook §2 triage.
- Priority 5 get every touch. Batch 2 practices (Wave 2 phone targets) get Touch 2, 4, 5 only.
- Never send two emails within 48h of each other.
- CEO personal re-forward is the escalation lever at Day 5 for Priority 1–2 only (highest value, warmest path).

---

## 2. Email Copy (paste-ready)

### 2.1 Touch 2 — Day 3 soft bump (Oct 1)

> **Subject:** Re: [original subject] — quick bump
>
> Hi [Name],
>
> One quick bump in case this slipped down the inbox. The short version in three lines:
>
> - Firstweeks runs a 6-month postpartum outcomes pilot at zero cost to your practice
> - Your team provides ~4–6 hours/month; we handle recruitment, check-ins, and the de-identified outcome dashboard
> - Twenty minutes to see if it fits: [Calendly link] — or reply with two windows and I'll match them
>
> If it's not a priority right now, just say "not now" and I'll close the loop cleanly.
>
> [Signature]

### 2.2 Touch 3 — Day 5 value-add hook (Oct 3)

> **Subject:** Re: [original subject] — one data point before you decide
>
> Hi [Name],
>
> Rather than bump again, here's the piece most practices care about:
>
> Our development cohorts sustained >60% week-4 check-in retention — the number that usually kills postpartum engagement apps. The pilot gives your QI team a monthly de-identified dashboard covering PPD, preeclampsia, hemorrhage, mastitis, and VTE signals caught between the 2-week and 6-week visits.
>
> Zero cost, de-identified data only, BAA before any data flows. Twenty minutes to walk through it: [Calendly link]
>
> If the timing is wrong, reply "re-contact in [month]" and I'll respect it.
>
> [Signature]

### 2.3 Touch 5 — Day 10 close-out / referral ask (Oct 8)

> **Subject:** Re: [original subject] — closing the loop
>
> Hi [Name],
>
> I won't keep filling your inbox — this is my last note on the pilot unless you tell me otherwise.
>
> Two asks, either one is genuinely helpful:
>
> 1. If you're interested, [Calendly link] still works and I can hold a slot through [date +2 business days]
> 2. If someone else at the practice owns postpartum QI, a one-line intro would be a favor: "Firstweeks is running a postpartum outcomes pilot — worth 20 minutes"
>
> Either way, thank you for the time, and if postpartum readmissions become a priority later, I'll check back in Q1.
>
> [Signature]

---

## 3. Phone / Voicemail Scripts (for Oct 3 attempt and Oct 5 VM)

### 3.1 Day 5 call opener (live pick-up)

> Hi [Name], this is [Sender] with Firstweeks — I emailed you Tuesday about the postpartum outcomes pilot and wanted to put a voice to it rather than be the fourth email in your inbox. Thirty-second version: free six-month pilot, de-identified outcome dashboard for your QI team, ~4 hours a month of your staff's time. Is that worth twenty minutes, or did I catch you at a bad time?

*If bad time:* "When's better — later this week or early next?" *Log the callback commitment as Warm in the tracker.*

### 3.2 Day 7 voicemail (max 30 seconds)

> Hi [Name], [Sender] with Firstweeks — following up on my emails about the free postpartum outcomes pilot. The one thing worth remembering: zero cost to your practice, and your QI team gets a monthly de-identified dashboard. I'll send one last note Wednesday with a couple of slots, then I'll stop. Or call me directly at [number]. Thanks, [Name].

---

## 4. Logging (same day, every touch)

Add to the Response Tracking Log in `pipeline-tracker.md` only for **replies** — outbound touches go in the Notes column of the practice row. Update Metrics Summary the same day.

`Date | Practice | Contact | Method | Response | Interest | Next Step | Owner`

---

## 5. Escalation

- Hot reply untouched >24h → comment on [FIR-71](/FIR/issues/FIR-71) tagging CEO (playbook §1).
- Zero replies across all 25 after Touch 5 (Oct 8) → CMO posts channel-failure digest on [FIR-71](/FIR/issues/FIR-71) and proposes the next pivot to CEO; do not start a sixth touch — 0% after 10 touches is a message/channel problem, not a persistence problem.
- ≥1 Hot reply at any point → playbook §3.1 and §5 fast path take precedence over this document.

---

*No-Reply Nudge Cadence v1.0 — Firstweeks CMO, 2026-09-30*
