# Provider Profile Template — App

**Owner:** CMO
**Status:** Ready for implementation
**Date:** 2026-07-20
**Use:** Template for 15 provider profiles displayed in the app's provider directory

---

## Profile Fields

| Field | Type | Required | Example | Notes |
|-------|------|----------|---------|-------|
| `name` | string | yes | "Dr. Sarah Allen, PhD" | Full name + credentials |
| `specialty` | string | yes | "Perinatal Therapist" | One of: Perinatal Therapist, Lactation Consultant, Pelvic Floor PT |
| `location` | string | yes | "Chicago, IL" | City, State format |
| `bio` | text | yes | "Specializing in perinatal mental health with 10+ years..." | 2-3 sentences, warm tone, non-clinical |
| `photo` | URL | no | `/images/providers/sarah-allen.jpg` | Professional headshot, warm/approachable |
| `availability` | string | no | "Mon–Fri, 9am–5pm CT" | Current availability windows |
| `acceptingNewPatients` | boolean | yes | true | Default true for pilot; toggles provider visibility |
| `languages` | string[] | no | ["English", "Spanish"] | Key for matching diverse patients |
| `telehealth` | boolean | yes | true | Whether provider offers virtual visits |
| `yearsExperience` | number | no | 12 | Used as trust signal in profile |
| `specialties` | string[] | no | ["Postpartum anxiety", "Birth trauma"] | Clinical subspecialties for matching |
| `phone` | string | no | "(555) 123-4567" | Displayed after referral accepted |

---

## Bio Writing Guidelines

All bios follow the brand voice: warm, authoritative, non-judgmental.

**Structure:**
1. Who they are (credentials + focus area)
2. What they help with (patient-facing language)
3. A personal note (optional, humanizing)

**Example (Perinatal Therapist):**
> Dr. Sarah Allen specializes in perinatal mental health — supporting new moms through the emotional ups and downs of the fourth trimester. With over a decade of experience, she helps mothers navigate anxiety, mood changes, and the adjustment to parenthood. Sarah believes every mother deserves a space where she can say "this is hard" without judgment.

**Example (Lactation Consultant):**
> Sarah Early is a certified lactation consultant who works with new families to make feeding their baby feel manageable — whether that's nursing, pumping, or formula. She meets families where they are, without pressure or judgment, and specializes in helping moms who had a difficult start to their feeding journey.

**Example (Pelvic Floor PT):**
> Natasha Dawkins is a pelvic floor physical therapist who helps postpartum moms rebuild strength and confidence after birth. She treats common concerns like pelvic pain, incontinence, and diastasis recti with evidence-based care and a whole lot of patience. Her approach: you shouldn't have to leak when you laugh.

---

## Example Profile JSON

```json
{
  "name": "Dr. Sarah Allen, PhD",
  "specialty": "Perinatal Therapist",
  "location": "Chicago, IL",
  "bio": "Dr. Sarah Allen specializes in perinatal mental health — supporting new moms through the emotional ups and downs of the fourth trimester. With over a decade of experience, she helps mothers navigate anxiety, mood changes, and the adjustment to parenthood.",
  "photo": "/images/providers/sarah-allen.jpg",
  "availability": "Mon–Fri, 9am–5pm CT",
  "acceptingNewPatients": true,
  "languages": ["English"],
  "telehealth": true,
  "yearsExperience": 12,
  "specialties": ["Postpartum anxiety", "Birth trauma", "Perinatal OCD"],
  "phone": null
}
```

---

## Implementation Notes

- Profiles are seeded via `packages/db/src/seed.ts` — add `bio`, `photo`, `languages`, `telehealth`, `yearsExperience`, and `specialties` fields
- The escalation page (`apps/web/src/app/escalation/page.tsx`) renders provider cards from `/api/providers`
- Provider card UI should show: photo, name, specialty, location, bio preview, and a "Select" button
- Bio should truncate at 3 lines with an expandable "Read more" for long text
