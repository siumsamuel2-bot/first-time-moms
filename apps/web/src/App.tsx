import { Layout } from '@/components/Layout';
import { ToastProviderComponent } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((mod) => ({ default: mod.LoginPage }))
);
const SignupPage = lazy(() =>
  import('@/pages/SignupPage').then((mod) => ({ default: mod.SignupPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/ForgotPasswordPage').then((mod) => ({ default: mod.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
  import('@/pages/ResetPasswordPage').then((mod) => ({ default: mod.ResetPasswordPage }))
);
const VerifyEmailPage = lazy(() =>
  import('@/pages/VerifyEmailPage').then((mod) => ({ default: mod.VerifyEmailPage }))
);
const ResendVerificationPage = lazy(() =>
  import('@/pages/ResendVerificationPage').then((mod) => ({ default: mod.ResendVerificationPage }))
);
const OnboardingPage = lazy(() =>
  import('@/pages/OnboardingPage').then((mod) => ({ default: mod.OnboardingPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((mod) => ({ default: mod.DashboardPage }))
);
const CheckInPage = lazy(() =>
  import('@/pages/CheckInPage').then((mod) => ({ default: mod.CheckInPage }))
);
const HistoryPage = lazy(() =>
  import('@/pages/HistoryPage').then((mod) => ({ default: mod.HistoryPage }))
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((mod) => ({ default: mod.ProfilePage }))
);
const ProviderSearchPage = lazy(() =>
  import('@/pages/ProviderSearchPage').then((mod) => ({ default: mod.ProviderSearchPage }))
);
const ReferralsListPage = lazy(() =>
  import('@/pages/ReferralsListPage').then((mod) => ({ default: mod.ReferralsListPage }))
);
const ReferralAcceptancePage = lazy(() =>
  import('@/pages/ReferralAcceptancePage').then((mod) => ({ default: mod.ReferralAcceptancePage }))
);
const ClinicianDashboardPage = lazy(() =>
  import('@/pages/ClinicianDashboardPage').then((mod) => ({ default: mod.ClinicianDashboardPage }))
);
const ClinicianPatientPage = lazy(() =>
  import('@/pages/ClinicianPatientPage').then((mod) => ({ default: mod.ClinicianPatientPage }))
);

function LazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse-soft text-primary-600">Loading...</div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function PrivateRoute({
  children,
  allowedRoles,
}: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft text-primary-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft text-primary-600">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LazyWrapper>
              <LoginPage />
            </LazyWrapper>
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <LazyWrapper>
              <SignupPage />
            </LazyWrapper>
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <LazyWrapper>
              <ForgotPasswordPage />
            </LazyWrapper>
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <LazyWrapper>
              <ResetPasswordPage />
            </LazyWrapper>
          </PublicRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <PublicRoute>
            <LazyWrapper>
              <VerifyEmailPage />
            </LazyWrapper>
          </PublicRoute>
        }
      />
      <Route
        path="/resend-verification"
        element={
          <PublicRoute>
            <LazyWrapper>
              <ResendVerificationPage />
            </LazyWrapper>
          </PublicRoute>
        }
      />

      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route
          path="/onboarding"
          element={
            <LazyWrapper>
              <OnboardingPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/dashboard"
          element={
            <LazyWrapper>
              <DashboardPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/check-in"
          element={
            <LazyWrapper>
              <CheckInPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/history"
          element={
            <LazyWrapper>
              <HistoryPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <LazyWrapper>
              <ProfilePage />
            </LazyWrapper>
          }
        />
        <Route
          path="/providers"
          element={
            <LazyWrapper>
              <ProviderSearchPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/referrals"
          element={
            <LazyWrapper>
              <ReferralsListPage />
            </LazyWrapper>
          }
        />
        <Route
          path="/referrals/:id"
          element={
            <LazyWrapper>
              <ReferralAcceptancePage />
            </LazyWrapper>
          }
        />

        <Route
          element={
            <PrivateRoute allowedRoles={['CLINICIAN', 'ADMIN']}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route
            path="/clinician"
            element={
              <LazyWrapper>
                <ClinicianDashboardPage />
              </LazyWrapper>
            }
          />
          <Route
            path="/clinician/patient/:id"
            element={
              <LazyWrapper>
                <ClinicianPatientPage />
              </LazyWrapper>
            }
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ToastProviderComponent>
        <AppRoutes />
      </ToastProviderComponent>
    </AuthProvider>
  );
}
