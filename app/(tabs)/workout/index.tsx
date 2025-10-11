import { SettingsDrawer } from "@/components/SettingsDrawer";
import { DateSlider } from "@/components/workout/DateSlider";
import ExerciseList from "@/components/workout/ExerciseList";
import { ExerciseAdd } from "@/components/workout/view/ExcerciseAdd.view";
import WorkoutAdd from "@/components/workout/view/WorkoutAdd.view";
import WorkoutOptions from "@/components/workout/WorkoutOptions";
import WorkoutTitle from "@/components/workout/WorkoutTitle";
import { ExerciseController } from "@/controllers/workout/exercise.controller";
import { WorkoutController } from "@/controllers/workout/workout.controller";
import { useAuth } from "@/hooks/useAuth";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WorkoutScreen = () => {
  const { user, token } = useAuth();

  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workouts, setWorkouts] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any | null>(null);

  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [exercises, setExercises] = useState<any[]>([]);
  
  const [editingExercise, setEditingExercise] = useState<any | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!token) return;
      try {
        const data = await WorkoutController.getWorkouts(token);
        setWorkouts(data);
      } catch (error) {
        console.error(error);
        Alert.alert("Błąd", "Nie udało się pobrać treningów");
      }
    };
    fetchWorkouts();
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
        console.log("AKTUALIZACJA ĆWICZENIA (placeholder):", editingExercise.id, exerciseData);
        setExercises(prev => prev.map(ex => ex.id === editingExercise.id ? { ...ex, ...exerciseData } : ex));
        Alert.alert("Sukces", "Ćwiczenie zaktualizowane");

      } else {
        const body = {
          templateId: exerciseData.templateId,
          sets: exerciseData.sets,
          reps: exerciseData.reps,
          weight: exerciseData.weight,
          weightUnits: exerciseData.weightUnits,
          workoutId: selectedWorkout.id,
          day: new Date(selectedWorkout.date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase(),
        };
        const savedExercise = await ExerciseController.addExercise(token, body);
        setExercises((prev) => [...prev, savedExercise]);
      }
    } catch (error: any) {
      console.error("Błąd przy zapisywaniu ćwiczenia:", error);
      Alert.alert("Błąd", error.message || "Nie udało się zapisać ćwiczenia");
    } finally {
      setExerciseModalVisible(false);
      setEditingExercise(null); 
    }
  };

  const handleEditExercise = (exercise: any) => {
    setEditingExercise(exercise);
    setExerciseModalVisible(true);
  };

  const handleDeleteExercise = (exerciseId: string) => {
    Alert.alert(
      "Potwierdź usunięcie",
      "Czy na pewno chcesz usunąć to ćwiczenie?",
      [
        { text: "Anuluj", style: "cancel" },
        { text: "Usuń", style: "destructive", onPress: async () => {
          try {
            setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
            Alert.alert("Sukces", "Ćwiczenie zostało usunięte.");
          } catch(error) {
            console.error("Błąd przy usuwaniu ćwiczenia", error);
            Alert.alert("Błąd", "Nie udało się usunąć ćwiczenia.");
          }
        }},
      ]
    );
  };

  const handleCopyExercise = (exercise: any) => {
    handleSaveExercise({
      templateId: exercise.templateId,
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      weightUnits: exercise.weightUnits,
    });
    Alert.alert("Sukces", "Ćwiczenie zostało skopiowane.");
  };

  const handleDeleteWorkout = async () => {
    if (!token || !selectedWorkout) return;
    Alert.alert(
      "Potwierdź usunięcie",
      "Czy na pewno chcesz usunąć ten trening i wszystkie jego ćwiczenia?",
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
              Alert.alert("Sukces", "Trening został usunięty");
            } catch (error) {
              console.error(error);
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

  return (
    <View style={styles.container}>
      <SettingsDrawer />

      <Text style={styles.heading}>Twój trening</Text>

      <View style={styles.containerdate}>
        <DateSlider selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </View>

      {selectedWorkout ? (
        <>
          <View style={styles.titleSection}>
            <View style={styles.titleAbsolute}>
              <WorkoutTitle title={selectedWorkout.description} />
            </View>
            <WorkoutOptions
              onDeleteWorkout={handleDeleteWorkout}
              handleEditTitle={openEditModal}
            />
          </View>
          <View style={{ flex: 1, marginTop: 10 }}>
            <ExerciseList
              exercises={exercises} 
              onEditExercise={handleEditExercise}
              onDeleteExercise={handleDeleteExercise}
              onCopyExercise={handleCopyExercise}
            />
          </View>

          <View style={styles.exerciseAddSection}>
            <TouchableOpacity
              onPress={() => setExerciseModalVisible(true)}
              style={styles.addExerciseButton}
            >
              <Text style={styles.addExerciseText}>➕ Dodaj ćwiczenie</Text>
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
        </>
      ) : (
        <View style={styles.addSection}>
          <TouchableOpacity onPress={openCreateModal} style={styles.createButton}>
            <Text style={{ color: "#fff", fontSize: 18 }}>➕ Stwórz trening</Text>
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
            const updatedWorkout = await WorkoutController.updateWorkoutDescription(token, editingWorkout.id, title);
            setWorkouts((prev) => prev.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w)));
            setSelectedWorkout(updatedWorkout);
          } else {
            const newWorkout = await WorkoutController.createWorkout(token, title, selectedDate, 1);
            setWorkouts((prev) => [...prev, newWorkout]);
            setSelectedWorkout(newWorkout);
          }
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  containerdate: {
    paddingBottom: 10,
    backgroundColor: "#7fff00",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  titleAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2d1e83ff",
    width: "100%",
  },
  createButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  exerciseAddSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  addExerciseButton: {
    backgroundColor: "#32CD32",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  addExerciseText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default WorkoutScreen;