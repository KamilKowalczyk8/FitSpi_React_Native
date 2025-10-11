import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: () => void;
};

const ExerciseOptions = ({ isOpen, onToggle, onEdit, onDelete, onCopy }: Props) => {

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
          <TouchableOpacity style={styles.optionButton} onPress={onCopy}>
            <Text style={styles.optionText}>📄 Kopiuj</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={onDelete}>
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