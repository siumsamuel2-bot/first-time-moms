import {
  type EscalationStatus,
  ProviderScreeningStatus,
  Role,
  Specialty,
} from '@firstweeks/shared';
import { normalizeProvider } from '@firstweeks/shared/providers/provider-normalizer.js';
import type { Prisma } from '@prisma/client';
import { Type } from '@sinclair/typebox';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { authenticate, authorize } from '../middleware/auth.js';
import { prisma } from '../utils/prisma.js';

function enumToTypeBoxEnum<T extends Record<string, string>>(enumObj: T): T {
  return enumObj;
}

const PatientSummaryResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Array(
    Type.Object({
      userId: Type.String(),
      email: Type.String(),
      weeksPostpartum: Type.Number(),
      lastCheckInDate: Type.Optional(Type.String({ format: 'date' })),
      riskLevel: Type.Union([
        Type.Literal('low'),
        Type.Literal('medium'),
        Type.Literal('high'),
        Type.Literal('critical'),
      ]),
      activeEscalationCount: Type.Integer({ minimum: 0 }),
      referralCount: Type.Integer({ minimum: 0 }),
    })
  ),
});

const PatientDetailResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Object({
    user: Type.Object({
      id: Type.String(),
      email: Type.String(),
      role: Type.String(),
      createdAt: Type.String({ format: 'date-time' }),
    }),
    onboarding: Type.Optional(
      Type.Object({
        deliveryDate: Type.String({ format: 'date' }),
        deliveryType: Type.String(),
        feedingMethod: Type.String(),
        mentalHealthBaseline: Type.Object({ phq2Score: Type.Number(), gad2Score: Type.Number() }),
        complications: Type.Array(Type.String()),
        completedAt: Type.String({ format: 'date-time' }),
      })
    ),
    recentCheckIns: Type.Array(
      Type.Object({
        date: Type.String({ format: 'date' }),
        sleepDisruption: Type.Optional(Type.Integer()),
        sadness: Type.Optional(Type.Integer()),
        anxiety: Type.Optional(Type.Integer()),
        painLevel: Type.Optional(Type.Integer()),
        bleeding: Type.Optional(Type.String()),
      })
    ),
    escalations: Type.Array(
      Type.Object({
        id: Type.String(),
        trigger: Type.String(),
        severity: Type.String(),
        status: Type.String(),
        contextSummary: Type.String(),
        createdAt: Type.String({ format: 'date-time' }),
        referral: Type.Optional(
          Type.Object({ id: Type.String(), status: Type.String(), providerName: Type.String() })
        ),
      })
    ),
    referrals: Type.Array(
      Type.Object({
        id: Type.String(),
        status: Type.String(),
        providerName: Type.String(),
        createdAt: Type.String({ format: 'date-time' }),
      })
    ),
    clinicalNotes: Type.Array(
      Type.Object({
        id: Type.String(),
        content: Type.String(),
        clinicianId: Type.String(),
        createdAt: Type.String({ format: 'date-time' }),
      })
    ),
  }),
});

const ClinicalNoteInput = Type.Object({ content: Type.String({ minLength: 1, maxLength: 5000 }) });

const EscalationListResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Array(
    Type.Object({
      id: Type.String(),
      userId: Type.String(),
      userEmail: Type.String(),
      trigger: Type.String(),
      severity: Type.String(),
      status: Type.String(),
      contextSummary: Type.String(),
      createdAt: Type.String({ format: 'date-time' }),
    })
  ),
});

