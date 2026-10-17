# Quiz Email Nurture Sequence

**Owner:** CMO
**Status:** Ready for implementation
**Integration Point:** `/api/quiz` route — triggered on email capture
**Goal:** Convert quiz takers → Premium Trial ($10/mo) → MammaSync Plus ($20/mo)
**Channel:** Email (SendGrid / Mailchimp / Resend)

---

## Sequence Overview

| # | Timing | Subject Line | Goal | Trigger |
|---|--------|-------------|------|---------|
| 1 | Immediate | Your personalized postpartum report | Deliver value immediately | Quiz completion + email |
| 2 | Day 1 | One thing most new moms don't track (but should) | Show awareness gap | Report delivered |
| 3 | Day 3 | "I caught it at 6 PM. By 8 AM my midwife called." | Social proof + urgency | No trial start |
| 4 | Day 5 | Your first 7 days with Firstweeks | Product education | No trial start |
| 5 | Day 7 | You've got 7 days of Premium — on us | Trial offer | No trial start |
| 6 | Day 10 | What MammaSync Plus subscribers say at week 3 | Upgrade motivation | Trial active |
| 7 | Day 14 | Your trial is ending — here's what you'd lose | Urgency + FOMO | Trial active, not upgraded |
| 8 | Day 21 | We saved a spot in our community | Community pull | Trial ended, no upgrade |
| 9 | Day 30 | Last call — your personalized plan is waiting | Re-engagement | No trial start (cold) |

---

## Email 1: Deliverable (Immediate)

**Subject:** Your personalized postpartum report

**Preview:** Your recovery plan based on your quiz answers

---

Hi {{name}},

Thanks for taking the Firstweeks quiz. Here's what we found — and what to do next.

**Your result:** {{riskLevel}} risk profile
**Focus areas:** {{focusAreas}}

---

### Your Personalized Recommendations

{{recommendations_list}}

### Next Steps

{{next_steps_list}}

---

### Want daily support?

Your quiz results power the Firstweeks app — a daily companion that tracks your recovery, flags concerns early, and connects you to a community of moms who get it.

**[Start your free trial →]({{trial_link}})**

No credit card needed. Cancel anytime.

— The Firstweeks Team

---

## Email 2: Awareness Gap (Day 1)

**Subject:** One thing most new moms don't track (but should)

**Preview:** It's not sleep, it's not feeding — and it matters more than both

---

Hi {{name}},

When we asked new moms what they wish they'd tracked in the first 6 weeks, the #1 answer surprised us.

It wasn't sleep (though that's close). It wasn't feeding.

It was **mood patterns**.

Most moms can tell you if they're tired. Few can tell you if their mood has been trending down for 5 days straight — until it's hard to ignore.

That's exactly what Firstweeks catches.

**3 questions, 2 minutes, one daily check-in.** Trends come into focus before they become problems.

**[See how it works →]({{trial_link}})**

— The Firstweeks Team

---

## Email 3: Social Proof (Day 3)

**Subject:** "I caught it at 6 PM. By 8 AM my midwife called."

**Preview:** How one new mom used Firstweeks to flag a complication early

---

Hi {{name}},

Sarah was 3 weeks postpartum when she checked in on Firstweeks and flagged "heavy bleeding."

Nothing alarming — just a "yes" to a question she almost skipped.

Because her trend showed it was day 3 of increasing discharge, the app escalated. A warm referral was sent to her provider.

**By 8 AM the next morning, her midwife had called back.**

Sarah had a retained placental fragment — caught early because a daily check-in caught the pattern before Sarah herself thought to worry.

> "I almost didn't answer that question. I'm so glad I did."

Firstweeks doesn't diagnose. It flags patterns so you know when to call.

**[Start your free trial →]({{trial_link}})**

— The Firstweeks Team

---

## Email 4: Product Education (Day 5)

**Subject:** Your first 7 days with Firstweeks

**Preview:** What a week of daily check-ins looks like

---

Hi {{name}},

Here's what happens when you use Firstweeks for one week:

### Day 1
2-minute check-in. Questions about sleep, mood, energy, physical recovery. Takes less time than scrolling Instagram.

### Day 2
The app notices your sleep score is low. Sends a suggestion: "Try a 10-minute rest window before baby's next feed."

### Day 3
Your mood dips. The app doesn't alarm you — it offers a grounding exercise and reminds you that tough days are normal.

### Day 4
Pattern emerges: your lowest scores are always after bad nights. The app adjusts — shorter check-ins, more encouragement.

### Day 5
You get a notification: "You've checked in 5 days in a row. You're showing up for yourself."

### Day 6
You see your first trend report. A simple visual of how you've been doing across 4 dimensions.

### Day 7
You realize: someone has been paying attention every single day. And it feels different than doing this alone.

**[Start your week →]({{trial_link}})**

— The Firstweeks Team

---

## Email 5: Trial Offer (Day 7)

**Subject:** You've got 7 days of Premium — on us

**Preview:** Full access. No risk. Start today.

---

Hi {{name}},

You've seen what the quiz uncovered. You've read how it works. Now try it.

**Claim your 7-day free trial of Firstweeks Premium:**

