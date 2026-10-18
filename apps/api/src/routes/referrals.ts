import { ReferralStatus, Role } from '@firstweeks/shared';
import { matchProviders } from '@firstweeks/shared/matching/provider-matching.js';
import { normalizeProvider } from '@firstweeks/shared/providers/provider-normalizer.js';
import type { RecoveryProfile } from '@firstweeks/shared/zod-schemas.js';
import { type Prisma, ProviderScreeningStatus } from '@prisma/client';
import { DeliveryType, FeedingMethod } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authenticate, authorize } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';

function enumToTypeBoxEnum<T extends Record<string, string>>(enumObj: T): T {
  return enumObj;
}

const ProviderSearchResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Array(
    Type.Object({
      provider: Type.Object({
        id: Type.String(),
        name: Type.String(),
        specialties: Type.Array(
          Type.Enum(
            enumToTypeBoxEnum({
              PERINATAL_MH: 'PERINATAL_MH',
              LACTATION: 'LACTATION',
              PELVIC_FLOOR: 'PELVIC_FLOOR',
              OBGYN: 'OBGYN',
              MIDWIFE: 'MIDWIFE',
              DOULA: 'DOULA',
              PSYCHIATRY: 'PSYCHIATRY',
              THERAPY: 'THERAPY',
            })
          )
        ),
        location: Type.Object({
          lat: Type.Number(),
          lng: Type.Number(),
          address: Type.String(),
          radiusMiles: Type.Number(),
          city: Type.Optional(Type.String()),
          state: Type.Optional(Type.String()),
          zipCode: Type.Optional(Type.String()),
        }),
        insuranceAccepted: Type.Array(Type.String()),
        screeningStatus: Type.Enum(enumToTypeBoxEnum(ProviderScreeningStatus)),
        availability: Type.Object({
          nextSlotDays: Type.Integer(),
          slots: Type.Array(
            Type.Object({ date: Type.String({ format: 'date' }), times: Type.Array(Type.String()) })
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
        createdAt: Type.String({ format: 'date-time' }),
        updatedAt: Type.String({ format: 'date-time' }),
      }),
      score: Type.Integer({ minimum: 0, maximum: 100 }),
      reasons: Type.Array(Type.String()),
    })
  ),
});

const ReferralDetailResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    id: Type.String(),
    escalationId: Type.String(),
    providerId: Type.String(),
    provider: Type.Object({ name: Type.String() }),
    status: Type.Enum(enumToTypeBoxEnum(ReferralStatus)),
    contextSummary: Type.String(),
    momConsent: Type.Boolean(),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' }),
  }),
});

const ReferralConsentResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({ id: Type.String(), status: Type.Enum(enumToTypeBoxEnum(ReferralStatus)) }),
});

const ReferralDeclineResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({ id: Type.String(), status: Type.Enum(enumToTypeBoxEnum(ReferralStatus)) }),
});

type ParamsId = { id: string };
type QueryParams = {
  lat?: string;
  lng?: string;
  zipCode?: string;
  specialty?: string;
  insurance?: string;
};

function toSharedDeliveryType(dt: DeliveryType): import('@firstweeks/shared').DeliveryType {
  return dt as import('@firstweeks/shared').DeliveryType;
}

function toSharedFeedingMethod(fm: FeedingMethod): import('@firstweeks/shared').FeedingMethod {
  return fm as import('@firstweeks/shared').FeedingMethod;
}

