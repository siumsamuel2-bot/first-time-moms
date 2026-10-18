import { Role } from '@firstweeks/shared';
import type {
  DeliveryType as SharedDeliveryType,
  FeedingMethod as SharedFeedingMethod,
} from '@firstweeks/shared';
import {
  generateReferralContextSummary,
  matchProviders,
} from '@firstweeks/shared/matching/provider-matching.js';
import { normalizeProvider } from '@firstweeks/shared/providers/provider-normalizer.js';
import {
  calculateRiskMetrics,
  evaluateEscalation,
  generateContextSummary,
} from '@firstweeks/shared/rules/escalation.js';
import type { RecoveryProfile } from '@firstweeks/shared/zod-schemas.js';
import {
  BleedingLevel,
  EscalationSeverity,
  EscalationStatus,
  EscalationTrigger,
  type Prisma,
} from '@prisma/client';
import { DeliveryType, FeedingMethod } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authenticate, authorize } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';

function enumToTypeBoxEnum<T extends Record<string, string>>(enumObj: T): T {
  return enumObj;
}

function toSharedDeliveryType(dt: DeliveryType): SharedDeliveryType {
  return dt as SharedDeliveryType;
}

function toSharedFeedingMethod(fm: FeedingMethod): SharedFeedingMethod {
  return fm as SharedFeedingMethod;
}

const CheckInInput = Type.Object({
  date: Type.String({ format: 'date' }),
  sleepHours: Type.Optional(Type.Number({ minimum: 0, maximum: 24 })),
  sleepDisruption: Type.Optional(Type.Integer({ minimum: 1, maximum: 5 })),
  sadness: Type.Optional(Type.Integer({ minimum: 1, maximum: 5 })),
  anxiety: Type.Optional(Type.Integer({ minimum: 1, maximum: 5 })),
  painLevel: Type.Optional(Type.Integer({ minimum: 1, maximum: 10 })),
  bleeding: Type.Optional(Type.Enum(enumToTypeBoxEnum(BleedingLevel))),
  feedingIssues: Type.Optional(Type.Boolean()),
  customResponses: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
});

const CheckInResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    id: Type.String(),
    userId: Type.String(),
    date: Type.String({ format: 'date' }),
    sleepHours: Type.Optional(Type.Union([Type.Number(), Type.Null()])),
    sleepDisruption: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
    sadness: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
    anxiety: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
    painLevel: Type.Optional(Type.Union([Type.Integer(), Type.Null()])),
    bleeding: Type.Optional(Type.Union([Type.Enum(enumToTypeBoxEnum(BleedingLevel)), Type.Null()])),
    feedingIssues: Type.Boolean(),
    customResponses: Type.Union([Type.Record(Type.String(), Type.Unknown()), Type.Null()]),
    createdAt: Type.String({ format: 'date-time' }),
    escalationCreated: Type.Optional(Type.Boolean()),
  }),
});

const CheckInListResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Array(CheckInResponse.properties.data),
  pagination: Type.Object({
    page: Type.Integer({ minimum: 1 }),
    limit: Type.Integer({ minimum: 1, maximum: 100 }),
    total: Type.Integer({ minimum: 0 }),
    totalPages: Type.Integer({ minimum: 0 }),
  }),
});

const TrendsResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    userId: Type.String(),
    periodDays: Type.Integer(),
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
      consecutiveSleepDisruptionDays: Type.Integer(),
      consecutiveSadnessDays: Type.Integer(),
      riskLevel: Type.Union([
        Type.Literal('low'),
        Type.Literal('medium'),
        Type.Literal('high'),
        Type.Literal('critical'),
      ]),
    }),
  }),
});

const EscalationResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    id: Type.String(),
    userId: Type.String(),
    trigger: Type.Enum(enumToTypeBoxEnum(EscalationTrigger)),
    severity: Type.Enum(enumToTypeBoxEnum(EscalationSeverity)),
    status: Type.Enum(enumToTypeBoxEnum(EscalationStatus)),
    assignedTo: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    contextSummary: Type.String(),
    resolvedAt: Type.Optional(Type.Union([Type.String({ format: 'date-time' }), Type.Null()])),
    createdAt: Type.String({ format: 'date-time' }),
  }),
});

