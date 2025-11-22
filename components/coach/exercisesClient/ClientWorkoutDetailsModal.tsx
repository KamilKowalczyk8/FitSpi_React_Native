import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import ExerciseList from "@/components/workout/ExerciseList";
import { ExerciseAdd } from "@/components/workout/view/ExcerciseAdd.view";
import WorkoutTitle from "@/components/workout/WorkoutTitle";

import { ExerciseController } from "@/controllers/workout/exercise.controller";
import { useAuth } from "@/hooks/useAuth";
import { WorkoutItem } from "@/models/Workout";
import { ExerciseResponse } from "@/types/exercise.types";

interface Props {
  visible: boolean;
  onClose: () => void;
  workout: WorkoutItem | null;
}

const ClientWorkoutDetailsModal: React.FC<Props> = ({ visible, onClose, workout }) => {
  const { token } = useAuth();
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [isAddExerciseVisible, setAddExerciseVisible] = useState(false);

  useEffect(() => {
    if (visible && workout && token) {
      fetchExercises();
    }
  }, [visible, workout, token]);

  const fetchExercises = async () => {
    if (!token || !workout) return;
    setLoading(true);
    try {
      const allExercises = await ExerciseController.getExercises(token);
      const filtered = allExercises.filter(ex => ex.workoutId === workout.id);
      
      setExercises(filtered);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się pobrać ćwiczeń");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExercise = async (exerciseData: any) => {
    if (!token || !workout) return;
    try {
      const body = {
        templateId: exerciseData.templateId,
        sets: exerciseData.sets,
        reps: exerciseData.reps,
        weight: exerciseData.weight,
        weightUnits: exerciseData.weightUnits,
        workoutId: workout.id,
      };

      const newExercise = await ExerciseController.addExercise(token, body);
      setExercises(prev => [...prev, newExercise]);
      setAddExerciseVisible(false);
      Alert.alert("Sukces", "Dodano ćwiczenie");
    } catch (error: any) {
      Alert.alert("Błąd", error.message || "Nie udało się dodać ćwiczenia");
    }
  };

  if (!workout) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        
        {/* Nagłówek */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Podgląd Treningu</Text>
          {/* Upewnij się, że ten View jest zamknięty i nie ma spacji w środku */}
          <View style={{ width: 28 }} /> 
        </View>

        {/* Tytuł i Data */}
        <View style={styles.infoSection}>
          <WorkoutTitle title={workout.description || "Bez nazwy"} />
          <Text style={styles.dateText}>{workout.date}</Text>
        </View>

        {/* Lista ćwiczeń */}
        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#34C759" style={{ marginTop: 20 }} />
          ) : (
            <ExerciseList
              exercises={exercises}
              setExercises={setExercises}
              onEdit={() => {}} 
            />
          )}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => setAddExerciseVisible(true)}
          >
            <Text style={styles.addButtonText}>➕ Dodaj ćwiczenie</Text>
          </TouchableOpacity>
        </View>

        <ExerciseAdd 
          modalVisible={isAddExerciseVisible}
          onClose={() => setAddExerciseVisible(false)}
          onExerciseAdded={handleAddExercise}
          initialData={null}
        />

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  infoSection: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    marginTop: 5,
    color: '#666',
  },
  listContainer: {
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ClientWorkoutDetailsModal;