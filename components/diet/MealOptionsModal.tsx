import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onCopy: () => void;
  title: string; 
}

export const MealOptionsModal: React.FC<Props> = ({ 
  visible, 
  onClose, 
  onCopy, 
  title 
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.menuContainer}>
          <Text style={styles.menuHeader}>{title}</Text>
          
          {/* Opcja 1: Kopiuj */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              onClose(); 
              onCopy();  
            }}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuText}>Kopiuj na inny dzień</Text>
          </TouchableOpacity>

          {/* Tu w przyszłości dodasz "Usuń", "Edytuj" itp. */}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '70%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  menuHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});