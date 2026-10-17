import { pgTable, uuid, text, timestamp, date, pgEnum, jsonb, integer } from 'drizzle-orm/pg-core';

export const deliveryTypeEnum = pgEnum('delivery_type', [
  'vaginal',
  'c_section',
  'emergency_c_section',
]);

export const feedingMethodEnum = pgEnum('feeding_method', ['breast', 'bottle', 'both']);

export const escalationSeverityEnum = pgEnum('escalation_severity', [
  'low',
  'medium',
  'high',
  'critical',
]);

export const recoveryProfiles = pgTable('recovery_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  deliveryDate: date('delivery_date').notNull(),
  deliveryType: deliveryTypeEnum('delivery_type').notNull(),
  feedingMethod: feedingMethodEnum('feeding_method'),
  mentalHealthBaseline: jsonb('mental_health_baseline'),
  complications: text('complications').array(),
  dataConsent: text('data_consent').default('false'),
  dataConsentVersion: text('data_consent_version'),
  dataConsentGrantedAt: timestamp('data_consent_granted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const dailyCheckIns = pgTable('daily_check_ins', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => recoveryProfiles.id),
  checkInDate: date('check_in_date').notNull(),
  responses: jsonb('responses').notNull(),
  escalationScore: integer('escalation_score').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const escalations = pgTable('escalations', {
  id: uuid('id').primaryKey().defaultRandom(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => recoveryProfiles.id),
  triggeredAt: timestamp('triggered_at').notNull().defaultNow(),
  severity: escalationSeverityEnum('severity').notNull(),
  symptoms: text('symptoms').array(),
  triageResult: jsonb('triage_result'),
  clinicianReviewedAt: timestamp('clinician_reviewed_at'),
  resolvedAt: timestamp('resolved_at'),
});

export const providers = pgTable('providers', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  specialty: text('specialty').notNull(),
  location: text('location'),
  phone: text('phone'),
  acceptingNewPatients: text('accepting_new_patients').notNull().default('true'),
  contractStatus: text('contract_status').notNull().default('active'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: uuid('resource_id'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const riskLevelEnum = pgEnum('risk_level', ['low', 'moderate', 'high', 'urgent']);

export const quizResults = pgTable('quiz_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  answers: text('answers').notNull(),
  riskLevel: riskLevelEnum('risk_level').notNull(),
  summary: text('summary').notNull(),
  recommendations: text('recommendations').array(),
  nextSteps: text('next_steps').array(),
  email: text('email'),
  name: text('name'),
  referralCode: text('referral_code'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const referralStatusEnum = pgEnum('referral_status', ['pending', 'completed', 'expired', 'fraud']);

export const referrals = pgTable('referrals', {
  id: uuid('id').primaryKey().defaultRandom(),
  referrerCode: text('referrer_code').notNull(),
  referredEmail: text('referred_email').notNull(),
  status: referralStatusEnum('status').notNull().default('pending'),
  rewardClaimed: text('reward_claimed').default('false'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});