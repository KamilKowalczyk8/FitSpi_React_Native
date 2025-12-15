import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
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
        
        <Pressable style={styles.menuContainer} onPress={(e) => e.stopPropagation()}>
          
          <Text style={styles.menuHeader}>{title}</Text>
          <View style={styles.separator} />
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => {
              onClose(); 
              onCopy();  
            }}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="copy-outline" 
              size={22} 
              color={COLORS.text} 
              style={styles.menuIcon} 
            />
            <Text style={styles.menuText}>Kopiuj na inny dzień</Text>
          </TouchableOpacity>

        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '80%',
    backgroundColor: COLORS.modalBg, 
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  menuHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textSecondary, 
    marginBottom: 15,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  menuIcon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.text, 
    fontWeight: '500',
  },
});