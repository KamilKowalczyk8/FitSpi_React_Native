import { ExerciseController } from "@/controllers/workout/exercise.controller";
import { WorkoutController } from "@/controllers/workout/workout.controller";
import { useAuth } from "@/hooks/useAuth";
import { useWorkoutCopy } from "@/hooks/useWorkoutCopy";
import { Workout } from "@/models/Workout";
import { ExerciseResponse } from "@/types/exercise.types";
import { isSameDay } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { Alert, DeviceEventEmitter } from 'react-native';

export const useWorkoutScreen = () => {
  const { token } = useAuth();
  const { isCopying, copyWorkout } = useWorkoutCopy(token);

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [exercises, setExercises] = useState<ExerciseResponse[]>([]);
  const [editingExercise, setEditingExercise] = useState<ExerciseResponse | null>(null);


  const fetchWorkouts = useCallback(async () => {
    if (!token) return;
    try {
      const data = await WorkoutController.getWorkouts(token) as Workout[];
      const acceptedWorkouts = data.filter((w) => w.status === 'accepted');
      setWorkouts(acceptedWorkouts);
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się pobrać treningów");
    }
  }, [token]);

  useEffect(() => {
    fetchWorkouts();
    const subscription = DeviceEventEmitter.addListener('event.refreshWorkouts', fetchWorkouts);
    return () => subscription.remove();
  }, [fetchWorkouts]);

  useEffect(() => {
    const workout = workouts.find((w) =>
      isSameDay(new Date(w.date), new Date(selectedDate))
    );
    setSelectedWorkout(workout || null);
  }, [selectedDate, workouts]);

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


  const handleSaveWorkout = async (title: string) => {
    if (!token) return;
    try {
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
      setWorkoutModalVisible(false);
    } catch (error) {
        console.error(error);
        Alert.alert("Błąd", "Nie udało się zapisać treningu");
    }
  };

  const handleDeleteWorkout = async () => {
    if (!token || !selectedWorkout) return;
    
    Alert.alert("Potwierdź usunięcie", "Czy na pewno chcesz usunąć ten trening?", [
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
    ]);
  };

  const handleOpenCreateModal = () => {
    setEditingWorkout(null);
    setWorkoutModalVisible(true);
  };

  const handleOpenEditModal = () => {
    if (!selectedWorkout) return;
    setEditingWorkout(selectedWorkout);
    setWorkoutModalVisible(true);
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

  const handleCloseExerciseModal = () => {
    setExerciseModalVisible(false);
    setEditingExercise(null);
  };

  return {
    selectedDate,
    selectedWorkout,
    exercises,
    editingWorkout,
    editingExercise,
    
    workoutModalVisible,
    copyModalVisible,
    exerciseModalVisible,
    isCopying,

    setSelectedDate,
    setExercises,
    setWorkoutModalVisible,
    setCopyModalVisible,
    setExerciseModalVisible,
    
    handleSaveWorkout,
    handleDeleteWorkout,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleConfirmCopy,
    handleSaveExercise,
    handleEditExercise,
    handleCloseExerciseModal
  };
};