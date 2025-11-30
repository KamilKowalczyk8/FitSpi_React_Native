import { getMealLabel } from '@/app/utils/mealHelper';
import { MealType } from '@/models/Diet';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (targetDate: Date) => void;
  mealType: MealType | null;
}

export const CopyMealModal: React.FC<Props> = ({ visible, onClose, onConfirm, mealType }) => {
  const [date, setDate] = useState(new Date());

  const handleConfirm = () => {
    onConfirm(date);
    onClose();
  };

  if (!mealType) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Kopiuj {getMealLabel(mealType)}</Text>
          <Text style={styles.subtitle}>Wybierz dzień docelowy:</Text>

          {/* Wybór daty - prosty przykład z natywnym pickerem */}
          <View style={styles.pickerContainer}>
             <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                    if (selectedDate) setDate(selectedDate);
                }}
             />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Kopiuj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  pickerContainer: { height: 150, justifyContent: 'center', marginBottom: 20 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { padding: 10, flex: 1, alignItems: 'center' },
  confirmButton: { 
      padding: 10, 
      flex: 1, 
      alignItems: 'center', 
      backgroundColor: '#007AFF', 
      borderRadius: 8 
  },
  buttonText: { fontWeight: '600', color: '#333' } 
});