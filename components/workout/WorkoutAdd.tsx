import { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onWorkoutCreated: (title: string) => void;
};

export default function WorkoutAdd({ onWorkoutCreated }: Props) {
  const [title, setTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);

  const handleCreateWorkout = () => {
    if (!title.trim()) {
      Alert.alert("Błąd", "Podaj tytuł treningu!");
      return;
    }

    console.log("➡️ Tworzę trening:", { description: title, workout_type: 1 });

    onWorkoutCreated(title); // 🔹 wysyłamy tytuł do rodzica
    setTitle("");
    handleCloseModal();
  };

  const handleRestDay = () => {
    console.log("😎 Dzień wolny");
    onWorkoutCreated("Dzień wolny");
  };

  return (
    <View style={styles.container}>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleOpenModal}
        >
          <Text style={styles.buttonText}>➕ Stwórz trening</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleRestDay}
        >
          <Text style={styles.buttonText}>😎 Dzień wolny</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={handleCloseModal}
      >
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
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleCreateWorkout}
              >
                <Text style={styles.buttonText}>Stwórz</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleCloseModal}
              >
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
  container: {
    width: "100%",
    alignItems: "center",
  },
  actions: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "80%",
    paddingVertical: 20,
    borderRadius: 12,
    marginVertical: 15,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#1e90ff",
  },
  secondaryButton: {
    backgroundColor: "#32cd32",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "75%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
