import { COLORS } from '@/constants/theme';
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
    <Modal 
        visible={visible} 
        animationType="slide" 
        presentationStyle="pageSheet" 
        onRequestClose={onClose}
    >
      <View style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Podgląd Treningu</Text>
          <View style={{ width: 28 }} /> 
        </View>

        <View style={styles.infoSection}>
          <WorkoutTitle title={workout.description || "Bez nazwy"} />
          <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.textSecondary} style={{marginRight: 6}} />
              <Text style={styles.dateText}>{workout.date}</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {loading ? (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
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
            activeOpacity={0.8}
          >
            <Ionicons name="add-circle" size={20} color="#fff" style={{marginRight: 8}} />
            <Text style={styles.addButtonText}>Dodaj ćwiczenie</Text>
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
    backgroundColor: COLORS.background, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.cardBg, 
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    padding: 5,
  },
  infoSection: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLORS.background, 
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
  },
  dateText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.cardBg, 
    paddingBottom: 40, 
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary, 
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ClientWorkoutDetailsModal;