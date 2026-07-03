import { View, TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { type MoodSelectorProps } from './MoodSelector.types';

const MOODS = [
  { value: 1, label: 'Very Low', emoji: '😔', color: '#EF5350' },
  { value: 2, label: 'Low', emoji: '😕', color: '#FFA726' },
  { value: 3, label: 'Okay', emoji: '😐', color: '#FFEE58' },
  { value: 4, label: 'Good', emoji: '🙂', color: '#66BB6A' },
  { value: 5, label: 'Great', emoji: '😊', color: '#4CAF50' },
];

export function MoodSelector({ label, value, onChange, style, testID }: MoodSelectorProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.moodRow}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodButton,
              value === mood.value && styles.moodButtonSelected,
            ]}
            onPress={() => onChange(mood.value)}
            testID={`${testID}-mood-${mood.value}`}
            accessibilityRole="radio"
            accessibilityState={{ checked: value === mood.value }}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text
              style={[
                styles.moodLabel,
                value === mood.value && styles.moodLabelSelected,
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 4,
  },
  moodButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
});