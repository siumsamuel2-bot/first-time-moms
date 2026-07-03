'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { Button } from '@/components/Button';
import styles from './page.module.css';

interface CheckInEntry {
  date: string;
  sleep: string;
  mood: string;
  pain: number;
  comment?: string;
}

interface FlaggedPatient {
  id: string;
  name: string;
  age: number;
  deliveryType: string;
  daysSinceDelivery: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  lastCheckIn: string;
  lastCheckInTime: string;
  consecutiveFlags: number;
  epdsBaseline?: number;
  feedingMethod?: string;
  notes?: string;
  history?: CheckInEntry[];
  status: 'pending' | 'reviewed' | 'resolved';
}

interface AlertData {
  id: string;
  patientId: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  durationDays: number;
  flaggedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

function mockPatientsFromAlerts(alerts: AlertData[]): FlaggedPatient[] {
  const names = [
    { name: 'Maya Chen', age: 31 },
    { name: 'Jessica Torres', age: 28 },
    { name: 'Rachel Kim', age: 34 },
    { name: 'Aisha Johnson', age: 29 },
    { name: 'Priya Patel', age: 32 },
  ];
  const deliveries = ['Vaginal', 'C-section', 'Emergency C-section', 'Vaginal (induced)'];
  const feeding = ['Breast', 'Formula', 'Mixed'];

  return alerts.map((alert, i) => {
    const n = names[i % names.length];
    return {
      id: alert.id,
      name: n!.name,
      age: n!.age,
      deliveryType: deliveries[i % deliveries.length]!,
      daysSinceDelivery: alert.durationDays + Math.floor(Math.random() * 5),
      severity: alert.severity,
      symptoms: alert.symptoms,
      lastCheckIn: `Day ${alert.durationDays + 3}`,
      lastCheckInTime: new Date(Date.now() - Math.floor(Math.random() * 8) * 3600 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      consecutiveFlags: alert.durationDays,
      epdsBaseline: 10 + (i % 3) * 3,
      feedingMethod: feeding[i % feeding.length],
      notes: i === 0 ? 'Trend worsening over 3+ days' : undefined,
      history: [
        { date: 'Today', sleep: '2.5 hours interrupted', mood: 'less than before / often anxious', pain: 6, comment: 'I feel like I am failing at this' },
        { date: 'Yesterday', sleep: '2 hours interrupted', mood: 'much less than before / very often', pain: 5 },
      ],
      status: alert.status as 'pending' | 'reviewed' | 'resolved',
    };
  });
}

const severitySort = { critical: 0, high: 1, medium: 2, low: 3 };
const severityStyles: Record<FlaggedPatient['severity'], string> = {
  low: styles.low!,
  medium: styles.medium!,
  high: styles.high!,
  critical: styles.critical!,
};

function RiskBadge({ severity }: { severity: FlaggedPatient['severity'] }) {
  return (
    <span className={`${styles.severity} ${severityStyles[severity]}`}>
      {severity === 'critical' ? 'Critical' : severity === 'high' ? 'High' : severity === 'medium' ? 'Med' : 'Low'}
    </span>
  );
}

function sortPatients(list: FlaggedPatient[], sortBy: 'severity' | 'name' | 'days') {
  const s = [...list];
  switch (sortBy) {
    case 'severity':
      s.sort((a, b) => severitySort[a.severity] - severitySort[b.severity]);
      break;
    case 'name':
      s.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'days':
      s.sort((a, b) => b.daysSinceDelivery - a.daysSinceDelivery);
      break;
  }
  return s;
}

export default function ClinicianPage() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'severity' | 'name' | 'days'>('severity');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewed' | 'resolved'>('all');
  const [actioning, setActioning] = useState<string | null>(null);
  const [referralModal, setReferralModal] = useState<{ open: boolean; patientId?: string }>({ open: false });
  const [messageModal, setMessageModal] = useState<{ open: boolean; patientId?: string }>({ open: false });

  useEffect(() => {
    fetch('/api/escalations')
      .then((r) => r.json())
      .then((data) => {
        const mapped = (data.alerts as AlertData[]) ?? [];
        setAlerts(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const patients = useMemo(() => mockPatientsFromAlerts(alerts), [alerts]);

  const filtered = useMemo(() => {
    let list = [...patients];
    if (statusFilter !== 'all') {
      list = list.filter((p) => p.status === statusFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return sortPatients(list, sortBy);
  }, [patients, statusFilter, search, sortBy]);

  const stats = useMemo(() => {
    const total = patients.length;
    const needsAttention = patients.filter((p) => p.severity === 'critical' || p.severity === 'high').length;
    const fiveDayFlags = patients.filter((p) => p.consecutiveFlags >= 5).length;
    return { total, needsAttention, fiveDayFlags };
  }, [patients]);

  const handleMarkReviewed = useCallback(async (patientId: string) => {
    setActioning(patientId);
    try {
      await fetch('/api/escalations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: patientId, action: 'resolve', notes: 'Marked as reviewed by clinician' }),
      });
      setAlerts((prev) => prev.map((a) => (a.id === patientId ? { ...a, status: 'resolved' as const } : a)));
      setSelectedPatient(null);
    } finally {
      setActioning(null);
    }
  }, []);

  const handleEscalate = useCallback(async (patientId: string) => {
    setActioning(patientId);
    try {
      await fetch('/api/escalations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: patientId, action: 'escalate', notes: 'Escalated to specialist' }),
      });
      setAlerts((prev) => prev.map((a) => (a.id === patientId ? { ...a, status: 'reviewed' as const } : a)));
      setSelectedPatient(null);
    } finally {
      setActioning(null);
    }
  }, []);

  const selected = patients.find((p) => p.id === selectedPatient);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Clinician Dashboard</h1>
          <p className={styles.subtitle}>Flagged patient escalations requiring review</p>
        </div>
        <div className={styles.headerActions}>
          <Button variant="secondary" size="sm">Export report</Button>
        </div>
      </header>

      <div className={styles.summary}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.total}</span>
          <span className={styles.statLabel}>Flagged patients</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.needsAttention}</span>
          <span className={styles.statLabel}>Needs attention</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{stats.fiveDayFlags}</span>
          <span className={styles.statLabel}>5+ day flags</span>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.searchInput}
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'severity' | 'name' | 'days')}
        >
          <option value="severity">Sort by Severity</option>
          <option value="name">Sort by Name</option>
          <option value="days">Sort by Days Postpartum</option>
        </select>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {loading && <p className={styles.emptyState}>Loading...</p>}
      {!loading && filtered.length === 0 && <p className={styles.emptyState}>No patients match your filters.</p>}

      <div className={styles.patientList}>
        {filtered.map((patient) => (
          <Card
            key={patient.id}
            variant={selectedPatient === patient.id ? 'elevated' : 'default'}
            className={styles.patientCard}
          >
            <button
              type="button"
              className={styles.patientButton}
              onClick={() => setSelectedPatient(selectedPatient === patient.id ? null : patient.id)}
            >
              <CardHeader>
                <div className={styles.patientHeader}>
                  <div className={styles.patientInfo}>
                    <h3 className={styles.patientName}>{patient.name}</h3>
                    <span className={styles.patientMeta}>
                      Day {patient.daysSinceDelivery} postpartum &middot; {patient.lastCheckInTime}
                    </span>
                  </div>
                  <RiskBadge severity={patient.severity} />
                </div>
              </CardHeader>
            </button>

            {selectedPatient === patient.id && (
              <CardBody>
                <div className={styles.details}>
                  <div className={styles.profileGrid}>
                    <div className={styles.profileItem}>
                      <span className={styles.profileLabel}>Delivery</span>
                      <span className={styles.profileValue}>{patient.deliveryType}</span>
                    </div>
                    <div className={styles.profileItem}>
                      <span className={styles.profileLabel}>PP Day</span>
                      <span className={styles.profileValue}>{patient.daysSinceDelivery}</span>
                    </div>
                    <div className={styles.profileItem}>
                      <span className={styles.profileLabel}>Feeding</span>
                      <span className={styles.profileValue}>{patient.feedingMethod}</span>
                    </div>
                    <div className={styles.profileItem}>
                      <span className={styles.profileLabel}>EPDS Baseline</span>
                      <span className={styles.profileValue}>{patient.epdsBaseline}/30</span>
                    </div>
                  </div>

                  {patient.history && patient.history.length > 0 && (
                    <div className={styles.historySection}>
                      <h4 className={styles.sectionTitle}>Recent Check-ins</h4>
                      {patient.history.map((entry, idx) => (
                        <div key={idx} className={styles.historyEntry}>
                          <div className={styles.historyDate}>{entry.date}</div>
                          <div className={styles.historyBody}>
                            <div className={styles.historyRow}>
                              <span className={styles.historyLabel}>Sleep:</span>
                              <span>{entry.sleep}</span>
                            </div>
                            <div className={styles.historyRow}>
                              <span className={styles.historyLabel}>Mood:</span>
                              <span>{entry.mood}</span>
                            </div>
                            <div className={styles.historyRow}>
                              <span className={styles.historyLabel}>Pain:</span>
                              <span>{entry.pain}/10</span>
                            </div>
                            {entry.comment && (
                              <div className={styles.historyRow}>
                                <span className={styles.historyLabel}>Comment:</span>
                                <span className={styles.historyComment}>"{entry.comment}"</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Consecutive flags</span>
                    <span className={styles.detailValue}>{patient.consecutiveFlags} days</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Reported symptoms</span>
                    <span className={styles.detailValue}>
                      <div className={styles.symptomList}>
                        {patient.symptoms.map((s, i) => (
                          <span key={i} className={styles.symptom}>{s}</span>
                        ))}
                      </div>
                    </span>
                  </div>
                  <div className={styles.actions}>
                    <Button variant="primary" size="sm" onClick={() => setMessageModal({ open: true, patientId: patient.id })}>Send in-app message</Button>
                    <Button variant="secondary" size="sm" disabled={actioning === patient.id} onClick={() => handleMarkReviewed(patient.id)}>Mark as reviewed</Button>
                    <Button variant="ghost" size="sm" onClick={() => setReferralModal({ open: true, patientId: patient.id })}>Send warm referral</Button>
                    <Button variant="ghost" size="sm" disabled={actioning === patient.id} onClick={() => handleEscalate(patient.id)}>Escalate to specialist</Button>
                  </div>
                </div>
              </CardBody>
            )}
          </Card>
        ))}
      </div>

      {referralModal.open && selected && (
        <div className={styles.modalOverlay} onClick={() => setReferralModal({ open: false })}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Send Warm Referral</h3>
              <button className={styles.modalClose} onClick={() => setReferralModal({ open: false })}>×</button>
            </div>
            <p className={styles.modalBody}>Referral workflow for {selected.name} will be implemented in follow-up.</p>
            <div className={styles.modalActions}>
              <Button variant="secondary" size="sm" onClick={() => setReferralModal({ open: false })}>Close</Button>
              <Button variant="primary" size="sm" onClick={() => setReferralModal({ open: false })}>Confirm Referral</Button>
            </div>
          </div>
        </div>
      )}

      {messageModal.open && selected && (
        <div className={styles.modalOverlay} onClick={() => setMessageModal({ open: false })}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Message {selected.name}</h3>
              <button className={styles.modalClose} onClick={() => setMessageModal({ open: false })}>×</button>
            </div>
            <div className={styles.modalBody}>
              <textarea className={styles.messageTextarea} placeholder="Type your message..." rows={4} />
            </div>
            <div className={styles.modalActions}>
              <Button variant="secondary" size="sm" onClick={() => setMessageModal({ open: false })}>Cancel</Button>
              <Button variant="primary" size="sm" onClick={() => setMessageModal({ open: false })}>Send</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
