import { WorkoutController } from '@/controllers/workout/workout.controller';
import { useAuth } from '@/hooks/useAuth';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface PendingWorkout {
  id: number;
  description: string;
  created_at: string;
  creatorId: number;
}

export function useWorkoutInbox(visible: boolean) {
  const { token } = useAuth();
  
  const [workouts, setWorkouts] = useState<PendingWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible && token) {
      fetchPending();
    }
  }, [visible, token]);

  const fetchPending = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await WorkoutController.getPendingWorkouts(token);
      setWorkouts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const confirmAcceptance = async (id: number, targetDate: Date) => {
    if (!token) return;
    setActionLoading(id);
    try {
      await WorkoutController.acceptWorkout(token, id, targetDate);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      Alert.alert('Sukces', 'Trening dodany do kalendarza!');
    } catch (e: any) {
      Alert.alert('Błąd', e.message || 'Nie udało się zaakceptować treningu');
    } finally {
      setActionLoading(null);
      setSelectedWorkoutId(null);
    }
  };

  const initiateAccept = (id: number) => {
    setSelectedWorkoutId(id);
    setDate(new Date());
    setShowDatePicker(true);
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);

    if (event.type === 'set' && selectedDate && selectedWorkoutId) {
      setDate(selectedDate);
      confirmAcceptance(selectedWorkoutId, selectedDate);
    } else {
      setSelectedWorkoutId(null);
    }
  };

  return {
    workouts,
    loading,
    actionLoading,
    date,
    showDatePicker,
    initiateAccept,
    onDateChange,
  };
}