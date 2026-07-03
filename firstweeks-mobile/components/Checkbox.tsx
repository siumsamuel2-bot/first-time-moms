import { StyleSheet, TouchableOpacity, Text, type ViewStyle, type TextStyle } from 'react-native';
import { type CheckboxProps } from './Checkbox.types';

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  style,
  testID,
}: CheckboxProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
    >
      <View style={[styles.box, checked && styles.boxChecked, disabled && styles.boxDisabled]}>
        {checked && <View style={styles.checkmark} />}
      </View>
      <Text style={[styles.label, disabled && styles.labelDisabled]} numberOfLines={0}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

import { View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 6,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  boxDisabled: {
    borderColor: '#CCC',
    backgroundColor: '#F5F5F5',
  },
  checkmark: {
    width: 12,
    height: 12,
    backgroundColor: '#FFF',
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    flex: 1,
  },
  labelDisabled: {
    color: '#999',
  },
});