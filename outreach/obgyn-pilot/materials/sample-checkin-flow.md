# Firstweeks Sample Check-In Flow (Patient Journey)

## Patient: Sarah M., 32 y/o, G1P0, vaginal delivery 4 days ago

---

### Day 4 — Assessment Check-In (in-app push notification, triggered at 8:30 AM)

**Sarah opens the app.**

> **Screen 1 — Symptom Check**  
> How are you feeling today?  
> - ❑ Great  
> - ❑ Okay  
> - ❑ Not great  
> - ❑ Worried  

Sarah selects **"Worried."**

> **Screen 2 — Follow-up**  
> What are you most worried about?  
> - ❑ Bleeding or pain  
> - ❑ My mood  
> - ❑ Baby feeding  
> - ❑ Something else  

Sarah selects **"Bleeding or pain"** and **"My mood."**

> **Screen 3 — Pain Assessment**  
> Are you experiencing any of the following?  
> - ❑ Heavy bleeding (soaking a pad in <1 hr)  
> - ❑ Severe abdominal pain  
> - ❑ Painful uterus that’s hard to the touch  
> - ❑ None of the above  

Sarah selects **"Severe abdominal pain."**

> **Screen 4 — Mood Assessment (EPDS-lite)**  
> Over the past week, have you felt down or hopeless?  
> - ❑ No  
> - ❑ Some days  
> - ❑ Most days  
> - ❑ Nearly every day  

Sarah selects **"Most days."**

---

### Routing: Alert Threshold Met

**Firstweeks System Action:**

| Threshold | Action |
|-----------|--------|
| Pain — abdominal pain + postpartum day 4 | **YELLOW ALERT** — Care team dashboard flags "Postpartum pain — assess for infection or retained tissue" |
| Mood — EPDS score ≥ 10 | **ORANGE ALERT** — Care team dashboard flags "PPD risk — schedule mental health follow-up" |

**Automated Patient Response:**

> Sarah receives:
> 1. **Educational card:** "Postpartum pain: what’s normal and when to call" (with local practice number pre-linked).
> 2. **Resource link:** "Finding a postpartum mental health therapist near you."
> 3. **Care team message:** "We noticed you reported some concerning symptoms and feelings. A nurse from [Practice Name] may reach out to check in with you. If you experience heavy bleeding, fever, or thoughts of harming yourself or your baby, call 911 or go to the nearest emergency room."

---

### Day 5 — Care Team Dashboard Review

**OB-GYN Nurse logs into Firstweeks Clinical Dashboard:**

| Patient | Last Check-In | Pain | Mood | Action Needed |
|---------|--------------|------|------|---------------|
| Sarah M. | Day 4 | Yellow | Orange | **Review & call** |

Nurse makes outreach call, documents outcome (scheduled follow-up, referral to therapist, or resolved).

---

### Week 2 — Trending

- Sarah continues check-ins twice per week.
- Pain resolves by Day 7.
- Mood improves from "Most days" to "Some days" by Day 10.
- No further alerts after Day 10.

---

## Summary

| Metric | Flow |
|--------|------|
| Patient touchpoint | 5 minutes, twice per week |
| Alert resolution | Care team review within 24 hrs |
| Outcome documentation | Automatic in dashboard |
| Intervention examples | Pain management, mental health referral, lactation support, DVT screening |

