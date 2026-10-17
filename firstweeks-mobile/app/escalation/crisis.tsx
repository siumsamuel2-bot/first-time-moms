import { View, Text, TouchableOpacity, Linking, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { escalationColors } from '../../components/escalation';

export default function CrisisScreen() {
  const router = useRouter();

  const handleCall988 = () => {
    Linking.openURL('tel:988');
  };

  const handleTextHome = () => {
    Linking.openURL('sms:741741&body=HOME');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.illustrationBox}>
          <Text style={styles.illustrationText}>💗</Text>
        </View>

        <Text style={styles.headline}>You matter.</Text>
        <Text style={styles.subhead}>Help is available right now.</Text>

        <TouchableOpacity style={styles.crisisBtn} onPress={handleCall988}>
          <Text style={styles.crisisBtnIcon}>📞</Text>
          <View style={styles.crisisBtnContent}>
            <Text style={styles.crisisBtnNumber}>Call 988</Text>
            <Text style={styles.crisisBtnLabel}>Suicide & Crisis Lifeline</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.crisisBtn} onPress={handleTextHome}>
          <Text style={styles.crisisBtnIcon}>📱</Text>
          <View style={styles.crisisBtnContent}>
            <Text style={styles.crisisBtnNumber}>Text HOME to 741741</Text>
            <Text style={styles.crisisBtnLabel}>Crisis Text Line</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.clinicianNote}>
          A clinician has been notified and will reach out within 30 minutes.
        </Text>

        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => router.push('/escalation')}
        >
          <Text style={styles.returnBtnText}>I understand, return to dashboard</Text>
        </TouchableOpacity>

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            These resources are available 24/7. You're not alone.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: escalationColors.crisis[50] },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationBox: { marginBottom: 16 },
  illustrationText: { fontSize: 64 },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: escalationColors.slate[800],
    marginBottom: 8,
    textAlign: 'center',
  },
  subhead: {
    fontSize: 18,
    fontWeight: '500',
    color: escalationColors.slate[600],
    textAlign: 'center',
    marginBottom: 32,
  },
  crisisBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: escalationColors.white,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  crisisBtnIcon: { fontSize: 24, marginRight: 14 },
  crisisBtnContent: { flex: 1 },
  crisisBtnNumber: { fontSize: 17, fontWeight: '700', color: escalationColors.crisis[600], marginBottom: 2 },
  crisisBtnLabel: { fontSize: 14, color: escalationColors.slate[600] },
  divider: { width: '60%', height: 1, backgroundColor: escalationColors.crisis[100], marginVertical: 20 },
  clinicianNote: {
    fontSize: 14,
    color: escalationColors.slate[200],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  returnBtn: { paddingVertical: 14, paddingHorizontal: 20, marginBottom: 16 },
  returnBtnText: { fontSize: 15, color: escalationColors.slate[600] },
  footerNote: { position: 'absolute', bottom: 24, left: 24, right: 24 },
  footerNoteText: { fontSize: 13, color: escalationColors.slate[200], textAlign: 'center' },
});
