import { ExerciseController } from "@/controllers/workout/exercise.controller";
import { AuthContext } from "@/providers/AuthProvider";
import { useContext } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  exerciseId: number;      
  onDeleted: () => void;     
};

const ExerciseOptions = ({ isOpen, onToggle, onEdit, exerciseId, onDeleted }: Props) => {
  const auth = useContext(AuthContext);

  const handleDelete = async () => {
    if (!auth?.token) {
      Alert.alert("Błąd", "Brak tokenu – zaloguj się ponownie.");
      return;
    }
    onToggle();

    try {
      await ExerciseController.deleteExercise(auth.token, exerciseId);
      onDeleted();

    } catch (err: any) {
      console.error("Błąd przy usuwaniu ćwiczenia:", err);
      Alert.alert("Błąd", err.message || "Wystąpił nieoczekiwany błąd.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onToggle}>
        <Text style={styles.buttonText}>⚙️</Text>
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.optionButton} onPress={onEdit}>
            <Text style={styles.optionText}>✏️ Edytuj</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={handleDelete}>
            <Text style={[styles.optionText, { color: "red" }]}>🗑️ Usuń</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 20,
  },
  dropdown: {
    position: 'absolute',
    top: 35,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 100,
    minWidth: 120,
  },
  optionButton: {
    paddingVertical: 8,
  },
  optionText: {
    fontSize: 16,
    textAlign: 'left',
  },
});

export default ExerciseOptions;