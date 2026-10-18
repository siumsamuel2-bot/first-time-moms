import { PrismaClient, ProviderScreeningStatus, Specialty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const providers = [
    {
      name: 'Dr. Sarah Johnson, MD',
      specialties: [Specialty.PERINATAL_MH, Specialty.PSYCHIATRY],
      location: {
        lat: 37.7749,
        lng: -122.4194,
        address: '123 Main St, San Francisco, CA 94102',
        radiusMiles: 25,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 2,
        slots: [
          { date: '2026-10-10', times: ['09:00', '10:00', '14:00'] },
          { date: '2026-10-11', times: ['09:00', '11:00', '15:00'] },
        ],
      },
      contactInfo: {
        phone: '(415) 555-0101',
        email: 'sarah.johnson@perinatalhealth.org',
        portalUrl: 'https://perinatalhealth.org/portal',
      },
    },
    {
      name: 'Lisa Chen, LCPC',
      specialties: [Specialty.PERINATAL_MH, Specialty.THERAPY],
      location: {
        lat: 37.7849,
        lng: -122.4094,
        address: '456 Market St, San Francisco, CA 94103',
        radiusMiles: 20,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Kaiser Permanente'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 3,
        slots: [
          { date: '2026-10-10', times: ['10:00', '13:00', '16:00'] },
          { date: '2026-10-12', times: ['09:00', '14:00'] },
        ],
      },
      contactInfo: {
        phone: '(415) 555-0102',
        email: 'lisa.chen@perinataltherapy.com',
        portalUrl: 'https://perinataltherapy.com/portal',
      },
    },
    {
      name: 'Maria Rodriguez, IBCLC',
      specialties: [Specialty.LACTATION],
      location: {
        lat: 37.7949,
        lng: -122.3994,
        address: '789 Mission St, San Francisco, CA 94104',
        radiusMiles: 15,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Cigna', 'UnitedHealthcare', 'Medi-Cal'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 1,
        slots: [
          { date: '2026-10-10', times: ['08:00', '09:30', '11:00', '13:00'] },
          { date: '2026-10-11', times: ['08:00', '10:00', '14:00'] },
        ],
      },
      contactInfo: {
        phone: '(415) 555-0103',
        email: 'maria.rodriguez@lactationsupport.org',
        portalUrl: 'https://lactationsupport.org/portal',
      },
    },
    {
      name: 'Dr. Emily Watson, DPT',
      specialties: [Specialty.PELVIC_FLOOR],
      location: {
        lat: 37.7649,
        lng: -122.4294,
        address: '321 Castro St, San Francisco, CA 94114',
        radiusMiles: 20,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 4,
        slots: [
          { date: '2026-10-12', times: ['09:00', '11:00', '15:00'] },
          { date: '2026-10-13', times: ['10:00', '14:00', '16:00'] },
        ],
      },
      contactInfo: {
        phone: '(415) 555-0104',
        email: 'emily.watson@pelvichealthpt.com',
        portalUrl: 'https://pelvichealthpt.com/portal',
      },
    },
    {
      name: 'Dr. James Miller, MD',
      specialties: [Specialty.OBGYN, Specialty.MIDWIFE],
      location: {
        lat: 37.7549,
        lng: -122.4394,
        address: '555 Valencia St, San Francisco, CA 94110',
        radiusMiles: 30,
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'Aetna',
        'Cigna',
        'UnitedHealthcare',
        'Kaiser Permanente',
      ],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 2,
        slots: [
          { date: '2026-10-10', times: ['08:00', '09:00', '10:00', '14:00'] },
          { date: '2026-10-11', times: ['08:00', '09:00', '15:00'] },
        ],
      },
      contactInfo: {
        phone: '(415) 555-0105',
        email: 'james.miller@sfobgyn.com',
        portalUrl: 'https://sfobgyn.com/portal',
      },
    },
    {
      name: 'Jennifer Park, LMFT',
      specialties: [Specialty.THERAPY, Specialty.PERINATAL_MH],
      location: {
        lat: 37.7849,
        lng: -122.4494,
        address: '999 Geary Blvd, San Francisco, CA 94109',
        radiusMiles: 25,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 5,
        slots: [
          { date: '2026-10-13', times: ['10:00', '13:00', '16:00'] },
          { date: '2026-10-14', times: ['09:00', '11:00', '14:00'] },
        ],
      },
      contactInfo: {
        phone: '(415) 555-0106',
        email: 'jennifer.park@familytherapy.org',
        portalUrl: 'https://familytherapy.org/portal',
      },
    },
    {
      name: 'Dr. Robert Kim, MD',
      specialties: [Specialty.PSYCHIATRY, Specialty.PERINATAL_MH],
      location: {
        lat: 37.7749,
        lng: -122.4594,
        address: '111 Post St, San Francisco, CA 94108',
        radiusMiles: 20,
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'Cigna',
        'UnitedHealthcare',
        'Kaiser Permanente',
      ],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 3,
        slots: [
          { date: '2026-10-11', times: ['09:00', '11:00', '14:00'] },
          { date: '2026-10-12', times: ['10:00', '13:00', '15:00'] },
        ],
      },
      contactInfo: {
        phone: '(415) 555-0107',
        email: 'robert.kim@perinatalpsychiatry.com',
        portalUrl: 'https://perinatalpsychiatry.com/portal',
      },
    },
    {
      name: 'Amy Thompson, CNM',
      specialties: [Specialty.MIDWIFE, Specialty.OBGYN],
      location: {
        lat: 37.7649,
        lng: -122.3894,
        address: '222 Folsom St, San Francisco, CA 94105',
        radiusMiles: 15,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'Medi-Cal'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 2,
        slots: [
          { date: '2026-10-10', times: ['08:00', '10:00', '13:00'] },
          { date: '2026-10-11', times: ['09:00', '11:00', '14:00'] },
        ],
      },
      contactInfo: {
        phone: '(415) 555-0108',
        email: 'amy.thompson@bayareamidwives.com',
        portalUrl: 'https://bayareamidwives.com/portal',
      },
    },
    // Additional providers for broader coverage
    {
      name: 'Dr. Karen Williams, MD',
      specialties: [Specialty.PERINATAL_MH, Specialty.PSYCHIATRY],
      location: {
        lat: 37.4419,
        lng: -122.143,
        address: '300 Pasteur Dr, Palo Alto, CA 94304',
        radiusMiles: 30,
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'Aetna',
        'Cigna',
        'UnitedHealthcare',
        'Stanford Health Care',
      ],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 3,
        slots: [
          { date: '2026-10-10', times: ['09:00', '11:00', '14:00'] },
          { date: '2026-10-11', times: ['10:00', '13:00', '15:00'] },
        ],
      },
      contactInfo: {
        phone: '(650) 555-0101',
        email: 'karen.williams@stanfordperinatal.org',
        portalUrl: 'https://stanfordperinatal.org/portal',
      },
    },
    {
      name: 'Sarah Martinez, LCSW',
      specialties: [Specialty.THERAPY, Specialty.PERINATAL_MH],
      location: {
        lat: 37.8044,
        lng: -122.2711,
        address: '2000 Center St, Berkeley, CA 94704',
        radiusMiles: 25,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'Medi-Cal'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 4,
        slots: [
          { date: '2026-10-12', times: ['09:00', '11:00', '14:00', '16:00'] },
          { date: '2026-10-13', times: ['10:00', '13:00', '15:00'] },
        ],
      },
      contactInfo: {
        phone: '(510) 555-0101',
        email: 'sarah.martinez@berkeleytherapy.org',
        portalUrl: 'https://berkeleytherapy.org/portal',
      },
    },
    {
      name: 'Dr. Lisa Patel, IBCLC',
      specialties: [Specialty.LACTATION],
      location: {
        lat: 37.3382,
        lng: -121.8863,
        address: '150 N Jackson Ave, San Jose, CA 95116',
        radiusMiles: 20,
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'Cigna',
        'UnitedHealthcare',
        'Kaiser Permanente',
        'Medi-Cal',
      ],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 1,
        slots: [
          { date: '2026-10-10', times: ['08:00', '09:30', '11:00', '13:00', '15:00'] },
          { date: '2026-10-11', times: ['08:00', '10:00', '14:00', '16:00'] },
        ],
      },
      contactInfo: {
        phone: '(408) 555-0101',
        email: 'lisa.patel@sanjose lactation.com',
        portalUrl: 'https://sanjose lactation.com/portal',
      },
    },
    {
      name: 'Dr. Michael Chen, DPT',
      specialties: [Specialty.PELVIC_FLOOR],
      location: {
        lat: 37.6879,
        lng: -122.4702,
        address: '1800 Sullivan Ave, Daly City, CA 94015',
        radiusMiles: 15,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 5,
        slots: [
          { date: '2026-10-13', times: ['09:00', '11:00', '14:00'] },
          { date: '2026-10-14', times: ['10:00', '13:00', '15:00', '16:00'] },
        ],
      },
      contactInfo: {
        phone: '(650) 555-0102',
        email: 'michael.chen@dalycitypt.com',
        portalUrl: 'https://dalycitypt.com/portal',
      },
    },
    {
      name: "Dr. Patricia O'Brien, MD",
      specialties: [Specialty.OBGYN, Specialty.MIDWIFE],
      location: {
        lat: 37.8716,
        lng: -122.2727,
        address: '350 Hawthorne Ave, Oakland, CA 94609',
        radiusMiles: 30,
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'Aetna',
        'Cigna',
        'UnitedHealthcare',
        'Kaiser Permanente',
        'Medi-Cal',
      ],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 2,
        slots: [
          { date: '2026-10-10', times: ['08:00', '09:00', '10:00', '14:00', '15:00'] },
          { date: '2026-10-11', times: ['08:00', '09:00', '15:00', '16:00'] },
        ],
      },
      contactInfo: {
        phone: '(510) 555-0102',
        email: 'patricia.obrien@oaklandobgyn.com',
        portalUrl: 'https://oaklandobgyn.com/portal',
      },
    },
    {
      name: 'Rachel Green, LMFT',
      specialties: [Specialty.THERAPY, Specialty.PERINATAL_MH],
      location: {
        lat: 37.9738,
        lng: -122.0311,
        address: '1234 San Pablo Ave, Albany, CA 94706',
        radiusMiles: 20,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'UnitedHealthcare', 'Medi-Cal'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 3,
        slots: [
          { date: '2026-10-11', times: ['10:00', '13:00', '16:00'] },
          { date: '2026-10-12', times: ['09:00', '11:00', '14:00', '15:00'] },
        ],
      },
      contactInfo: {
        phone: '(510) 555-0103',
        email: 'rachel.green@albanytherapy.org',
        portalUrl: 'https://albanytherapy.org/portal',
      },
    },
    {
      name: 'Dr. David Thompson, MD',
      specialties: [Specialty.PSYCHIATRY, Specialty.PERINATAL_MH],
      location: {
        lat: 37.4275,
        lng: -122.1697,
        address: '400 Quarry Rd, Palo Alto, CA 94304',
        radiusMiles: 25,
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'Cigna',
        'UnitedHealthcare',
        'Kaiser Permanente',
        'Stanford Health Care',
      ],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 4,
        slots: [
          { date: '2026-10-12', times: ['09:00', '11:00', '14:00'] },
          { date: '2026-10-13', times: ['10:00', '13:00', '15:00', '16:00'] },
        ],
      },
      contactInfo: {
        phone: '(650) 555-0103',
        email: 'david.thompson@stanfordpsychiatry.org',
        portalUrl: 'https://stanfordpsychiatry.org/portal',
      },
    },
    {
      name: 'Jessica Nguyen, CNM',
      specialties: [Specialty.MIDWIFE, Specialty.OBGYN],
      location: {
        lat: 37.7066,
        lng: -122.4686,
        address: '1000 Sneath Ln, San Bruno, CA 94066',
        radiusMiles: 15,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'Medi-Cal'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 2,
        slots: [
          { date: '2026-10-10', times: ['08:00', '10:00', '13:00', '15:00'] },
          { date: '2026-10-11', times: ['09:00', '11:00', '14:00'] },
        ],
      },
      contactInfo: {
        phone: '(650) 555-0104',
        email: 'jessica.nguyen@sanbrunomidwives.com',
        portalUrl: 'https://sanbrunomidwives.com/portal',
      },
    },
    {
      name: 'Dr. Amanda Foster, IBCLC',
      specialties: [Specialty.LACTATION],
      location: {
        lat: 37.5541,
        lng: -122.313,
        address: '2500 Grant Rd, Mountain View, CA 94040',
        radiusMiles: 20,
      },
      insuranceAccepted: [
        'Blue Cross Blue Shield',
        'Cigna',
        'UnitedHealthcare',
        'Kaiser Permanente',
        'Medi-Cal',
      ],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 1,
        slots: [
          { date: '2026-10-10', times: ['08:00', '09:30', '11:00', '13:00', '15:00'] },
          { date: '2026-10-11', times: ['08:00', '10:00', '14:00', '16:00'] },
        ],
      },
      contactInfo: {
        phone: '(650) 555-0105',
        email: 'amanda.foster@mountainviewlactation.org',
        portalUrl: 'https://mountainviewlactation.org/portal',
      },
    },
    {
      name: 'Dr. Steven Park, DPT',
      specialties: [Specialty.PELVIC_FLOOR],
      location: {
        lat: 37.3794,
        lng: -122.0386,
        address: '500 W Hamilton Ave, Campbell, CA 95008',
        radiusMiles: 15,
      },
      insuranceAccepted: ['Blue Cross Blue Shield', 'Aetna', 'Cigna', 'UnitedHealthcare'],
      screeningStatus: ProviderScreeningStatus.APPROVED,
      availability: {
        nextSlotDays: 4,
        slots: [
          { date: '2026-10-12', times: ['09:00', '11:00', '14:00', '16:00'] },
          { date: '2026-10-13', times: ['10:00', '13:00', '15:00'] },
        ],
      },
      contactInfo: {
        phone: '(408) 555-0102',
        email: 'steven.park@campbellpt.com',
        portalUrl: 'https://campbellpt.com/portal',
      },
    },
  ];

  for (const provider of providers) {
    const existing = await prisma.provider.findFirst({
      where: { name: provider.name },
    });

    if (!existing) {
      await prisma.provider.create({ data: provider });
      console.log(`Created provider: ${provider.name}`);
    } else {
      console.log(`Provider already exists: ${provider.name}`);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