const ProviderListResponse = Type.Object({
  success: Type.Boolean(),
  data: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
      specialties: Type.Array(Type.Enum(enumToTypeBoxEnum(Specialty))),
      location: Type.Object({
        address: Type.Optional(Type.String()),
        city: Type.Optional(Type.String()),
        state: Type.Optional(Type.String()),
        zipCode: Type.Optional(Type.String()),
        latitude: Type.Optional(Type.Number()),
        longitude: Type.Optional(Type.Number()),
        lat: Type.Optional(Type.Number()),
        lng: Type.Optional(Type.Number()),
        radiusMiles: Type.Optional(Type.Number()),
      }),
      insuranceAccepted: Type.Array(Type.String()),
      screeningStatus: Type.Enum(enumToTypeBoxEnum(ProviderScreeningStatus)),
      availability: Type.Object({
        nextSlotDays: Type.Optional(Type.Integer()),
        days: Type.Optional(Type.Array(Type.String())),
        hours: Type.Optional(Type.Object({ start: Type.String(), end: Type.String() })),
        virtual: Type.Optional(Type.Boolean()),
        inPerson: Type.Optional(Type.Boolean()),
        slots: Type.Optional(
          Type.Array(Type.Object({ date: Type.String(), times: Type.Array(Type.String()) }))
        ),
      }),
      contactInfo: Type.Optional(
        Type.Object({
          phone: Type.String(),
          email: Type.String(),
          portalUrl: Type.Optional(Type.String()),
          website: Type.Optional(Type.String()),
          npi: Type.Optional(Type.String()),
        })
      ),
      createdAt: Type.String({ format: 'date-time' }),
    })
  ),
});

const ProviderInput = Type.Object({
  name: Type.String({ minLength: 1, maxLength: 200 }),
  specialties: Type.Array(Type.Enum(enumToTypeBoxEnum(Specialty))),
  location: Type.Object({
    lat: Type.Number(),
    lng: Type.Number(),
    address: Type.String(),
    radiusMiles: Type.Number({ minimum: 1, maximum: 100 }),
  }),
  insuranceAccepted: Type.Array(Type.String()),
  contactInfo: Type.Object({
    phone: Type.String(),
    email: Type.String(),
    portalUrl: Type.Optional(Type.String({ format: 'uri' })),
  }),
  availability: Type.Object({
    nextSlotDays: Type.Integer({ minimum: 0 }),
    slots: Type.Array(
      Type.Object({ date: Type.String({ format: 'date' }), times: Type.Array(Type.String()) })
    ),
  }),
});

type ParamsId = { id: string };
type ClinicalNoteBody = { content: string };
type EscalationUpdateBody = { status?: EscalationStatus; assignedTo?: string };
type ProviderCreateBody = {
  name: string;
  specialties: Specialty[];
  location: { lat: number; lng: number; address: string; radiusMiles: number };
  insuranceAccepted: string[];
  contactInfo: { phone: string; email: string; portalUrl?: string };
  availability: { nextSlotDays: number; slots: Array<{ date: string; times: string[] }> };
};
type ProviderUpdateBody = Partial<ProviderCreateBody>;

function getMentalHealthBaseline(data: Prisma.JsonValue): { phq2Score: number; gad2Score: number } {
  const baseline = data as Record<string, unknown>;
  return {
    phq2Score: Number(baseline.phq2Score ?? 0),
    gad2Score: Number(baseline.gad2Score ?? 0),
  };
}

