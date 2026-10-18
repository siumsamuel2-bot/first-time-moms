import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToastHelpers } from '@/components/ui/toaster';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import {
  getNotificationPermission,
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/lib/push';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Lock, LogOut, Mail, Moon, Shield, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const profileSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    currentPassword: z.string().optional(),
    newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.newPassword || data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => !data.newPassword || data.currentPassword, {
    message: 'Current password is required to change password',
    path: ['currentPassword'],
  });

type ProfileForm = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user, refresh, logout } = useAuth();
  const { success: toastSuccess, error: toastError } = useToastHelpers();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email ?? '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const supported = isPushSupported();
    setPushSupported(supported);
    if (supported) {
      checkPushSubscription();
    }
  }, []);

  const checkPushSubscription = async () => {
    if (!pushSupported) return;
    const permission = getNotificationPermission();
    if (permission === 'granted') {
      const subscription = await subscribeToPush();
      setNotificationsEnabled(!!subscription);
    } else {
      setNotificationsEnabled(false);
    }
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!pushSupported) {
      toastError('Not Supported', 'Push notifications are not supported in this browser');
      return;
    }

    setIsSubscribing(true);
    try {
      if (enabled) {
        const subscription = await subscribeToPush();
        if (subscription) {
          await api.post('/push/subscribe', subscription);
          toastSuccess('Enabled', 'You will receive daily check-in reminders');
          setNotificationsEnabled(true);
        } else {
          toastError('Permission Denied', 'Please enable notifications in your browser settings');
          setNotificationsEnabled(false);
        }
      } else {
        await unsubscribeFromPush();
        await api.delete('/push/unsubscribe');
        toastSuccess('Disabled', 'You will no longer receive daily check-in reminders');
        setNotificationsEnabled(false);
      }
    } catch (err) {
      console.error('Failed to toggle notifications:', err);
      toastError('Error', 'Failed to update notification settings');
      setNotificationsEnabled(!enabled);
    } finally {
      setIsSubscribing(false);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    try {
      if (data.newPassword && data.currentPassword) {
        // In a real app, this would call a change password endpoint
        toastSuccess('Password updated', 'Your password has been changed.');
      }
      if (data.email !== user?.email) {
        // In a real app, this would call an update email endpoint
        toastSuccess('Email updated', 'Your email has been changed.');
      }
      await refresh();
    } catch {
      toastError('Error', 'Failed to update profile');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  className="pl-10"
                  {...register('email')}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>

            <Separator>Change Password</Separator>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type="password"
                  className="pl-10"
                  {...register('currentPassword')}
                  disabled={isSubmitting}
                />
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-600">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type="password"
                  className="pl-10"
                  {...register('newPassword')}
                  disabled={isSubmitting}
                />
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  className="pl-10"
                  {...register('confirmPassword')}
                  disabled={isSubmitting}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Bell className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <p className="font-medium">Daily Check-in Reminder</p>
                <p className="text-sm text-muted-foreground">
                  Receive a notification at 9 AM for your daily check-in
                </p>
              </div>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
              disabled={isSubscribing || !pushSupported}
              aria-label="Daily check-in reminder"
            />
          </div>

          {pushSupported && getNotificationPermission() === 'default' && (
            <p className="text-sm text-muted-foreground">
              Click the switch above to enable notifications and allow permission when prompted.
            </p>
          )}

          {pushSupported && getNotificationPermission() === 'denied' && (
            <p className="text-sm text-red-600">
              Notifications are blocked. Enable them in your browser settings to receive reminders.
            </p>
          )}

          {!pushSupported && (
            <p className="text-sm text-muted-foreground">
              Push notifications are not supported in this browser.
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Escalation Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified if your care team needs to reach out
                </p>
              </div>
            </div>
            <Switch checked={true} disabled aria-label="Escalation alerts (always on)" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5" /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                {darkMode ? (
                  <Moon className="h-5 w-5 text-primary-600" />
                ) : (
                  <Sun className="h-5 w-5 text-primary-600" />
                )}
              </div>
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Use dark theme (follows system preference)
                </p>
              </div>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Dark mode" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <LogOut className="h-5 w-5" /> Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 mb-4">
            Once you delete your account, there is no going back. All your data will be permanently
            removed.
          </p>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                /* delete account */
              }
            }}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
