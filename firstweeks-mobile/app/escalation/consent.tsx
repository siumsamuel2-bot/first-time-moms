import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { escalationColors } from '../../components/escalation';

export default function ConsentScreen() {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.illustrationBox}>
          <View style={styles.shieldIcon}>
            <Text style={styles.shieldText}>🛡️</Text>
          </View>
        </View>

        <Text style={styles.headline}>Would you like your clinician to know?</Text>

        <Text style={styles.body}>
          Your OB-GYN at Austin Women's Health can see a summary of your recent check-ins to help provide the best care for you.
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push('/escalation/clinician-notified')}
        >
          <Text style={styles.primaryBtnText}>Yes, share with my clinician</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostBtnContainer}
          onPress={() => router.push('/escalation/reassurance')}
        >
          <Text style={styles.ghostBtnText}>Not right now</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.learnMoreBtn}
          onPress={() => setShowDetails(!showDetails)}
        >
          <Text style={styles.learnMoreText}>
            {showDetails ? 'Hide details' : 'What will my clinician see?'}
          </Text>
        </TouchableOpacity>

        {showDetails && (
          <View style={styles.detailsSheet}>
            <Text style={styles.detailsTitle}>What will my clinician see?</Text>
            <Text style={styles.detailsBody}>
              If you choose to share, your clinician at Austin Women's Health will see:
            </Text>
            <Text style={styles.detailItem}>✓ Your check-in responses (last 7 days)</Text>
            <Text style={styles.detailItem}>✓ Sleep patterns (hours of sleep)</Text>
            <Text style={styles.detailItem}>✓ Mood trends (not individual answers)</Text>
            <Text style={styles.detailItem}>✓ Any notes you've shared</Text>

            <Text style={styles.detailsBody2}>They will NOT see:</Text>
            <Text style={styles.detailItemExcluded}>✗ Your full medical history</Text>
            <Text style={styles.detailItemExcluded}>✗ Your EPDS score</Text>
            <Text style={styles.detailItemExcluded}>✗ Anything shared with your insurance</Text>

            <Text style={styles.detailsFooter}>
              You can revoke access anytime in Settings. Your data stays private.
            </Text>

            <TouchableOpacity
              style={styles.understoodBtn}
              onPress={() => setShowDetails(false)}
            >
              <Text style={styles.understoodBtnText}>I understand, go back</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.privacyNote}>
          Your data stays private. Nothing is shared with your insurance.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAF9' },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  illustrationBox: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  shieldIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: escalationColors.indigo[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldText: { fontSize: 40 },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: escalationColors.slate[800],
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    color: escalationColors.slate[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  primaryBtn: {
    backgroundColor: escalationColors.indigo[500],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: escalationColors.white },
  ghostBtnContainer: { paddingVertical: 14, alignItems: 'center', marginBottom: 20 },
  ghostBtnText: { fontSize: 16, color: escalationColors.slate[600] },
  divider: { height: 1, backgroundColor: escalationColors.slate[100], marginBottom: 16 },
  learnMoreBtn: { paddingVertical: 10, alignItems: 'center', marginBottom: 16 },
  learnMoreText: { fontSize: 15, color: escalationColors.indigo[500], fontWeight: '500' },
  detailsSheet: {
    backgroundColor: escalationColors.slate[50],
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  detailsTitle: { fontSize: 18, fontWeight: '600', color: escalationColors.slate[800], marginBottom: 10 },
  detailsBody: { fontSize: 15, color: escalationColors.slate[600], marginBottom: 12, lineHeight: 22 },
  detailItem: { fontSize: 15, color: escalationColors.sage[500], marginBottom: 6, paddingLeft: 8 },
  detailsBody2: { fontSize: 15, color: escalationColors.slate[600], marginTop: 12, marginBottom: 8 },
  detailItemExcluded: { fontSize: 15, color: escalationColors.slate[200], marginBottom: 6, paddingLeft: 8 },
  detailsFooter: {
    fontSize: 14,
    color: escalationColors.slate[200],
    marginTop: 12,
    fontStyle: 'italic',
  },
  understoodBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: escalationColors.indigo[50],
    borderRadius: 10,
  },
  understoodBtnText: { fontSize: 15, fontWeight: '600', color: escalationColors.indigo[500] },
  privacyNote: { fontSize: 13, color: escalationColors.slate[200], textAlign: 'center' },
});
