import { COLORS } from '@/constants/theme'; // Import motywu
import { DietController } from '@/controllers/diet/diet.controller';
import { useFoodSearch } from '@/hooks/diet/useFoodSearch';
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons'; // Import ikon
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
        <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
            <View style={styles.overlay}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <Text style={styles.heading}>Dodaj posiłek</Text>

                    {/* Wybór posiłku */}
                    <View style={{ marginBottom: 20 }}>
                       {/* Upewnij się, że ChipSelector też obsługuje ciemny motyw lub przekaż mu style */}
                       <ChipSelector 
                            label="" 
                            options={MEAL_TYPES} 
                            value={mealType} 
                            onChange={setMealType} 
                       />
                    </View>

                    {/* WYSZUKIWARKA */}
                    <View style={styles.searchContainer}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="search" size={20} color={COLORS.textPlaceholder} style={styles.inputIcon} />
                            <TextInput
                                style={[
                                    styles.searchInput,
                                    selectedProduct && styles.searchInputSelected,
                                ]}
                                placeholder="Szukaj produktu..."
                                placeholderTextColor={COLORS.textPlaceholder}
                                value={search}
                                onChangeText={handleSearch}
                                onFocus={() => !selectedProduct && setIsListVisible(true)}
                                editable={!selectedProduct} 
                            />
                            
                            {/* Przycisk czyszczenia */}
                            {selectedProduct && (
                                <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
                                    <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Lista wyników (Absolute) */}
                        {isListVisible && filtered.length > 0 && (
                            <View style={styles.listContainer}>
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
                            </View>
                        )}
                    </View>

                    {/* Gramatura */}
                    <View style={styles.weightSection}>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="scale-outline" size={20} color={COLORS.textPlaceholder} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Ile gramów?"
                                placeholderTextColor={COLORS.textPlaceholder}
                                keyboardType="numeric"
                                value={grams}
                                onChangeText={setGrams}
                                editable={!!selectedProduct} 
                            />
                             <Text style={styles.unitText}>g</Text>
                        </View>
                    </View>

                    {/* Przyciski */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
                            <Text style={styles.cancelButtonText}>Anuluj</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[
                                styles.saveButton, 
                                (!selectedProduct || !grams) && styles.saveButtonDisabled
                            ]} 
                            onPress={handleSave}
                            disabled={!selectedProduct || !grams || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.text} size="small" />
                            ) : (
                                <Text style={styles.saveButtonText}>Zapisz</Text>
                            )}
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
        backgroundColor: COLORS.overlay,
    },
    container: {
        width: "90%",
        backgroundColor: COLORS.modalBg,
        borderRadius: 20,
        padding: 24,
        maxHeight: '85%',
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: COLORS.text,
    },
    
    // Wrappery dla inputów
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputIcon: {
        marginRight: 10,
    },
    unitText: {
        color: COLORS.textSecondary,
        fontWeight: 'bold',
        marginLeft: 5,
    },

    // Wyszukiwarka
    searchContainer: {
        zIndex: 100, // Najważniejsze: lista musi być nad wszystkim
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        height: '100%',
    },
    searchInputSelected: {
        color: COLORS.primary, // Kolor tekstu po wybraniu produktu
        fontWeight: '600',
    },
    clearButton: {
        padding: 5,
    },

    // Lista wyników (Dropdown)
    listContainer: {
        position: 'absolute',
        top: 55, // Zaraz pod inputem
        left: 0,
        right: 0,
        maxHeight: 220,
        backgroundColor: COLORS.cardBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        elevation: 20,
        zIndex: 200, // Musi być wyżej niż reszta
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    absoluteList: {
        width: '100%',
    },
    item: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemText: { 
        fontSize: 16, 
        color: COLORS.text,
        flex: 1,
    },
    itemSubText: { 
        fontSize: 14, 
        color: COLORS.primary, // Kcal na kolorowo
        fontWeight: '600',
    },

    // Gramatura
    weightSection: {
        zIndex: 1, 
        marginBottom: 30,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.text,
        height: '100%',
    },

    // Przyciski
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 15,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: COLORS.danger,
        backgroundColor: 'transparent',
    },
    cancelButtonText: {
        color: COLORS.text,
        fontWeight: "600",
        fontSize: 16,
    },
    saveButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 3,
    },
    saveButtonDisabled: {
        backgroundColor: COLORS.border, 
        shadowOpacity: 0,
        elevation: 0,
    },
    saveButtonText: {
        color: "#fff", 
        fontWeight: "bold",
        fontSize: 16,
    },
});