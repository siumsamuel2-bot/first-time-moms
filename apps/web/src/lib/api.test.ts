import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';

let api: typeof import('./api').api;
let authApi: typeof import('./api').authApi;
let checkinApi: typeof import('./api').checkinApi;
let referralApi: typeof import('./api').referralApi;
let clinicianApi: typeof import('./api').clinicianApi;
let ApiError: typeof import('./api').ApiError;

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

beforeAll(async () => {
  const actual = await vi.importActual<typeof import('./api')>('./api');
  api = actual.api;
  authApi = actual.authApi;
  checkinApi = actual.checkinApi;
  referralApi = actual.referralApi;
  clinicianApi = actual.clinicianApi;
  ApiError = actual.ApiError;
});

function mockFetch(payload: unknown, init: { ok?: boolean; status?: number } = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: () => Promise.resolve(payload),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function mockFetchReject() {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.reject(new Error('not json')),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('api request wrapper', () => {
  it('issues a GET with credentials and JSON content type, returning unwrapped data', async () => {
    const fetchMock = mockFetch({ success: true, data: { id: 'abc' } });

    const result = await api.get<{ id: string }>('/thing');

    expect(result).toEqual({ id: 'abc' });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(`${API_BASE}/thing`);
    expect(options.method).toBe('GET');
    expect(options.credentials).toBe('include');
    expect(options.headers['Content-Type']).toBe('application/json');
  });

  it('serializes the body for POST and PATCH', async () => {
    const postMock = mockFetch({ success: true, data: 1 });
    await api.post('/thing', { a: 1 });
    expect(postMock.mock.calls[0][1].method).toBe('POST');
    expect(postMock.mock.calls[0][1].body).toBe(JSON.stringify({ a: 1 }));

    const patchMock = mockFetch({ success: true, data: 2 });
    await api.patch('/thing', { b: 2 });
    expect(patchMock.mock.calls[0][1].method).toBe('PATCH');
    expect(patchMock.mock.calls[0][1].body).toBe(JSON.stringify({ b: 2 }));
  });

  it('uses DELETE without a body', async () => {
    const fetchMock = mockFetch({ success: true, data: null });
    await api.delete('/thing');
    expect(fetchMock.mock.calls[0][1].method).toBe('DELETE');
    expect(fetchMock.mock.calls[0][1].body).toBeUndefined();
  });

  it('throws ApiError with status, code, message and details on HTTP error', async () => {
    mockFetch(
      { success: false, error: { code: 'NOT_FOUND', message: 'nope', details: { id: 1 } } },
      { ok: false, status: 404 }
    );

    let caught: unknown;
    try {
      await api.get('/thing');
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(ApiError);
    const err = caught as InstanceType<typeof ApiError>;
    expect(err.name).toBe('ApiError');
    expect(err.status).toBe(404);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('nope');
    expect(err.details).toEqual({ id: 1 });
  });

  it('throws ApiError when the payload reports success:false on a 200', async () => {
    mockFetch({ success: false, error: { code: 'VALIDATION', message: 'bad input' } });

    await expect(api.post('/thing', {})).rejects.toMatchObject({
      status: 200,
      code: 'VALIDATION',
      message: 'bad input',
    });
  });

  it('throws a PARSE_ERROR ApiError for non-JSON responses', async () => {
    mockFetchReject();

    await expect(api.get('/thing')).rejects.toMatchObject({
      code: 'PARSE_ERROR',
      message: 'Invalid response',
    });
  });

  it('falls back to generic error fields when the envelope omits them', async () => {
    mockFetch({ success: false }, { ok: false, status: 500 });

    await expect(api.get('/thing')).rejects.toMatchObject({
      status: 500,
      code: 'ERROR',
      message: 'Request failed',
    });
  });
});

describe('endpoint builders', () => {
  it('authApi.login posts to /auth/login', async () => {
    const fetchMock = mockFetch({ success: true, data: { user: {}, accessToken: 't' } });
    await authApi.login('a@b.com', 'pw');
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE}/auth/login`);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      email: 'a@b.com',
      password: 'pw',
    });
  });

  it('authApi.verifyEmail puts the token in the query string', async () => {
    const fetchMock = mockFetch({ success: true, data: { message: 'ok' } });
    await authApi.verifyEmail('tok 123');
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE}/auth/verify-email?token=tok 123`);
  });

  it('checkinApi.getTrends encodes the period', async () => {
    const fetchMock = mockFetch({ success: true, data: {} });
    await checkinApi.getTrends(7);
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE}/check-ins/trends?periodDays=7`);
  });

  it('referralApi.searchProviders omits the query string when no params', async () => {
    const fetchMock = mockFetch({ success: true, data: [] });
    await referralApi.searchProviders();
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE}/providers/search`);
  });

  it('referralApi.searchProviders appends params when provided', async () => {
    const fetchMock = mockFetch({ success: true, data: [] });
    await referralApi.searchProviders('zipCode=10001&specialty=LACTATION');
    expect(fetchMock.mock.calls[0][0]).toBe(
      `${API_BASE}/providers/search?zipCode=10001&specialty=LACTATION`
    );
  });

  it('clinicianApi.updateReferral patches the referral status', async () => {
    const fetchMock = mockFetch({ success: true, data: { success: true } });
    await clinicianApi.updateReferral('ref-1', 'COMPLETED');
    expect(fetchMock.mock.calls[0][0]).toBe(`${API_BASE}/referrals/ref-1`);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ status: 'COMPLETED' });
  });
});
