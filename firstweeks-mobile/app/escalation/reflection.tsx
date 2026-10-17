import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { escalationColors } from '../../components/escalation';

const EPDS_SCREENS = [
  {
    label: '1 of 5',
    questions: [
      {
        id: 'q1',
        text: 'I have been able to laugh and see the funny side of things',
        options: [
          { value: 0, label: 'As much as ever' },
          { value: 1, label: 'Rather less than before' },
          { value: 2, label: 'Definitely less' },
          { value: 3, label: 'Not at all' },
        ],
      },
      {
        id: 'q2',
        text: 'I have looked forward with enjoyment to things',
        options: [
          { value: 0, label: 'As much as ever' },
          { value: 1, label: 'Rather less than before' },
          { value: 2, label: 'Definitely less' },
          { value: 3, label: 'Not at all' },
        ],
      },
    ],
  },
  {
    label: '2 of 5',
    questions: [
      {
        id: 'q3',
        text: 'I have blamed myself unnecessarily when things went wrong',
        options: [
          { value: 0, label: 'No, never' },
          { value: 1, label: 'Not often' },
          { value: 2, label: 'Yes, sometimes' },
          { value: 3, label: 'Yes, most of the time' },
        ],
      },
      {
        id: 'q4',
        text: 'I have been anxious or worried for no good reason',
        options: [
          { value: 0, label: 'No, not at all' },
          { value: 1, label: 'Hardly ever' },
          { value: 2, label: 'Yes, sometimes' },
          { value: 3, label: 'Yes, very often' },
        ],
      },
    ],
  },
  {
    label: '3 of 5',
    questions: [
      {
        id: 'q5',
        text: 'I have felt scared or panicky for no very good reason',
        options: [
          { value: 0, label: 'No, not at all' },
          { value: 1, label: 'Hardly ever' },
          { value: 2, label: 'Yes, sometimes' },
          { value: 3, label: 'Yes, very often' },
        ],
      },
      {
        id: 'q6',
        text: 'Things have been getting on top of me',
        options: [
          { value: 0, label: 'No, not at all' },
          { value: 1, label: 'Hardly ever' },
          { value: 2, label: 'Yes, sometimes' },
          { value: 3, label: 'Yes, very often' },
        ],
      },
    ],
  },
  {
    label: '4 of 5',
    questions: [
      {
        id: 'q7',
        text: 'I have been so unhappy that I have had difficulty sleeping',
        options: [
          { value: 0, label: 'No, never' },
          { value: 1, label: 'Not often' },
          { value: 2, label: 'Yes, sometimes' },
          { value: 3, label: 'Yes, most of the time' },
        ],
      },
      {
        id: 'q8',
        text: 'I have felt sad or miserable',
        options: [
          { value: 0, label: 'No, not at all' },
          { value: 1, label: 'Hardly ever' },
          { value: 2, label: 'Yes, sometimes' },
          { value: 3, label: 'Yes, very often' },
        ],
      },
    ],
  },
  {
    label: '5 of 5',
    questions: [
      {
        id: 'q9',
        text: 'I have been so unhappy that I have been crying',
        options: [
          { value: 0, label: 'No, never' },
          { value: 1, label: 'Not often' },
          { value: 2, label: 'Yes, sometimes' },
          { value: 3, label: 'Yes, most of the time' },
        ],
      },
      {
        id: 'q10',
        text: 'The thought of harming myself has occurred to me',
        options: [
          { value: 0, label: 'Never' },
          { value: 1, label: 'Hardly ever' },
          { value: 2, label: 'Sometimes' },
          { value: 3, label: 'Yes, quite often' },
        ],
      },
    ],
  },
];

function OptionButton({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.optionBtn, selected && styles.optionBtnSelected]}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
    >
      <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function ReflectionScreen() {
  const router = useRouter();
  const [screenIndex, setScreenIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | null>>({});

  const currentScreen = EPDS_SCREENS[screenIndex]!;
  const isLastScreen = screenIndex === EPDS_SCREENS.length - 1;

  const allAnswered = currentScreen.questions.every((q) => answers[q.id] !== undefined);

  const setAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const getTotalScore = () => {
    return EPDS_SCREENS.flatMap((s) => s.questions).reduce((sum, q) => {
      return sum + (answers[q.id] ?? 0);
    }, 0);
  };

  const handleContinue = () => {
    if (isLastScreen) {
      const score = getTotalScore();
      const q10Answer = answers.q10;
      if (q10Answer !== undefined && q10Answer !== null && q10Answer > 0) {
        router.push('/escalation/crisis');
      } else {
        router.push(`/escalation/reflection-result?score=${score}`);
      }
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const handleSkipScreen = () => {
    currentScreen.questions.forEach((q) => {
      if (answers[q.id] === undefined) {
        setAnswers((prev) => ({ ...prev, [q.id]: null }));
      }
    });
    if (isLastScreen) {
      const score = getTotalScore();
      const q10Answer = answers.q10;
      if (q10Answer !== undefined && q10Answer !== null && q10Answer > 0) {
        router.push('/escalation/crisis');
      } else {
        router.push(`/escalation/reflection-result?score=${score}`);
      }
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <View style={styles.progressRow}>
          {EPDS_SCREENS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                { backgroundColor: i <= screenIndex ? escalationColors.indigo[500] : escalationColors.slate[100] },
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressLabel}>{currentScreen.label}</Text>

        {currentScreen.questions.map((q) => (
          <View key={q.id} style={styles.questionBlock}>
            <Text style={styles.questionText}>{q.text}</Text>
            <View style={styles.optionsList}>
              {q.options.map((opt) => (
                <OptionButton
                  key={`${q.id}-${opt.value}`}
                  label={opt.label}
                  selected={answers[q.id] === opt.value}
                  onSelect={() => setAnswer(q.id, opt.value)}
                />
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.continueBtn, !allAnswered && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!allAnswered}
        >
          <Text style={[styles.continueBtnText, !allAnswered && styles.continueBtnTextDisabled]}>
            {isLastScreen ? 'See results' : 'Continue'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSkipScreen} style={styles.skipBtn}>
          <Text style={styles.skipBtnText}>Prefer not to say</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAF9' },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
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
  questionBlock: {
    marginBottom: 28,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: escalationColors.slate[800],
    lineHeight: 24,
    marginBottom: 16,
  },
  optionsList: {
    gap: 8,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: escalationColors.slate[50],
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionBtnSelected: {
    backgroundColor: escalationColors.indigo[50],
    borderColor: escalationColors.indigo[500],
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: escalationColors.slate[200],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  radioOuterSelected: {
    borderColor: escalationColors.indigo[500],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: escalationColors.indigo[500],
  },
  optionText: {
    fontSize: 16,
    color: escalationColors.slate[600],
    flex: 1,
  },
  optionTextSelected: {
    color: escalationColors.indigo[500],
    fontWeight: '600',
  },
  continueBtn: {
    backgroundColor: escalationColors.indigo[500],
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: escalationColors.white,
  },
  continueBtnTextDisabled: {
    color: 'rgba(255,255,255,0.6)',
  },
  skipBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  skipBtnText: {
    fontSize: 15,
    color: escalationColors.slate[600],
    textDecorationLine: 'underline',
  },
});
