import { useExerciseSearch } from '@/hooks/useExerciseSearch';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Switch,
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
  border: '#333333',
  danger: '#FF5252',
};


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
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>
            {initialData ? "Edytuj ćwiczenie" : "Dodaj ćwiczenie"}
          </Text>

          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
                <TextInput
                style={[
                    styles.searchInput,
                    selectedTemplate && styles.searchInputSelected,
                ]}
                placeholder="Wpisz nazwę ćwiczenia..."
                placeholderTextColor="#666"
                value={search} 
                editable={!selectedTemplate} 
                onChangeText={handleSearch}
                onFocus={handleInputFocus} 
                onBlur={handleInputBlur}
                />
                
                {!search && !selectedTemplate && (
                    <Ionicons name="search" size={20} color="#666" style={styles.inputIcon} />
                )}
            </View>

            {selectedTemplate && (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={handleClear} 
              >
                <Ionicons name="close-circle" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            )}

            {isListVisible && (
              <View style={styles.dropdownContainer}>
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
              </View>
            )}
          </View>

          <View style={styles.formRow}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Serie</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={sets}
                    onChangeText={setSets}
                    editable={!!selectedTemplate}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Powt.</Text>
                <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                    value={reps}
                    onChangeText={setReps}
                    editable={!!selectedTemplate}
                />
              </View>
          </View>

          <View style={styles.weightRow}>
            <View style={{ flex: 1 }}>
                <Text style={styles.label}>Ciężar</Text>
                <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                editable={!!selectedTemplate}
                />
            </View>

            <View style={styles.switchContainer}>
              <Text style={[styles.switchLabel, unit === "kg" && styles.switchLabelActive]}>
                kg
              </Text>
              <Switch
                value={unit === "lbs"}
                onValueChange={(val) => setUnit(val ? "lbs" : "kg")}
                disabled={!selectedTemplate}
                trackColor={{ false: "#555", true: COLORS.primary }}
                thumbColor={"#FFF"}
              />
              <Text style={[styles.switchLabel, unit === "lbs" && styles.switchLabelActive]}>
                lbs
              </Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
              <Text style={styles.cancelButtonText}>Anuluj</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                !selectedTemplate && styles.saveButtonDisabled
              ]} 
              onPress={handleSave}
              disabled={!selectedTemplate}
            >
              <Text style={styles.saveButtonText}>Zapisz</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.overlay,
    padding: 20,
  },
  container: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: COLORS.modalBg,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
    color: COLORS.text,
  },
  
  searchContainer: {
    zIndex: 20, 
    marginBottom: 16,
    position: 'relative',
  },
  inputWrapper: {
      position: 'relative',
      justifyContent: 'center',
  },
  searchInput: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 12,
    padding: 14,
    paddingRight: 40, 
    fontSize: 16,
  },
  searchInputSelected: {
    borderColor: COLORS.primary,
    fontWeight: '600',
  },
  inputIcon: {
      position: 'absolute',
      right: 12,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 12,
    zIndex: 22,
  },

  dropdownContainer: {
    position: 'absolute',
    top: 55, 
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#252525', 
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 100, 
    elevation: 10,
  },
  absoluteList: {
    flexGrow: 0,
  },
  item: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  itemText: {
    fontSize: 15,
    color: COLORS.text,
  },
  noResults: {
    textAlign: "center",
    color: COLORS.textSecondary,
    padding: 15,
  },

  formRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12,
  },
  halfInput: {
      flex: 1,
  },
  label: {
      fontSize: 12,
      color: COLORS.textSecondary,
      marginBottom: 6,
      marginLeft: 4,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  
  weightRow: {
    flexDirection: "row",
    alignItems: "flex-end", 
    marginBottom: 30,
    gap: 12,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    height: 56, 
  },
  switchLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginHorizontal: 6,
  },
  switchLabelActive: {
    color: COLORS.text,
    fontWeight: "bold",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#444',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
      backgroundColor: '#333',
      opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: "bold",
    fontSize: 16,
  },
});