import { SettingsDrawer } from "@/components/SettingsDrawer";
import { DateSlider } from "@/components/workout/DateSlider";
import ExerciseList from "@/components/workout/ExerciseList";
import { CopyWorkoutModal } from "@/components/workout/view/CopyWorkoutModal";
import { ExerciseAdd } from "@/components/workout/view/ExcerciseAdd.view";
import WorkoutAdd from "@/components/workout/view/WorkoutAdd.view";
import WorkoutOptions from "@/components/workout/WorkoutOptions";
import WorkoutTitle from "@/components/workout/WorkoutTitle";
import { ExerciseController } from "@/controllers/workout/exercise.controller";
import { WorkoutController } from "@/controllers/workout/workout.controller";
import { useAuth } from "@/hooks/useAuth";
import { useWorkoutCopy } from "@/hooks/useWorkoutCopy";
import { Workout } from "@/models/Workout";
import { ExerciseResponse } from "@/types/exercise.types";
import { Ionicons } from '@expo/vector-icons';
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, DeviceEventEmitter, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  background: '#121212',
  cardBg: '#1E1E1E',
  primary: '#2979FF', 
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  success: '#00C853', 
};

const WorkoutScreen = () => {
  const { user, token } = useAuth();
  const { isCopying, copyWorkout } = useWorkoutCopy(token);

  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isCopyModalVisible, setCopyModalVisible] = useState(false);

  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [editingExercise, setEditingExercise] = useState<ExerciseResponse | null>(null);

  const fetchWorkouts = async () => {
    if (!token) return;
    try {
      const data = await WorkoutController.getWorkouts(token) as Workout[];
      const acceptedWorkouts = data.filter((w) => w.status === 'accepted');
      setWorkouts(acceptedWorkouts);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się pobrać treningów");
    }
  };

  useEffect(() => {
    fetchWorkouts();
    const subscription = DeviceEventEmitter.addListener('event.refreshWorkouts', () => {
      fetchWorkouts();
    });
    return () => subscription.remove();
  }, [token]);

  useEffect(() => {
    const fetchExercises = async () => {
      if (!token || !selectedWorkout) {
        setExercises([]);
        return;
      }
      try {
        const allExercises = await ExerciseController.getExercises(token);
        const workoutExercises = allExercises.filter(
          (ex) => ex.workoutId === selectedWorkout.id
        );
        setExercises(workoutExercises);
      } catch (error) {
        console.error("Błąd przy pobieraniu ćwiczeń:", error);
        setExercises([]);
      }
    };
    fetchExercises();
  }, [token, selectedWorkout]);

  useEffect(() => {
    const workout = workouts.find((w) =>
      isSameDay(new Date(w.date), new Date(selectedDate))
    );
    setSelectedWorkout(workout || null);
  }, [selectedDate, workouts]);

  const handleSaveExercise = async (exerciseData: any) => {
    if (!token || !selectedWorkout) {
      Alert.alert("Błąd", "Brak wybranego treningu.");
      return;
    }
    try {
      if (editingExercise) {
        const body = {
          sets: exerciseData.sets,
          reps: exerciseData.reps,
          weight: exerciseData.weight,
          weightUnits: exerciseData.weightUnits,
        };
        const updatedExercise = await ExerciseController.updateExercise(
          token,
          editingExercise.id,
          body
        );
        setExercises((prev) =>
          prev.map((ex) => (ex.id === editingExercise.id ? updatedExercise : ex))
        );
      } else {
        const body = {
          templateId: exerciseData.templateId,
          sets: exerciseData.sets,
          reps: exerciseData.reps,
          weight: exerciseData.weight,
          weightUnits: exerciseData.weightUnits,
          workoutId: selectedWorkout.id,
        };
        const savedExercise = await ExerciseController.addExercise(token, body);
        setExercises((prev) => [...prev, savedExercise]);
      }
    } catch (error: any) {
      Alert.alert("Błąd", error.message || "Nie udało się zapisać ćwiczenia");
    } finally {
      setExerciseModalVisible(false);
      setEditingExercise(null);
    }
  };

  const handleEditExercise = (exercise: ExerciseResponse) => {
    setEditingExercise(exercise);
    setExerciseModalVisible(true);
  };

  const handleDeleteWorkout = async () => {
    if (!token || !selectedWorkout) return;
    Alert.alert(
      "Potwierdź usunięcie",
      "Czy na pewno chcesz usunąć ten trening?",
      [
        { text: "Anuluj", style: "cancel" },
        {
          text: "Usuń",
          style: "destructive",
          onPress: async () => {
            try {
              await WorkoutController.deleteWorkout(token, selectedWorkout.id);
              setWorkouts((prev) => prev.filter((w) => w.id !== selectedWorkout.id));
              setSelectedWorkout(null);
            } catch (error) {
              Alert.alert("Błąd", "Nie udało się usunąć treningu");
            }
          },
        },
      ]
    );
  };

  const openCreateModal = () => {
    setEditingWorkout(null);
    setModalVisible(true);
  };

  const openEditModal = () => {
    if (!selectedWorkout) return;
    setEditingWorkout(selectedWorkout);
    setModalVisible(true);
  };

  const handleOpenCopyModal = () => {
    if (!selectedWorkout) return;
    setCopyModalVisible(true);
  };

  const handleConfirmCopy = async (targetDate: Date) => {
    if (isCopying || !selectedWorkout) return;
    setCopyModalVisible(false);
    const newWorkout = await copyWorkout(selectedWorkout, exercises, targetDate);
    if (newWorkout) {
      setWorkouts((prev) => [...prev, newWorkout]);
      setSelectedDate(targetDate);
    }
  };

  return (
    <View style={styles.container}>
      <SettingsDrawer />

      <Text style={styles.heading}>Twój trening</Text>

      <View style={styles.containerdate}>
        <DateSlider selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </View>

      {selectedWorkout ? (
        <View style={{ flex: 1 }}>
          <View style={styles.titleSection}>
            <View style={styles.titleAbsolute}>
              <WorkoutTitle title={selectedWorkout.description || ""} color={COLORS.text} />
            </View>
            <WorkoutOptions
              onDeleteWorkout={handleDeleteWorkout}
              handleEditTitle={openEditModal}
              handleCopyWorkout={handleOpenCopyModal}
            />
          </View>

          <View style={{ flex: 1, marginTop: 1 }}>
            <ExerciseList
              exercises={exercises}
              setExercises={setExercises}
              onEdit={handleEditExercise}
            />
          </View>

          <View style={styles.exerciseAddSection}>
            <TouchableOpacity
              onPress={() => setExerciseModalVisible(true)}
              style={styles.addExerciseButton}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.addExerciseText}>Dodaj ćwiczenie</Text>
            </TouchableOpacity>

            <ExerciseAdd
              modalVisible={exerciseModalVisible}
              onClose={() => {
                setExerciseModalVisible(false);
                setEditingExercise(null);
              }}
              onExerciseAdded={handleSaveExercise}
              initialData={editingExercise}
            />
          </View>
        </View>
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIconBg}>
            <Ionicons name="barbell-outline" size={60} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyStateTitle}>Dzień wolny?</Text>
          <Text style={styles.emptyStateSubtitle}>
            Nie masz zaplanowanego treningu na ten dzień.
          </Text>

          <TouchableOpacity 
            onPress={openCreateModal} 
            style={styles.createWorkoutButton}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFF" />
            <Text style={styles.createWorkoutButtonText}>Stwórz trening</Text>
          </TouchableOpacity>
        </View>
      )}

      <WorkoutAdd
        modalVisible={modalVisible}
        initialTitle={editingWorkout?.description || ""}
        onClose={() => setModalVisible(false)}
        onWorkoutCreated={async (title) => {
          if (!token) return;
          if (editingWorkout) {
            const updatedWorkout = await WorkoutController.updateWorkoutDescription(
              token,
              editingWorkout.id,
              title
            );
            setWorkouts((prev) =>
              prev.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w))
            );
            setSelectedWorkout(updatedWorkout);
          } else {
            const newWorkout = await WorkoutController.createWorkout(
              token,
              title,
              selectedDate,
              1
            );
            setWorkouts((prev) => [...prev, newWorkout]);
            setSelectedWorkout(newWorkout);
          }
          setModalVisible(false);
        }}
      />

      <CopyWorkoutModal
        isVisible={isCopyModalVisible}
        onClose={() => setCopyModalVisible(false)}
        onConfirm={handleConfirmCopy}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, 
    backgroundColor: COLORS.background, 
  },
  containerdate: {
    paddingBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
    color: COLORS.text, 
    letterSpacing: 0.5,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: COLORS.cardBg, 
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    position: "relative",
  },
  titleAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  emptyStateIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1E2A38', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  createWorkoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary, 
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30, 
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  createWorkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

 
  exerciseAddSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  addExerciseButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg, 
    borderWidth: 1,
    borderColor: COLORS.primary, 
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  addExerciseText: {
    color: COLORS.primary, 
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutScreen;