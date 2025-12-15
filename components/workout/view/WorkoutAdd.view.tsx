import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const COLORS = {
  overlay: 'rgba(0, 0, 0, 0.75)', 
  modalBg: '#1E1E1E',  
  inputBg: '#2C2C2C',   
  primary: '#2979FF',   
  text: '#FFFFFF',      
  textSecondary: '#B0B0B0',
};

type Props = {
  onWorkoutCreated: (description: string) => void;
  initialTitle?: string;
  modalVisible?: boolean;
  onClose?: () => void;
};

export default function WorkoutAdd({ 
  onWorkoutCreated, 
  initialTitle = "", 
  modalVisible: externalVisible, 
  onClose 
}: Props) {
  const [title, setTitle] = useState(initialTitle);

  const isControlled = externalVisible !== undefined;
  const visible = isControlled ? externalVisible : false;

  useEffect(() => {
    if (visible) {
      setTitle(initialTitle);
    }
  }, [visible, initialTitle]);

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
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeading}>Nazwij trening</Text>

          <TextInput
            style={styles.input}
            placeholder="Tytuł treningu"
            placeholderTextColor="#666"
            maxLength={30}
            value={title}
            onChangeText={setTitle}
            autoFocus={true} 
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={[styles.modalButton, styles.primaryButton]} 
              onPress={handleSave}
            >
              <Text style={styles.primaryButtonText}>Zapisz</Text>
            </TouchableOpacity>

             <TouchableOpacity 
              style={[styles.modalButton, styles.secondaryButton]} 
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: COLORS.overlay,
    padding: 20
  },
  modalContainer: { 
    width: "100%", 
    maxWidth: 340,
    backgroundColor: COLORS.modalBg, 
    padding: 24, 
    borderRadius: 20, 
    borderWidth: 1,
    borderColor: '#333', 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeading: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: COLORS.text,
    marginBottom: 8, 
    textAlign: "center" 
  },
  modalSubheading: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
    textAlign: "center"
  },
  input: { 
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    borderWidth: 1, 
    borderColor: 'transparent',
    borderRadius: 12, 
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16, 
    marginBottom: 24 
  },
  modalButtons: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    gap: 12 
  },
  modalButton: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: "center",
    justifyContent: "center"
  },
  
  primaryButton: { 
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: { 
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "bold" 
  },

  secondaryButton: { 
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
  },
  secondaryButtonText: { 
    color: COLORS.textSecondary, 
    fontSize: 16, 
    fontWeight: "600" 
  },
});