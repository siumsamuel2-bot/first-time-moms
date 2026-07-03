import { type ViewStyle, type ViewProps } from 'react-native';

export type ProgressBarProps = {
  value: number;
  label?: string;
  style?: ViewStyle;
  testID?: string;
} & Omit<ViewProps, 'style' | 'children'>;