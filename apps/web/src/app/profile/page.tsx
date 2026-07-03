'use client';

import { useState } from 'react';
import { Card, CardBody, CardHeader } from '@/components/Card';
import { Button } from '@/components/Button';
import { CrisisFooter } from '@/components/CrisisFooter';
import styles from './page.module.css';

export default function ProfilePage() {
  const [notificationPref, setNotificationPref] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your profile</h1>
        <p className={styles.subtitle}>Manage your recovery preferences</p>
      </header>

      <main className={styles.main}>
        <Card className={styles.card}>
          <CardHeader>
            <h2 className={styles.sectionTitle}>Recovery snapshot</h2>
          </CardHeader>
          <CardBody>
            <div className={styles.snapshot}>
              <div className={styles.snapshotItem}>
                <span className={styles.snapshotLabel}>Days postpartum</span>
                <span className={styles.snapshotValue}>12</span>
              </div>
              <div className={styles.snapshotItem}>
                <span className={styles.snapshotLabel}>Check-ins completed</span>
                <span className={styles.snapshotValue}>7</span>
              </div>
              <div className={styles.snapshotItem}>
                <span className={styles.snapshotLabel}>Average mood</span>
                <span className={styles.snapshotValue}>3.2 / 5</span>
              </div>
              <div className={styles.snapshotItem}>
                <span className={styles.snapshotLabel}>Average sleep</span>
                <span className={styles.snapshotValue}>2.8 / 5</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className={styles.card}>
          <CardHeader>
            <h2 className={styles.sectionTitle}>Check-in reminder</h2>
          </CardHeader>
          <CardBody>
            <p className={styles.cardText}>
              Choose when you would like to receive your daily check-in reminder.
            </p>
            <div className={styles.options}>
              {(['morning', 'afternoon', 'evening'] as const).map((time) => (
                <label
                  key={time}
                  className={`${styles.option} ${notificationPref === time ? styles.optionActive : ''}`}
                >
                  <input
                    type="radio"
                    name="notificationPref"
                    value={time}
                    checked={notificationPref === time}
                    onChange={() => setNotificationPref(time)}
                    className={styles.radio}
                  />
                  <span className={styles.optionLabel}>
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className={styles.card}>
          <CardHeader>
            <h2 className={styles.sectionTitle}>Privacy &amp; data</h2>
          </CardHeader>
          <CardBody>
            <div className={styles.privacyItem}>
              <span className={styles.privacyLabel}>De-identified research opt-in</span>
              <label className={styles.toggle}>
                <input type="checkbox" defaultChecked className={styles.toggleInput} />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            <p className={styles.privacyDescription}>
              Allow your data to be used in de-identified form for postpartum
              research. Your identity is never shared.
            </p>
            <div className={styles.privacyItem}>
              <span className={styles.privacyLabel}>Share summary with provider</span>
              <label className={styles.toggle}>
                <input type="checkbox" defaultChecked className={styles.toggleInput} />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            <p className={styles.privacyDescription}>
              Generate a summary of your check-ins to bring to your next OB-GYN
              appointment.
            </p>
          </CardBody>
        </Card>

        <div className={styles.dangerZone}>
          <Button variant="danger" size="sm">
            Delete account and data
          </Button>
        </div>
      </main>

      <CrisisFooter />
    </div>
  );
}
