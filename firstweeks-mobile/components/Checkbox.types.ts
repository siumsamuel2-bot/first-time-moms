import { type ViewStyle } from 'react-native';

export type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
};