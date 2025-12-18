import { COLORS } from '@/constants/theme';
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
  
      <TouchableOpacity 
        style={styles.iconButton} 
        onPress={onToggle}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
      >
        <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          
          <TouchableOpacity style={styles.optionButton} onPress={onBrowseWorkouts}>
            <Ionicons name="list-outline" size={18} color={COLORS.text} style={styles.icon} />
            <Text style={styles.optionText}>Przeglądaj treningi</Text>
          </TouchableOpacity>

          <View style={styles.separator} />
          
          <TouchableOpacity style={styles.optionButton} onPress={onDelete}>
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} style={styles.icon} />
            <Text style={[styles.optionText, { color: COLORS.danger }]}>Usuń podopiecznego</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 10, 
    position: 'relative',
  },
  iconButton: {
    padding: 8,
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 10, 
    backgroundColor: COLORS.cardBg, 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 200,
    
    // Cienie
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text, // Jasny tekst
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  }
});

export default ClientOptions;