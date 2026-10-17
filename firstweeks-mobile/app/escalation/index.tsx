import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertBanner, escalationColors } from '../../components/escalation';

const MOCK_NAME = 'Maya';

type EscalationTier = 'none' | 'mild' | 'moderate' | 'significant';

export default function EscalationDashboard() {
  const router = useRouter();
  const [currentTier, setCurrentTier] = useState<EscalationTier>('mild');
  const [dotTapped, setDotTapped] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const config = {
    none: { dot: false },
    mild: { dot: true },
    moderate: { dot: true },
    significant: { dot: true },
  }[currentTier];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {MOCK_NAME}</Text>
          <Text style={styles.subtitle}>Here's your daily overview</Text>
        </View>

        <View style={styles.checkinCard}>
          <View style={styles.checkinHeader}>
            <Text style={styles.checkinTitle}>Your Daily Check-In</Text>
            {config.dot && !dotTapped && (
              <TouchableOpacity
                style={styles.ambientDot}
                onPress={() => setDotTapped(true)}
                accessibilityLabel="Notification dot"
              >
                <View style={styles.ambientDotInner} />
              </TouchableOpacity>
            )}
          </View>

          {dotTapped && currentTier !== 'none' && (
            <View style={styles.tooltipCard}>
              <Text style={styles.tooltipText}>
                We're noticing a pattern — no action needed right now.
              </Text>
              <TouchableOpacity onPress={() => setDotTapped(false)}>
                <Text style={styles.tooltipDismiss}>Got it</Text>
              </TouchableOpacity>
            </View>
          )}

          {!dotTapped && (
            <Text style={styles.checkinStatus}>
              {currentTier === 'none'
                ? "You're all caught up for today!"
                : 'Next check-in: Tomorrow at 10 AM'}
            </Text>
          )}

          <TouchableOpacity
            style={styles.checkinBtn}
            onPress={() => router.push('/escalation/nudge')}
          >
            <Text style={styles.checkinBtnText}>
              {currentTier === 'none' ? 'Check in now' : 'Check in now →'}
            </Text>
          </TouchableOpacity>
        </View>

        {!bannerDismissed && currentTier === 'mild' && (
          <AlertBanner
            tier="mild"
            headline="A couple of tough days — that's normal"
            body="We've noticed you've had some rough days. Many new moms go through this."
            ctaLabel="Check in"
            onCtaPress={() => router.push('/escalation/nudge')}
            onDismiss={() => setBannerDismissed(true)}
          />
        )}

        {!bannerDismissed && currentTier === 'moderate' && (
          <AlertBanner
            tier="moderate"
            headline="We've noticed a pattern worth checking"
            body="The last few days have been tougher. Want to check in together?"
            ctaLabel="Let's check in"
            onCtaPress={() => router.push('/escalation/nudge')}
            onDismiss={() => setBannerDismissed(true)}
            secondaryLabel="Not right now"
            onSecondaryPress={() => setBannerDismissed(true)}
          />
        )}

        {!bannerDismissed && currentTier === 'significant' && (
          <AlertBanner
            tier="significant"
            headline="You've been having a really tough week"
            body="We're here for you. Would you like to talk with someone who can help?"
            ctaLabel="Talk to someone who can help"
            onCtaPress={() => router.push('/escalation/consent')}
            onDismiss={() => setBannerDismissed(true)}
            secondaryLabel="I'll think about it"
            onSecondaryPress={() => setBannerDismissed(true)}
            showClinicianNote
          />
        )}

        <TouchableOpacity
          style={styles.getSupportBtn}
          onPress={() => router.push('/escalation/reflection')}
        >
          <Text style={styles.getSupportBtnText}>💬 Get Support</Text>
        </TouchableOpacity>

        <View style={styles.tierSwitcher}>
          <Text style={styles.tierSwitcherLabel}>Simulate escalation level:</Text>
          <View style={styles.tierRow}>
            {(['none', 'mild', 'moderate', 'significant'] as EscalationTier[]).map((tier) => (
              <TouchableOpacity
                key={tier}
                style={[styles.tierBtn, currentTier === tier && styles.tierBtnActive]}
                onPress={() => {
                  setCurrentTier(tier);
                  setBannerDismissed(false);
                  setDotTapped(false);
                }}
              >
                <Text style={[styles.tierBtnText, currentTier === tier && styles.tierBtnTextActive]}>
                  {tier === 'none' ? 'None' : tier.charAt(0).toUpperCase() + tier.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.persistentFooter}
          onPress={() => router.push('/escalation/crisis')}
        >
          <Text style={styles.persistentFooterText}>🆘 Immediate support resources</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAF9' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 24 },
  greeting: { fontSize: 28, fontWeight: '700', color: escalationColors.slate[800] },
  subtitle: { fontSize: 16, color: escalationColors.slate[600], marginTop: 4 },
  checkinCard: {
    backgroundColor: escalationColors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  checkinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkinTitle: { fontSize: 18, fontWeight: '600', color: escalationColors.slate[800] },
  ambientDot: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  ambientDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: escalationColors.amber[500] },
  tooltipCard: {
    backgroundColor: escalationColors.amber[50],
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: escalationColors.amber[100],
  },
  tooltipText: { fontSize: 14, color: escalationColors.slate[600], lineHeight: 20, marginBottom: 8 },
  tooltipDismiss: { fontSize: 14, fontWeight: '600', color: escalationColors.indigo[500] },
  checkinStatus: { fontSize: 14, color: escalationColors.slate[200], marginBottom: 12 },
  checkinBtn: {
    backgroundColor: escalationColors.indigo[500],
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  checkinBtnText: { fontSize: 16, fontWeight: '600', color: escalationColors.white },
  getSupportBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: escalationColors.indigo[100],
    backgroundColor: escalationColors.indigo[50],
    marginBottom: 24,
  },
  getSupportBtnText: { fontSize: 16, fontWeight: '600', color: escalationColors.indigo[500] },
  tierSwitcher: {
    backgroundColor: escalationColors.slate[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tierSwitcherLabel: { fontSize: 13, color: escalationColors.slate[200], marginBottom: 10, textAlign: 'center' },
  tierRow: { flexDirection: 'row', gap: 8 },
  tierBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: escalationColors.white,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: escalationColors.slate[100],
  },
  tierBtnActive: { backgroundColor: escalationColors.indigo[500], borderColor: escalationColors.indigo[500] },
  tierBtnText: { fontSize: 12, fontWeight: '500', color: escalationColors.slate[600] },
  tierBtnTextActive: { color: escalationColors.white },
  persistentFooter: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: escalationColors.crisis[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: escalationColors.crisis[100],
  },
  persistentFooterText: { fontSize: 15, fontWeight: '600', color: escalationColors.crisis[600] },
});
