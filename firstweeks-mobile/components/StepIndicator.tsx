import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { type StepIndicatorProps } from './StepIndicator.types';

export function StepIndicator({ steps, currentStep, style, testID }: StepIndicatorProps) {
  return (
    <View style={[styles.container, style]} testID={testID}>
      {steps.map((step, index) => (
        <View key={index} style={styles.stepWrapper}>
          <View
            style={[
              styles.step,
              index < currentStep && styles.stepCompleted,
              index === currentStep && styles.stepActive,
            ]}
            testID={`${testID}-step-${index}`}
          >
            {index < currentStep ? (
              <Text style={styles.checkIcon}>✓</Text>
            ) : (
              <Text style={styles.stepNumber}>{index + 1}</Text>
            )}
          </View>
          <Text
            style={[
              styles.stepLabel,
              index === currentStep && styles.stepLabelActive,
              index < currentStep && styles.stepLabelCompleted,
            ]}
            testID={`${testID}-label-${index}`}
          >
            {step.label}
          </Text>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.line,
                index < currentStep && styles.lineCompleted,
              ]}
              testID={`${testID}-line-${index}`}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stepCompleted: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  stepActive: {
    borderColor: '#007AFF',
    backgroundColor: '#FFF',
  },
  checkIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  stepLabel: {
    marginTop: 8,
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    maxWidth: 70,
  },
  stepLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  stepLabelCompleted: {
    color: '#007AFF',
  },
  line: {
    position: 'absolute',
    top: 16,
    left: 32,
    right: -16,
    height: 2,
    backgroundColor: '#E0E0E0',
  },
  lineCompleted: {
    backgroundColor: '#007AFF',
  },
});