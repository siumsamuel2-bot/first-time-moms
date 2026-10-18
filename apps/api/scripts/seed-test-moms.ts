import { BleedingLevel, DeliveryType, FeedingMethod, PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/auth.js';

const prisma = new PrismaClient();

interface TestMom {
  email: string;
  name: string;
  practiceId: string;
  deliveryDate: string;
  deliveryType: DeliveryType;
  feedingMethod: FeedingMethod;
  phq2Score: number;
  gad2Score: number;
  complications: string[];
  checkInDays: number; // Number of days of check-ins to generate
}

const PILOT_PRACTICES = {
  'practice-metro-obgyn': 'Metro OB-GYN Associates',
  'practice-bayview-wh': "Bayview Women's Health",
};

const TEST_MOMS: TestMom[] = [
  // Metro OB-GYN Associates - 15 moms
  {
    email: 'mom.metro.01@example.com',
    name: 'Test Mom Metro 1',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-15',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 1,
    gad2Score: 0,
    complications: [],
    checkInDays: 21,
  },
  {
    email: 'mom.metro.02@example.com',
    name: 'Test Mom Metro 2',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-10',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.COMBO,
    phq2Score: 2,
    gad2Score: 1,
    complications: ['preeclampsia'],
    checkInDays: 26,
  },
  {
    email: 'mom.metro.03@example.com',
    name: 'Test Mom Metro 3',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-05',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.FORMULA,
    phq2Score: 0,
    gad2Score: 0,
    complications: [],
    checkInDays: 30,
  },
  {
    email: 'mom.metro.04@example.com',
    name: 'Test Mom Metro 4',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-20',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 3,
    gad2Score: 2,
    complications: ['gestational_diabetes'],
    checkInDays: 16,
  },
  {
    email: 'mom.metro.05@example.com',
    name: 'Test Mom Metro 5',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-18',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.PUMPING,
    phq2Score: 1,
    gad2Score: 3,
    complications: [],
    checkInDays: 18,
  },
  {
    email: 'mom.metro.06@example.com',
    name: 'Test Mom Metro 6',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-12',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 0,
    gad2Score: 1,
    complications: ['perineal_tear'],
    checkInDays: 24,
  },
  {
    email: 'mom.metro.07@example.com',
    name: 'Test Mom Metro 7',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-22',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.COMBO,
    phq2Score: 2,
    gad2Score: 2,
    complications: [],
    checkInDays: 14,
  },
  {
    email: 'mom.metro.08@example.com',
    name: 'Test Mom Metro 8',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-08',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.FORMULA,
    phq2Score: 4,
    gad2Score: 3,
    complications: ['postpartum_hemorrhage'],
    checkInDays: 28,
  },
  {
    email: 'mom.metro.09@example.com',
    name: 'Test Mom Metro 9',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-25',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 1,
    gad2Score: 0,
    complications: [],
    checkInDays: 11,
  },
  {
    email: 'mom.metro.10@example.com',
    name: 'Test Mom Metro 10',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-14',
    deliveryType: DeliveryType.VBAC,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 2,
    gad2Score: 1,
    complications: [],
    checkInDays: 22,
  },
  {
    email: 'mom.metro.11@example.com',
    name: 'Test Mom Metro 11',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-16',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.PUMPING,
    phq2Score: 0,
    gad2Score: 0,
    complications: ['thyroid_issues'],
    checkInDays: 20,
  },
  {
    email: 'mom.metro.12@example.com',
    name: 'Test Mom Metro 12',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-19',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.COMBO,
    phq2Score: 3,
    gad2Score: 4,
    complications: ['c_section_infection'],
    checkInDays: 17,
  },
  {
    email: 'mom.metro.13@example.com',
    name: 'Test Mom Metro 13',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-11',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 1,
    gad2Score: 1,
    complications: [],
    checkInDays: 25,
  },
  {
    email: 'mom.metro.14@example.com',
    name: 'Test Mom Metro 14',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-23',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.FORMULA,
    phq2Score: 2,
    gad2Score: 2,
    complications: ['anemia'],
    checkInDays: 13,
  },
  {
    email: 'mom.metro.15@example.com',
    name: 'Test Mom Metro 15',
    practiceId: 'practice-metro-obgyn',
    deliveryDate: '2026-09-07',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 0,
    gad2Score: 0,
    complications: [],
    checkInDays: 29,
  },

  // Bayview Women's Health - 15 moms
  {
    email: 'mom.bayview.01@example.com',
    name: 'Test Mom Bayview 1',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-13',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 1,
    gad2Score: 0,
    complications: [],
    checkInDays: 23,
  },
  {
    email: 'mom.bayview.02@example.com',
    name: 'Test Mom Bayview 2',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-09',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.COMBO,
    phq2Score: 2,
    gad2Score: 1,
    complications: ['gestational_diabetes'],
    checkInDays: 27,
  },
  {
    email: 'mom.bayview.03@example.com',
    name: 'Test Mom Bayview 3',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-17',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 0,
    gad2Score: 0,
    complications: [],
    checkInDays: 19,
  },
  {
    email: 'mom.bayview.04@example.com',
    name: 'Test Mom Bayview 4',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-21',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.FORMULA,
    phq2Score: 3,
    gad2Score: 2,
    complications: ['preeclampsia'],
    checkInDays: 15,
  },
  {
    email: 'mom.bayview.05@example.com',
    name: 'Test Mom Bayview 5',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-10',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.PUMPING,
    phq2Score: 1,
    gad2Score: 2,
    complications: [],
    checkInDays: 26,
  },
  {
    email: 'mom.bayview.06@example.com',
    name: 'Test Mom Bayview 6',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-14',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 0,
    gad2Score: 1,
    complications: ['perineal_tear'],
    checkInDays: 22,
  },
  {
    email: 'mom.bayview.07@example.com',
    name: 'Test Mom Bayview 7',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-19',
    deliveryType: DeliveryType.VBAC,
    feedingMethod: FeedingMethod.COMBO,
    phq2Score: 2,
    gad2Score: 1,
    complications: [],
    checkInDays: 17,
  },
  {
    email: 'mom.bayview.08@example.com',
    name: 'Test Mom Bayview 8',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-06',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.FORMULA,
    phq2Score: 4,
    gad2Score: 3,
    complications: ['postpartum_hemorrhage'],
    checkInDays: 30,
  },
  {
    email: 'mom.bayview.09@example.com',
    name: 'Test Mom Bayview 9',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-24',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 1,
    gad2Score: 0,
    complications: [],
    checkInDays: 12,
  },
  {
    email: 'mom.bayview.10@example.com',
    name: 'Test Mom Bayview 10',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-12',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.PUMPING,
    phq2Score: 2,
    gad2Score: 2,
    complications: ['anemia'],
    checkInDays: 24,
  },
  {
    email: 'mom.bayview.11@example.com',
    name: 'Test Mom Bayview 11',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-16',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 0,
    gad2Score: 0,
    complications: ['thyroid_issues'],
    checkInDays: 20,
  },
  {
    email: 'mom.bayview.12@example.com',
    name: 'Test Mom Bayview 12',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-18',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.COMBO,
    phq2Score: 3,
    gad2Score: 3,
    complications: ['mastitis'],
    checkInDays: 18,
  },
  {
    email: 'mom.bayview.13@example.com',
    name: 'Test Mom Bayview 13',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-08',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 1,
    gad2Score: 1,
    complications: [],
    checkInDays: 28,
  },
  {
    email: 'mom.bayview.14@example.com',
    name: 'Test Mom Bayview 14',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-22',
    deliveryType: DeliveryType.C_SECTION,
    feedingMethod: FeedingMethod.FORMULA,
    phq2Score: 2,
    gad2Score: 1,
    complications: ['c_section_infection'],
    checkInDays: 14,
  },
  {
    email: 'mom.bayview.15@example.com',
    name: 'Test Mom Bayview 15',
    practiceId: 'practice-bayview-wh',
    deliveryDate: '2026-09-15',
    deliveryType: DeliveryType.VAGINAL,
    feedingMethod: FeedingMethod.BREASTFEEDING,
    phq2Score: 0,
    gad2Score: 0,
    complications: [],
    checkInDays: 21,
  },
];

function generateCheckInData(mom: TestMom, dayOffset: number) {
  const deliveryDate = new Date(mom.deliveryDate);
  const checkInDate = new Date(deliveryDate);
  checkInDate.setDate(deliveryDate.getDate() + dayOffset);

  // Simulate realistic patterns
  const isHighRisk = mom.phq2Score >= 3 || mom.gad2Score >= 3;
  const isCSection = mom.deliveryType === DeliveryType.C_SECTION;
  const isBreastfeeding = mom.feedingMethod !== FeedingMethod.FORMULA;

  // Base values with some variation
  let sleepHours = 4 + Math.random() * 3; // 4-7 hours
  let sleepDisruption = 2 + Math.floor(Math.random() * 3); // 2-4
  let sadness = 1 + Math.floor(Math.random() * 2); // 1-2
  let anxiety = 1 + Math.floor(Math.random() * 2); // 1-2
  let painLevel = isCSection
    ? 3 + Math.floor(Math.random() * 3)
    : 1 + Math.floor(Math.random() * 2); // C-section: 3-5, Vaginal: 1-2

  // Increase symptoms for high-risk moms
  if (isHighRisk) {
    sleepDisruption = Math.min(5, sleepDisruption + 1);
    sadness = Math.min(5, sadness + 1);
    anxiety = Math.min(5, anxiety + 1);
  }

  // Simulate escalation pattern for some moms (days 5-7)
  if (dayOffset >= 5 && dayOffset <= 7 && isHighRisk && Math.random() < 0.3) {
    sleepDisruption = 4;
    sadness = 3;
  }

  // Simulate recovery over time
  const recoveryFactor = Math.max(0, 1 - dayOffset / 42); // Gradual improvement over 6 weeks
  sleepHours = Math.min(8, sleepHours + recoveryFactor * 2);
  sleepDisruption = Math.max(1, sleepDisruption - Math.floor(recoveryFactor * 2));
  painLevel = Math.max(1, painLevel - Math.floor(recoveryFactor * 2));

  const bleedingOptions: BleedingLevel[] = [
    BleedingLevel.NONE,
    BleedingLevel.SPOTTING,
    BleedingLevel.LIGHT,
  ];
  if (dayOffset < 7) bleedingOptions.push(BleedingLevel.MODERATE);
  if (dayOffset < 3) bleedingOptions.push(BleedingLevel.HEAVY);
  const bleeding = bleedingOptions[Math.floor(Math.random() * bleedingOptions.length)];

  const feedingIssues = isBreastfeeding && Math.random() < 0.2;

  return {
    date: checkInDate,
    sleepHours: Math.round(sleepHours * 10) / 10,
    sleepDisruption: Math.min(5, Math.max(1, sleepDisruption)),
    sadness: Math.min(5, Math.max(1, sadness)),
    anxiety: Math.min(5, Math.max(1, anxiety)),
    painLevel: Math.min(10, Math.max(1, painLevel)),
    bleeding,
    feedingIssues,
    customResponses: {},
  };
}

async function main() {
  console.log('Seeding pilot test mom accounts with check-in data...\n');

  let created = 0;
  let skipped = 0;
  let totalCheckIns = 0;

  for (const mom of TEST_MOMS) {
    const existing = await prisma.user.findUnique({
      where: { email: mom.email },
    });

    if (existing) {
      console.log(`⏭️  Already exists: ${mom.email}`);
      skipped++;
      continue;
    }

    const passwordHash = await hashPassword('TestMom123!');

    const user = await prisma.user.create({
      data: {
        email: mom.email,
        passwordHash,
        role: 'MOM',
        emailVerified: true,
        onboarding: {
          create: {
            deliveryDate: new Date(mom.deliveryDate),
            deliveryType: mom.deliveryType,
            feedingMethod: mom.feedingMethod,
            mentalHealthBaseline: {
              phq2Score: mom.phq2Score,
              gad2Score: mom.gad2Score,
              epdsScore: mom.phq2Score + mom.gad2Score > 4 ? 12 : undefined,
            },
            complications: mom.complications,
            completedAt: new Date(),
          },
        },
      },
    });

    // Generate check-in data
    const checkIns = [];
    for (let day = 1; day <= mom.checkInDays; day++) {
      // Skip some days randomly (80% completion rate)
      if (Math.random() > 0.8) continue;

      const checkInData = generateCheckInData(mom, day);
      checkIns.push({
        userId: user.id,
        ...checkInData,
      });
    }

    if (checkIns.length > 0) {
      await prisma.checkIn.createMany({
        data: checkIns,
        skipDuplicates: true,
      });
      totalCheckIns += checkIns.length;
    }

    // Add push subscription for some moms (simulate 60% opt-in)
    if (Math.random() < 0.6) {
      await prisma.pushSubscription.create({
        data: {
          userId: user.id,
          endpoint: `https://fcm.googleapis.com/fcm/send/test-${user.id}`,
          p256dh: 'test-p256dh-key',
          auth: 'test-auth-key',
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'TEST_MOM_ACCOUNT_CREATED',
        resource: 'user',
        resourceId: user.id,
        metadata: {
          name: mom.name,
          practiceId: mom.practiceId,
          practiceName: PILOT_PRACTICES[mom.practiceId as keyof typeof PILOT_PRACTICES],
          checkInDays: mom.checkInDays,
          checkInsGenerated: checkIns.length,
        },
      },
    });

    created++;
    console.log(
      `✅ Created: ${mom.email} (${PILOT_PRACTICES[mom.practiceId as keyof typeof PILOT_PRACTICES]})`
    );
    console.log(`   Delivery: ${mom.deliveryDate} (${mom.deliveryType})`);
    console.log(`   Feeding: ${mom.feedingMethod}`);
    console.log(`   PHQ-2: ${mom.phq2Score}, GAD-2: ${mom.gad2Score}`);
    console.log(`   Check-ins: ${checkIns.length}/${mom.checkInDays} days\n`);
  }

  console.log('\n📊 SUMMARY:');
  console.log(`   Moms created: ${created}`);
  console.log(`   Moms skipped: ${skipped}`);
  console.log(`   Total check-ins generated: ${totalCheckIns}`);
  console.log(`   Avg check-ins per mom: ${Math.round(totalCheckIns / (created || 1))}`);

  // Practice breakdown
  for (const [_practiceId, practiceName] of Object.entries(PILOT_PRACTICES)) {
    const _count = await prisma.user.count({
      where: {
        role: 'MOM',
        onboarding: {
          // We can't easily filter by practiceId since it's not stored on user
          // But we can count by checking audit logs
        },
      },
    });
    console.log(`\n   ${practiceName}: Check audit logs for exact count`);
  }

  console.log('\n⚠️  NOTE: These are TEST accounts with example.com emails.');
  console.log('   Use for development/testing only. Delete before production pilot.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
