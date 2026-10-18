import * as crypto from 'node:crypto';
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { PrismaClient } from '@prisma/client';

let cachedPrisma: PrismaClient | null = null;
let cachedS3Client: S3Client | null = null;
let cachedSecretsClient: SecretsManagerClient | null = null;
let cachedConfig: {
  ANALYTICS_BUCKET: string;
  ANALYTICS_SALT: string;
  AWS_REGION: string;
  DATABASE_URL: string;
} | null = null;

async function getConfig(): Promise<{
  ANALYTICS_BUCKET: string;
  ANALYTICS_SALT: string;
  AWS_REGION: string;
  DATABASE_URL: string;
}> {
  if (cachedConfig) return cachedConfig;

  const region = process.env.AWS_REGION ?? 'us-east-1';
  const analyticsBucket = process.env.ANALYTICS_BUCKET ?? 'firstweeks-analytics';
  const analyticsSalt =
    process.env.ANALYTICS_SALT ?? 'firstweeks-analytics-salt-change-in-production';

  let databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    const secretsClient = await getSecretsClient();
    const secretName =
      process.env.DATABASE_URL_SECRET ?? `${process.env.NODE_ENV ?? 'production'}/database-url`;
    const response = await secretsClient.send(new GetSecretValueCommand({ SecretId: secretName }));
    databaseUrl = response.SecretString ?? '';
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in environment or Secrets Manager');
  }

  cachedConfig = {
    ANALYTICS_BUCKET: analyticsBucket,
    ANALYTICS_SALT: analyticsSalt,
    AWS_REGION: region,
    DATABASE_URL: databaseUrl,
  };
  return cachedConfig;
}

async function getPrismaClient(): Promise<PrismaClient> {
  if (!cachedPrisma) {
    const config = await getConfig();
    cachedPrisma = new PrismaClient({
      datasources: {
        db: {
          url: config.DATABASE_URL,
        },
      },
    });
  }
  return cachedPrisma;
}

async function getS3Client(): Promise<S3Client> {
  if (!cachedS3Client) {
    const config = await getConfig();
    cachedS3Client = new S3Client({ region: config.AWS_REGION });
  }
  return cachedS3Client;
}

async function getSecretsClient(): Promise<SecretsManagerClient> {
  if (!cachedSecretsClient) {
    const config = await getConfig();
    cachedSecretsClient = new SecretsManagerClient({ region: config.AWS_REGION });
  }
  return cachedSecretsClient;
}

export async function cleanup(): Promise<void> {
  if (cachedPrisma) {
    await cachedPrisma.$disconnect();
    cachedPrisma = null;
  }
}

export interface DeidentifiedUser {
  userIdHash: string;
  weeksPostpartum: number;
  deliveryType: string;
  feedingMethod: string;
  mentalHealthBaseline: {
    phq2Score: number;
    gad2Score: number;
    epdsScore?: number;
  };
  riskFlags: string[];
  createdAt: string;
}

export interface DeidentifiedCheckIn {
  userIdHash: string;
  checkInIdHash: string;
  weekPostpartum: number;
  sleepHours?: number;
  sleepDisruption?: number;
  sadness?: number;
  anxiety?: number;
  painLevel?: number;
  bleeding?: string;
  feedingIssues: boolean;
  createdAt: string;
}

export interface DeidentifiedEscalation {
  userIdHash: string;
  escalationIdHash: string;
  trigger: string;
  severity: string;
  weekPostpartum: number;
  resolved: boolean;
  createdAt: string;
}

export interface DeidentifiedReferral {
  userIdHash: string;
  referralIdHash: string;
  providerSpecialty: string[];
  status: string;
  weekPostpartum: number;
  createdAt: string;
}

export function hashId(id: string, salt: string): string {
  return crypto.createHash('sha256').update(`${salt}:${id}`).digest('hex').substring(0, 16);
}

