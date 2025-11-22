import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onEditTitle: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
}

const ClientWorkoutOptions: React.FC<Props> = ({ onEditTitle, onViewDetails, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.iconButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#666" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity 
            style={styles.option} 
            onPress={() => { setIsOpen(false); onEditTitle(); }}
          >
            <Text style={styles.optionText}>✏️ Zmień nazwę</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.option} 
            onPress={() => { setIsOpen(false); onViewDetails(); }}
          >
            <Text style={styles.optionText}>👁️ Zobacz ćwiczenia</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.option, { borderBottomWidth: 0 }]} 
            onPress={() => { setIsOpen(false); onDelete(); }}
          >
            <Text style={[styles.optionText, { color: 'red' }]}>🗑️ Usuń</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

    zIndex: 100, 
    position: 'relative',
  },
  iconButton: {
    padding: 5,
  },
  dropdown: {
    position: 'absolute',
    right: 30, 
    top: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 5,
    width: 160,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#eee',
    zIndex: 200, 
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  }
});

export default ClientWorkoutOptions;