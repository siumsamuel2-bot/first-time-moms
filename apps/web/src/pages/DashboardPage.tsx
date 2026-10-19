import { ThreeAMHome } from '@/components/ThreeAMHome';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useThemeMode } from '@/context/ThemeModeContext';
import { ApiError, checkinApi, onboardingApi } from '@/lib/api';
import { cn, getRiskColor } from '@/lib/utils';

interface RecoveryProfileData {
  userId: string;
  deliveryType: string;
  feedingMethod: string;
  weeksPostpartum: number;
  riskFlags: string[];
  needsMentalHealth: boolean;
  needsLactation: boolean;
  needsPelvicFloor: boolean;
}
import {
  Activity,
  AlertTriangle,
  Brain,
  CheckCircle,
  ChevronRight,
  Heart,
  Moon,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();
  const { isNight } = useThemeMode();
  const [profile, setProfile] = useState<RecoveryProfileData | null>(null);
  const [hasCheckInToday, setHasCheckInToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const profileData = await onboardingApi.getProfile();
      setProfile(profileData);
      setRiskLevel(profileData.riskFlags.length > 2 ? 'medium' : 'low');

      const today = new Date().toISOString().split('T')[0];
      const checkIns = await checkinApi.list(1, 1);
      setHasCheckInToday(checkIns.some((c) => c.date === today));
    } catch (err) {
      if (err instanceof ApiError && err.code === 'ONBOARDING_REQUIRED') {
        navigate('/onboarding', { replace: true });
      } else {
        console.error('Failed to load dashboard:', err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-24 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  /* 3 AM Mode is a different interaction posture, not a theme port (spec §3). */
  if (isNight) {
    return (
      <ThreeAMHome
        onQuickLog={(kind) => {
          if (kind !== 'skip') navigate('/check-in');
        }}
        onCheckIn={() => navigate('/check-in')}
        onCrisis={() => navigate('/providers')}
      />
    );
  }

  const weeksPostpartum = profile.weeksPostpartum;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good morning! 👋</h1>
          <p className="text-muted-foreground">
            Week {weeksPostpartum} postpartum • {profile.deliveryType.replace('_', ' ')} •{' '}
            {profile.feedingMethod.charAt(0) + profile.feedingMethod.slice(1).toLowerCase()}
          </p>
        </div>
        <div className={cn('px-3 py-1 rounded-full text-xs font-medium', getRiskColor(riskLevel))}>
          Risk: {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Check-in</CardTitle>
            <Heart className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            {hasCheckInToday ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">✓ Complete</p>
                  <p className="text-xs text-muted-foreground">Thanks for checking in today!</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <Button className="w-full" size="lg" onClick={() => navigate('/check-in')}>
                Start Check-in
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sleep Trend</CardTitle>
            <Moon className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>This week</span>
                <span className="font-medium">—</span>
              </div>
              <Progress value={50} className="h-2" />
              <p className="text-xs text-muted-foreground">Complete check-ins to see trends</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Trend</CardTitle>
            <Brain className="h-4 w-4 text-primary-600" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>This week</span>
                <span className="font-medium">—</span>
              </div>
              <Progress value={50} className="h-2" />
              <p className="text-xs text-muted-foreground">Complete check-ins to see trends</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Recovery Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Delivery</p>
              <p className="font-medium capitalize">{profile.deliveryType.replace('_', ' ')}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Feeding</p>
              <p className="font-medium capitalize">
                {profile.feedingMethod.charAt(0) + profile.feedingMethod.slice(1).toLowerCase()}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Weeks Postpartum</p>
              <p className="font-medium">{weeksPostpartum}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Mental Health Flags</p>
              <p className="font-medium">
                {profile.needsMentalHealth ? 'Yes - elevated baseline' : 'No concerns at baseline'}
              </p>
            </div>
          </div>

          {profile.riskFlags.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Risk Flags</p>
              <div className="flex flex-wrap gap-2">
                {profile.riskFlags.map((flag) => (
                  <span
                    key={flag}
                    className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
                  >
                    {flag.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.needsLactation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Lactation support available - you're breastfeeding or pumping
              </p>
            </div>
          )}

          {profile.needsPelvicFloor && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Pelvic floor recovery resources available
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate('/check-in')}>
            <div className="flex flex-col items-center gap-2">
              <Heart className="h-8 w-8 text-primary-600" />
              <span className="font-medium">Daily Check-in</span>
              <span className="text-xs text-muted-foreground">Track your recovery</span>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate('/history')}>
            <div className="flex flex-col items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary-600" />
              <span className="font-medium">View History</span>
              <span className="text-xs text-muted-foreground">See your trends</span>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate('/providers')}>
            <div className="flex flex-col items-center gap-2">
              <Shield className="h-8 w-8 text-primary-600" />
              <span className="font-medium">Find Providers</span>
              <span className="text-xs text-muted-foreground">Search matched providers</span>
            </div>
          </Button>
          <Button variant="outline" className="h-auto py-4" onClick={() => navigate('/referrals')}>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-8 w-8 text-primary-600" />
              <span className="font-medium">My Referrals</span>
              <span className="text-xs text-muted-foreground">Track referrals</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      {riskLevel === 'high' || riskLevel === 'critical' ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">Elevated risk detected</p>
              <p className="text-sm text-red-700">
                Your recent check-ins suggest you may benefit from additional support. Consider
                reaching out to your provider or using the resources below.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
