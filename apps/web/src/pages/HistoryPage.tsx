import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { checkinApi } from '@/lib/api';
import { cn, formatRelativeTime, getRiskColor } from '@/lib/utils';
import type { CheckIn, CheckInTrends } from '@firstweeks/shared';
import { Activity, Brain, Calendar, ChevronDown, ChevronUp, Heart, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HistoryPage() {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [trends, setTrends] = useState<CheckInTrends | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [checkInsData, trendsData] = await Promise.all([
        checkinApi.list(1, 50),
        checkinApi.getTrends(30),
      ]);
      setCheckIns(checkInsData);
      setTrends(trendsData);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded animate-pulse" />
        <div className="h-40 bg-muted rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-muted-foreground">Track your recovery over time</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">Check-ins</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {checkIns.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  No check-ins yet. Complete your first daily check-in to start tracking.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {checkIns.map((checkIn) => (
                <Card
                  key={checkIn.id}
                  className={expandedIds.has(checkIn.id) ? 'border-primary-200' : ''}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-lg',
                            getRiskColor(
                              checkIn.sleepDisruption && checkIn.sleepDisruption >= 4
                                ? 'high'
                                : checkIn.sadness && checkIn.sadness >= 4
                                  ? 'high'
                                  : 'low'
                            )
                          )}
                        >
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{formatRelativeTime(checkIn.date)}</p>
                          <p className="text-sm text-muted-foreground">{checkIn.date}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(checkIn.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {expandedIds.has(checkIn.id) ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {expandedIds.has(checkIn.id) && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {checkIn.sleepHours !== null && checkIn.sleepHours !== undefined && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Sleep Hours</p>
                            <p className="font-medium flex items-center gap-1">
                              {checkIn.sleepHours}h <Moon className="h-3 w-3" />
                            </p>
                          </div>
                        )}
                        {checkIn.sleepDisruption !== null &&
                          checkIn.sleepDisruption !== undefined && (
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Sleep Disruption</p>
                              <p className="font-medium flex items-center gap-1">
                                {checkIn.sleepDisruption}/5 <Moon className="h-3 w-3" />
                              </p>
                            </div>
                          )}
                        {checkIn.sadness !== null && checkIn.sadness !== undefined && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Sadness</p>
                            <p className="font-medium flex items-center gap-1">
                              {checkIn.sadness}/5 <Heart className="h-3 w-3" />
                            </p>
                          </div>
                        )}
                        {checkIn.anxiety !== null && checkIn.anxiety !== undefined && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Anxiety</p>
                            <p className="font-medium flex items-center gap-1">
                              {checkIn.anxiety}/5 <Brain className="h-3 w-3" />
                            </p>
                          </div>
                        )}
                        {checkIn.painLevel !== null && checkIn.painLevel !== undefined && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Pain Level</p>
                            <p className="font-medium flex items-center gap-1">
                              {checkIn.painLevel}/10 <Activity className="h-3 w-3" />
                            </p>
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
                        {checkIn.feedingIssues && (
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Feeding Issues</p>
                            <p className="font-medium text-amber-600">Yes</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {trends ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>30-Day Trends</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Sleep Hours</p>
                      <span
                        className={cn(
                          'font-medium',
                          trends.sleepHours.trend === 'improving'
                            ? 'text-green-600'
                            : trends.sleepHours.trend === 'worsening'
                              ? 'text-red-600'
                              : ''
                        )}
                      >
                        {trends.sleepHours.avg.toFixed(1)}h
                      </span>
                    </div>
                    <Progress
                      value={Math.min((trends.sleepHours.avg / 10) * 100, 100)}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground capitalize">
                      {trends.sleepHours.trend}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Mood (Sadness)</p>
                      <span
                        className={cn(
                          'font-medium',
                          trends.mood.trend === 'improving'
                            ? 'text-green-600'
                            : trends.mood.trend === 'worsening'
                              ? 'text-red-600'
                              : ''
                        )}
                      >
                        {trends.mood.avgSadness.toFixed(1)}/5
                      </span>
                    </div>
                    <Progress value={(trends.mood.avgSadness / 5) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground capitalize">{trends.mood.trend}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Pain Level</p>
                      <span
                        className={cn(
                          'font-medium',
                          trends.pain.trend === 'improving'
                            ? 'text-green-600'
                            : trends.pain.trend === 'worsening'
                              ? 'text-red-600'
                              : ''
                        )}
                      >
                        {trends.pain.avgLevel.toFixed(1)}/10
                      </span>
                    </div>
                    <Progress value={(trends.pain.avgLevel / 10) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground capitalize">{trends.pain.trend}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Escalation Risk</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={cn(
                      'p-4 rounded-lg text-center',
                      getRiskColor(trends.escalationRisk.riskLevel)
                    )}
                  >
                    <p className="text-sm text-muted-foreground">Current Risk Level</p>
                    <p className="text-2xl font-bold capitalize">
                      {trends.escalationRisk.riskLevel}
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Consecutive Sleep Disruption Days
                      </p>
                      <p className="text-3xl font-bold">
                        {trends.escalationRisk.consecutiveSleepDisruptionDays}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Consecutive Sadness Days</p>
                      <p className="text-3xl font-bold">
                        {trends.escalationRisk.consecutiveSadnessDays}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Complete more check-ins to see trends.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