export function generalizeDateToMonth(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function generalizeDateToWeek(date: Date): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  const week = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function calculateWeeksPostpartum(
  deliveryDate: Date,
  referenceDate: Date = new Date()
): number {
  const diffMs = referenceDate.getTime() - deliveryDate.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
}

export async function exportDeidentifiedData(salt?: string): Promise<{
  users: DeidentifiedUser[];
  checkIns: DeidentifiedCheckIn[];
  escalations: DeidentifiedEscalation[];
  referrals: DeidentifiedReferral[];
}> {
  const config = await getConfig();
  const prisma = await getPrismaClient();
  const effectiveSalt = salt ?? config.ANALYTICS_SALT;

  const users = await prisma.user.findMany({
    where: { role: 'MOM', onboarding: { isNot: null } },
    include: {
      onboarding: true,
      checkIns: { orderBy: { date: 'asc' } },
      escalations: { include: { referral: true } },
      referrals: { include: { provider: true } },
    },
  });

  const deidentifiedUsers: DeidentifiedUser[] = [];
  const deidentifiedCheckIns: DeidentifiedCheckIn[] = [];
  const deidentifiedEscalations: DeidentifiedEscalation[] = [];
  const deidentifiedReferrals: DeidentifiedReferral[] = [];

  for (const user of users) {
    if (!user.onboarding) continue;

    const userIdHash = hashId(user.id, effectiveSalt);
    const deliveryDate = new Date(user.onboarding.deliveryDate);
    const weeksPostpartum = calculateWeeksPostpartum(deliveryDate);
    const mentalHealth = user.onboarding.mentalHealthBaseline as {
      phq2Score: number;
      gad2Score: number;
      epdsScore?: number;
    };

    const riskFlags: string[] = [];
    if (mentalHealth.phq2Score >= 3) riskFlags.push('phq2_elevated');
    if (mentalHealth.gad2Score >= 3) riskFlags.push('gad2_elevated');
    if (mentalHealth.epdsScore && mentalHealth.epdsScore >= 10) riskFlags.push('epds_elevated');
    if (user.onboarding.complications.length > 0) riskFlags.push('delivery_complications');

    deidentifiedUsers.push({
      userIdHash,
      weeksPostpartum,
      deliveryType: user.onboarding.deliveryType,
      feedingMethod: user.onboarding.feedingMethod,
      mentalHealthBaseline: {
        phq2Score: mentalHealth.phq2Score,
        gad2Score: mentalHealth.gad2Score,
        epdsScore: mentalHealth.epdsScore,
      },
      riskFlags,
      createdAt: generalizeDateToMonth(user.createdAt),
    });

    for (const checkIn of user.checkIns) {
      const checkInDate = new Date(checkIn.date);
      const weekPostpartum = calculateWeeksPostpartum(deliveryDate, checkInDate);

      deidentifiedCheckIns.push({
        userIdHash,
        checkInIdHash: hashId(checkIn.id, effectiveSalt),
        weekPostpartum,
        sleepHours: checkIn.sleepHours ?? undefined,
        sleepDisruption: checkIn.sleepDisruption ?? undefined,
        sadness: checkIn.sadness ?? undefined,
        anxiety: checkIn.anxiety ?? undefined,
        painLevel: checkIn.painLevel ?? undefined,
        bleeding: checkIn.bleeding ?? undefined,
        feedingIssues: checkIn.feedingIssues,
        createdAt: generalizeDateToWeek(checkIn.createdAt),
      });
    }

    for (const escalation of user.escalations) {
      const escalationDate = new Date(escalation.createdAt);
      const weekPostpartum = calculateWeeksPostpartum(deliveryDate, escalationDate);

      deidentifiedEscalations.push({
        userIdHash,
        escalationIdHash: hashId(escalation.id, effectiveSalt),
        trigger: escalation.trigger,
        severity: escalation.severity,
        weekPostpartum,
        resolved: escalation.status === 'RESOLVED' || escalation.status === 'FALSE_POSITIVE',
        createdAt: generalizeDateToWeek(escalation.createdAt),
      });
    }

    for (const referral of user.referrals) {
      const referralDate = new Date(referral.createdAt);
      const weekPostpartum = calculateWeeksPostpartum(deliveryDate, referralDate);

      deidentifiedReferrals.push({
        userIdHash,
        referralIdHash: hashId(referral.id, effectiveSalt),
        providerSpecialty: referral.provider?.specialties ?? [],
        status: referral.status,
        weekPostpartum,
        createdAt: generalizeDateToWeek(referral.createdAt),
      });
    }
  }

  return {
    users: deidentifiedUsers,
    checkIns: deidentifiedCheckIns,
    escalations: deidentifiedEscalations,
    referrals: deidentifiedReferrals,
  };
}

function convertToJsonLines<T>(records: T[]): string {
  return records.map((r) => JSON.stringify(r)).join('\n');
}

async function uploadToS3(
  content: string,
  key: string,
  contentType = 'application/json'
): Promise<void> {
  const config = await getConfig();
  const s3Client = await getS3Client();
  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.ANALYTICS_BUCKET,
      Key: key,
      Body: content,
      ContentType: contentType,
      ServerSideEncryption: 'AES256',
    })
  );
}

export async function exportAndUploadAnalytics(): Promise<{
  usersKey: string;
  checkInsKey: string;
  escalationsKey: string;
  referralsKey: string;
}> {
  const config = await getConfig();
  const data = await exportDeidentifiedData(config.ANALYTICS_SALT);
  const timestamp = new Date().toISOString().split('T')[0];
  const prefix = `analytics/${timestamp}`;

  const usersJsonl = convertToJsonLines(data.users);
  const checkInsJsonl = convertToJsonLines(data.checkIns);
  const escalationsJsonl = convertToJsonLines(data.escalations);
  const referralsJsonl = convertToJsonLines(data.referrals);

  const usersKey = `${prefix}/users.jsonl`;
  const checkInsKey = `${prefix}/checkins.jsonl`;
  const escalationsKey = `${prefix}/escalations.jsonl`;
  const referralsKey = `${prefix}/referrals.jsonl`;

  await Promise.all([
    uploadToS3(usersJsonl, usersKey),
    uploadToS3(checkInsJsonl, checkInsKey),
    uploadToS3(escalationsJsonl, escalationsKey),
    uploadToS3(referralsJsonl, referralsKey),
  ]);

  return { usersKey, checkInsKey, escalationsKey, referralsKey };
}

export async function listAnalyticsFiles(prefix = 'analytics/'): Promise<string[]> {
  const config = await getConfig();
  const s3Client = await getS3Client();
  const command = new ListObjectsV2Command({
    Bucket: config.ANALYTICS_BUCKET,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);
  return response.Contents?.map((obj: { Key?: string }) => obj.Key || '').filter(Boolean) || [];
}

export async function deleteAnalyticsFile(key: string): Promise<void> {
  const config = await getConfig();
  const s3Client = await getS3Client();
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: config.ANALYTICS_BUCKET,
      Key: key,
    })
  );
}
