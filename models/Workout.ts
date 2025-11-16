export enum WorkoutType {
  Training = 1,
  Rest = 2,
}

export type Workout = {
  id: number;
  date: string;
  description?: string;
  workout_type: WorkoutType;
  created_at: string;
};

export interface WorkoutItem {
  id: number;
  name: string;
  date: string;
}
