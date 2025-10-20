import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onDeleteWorkout: () => void;
  handleEditTitle: () => void;
  handleCopyWorkout?: () => void;
};

const WorkoutOptions = ({ onDeleteWorkout, handleEditTitle, handleCopyWorkout, }: Props) => {
  const [open, setOpen] = useState(false);

  const toggleOptions = () => setOpen(!open);

  const handleEditAndClose = () => {
    handleEditTitle();
    setOpen(false); 
  };

  const handleDeleteAndClose = () => {
    onDeleteWorkout();
    setOpen(false); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={toggleOptions}>
        <Text style={styles.buttonText}>⚙️</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.optionButton} onPress={handleEditAndClose}>
            <Text style={styles.optionText}>✏️ Zmień tytuł</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleCopyWorkout}>
            <Text style={styles.optionText}>🏋️‍♂️ Kopiuj trening</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleDeleteAndClose}>
            <Text style={[styles.optionText, { color: "red" }]}>🗑️ Usuń trening</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ff8c00",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 100,
    minWidth: 180,
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    textAlign: "left",
  },
});

export default WorkoutOptions;
