import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { escalationColors } from '../../components/escalation';

type ScoreTier = 'low' | 'moderate' | 'significant';

function getTier(score: number): ScoreTier {
  if (score <= 5) return 'low';
  if (score <= 12) return 'moderate';
  return 'significant';
}

export default function ReflectionResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ score?: string }>();
  const score = parseInt(params.score ?? '0', 10);
  const tier: ScoreTier = getTier(score);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.illustrationBox}>
          <Text style={styles.illustrationText}>
            {tier === 'low' ? '🌷' : tier === 'moderate' ? '🌻' : '💗'}
          </Text>
        </View>

        <Text style={styles.headline}>
          Thank you for sharing, Maya.
        </Text>

        <Text style={styles.body}>
          {tier === 'low'
            ? "You're doing okay. We'll check in again tomorrow."
            : tier === 'moderate'
              ? "A tough patch — that's completely normal. Many new moms find it helpful to talk with someone who specializes in postpartum care."
              : "You've been through a lot. Based on what you've shared, connecting with a postpartum specialist could be really helpful."}
        </Text>

        {tier !== 'low' && (
          <>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push('/escalation/referral')}
            >
              <Text style={styles.primaryBtnText}>Yes, please connect me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => router.push('/escalation/reassurance')}
            >
              <Text style={styles.secondaryBtnText}>Not right now</Text>
            </TouchableOpacity>
          </>
        )}

        {tier === 'low' && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/escalation')}
          >
            <Text style={styles.primaryBtnText}>Back to dashboard</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.infoLink}
          onPress={() => setShowInfo(!showInfo)}
        >
          <Text style={styles.infoLinkText}>
            {showInfo ? 'Hide details' : 'About this recommendation'}
          </Text>
        </TouchableOpacity>

        {showInfo && (
          <View style={styles.infoSheet}>
            <Text style={styles.infoTitle}>How this works</Text>
            <Text style={styles.infoBody}>
              Your responses are scored using the Edinburgh Postnatal Depression
              Scale (EPDS), a clinically validated screening tool used by
              healthcare providers worldwide.
            </Text>
            <Text style={styles.infoBody}>
              A higher score doesn't mean something is wrong — it means you
              might benefit from extra support. Our recommendations are based on
              your pattern, not a diagnosis.
            </Text>
            <Text style={styles.infoBody}>
              This information stays private. Nothing is shared without your
              permission.
            </Text>
          </View>
        )}

        <Text style={styles.tierNote}>
          Score: {score} — {tier === 'low' ? 'Low concern' : tier === 'moderate' ? 'Moderate' : 'Significant'} pattern
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAF9' },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  illustrationBox: { alignItems: 'center', marginTop: 20, marginBottom: 16 },
  illustrationText: { fontSize: 64 },
  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: escalationColors.slate[800],
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  body: {
    fontSize: 16,
    color: escalationColors.slate[600],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: escalationColors.indigo[500],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '600', color: escalationColors.white },
  secondaryBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryBtnText: {
    fontSize: 15,
    color: escalationColors.slate[600],
    textDecorationLine: 'underline',
  },
  infoLink: { paddingVertical: 12, alignItems: 'center', marginBottom: 8 },
  infoLinkText: { fontSize: 15, color: escalationColors.indigo[500], fontWeight: '500' },
  infoSheet: {
    backgroundColor: escalationColors.slate[50],
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  infoTitle: { fontSize: 18, fontWeight: '600', color: escalationColors.slate[800], marginBottom: 10 },
  infoBody: {
    fontSize: 15,
    color: escalationColors.slate[600],
    lineHeight: 22,
    marginBottom: 10,
  },
  tierNote: {
    fontSize: 12,
    color: escalationColors.slate[200],
    textAlign: 'center',
    marginTop: 8,
  },
});
