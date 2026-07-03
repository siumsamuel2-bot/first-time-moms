import { type TextInputProps, type ViewStyle } from 'react-native';

export type InputProps = {
  label?: string;
  error?: string;
  style?: ViewStyle;
  testID?: string;
} & Omit<TextInputProps, 'style'>;