export async function clinicianRoutes(app: FastifyInstance) {
  app.get(
    '/clinician/patients',
    {
      preHandler: [authenticate(), authorize(Role.CLINICIAN, Role.ADMIN)],
      schema: { response: { 200: PatientSummaryResponse } },
    },
    async (_request: FastifyRequest) => {
      const users = await prisma.user.findMany({
        where: { role: Role.MOM },
        include: {
          onboarding: true,
          checkIns: { orderBy: { date: 'desc' }, take: 1 },
          escalations: { where: { status: { in: ['PENDING', 'TRIAGED', 'REFERRED'] } } },
          referrals: true,
        },
      });

      const summaries = users.map((user) => {
        const onboarding = user.onboarding;
        const latestCheckIn = user.checkIns[0];
        let weeksPostpartum = 0;
        if (onboarding) {
          const deliveryDate = new Date(onboarding.deliveryDate);
          weeksPostpartum = Math.floor(
            (Date.now() - deliveryDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
          );
        }

        let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
        if (user.escalations.some((e) => e.severity === 'CRITICAL')) riskLevel = 'critical';
        else if (user.escalations.some((e) => e.severity === 'HIGH')) riskLevel = 'high';
        else if (user.escalations.some((e) => e.severity === 'MEDIUM')) riskLevel = 'medium';

        return {
          userId: user.id,
          email: user.email,
          weeksPostpartum: Math.max(0, weeksPostpartum),
          lastCheckInDate: latestCheckIn?.date.toISOString().split('T')[0],
          riskLevel,
          activeEscalationCount: user.escalations.length,
          referralCount: user.referrals.length,
        };
      });

      return {
        success: true,
        data: summaries.sort((a, b) => {
          const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return (
            riskOrder[b.riskLevel] - riskOrder[a.riskLevel] ||
            b.activeEscalationCount - a.activeEscalationCount
          );
        }),
      };
    }
  );

  app.get(
    '/clinician/escalations',
    {
      preHandler: [authenticate(), authorize(Role.CLINICIAN, Role.ADMIN)],
      schema: { response: { 200: EscalationListResponse } },
    },
    async (_request: FastifyRequest) => {
      const escalations = await prisma.escalation.findMany({
        where: { status: { in: ['PENDING', 'TRIAGED'] } },
        include: { user: { select: { email: true } } },
        orderBy: [{ severity: 'desc' }, { createdAt: 'asc' }],
      });

      return {
        success: true,
        data: escalations.map((e) => ({
          id: e.id,
          userId: e.userId,
          userEmail: e.user.email,
          trigger: e.trigger,
          severity: e.severity,
          status: e.status,
          contextSummary: e.contextSummary,
          createdAt: e.createdAt.toISOString(),
        })),
      };
    }
  );

  app.get<{ Params: ParamsId }>(
    '/clinician/patients/:id',
    {
      preHandler: [authenticate(), authorize(Role.CLINICIAN, Role.ADMIN)],
      schema: { response: { 200: PatientDetailResponse } },
    },
    async (request: FastifyRequest<{ Params: ParamsId }>, reply: FastifyReply) => {
      const user = await prisma.user.findUnique({
        where: { id: request.params.id },
        include: {
          onboarding: true,
          checkIns: { orderBy: { date: 'desc' }, take: 30 },
          escalations: {
            include: { referral: { include: { provider: { select: { name: true } } } } },
            orderBy: { createdAt: 'desc' },
          },
          referrals: {
            include: { provider: { select: { name: true } } },
            orderBy: { createdAt: 'desc' },
          },
          clinicianNotes: { orderBy: { createdAt: 'desc' } },
        },
      });

      if (!user)
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Patient not found' } });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
          },
          onboarding: user.onboarding
            ? {
                deliveryDate: user.onboarding.deliveryDate.toISOString().split('T')[0],
                deliveryType: user.onboarding.deliveryType,
                feedingMethod: user.onboarding.feedingMethod,
                mentalHealthBaseline: getMentalHealthBaseline(user.onboarding.mentalHealthBaseline),
                complications: user.onboarding.complications,
                completedAt: user.onboarding.completedAt?.toISOString() ?? '',
              }
            : undefined,
          recentCheckIns: user.checkIns.map((c) => ({
            date: c.date.toISOString().split('T')[0],
            sleepDisruption: c.sleepDisruption ?? undefined,
            sadness: c.sadness ?? undefined,
            anxiety: c.anxiety ?? undefined,
            painLevel: c.painLevel ?? undefined,
            bleeding: c.bleeding ?? undefined,
          })),
          escalations: user.escalations.map((e) => ({
            id: e.id,
            trigger: e.trigger,
            severity: e.severity,
            status: e.status,
            contextSummary: e.contextSummary,
            createdAt: e.createdAt.toISOString(),
            referral: e.referral
              ? {
                  id: e.referral.id,
                  status: e.referral.status,
                  providerName: e.referral.provider.name,
                }
              : undefined,
          })),
          referrals: user.referrals.map((r) => ({
            id: r.id,
            status: r.status,
            providerName: r.provider.name,
            createdAt: r.createdAt.toISOString(),
          })),
          clinicalNotes: user.clinicianNotes.map((n) => ({
            id: n.id,
            content: n.content,
            clinicianId: n.clinicianId,
            createdAt: n.createdAt.toISOString(),
          })),
        },
      };
    }
  );

  app.post<{ Params: ParamsId; Body: ClinicalNoteBody }>(
    '/clinician/patients/:id/notes',
    {
      preHandler: [authenticate(), authorize(Role.CLINICIAN, Role.ADMIN)],
      schema: {
        body: ClinicalNoteInput,
        response: {
          201: Type.Object({ success: Type.Boolean(), data: Type.Object({ id: Type.String() }) }),
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: ParamsId; Body: ClinicalNoteBody }>,
      reply: FastifyReply
    ) => {
      const clinician = request.user as { id: string };
      const note = await prisma.clinicalNote.create({
        data: {
          userId: request.params.id,
          clinicianId: clinician.id,
          content: request.body.content,
        },
      });
      await prisma.auditLog.create({
        data: {
          userId: clinician.id,
          action: 'CLINICAL_NOTE_CREATED',
          resource: 'clinical_note',
          resourceId: note.id,
          metadata: { patientId: request.params.id },
        },
      });
      return reply.code(201).send({ success: true, data: { id: note.id } });
    }
  );

  const EscalationUpdateResponse = Type.Object({ success: Type.Boolean() });

  app.patch<{ Params: ParamsId; Body: EscalationUpdateBody }>(
    '/clinician/escalations/:id',
    {
      preHandler: [authenticate(), authorize(Role.CLINICIAN, Role.ADMIN)],
      schema: { response: { 200: EscalationUpdateResponse } },
    },
    async (
      request: FastifyRequest<{ Params: ParamsId; Body: EscalationUpdateBody }>,
      reply: FastifyReply
    ) => {
      const { status, assignedTo } = request.body;
      const escalation = await prisma.escalation.findUnique({ where: { id: request.params.id } });
      if (!escalation)
        return reply
          .code(404)
          .send({ success: false, error: { code: 'NOT_FOUND', message: 'Escalation not found' } });

      const data: Partial<{ status: EscalationStatus; assignedTo: string | null }> = {};
      if (status) data.status = status;
      if (assignedTo !== undefined) data.assignedTo = assignedTo;

      await prisma.escalation.update({ where: { id: escalation.id }, data });
      await prisma.auditLog.create({
        data: {
          userId: (request.user as { id: string }).id,
          action: 'ESCALATION_UPDATED',
          resource: 'escalation',
          resourceId: escalation.id,
          metadata: data,
        },
      });
      return { success: true };
    }
  );

  app.get(
    '/providers',
    {
      preHandler: [authenticate(), authorize(Role.CLINICIAN, Role.ADMIN)],
      schema: { response: { 200: ProviderListResponse } },
    },
    async (_request: FastifyRequest) => {
      const providers = await prisma.provider.findMany({ orderBy: { createdAt: 'desc' } });
      return { success: true, data: providers.map((p) => normalizeProvider(p)) };
    }
  );

  app.post<{ Body: ProviderCreateBody }>(
    '/providers',
    {
      preHandler: [authenticate(), authorize(Role.ADMIN)],
      schema: {
        body: ProviderInput,
        response: {
          201: Type.Object({ success: Type.Boolean(), data: Type.Object({ id: Type.String() }) }),
        },
      },
    },
    async (request: FastifyRequest<{ Body: ProviderCreateBody }>, reply: FastifyReply) => {
      const provider = await prisma.provider.create({ data: request.body });
      await prisma.auditLog.create({
        data: {
          userId: (request.user as { id: string }).id,
          action: 'PROVIDER_CREATED',
          resource: 'provider',
          resourceId: provider.id,
        },
      });
      return reply.code(201).send({ success: true, data: { id: provider.id } });
    }
  );

  const ProviderUpdateResponse = Type.Object({ success: Type.Boolean() });

  app.patch<{ Params: ParamsId; Body: ProviderUpdateBody }>(
    '/providers/:id',
    {
      preHandler: [authenticate(), authorize(Role.ADMIN)],
      schema: { response: { 200: ProviderUpdateResponse } },
    },
    async (
      request: FastifyRequest<{ Params: ParamsId; Body: ProviderUpdateBody }>,
      _reply: FastifyReply
    ) => {
      await prisma.provider.update({ where: { id: request.params.id }, data: request.body });
      await prisma.auditLog.create({
        data: {
          userId: (request.user as { id: string }).id,
          action: 'PROVIDER_UPDATED',
          resource: 'provider',
          resourceId: request.params.id,
        },
      });
      return { success: true };
    }
  );
}
