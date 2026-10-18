import { z } from 'zod';
import {
  BleedingLevel,
  DeliveryType,
  EscalationSeverity,
  EscalationStatus,
  EscalationTrigger,
  FeedingMethod,
  ProviderScreeningStatus,
  ReferralStatus,
  Role,
  Specialty,
} from './enums.js';

export const IdSchema = z.string().cuid();
export const DateTimeSchema = z.string().datetime();
export const DateSchema = z.string().date();

export const UserSchema = z.object({
  id: IdSchema,
  email: z.string().email(),
  role: z.nativeEnum(Role),
  emailVerified: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const OnboardingInputSchema = z.object({
  deliveryDate: DateSchema,
  deliveryType: z.nativeEnum(DeliveryType),
  feedingMethod: z.nativeEnum(FeedingMethod),
  mentalHealthBaseline: z.object({
    phq2Score: z.number().int().min(0).max(6),
    gad2Score: z.number().int().min(0).max(6),
    epdsScore: z.number().int().min(0).max(30).optional(),
  }),
  complications: z.array(z.string()).default([]),
});

export const OnboardingSchema = OnboardingInputSchema.extend({
  id: IdSchema,
  userId: IdSchema,
  completedAt: DateTimeSchema.optional(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const RecoveryProfileSchema = z.object({
  userId: IdSchema,
  deliveryType: z.nativeEnum(DeliveryType),
  feedingMethod: z.nativeEnum(FeedingMethod),
  weeksPostpartum: z.number().int().min(0).max(52),
  riskFlags: z.array(z.string()),
  needsMentalHealth: z.boolean(),
  needsLactation: z.boolean(),
  needsPelvicFloor: z.boolean(),
  insurance: z.string().optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
      zipCode: z.string(),
    })
    .optional(),
});

export const CheckInInputSchema = z.object({
  date: DateSchema,
  sleepHours: z.number().min(0).max(24).optional(),
  sleepDisruption: z.number().int().min(1).max(5).optional(),
  sadness: z.number().int().min(1).max(5).optional(),
  anxiety: z.number().int().min(1).max(5).optional(),
  painLevel: z.number().int().min(1).max(10).optional(),
  bleeding: z.nativeEnum(BleedingLevel).optional(),
  feedingIssues: z.boolean().default(false),
  customResponses: z.record(z.unknown()).default({}),
});

export const CheckInSchema = CheckInInputSchema.extend({
  id: IdSchema,
  userId: IdSchema,
  createdAt: DateTimeSchema,
});

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['scale', 'boolean', 'multiple_choice', 'text']),
  options: z.array(z.string()).optional(),
  required: z.boolean(),
  category: z.string(),
  weight: z.number().optional(),
});

export const TodaysQuestionsResponseSchema = z.object({
  questions: z.array(QuestionSchema),
  maxQuestions: z.number().int().min(1).max(10),
});

export const EscalationSchema = z.object({
  id: IdSchema,
  userId: IdSchema,
  userEmail: z.string().optional(),
  trigger: z.nativeEnum(EscalationTrigger),
  severity: z.nativeEnum(EscalationSeverity),
  status: z.nativeEnum(EscalationStatus),
  assignedTo: IdSchema.optional(),
  contextSummary: z.string(),
  resolvedAt: DateTimeSchema.optional(),
  createdAt: DateTimeSchema,
  referral: z
    .object({
      id: IdSchema,
      status: z.nativeEnum(ReferralStatus),
      provider: z.object({ name: z.string() }),
    })
    .optional(),
});

