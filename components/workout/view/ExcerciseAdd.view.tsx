import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface ExerciseTemplate {
  id: number;
  name: string;
}

interface ExerciseAddProps {
  modalVisible: boolean;
  onClose: () => void;
  onExerciseAdded: (exercise: {
    templateId: number;
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }) => void;
}

const ExerciseAdd: React.FC<ExerciseAddProps> = ({
  modalVisible,
  onClose,
  onExerciseAdded,
}) => {
  const [templates, setTemplates] = useState<ExerciseTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<number | undefined>(undefined);
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

 useEffect(() => {
  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/exercise-templates`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setTemplates(data);
        if (data.length > 0) setSelectedTemplate(data[0].id);
      } else {
        console.warn("Oczekiwana tablica templatek, otrzymano:", data);
        setTemplates([]);
      }
    } catch (err) {
      console.error("Błąd przy pobieraniu ćwiczeń:", err);
    }
  };
  fetchTemplates();
}, []);


  const handleSave = () => {
    if (!selectedTemplate || !sets || !reps) return;

    const template = templates.find(t => t.id === selectedTemplate);
    if (!template) return;

    onExerciseAdded({
      templateId: selectedTemplate,
      name: template.name,
      sets: Number(sets),
      reps: Number(reps),
      weight: weight ? Number(weight) : undefined,
    });

    setSets("");
    setReps("");
    setWeight("");
    onClose();
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Dodaj ćwiczenie</Text>

          <Picker
            selectedValue={selectedTemplate}
            onValueChange={(itemValue: string | number) => setSelectedTemplate(Number(itemValue))}
            style={styles.picker}
          >
            {Array.isArray(templates) && templates.map(template => (
                <Picker.Item key={template.id} label={template.name} value={template.id} />
            ))}

          </Picker>

          <TextInput
            style={styles.input}
            placeholder="Serie"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
          />
          <TextInput
            style={styles.input}
            placeholder="Powtórzenia"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
          />
          <TextInput
            style={styles.input}
            placeholder="Ciężar (opcjonalnie)"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Zapisz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Anuluj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  picker: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#aaa",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#1e90ff",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ExerciseAdd;
