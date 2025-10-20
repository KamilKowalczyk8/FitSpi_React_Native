import { ExerciseController } from "@/controllers/workout/exercise.controller";
import { WorkoutController } from "@/controllers/workout/workout.controller";
import { Workout } from "@/models/Workout";
import { ExerciseResponse } from "@/types/exercise.types";
import { isSameDay } from "date-fns";
import { useState } from "react";
import { Alert } from "react-native";

export const useWorkoutCopy = (token: string | null) => {
  const [isCopying, setIsCopying] = useState(false);

  const copyWorkout = async (
    workoutToCopy: Workout,
    exercisesToCopy: ExerciseResponse[],
    targetDate: Date
  ): Promise<Workout | null> => {
    if (!token) {
      Alert.alert("Błąd", "Brak autoryzacji. Spróbuj zalogować się ponownie.");
      return null;
    }

    if (isSameDay(new Date(workoutToCopy.date), targetDate)) {
      Alert.alert("Błąd", "Nie można skopiować treningu na ten sam dzień.");
      return null;
    }

    setIsCopying(true);
    Alert.alert("Kopiowanie", "Trwa kopiowanie treningu...");

    try {
      const newWorkout = await WorkoutController.createWorkout(
        token,
        workoutToCopy.description || "Skopiowany trening",
        targetDate,
        workoutToCopy.workout_type
      );

      const newDay = targetDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      const exercisePromises = exercisesToCopy.map((exercise) => {
        const exerciseBody = {
          templateId: exercise.templateId,
          sets: exercise.sets,
          reps: exercise.reps,
          weight: exercise.weight,
          weightUnits: exercise.weightUnits,
          workoutId: newWorkout.id,
          day: newDay,
        };
        return ExerciseController.addExercise(token, exerciseBody);
      });

      await Promise.all(exercisePromises);

      Alert.alert("Sukces!", "Trening został skopiowany.");
      return newWorkout;
    } catch (error: any) {
      console.error("Błąd podczas kopiowania treningu:", error);
      Alert.alert("Błąd", error.message || "Nie udało się skopiować treningu.");
      return null;
    } finally {
      setIsCopying(false);
    }
  };

  return { isCopying, copyWorkout };
};
