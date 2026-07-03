import { type ViewStyle, type ViewProps } from 'react-native';

export type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
} & Omit<ViewProps, 'children' | 'style'>;

export type CardBodyProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
} & Omit<ViewProps, 'children' | 'style'>;

export type CardFooterProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
} & Omit<ViewProps, 'children' | 'style'>;