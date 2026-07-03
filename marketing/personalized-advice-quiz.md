# Personalized Advice Quiz — Firstweeks Lead Magnet

## Purpose
The Personalized Advice Quiz is the main **lead magnet** for Firstweeks. It captures user contact information in exchange for a clinically relevant, personalized report on postpartum risk factors. It should build trust, demonstrate value, and convert visitors into trial users.

## User Flow
1. **Landing Page**: User clicks an ad or social media link → arrives at quiz landing page (`firstweeks.health/quiz`)
2. **Quiz Progress**: 5–7 questions, one per screen, with a progress bar (33% → 66% → 100%)
3. **Email Wall**: After final question, user enters email/phone to receive personalized report
4. **Results Page**: Shows personalized report summary, risk scores, and recommended actions
5. **Trial CTA**: One-click signup for $10/month premium trial with first 7 days free
6. **Sharing**: Option to share results with partner or friend (seeding referral loop)

---

## Quiz Questions (7 Questions)

### Q1 — Delivery Timing
**How far along are you in your postpartum journey?**
- 0–2 weeks (newborn phase)
- 3–6 weeks (early postpartum)
- 7–12 weeks (late postpartum)
- I'm currently pregnant / expecting soon
- I'm a support person (partner, family, friend)

### Q2 — Physical Recovery
**Which of the following are you experiencing? (Select all that apply)**
- Pain at incision or perineum
- Heavy bleeding (soaking a pad in less than 1 hour)
- Severe headaches or vision changes
- Swelling in legs or calf pain
- Fever/chills
- None of the above

### Q3 — Emotional Wellbeing
**Over the past 2 weeks, how often have you felt this way?**
(a) Feeling down, depressed, or hopeless
(b) Little interest or pleasure in doing things
(c) Feeling overwhelmed or unable to cope
- Not at all
- Several days
- More than half the days
- Nearly every day

### Q4 — Breastfeeding / Infant Feeding
**How is feeding going?**
- Exclusively breastfeeding (going well)
- Exclusively breastfeeding (challenging — pain, low supply, latch issues)
- Mixed feeding (breast + formula)
- Exclusively formula feeding
- Not applicable / I didn't give birth

### Q5 — Sleep & Support
**How would you describe your current situation?**
- I have adequate support (partner, family, doula)
- I have some help but feel overwhelmed
- I'm mostly managing alone
- I have no support system

### Q6 — Medical History
**Do you have any of the following risk factors? (Select all that apply)**
- Previous postpartum depression or anxiety
- Gestational diabetes or preeclampsia
- C-section delivery (this birth or previous)
- Preterm birth (<37 weeks)
- Twins or multiples
- None of the above

### Q7 — Concerns & Priorities
**What is your biggest concern right now? (Select up to 2)**
- My physical recovery
- My mental health / mood
- Breastfeeding / feeding challenges
- Baby's health or development
- Sleep deprivation
- Relationship / partner support
- Returning to work
- Financial stress

---

## Scoring & Segmentation

### Physical Recovery Score
- **Low risk** (0–1 symptoms): General recovery tips + signs to watch for
- **Moderate risk** (2–3 symptoms): Targeted recommendations + care team notification suggestion
- **High risk** (4+ symptoms or heavy bleeding/fever): Urgent care recommendation + care team alert

### Mental Health Score (EPDS-lite)
- **Low risk** (0–4 points): Preventive mental wellness resources
- **Moderate risk** (5–7 points): Mental health support tools + therapist matching
- **High risk** (8+ points): Immediate crisis resources + care team alert + telehealth option

### Feeding Score
- **Going well**: Lactation tips + milestones
- **Challenges**: IBCLC referral + latch resources + supply strategies
- **Formula**: Bottle-feeding best practices + guilt-free education

### Support Score
- **Strong support**: Community + peer matching
- **Limited support**: Support network builder + partner education resources + local groups
- **No support**: Immediate community enrollment + doula/PPD support group matching

---

## Personalized Report Structure (PDF + In-App)

### Page 1 — Executive Summary
- Your Name (if entered)
- Quiz Date
- Overall risk level: Low / Moderate / High
- Top 2 concerns identified

### Page 2 — Physical Recovery Plan
- Score and interpretation
- 3 personalized action items
- When to call your doctor (red flags)

### Page 3 — Mental Health Check
- EPDS-lite score and interpretation
- 3 coping strategies tailored to your situation
- Crisis resources (if high risk) or preventive resources (if low risk)

### Page 4 — Feeding & Baby Care
- Personalized feeding plan
- Resources and referrals (IBCLC, pediatrician, etc.)
- Growth milestones for your baby's age

### Page 5 — Support System Builder
- Identified gaps
- Suggested resources (local groups, online communities, telehealth)
- Partner education materials

### Page 6 — Next Steps with Firstweeks
- **Trial CTA**: "Start your 7-day free trial of Firstweeks Premium ($10/month after)"
- **Full upgrade**: "Upgrade to MammaSync Plus for $20/month — full AI analyses + community"
- **Schedule a call**: Option to book a free onboarding call with a postpartum nurse

---

## Copy Framework

### Landing Page Headlines (A/B Test Candidates)
A. "Is your postpartum recovery on track? Take our free 2-minute assessment."
B. "82% of new moms experience complications they don't recognize. Is that you?"
C. "Get your personalized postpartum recovery plan in 2 minutes."

### Email Capture Copy
"Enter your email to receive your personalized Firstweeks recovery plan, tailored to your answers. We'll send it straight to your inbox — no spam, ever."

### Results Page CTA
"Based on your responses, here are the top 3 things you should do this week. Want personalized daily guidance? Start your free 7-day trial of Firstweeks Premium."

### Sharing Copy
"Every mom deserves this check-up. Share this quiz with a new mom you know."

---

## Technical Requirements
- **Platform**: Web (React/Next.js) with mobile-responsive design
- **PDF Generation**: Server-side rendering or client-side PDF generation for the report
- **Email Service**: Integration with email provider (SendGrid, Mailgun, etc.)
- **Data Storage**: Quiz responses stored in PostgreSQL; reports generated dynamically
- **Analytics**: Track conversion rate (quiz start → email capture → trial signup)
- **GDPR / HIPAA considerations**: Quiz responses are not PHI until linked to a user account; email opt-in required for marketing

---

## Conversion Metrics To Track
| Metric | Target |
|--------|--------|
| Landing page → Quiz start | 60% |
| Quiz completion | 85% |
| Quiz completion → Email capture | 70% |
| Email capture → Trial signup | 15% |
| Trial signup → Paid conversion (30d) | 25% |
| Referral rate (shares / quiz completions) | 10% |

