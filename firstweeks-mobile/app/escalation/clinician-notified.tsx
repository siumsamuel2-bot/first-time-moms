import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { escalationColors } from '../../components/escalation';

export default function ClinicianNotifiedScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>✅</Text>
        </View>

        <Text style={styles.headline}>Your clinician has been notified</Text>

        <Text style={styles.body}>
          Your OB-GYN at Austin Women's Health will check in within 24 hours.
        </Text>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Dashboard status:</Text>
          <Text style={styles.statusValue}>Clinician notified — waiting for review</Text>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push('/escalation')}
        >
          <Text style={styles.backBtnText}>OK, back to dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAF9' },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: escalationColors.sage[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconText: { fontSize: 40 },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: escalationColors.slate[800],
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontSize: 16,
    color: escalationColors.slate[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
  },
  statusCard: {
    backgroundColor: escalationColors.sage[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: escalationColors.sage[100],
    marginBottom: 32,
    width: '100%',
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: escalationColors.slate[200],
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 15,
    fontWeight: '600',
    color: escalationColors.sage[500],
  },
  backBtn: {
    backgroundColor: escalationColors.indigo[500],
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '100%',
  },
  backBtnText: { fontSize: 16, fontWeight: '600', color: escalationColors.white },
});
