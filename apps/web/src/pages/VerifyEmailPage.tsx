import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToastHelpers } from '@/components/ui/toaster';
import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { error: toastError, success: toastSuccess } = useToastHelpers();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('Invalid or missing verification token');
      return;
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setStatus('success');
        toastSuccess('Email verified!', 'Your email has been successfully verified.');
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'An unexpected error occurred';
        setErrorMessage(message);
        setStatus('error');
        toastError('Verification failed', message);
      }
    };

    verify();
  }, [token, toastError, toastSuccess]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary-600" />
            <p className="mt-4 text-muted-foreground">Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle as="h1" className="text-2xl">
              Email verified!
            </CardTitle>
            <CardDescription>
              Your email has been successfully verified. You can now sign in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button className="w-full" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle as="h1" className="text-2xl">
            Verification failed
          </CardTitle>
          <CardDescription>
            {errorMessage || 'The verification link is invalid or has expired.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate('/resend-verification')}
          >
            Resend Verification Email
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate('/login')}>
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
