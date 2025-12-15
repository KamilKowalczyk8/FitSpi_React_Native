import { COLORS } from "@/constants/theme";
import { ExerciseController } from "@/controllers/workout/exercise.controller";
import { AuthContext } from "@/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
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
    
    Alert.alert(
      "Usuń ćwiczenie",
      "Czy na pewno chcesz usunąć to ćwiczenie?",
      [
        { text: "Anuluj", style: "cancel", onPress: () => onToggle() },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            onToggle();
            try {
              await ExerciseController.deleteExercise(auth.token, exerciseId);
              onDeleted();
            } catch (err: any) {
              console.error("Błąd przy usuwaniu ćwiczenia:", err);
              Alert.alert("Błąd", err.message || "Wystąpił nieoczekiwany błąd.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onToggle}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
      >
        <Ionicons 
          name="ellipsis-vertical" 
          size={20} 
          color={COLORS.textSecondary} 
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {/* Edytuj */}
          <TouchableOpacity style={styles.optionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={18} color={COLORS.text} style={styles.icon} />
            <Text style={styles.optionText}>Edytuj</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />

          <TouchableOpacity style={styles.optionButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color={COLORS.danger} style={styles.icon} />
            <Text style={[styles.optionText, { color: COLORS.danger }]}>Usuń</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 10, 
  },
  button: {
    padding: 4,
  },
  dropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: COLORS.cardBg, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 4,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    zIndex: 20,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 14,
    color: COLORS.text, 
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 8,
  }
});

export default ExerciseOptions;