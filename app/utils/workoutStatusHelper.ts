import { WorkoutStatus } from '@/models/Workout';


export const getWorkoutStatusColor = (status: string | WorkoutStatus): string => {
  switch (status) {
    case WorkoutStatus.DRAFT:
      return '#FFA500'; 
    case WorkoutStatus.PENDING:
      return '#1E90FF'; 
    case WorkoutStatus.ACCEPTED:
      return '#32CD32'; 
    case WorkoutStatus.REJECTED:
      return '#FF4500'; 
    case WorkoutStatus.DOWNLOADED:
      return '#808080'; 
    default:
      return '#777777'; 
  }
};


export const getWorkoutStatusLabel = (status: string | WorkoutStatus): string => {
  switch (status) {
    case WorkoutStatus.DRAFT:
      return 'Szkic (Niewysłany)';
    case WorkoutStatus.PENDING:
      return 'Wysłany (Oczekuje)';
    case WorkoutStatus.ACCEPTED:
      return 'Zaakceptowany';
    case WorkoutStatus.REJECTED:
      return 'Odrzucony';
    case WorkoutStatus.DOWNLOADED:
      return 'Archiwum';
    default:
      return 'Nieznany status';
  }
};