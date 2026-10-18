const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  const data: ApiResponse<T> = await response
    .json()
    .catch(() => ({ success: false, error: { code: 'PARSE_ERROR', message: 'Invalid response' } }));

  if (!response.ok || !data.success) {
    throw new ApiError(
      response.status,
      data.error?.code ?? 'ERROR',
      data.error?.message ?? 'Request failed',
      data.error?.details
    );
  }

  return data.data as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

export { ApiError };

import type {
  CheckIn,
  CheckInTrends,
  ClinicalNote,
  ClinicianPatientSummary,
  Escalation,
  MatchedProvider,
  Provider,
  Referral,
  Role,
  TodaysQuestionsResponse,
  User,
} from '@firstweeks/shared';

export type { Provider, Referral, MatchedProvider };

export const authApi = {
  signup: (email: string, password: string, role?: Role) =>
    api.post<{ user: User; accessToken: string }>('/auth/signup', { email, password, role }),
  login: (email: string, password: string) =>
    api.post<{ user: User; accessToken: string }>('/auth/login', { email, password }),
  refresh: () => api.post<{ user: User; accessToken: string }>('/auth/refresh', {}),
  logout: () => api.post<{ success: boolean }>('/auth/logout', {}),
  me: () => api.get<{ user: User }>('/auth/me'),
  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),
  verifyEmail: (token: string) => api.get<{ message: string }>(`/auth/verify-email?token=${token}`),
  resendVerification: (email: string) =>
    api.post<{ message: string }>('/auth/resend-verification', { email }),
};

export const onboardingApi = {
  submit: (data: {
    deliveryDate: string;
    deliveryType: string;
    feedingMethod: string;
    mentalHealthBaseline: { phq2Score: number; gad2Score: number; epdsScore?: number };
    complications: string[];
  }) => api.post<{ id: string; userId: string }>('/onboarding/quiz', data),
  get: () => api.get<{ id: string; userId: string }>('/onboarding/quiz'),
  getProfile: () =>
    api.get<{
      userId: string;
      deliveryType: string;
      feedingMethod: string;
      weeksPostpartum: number;
      riskFlags: string[];
      needsMentalHealth: boolean;
      needsLactation: boolean;
      needsPelvicFloor: boolean;
    }>('/onboarding/profile'),
  getTodaysQuestions: () => api.get<TodaysQuestionsResponse>('/questions/today'),
  savePushSubscription: (subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  }) => api.post<{ success: boolean }>('/push/subscribe', subscription),
};

export const checkinApi = {
  submit: (data: {
    date: string;
    sleepHours?: number;
    sleepDisruption?: number;
    sadness?: number;
    anxiety?: number;
    painLevel?: number;
    bleeding?: string;
    feedingIssues?: boolean;
    customResponses?: Record<string, unknown>;
  }) => api.post<{ id: string; userId: string; escalationCreated: boolean }>('/check-ins', data),
  list: (page = 1, limit = 30) => api.get<CheckIn[]>(`/check-ins?page=${page}&limit=${limit}`),
  getTrends: (periodDays = 30) =>
    api.get<CheckInTrends>(`/check-ins/trends?periodDays=${periodDays}`),
  getEscalations: () => api.get<{ data: Escalation[] }>('/escalations'),
};

export interface PatientDetail {
  user: { id: string; email: string; role: string; createdAt: string };
  onboarding: {
    deliveryDate: string;
    deliveryType: string;
    feedingMethod: string;
    mentalHealthBaseline: { phq2Score: number; gad2Score: number; epdsScore?: number };
    complications: string[];
    completedAt: string;
  } | null;
  recentCheckIns: CheckIn[];
  escalations: Escalation[];
  referrals: Referral[];
  clinicalNotes: ClinicalNote[];
}

export const clinicianApi = {
  getPatients: () => api.get<ClinicianPatientSummary[]>('/clinician/patients'),
  getEscalations: () => api.get<Escalation[]>('/clinician/escalations'),
  getPatient: (id: string) => api.get<PatientDetail>(`/clinician/patients/${id}`),
  addNote: (patientId: string, content: string) =>
    api.post<{ id: string }>(`/clinician/patients/${patientId}/notes`, { content }),
  updateEscalation: (id: string, data: { status?: string; assignedTo?: string }) =>
    api.patch<{ success: boolean }>(`/clinician/escalations/${id}`, data),
  getProviders: () => api.get<Provider[]>('/providers'),
  createProvider: (data: unknown) => api.post<{ id: string }>('/providers', data),
  getReferrals: () => api.get<Referral[]>('/referrals'),
  updateReferral: (id: string, status: string) =>
    api.patch<{ success: boolean }>(`/referrals/${id}`, { status }),
};

export const referralApi = {
  searchProviders: (params?: string) =>
    api.get<{ provider: Provider; score: number; reasons: string[] }[]>(
      `/providers/search${params ? `?${params}` : ''}`
    ),
  getReferral: (id: string) => api.get<Referral>(`/referrals/${id}`),
  consentReferral: (id: string) =>
    api.post<{ id: string; status: string }>(`/referrals/${id}/consent`, {}),
  declineReferral: (id: string) =>
    api.post<{ id: string; status: string }>(`/referrals/${id}/decline`, {}),
  getMyReferrals: () => api.get<Referral[]>('/referrals'),
};
