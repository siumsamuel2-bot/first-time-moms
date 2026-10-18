import { DeliveryType, FeedingMethod } from '@firstweeks/shared';
import { selectQuestions } from '@firstweeks/shared/rules/question-selection.js';
import type { RecoveryProfile } from '@firstweeks/shared/zod-schemas.js';
import type { Prisma } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authenticate } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';

function enumToTypeBoxEnum<T extends Record<string, string>>(enumObj: T): T {
  return enumObj;
}

const OnboardingInput = Type.Object({
  deliveryDate: Type.String({ format: 'date' }),
  deliveryType: Type.Enum(enumToTypeBoxEnum(DeliveryType)),
  feedingMethod: Type.Enum(enumToTypeBoxEnum(FeedingMethod)),
  mentalHealthBaseline: Type.Object({
    phq2Score: Type.Number({ minimum: 0, maximum: 6 }),
    gad2Score: Type.Number({ minimum: 0, maximum: 6 }),
    epdsScore: Type.Optional(Type.Number({ minimum: 0, maximum: 30 })),
  }),
  complications: Type.Array(Type.String()),
});

const OnboardingResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    id: Type.String(),
    userId: Type.String(),
    deliveryDate: Type.String({ format: 'date' }),
    deliveryType: Type.Enum(enumToTypeBoxEnum(DeliveryType)),
    feedingMethod: Type.Enum(enumToTypeBoxEnum(FeedingMethod)),
    mentalHealthBaseline: Type.Object({
      phq2Score: Type.Number(),
      gad2Score: Type.Number(),
      epdsScore: Type.Optional(Type.Number()),
    }),
    complications: Type.Array(Type.String()),
    completedAt: Type.Optional(Type.String({ format: 'date-time' })),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  }),
});

const RecoveryProfileResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    userId: Type.String(),
    deliveryType: Type.Enum(enumToTypeBoxEnum(DeliveryType)),
    feedingMethod: Type.Enum(enumToTypeBoxEnum(FeedingMethod)),
    weeksPostpartum: Type.Number(),
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
  }),
});

const TodaysQuestionsResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    questions: Type.Array(
      Type.Object({
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
      })
    ),
    maxQuestions: Type.Number(),
  }),
});

type OnboardingInputType = {
  deliveryDate: string;
  deliveryType: DeliveryType;
  feedingMethod: FeedingMethod;
  mentalHealthBaseline: {
    phq2Score: number;
    gad2Score: number;
    epdsScore?: number;
  };
  complications: string[];
};

function getMentalHealthBaseline(data: Prisma.JsonValue): {
  phq2Score: number;
  gad2Score: number;
  epdsScore?: number;
} {
  const baseline = data as Record<string, unknown>;
  return {
    phq2Score: Number(baseline.phq2Score ?? 0),
    gad2Score: Number(baseline.gad2Score ?? 0),
    epdsScore: baseline.epdsScore ? Number(baseline.epdsScore) : undefined,
  };
}

