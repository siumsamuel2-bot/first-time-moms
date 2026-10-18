import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { type Referral, referralApi } from '@/lib/api';
import { ChevronRight, Clock, Heart, Shield, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

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
    PENDING: 'Awaiting Response',
    MOM_CONSENTED: 'Consented',
    PROVIDER_NOTIFIED: 'Provider Notified',
    APPOINTMENT_SCHEDULED: 'Appointment Set',
    COMPLETED: 'Completed',
    DECLINED: 'Declined',
    EXPIRED: 'Expired',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[status] ?? 'bg-gray-100 text-gray-800'}`}
    >
      {labels[status] ?? status}
    </span>
  );
};

export function ReferralsListPage() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    setIsLoading(true);
    try {
      const data = await referralApi.getMyReferrals();
      setReferrals(data);
    } catch (err) {
      console.error('Failed to load referrals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse max-w-md" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-6 bg-muted rounded animate-pulse w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const pendingReferrals = referrals.filter((r) => ['PENDING', 'MOM_CONSENTED'].includes(r.status));
  const activeReferrals = referrals.filter((r) =>
    ['PROVIDER_NOTIFIED', 'APPOINTMENT_SCHEDULED'].includes(r.status)
  );
  const completedReferrals = referrals.filter((r) =>
    ['COMPLETED', 'DECLINED', 'EXPIRED'].includes(r.status)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Referrals</h1>
        <p className="text-muted-foreground">Track and manage referrals from your care team</p>
      </div>

      <div className="flex gap-3">
        <Link to="/providers">
          <Button variant="outline">
            <Shield className="mr-2 h-4 w-4" />
            Find More Providers
          </Button>
        </Link>
      </div>

      {pendingReferrals.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            Needs Your Action ({pendingReferrals.length})
          </h2>
          <div className="space-y-3">
            {pendingReferrals.map((ref) => (
              <Card key={ref.id} className="border-yellow-200">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{ref.provider?.name ?? 'Provider'}</h3>
                        <StatusBadge status={ref.status} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{ref.contextSummary}</p>
                      <div className="flex gap-3">
                        <Link to={`/referrals/${ref.id}`}>
                          <Button className="flex-1">Review & Respond</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {activeReferrals.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-600" />
            In Progress ({activeReferrals.length})
          </h2>
          <div className="space-y-3">
            {activeReferrals.map((ref) => (
              <Card key={ref.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{ref.provider?.name ?? 'Provider'}</h3>
                        <StatusBadge status={ref.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{ref.contextSummary}</p>
                    </div>
                    <Link to={`/referrals/${ref.id}`}>
                      <Button variant="outline">View Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {completedReferrals.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-medium flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-500" />
            Past Referrals ({completedReferrals.length})
          </h2>
          <div className="space-y-3">
            {completedReferrals.map((ref) => (
              <Card key={ref.id} className="border-gray-100">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{ref.provider?.name ?? 'Provider'}</h3>
                        <StatusBadge status={ref.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">{ref.contextSummary}</p>
                    </div>
                    <Link to={`/referrals/${ref.id}`}>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {referrals.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No referrals yet</h3>
            <p className="text-muted-foreground mb-6">
              Your care team will create referrals when they identify providers matching your needs.
            </p>
            <Link to="/providers">
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Browse Providers
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
