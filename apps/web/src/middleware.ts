export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/dashboard/:path*', '/check-in/:path*', '/api/providers/:path*', '/api/escalations/:path*'],
};