import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { escalationColors } from './constants';

interface ReflectionQuestionProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  children: React.ReactNode;
  onContinue: () => void;
  onSkip: () => void;
  canContinue: boolean;
  showPreferNot?: boolean;
}

export function ReflectionQuestion({
  questionNumber,
  totalQuestions,
  question,
  children,
  onContinue,
  onSkip,
  canContinue,
  showPreferNot = true,
}: ReflectionQuestionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.progressRow}>
        {Array.from({ length: totalQuestions }, (_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              { backgroundColor: i < questionNumber ? escalationColors.indigo[500] : escalationColors.slate[100] },
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressLabel}>Question {questionNumber} of {totalQuestions}</Text>
      <View style={styles.illustrationBox}>
        <Text style={styles.illustrationText}>🌿</Text>
      </View>
      <Text style={styles.questionText}>{question}</Text>
      <View style={styles.answerArea}>
        {children}
      </View>
      <TouchableOpacity
        style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
        onPress={onContinue}
        disabled={!canContinue}
      >
        <Text style={[styles.continueBtnText, !canContinue && styles.continueBtnTextDisabled]}>
          Continue
        </Text>
      </TouchableOpacity>
      {showPreferNot && (
        <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
          <Text style={styles.skipBtnText}>Prefer not to say</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressLabel: {
    fontSize: 13,
    color: escalationColors.slate[200],
    textAlign: 'center',
    marginBottom: 24,
  },
  illustrationBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  illustrationText: {
    fontSize: 48,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: escalationColors.slate[800],
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 28,
  },
  answerArea: {
    flex: 1,
    justifyContent: 'center',
  },
  continueBtn: {
    backgroundColor: escalationColors.indigo[500],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: escalationColors.white,
  },
  continueBtnTextDisabled: {
    color: 'rgba(255,255,255,0.6)',
  },
  skipBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  skipBtnText: {
    fontSize: 15,
    color: escalationColors.slate[600],
    textDecorationLine: 'underline',
  },
});
