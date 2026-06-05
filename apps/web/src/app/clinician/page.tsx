'use client';

import { useState } from 'react';
import { Card, CardHeader, CardBody } from '@/components/Card';
import { Button } from '@/components/Button';
import styles from './page.module.css';

interface FlaggedPatient {
  id: string;
  name: string;
  daysSinceDelivery: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  lastCheckIn: string;
  consecutiveFlags: number;
}

const samplePatients: FlaggedPatient[] = [
  {
    id: '1',
    name: 'Patient A',
    daysSinceDelivery: 14,
    severity: 'high',
    symptoms: ['Sleep disruption', 'Persistent sadness', 'Loss of appetite'],
    lastCheckIn: '2h ago',
    consecutiveFlags: 5,
  },
  {
    id: '2',
    name: 'Patient B',
    daysSinceDelivery: 8,
    severity: 'medium',
    symptoms: ['Sleep disruption', 'Anxiety'],
    lastCheckIn: '5h ago',
    consecutiveFlags: 3,
  },
  {
    id: '3',
    name: 'Patient C',
    daysSinceDelivery: 21,
    severity: 'critical',
    symptoms: ['Sleep disruption', 'Sadness', 'Hopelessness', 'Withdrawal'],
    lastCheckIn: '1h ago',
    consecutiveFlags: 7,
  },
];

const severityStyles = {
  low: styles.low,
  medium: styles.medium,
  high: styles.high,
  critical: styles.critical,
};

export default function ClinicianPage() {
  const [patients] = useState(samplePatients);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Clinician Dashboard</h1>
          <p className={styles.subtitle}>Flagged patient escalations requiring review</p>
        </div>
        <Button variant="secondary" size="sm">Export report</Button>
      </header>

      <div className={styles.summary}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{patients.length}</span>
          <span className={styles.statLabel}>Flagged patients</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {patients.filter((p) => p.severity === 'critical' || p.severity === 'high').length}
          </span>
          <span className={styles.statLabel}>Needs attention</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {patients.filter((p) => p.consecutiveFlags >= 5).length}
          </span>
          <span className={styles.statLabel}>5+ day flags</span>
        </div>
      </div>

      <div className={styles.patientList}>
        {patients.map((patient) => (
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
                      Day {patient.daysSinceDelivery} postpartum &middot; {patient.lastCheckIn}
                    </span>
                  </div>
                  <span className={`${styles.severity} ${severityStyles[patient.severity]}`}>
                    {patient.severity}
                  </span>
                </div>
              </CardHeader>
            </button>

            {selectedPatient === patient.id && (
              <CardBody>
                <div className={styles.details}>
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
                    <Button variant="primary" size="sm">Review full history</Button>
                    <Button variant="secondary" size="sm">Mark as reviewed</Button>
                    <Button variant="ghost" size="sm">Refer to provider</Button>
                  </div>
                </div>
              </CardBody>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}
