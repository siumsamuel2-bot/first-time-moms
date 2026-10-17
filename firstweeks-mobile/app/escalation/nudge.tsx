import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { escalationColors } from '../../components/escalation';

export default function NudgeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.checkmarkArea}>
          <Text style={styles.checkmarkText}>✓</Text>
          <Text style={styles.checkinComplete}>Check-in complete</Text>
        </View>

        <View style={styles.nudgeCard}>
          <Text style={styles.nudgeIcon}>☀️</Text>
          <Text style={styles.nudgeHeadline}>We've noticed a pattern</Text>
          <Text style={styles.nudgeBody}>
            You've had 5 nights of disrupted sleep. That's really tough — especially with a new baby.
          </Text>
          <Text style={styles.nudgeBody}>
            Would it help to talk through it?
          </Text>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/escalation/reflection')}
          >
            <Text style={styles.primaryBtnText}>Yes, let's talk about it</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.ghostLink}
            onPress={() => router.push('/escalation/reassurance')}
          >
            <Text style={styles.ghostLinkText}>Not right now</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
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
  },
  checkmarkArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  checkmarkText: {
    fontSize: 36,
    color: escalationColors.sage[500],
    fontWeight: '700',
    marginBottom: 4,
  },
  checkinComplete: {
    fontSize: 18,
    fontWeight: '600',
    color: escalationColors.slate[800],
  },
  nudgeCard: {
    backgroundColor: escalationColors.amber[50],
    borderRadius: 16,
    borderWidth: 1,
    borderColor: escalationColors.amber[100],
    padding: 24,
    marginBottom: 24,
  },
  nudgeIcon: { fontSize: 32, marginBottom: 12 },
  nudgeHeadline: {
    fontSize: 18,
    fontWeight: '600',
    color: escalationColors.slate[800],
    marginBottom: 10,
  },
  nudgeBody: {
    fontSize: 15,
    color: escalationColors.slate[600],
    lineHeight: 22,
    marginBottom: 8,
  },
  primaryBtn: {
    backgroundColor: escalationColors.indigo[500],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 12,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: escalationColors.white },
  ghostLink: { paddingVertical: 12, alignItems: 'center' },
  ghostLinkText: { fontSize: 15, color: escalationColors.slate[600], textDecorationLine: 'underline' },
  backBtn: { paddingVertical: 12, alignItems: 'center' },
  backBtnText: { fontSize: 14, color: escalationColors.slate[200] },
});
