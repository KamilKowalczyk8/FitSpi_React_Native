import { useExerciseSearch } from '@/hooks/useExerciseSearch';
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Switch,
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
    weightUnits: "kg" | "lbs";
  }) => void;
  initialData?: any;
}

export const ExerciseAdd: React.FC<ExerciseAddProps> = ({
  modalVisible,
  onClose,
  onExerciseAdded,
  initialData,
}) => {
  const {
    filtered,
    search,
    selectedTemplate,
    isListVisible,
    handleSearch,
    handleTemplateSelect,
    handleInputFocus,
    handleInputBlur,
    handleClear, 
    setSelectedTemplate, 
    setSearch,
  } = useExerciseSearch();
  
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");

useEffect(() => {
    if (modalVisible && initialData) {
      
      const template = {
        id: initialData.templateId,
        name: initialData.name,
      };
      setSelectedTemplate(template);
      setSearch(initialData.name); 

      setSets(String(initialData.sets || ""));
      setReps(String(initialData.reps || ""));
      setWeight(String(initialData.weight || ""));
      setUnit(initialData.weightUnits || "kg");
    }

  }, [modalVisible, initialData, setSelectedTemplate, setSearch]);

  const handleSave = () => {
    if (!selectedTemplate || !sets || !reps) return;

    onExerciseAdded({
      templateId: selectedTemplate.id,
      name: selectedTemplate.name,
      sets: Number(sets),
      reps: Number(reps),
      weight: weight ? Number(weight) : undefined,
      weightUnits: unit,
    });

    handleClear(); 
    setSets("");
    setReps("");
    setWeight("");
    onClose();
  };

  const handleCloseModal = () => {
    handleClear();
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
      onRequestClose={handleCloseModal}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Dodaj ćwiczenie</Text>

          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.searchInput,
                selectedTemplate && styles.searchInputSelected,
              ]}
              placeholder="Wpisz nazwę ćwiczenia..."
              value={search} 
              editable={!selectedTemplate} 
              onChangeText={handleSearch}
              onFocus={handleInputFocus} 
              onBlur={handleInputBlur}
            />

            {selectedTemplate && (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClear} 
              >
                <Text style={styles.clearButtonText}>✖</Text>
              </TouchableOpacity>
            )}

            {isListVisible && (
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                style={styles.absoluteList}
                keyboardShouldPersistTaps="handled" 
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => handleTemplateSelect(item)}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.noResults}>Brak wyników dla "{search}"</Text>
                }
              />
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Serie"
            keyboardType="numeric"
            value={sets}
            onChangeText={setSets}
            editable={!!selectedTemplate}
          />
          <TextInput
            style={styles.input}
            placeholder="Powtórzenia"
            keyboardType="numeric"
            value={reps}
            onChangeText={setReps}
            editable={!!selectedTemplate}
          />
          <View style={styles.weightRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Ciężar (opcjonalnie)"
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
              editable={!!selectedTemplate}
            />

          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, unit === "kg" && styles.switchLabelActive]}>
            kg
            </Text>
            <Switch
              value={unit === "lbs"}
              onValueChange={(val) => setUnit(val ? "lbs" : "kg")}
              disabled={!selectedTemplate}
            />
            <Text style={[styles.switchLabel, unit === "lbs" && styles.switchLabelActive]}>
            lbs
            </Text>
          </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                !selectedTemplate && {backgroundColor: '#ccc'}
              ]} 
              onPress={handleSave}
              disabled={!selectedTemplate}
            >
              <Text style={styles.buttonText}>Zapisz</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
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
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  
  searchContainer: {
    zIndex: 10,
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    zIndex: 11, 
  },
  searchInputSelected: {
    backgroundColor: '#f0f0f0', 
    fontWeight: 'bold',
    paddingRight: 40, 
  },
  
  clearButton: {
    position: 'absolute',
    right: 5,
    top: 5,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 12,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#888',
    fontWeight: 'bold',
  },

  absoluteList: {
    position: 'absolute', 
    top: 50, 
    left: 0,
    right: 0,
    maxHeight: 180, 
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    padding: 5,
  },

  item: {
    padding: 10,
    borderRadius: 6,
    marginVertical: 1, 
  },
  itemText: {
    fontSize: 15,
  },
  noResults: {
    textAlign: "center",
    color: "#888",
    paddingVertical: 10, 
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
    marginTop: 10, 
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
  weightRow: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 10,
},
switchContainer: {
  flexDirection: "row",
  alignItems: "center",
  marginLeft: 10,
},
switchLabel: {
  fontSize: 16,
  color: "#888",
  marginHorizontal: 4,
},
switchLabelActive: {
  color: "#000",
  fontWeight: "bold",
},

});