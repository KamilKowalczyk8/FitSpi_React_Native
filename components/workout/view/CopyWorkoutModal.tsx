import { COLORS } from "@/constants/theme";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface CopyWorkoutModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  title?: string;
  confirmText?: string;
}

export const CopyWorkoutModal: React.FC<CopyWorkoutModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title = "Kopiuj trening na dzień:",
  confirmText = "Kopiuj",
}) => {
  const [date, setDate] = useState(new Date());

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleConfirm = () => {
    onConfirm(date);
  };


  const formattedDate = date.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "long", 
    year: "numeric"
  });

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{title}</Text>
          
          <Text style={styles.dateDisplay}>{formattedDate}</Text>

          <View style={styles.pickerContainer}>
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "spinner"} 
              onChange={onChange}
              style={styles.datePicker}
              locale="pl-PL"
              themeVariant="dark" 
              textColor={COLORS.text}
              accentColor={COLORS.primary}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.buttonBase, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Anuluj</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonBase, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.overlay,
  },
  modalView: {
    margin: 20,
    backgroundColor: COLORS.modalBg,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    color: COLORS.textSecondary, 
    marginBottom: 5,
    textAlign: "center",
  },
  dateDisplay: {
    fontSize: 26,
    fontWeight: "bold",
    color: COLORS.primary, 
    marginBottom: 20,
    textAlign: "center",
  },
  pickerContainer: {
    width: '100%',
    height: 10, 
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden', 
  },
  datePicker: {
    width: "100%",
    height: Platform.OS === "ios" ? undefined : 180, 
    backgroundColor: 'transparent', 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 15,
  },
  buttonBase: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    elevation: 2,
    flex: 1,
    alignItems: "center",
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});