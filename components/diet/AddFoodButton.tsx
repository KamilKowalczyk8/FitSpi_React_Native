import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  onPress: () => void;
}

export const AddFoodButton: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress}
      activeOpacity={0.7} // Dodaje efekt przy kliknięciu
    >
      <Ionicons 
        name="add-circle" 
        size={24} 
        color={COLORS.primary} 
        style={styles.icon} 
      />
      <Text style={styles.text}>Dodaj wpis</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg, 
    borderWidth: 1,
    borderColor: COLORS.primary,     
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 20, 
    marginTop: 20,
    marginBottom: 40, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: COLORS.primary, 
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});