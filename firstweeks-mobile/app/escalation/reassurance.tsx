import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { escalationColors } from '../../components/escalation';

export default function ReassuranceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.illustrationBox}>
          <Text style={styles.illustrationText}>🌷</Text>
        </View>

        <Text style={styles.headline}>That's completely okay.</Text>

        <Text style={styles.body}>
          We'll check in with you again in a few days.
        </Text>

        <Text style={styles.reassurance}>
          If you change your mind, you can always tap "Get Support" from your dashboard.
        </Text>

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
  illustrationBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: escalationColors.sage[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  illustrationText: { fontSize: 48 },
  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: escalationColors.slate[800],
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  body: { fontSize: 18, color: escalationColors.slate[600], textAlign: 'center', marginBottom: 20 },
  reassurance: { fontSize: 20, fontWeight: '600', color: escalationColors.sage[500], textAlign: 'center', marginBottom: 40 },
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
