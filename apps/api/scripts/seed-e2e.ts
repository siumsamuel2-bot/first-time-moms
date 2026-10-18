import {
  DeliveryType,
  EscalationSeverity,
  EscalationStatus,
  EscalationTrigger,
  FeedingMethod,
  PrismaClient,
  ProviderScreeningStatus,
  ReferralStatus,
  Role,
  Specialty,
} from '@prisma/client';
import { hashPassword } from '../src/utils/auth.js';

const prisma = new PrismaClient();

export const E2E_PASSWORD = 'E2eTest123!';

export const E2E_ACCOUNTS = {
  mom: 'e2e.mom@firstweeks.test',
  escalation: 'e2e.escalation@firstweeks.test',
  onboarding: 'e2e.onboarding@firstweeks.test',
  clinician: 'e2e.clinician@firstweeks.test',
} as const;

const PROVIDERS = [
  {
    name: 'E2E Perinatal & Pelvic Health',
    specialties: [Specialty.PERINATAL_MH, Specialty.PELVIC_FLOOR, Specialty.OBGYN],
    insuranceAccepted: ['Blue Cross', 'Aetna'],
    nextSlotDays: 2,
  },
  {
    name: 'E2E Lactation & Mood Clinic',
    specialties: [Specialty.PERINATAL_MH, Specialty.LACTATION, Specialty.MIDWIFE],
    insuranceAccepted: ['Blue Cross', 'Cigna'],
    nextSlotDays: 5,
  },
];

function isoDaysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

async function reset() {
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: { in: Object.values(E2E_ACCOUNTS) } },
        { email: { startsWith: 'e2e-signup-' } },
      ],
    },
  });

  await prisma.provider.deleteMany({
    where: { name: { in: PROVIDERS.map((p) => p.name) } },
  });
}

async function createProviders() {
  const created = [];
  for (const provider of PROVIDERS) {
    created.push(
      await prisma.provider.create({
        data: {
          name: provider.name,
          specialties: provider.specialties,
          screeningStatus: ProviderScreeningStatus.APPROVED,
          insuranceAccepted: provider.insuranceAccepted,
          location: {
            lat: 37.7749,
            lng: -122.4194,
            address: '123 Market St, San Francisco, CA',
            radiusMiles: 25,
          },
          availability: {
            nextSlotDays: provider.nextSlotDays,
            slots: [
              { date: isoDaysFromNow(provider.nextSlotDays), times: ['09:00', '13:00', '16:00'] },
            ],
          },
          contactInfo: {
            phone: '415-555-0100',
            email: 'intake@e2e-providers.test',
          },
        },
      })
    );
  }
  return created;
}

async function createMom(params: {
  email: string;
  withOnboarding: boolean;
  withEscalation?: boolean;
  providerId?: string;
}) {
  const passwordHash = await hashPassword(E2E_PASSWORD);
  const user = await prisma.user.create({
    data: {
      email: params.email,
      passwordHash,
      role: Role.MOM,
      emailVerified: true,
    },
  });

  if (!params.withOnboarding) return user;

  await prisma.onboarding.create({
    data: {
      userId: user.id,
      deliveryDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
      deliveryType: DeliveryType.VAGINAL,
      feedingMethod: FeedingMethod.FORMULA,
      mentalHealthBaseline: { phq2Score: 0, gad2Score: 0 },
      complications: [],
      completedAt: new Date(),
    },
  });

  if (params.withEscalation && params.providerId) {
    const escalation = await prisma.escalation.create({
      data: {
        userId: user.id,
        trigger: EscalationTrigger.PAIN_SPIKE,
        severity: EscalationSeverity.HIGH,
        status: EscalationStatus.PENDING,
        contextSummary:
          'Postpartum day: 28 | Sleep disruption streak: 0 days (>=4/5) | Sadness streak: 0 days (>=3/5) | Max pain level: 9/10 | Risk level: MEDIUM',
      },
    });

    await prisma.referral.create({
      data: {
        escalationId: escalation.id,
        providerId: params.providerId,
        userId: user.id,
        status: ReferralStatus.PENDING,
        contextSummary:
          'Postpartum week: 4; Delivery: VAGINAL; Feeding: FORMULA; Max pain level: 9/10; Risk flags: none',
        momConsent: false,
      },
    });
  }

  return user;
}

async function main() {
  console.log('Resetting e2e fixtures...');
  await reset();

  console.log('Seeding e2e providers...');
  const providers = await createProviders();

  console.log('Seeding e2e accounts...');
  await createMom({
    email: E2E_ACCOUNTS.mom,
    withOnboarding: true,
    withEscalation: true,
    providerId: providers[0].id,
  });
  await createMom({ email: E2E_ACCOUNTS.escalation, withOnboarding: true });
  await createMom({ email: E2E_ACCOUNTS.onboarding, withOnboarding: false });

  const clinicianHash = await hashPassword(E2E_PASSWORD);
  await prisma.user.create({
    data: {
      email: E2E_ACCOUNTS.clinician,
      passwordHash: clinicianHash,
      role: Role.CLINICIAN,
      emailVerified: true,
    },
  });

  console.log('E2E fixtures ready:');
  for (const [role, email] of Object.entries(E2E_ACCOUNTS)) {
    console.log(`  ${role.padEnd(11)} ${email} / ${E2E_PASSWORD}`);
  }
}

main()
  .catch((e) => {
    console.error('E2E seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
