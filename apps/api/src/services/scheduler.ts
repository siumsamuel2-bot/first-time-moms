import { evaluateEscalation } from '@firstweeks/shared/rules/escalation.js';
import { sendDailyCheckInReminder, sendEscalationAlert } from '../routes/push.js';
import { logger } from '../utils/logger.js';
import { prisma } from '../utils/prisma.js';
import { exportAndUploadAnalytics } from './analytics-export.js';

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
  customResponses: import('@prisma/client').Prisma.JsonValue;
  createdAt: Date;
}): import('@firstweeks/shared/zod-schemas.js').CheckIn {
  return {
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
  };
}

export async function sendDailyCheckInReminders(): Promise<{
  sent: number;
  failed: number;
}> {
  const users = await prisma.user.findMany({
    where: {
      role: 'MOM',
      onboarding: { isNot: null },
      pushSubscriptions: { some: {} },
    },
    include: {
      pushSubscriptions: true,
      onboarding: true,
    },
  });

  let totalSent = 0;
  let totalFailed = 0;

  for (const user of users) {
    const result = await sendDailyCheckInReminder(user.id);
    if (result) {
      totalSent += result.sent;
      totalFailed += result.failed;
    }
  }

  console.log(`Daily check-in reminders: ${totalSent} sent, ${totalFailed} failed`);
  return { sent: totalSent, failed: totalFailed };
}

export async function checkEscalationsAndAlert(): Promise<{
  sent: number;
  failed: number;
}> {
  const users = await prisma.user.findMany({
    where: {
      role: 'MOM',
      onboarding: { isNot: null },
      pushSubscriptions: { some: {} },
    },
    include: {
      pushSubscriptions: true,
      onboarding: true,
      checkIns: { orderBy: { date: 'desc' }, take: 30 },
    },
  });

  let totalSent = 0;
  let totalFailed = 0;

  for (const user of users) {
    const checkInData = user.checkIns.map(toCheckInData);
    const escalationDecision = evaluateEscalation(checkInData);

    if (escalationDecision.shouldEscalate && escalationDecision.trigger) {
      const result = await sendEscalationAlert(user.id, escalationDecision.trigger);
      if (result) {
        totalSent += result.sent;
        totalFailed += result.failed;
      }
    }
  }

  console.log(`Escalation alerts: ${totalSent} sent, ${totalFailed} failed`);
  return { sent: totalSent, failed: totalFailed };
}

export async function runDailyJobs(): Promise<void> {
  console.log('Running daily scheduled jobs...');
  const startTime = Date.now();

  try {
    await Promise.all([sendDailyCheckInReminders(), checkEscalationsAndAlert()]);
  } catch (error) {
    console.error('Daily jobs failed:', error);
  }

  console.log(`Daily jobs completed in ${Date.now() - startTime}ms`);
}

export async function runAnalyticsExport(): Promise<void> {
  console.log('Running analytics export...');
  const startTime = Date.now();

  try {
    const result = await exportAndUploadAnalytics();

    logger.info('Analytics export completed', {
      usersKey: result.usersKey,
      checkInsKey: result.checkInsKey,
      escalationsKey: result.escalationsKey,
      referralsKey: result.referralsKey,
      durationMs: Date.now() - startTime,
    });
  } catch (error) {
    logger.error('Analytics export failed', { error });
  }
}

export function scheduleDailyJobs(cronExpression = '0 9 * * *'): void {
  if (typeof setInterval === 'undefined') {
    console.warn('setInterval not available, skipping scheduler');
    return;
  }

  const now = new Date();
  const [minute, hour] = cronExpression.split(' ').slice(0, 2);
  const targetHour = Number.parseInt(hour, 10);
  const targetMinute = Number.parseInt(minute, 10);

  const target = new Date();
  target.setHours(targetHour, targetMinute, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const initialDelay = target.getTime() - now.getTime();

  setTimeout(() => {
    runDailyJobs();
    setInterval(runDailyJobs, 24 * 60 * 60 * 1000);
  }, initialDelay);

  console.log(`Daily jobs scheduled to run at ${targetHour}:${targetMinute}`);
}

export function scheduleWeeklyAnalyticsExport(cronExpression = '0 2 * * 0'): void {
  if (typeof setInterval === 'undefined') {
    console.warn('setInterval not available, skipping analytics scheduler');
    return;
  }

  const now = new Date();
  const [minute, hour, , , dayOfWeek] = cronExpression.split(' ');
  const targetHour = Number.parseInt(hour, 10);
  const targetMinute = Number.parseInt(minute, 10);
  const targetDay = Number.parseInt(dayOfWeek, 10); // 0 = Sunday

  const target = new Date();
  target.setHours(targetHour, targetMinute, 0, 0);

  // Calculate days until target day
  const currentDay = now.getDay();
  let daysUntilTarget = (targetDay - currentDay + 7) % 7;
  if (daysUntilTarget === 0 && target <= now) {
    daysUntilTarget = 7;
  }

  target.setDate(target.getDate() + daysUntilTarget);

  const initialDelay = target.getTime() - now.getTime();

  setTimeout(() => {
    runAnalyticsExport();
    setInterval(runAnalyticsExport, 7 * 24 * 60 * 60 * 1000);
  }, initialDelay);

  console.log(
    `Weekly analytics export scheduled to run on day ${targetDay} at ${targetHour}:${targetMinute}`
  );
}
