import { ExerciseResponse } from "@/types/exercise.types";

export const ExerciseController = {
  getExercises: async (token: string): Promise<ExerciseResponse[]> => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/exercises`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    console.log("📥 API /exercise returned:", result);
    if (!response.ok) throw new Error(result.message || "Nie udało się pobrać ćwiczeń");
    return result as ExerciseResponse[];
  },

  addExercise: async (token: string, body: Partial<ExerciseResponse>): Promise<ExerciseResponse> => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/exercises`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Nie udało się dodać ćwiczenia");
    return result as ExerciseResponse;
  },
};