✅ Daily check-ins with personalized insights  
✅ AI-powered pattern detection  
✅ Red-flag alerts when trends change  
✅ Private community access  
✅ Cancel anytime  

**$0 for 7 days. Then $10/month.**

**[Start your free trial →]({{trial_link}})**

— The Firstweeks Team

---

## Email 6: Upgrade Motivation (Day 10) — Sent to Active Trial Users

**Subject:** What MammaSync Plus subscribers say at week 3

**Preview:** The feature that makes the biggest difference

---

Hi {{name}},

We asked MammaSync Plus subscribers what they use most. The answer was almost unanimous:

> **"The provider sharing feature."**

With Plus, you can share your recovery trends directly with your OB-GYN with one tap. No printing. No trying to remember how you felt 6 weeks ago.

Plus you get:
- Unlimited AI check-ins (vs. daily limit on Premium)
- Priority community access
- Personalized recovery analysis
- Direct flag sharing with your provider

**Upgrade to MammaSync Plus for $20/month.** Your first week is on us.

**[Upgrade to Plus →]({{upgrade_link}})**

— The Firstweeks Team

---

## Email 7: Trial Ending (Day 14) — Sent to Active Trial, Not Yet Upgraded

**Subject:** Your trial is ending — here's what you'd lose

**Preview:** Don't lose your trend data and daily support

---

Hi {{name}},

Your 7-day Premium trial ends {{trial_end_date}}.

Here's what you'll lose access to:

❌ Daily personalized check-ins  
❌ Your recovery trend data  
❌ AI-powered pattern detection  
❌ Red-flag alerts  
❌ Community access  

**Keep it all for $10/month.**

That's less than one copay. And you get daily support between doctor visits.

**[Keep Premium →]({{keep_link}})**

Or upgrade to **MammaSync Plus** ($20/month) for unlimited check-ins, AI analysis, and provider sharing.

**[Explore Plus →]({{upgrade_link}})**

— The Firstweeks Team

---

## Email 8: Community Pull (Day 21) — Sent to Trial Ended, No Upgrade

**Subject:** We saved a spot in our community

**Preview:** The moms in Firstweeks are waiting for you

---

Hi {{name}},

Your trial may have ended, but our community is still here.

The Firstweeks community is a private space for new moms to share honestly — the hard nights, the weird questions, the moments that make it all worth it.

**No judgment. No competition. Just women who get it.**

We saved a spot for you.

**[Join the community →]({{community_link}})**

Premium members get full community access starting at $10/month.

— The Firstweeks Team

---

## Email 9: Re-engagement (Day 30) — Sent to Cold Leads (Never Started Trial)

**Subject:** Last call — your personalized plan is waiting

**Preview:** We built a plan based on your quiz answers. It's still here.

---

Hi {{name}},

A month ago, you took our quiz and got personalized postpartum insights.

That plan is still here — and it's gotten smarter. The Firstweeks app now has:

🆕 Improved daily check-ins (faster, more personalized)  
🆕 Enhanced pattern detection  
🆕 Growing community of moms in your stage  

**Your first 7 days are free. No credit card needed.**

**[See what's new →]({{trial_link}})**

— The Firstweeks Team

---

## Technical Integration

### Quiz API Route (`/api/quiz`)

```typescript
// After successful quiz submission with email:
// 1. Save quiz result to database
// 2. Trigger email sequence enrollment
// 3. Return referral link

await sendEmail({
  to: email,
  template: 'quiz-report',
  data: {
    name,
    riskLevel: result.riskLevel,
    recommendations: result.recommendations,
    nextSteps: result.nextSteps,
    trialLink: `${origin}/onboarding?ref=${referralCode}`,
  },
});
```

### Email Service

The `/api/quiz` route should call an email service function. Implementation options:

| Option | Pros | Cons | Recommendation |
|--------|------|------|----------------|
| Resend | Simple API, good DX, free tier (100/day) | Newer service | **Best for pilot phase** |
| SendGrid | Battle-tested, deliverability | Requires API setup | Scale to post-pilot |
| In-app only (no email) | No integration cost | No re-engagement | Pilot only |

### Tracking

| Metric | Tracked Where | Goal |
|--------|---------------|------|
| Email delivered | Email service | 100% |
| Email opened | Email service | 40%+ |
| Link clicked | Email service | 10%+ |
| Trial started | App DB | 5%+ of quiz takers |
| Trial → Premium | App DB | 20%+ conversion |
| Premium → Plus | App DB | 15%+ conversion |

---

## Copy Review Checklist

Before sending any email, confirm:

- [ ] "Postpartum" (not "postnatal")
- [ ] "Feeding your baby" (not breastfeeding by default)
- [ ] Contractions used (you're, don't, we'll, it's)
- [ ] No scare tactics
- [ ] No medical diagnosis claims
- [ ] "Flag" / "alert" — not "diagnose" / "detect"
- [ ] Sentences under 20 words average
- [ ] Second person ("you") throughout
- [ ] Mobile-optimized preview
- [ ] Unsubscribe link present
- [ ] CAN-SPAM compliant footer
- [ ] Personalization tags validated

---

*Prepared by CMO, Firstweeks. Implements the lead magnet → trial → paid conversion path from `marketing/go-to-market-strategy.md`.*
