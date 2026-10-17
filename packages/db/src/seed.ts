import { db } from './db';
import { providers } from './schema';

const PROVIDER_SEED_DATA = [
  // ===== Perinatal Therapists (5) =====
  {
    name: 'Dr. Sarah Allen, PhD',
    specialty: 'Perinatal Therapist',
    location: 'Chicago, IL',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Veronica Ursetto, LCPC, PMH-C',
    specialty: 'Perinatal Therapist',
    location: 'Chicago, IL',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Shivonne Odom-Chase, LICSW, PMH-C',
    specialty: 'Perinatal Therapist',
    location: 'Washington, DC',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Lillian Rishty, LCSW, PMH-C',
    specialty: 'Perinatal Therapist',
    location: 'Brooklyn, NY',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Jade Rubino, PsyD, PMH-C',
    specialty: 'Perinatal Therapist',
    location: 'Fairfax, VA',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },

  // ===== Lactation Consultants (5) =====
  {
    name: 'Sarah Early, MSN, FNP-C, IBCLC',
    specialty: 'Lactation Consultant',
    location: 'Washington, DC',
    phone: '(301) 529-5433',
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Jessica Claire, IBCLC',
    specialty: 'Lactation Consultant',
    location: 'Los Angeles, CA',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Allison Mahurin, RN, IBCLC',
    specialty: 'Lactation Consultant',
    location: 'Los Angeles, CA',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Connie Reyes-Preciado, BS, IBCLC',
    specialty: 'Lactation Consultant',
    location: 'Los Angeles, CA',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Alejandra De Leon, BSN, RN, IBCLC',
    specialty: 'Lactation Consultant',
    location: 'Los Angeles, CA',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },

  // ===== Pelvic Floor PTs (5) =====
  {
    name: 'Natasha Dawkins, PT, DPT, WCS, PRPC',
    specialty: 'Pelvic Floor PT',
    location: 'Carrollton, GA',
    phone: '(770) 834-8702',
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Adina Leifer, PT, DPT, PRPC',
    specialty: 'Pelvic Floor PT',
    location: 'Atlanta, GA',
    phone: '(770) 709-5519',
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Courtney Edgecomb, PT, DPT',
    specialty: 'Pelvic Floor PT',
    location: 'Los Angeles, CA',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Dr. Rachel Daof, DPT',
    specialty: 'Pelvic Floor PT',
    location: 'Los Angeles, CA',
    phone: null,
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
  {
    name: 'Femina PT',
    specialty: 'Pelvic Floor PT',
    location: 'Los Angeles, CA',
    phone: '(818) 877-6910',
    acceptingNewPatients: 'true',
    contractStatus: 'active',
  },
];

export async function seedProviders() {
  await db.insert(providers).values(PROVIDER_SEED_DATA);
  console.log(`Seeded ${PROVIDER_SEED_DATA.length} providers`);
}

export { PROVIDER_SEED_DATA };
