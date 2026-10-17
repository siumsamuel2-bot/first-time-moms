import { Pressable, Text, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { type ButtonProps } from './Button.types';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onPress,
  style,
  testID,
  ...props
}: ButtonProps) {
  const baseStyles = [
    styles.base,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = variant === 'primary' ? styles.primaryText
    : variant === 'secondary' ? styles.secondaryText
    : variant === 'ghost' ? styles.ghostText
    : variant === 'danger' ? styles.dangerText
    : styles.primaryText;

  const sizeTextStyle = size === 'sm' ? styles.smText
    : size === 'md' ? styles.mdText
    : size === 'lg' ? styles.lgText
    : size === 'xl' ? styles.xlText
    : styles.mdText;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={baseStyles}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
      {...props}
    >
      <Text style={[styles.text, textStyle, sizeTextStyle]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    gap: 8,
  },
  primary: {
    backgroundColor: '#E91E63',
  },
  secondary: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FFCC80',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: '#D32F2F',
  },
  disabled: {
    opacity: 0.5,
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  xl: {
    paddingVertical: 18,
    paddingHorizontal: 36,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#E65100',
  },
  ghostText: {
    color: '#E91E63',
  },
  dangerText: {
    color: '#FFFFFF',
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  xlText: {
    fontSize: 20,
  },
});
