import { config } from '../config.js';
import { logger } from '../utils/logger.js';

interface PaperclipIssue {
  id: string;
  identifier: string;
  executionRunId: string | null;
  executionLockedAt: string | null;
  executionRunStartedAt: string | null;
  executionAgentNameKey: string | null;
  assigneeAgentId: string | null;
  status: string;
  agent?: {
    id: string;
    lastHeartbeatAt: string | null;
    status: string;
  };
}

interface PaperclipAgent {
  id: string;
  lastHeartbeatAt: string | null;
  status: string;
}

interface SweeperResult {
  released: Array<{
    issueId: string;
    identifier: string;
    reason: string;
  }>;
  checked: number;
  errors: string[];
}

function getPaperclipBaseUrl(): string {
  return config.PAPERCLIP_API_URL ?? 'https://api.paperclip.ing';
}

function getAuthHeaders(): Record<string, string> {
  const apiKey = config.PAPERCLIP_API_KEY;
  if (!apiKey) {
    throw new Error('PAPERCLIP_API_KEY not configured');
  }
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
}

async function fetchPaperclip<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${getPaperclipBaseUrl()}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Paperclip API error: ${response.status} ${errorText}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchStaleIssues(): Promise<PaperclipIssue[]> {
  const companyId = config.PAPERCLIP_COMPANY_ID;
  if (!companyId) {
    throw new Error('PAPERCLIP_COMPANY_ID not configured');
  }

  const issues = await fetchPaperclip<PaperclipIssue[]>(
    `/api/companies/${companyId}/issues?status=in_progress,queued&limit=500`
  );

  return issues.filter((issue) => issue.executionRunId !== null);
}

export async function fetchAgent(agentId: string): Promise<PaperclipAgent | null> {
  try {
    return await fetchPaperclip<PaperclipAgent>(`/api/agents/${agentId}`);
  } catch {
    return null;
  }
}

export async function releaseExecutionLock(issueId: string): Promise<boolean> {
  try {
    await fetchPaperclip(`/api/issues/${issueId}`, {
      method: 'PATCH',
      body: JSON.stringify({ executionRunId: null }),
    });
    return true;
  } catch (error) {
    logger.error({ err: error, issueId }, 'Failed to release execution lock');
    return false;
  }
}

function isStaleQueued(issue: PaperclipIssue): boolean {
  if (!issue.executionLockedAt) return false;
  const lockedAt = new Date(issue.executionLockedAt).getTime();
  const twoHours = 2 * 60 * 60 * 1000;
  return Date.now() - lockedAt > twoHours;
}

function isStaleRunning(issue: PaperclipIssue): boolean {
  if (!issue.executionRunStartedAt) return false;
  const startedAt = new Date(issue.executionRunStartedAt).getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  return Date.now() - startedAt > twentyFourHours;
}

async function isStaleHeartbeat(issue: PaperclipIssue): Promise<boolean> {
  if (!issue.assigneeAgentId || !issue.agent) return false;
  if (!issue.agent.lastHeartbeatAt) return true;
  const lastHeartbeat = new Date(issue.agent.lastHeartbeatAt).getTime();
  const fiveMinutes = 5 * 60 * 1000;
  return Date.now() - lastHeartbeat > fiveMinutes;
}

function getStaleReason(issue: PaperclipIssue, agentStale: boolean): string {
  const reasons: string[] = [];
  if (isStaleQueued(issue)) reasons.push('queued > 2h');
  if (isStaleRunning(issue)) reasons.push('running > 24h');
  if (agentStale) reasons.push('stale heartbeat > 5min');
  return reasons.join(', ');
}

export async function runSweeper(shadowMode = true): Promise<SweeperResult> {
  const result: SweeperResult = {
    released: [],
    checked: 0,
    errors: [],
  };

  if (!config.SWEEPER_ENABLED) {
    logger.info('Sweeper disabled (SWEEPER_ENABLED not set)');
    return result;
  }

  logger.info({ shadowMode }, 'Starting sweeper run');

  try {
    const issues = await fetchStaleIssues();
    result.checked = issues.length;

    for (const issue of issues) {
      if (!issue.executionRunId) continue;

      const agentStale = await isStaleHeartbeat(issue);
      const isStale = isStaleQueued(issue) || isStaleRunning(issue) || agentStale;

      if (!isStale) continue;

      const reason = getStaleReason(issue, agentStale);

      if (shadowMode || config.SWEEPER_SHADOW) {
        logger.info(
          { issueId: issue.id, identifier: issue.identifier, runId: issue.executionRunId, reason },
          'SHADOW: Would release stale execution lock'
        );
        result.released.push({ issueId: issue.id, identifier: issue.identifier, reason });
      } else {
        const success = await releaseExecutionLock(issue.id);
        if (success) {
          logger.info(
            {
              issueId: issue.id,
              identifier: issue.identifier,
              runId: issue.executionRunId,
              reason,
            },
            'Released stale execution lock'
          );
          result.released.push({ issueId: issue.id, identifier: issue.identifier, reason });
        } else {
          result.errors.push(`Failed to release lock for ${issue.identifier}`);
        }
      }
    }

    logger.info(
      {
        checked: result.checked,
        released: result.released.length,
        errors: result.errors.length,
        shadowMode,
      },
      'Sweeper run completed'
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ err: error }, 'Sweeper run failed');
    result.errors.push(errorMsg);
  }

  return result;
}

export async function checkSweeperScope(): Promise<{ canClearLocks: boolean; error?: string }> {
  if (!config.SWEEPER_ENABLED) {
    return { canClearLocks: false, error: 'Sweeper disabled (SWEEPER_ENABLED not set)' };
  }

  try {
    const companyId = config.PAPERCLIP_COMPANY_ID;
    if (!companyId) {
      return { canClearLocks: false, error: 'PAPERCLIP_COMPANY_ID not configured' };
    }

    const issues = await fetchPaperclip<PaperclipIssue[]>(
      `/api/companies/${companyId}/issues?status=in_progress,queued&limit=1`
    );

    const testIssue = issues.find((i) => i.executionRunId !== null);
    if (!testIssue) {
      return { canClearLocks: true, error: 'No active runs to test with' };
    }

    const success = await releaseExecutionLock(testIssue.id);
    if (success) {
      logger.info({ issueId: testIssue.id }, 'Scope check: successfully cleared executionRunId');
      return { canClearLocks: true };
    }
    return {
      canClearLocks: false,
      error: 'PATCH /api/issues/{id} with executionRunId: null failed',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ err: error }, 'Scope check failed');
    return { canClearLocks: false, error: errorMsg };
  }
}
