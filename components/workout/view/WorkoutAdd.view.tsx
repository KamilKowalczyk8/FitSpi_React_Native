import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  onWorkoutCreated: (description: string) => void;
  initialTitle?: string;
  modalVisible?: boolean;
  onClose?: () => void;
};

export default function WorkoutAdd({ onWorkoutCreated, initialTitle = "", modalVisible: externalVisible, onClose }: Props) {
  const [title, setTitle] = useState(initialTitle);

  const isControlled = externalVisible !== undefined;
  const visible = isControlled ? externalVisible : false;

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Błąd", "Podaj tytuł treningu!");
      return;
    }
    onWorkoutCreated(title);
    setTitle(""); 
    onClose?.();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Tytuł treningu</Text>
          <TextInput
            style={styles.input}
            placeholder="Tytuł treningu (max 30 znaków)"
            maxLength={30}
            value={title}
            onChangeText={setTitle}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={[styles.modalButton, styles.primaryButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Zapisz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, styles.secondaryButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  container: { width: "100%", alignItems: "center" },
  button: { width: "80%", paddingVertical: 20, borderRadius: 12, marginVertical: 15, alignItems: "center" },
  primaryButton: { backgroundColor: "#1e90ff" },
  secondaryButton: { backgroundColor: "#32cd32" },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.4)" },
  modalContainer: { width: "75%", backgroundColor: "#fff", padding: 20, borderRadius: 12 },
  modalHeading: { fontSize: 16, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, fontSize: 15, marginBottom: 15 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  modalButton: { flex: 1, paddingVertical: 15, borderRadius: 10, alignItems: "center" },
});