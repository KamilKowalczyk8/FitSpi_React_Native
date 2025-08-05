import { Controller } from 'react-hook-form';
import { TextInput as RNTextInput, StyleSheet, Text, View } from 'react-native';

export const TextInput = ({ name, control, label, secureTextEntry = false }) => (
  <Controller
    control={control}
    name={name}
    render={({ field: { onChange, value }, fieldState: { error } }) => (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <RNTextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          secureTextEntry={secureTextEntry}
        />
        {error && <Text style={styles.error}>{error.message}</Text>}
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  error: { color: 'red', fontSize: 12, marginTop: 4 },
});
