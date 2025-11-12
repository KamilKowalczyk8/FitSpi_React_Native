import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ClientOptionsProps {
  isOpen: boolean;
  onToggle: (event: GestureResponderEvent) => void;
  onDelete: () => void;
  onCreateTraining: () => void;
  onBrowseWorkouts: () => void;
}

const ClientOptions: React.FC<ClientOptionsProps> = ({
  isOpen,
  onToggle,
  onDelete,
  onCreateTraining,
  onBrowseWorkouts,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={onToggle}>
        <Ionicons name="ellipsis-vertical" size={24} color="#555" />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.optionButton} onPress={onBrowseWorkouts}>
            <Text style={styles.optionText}>Przejrzyj treningi</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={onDelete}>
            <Text style={[styles.optionText, { color: 'red' }]}>🗑️ Usuń podopiecznego</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
  iconButton: {
    padding: 10,
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 15, 
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#eee',
    width: 200, 
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
  },
});

export default ClientOptions;