import { WorkoutStatus } from '@/models/Workout';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    GestureResponderEvent,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Props {
  status: WorkoutStatus;
  onEditTitle: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
  onSend: () => void;
}

const ClientWorkoutOptions: React.FC<Props> = ({
  status,
  onEditTitle,
  onViewDetails,
  onDelete,
  onSend
}) => {
  const [visible, setVisible] = useState(false);
  const [menuTop, setMenuTop] = useState(0);


  const openMenu = (event: GestureResponderEvent) => {
    const touchY = event.nativeEvent.pageY; 
    setMenuTop(touchY);
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

  return (
    <View>
      <TouchableOpacity onPress={openMenu} style={styles.iconButton}>
        <Ionicons name="ellipsis-vertical" size={24} color="#666" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu} 
      >

        <Pressable style={styles.overlay} onPress={closeMenu}>
          
          <View style={[styles.dropdown, { top: menuTop }]}>
            
            {(status === WorkoutStatus.DRAFT || status === WorkoutStatus.REJECTED || status === WorkoutStatus.DOWNLOADED) && (
              <TouchableOpacity style={styles.option} onPress={() => { closeMenu(); onSend(); }}>
                <Text style={styles.optionText}>📤 Wyślij trening</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.option} onPress={() => { closeMenu(); onEditTitle(); }}>
              <Text style={styles.optionText}>✏️ Zmień nazwę</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={() => { closeMenu(); onViewDetails(); }}>
              <Text style={styles.optionText}>👁️ Zobacz ćwiczenia</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.option, { borderBottomWidth: 0 }]} onPress={() => { closeMenu(); onDelete(); }}>
              <Text style={[styles.optionText, { color: 'red' }]}>🗑️ Usuń</Text>
            </TouchableOpacity>

          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  dropdown: {
    position: 'absolute',
    right: 40,
    width: 170,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#eee',
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