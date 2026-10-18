import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

vi.mock('react-router-dom', () => ({
  ...vi.requireActual('react-router-dom'),
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  NavLink: ({ children, to, ...props }: any) => React.createElement('a', { href: to, ...props }, children),
  Link: ({ children, to, ...props }: any) => React.createElement('a', { href: to, ...props }, children),
}));

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
  authApi: {},
  onboardingApi: {},
  checkinApi: {},
  clinicianApi: {},
  referralApi: {},
  ApiError: class extends Error {},
}));