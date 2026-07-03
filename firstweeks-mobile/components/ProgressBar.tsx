import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { type ProgressBarProps } from './ProgressBar.types';

export function ProgressBar({ value, label, style, testID, ...props }: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <View style={[styles.container, style]} testID={testID} {...props}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
      )}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '600',
  },
  track: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#E91E63',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
});