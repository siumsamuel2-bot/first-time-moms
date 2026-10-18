import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Referral, referralApi } from '@/lib/api';
import { ReferralStatus } from '@firstweeks/shared';
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ExternalLink,
  Heart,
  Info,
  Shield,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const StatusBadge = ({ status }: { status: Referral['status'] }) => {
  const variants: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    MOM_CONSENTED: 'bg-blue-100 text-blue-800',
    PROVIDER_NOTIFIED: 'bg-purple-100 text-purple-800',
    APPOINTMENT_SCHEDULED: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-green-100 text-green-800',
    DECLINED: 'bg-red-100 text-red-800',
    EXPIRED: 'bg-gray-100 text-gray-800',
  };
  const labels: Record<string, string> = {
    PENDING: 'Awaiting Your Response',
    MOM_CONSENTED: 'Consented - Provider Notified',
    PROVIDER_NOTIFIED: 'Provider Notified',
    APPOINTMENT_SCHEDULED: 'Appointment Scheduled',
    COMPLETED: 'Completed',
    DECLINED: 'Declined',
    EXPIRED: 'Expired',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${variants[status] ?? 'bg-gray-100 text-gray-800'}`}
    >
      {labels[status] ?? status}
    </span>
  );
};

export function ReferralAcceptancePage() {
  const { id } = useParams<{ id: string }>();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) loadReferral();
  }, [id]);

  const loadReferral = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!id) throw new Error('No referral ID');
      const data = await referralApi.getReferral(id);
      setReferral(data);
    } catch (err) {
      console.error('Failed to load referral:', err);
      setError('Failed to load referral details. It may not exist or you may not have access.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConsent = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await referralApi.consentReferral(id);
      setReferral((prev: Referral | null) =>
        prev ? { ...prev, status: ReferralStatus.MOM_CONSENTED, momConsent: true } : null
      );
    } catch (err) {
      console.error('Failed to consent:', err);
      setError('Failed to provide consent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await referralApi.declineReferral(id);
      setReferral((prev: Referral | null) =>
        prev ? { ...prev, status: ReferralStatus.DECLINED, momConsent: false } : null
      );
    } catch (err) {
      console.error('Failed to decline:', err);
      setError('Failed to decline referral. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse max-w-md" />
        <Card>
          <CardContent className="pt-6">
            <div className="h-6 bg-muted rounded animate-pulse w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/2 mb-2" />
            <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !referral) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Unable to Load Referral</h2>
        <p className="text-muted-foreground mb-6">{error ?? 'Referral not found'}</p>
        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const isActionable = ['PENDING', 'MOM_CONSENTED'].includes(referral.status);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Referral Details</h1>
          <p className="text-muted-foreground">Review and respond to your care team's referral</p>
        </div>
        <StatusBadge status={referral.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary-600" />
            {referral.provider?.name ?? 'Provider'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What this means</p>
                <p>
                  Your care team has identified a provider who specializes in your needs. By
                  consenting, you allow us to share your recovery summary with this provider so they
                  can prepare for your visit.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">Referral Context</h3>
            <div className="p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
              {referral.contextSummary}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Screened & Approved Provider</span>
              </div>
              <p className="font-medium">{referral.provider?.name ?? 'Unknown Provider'}</p>
            </div>
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4" />
                <span>Information Shared</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Only your recovery summary (no PHI) will be shared with the provider upon your
                consent.
              </p>
            </div>
          </div>

          {isActionable && (
            <div className="pt-4 border-t space-y-3">
              <h3 className="font-medium">Your Response</h3>
              <p className="text-sm text-muted-foreground">
                Please let us know if you'd like to proceed with this referral.
              </p>
              <div className="flex gap-3">
                <Button onClick={handleConsent} disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? 'Processing...' : 'I Consent & Share My Summary'}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDecline}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Processing...' : 'Decline Referral'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                You can change your response later from the Referrals page.
              </p>
            </div>
          )}

          {!isActionable && (
            <div className="pt-4 border-t">
              <h3 className="font-medium">Current Status</h3>
              <div className="mt-2 p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This referral is currently{' '}
                  <span className="font-medium">
                    {referral.status.replace(/_/g, ' ').toLowerCase()}
                  </span>
                  .
                  {referral.status === 'APPOINTMENT_SCHEDULED' && (
                    <span>
                      Your appointment has been scheduled. Check with the provider for details.
                    </span>
                  )}
                  {referral.status === 'COMPLETED' && (
                    <span>
                      Your referral has been completed. Great job taking care of yourself!
                    </span>
                  )}
                  {referral.status === 'DECLINED' && (
                    <span>
                      You declined this referral. You can search for other providers anytime.
                    </span>
                  )}
                  {referral.status === 'EXPIRED' && (
                    <span>
                      This referral has expired. Please contact your care team if you need a new
                      referral.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-between">
            <Link to="/providers" className="text-primary-600 hover:underline text-sm">
              <ChevronRight className="mr-1 h-4 w-4 inline" />
              Browse All Providers
            </Link>
            <Link to="/dashboard" className="text-primary-600 hover:underline text-sm">
              Back to Dashboard
              <ChevronRight className="ml-1 h-4 w-4 inline" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {referral.status === 'MOM_CONSENTED' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Consent Recorded</p>
                <p className="text-sm">
                  Your provider has been notified and will reach out to schedule.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {referral.status === 'APPOINTMENT_SCHEDULED' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3 text-blue-800">
              <ExternalLink className="h-5 w-5" />
              <div>
                <p className="font-medium">Appointment Scheduled</p>
                <p className="text-sm">
                  Your provider has scheduled an appointment. Check your email or portal for
                  details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
