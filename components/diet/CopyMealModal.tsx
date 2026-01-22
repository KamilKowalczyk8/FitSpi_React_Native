import { COLORS } from '@/constants/theme'; // Import motywu
import { MealType } from '@/models/Diet';
import { getMealLabel } from '@/utils/mealHelper';
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

  const formattedDate = date.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          
          <Text style={styles.title}>Kopiuj {getMealLabel(mealType)}</Text>
          <Text style={styles.subtitle}>Na dzień:</Text>
          
          <Text style={styles.dateDisplay}>{formattedDate}</Text>

          <View style={styles.pickerContainer}>
             <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
                onChange={(event, selectedDate) => {
                    if (selectedDate) setDate(selectedDate);
                }}
                locale="pl-PL"
                themeVariant="dark"
                textColor={COLORS.text}
                accentColor={COLORS.primary}
                style={styles.datePicker}
             />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Anuluj</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Kopiuj</Text>
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
    backgroundColor: COLORS.overlay, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: COLORS.modalBg, 
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    
    // Cienie
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 5,
    color: COLORS.text // Biały tekst
  },
  subtitle: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    textAlign: 'center', 
    marginBottom: 5 
  },
  dateDisplay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary, 
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerContainer: { 
    height: 40, 
    justifyContent: 'center', 
    marginBottom: 25,
    overflow: 'hidden',
  },
  datePicker: {
    height: 180,
    backgroundColor: 'transparent',
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 15,
  },
  cancelButton: { 
    paddingVertical: 12, 
    flex: 1, 
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.danger, 
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontWeight: '600', 
    color: COLORS.text,
    fontSize: 16,
  },
  confirmButton: { 
    paddingVertical: 12, 
    flex: 1, 
    alignItems: 'center', 
    backgroundColor: COLORS.primary, 
    borderRadius: 12,
    elevation: 2,
  },
  confirmButtonText: { 
    fontWeight: 'bold', 
    color: '#fff', 
    fontSize: 16,
  } 
});