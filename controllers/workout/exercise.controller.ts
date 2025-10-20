import { ExerciseResponse } from "@/types/exercise.types";

  type UpdateExerciseData = {
  sets?: number;
  reps?: number;
  weight?: number;
  weightUnits?: "kg" | "lbs";
  };


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

  updateExercise: async (
    token: string,
    id: number,
    body: UpdateExerciseData,
  ): Promise<ExerciseResponse> => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    const response = await fetch(`${API_URL}/exercises/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Nie udało się zaktualizować ćwiczenia");
    return result as ExerciseResponse;
  },


  deleteExercise: async (token: string, id: number): Promise<{ success: boolean }> => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const response = await fetch(`${API_URL}/exercises/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Nie udało się usunąć ćwiczenia");
  return result as { success: boolean };
  },
};
