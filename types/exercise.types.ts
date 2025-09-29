
export interface ExerciseResponse {
  id: number;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnits: "kg" | "lbs";
  workoutId: number;
  template?: { name: string }; 
}