function computeProfile(
  userId: string,
  onboarding: {
    deliveryDate: Date;
    deliveryType: DeliveryType;
    feedingMethod: FeedingMethod;
    mentalHealthBaseline: Prisma.JsonValue;
    complications: string[];
  }
): RecoveryProfile {
  const deliveryDate = new Date(onboarding.deliveryDate);
  const weeksPostpartum = Math.floor(
    (Date.now() - deliveryDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
  );

  const baseline = getMentalHealthBaseline(onboarding.mentalHealthBaseline);

  const riskFlags: string[] = [];
  if (baseline.phq2Score >= 3) riskFlags.push('elevated_phq2');
  if (baseline.gad2Score >= 3) riskFlags.push('elevated_gad2');
  if (onboarding.deliveryType === 'C_SECTION') riskFlags.push('c_section');
  riskFlags.push(...onboarding.complications);

  return {
    userId,
    deliveryType: onboarding.deliveryType,
    feedingMethod: onboarding.feedingMethod,
    weeksPostpartum: Math.max(0, weeksPostpartum),
    riskFlags,
    needsMentalHealth: baseline.phq2Score >= 3 || baseline.gad2Score >= 3,
    needsLactation:
      onboarding.feedingMethod === 'BREASTFEEDING' ||
      onboarding.feedingMethod === 'COMBO' ||
      onboarding.feedingMethod === 'PUMPING',
    needsPelvicFloor: onboarding.deliveryType === 'VAGINAL' || onboarding.deliveryType === 'VBAC',
    insurance: undefined,
    location: undefined,
  };
}

export async function onboardingRoutes(app: FastifyInstance) {
  app.post<{ Body: OnboardingInputType }>(
    '/onboarding/quiz',
    {
      preHandler: [authenticate()],
      schema: { body: OnboardingInput, response: { 201: OnboardingResponse } },
    },
    async (request: FastifyRequest<{ Body: OnboardingInputType }>, reply: FastifyReply) => {
      const user = request.user as { id: string };
      const body = request.body;

      const existing = await prisma.onboarding.findUnique({ where: { userId: user.id } });
      if (existing) {
        return reply.code(409).send({
          success: false,
          error: { code: 'ONBOARDING_EXISTS', message: 'Onboarding already completed' },
        });
      }

      const onboarding = await prisma.onboarding.create({
        data: {
          userId: user.id,
          deliveryDate: new Date(body.deliveryDate),
          deliveryType: body.deliveryType,
          feedingMethod: body.feedingMethod,
          mentalHealthBaseline: body.mentalHealthBaseline,
          complications: body.complications,
          completedAt: new Date(),
        },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'ONBOARDING_COMPLETE',
          resource: 'onboarding',
          resourceId: onboarding.id,
        },
      });

      return reply.code(201).send({ success: true, data: onboarding });
    }
  );

  app.get(
    '/onboarding/quiz',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: OnboardingResponse } },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as { id: string };
      const onboarding = await prisma.onboarding.findUnique({ where: { userId: user.id } });

      if (!onboarding) {
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Onboarding not found' } });
      }

      return { success: true, data: onboarding };
    }
  );

  app.get(
    '/onboarding/profile',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: RecoveryProfileResponse } },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as { id: string };
      const onboarding = await prisma.onboarding.findUnique({ where: { userId: user.id } });

      if (!onboarding) {
        return reply.code(404).send({
          success: false,
          error: { code: 'NOT_FOUND', message: 'Complete onboarding first' },
        });
      }

      const profile = computeProfile(user.id, {
        ...onboarding,
        deliveryType: onboarding.deliveryType as DeliveryType,
        feedingMethod: onboarding.feedingMethod as FeedingMethod,
      });
      return { success: true, data: profile };
    }
  );

  app.get(
    '/questions/today',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: TodaysQuestionsResponse } },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = request.user as { id: string };
      const onboarding = await prisma.onboarding.findUnique({ where: { userId: user.id } });

      if (!onboarding) {
        return reply.code(400).send({
          success: false,
          error: { code: 'ONBOARDING_REQUIRED', message: 'Complete onboarding first' },
        });
      }

      const checkIns = await prisma.checkIn.findMany({
        where: { userId: user.id },
        orderBy: { date: 'desc' },
        take: 30,
      });

      const profile = computeProfile(user.id, {
        ...onboarding,
        deliveryType: onboarding.deliveryType as DeliveryType,
        feedingMethod: onboarding.feedingMethod as FeedingMethod,
      });

      const questions = selectQuestions(
        profile,
        checkIns.map((c) => ({
          id: c.id,
          userId: c.userId,
          date: c.date.toISOString().split('T')[0],
          sleepHours: c.sleepHours ?? undefined,
          sleepDisruption: c.sleepDisruption ?? undefined,
          sadness: c.sadness ?? undefined,
          anxiety: c.anxiety ?? undefined,
          painLevel: c.painLevel ?? undefined,
          bleeding: c.bleeding as import('@firstweeks/shared').BleedingLevel | undefined,
          feedingIssues: c.feedingIssues,
          customResponses: c.customResponses as Record<string, unknown>,
          createdAt: c.createdAt.toISOString(),
        }))
      );

      return { success: true, data: { questions, maxQuestions: questions.length } };
    }
  );
}
