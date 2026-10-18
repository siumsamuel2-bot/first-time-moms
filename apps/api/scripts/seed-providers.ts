import { PrismaClient, ProviderScreeningStatus, Specialty } from '@prisma/client';

const prisma = new PrismaClient();

interface ProviderSeed {
  name: string;
  specialties: Specialty[];
  location: {
    lat: number;
    lng: number;
    address: string;
    radiusMiles: number;
    city: string;
    state: string;
    zipCode: string;
  };
  insuranceAccepted: string[];
  screeningStatus: ProviderScreeningStatus;
  availability: {
    nextSlotDays: number;
    slots: { date: string; times: string[] }[];
    days: string[];
    hours: { start: string; end: string };
    virtual: boolean;
    inPerson: boolean;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
    npi: string;
  };
}

const SCREENED_PROVIDERS: ProviderSeed[] = [
  // Perinatal Mental Health Specialists
  {
    name: 'Dr. Rachel Thompson, MD',
    specialties: [Specialty.PERINATAL_MH, Specialty.PSYCHIATRY],
    location: {
      lat: 33.8321,
      lng: -84.3213,
      address: '1200 Medical Center Dr',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30322',
    },
    insuranceAccepted: ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'UnitedHealthcare', 'Medicaid'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      hours: { start: '09:00', end: '17:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0123',
      email: 'dr.thompson@perinatalwellness.com',
      website: 'https://perinatalwellness.com',
      npi: '1234567890',
    },
  },
  {
    name: 'Dr. Maria Gonzalez, PhD',
    specialties: [Specialty.PERINATAL_MH, Specialty.THERAPY],
    location: {
      lat: 33.7756,
      lng: -84.3821,
      address: '550 Peachtree St NE Ste 1800',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30308',
    },
    insuranceAccepted: ['Blue Cross Blue Shield', 'Cigna', 'Aetna', 'Optum'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: { start: '10:00', end: '18:00' },
      virtual: true,
      inPerson: false,
    },
    contactInfo: {
      phone: '(404) 555-0124',
      email: 'dr.gonzalez@mindfulmotherhood.com',
      website: 'https://mindfulmotherhood.com',
      npi: '1234567891',
    },
  },
  {
    name: 'Dr. James Wilson, MD',
    specialties: [Specialty.PERINATAL_MH, Specialty.PSYCHIATRY],
    location: {
      lat: 33.8123,
      lng: -84.4156,
      address: '1800 Howell Mill Rd NW Ste 250',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30318',
    },
    insuranceAccepted: ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Humana', 'Medicare'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Tuesday', 'Thursday', 'Friday'],
      hours: { start: '08:00', end: '16:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0125',
      email: 'dr.wilson@atlantapsych.com',
      website: 'https://atlantapsych.com',
      npi: '1234567892',
    },
  },

  // Lactation Consultants
  {
    name: 'Sarah Mitchell, IBCLC',
    specialties: [Specialty.LACTATION],
    location: {
      lat: 34.0754,
      lng: -84.2941,
      address: '3400 Old Milton Pkwy Ste C120',
      radiusMiles: 25,
      city: 'Alpharetta',
      state: 'GA',
      zipCode: '30005',
    },
    insuranceAccepted: ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Tricare', 'Medicaid'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: { start: '09:00', end: '16:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(678) 555-0126',
      email: 'sarah@nurturelactation.com',
      website: 'https://nurturelactation.com',
      npi: '1234567893',
    },
  },
  {
    name: 'Jennifer Park, IBCLC, RN',
    specialties: [Specialty.LACTATION],
    location: {
      lat: 33.9321,
      lng: -84.3654,
      address: '1100 Johnson Ferry Rd NE Ste 200',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30342',
    },
    insuranceAccepted: ['Blue Cross Blue Shield', 'Cigna', 'Aetna', 'UnitedHealthcare'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      hours: { start: '08:00', end: '14:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0127',
      email: 'jennifer@milkmatters.com',
      website: 'https://milkmatters.com',
      npi: '1234567894',
    },
  },
  {
    name: 'Lisa Chen, IBCLC',
    specialties: [Specialty.LACTATION],
    location: {
      lat: 34.2212,
      lng: -84.1356,
      address: '2000 Howard Farm Dr Ste 100',
      radiusMiles: 25,
      city: 'Cumming',
      state: 'GA',
      zipCode: '30041',
    },
    insuranceAccepted: ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Humana'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Tuesday', 'Thursday', 'Saturday'],
      hours: { start: '10:00', end: '17:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(770) 555-0128',
      email: 'lisa@lactationsupportga.com',
      website: 'https://lactationsupportga.com',
      npi: '1234567895',
    },
  },

  // Pelvic Floor Physical Therapists
  {
    name: 'Dr. Amanda Foster, DPT',
    specialties: [Specialty.PELVIC_FLOOR],
    location: {
      lat: 33.9214,
      lng: -84.3487,
      address: '5673 Peachtree Dunwoody Rd NE Ste 200',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30342',
    },
    insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Medicare'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: { start: '07:00', end: '15:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0129',
      email: 'amanda@pelvichealthatl.com',
      website: 'https://pelvichealthatl.com',
      npi: '1234567896',
    },
  },
  {
    name: 'Dr. Robert Kim, DPT',
    specialties: [Specialty.PELVIC_FLOOR],
    location: {
      lat: 33.8654,
      lng: -84.4321,
      address: '3200 Downwood Cir NW Ste 350',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30327',
    },
    insuranceAccepted: ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Humana', 'Tricare'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Tuesday', 'Thursday'],
      hours: { start: '08:00', end: '16:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0130',
      email: 'robert@corepelvicpt.com',
      website: 'https://corepelvicpt.com',
      npi: '1234567897',
    },
  },
  {
    name: 'Dr. Emily Rodriguez, DPT',
    specialties: [Specialty.PELVIC_FLOOR],
    location: {
      lat: 34.0456,
      lng: -84.2567,
      address: '11555 Jones Bridge Rd Ste 200',
      radiusMiles: 25,
      city: 'Alpharetta',
      state: 'GA',
      zipCode: '30005',
    },
    insuranceAccepted: ['Blue Cross Blue Shield', 'Cigna', 'Aetna', 'UnitedHealthcare'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      hours: { start: '09:00', end: '17:00' },
      virtual: false,
      inPerson: true,
    },
    contactInfo: {
      phone: '(678) 555-0131',
      email: 'emily@alpharettapelvic.com',
      website: 'https://alpharettapelvic.com',
      npi: '1234567898',
    },
  },

  // OB-GYN / Midwife
  {
    name: 'Dr. Sarah Mitchell, MD, FACOG',
    specialties: [Specialty.OBGYN],
    location: {
      lat: 33.8123,
      lng: -84.4156,
      address: '1800 Howell Mill Rd NW Ste 500',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30318',
    },
    insuranceAccepted: [
      'Aetna',
      'Blue Cross Blue Shield',
      'Cigna',
      'UnitedHealthcare',
      'Medicaid',
      'Medicare',
    ],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: { start: '08:00', end: '17:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0132',
      email: 'dr.mitchell@metroobgyn.com',
      website: 'https://metroobgyn.com',
      npi: '1234567899',
    },
  },
  {
    name: 'Jennifer Williams, CNM',
    specialties: [Specialty.MIDWIFE, Specialty.OBGYN],
    location: {
      lat: 33.7756,
      lng: -84.3821,
      address: '550 Peachtree St NE Ste 1500',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30308',
    },
    insuranceAccepted: ['Blue Cross Blue Shield', 'Cigna', 'Aetna', 'UnitedHealthcare', 'Medicaid'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: { start: '09:00', end: '16:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0133',
      email: 'jennifer@bayviewwh.com',
      website: 'https://bayviewwh.com',
      npi: '1234567900',
    },
  },
  {
    name: 'Dr. Michael Chen, MD',
    specialties: [Specialty.OBGYN],
    location: {
      lat: 33.9234,
      lng: -84.3654,
      address: '1100 Lake Hearn Dr NE Ste 200',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30342',
    },
    insuranceAccepted: ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Humana', 'Medicare'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Tuesday', 'Thursday', 'Friday'],
      hours: { start: '08:30', end: '16:30' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0134',
      email: 'dr.chen@metroobgyn.com',
      website: 'https://metroobgyn.com',
      npi: '1234567901',
    },
  },

  // Doula Support
  {
    name: 'Maria Santos, CD(DONA)',
    specialties: [Specialty.DOULA],
    location: {
      lat: 33.749,
      lng: -84.388,
      address: 'Serving Greater Atlanta Area',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30308',
    },
    insuranceAccepted: ['Private pay', 'Some insurance reimbursement', 'HSA/FSA'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: { start: '08:00', end: '20:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0135',
      email: 'maria@atlantadoulas.com',
      website: 'https://atlantadoulas.com',
      npi: '1234567902',
    },
  },
  {
    name: 'Ashley Johnson, CD(DONA), CLC',
    specialties: [Specialty.DOULA, Specialty.LACTATION],
    location: {
      lat: 34.0754,
      lng: -84.2941,
      address: 'Serving North Fulton & Gwinnett',
      radiusMiles: 25,
      city: 'Alpharetta',
      state: 'GA',
      zipCode: '30005',
    },
    insuranceAccepted: ['Private pay', 'HSA/FSA', 'Some insurance reimbursement'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      hours: { start: '09:00', end: '18:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(678) 555-0136',
      email: 'ashley@northatlantadoula.com',
      website: 'https://northatlantadoula.com',
      npi: '1234567903',
    },
  },

  // Additional Therapists
  {
    name: 'Dr. Patricia Adams, PhD',
    specialties: [Specialty.THERAPY, Specialty.PERINATAL_MH],
    location: {
      lat: 33.8456,
      lng: -84.3789,
      address: '3500 Piedmont Rd NE Ste 300',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30305',
    },
    insuranceAccepted: ['Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Optum', 'UnitedHealthcare'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      hours: { start: '10:00', end: '19:00' },
      virtual: true,
      inPerson: false,
    },
    contactInfo: {
      phone: '(404) 555-0137',
      email: 'dr.adams@perinataltherapy.com',
      website: 'https://perinataltherapy.com',
      npi: '1234567904',
    },
  },
  {
    name: 'Dr. Kevin Brown, PsyD',
    specialties: [Specialty.THERAPY, Specialty.PERINATAL_MH],
    location: {
      lat: 33.789,
      lng: -84.3852,
      address: '1230 Peachtree St NE Ste 1900',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309',
    },
    insuranceAccepted: ['Blue Cross Blue Shield', 'Cigna', 'Aetna', 'Humana', 'Medicare'],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Tuesday', 'Wednesday', 'Friday'],
      hours: { start: '09:00', end: '17:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0138',
      email: 'dr.brown@atltherapy.com',
      website: 'https://atltherapy.com',
      npi: '1234567905',
    },
  },

  // Psychiatry
  {
    name: 'Dr. Linda Chang, MD',
    specialties: [Specialty.PSYCHIATRY, Specialty.PERINATAL_MH],
    location: {
      lat: 33.8012,
      lng: -84.3923,
      address: '1968 Peachtree Rd NW Ste 300',
      radiusMiles: 25,
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309',
    },
    insuranceAccepted: [
      'Aetna',
      'Blue Cross Blue Shield',
      'Cigna',
      'UnitedHealthcare',
      'Medicare',
      'Medicaid',
    ],
    screeningStatus: ProviderScreeningStatus.APPROVED,
    availability: {
      nextSlotDays: 3,
      slots: [],
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: { start: '08:00', end: '15:00' },
      virtual: true,
      inPerson: true,
    },
    contactInfo: {
      phone: '(404) 555-0139',
      email: 'dr.chang@atlantapsych.com',
      website: 'https://atlantapsych.com',
      npi: '1234567906',
    },
  },
];

async function main() {
  console.log('Seeding screened provider directory...\n');

  let created = 0;
  let skipped = 0;

  for (const provider of SCREENED_PROVIDERS) {
    const existing = await prisma.provider.findFirst({
      where: {
        name: provider.name,
        contactInfo: { path: ['email'], equals: provider.contactInfo.email },
      },
    });

    if (existing) {
      console.log(`⏭️  Already exists: ${provider.name}`);
      skipped++;
      continue;
    }

    await prisma.provider.create({
      data: {
        name: provider.name,
        specialties: provider.specialties,
        location: provider.location,
        insuranceAccepted: provider.insuranceAccepted,
        screeningStatus: provider.screeningStatus,
        availability: provider.availability,
        contactInfo: provider.contactInfo,
      },
    });

    created++;
    console.log(`✅ Created: ${provider.name}`);
    console.log(`   Specialties: ${provider.specialties.join(', ')}`);
    console.log(
      `   Location: ${provider.location.city}, ${provider.location.state} ${provider.location.zipCode}`
    );
    console.log(
      `   Virtual: ${provider.availability.virtual ? 'Yes' : 'No'}, In-Person: ${provider.availability.inPerson ? 'Yes' : 'No'}`
    );
    console.log(`   Insurance: ${provider.insuranceAccepted.join(', ')}\n`);
  }

  console.log('\n📊 SUMMARY:');
  console.log(`   Providers created: ${created}`);
  console.log(`   Providers skipped: ${skipped}`);
  console.log(`   Total in directory: ${created + skipped}`);

  // Summary by specialty
  const specialtyCounts = await prisma.provider.groupBy({
    by: ['specialties'],
    where: { screeningStatus: ProviderScreeningStatus.APPROVED },
    _count: true,
  });

  console.log('\n📋 PROVIDERS BY SPECIALTY (Approved):');
  for (const spec of specialtyCounts) {
    const specialties = spec.specialties as Specialty[];
    console.log(`   ${specialties.join(', ')}: ${spec._count}`);
  }

  // Summary by screening status
  const statusCounts = await prisma.provider.groupBy({
    by: ['screeningStatus'],
    _count: true,
  });

  console.log('\n📋 PROVIDERS BY SCREENING STATUS:');
  for (const status of statusCounts) {
    console.log(`   ${status.screeningStatus}: ${status._count}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
