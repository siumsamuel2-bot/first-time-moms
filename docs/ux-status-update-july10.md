# UX Status Update — July 10, 2026

**To:** CEO
**From:** UX Designer

---

## FIR-88: Escalation Prototype — Updated

The clickable React Native escalation prototype has been refined to match the wireframe spec (`docs/wireframes-escalation.md`):

### Changes Made (this session)

**Full EPDS assessment** (`firstweeks-mobile/app/escalation/reflection.tsx`):
- Replaced the simplified 3-question check-in with the full 10-question Edinburgh Postnatal Depression Scale
- 5 screens with 2 questions per screen — matches the wireframe spec
- "Prefer not to say" on each screen
- Q10 (self-harm) auto-routes to crisis resources — no alarm language shown

**Connection Offer screen** (`firstweeks-mobile/app/escalation/reflection-result.tsx`):
- Score-based routing (low/moderate/significant determines messaging)
- Primary CTA: "Yes, please connect me" → provider matching
- Secondary: "Not right now" → reassurance
- Info link: "About this recommendation" explains EPDS scoring, transparency builds trust
- Only the crisis screen uses warm-toned background (no red)

**Declined path** (`firstweeks-mobile/app/escalation/reassurance.tsx`):
- Updated copy to match wireframe: "That's completely okay. We'll check in with you again in a few days."
- Reinforces "Get Support" on dashboard as ongoing entry point

### What's Covered Now

| Wireframe Screen | Prototype Screen | Status |
|---|---|---|
| Ambient awareness (dashboard dot) | index.tsx (dashboard) | ✅ |
| Tiered alert banners | index.tsx (AlertBanner x3) | ✅ |
| Warm check-in (triggered) | nudge.tsx | ✅ |
| Extended assessment (EPDS) | reflection.tsx | ✅ Updated |
| Connection offer | reflection-result.tsx | ✅ Updated |
| Provider matching | referral.tsx | ✅ |
| Referral confirmation | referral-sent.tsx | ✅ |
| Critical escalation (self-harm) | crisis.tsx | ✅ |
| Soft decline | reassurance.tsx | ✅ Updated |
| Clinician consent | consent.tsx | ✅ |
| Clinician notified | clinician-notified.tsx | ✅ |

---

## Escalation Flow Complete

The full 5-layer progressive disclosure flow is now implemented:

```
Ambient Awareness (dashboard dot)
  → Contextual Nudge (AlertBanner)
    → Guided Reflection (EPDS assessment)
      → Warm Referral (provider matching)
        → Clinician Escalation (auto-notify)
```

Every exit has a "Not right now" / "Prefer not to say" escape hatch. No clinical alarm language is used in patient-facing UI.

---

## Pending Decisions

From the June 5 status report, I still need your input:

| Decision | Recommendation |
|----------|----------------|
| **Pilot launch date** | 12 weeks from go-ahead |
| **User testing budget** | $14,000 |
| **Phase 1 concept validation** | Can begin immediately upon approval |
| **Crisis protocol** | Auto-notify clinician within 30 min for critical escalations |

---

## Next Steps

1. **Phase 1 concept validation** — Ready to recruit 8 mothers as soon as budget is approved
2. **Clinician dashboard prototype** — Can begin next; wireframes are complete at `docs/wireframes-clinician-dashboard.md`
3. **User testing materials** — Moderator guide, consent forms, and screener are ready in `docs/user-testing-plan.md`

---

**Document Owner:** UX Designer
