export enum WorkoutType {
  Training = 1,
  Rest = 2,
}

export enum WorkoutStatus{
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  DOWNLOADED = 'downloaded',
  DRAFT = 'draft',
}

export type Workout = {
  id: number;
  date: string;
  description?: string;
  workout_type: WorkoutType;
  created_at: string;
  status?: WorkoutStatus; 
};

export interface WorkoutItem {
  id: number;
  description: string;
  date: string;
  status: WorkoutStatus;
}
