import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  onPress: () => void;
}

export const AddFoodButton: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.icon}>➕</Text>
      <Text style={styles.text}>Dodaj wpis</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8f8a8aff',
    borderRadius: 12,
    paddingVertical: 15,
    marginHorizontal: 40,
    marginTop: 20,
    marginBottom: 20, 
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    color: '#000000ff',
    fontWeight: '500',
  },
});