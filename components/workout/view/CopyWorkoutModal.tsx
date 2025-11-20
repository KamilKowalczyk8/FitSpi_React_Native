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
    if (Platform.OS === 'android') {
    }
    setDate(currentDate);
  };

  const handleConfirm = () => {
    onConfirm(date);
  };

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

          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            onChange={onChange}
            style={styles.datePicker}
            locale="pl-PL"
          />

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
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "90%",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
    },
    datePicker: {
        width: "100%",
        height: Platform.OS === "ios" ? 300 : undefined,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 20,
    },
    buttonBase: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 20,
        elevation: 2,
        minWidth: 120,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#f44336",
    },
    confirmButton: {
        backgroundColor: "#4CAF50", 
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
});