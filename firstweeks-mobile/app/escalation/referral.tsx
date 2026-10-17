import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ProviderCard, escalationColors } from '../../components/escalation';

const PROVIDERS = [
  {
    id: '1',
    name: 'Dr. Amara Johnson',
    credentials: 'LMFT, PMH-C',
    rating: 4.5,
    reviews: 12,
    specialties: ['Postpartum anxiety', 'Birth trauma'],
    insurance: ['Aetna', 'BCBS'],
    distance: '2.3 mi away',
  },
  {
    id: '2',
    name: 'Dr. Sarah Chen',
    credentials: 'PsyD, PMH-C',
    rating: 4.8,
    reviews: 24,
    specialties: ['Perinatal mental health', 'Parenting support'],
    insurance: ['Cigna', 'BCBS'],
    distance: '4.1 mi away',
  },
  {
    id: '3',
    name: 'Dr. Lisa Rodriguez',
    credentials: 'LCSW, PMH-C',
    rating: 4.2,
    reviews: 8,
    specialties: ['Postpartum depression', 'Anxiety'],
    insurance: ['Aetna', 'Cigna'],
    distance: '5.7 mi away',
  },
];

export default function ReferralScreen() {
  const router = useRouter();
  const [requestedIds, setRequestedIds] = useState<Set<string>>(new Set());
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const handleRequestContact = (providerId: string) => {
    setShowConfirm(providerId);
  };

  const confirmRequest = () => {
    if (showConfirm) {
      setRequestedIds((prev) => new Set(prev).add(showConfirm));
      setShowConfirm(null);
      router.push('/escalation/referral-sent');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🤝</Text>
          <Text style={styles.headerTitle}>
            We found providers who specialize in postpartum support
          </Text>
        </View>

        {PROVIDERS.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onRequestContact={handleRequestContact}
            onViewDetails={() => {}}
            requestSent={requestedIds.has(provider.id)}
          />
        ))}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() => router.push('/escalation/reassurance')}
          >
            <Text style={styles.ghostBtnText}>Not right now — I'll explore later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showConfirm && (
        <View style={styles.overlay}>
          <View style={styles.confirmSheet}>
            <Text style={styles.confirmTitle}>
              Share your info with {PROVIDERS.find(p => p.id === showConfirm)?.name}?
            </Text>
            <Text style={styles.confirmBody}>
              She'll reach out within 24 hours to schedule an appointment.
            </Text>
            <TouchableOpacity style={styles.confirmBtn} onPress={confirmRequest}>
              <Text style={styles.confirmBtnText}>Yes, share my info</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowConfirm(null)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAF9' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginBottom: 24 },
  headerIcon: { fontSize: 40, marginBottom: 12 },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: escalationColors.slate[800],
    textAlign: 'center',
    lineHeight: 28,
  },
  actionRow: { marginTop: 8, alignItems: 'center' },
  ghostBtn: { paddingVertical: 14 },
  ghostBtnText: { fontSize: 15, color: escalationColors.slate[600], textDecorationLine: 'underline' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  confirmSheet: {
    backgroundColor: escalationColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  confirmTitle: { fontSize: 18, fontWeight: '600', color: escalationColors.slate[800], marginBottom: 8 },
  confirmBody: { fontSize: 15, color: escalationColors.slate[600], lineHeight: 22, marginBottom: 24 },
  confirmBtn: {
    backgroundColor: escalationColors.indigo[500],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmBtnText: { fontSize: 16, fontWeight: '600', color: escalationColors.white },
  cancelText: { fontSize: 15, color: escalationColors.slate[600], textAlign: 'center', paddingVertical: 8 },
});
