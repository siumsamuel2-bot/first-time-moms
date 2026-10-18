import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { type PatientDetail, clinicianApi } from '@/lib/api';
import { cn, formatRelativeTime, getRiskColor } from '@/lib/utils';
import type { CheckIn, ClinicalNote, Escalation, Referral } from '@firstweeks/shared';
import { AlertTriangle, CheckCircle, ChevronRight, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

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

const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
);

export function ClinicianPatientPage() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [noteContent, setNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    if (id) loadPatient();
  }, [id]);

  const loadPatient = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await clinicianApi.getPatient(id);
      setPatient(data);
    } catch (err) {
      console.error('Failed to load patient:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!id || !noteContent.trim()) return;
    try {
      await clinicianApi.addNote(id, noteContent);
      setNoteContent('');
      setIsAddingNote(false);
      loadPatient();
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleEscalationUpdate = async (escalationId: string, status: string) => {
    try {
      await clinicianApi.updateEscalation(escalationId, { status });
      loadPatient();
    } catch (err) {
      console.error('Failed to update escalation:', err);
    }
  };

  const handleReferralUpdate = async (referralId: string, status: string) => {
    try {
      await clinicianApi.updateReferral(referralId, status);
      loadPatient();
    } catch (err) {
      console.error('Failed to update referral:', err);
    }
  };

  if (isLoading) {
    return <div className="h-60 bg-muted rounded animate-pulse" />;
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Patient not found</p>
        <Link to="/clinician" className="text-primary-600 hover:underline mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const user = patient.user;
  const onboarding = patient.onboarding;
  const checkIns = patient.recentCheckIns;
  const escalations = patient.escalations;
  const referrals = patient.referrals;
  const notes = patient.clinicalNotes;

  const weeksPostpartum = onboarding
    ? Math.floor(
        (Date.now() - new Date(onboarding.deliveryDate).getTime()) / (7 * 24 * 60 * 60 * 1000)
      )
    : 0;

  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (escalations.some((e: Escalation) => e.severity === 'CRITICAL')) riskLevel = 'critical';
  else if (escalations.some((e: Escalation) => e.severity === 'HIGH')) riskLevel = 'high';
  else if (escalations.some((e: Escalation) => e.severity === 'MEDIUM')) riskLevel = 'medium';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/clinician" className="text-muted-foreground hover:text-foreground">
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {user.email}
              <Badge
                variant={
                  riskLevel === 'critical'
                    ? 'destructive'
                    : riskLevel === 'high'
                      ? 'warning'
                      : riskLevel === 'medium'
                        ? 'secondary'
                        : 'success'
                }
              >
                {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Week {weeksPostpartum} postpartum •{' '}
              {onboarding?.deliveryType?.replace('_', ' ') ?? ''} •{' '}
              {(onboarding?.feedingMethod?.charAt(0) ?? '') +
                (onboarding?.feedingMethod?.slice(1).toLowerCase() ?? '')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveTab('notes')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Note
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="checkins">Check-ins</TabsTrigger>
          <TabsTrigger value="escalations">Escalations ({escalations.length})</TabsTrigger>
          <TabsTrigger value="referrals">Referrals ({referrals.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Escalations</p>
                <p className="text-3xl font-bold">
                  {
                    escalations.filter(
                      (e: Escalation) => e.status !== 'RESOLVED' && e.status !== 'FALSE_POSITIVE'
                    ).length
                  }
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Referrals</p>
                <p className="text-3xl font-bold">{referrals.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Clinical Notes</p>
                <p className="text-3xl font-bold">{notes.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Last Check-in</p>
                <p className="text-3xl font-bold">
                  {checkIns[0] ? formatRelativeTime(checkIns[0].date) : 'Never'}
                </p>
              </CardContent>
            </Card>
          </div>

          {onboarding && (
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p>{onboarding.deliveryDate.split('T')[0]}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Delivery Type</p>
                  <p className="capitalize">{onboarding.deliveryType?.replace('_', ' ')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Feeding Method</p>
                  <p className="capitalize">
                    {onboarding.feedingMethod?.charAt(0) +
                      onboarding.feedingMethod?.slice(1).toLowerCase()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">PHQ-2 Score</p>
                  <p>{onboarding.mentalHealthBaseline?.phq2Score}/6</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">GAD-2 Score</p>
                  <p>{onboarding.mentalHealthBaseline?.gad2Score}/6</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">EPDS Score</p>
                  <p>{onboarding.mentalHealthBaseline?.epdsScore ?? 'Not provided'}/30</p>
                </div>
                {onboarding.complications.length > 0 && (
                  <div className="md:col-span-3 space-y-1">
                    <p className="text-sm text-muted-foreground">Complications</p>
                    <div className="flex flex-wrap gap-2">
                      {onboarding.complications.map((c: string) => (
                        <Badge key={c} variant="secondary">
                          {c.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="checkins" className="space-y-4">
          {checkIns.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No check-ins yet</p>
          ) : (
            <div className="space-y-3">
              {checkIns.map((checkIn: CheckIn) => (
                <Card key={checkIn.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {formatRelativeTime(checkIn.date)} ({checkIn.date})
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                      {checkIn.sleepHours !== null && checkIn.sleepHours !== undefined && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Sleep</p>
                          <p className="font-medium">{checkIn.sleepHours}h</p>
                        </div>
                      )}
                      {checkIn.sleepDisruption !== null &&
                        checkIn.sleepDisruption !== undefined && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Disruption</p>
                            <p className="font-medium">{checkIn.sleepDisruption}/5</p>
                          </div>
                        )}
                      {checkIn.sadness !== null && checkIn.sadness !== undefined && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Sadness</p>
                          <p className="font-medium">{checkIn.sadness}/5</p>
                        </div>
                      )}
                      {checkIn.anxiety !== null && checkIn.anxiety !== undefined && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Anxiety</p>
                          <p className="font-medium">{checkIn.anxiety}/5</p>
                        </div>
                      )}
                      {checkIn.painLevel !== null && checkIn.painLevel !== undefined && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Pain</p>
                          <p className="font-medium">{checkIn.painLevel}/10</p>
                        </div>
                      )}
                      {checkIn.bleeding && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Bleeding</p>
                          <p className="font-medium capitalize">
                            {checkIn.bleeding.toLowerCase().replace('_', ' ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="escalations" className="space-y-4">
          {escalations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No escalations</p>
          ) : (
            <div className="space-y-3">
              {escalations.map((esc: Escalation) => (
                <Card
                  key={esc.id}
                  className={
                    esc.severity === 'CRITICAL'
                      ? 'border-red-200'
                      : esc.severity === 'HIGH'
                        ? 'border-amber-200'
                        : ''
                  }
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
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
                          <p className="font-medium">{esc.trigger.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatRelativeTime(esc.createdAt)} • {esc.contextSummary}
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
                        <Badge
                          variant={
                            esc.status === 'PENDING'
                              ? 'secondary'
                              : esc.status === 'TRIAGED'
                                ? 'default'
                                : esc.status === 'REFERRED'
                                  ? 'success'
                                  : 'outline'
                          }
                        >
                          {esc.status}
                        </Badge>
                        {esc.status === 'PENDING' && (
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={esc.status}
                            onChange={(e) => handleEscalationUpdate(esc.id, e.target.value)}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="TRIAGED">Triaged</option>
                            <option value="REFERRED">Referred</option>
                            <option value="FALSE_POSITIVE">False Positive</option>
                          </select>
                        )}
                        {esc.status === 'TRIAGED' && (
                          <select
                            className="border rounded px-2 py-1 text-sm"
                            value={esc.status}
                            onChange={(e) => handleEscalationUpdate(esc.id, e.target.value)}
                          >
                            <option value="TRIAGED">Triaged</option>
                            <option value="REFERRED">Refer</option>
                            <option value="RESOLVED">Resolve</option>
                          </select>
                        )}
                      </div>
                    </div>
                    {esc.referral && (
                      <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium">
                          Referral created: {esc.referral.provider?.name ?? 'Unknown Provider'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Status: {esc.referral.status}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          {referrals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No referrals</p>
          ) : (
            <div className="space-y-3">
              {referrals.map((ref: Referral) => (
                <Card key={ref.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{ref.provider?.name ?? 'Unknown Provider'}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatRelativeTime(ref.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            ref.status === 'COMPLETED'
                              ? 'success'
                              : ref.status === 'PENDING'
                                ? 'secondary'
                                : 'default'
                          }
                        >
                          {ref.status}
                        </Badge>
                        {ref.status !== 'COMPLETED' &&
                          ref.status !== 'DECLINED' &&
                          ref.status !== 'EXPIRED' && (
                            <select
                              className="border rounded px-2 py-1 text-sm"
                              value={ref.status}
                              onChange={(e) => handleReferralUpdate(ref.id, e.target.value)}
                            >
                              <option value="PENDING">Pending</option>
                              <option value="MOM_CONSENTED">Mom Consented</option>
                              <option value="PROVIDER_NOTIFIED">Provider Notified</option>
                              <option value="APPOINTMENT_SCHEDULED">Appointment Scheduled</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="DECLINED">Declined</option>
                            </select>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Clinical Notes</h3>
            {isAddingNote && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingNote(false);
                    setNoteContent('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {isAddingNote ? (
            <Card>
              <CardContent className="pt-4">
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Enter clinical note..."
                  className="min-h-[120px]"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNoteContent('');
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddNote} disabled={!noteContent.trim()}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button variant="outline" onClick={() => setIsAddingNote(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          )}

          {notes.length === 0 && !isAddingNote ? (
            <p className="text-center text-muted-foreground py-8">No clinical notes yet</p>
          ) : (
            <div className="space-y-3">
              {notes.map((note: ClinicalNote) => (
                <Card key={note.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          By clinician {note.clinicianId} • {formatRelativeTime(note.createdAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
