import { TextInput, StyleSheet, type TextInputProps, type ViewStyle, type TextStyle } from 'react-native';
import { type InputProps } from './Input.types';

export function Input({
  label,
  error,
  style,
  testID,
  ...props
}: InputProps) {
  return (
    <>
      {label && (
        <Text style={styles.label} testID={`${testID}-label`}>
          {label}
        </Text>
      )}
      <TextInput
        style={[styles.input, style]}
        testID={testID}
        {...props}
      />
      {error && (
        <Text style={styles.error} testID={`${testID}-error`}>
          {error}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FAFAFA',
  },
  error: {
    fontSize: 12,
    color: '#D32F2F',
    marginTop: 6,
  },
});