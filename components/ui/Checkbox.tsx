import { Controller } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export const Checkbox = ({ name, control, label }) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { value, onChange } }) => (
      <Pressable onPress={() => onChange(!value)} style={styles.row}>
        <View style={[styles.checkbox, value && styles.checked]} />
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    )}
  />
);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  checkbox: {
    width: 20, height: 20, borderWidth: 1,
    borderColor: '#000', marginRight: 8,
  },
  checked: {
    backgroundColor: '#000',
  },
  label: { fontSize: 14 },
});
