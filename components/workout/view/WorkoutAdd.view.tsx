import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { WorkoutType } from '../../../models/Workout';

type Props = {
  onWorkoutCreated: (description: string, type?: WorkoutType) => void;
};

export default function WorkoutAdd({ onWorkoutCreated }: Props) {
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateWorkout = () => {
    if (!title.trim()) {
      Alert.alert("Błąd", "Podaj tytuł treningu!");
      return;
    }

    onWorkoutCreated(title, WorkoutType.Training);
    setTitle("");
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>➕ Stwórz trening</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
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
              <TouchableOpacity style={[styles.modalButton, styles.primaryButton]} onPress={handleCreateWorkout}>
                <Text style={styles.buttonText}>Stwórz</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.secondaryButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Anuluj</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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