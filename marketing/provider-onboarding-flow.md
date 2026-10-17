# Provider Network — Referral Onboarding Flow

**Owner:** CMO
**Status:** Ready
**Date:** 2026-07-20

---

## Overview

15 providers (5 perinatal therapists, 5 lactation consultants, 5 pelvic floor PTs) are sourced, screened, and ready. This document defines the onboarding flow from practice commitment → warm referral activation.

Provider roster: `marketing/PROVIDER-NETWORK.md`

---

## Onboarding Flow

### Step 1: Practice Commits to Pilot

**Trigger:** LOI signed with OB-GYN practice.

**Action:** Map practice's geography to the 5 provider metros (Chicago, Atlanta, DC/NoVA, LA, NYC).

**By geography:**
| Pilot Practice Metro | Assigned Providers |
|---------------------|-------------------|
| Chicago, IL | Dr. Sarah Allen, Veronica Ursetto |
| Atlanta, GA | Natasha Dawkins, Adina Leifer |
| Washington DC / NoVA | Shivonne Odom-Chase, Sarah Early, Jade Rubino |
| Los Angeles, CA | 3 LCs + 3 PTs (6 providers) |
| New York / Brooklyn | Lillian Rishty |
| Carrollton, GA | Natasha Dawkins |
| Fairfax, VA | Jade Rubino |

### Step 2: Provider Notification

**Action:** Notify each provider that their metro now has a pilot practice.

**Provider email template:**
```
Subject: [Practice Name] is now live — referrals starting soon

Hi [Provider Name],

Great news — [Practice Name] in [City] has joined the Firstweeks pilot.
Patients from this practice will be referred to you starting [Date].

Here's what to expect:
- Referrals come through the Firstweeks app as warm intros
- You'll receive a notification when a patient selects you
- Respond within 1 business day to confirm availability
- Track referrals in your provider dashboard

Your provider profile is live at: [dashboard link]

Questions? Reply to this email.

Best,
The Firstweeks Team
```

### Step 3: Provider Dashboard Activation

**Action:** CTO provisions dashboard access for each provider.

**Provider dashboard features:**
- Incoming referral queue
- Patient context (symptom summary, no PHI until accepted)
- Accept/decline/redirect referral
- Availability calendar
- Referral history

### Step 4: Warm Referral Activation

**Action:** Enable in-app warm referral for pilot patients.

**Flow:**
1. Patient's check-in detects escalation pattern
2. App offers: "Speak with a screened provider in your area"
3. Patient selects from provider list (filtered by metro)
4. Intro message sent to provider: "Your patient [Name] would like to connect"
5. Provider responds within 1 business day
6. Patient receives confirmation with provider contact

### Step 5: Provider Engagement Check

**Action:** CMO checks in with each provider at pilot weeks 2, 4, 6, 8.

**Check-in questions:**
- Have you received any referrals?
- Any issues with the dashboard?
- Do you have availability for more patients?
- Any feedback from patients who've reached out?

---

## Provider Communication Cadence

| Timing | Message | Channel |
|--------|---------|---------|
| Onboarding | Welcome, dashboard setup | Email |
| Pilot kickoff | Practice is live, referrals active | Email + Text |
| Week 2 | Check-in #1 | Email |
| Week 4 | Midpoint survey | Email |
| Week 6 | Check-in #2 | Email |
| Week 8 | Pilot wrap, next steps | Email |
| Monthly | General update (institutional) | Newsletter |

---

## Provider Contract Summary

All 15 providers have been screened and accepted terms:
- **Referral model:** Warm intro (no payment per referral at pilot stage)
- **Expectation:** Respond within 1 business day
- **Data sharing:** Provider receives symptom summary (no PHI until accepted)
- **Term:** Pilot length (8 weeks), renewable
- **Exit:** Either party can end with 7 days notice

Post-pilot, we will evaluate a formal revenue-sharing model for sustained referrals.

---

## Operational Checklist

- [x] 15 providers sourced and screened ✅
- [x] Provider records seeded in database ✅
- [x] API routes for provider queries ✅
- [x] Escalation page consuming real data ✅
- [x] Provider notification email drafted (this doc)
- [x] Provider agreement template (Docusign-ready) → `marketing/provider-agreement-template.md`
- [x] Provider profile template for app → `marketing/provider-profile-template.md`
- [ ] Dashboard activation pending CTO implementation
- [ ] Geographic mapping per practice (this doc)
- [ ] Check-in schedule (this doc)
- [ ] Contract/LOI pending pilot practice commitment (FIR-71)

---

## Escalation

If a provider becomes unresponsive (>48h), CMO:
1. Send reminder email + text
2. If no response in 72h, reassign patients to alternative provider in same metro
3. If no alternative, escalate to CEO for provider replacement

---

*Last updated: 2026-07-20 | CMO*