type CheckInInputType = {
  date: string;
  sleepHours?: number;
  sleepDisruption?: number;
  sadness?: number;
  anxiety?: number;
  painLevel?: number;
  bleeding?: BleedingLevel;
  feedingIssues?: boolean;
  customResponses?: Prisma.InputJsonValue;
};

type QueryParams = {
  page?: string;
  limit?: string;
  periodDays?: string;
};

type ParamsId = { id: string };

import type { CheckIn } from '@firstweeks/shared/zod-schemas.js';

function toCheckInData(c: {
  id: string;
  userId: string;
  date: Date;
  sleepHours: number | null;
  sleepDisruption: number | null;
  sadness: number | null;
  anxiety: number | null;
  painLevel: number | null;
  bleeding: import('@prisma/client').BleedingLevel | null;
  feedingIssues: boolean;
  customResponses: Prisma.JsonValue;
  createdAt: Date;
}): CheckIn {
  return {
    id: c.id,
    userId: c.userId,
    date: c.date.toISOString().split('T')[0],
    sleepHours: c.sleepHours ?? undefined,
    sleepDisruption: c.sleepDisruption ?? undefined,
    sadness: c.sadness ?? undefined,
    anxiety: c.anxiety ?? undefined,
    painLevel: c.painLevel ?? undefined,
    bleeding: c.bleeding as CheckIn['bleeding'],
    feedingIssues: c.feedingIssues,
    customResponses: c.customResponses as Record<string, unknown>,
    createdAt: c.createdAt.toISOString(),
  };
}

function getMentalHealthBaseline(data: Prisma.JsonValue): { phq2Score: number; gad2Score: number } {
  const baseline = data as Record<string, unknown>;
  return {
    phq2Score: Number(baseline.phq2Score ?? 0),
    gad2Score: Number(baseline.gad2Score ?? 0),
  };
}

