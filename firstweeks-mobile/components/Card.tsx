import { View, Text, StyleSheet, type ViewStyle, type TextStyle } from 'react-native';
import { type CardProps, type CardBodyProps, type CardFooterProps } from './Card.types';

export function Card({ children, style, testID, ...props }: CardProps) {
  return (
    <View style={[styles.container, style]} testID={testID} {...props}>
      {children}
    </View>
  );
}

export function CardBody({ children, style, testID, ...props }: CardBodyProps) {
  return (
    <View style={[styles.body, style]} testID={testID} {...props}>
      {children}
    </View>
  );
}

export function CardFooter({ children, style, testID, ...props }: CardFooterProps) {
  return (
    <View style={[styles.footer, style]} testID={testID} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  body: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
});