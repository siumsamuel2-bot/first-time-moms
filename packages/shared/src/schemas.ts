import { type TSchema, Type } from '@sinclair/typebox';
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

export const IdSchema = Type.String({ format: 'cuid', minLength: 25, maxLength: 25 });
export const DateTimeSchema = Type.String({ format: 'date-time' });
export const DateSchema = Type.String({ format: 'date' });

export const UserSchema = Type.Object({
  id: IdSchema,
  email: Type.String({ format: 'email' }),
  role: Type.Enum(Role),
  emailVerified: Type.Boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const OnboardingSchema = Type.Object({
  id: IdSchema,
  userId: IdSchema,
  deliveryDate: DateSchema,
  deliveryType: Type.Enum(DeliveryType),
  feedingMethod: Type.Enum(FeedingMethod),
  mentalHealthBaseline: Type.Object({
    phq2Score: Type.Number({ minimum: 0, maximum: 6 }),
    gad2Score: Type.Number({ minimum: 0, maximum: 6 }),
    epdsScore: Type.Optional(Type.Number({ minimum: 0, maximum: 30 })),
  }),
  complications: Type.Array(Type.String()),
  completedAt: Type.Optional(DateTimeSchema),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const RecoveryProfileSchema = Type.Object({
  userId: IdSchema,
  deliveryType: Type.Enum(DeliveryType),
  feedingMethod: Type.Enum(FeedingMethod),
  weeksPostpartum: Type.Number({ minimum: 0, maximum: 52 }),
  riskFlags: Type.Array(Type.String()),
  needsMentalHealth: Type.Boolean(),
  needsLactation: Type.Boolean(),
  needsPelvicFloor: Type.Boolean(),
  insurance: Type.Optional(Type.String()),
  location: Type.Optional(
    Type.Object({
      lat: Type.Number(),
      lng: Type.Number(),
      zipCode: Type.String(),
    })
  ),
});

export const CheckInSchema = Type.Object({
  id: IdSchema,
  userId: IdSchema,
  date: DateSchema,
  sleepHours: Type.Optional(Type.Number({ minimum: 0, maximum: 24 })),
  sleepDisruption: Type.Optional(Type.Integer({ minimum: 1, maximum: 5 })),
  sadness: Type.Optional(Type.Integer({ minimum: 1, maximum: 5 })),
  anxiety: Type.Optional(Type.Integer({ minimum: 1, maximum: 5 })),
  painLevel: Type.Optional(Type.Integer({ minimum: 1, maximum: 10 })),
  bleeding: Type.Optional(Type.Enum(BleedingLevel)),
  feedingIssues: Type.Boolean(),
  customResponses: Type.Record(Type.String(), Type.Unknown()),
  createdAt: DateTimeSchema,
});

export const CheckInTrendsSchema = Type.Object({
  userId: IdSchema,
  periodDays: Type.Integer({ minimum: 1, maximum: 90 }),
  sleepHours: Type.Object({
    avg: Type.Number(),
    trend: Type.Union([
      Type.Literal('improving'),
      Type.Literal('stable'),
      Type.Literal('worsening'),
    ]),
  }),
  mood: Type.Object({
    avgSadness: Type.Number(),
    avgAnxiety: Type.Number(),
    trend: Type.Union([
      Type.Literal('improving'),
      Type.Literal('stable'),
      Type.Literal('worsening'),
    ]),
  }),
  pain: Type.Object({
    avgLevel: Type.Number(),
    trend: Type.Union([
      Type.Literal('improving'),
      Type.Literal('stable'),
      Type.Literal('worsening'),
    ]),
  }),
  escalationRisk: Type.Object({
    consecutiveSleepDisruptionDays: Type.Integer({ minimum: 0 }),
    consecutiveSadnessDays: Type.Integer({ minimum: 0 }),
    riskLevel: Type.Union([
      Type.Literal('low'),
      Type.Literal('medium'),
      Type.Literal('high'),
      Type.Literal('critical'),
    ]),
  }),
});

export const QuestionSchema = Type.Object({
  id: Type.String(),
  text: Type.String(),
  type: Type.Union([
    Type.Literal('scale'),
    Type.Literal('boolean'),
    Type.Literal('multiple_choice'),
    Type.Literal('text'),
  ]),
  options: Type.Optional(Type.Array(Type.String())),
  required: Type.Boolean(),
  category: Type.String(),
  weight: Type.Optional(Type.Number()),
});

export const TodaysQuestionsResponseSchema = Type.Object({
  questions: Type.Array(QuestionSchema),
  maxQuestions: Type.Integer({ minimum: 1, maximum: 10 }),
});

export const EscalationSchema = Type.Object({
  id: IdSchema,
  userId: IdSchema,
  userEmail: Type.Optional(Type.String()),
  trigger: Type.Enum(EscalationTrigger),
  severity: Type.Enum(EscalationSeverity),
  status: Type.Enum(EscalationStatus),
  assignedTo: Type.Optional(IdSchema),
  contextSummary: Type.String(),
  resolvedAt: Type.Optional(DateTimeSchema),
  createdAt: DateTimeSchema,
  referral: Type.Optional(
    Type.Object({
      id: IdSchema,
      status: Type.Enum(ReferralStatus),
      provider: Type.Object({ name: Type.String() }),
    })
  ),
});

export const ProviderSchema = Type.Object({
  id: IdSchema,
  name: Type.String(),
  specialties: Type.Array(Type.Enum(Specialty)),
  location: Type.Object({
    lat: Type.Number(),
    lng: Type.Number(),
    address: Type.String(),
    radiusMiles: Type.Number({ minimum: 1, maximum: 100 }),
    city: Type.Optional(Type.String()),
    state: Type.Optional(Type.String()),
    zipCode: Type.Optional(Type.String()),
  }),
  insuranceAccepted: Type.Array(Type.String()),
  screeningStatus: Type.Enum(ProviderScreeningStatus),
  availability: Type.Object({
    nextSlotDays: Type.Integer({ minimum: 0 }),
    slots: Type.Array(
      Type.Object({
        date: DateSchema,
        times: Type.Array(Type.String()),
      })
    ),
    days: Type.Optional(Type.Array(Type.String())),
    hours: Type.Optional(Type.Object({ start: Type.String(), end: Type.String() })),
    virtual: Type.Optional(Type.Boolean()),
    inPerson: Type.Optional(Type.Boolean()),
  }),
  contactInfo: Type.Object({
    phone: Type.String(),
    email: Type.String(),
    portalUrl: Type.Optional(Type.String({ format: 'uri' })),
    website: Type.Optional(Type.String({ format: 'uri' })),
    npi: Type.Optional(Type.String()),
  }),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
});

export const MatchedProviderSchema = Type.Object({
  provider: ProviderSchema,
  score: Type.Integer({ minimum: 0, maximum: 100 }),
  reasons: Type.Array(Type.String()),
});

export const ReferralSchema = Type.Object({
  id: IdSchema,
  escalationId: IdSchema,
  providerId: IdSchema,
  status: Type.Enum(ReferralStatus),
  contextSummary: Type.String(),
  momConsent: Type.Boolean(),
  createdAt: DateTimeSchema,
  updatedAt: DateTimeSchema,
  provider: Type.Optional(Type.Object({ name: Type.String() })),
});

export const ClinicianPatientSummarySchema = Type.Object({
  userId: IdSchema,
  email: Type.String(),
  weeksPostpartum: Type.Number(),
  lastCheckInDate: Type.Optional(DateSchema),
  riskLevel: Type.Union([
    Type.Literal('low'),
    Type.Literal('medium'),
    Type.Literal('high'),
    Type.Literal('critical'),
  ]),
  activeEscalationCount: Type.Integer({ minimum: 0 }),
  referralCount: Type.Integer({ minimum: 0 }),
});

export const ClinicalNoteSchema = Type.Object({
  id: IdSchema,
  userId: IdSchema,
  clinicianId: IdSchema,
  content: Type.String(),
  createdAt: DateTimeSchema,
});

export const ApiResponseSchema = <T extends TSchema>(dataSchema: T) =>
  Type.Object({
    success: Type.Boolean(),
    data: Type.Optional(dataSchema),
    error: Type.Optional(
      Type.Object({
        code: Type.String(),
        message: Type.String(),
        details: Type.Optional(Type.Unknown()),
      })
    ),
    meta: Type.Optional(
      Type.Object({
        timestamp: DateTimeSchema,
        requestId: Type.String(),
      })
    ),
  });

export const PaginatedResponseSchema = <T extends TSchema>(itemSchema: T) =>
  Type.Object({
    success: Type.Boolean(),
    data: Type.Array(itemSchema),
    pagination: Type.Object({
      page: Type.Integer({ minimum: 1 }),
      limit: Type.Integer({ minimum: 1, maximum: 100 }),
      total: Type.Integer({ minimum: 0 }),
      totalPages: Type.Integer({ minimum: 0 }),
    }),
    meta: Type.Optional(
      Type.Object({
        timestamp: DateTimeSchema,
        requestId: Type.String(),
      })
    ),
  });
