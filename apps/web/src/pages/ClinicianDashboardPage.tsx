import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { clinicianApi } from '@/lib/api';
import { cn, formatRelativeTime, getRiskColor } from '@/lib/utils';
import type { ClinicianPatientSummary, Escalation } from '@firstweeks/shared';
import { AlertTriangle, ChevronRight, Clock, Heart, Stethoscope, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Badge = ({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  className?: string;
}) => {
  const variants = {
    default: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    destructive: 'bg-red-100 text-red-800',
    outline: 'border border-gray-300 bg-transparent',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export function ClinicianDashboardPage() {
  const [patients, setPatients] = useState<ClinicianPatientSummary[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [patientsData, escalationsData] = await Promise.all([
        clinicianApi.getPatients(),
        clinicianApi.getEscalations(),
      ]);
      setPatients(patientsData);
      setEscalations(escalationsData);
    } catch (err) {
      console.error('Failed to load clinician data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const riskCounts = patients.reduce(
    (acc, p) => {
      acc[p.riskLevel] = (acc[p.riskLevel] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-4">
          <div className="h-24 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
          <div className="h-24 bg-muted rounded animate-pulse" />
        </div>
        <div className="h-60 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Stethoscope className="h-6 w-6" />
            Clinician Dashboard
          </h1>
          <p className="text-muted-foreground">
            {patients.length} patients • {escalations.length} active escalations
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-3xl font-bold">{patients.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Escalations</p>
                <p className="text-3xl font-bold text-red-600">{escalations.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High/Critical Risk</p>
                <p className="text-3xl font-bold text-orange-600">
                  {(riskCounts.high || 0) + (riskCounts.critical || 0)}
                </p>
              </div>
              <Heart className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Referrals</p>
                <p className="text-3xl font-bold text-amber-600">
                  {patients.reduce((sum, p) => sum + p.referralCount, 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Escalation Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {escalations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active escalations</p>
            ) : (
              <div className="space-y-3">
                {escalations.map((esc) => (
                  <Link
                    key={esc.id}
                    to={`/clinician/patient/${esc.userId}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'p-2 rounded-lg',
                          getRiskColor(
                            esc.severity.toLowerCase() as 'low' | 'medium' | 'high' | 'critical'
                          )
                        )}
                      >
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{esc.userEmail}</p>
                        <p className="text-sm text-muted-foreground">
                          {esc.trigger} • {formatRelativeTime(esc.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          esc.severity === 'CRITICAL'
                            ? 'destructive'
                            : esc.severity === 'HIGH'
                              ? 'warning'
                              : 'default'
                        }
                      >
                        {esc.severity}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Patient Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {patients.slice(0, 10).map((patient) => (
                <Link
                  key={patient.userId}
                  to={`/clinician/patient/${patient.userId}`}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg', getRiskColor(patient.riskLevel))}>
                      <Heart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Week {patient.weeksPostpartum} • {patient.activeEscalationCount} escalations
                        • {patient.referralCount} referrals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        patient.riskLevel === 'critical'
                          ? 'destructive'
                          : patient.riskLevel === 'high'
                            ? 'warning'
                            : patient.riskLevel === 'medium'
                              ? 'secondary'
                              : 'success'
                      }
                    >
                      {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
              {patients.length > 10 && (
                <Link
                  to="/clinician/patients"
                  className="block text-center py-2 text-sm text-primary-600 hover:underline"
                >
                  View all {patients.length} patients
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
