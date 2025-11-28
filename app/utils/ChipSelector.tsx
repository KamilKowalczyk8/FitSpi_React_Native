import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface SelectorOption<T> {
  label: string;
  value: T;
}

interface Props<T extends string | number> {
  label: string;
  options: SelectorOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const ChipSelector = <T extends string | number>({
  label,
  options,
  value,
  onChange,
}: Props<T>) => {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipContainer}>
        {options.map((opt) => (
          <TouchableOpacity
            key={String(opt.value)}
            style={[
              styles.chip,
              value === opt.value && styles.chipSelected,
            ]}
            onPress={() => onChange(opt.value)}
          >
            <Text
              style={[
                styles.chipText,
                value === opt.value && styles.chipTextSelected,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 5,
  },
  chipSelected: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});