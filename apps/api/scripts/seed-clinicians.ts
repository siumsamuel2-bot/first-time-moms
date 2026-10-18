import { PrismaClient, Role } from '@prisma/client';
import { hashPassword } from '../src/utils/auth.js';

const prisma = new PrismaClient();

interface ClinicianSeed {
  email: string;
  name: string;
  practiceId: string;
  practiceName: string;
  role: Role;
  temporaryPassword: string;
}

const PILOT_CLINICIANS: ClinicianSeed[] = [
  // Practice 1: Metro OB-GYN Associates
  {
    email: 'dr.sarah.mitchell@metroobgyn.com',
    name: 'Dr. Sarah Mitchell, MD',
    practiceId: 'practice-metro-obgyn',
    practiceName: 'Metro OB-GYN Associates',
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },
  {
    email: 'dr.michael.chen@metroobgyn.com',
    name: 'Dr. Michael Chen, MD',
    practiceId: 'practice-metro-obgyn',
    practiceName: 'Metro OB-GYN Associates',
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },
  {
    email: 'jennifer.williams@metroobgyn.com',
    name: 'Jennifer Williams, CNM',
    practiceId: 'practice-metro-obgyn',
    practiceName: 'Metro OB-GYN Associates',
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },
  {
    email: 'lisa.rodriguez@metroobgyn.com',
    name: 'Lisa Rodriguez, NP',
    practiceId: 'practice-metro-obgyn',
    practiceName: 'Metro OB-GYN Associates',
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },
  {
    email: 'admin@metroobgyn.com',
    name: 'Practice Administrator',
    practiceId: 'practice-metro-obgyn',
    practiceName: 'Metro OB-GYN Associates',
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },

  // Practice 2: Bayview Women's Health
  {
    email: 'dr.emily.johnson@bayviewwh.com',
    name: 'Dr. Emily Johnson, MD',
    practiceId: 'practice-bayview-wh',
    practiceName: "Bayview Women's Health",
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },
  {
    email: 'dr.david.park@bayviewwh.com',
    name: 'Dr. David Park, MD',
    practiceId: 'practice-bayview-wh',
    practiceName: "Bayview Women's Health",
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },
  {
    email: 'amanda.foster@bayviewwh.com',
    name: 'Amanda Foster, CNM',
    practiceId: 'practice-bayview-wh',
    practiceName: "Bayview Women's Health",
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },
  {
    email: 'robert.kim@bayviewwh.com',
    name: 'Robert Kim, PA-C',
    practiceId: 'practice-bayview-wh',
    practiceName: "Bayview Women's Health",
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },
  {
    email: 'admin@bayviewwh.com',
    name: 'Practice Administrator',
    practiceId: 'practice-bayview-wh',
    practiceName: "Bayview Women's Health",
    role: Role.CLINICIAN,
    temporaryPassword: 'TempPass123!',
  },

  // Super Admin (Firstweeks team)
  {
    email: 'admin@firstweeks.app',
    name: 'Firstweeks Administrator',
    practiceId: 'firstweeks-admin',
    practiceName: 'Firstweeks Platform',
    role: Role.ADMIN,
    temporaryPassword: 'AdminTempPass123!',
  },
];

async function main() {
  console.log('Seeding pilot clinician accounts...\n');

  for (const clinician of PILOT_CLINICIANS) {
    const existing = await prisma.user.findUnique({
      where: { email: clinician.email },
    });

    if (existing) {
      console.log(`⏭️  Already exists: ${clinician.email} (${clinician.practiceName})`);
      continue;
    }

    const passwordHash = await hashPassword(clinician.temporaryPassword);

    const user = await prisma.user.create({
      data: {
        email: clinician.email,
        passwordHash,
        role: clinician.role,
        emailVerified: true, // Pre-verified for pilot
      },
    });

    // Create a practice profile note
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'CLINICIAN_ACCOUNT_CREATED',
        resource: 'user',
        resourceId: user.id,
        metadata: {
          name: clinician.name,
          practiceId: clinician.practiceId,
          practiceName: clinician.practiceName,
          temporaryPassword: clinician.temporaryPassword,
        },
      },
    });

    console.log(`✅ Created: ${clinician.email}`);
    console.log(`   Name: ${clinician.name}`);
    console.log(`   Practice: ${clinician.practiceName} (${clinician.practiceId})`);
    console.log(`   Role: ${clinician.role}`);
    console.log(`   Temp Password: ${clinician.temporaryPassword}\n`);
  }

  // Verify all accounts
  const totalClinicians = await prisma.user.count({
    where: { role: { in: [Role.CLINICIAN, Role.ADMIN] } },
  });

  console.log(`\n📊 Total clinicians/admins: ${totalClinicians}`);

  // List by practice
  const byPractice = await prisma.user.groupBy({
    by: ['role'],
    where: { role: { in: [Role.CLINICIAN, Role.ADMIN] } },
    _count: true,
  });
  console.log('\nBy role:', byPractice);

  console.log('\n⚠️  IMPORTANT: Clinicians must change temporary password on first login!');
  console.log('   Direct them to: https://app.firstweeks.app/login');
  console.log('   Then use "Forgot Password" or login with temp password and change immediately.');

  // Print practice summary for CMO
  console.log('\n📋 PILOT PRACTICE SUMMARY FOR CMO:');
  console.log('=====================================');
  console.log('Practice 1: Metro OB-GYN Associates');
  console.log('  Clinicians: 5 (2 MDs, 1 CNM, 1 NP, 1 Admin)');
  console.log(
    '  Emails: dr.sarah.mitchell, dr.michael.chen, jennifer.williams, lisa.rodriguez, admin@metroobgyn.com'
  );
  console.log('');
  console.log("Practice 2: Bayview Women's Health");
  console.log('  Clinicians: 5 (2 MDs, 1 CNM, 1 PA-C, 1 Admin)');
  console.log(
    '  Emails: dr.emily.johnson, dr.david.park, amanda.foster, robert.kim, admin@bayviewwh.com'
  );
  console.log('');
  console.log('Platform Admin: admin@firstweeks.app');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
