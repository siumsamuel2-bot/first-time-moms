import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  me: vi.fn(),
  login: vi.fn(),
  signup: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('@/lib/api', () => ({
  authApi: {
    me: mocks.me,
    login: mocks.login,
    signup: mocks.signup,
    logout: mocks.logout,
  },
}));

import { AuthProvider, useAuth } from './AuthContext';

const wrapper = ({ children }: { children: ReactNode }) => <AuthProvider>{children}</AuthProvider>;

const user = { id: 'u1', email: 'mom@example.com', role: 'MOM' } as never;

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.me.mockResolvedValue({ user });
  });

  it('bootstraps the session on mount and clears isLoading', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mocks.me).toHaveBeenCalledTimes(1);
  });

  it('treats a failed bootstrap as signed out', async () => {
    mocks.me.mockRejectedValue(new Error('401'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('sets the user on login', async () => {
    mocks.login.mockResolvedValue({ user, accessToken: 't' });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.login('mom@example.com', 'password123');
    });

    expect(mocks.login).toHaveBeenCalledWith('mom@example.com', 'password123');
    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('sets the user on signup with a role', async () => {
    mocks.signup.mockResolvedValue({ user, accessToken: 't' });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.signup('new@example.com', 'password123', 'CLINICIAN' as never);
    });

    expect(mocks.signup).toHaveBeenCalledWith('new@example.com', 'password123', 'CLINICIAN');
    expect(result.current.user).toEqual(user);
  });

  it('clears the user on logout', async () => {
    mocks.logout.mockResolvedValue({ success: true });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    await act(async () => {
      await result.current.logout();
    });

    expect(mocks.logout).toHaveBeenCalledTimes(1);
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('throws when useAuth is used outside a provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within AuthProvider');
    spy.mockRestore();
  });
});