function computeProfile(
  escalationUserId: string,
  onboarding: {
    deliveryDate: Date;
    deliveryType: DeliveryType;
    feedingMethod: FeedingMethod;
    mentalHealthBaseline: Prisma.JsonValue;
    complications: string[];
  }
) {
  const deliveryDate = new Date(onboarding.deliveryDate);
  const weeksPostpartum = Math.floor(
    (Date.now() - deliveryDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );
  const baseline = getMentalHealthBaseline(onboarding.mentalHealthBaseline);

  const riskFlags: string[] = [];
  if (baseline.phq2Score >= 3) riskFlags.push('elevated_phq2');
  if (baseline.gad2Score >= 3) riskFlags.push('elevated_gad2');
  if (onboarding.deliveryType === DeliveryType.C_SECTION) riskFlags.push('c_section');
  riskFlags.push(...onboarding.complications);

  return {
    userId: escalationUserId,
    deliveryType: onboarding.deliveryType,
    feedingMethod: onboarding.feedingMethod,
    weeksPostpartum: Math.max(0, weeksPostpartum),
    riskFlags,
    needsMentalHealth: true,
    needsLactation:
      onboarding.feedingMethod === FeedingMethod.BREASTFEEDING ||
      onboarding.feedingMethod === FeedingMethod.COMBO,
    needsPelvicFloor:
      onboarding.deliveryType === DeliveryType.VAGINAL ||
      onboarding.deliveryType === DeliveryType.VBAC,
    insurance: undefined,
    location: undefined,
  };
}

export async function checkinRoutes(app: FastifyInstance) {
  app.post<{ Body: CheckInInputType }>(
    '/check-ins',
    {
      preHandler: [authenticate()],
      schema: { body: CheckInInput, response: { 201: CheckInResponse } },
    },
    async (request: FastifyRequest<{ Body: CheckInInputType }>, reply: FastifyReply) => {
      const user = request.user as { id: string };
      const body = request.body;

      const checkIn = await prisma.checkIn.upsert({
        where: { userId_date: { userId: user.id, date: new Date(body.date) } },
        create: {
          userId: user.id,
          date: new Date(body.date),
          sleepHours: body.sleepHours,
          sleepDisruption: body.sleepDisruption,
          sadness: body.sadness,
          anxiety: body.anxiety,
          painLevel: body.painLevel,
          bleeding: body.bleeding,
          feedingIssues: body.feedingIssues ?? false,
          customResponses: body.customResponses ?? {},
        },
        update: {
          sleepHours: body.sleepHours,
          sleepDisruption: body.sleepDisruption,
          sadness: body.sadness,
          anxiety: body.anxiety,
          painLevel: body.painLevel,
          bleeding: body.bleeding,
          feedingIssues: body.feedingIssues,
          customResponses: body.customResponses,
        },
      });

      const recentCheckIns = await prisma.checkIn.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 30,
      });

      const checkInData = recentCheckIns.map(toCheckInData);
      const escalationDecision = evaluateEscalation(checkInData);

      let escalation = null;
      if (
        escalationDecision.shouldEscalate &&
        escalationDecision.trigger &&
        escalationDecision.severity
      ) {
        const metrics = calculateRiskMetrics(checkInData);

        const contextSummary = generateContextSummary(checkInData, metrics);

        const { trigger, severity } = escalationDecision;
        escalation = await prisma.escalation.create({
          data: {
            userId: user.id,
            trigger,
            severity,
            contextSummary,
          },
        });

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'ESCALATION_CREATED',
            resource: 'escalation',
            resourceId: escalation.id,
            metadata: {
              trigger: escalationDecision.trigger,
              severity: escalationDecision.severity,
            },
          },
        });
      }

      return reply
        .code(201)
        .send({ success: true, data: { ...checkIn, escalationCreated: !!escalation } });
    }
  );

  app.get<{ Querystring: QueryParams }>(
    '/check-ins',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: CheckInListResponse } },
    },
    async (request: FastifyRequest<{ Querystring: QueryParams }>) => {
      const user = request.user as { id: string };
      const page = Number(request.query.page ?? 1);
      const limit = Math.min(Number(request.query.limit ?? 30), 100);

      const [checkIns, total] = await Promise.all([
        prisma.checkIn.findMany({
          where: { userId: user.id },
          orderBy: { date: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.checkIn.count({ where: { userId: user.id } }),
      ]);

      return {
        success: true,
        data: checkIns,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      };
    }
  );

  app.get<{ Querystring: QueryParams }>(
    '/check-ins/trends',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: TrendsResponse } },
    },
    async (request: FastifyRequest<{ Querystring: QueryParams }>) => {
      const user = request.user as { id: string };
      const periodDays = Math.min(Number(request.query.periodDays ?? 30), 90);

      const checkIns = await prisma.checkIn.findMany({
        where: {
          userId: user.id,
          date: { gte: new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000) },
        },
        orderBy: { date: 'asc' },
      });

      const metrics = calculateRiskMetrics(checkIns.map(toCheckInData));

      const sleepData = checkIns
        .filter((c): c is typeof c & { sleepHours: number } => c.sleepHours !== null)
        .map((c) => c.sleepHours);
      const sadnessData = checkIns
        .filter((c): c is typeof c & { sadness: number } => c.sadness !== null)
        .map((c) => c.sadness);
      const anxietyData = checkIns
        .filter((c): c is typeof c & { anxiety: number } => c.anxiety !== null)
        .map((c) => c.anxiety);
      const painData = checkIns
        .filter((c): c is typeof c & { painLevel: number } => c.painLevel !== null)
        .map((c) => c.painLevel);

      const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
      const trend = (arr: number[]) => {
        if (arr.length < 2) return 'stable' as const;
        const firstHalf = arr.slice(0, Math.floor(arr.length / 2));
        const secondHalf = arr.slice(Math.floor(arr.length / 2));
        const firstAvg = avg(firstHalf);
        const secondAvg = avg(secondHalf);
        const diff = secondAvg - firstAvg;
        if (diff > 0.5) return 'worsening' as const;
        if (diff < -0.5) return 'improving' as const;
        return 'stable' as const;
      };

      return {
        success: true,
        data: {
          userId: user.id,
          periodDays,
          sleepHours: { avg: avg(sleepData), trend: trend(sleepData) },
          mood: {
            avgSadness: avg(sadnessData),
            avgAnxiety: avg(anxietyData),
            trend: trend(sadnessData),
          },
          pain: { avgLevel: avg(painData), trend: trend(painData) },
          escalationRisk: {
            consecutiveSleepDisruptionDays: metrics.consecutiveSleepDisruptionDays,
            consecutiveSadnessDays: metrics.consecutiveSadnessDays,
            riskLevel: metrics.riskLevel,
          },
        },
      };
    }
  );

  app.get<{ Params: ParamsId }>(
    '/check-ins/:id',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: CheckInResponse } },
    },
    async (request: FastifyRequest<{ Params: ParamsId }>, reply: FastifyReply) => {
      const user = request.user as { id: string };
      const checkIn = await prisma.checkIn.findUnique({ where: { id: request.params.id } });

      if (!checkIn || checkIn.userId !== user.id) {
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Check-in not found' } });
      }

      return { success: true, data: checkIn };
    }
  );

  app.get(
    '/escalations',
    {
      preHandler: [authenticate()],
      schema: {
        response: {
          200: Type.Object({
            success: Type.Boolean(),
            data: Type.Array(EscalationResponse.properties.data),
          }),
        },
      },
    },
    async (request: FastifyRequest) => {
      const user = request.user as { id: string; role: string };
      const where = user.role === 'MOM' ? { userId: user.id } : {};

      const escalations = await prisma.escalation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { referral: true },
      });

      return { success: true, data: escalations };
    }
  );

  app.get<{ Params: ParamsId }>(
    '/escalations/:id',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: EscalationResponse } },
    },
    async (request: FastifyRequest<{ Params: ParamsId }>, reply: FastifyReply) => {
      const user = request.user as { id: string; role: string };
      const escalation = await prisma.escalation.findUnique({
        where: { id: request.params.id },
      });
      const referral = escalation
        ? await prisma.referral.findUnique({ where: { escalationId: escalation.id } })
        : null;

      if (!escalation || (escalation.userId !== user.id && user.role === Role.MOM)) {
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Escalation not found' } });
      }

      return { success: true, data: { ...escalation, referral } };
    }
  );

  app.post<{ Params: ParamsId }>(
    '/escalations/:id/referral',
    {
      preHandler: [authenticate(), authorize(Role.CLINICIAN, Role.ADMIN)],
      schema: {
        response: {
          201: Type.Object({ success: Type.Boolean(), data: Type.Object({ id: Type.String() }) }),
        },
      },
    },
    async (request: FastifyRequest<{ Params: ParamsId }>, reply: FastifyReply) => {
      const escalation = await prisma.escalation.findUnique({ where: { id: request.params.id } });
      if (!escalation)
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Escalation not found' } });
      const existingReferral = await prisma.referral.findUnique({
        where: { escalationId: escalation.id },
      });
      if (existingReferral)
        return reply.code(409).send({
          success: false,
          error: { code: 'ALREADY_EXISTS', message: 'Referral already exists' },
        });

      const prismaProviders = await prisma.provider.findMany({
        where: { screeningStatus: 'APPROVED' },
      });
      const providers = prismaProviders.map((p) => normalizeProvider(p));
      const onboarding = await prisma.onboarding.findUnique({
        where: { userId: escalation.userId },
      });

      if (!onboarding)
        return reply.code(400).send({
          success: false,
          error: { code: 'ONBOARDING_REQUIRED', message: 'User onboarding not found' },
        });

      const profile = computeProfile(escalation.userId, onboarding);
      const sharedProfile: RecoveryProfile = {
        ...profile,
        deliveryType: toSharedDeliveryType(profile.deliveryType),
        feedingMethod: toSharedFeedingMethod(profile.feedingMethod),
      };
      const metrics = calculateRiskMetrics(
        (
          await prisma.checkIn.findMany({
            where: { userId: escalation.userId },
            orderBy: { date: 'desc' },
            take: 30,
          })
        ).map(toCheckInData)
      );

      const matches = matchProviders(sharedProfile, providers, { maxResults: 3 });
      if (matches.length === 0)
        return reply.code(404).send({
          success: false,
          error: { code: 'NO_PROVIDERS', message: 'No matching providers available' },
        });

      const contextSummary = generateReferralContextSummary(sharedProfile, metrics);
      const referral = await prisma.referral.create({
        data: {
          escalationId: escalation.id,
          providerId: matches[0].provider.id,
          userId: escalation.userId,
          contextSummary,
          momConsent: false,
        },
      });

      await prisma.escalation.update({
        where: { id: escalation.id },
        data: { status: 'REFERRED' },
      });
      await prisma.auditLog.create({
        data: {
          userId: (request.user as { id: string }).id,
          action: 'REFERRAL_CREATED',
          resource: 'referral',
          resourceId: referral.id,
          metadata: { providerId: matches[0].provider.id },
        },
      });

      return reply.code(201).send({ success: true, data: { id: referral.id } });
    }
  );
}
