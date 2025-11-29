import { DietController } from '@/controllers/diet/diet.controller';
import { useFoodSearch } from '@/hooks/diet/useFoodSearch';
import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ChipSelector } from '../../app/utils/ChipSelector';

interface Props {
  visible: boolean;
  onClose: () => void;
  date: Date;
  onAdded: () => void;
}

const MEAL_TYPES = [
    { label: 'Śniadanie', value: 1 },
    { label: 'Lunch', value: 2 },
    { label: 'Obiad', value: 3 },
    { label: 'Przekąska', value: 4 },
    { label: 'Kolacja', value: 5 },
];

export const AddFoodModal: React.FC<Props> = ({ visible, onClose, date, onAdded }) => {
  const { token } = useAuth();
  
  const {
    search,
    filtered,
    selectedProduct,
    isListVisible,
    handleSearch,
    handleProductSelect,
    handleClear,
    setIsListVisible
  } = useFoodSearch();

  const [mealType, setMealType] = useState(1);
  const [grams, setGrams] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!token || !selectedProduct || !grams) return;

    setLoading(true);
    try {
        await DietController.addFood(token, {
            productId: selectedProduct.id,
            date: date,
            meal: mealType,
            grams: parseFloat(grams)
        });
        onAdded(); 
        handleClose();
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleClose = () => {
    handleClear(); 
    setGrams('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
          <Text style={styles.heading}>Dodaj posiłek</Text>

          {/* Wybór posiłku */}
          <View style={{marginBottom: 15}}>
             <ChipSelector 
                label="" 
                options={MEAL_TYPES} 
                value={mealType} 
                onChange={setMealType} 
             />
          </View>

          {/* WYSZUKIWARKA (Wzorowana na ExerciseAdd) */}
          <View style={styles.searchContainer}>
            <TextInput
              style={[
                styles.searchInput,
                selectedProduct && styles.searchInputSelected,
              ]}
              placeholder="Szukaj produktu..."
              value={search}
              onChangeText={handleSearch}
              onFocus={() => !selectedProduct && setIsListVisible(true)}
              editable={!selectedProduct} 
            />

            {/* Przycisk czyszczenia (X) */}
            {selectedProduct && (
              <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                <Text style={styles.clearButtonText}>✖</Text>
              </TouchableOpacity>
            )}

            {/* Lista wyników (Absolute) */}
            {isListVisible && filtered.length > 0 && (
              <FlatList
                data={filtered}
                keyExtractor={(item) => item.id.toString()}
                style={styles.absoluteList}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => handleProductSelect(item)}
                  >
                    <View style={styles.itemRow}>
                        <Text style={styles.itemText}>{item.name}</Text>
                        <Text style={styles.itemSubText}>{item.kcal} kcal</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          {/* Gramatura i podsumowanie */}
          <View style={styles.weightSection}>
            <TextInput
                style={styles.input}
                placeholder="Ile gramów?"
                keyboardType="numeric"
                value={grams}
                onChangeText={setGrams}
                editable={!!selectedProduct} 
            />
            
          </View>

          {/* Przyciski */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.saveButton, (!selectedProduct || !grams) && {backgroundColor: '#ccc'}]} 
              onPress={handleSave}
              disabled={!selectedProduct || !grams || loading}
            >
              {loading ? (
                  <ActivityIndicator color="#fff" />
              ) : (
                  <Text style={styles.buttonText}>Zapisz</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.buttonText}>Anuluj</Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
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
    // MaxHeight pozwala klawiaturze nie zasłaniać wszystkiego
    maxHeight: '80%' 
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  
  // Wyszukiwarka
  searchContainer: {
    zIndex: 10, // Ważne, żeby lista była nad innymi elementami
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  searchInputSelected: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    color: '#333'
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#888',
  },

  // Lista wyników (Dropdown)
  absoluteList: {
    position: 'absolute',
    top: 50, // Zaraz pod inputem
    left: 0,
    right: 0,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 5, // Cień na Androidzie
    shadowColor: '#000', // Cień na iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    zIndex: 20,
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: { fontSize: 16, color: '#333' },
  itemSubText: { fontSize: 14, color: '#888' },

  // Gramatura
  weightSection: {
    zIndex: 1, // Poniżej listy wyszukiwania
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  summaryText: {
    marginTop: 8,
    color: '#34C759',
    fontWeight: '600',
    textAlign: 'center',
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
});