function getMentalHealthBaseline(data: Prisma.JsonValue): { phq2Score: number; gad2Score: number } {
  const baseline = data as Record<string, unknown>;
  return {
    phq2Score: Number(baseline.phq2Score ?? 0),
    gad2Score: Number(baseline.gad2Score ?? 0),
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
  if (onboarding.deliveryType === DeliveryType.C_SECTION) riskFlags.push('c_section');
  riskFlags.push(...onboarding.complications);

  return {
    userId,
    deliveryType: toSharedDeliveryType(onboarding.deliveryType),
    feedingMethod: toSharedFeedingMethod(onboarding.feedingMethod),
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

export async function referralRoutes(app: FastifyInstance) {
  app.get<{ Querystring: QueryParams }>(
    '/providers/search',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: ProviderSearchResponse } },
    },
    async (request: FastifyRequest<{ Querystring: QueryParams }>) => {
      const user = request.user as { id: string };
      const { lat, lng, zipCode, specialty, insurance } = request.query;

      const onboarding = await prisma.onboarding.findUnique({ where: { userId: user.id } });
      if (!onboarding) {
        return { success: true, data: [] };
      }

      const profile = computeProfile(user.id, onboarding);

      const where: Prisma.ProviderWhereInput = { screeningStatus: 'APPROVED' };
      if (specialty) {
        where.specialties = { has: specialty as import('@firstweeks/shared').Specialty };
      }
      if (insurance) {
        where.insuranceAccepted = { has: insurance };
      }

      const prismaProviders = await prisma.provider.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      const providers = prismaProviders.map((p) => normalizeProvider(p));

      const sharedProfile: RecoveryProfile = {
        ...profile,
        insurance: insurance ?? profile.insurance,
        location:
          lat && lng
            ? { lat: Number(lat), lng: Number(lng), zipCode: zipCode ?? '' }
            : profile.location,
      };

      const matches = matchProviders(sharedProfile, providers, { maxResults: 5, minScore: 30 });

      return { success: true, data: matches };
    }
  );

  app.get<{ Params: ParamsId }>(
    '/referrals/:id',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: ReferralDetailResponse } },
    },
    async (request: FastifyRequest<{ Params: ParamsId }>, reply: FastifyReply) => {
      const user = request.user as { id: string; role: string };
      const referral = await prisma.referral.findUnique({
        where: { id: request.params.id },
        include: { provider: { select: { name: true } } },
      });

      if (!referral || (referral.userId !== user.id && user.role === Role.MOM)) {
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Referral not found' } });
      }

      return { success: true, data: referral };
    }
  );

  app.post<{ Params: ParamsId }>(
    '/referrals/:id/consent',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: ReferralConsentResponse } },
    },
    async (request: FastifyRequest<{ Params: ParamsId }>, reply: FastifyReply) => {
      const user = request.user as { id: string; role: string };
      const referral = await prisma.referral.findUnique({ where: { id: request.params.id } });

      if (!referral || (referral.userId !== user.id && user.role === Role.MOM)) {
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Referral not found' } });
      }

      if (referral.status !== 'PENDING' && referral.status !== 'MOM_CONSENTED') {
        return reply.code(400).send({
          success: false,
          error: {
            code: 'INVALID_STATE',
            message: 'Referral cannot be consented in current state',
          },
        });
      }

      const updated = await prisma.referral.update({
        where: { id: referral.id },
        data: { status: 'MOM_CONSENTED', momConsent: true },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'REFERRAL_CONSENTED',
          resource: 'referral',
          resourceId: referral.id,
        },
      });

      return { success: true, data: { id: updated.id, status: updated.status } };
    }
  );

  app.post<{ Params: ParamsId }>(
    '/referrals/:id/decline',
    {
      preHandler: [authenticate()],
      schema: { response: { 200: ReferralDeclineResponse } },
    },
    async (request: FastifyRequest<{ Params: ParamsId }>, reply: FastifyReply) => {
      const user = request.user as { id: string; role: string };
      const referral = await prisma.referral.findUnique({ where: { id: request.params.id } });

      if (!referral || (referral.userId !== user.id && user.role === Role.MOM)) {
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Referral not found' } });
      }

      if (referral.status !== 'PENDING' && referral.status !== 'MOM_CONSENTED') {
        return reply.code(400).send({
          success: false,
          error: { code: 'INVALID_STATE', message: 'Referral cannot be declined in current state' },
        });
      }

      const updated = await prisma.referral.update({
        where: { id: referral.id },
        data: { status: 'DECLINED', momConsent: false },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'REFERRAL_DECLINED',
          resource: 'referral',
          resourceId: referral.id,
        },
      });

      return { success: true, data: { id: updated.id, status: updated.status } };
    }
  );

  app.get(
    '/referrals',
    {
      preHandler: [authenticate()],
      schema: {
        response: {
          200: Type.Object({
            success: Type.Boolean(),
            data: Type.Array(
              Type.Object({
                id: Type.String(),
                escalationId: Type.String(),
                providerId: Type.String(),
                provider: Type.Optional(Type.Object({ name: Type.String() })),
                status: Type.Enum(enumToTypeBoxEnum(ReferralStatus)),
                contextSummary: Type.String(),
                momConsent: Type.Boolean(),
                createdAt: Type.String({ format: 'date-time' }),
                updatedAt: Type.String({ format: 'date-time' }),
              })
            ),
          }),
        },
      },
    },
    async (request: FastifyRequest) => {
      const user = request.user as { id: string; role: string };
      const where = user.role === Role.MOM ? { userId: user.id } : {};

      const referrals = await prisma.referral.findMany({
        where,
        include: { provider: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      });

      return { success: true, data: referrals };
    }
  );

  // PATCH /referrals/:id - Clinician/Admin update referral status
  const ReferralUpdateBody = Type.Object({ status: Type.Enum(enumToTypeBoxEnum(ReferralStatus)) });
  const ReferralUpdateResponse = Type.Object({ success: Type.Boolean() });

  app.patch<{ Params: ParamsId; Body: { status: ReferralStatus } }>(
    '/referrals/:id',
    {
      preHandler: [authenticate(), authorize(Role.CLINICIAN, Role.ADMIN)],
      schema: { body: ReferralUpdateBody, response: { 200: ReferralUpdateResponse } },
    },
    async (
      request: FastifyRequest<{ Params: ParamsId; Body: { status: ReferralStatus } }>,
      reply: FastifyReply
    ) => {
      const { status } = request.body;
      const referral = await prisma.referral.findUnique({ where: { id: request.params.id } });
      if (!referral)
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Referral not found' } });

      await prisma.referral.update({ where: { id: referral.id }, data: { status } });
      await prisma.auditLog.create({
        data: {
          userId: (request.user as { id: string }).id,
          action: 'REFERRAL_UPDATED',
          resource: 'referral',
          resourceId: referral.id,
          metadata: { status },
        },
      });
      return { success: true };
    }
  );
}
