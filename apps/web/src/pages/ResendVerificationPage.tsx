import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToastHelpers } from '@/components/ui/toaster';
import { authApi } from '@/lib/api';
import { ApiError } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const resendVerificationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ResendVerificationForm = z.infer<typeof resendVerificationSchema>;

export function ResendVerificationPage() {
  const navigate = useNavigate();
  const { error: toastError, success: toastSuccess } = useToastHelpers();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationForm>({
    resolver: zodResolver(resendVerificationSchema),
  });

  const onSubmit = async (data: ResendVerificationForm) => {
    setIsLoading(true);
    try {
      await authApi.resendVerification(data.email);
      setIsSent(true);
      toastSuccess('Check your email', 'If the email exists, a verification link has been sent');
    } catch (err) {
      if (err instanceof ApiError) {
        toastError('Error', err.message);
      } else {
        toastError('Error', 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle as="h1" className="text-2xl">
              Check your email
            </CardTitle>
            <CardDescription>
              If the email exists, a verification link has been sent. The link expires in 24 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
              Back to Sign In
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
          <CardTitle as="h1" className="text-2xl">
            Resend verification email
          </CardTitle>
          <CardDescription>
            Enter your email and we'll send you a new verification link
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register('email')}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Verification Link'}
            </Button>
          </form>
        </CardContent>
        <div className="text-center py-4">
          <Link to="/login" className="text-sm text-primary-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
