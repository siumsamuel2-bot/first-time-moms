import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { escalationColors } from '../../components/escalation';

export default function ReferralSentScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.animationBox}>
          <Text style={styles.animationText}>✈️</Text>
        </View>

        <Text style={styles.headline}>Referral sent!</Text>

        <Text style={styles.body}>
          We've sent your information to Dr. Amara Johnson. She'll reach out within 24 hours to schedule an appointment.
        </Text>

        <TouchableOpacity style={styles.phoneBtn}>
          <Text style={styles.phoneBtnText}>📞 (617) 555-0142</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.push('/escalation')}
        >
          <Text style={styles.backBtnText}>Back to dashboard</Text>
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
  animationBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: escalationColors.indigo[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  animationText: { fontSize: 48 },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: escalationColors.slate[800],
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    color: escalationColors.slate[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  phoneBtn: {
    backgroundColor: escalationColors.slate[50],
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: escalationColors.slate[100],
  },
  phoneBtnText: { fontSize: 18, fontWeight: '600', color: escalationColors.indigo[500] },
  backBtn: { paddingVertical: 12 },
  backBtnText: { fontSize: 15, color: escalationColors.slate[200], textDecorationLine: 'underline' },
});
