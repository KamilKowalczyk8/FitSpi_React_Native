import { COLORS } from '@/constants/theme';
import { useUserProfileForm } from '@/hooks/diet/useUserProfileForm';
import { ActivityLevel, DietGoal, Gender } from '@/models/Profile';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
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
}

const UserProfileModal: React.FC<Props> = ({ visible, onClose }) => {

  const { 
    loading, 
    isEditing, 
    values, 
    setters, 
    saveProfile 
  } = useUserProfileForm(visible, onClose);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        
        {/* NAGŁÓWEK */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {isEditing ? 'Edytuj Profil' : 'Uzupełnij Profil'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* LOADING STATE */}
        {loading && !values.weight ? (
          <ActivityIndicator size="large" color="#34C759" style={{ marginTop: 50 }} />
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            
            {/* WAGA I WZROST */}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Waga (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={values.weight}
                  onChangeText={setters.setWeight}
                  placeholder="np. 80"
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.label}>Wzrost (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={values.height}
                  onChangeText={setters.setHeight}
                  placeholder="np. 180"
                />
              </View>
            </View>

            {/* DATA URODZENIA */}
            <View style={styles.section}>
              <Text style={styles.label}>Data urodzenia (RRRR-MM-DD)</Text>
              <TextInput
                style={styles.input}
                value={values.birthDate}
                onChangeText={setters.setBirthDate}
                placeholder="np. 1995-05-15"
                maxLength={10}
              />
            </View>

            {/* SELEKTORY (PŁEĆ, CEL, AKTYWNOŚĆ) */}
            <ChipSelector
              label="Płeć"
              options={[
                { label: 'Mężczyzna', value: Gender.MALE },
                { label: 'Kobieta', value: Gender.FEMALE },
              ]}
              value={values.gender}
              onChange={setters.setGender}
            />

            <ChipSelector
              label="Cel diety"
              options={[
                { label: 'Redukcja', value: DietGoal.LOSE_WEIGHT },
                { label: 'Utrzymanie', value: DietGoal.MAINTAIN },
                { label: 'Masa', value: DietGoal.GAIN_WEIGHT },
              ]}
              value={values.goal}
              onChange={setters.setGoal}
            />

            <ChipSelector
              label="Poziom aktywności"
              options={[
                { label: 'Brak (Biurowa)', value: ActivityLevel.SEDENTARY },
                { label: 'Lekka (1-3x)', value: ActivityLevel.LIGHT },
                { label: 'Średnia (3-5x)', value: ActivityLevel.MODERATE },
                { label: 'Duża (6-7x)', value: ActivityLevel.ACTIVE },
                { label: 'Bardzo duża (Sport)', value: ActivityLevel.VERY_ACTIVE },
              ]}
              value={values.activity}
              onChange={setters.setActivity}
            />

            <TouchableOpacity 
                            style={styles.saveButton} 
                            onPress={saveProfile}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Ionicons name="save-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                                    <Text style={styles.saveButtonText}>Zapisz i Przelicz</Text>
                                </>
                            )}
                        </TouchableOpacity>

          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  closeButton: { padding: 5 },
  closeButtonText: { fontSize: 24, color: '#333' },
  content: { padding: 20, paddingBottom: 50 },
  
  section: { marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  halfInput: { width: '48%' },
  
  label: { fontSize: 14, color: '#666', marginBottom: 8, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  
  saveButton: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary, 
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 4,
    },
    saveButtonText: { 
        color: '#fff', 
        fontSize: 16, 
        fontWeight: 'bold' 
    },
});

export default UserProfileModal;