export const ProviderSchema = z.object({
  id: IdSchema,
  name: z.string(),
  specialties: z.array(z.nativeEnum(Specialty)),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
    radiusMiles: z.number().int().min(1).max(100),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
  }),
  insuranceAccepted: z.array(z.string()),
  screeningStatus: z.nativeEnum(ProviderScreeningStatus),
  availability: z.object({
    nextSlotDays: z.number().int().min(0),
    slots: z.array(
      z.object({
        date: DateSchema,
        times: z.array(z.string()),
      })
    ),
    days: z.array(z.string()).optional(),
    hours: z.object({ start: z.string(), end: z.string() }).optional(),
    virtual: z.boolean().optional(),
    inPerson: z.boolean().optional(),
  }),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string(),
    portalUrl: z.string().url().optional(),
    website: z.string().url().optional(),
    npi: z.string().optional(),
  }),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const MatchedProviderSchema = z.object({
  provider: ProviderSchema,
  score: z.number().int().min(0).max(100),
  reasons: z.array(z.string()),
});

export const ReferralSchema = z.object({
  id: IdSchema,
  escalationId: IdSchema,
  providerId: IdSchema,
  status: z.nativeEnum(ReferralStatus),
  contextSummary: z.string(),
  momConsent: z.boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  provider: z.object({ name: z.string() }).optional(),
});

export const CheckInTrendsSchema = z.object({
  userId: IdSchema,
  periodDays: z.number().int(),
  sleepHours: z.object({
    avg: z.number(),
    trend: z.enum(['improving', 'stable', 'worsening']),
  }),
  mood: z.object({
    avgSadness: z.number(),
    avgAnxiety: z.number(),
    trend: z.enum(['improving', 'stable', 'worsening']),
  }),
  pain: z.object({
    avgLevel: z.number(),
    trend: z.enum(['improving', 'stable', 'worsening']),
  }),
  escalationRisk: z.object({
    consecutiveSleepDisruptionDays: z.number().int(),
    consecutiveSadnessDays: z.number().int(),
    riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  }),
});

export const ClinicianPatientSummarySchema = z.object({
  userId: IdSchema,
  email: z.string(),
  weeksPostpartum: z.number().int(),
  lastCheckInDate: DateSchema.optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  activeEscalationCount: z.number().int().min(0),
  referralCount: z.number().int().min(0),
});

export const ClinicalNoteSchema = z.object({
  id: IdSchema,
  userId: IdSchema,
  clinicianId: IdSchema,
  content: z.string(),
  createdAt: DateTimeSchema,
});

export const ApiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: ApiErrorSchema.optional(),
    meta: z
      .object({
        timestamp: DateTimeSchema,
        requestId: z.string(),
      })
      .optional(),
  });

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1).max(100),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
    }),
    meta: z
      .object({
        timestamp: DateTimeSchema,
        requestId: z.string(),
      })
      .optional(),
  });

export type User = z.infer<typeof UserSchema>;
export type OnboardingInput = z.infer<typeof OnboardingInputSchema>;
export type Onboarding = z.infer<typeof OnboardingSchema>;
export type RecoveryProfile = z.infer<typeof RecoveryProfileSchema>;
export type CheckInInput = z.infer<typeof CheckInInputSchema>;
export type CheckIn = z.infer<typeof CheckInSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type TodaysQuestionsResponse = z.infer<typeof TodaysQuestionsResponseSchema>;
export type Escalation = z.infer<typeof EscalationSchema>;
export type Provider = z.infer<typeof ProviderSchema>;
export type MatchedProvider = z.infer<typeof MatchedProviderSchema>;
export type Referral = z.infer<typeof ReferralSchema>;
export type ClinicianPatientSummary = z.infer<typeof ClinicianPatientSummarySchema>;
export type CheckInTrends = z.infer<typeof CheckInTrendsSchema>;
export type ClinicalNote = z.infer<typeof ClinicalNoteSchema>;

export { Role } from './enums.js';
export { DeliveryType } from './enums.js';
export { FeedingMethod } from './enums.js';
export { BleedingLevel } from './enums.js';
export { EscalationTrigger } from './enums.js';
export { EscalationSeverity } from './enums.js';
export { EscalationStatus } from './enums.js';
export { ReferralStatus } from './enums.js';
export { ProviderScreeningStatus } from './enums.js';
export { Specialty } from './enums.js';
