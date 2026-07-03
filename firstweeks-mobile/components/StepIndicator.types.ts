import { type ViewStyle } from 'react-native';

export type Step = {
  label: string;
};

export type StepIndicatorProps = {
  steps: Step[];
  currentStep: number;
  style?: ViewStyle;
  testID?: string;
};