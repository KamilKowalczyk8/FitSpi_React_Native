import { WorkoutController } from '@/controllers/workout/workout.controller';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Alert, DeviceEventEmitter } from 'react-native';

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

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(null);

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

  const openAcceptModal = (id: number) => {
    setSelectedWorkoutId(id);
    setModalVisible(true);
  };

  const closeAcceptModal = () => {
    setModalVisible(false);
    setSelectedWorkoutId(null);
  };


  const handleReject = async (id: number) => {
    if (!token) return;
    setActionLoading(id);
    try {
      await WorkoutController.rejectWorkout(token, id);
      
      setWorkouts((prev) => prev.filter((w: PendingWorkout) => w.id !== id));
      
      Alert.alert("Info", "Trening został odrzucony.");
    } catch (e: any) {
      Alert.alert("Błąd", "Nie udało się odrzucić treningu.");
    } finally {
      setActionLoading(null);
    }
  };
  

  const handleConfirmAccept = async (date: Date) => {
    if (!token || !selectedWorkoutId) return;
    
    setActionLoading(selectedWorkoutId);

    try {
      await WorkoutController.acceptWorkout(token, selectedWorkoutId, date);
      
      setWorkouts((prev) => prev.filter((w) => w.id !== selectedWorkoutId));
      
      DeviceEventEmitter.emit('event.refreshWorkouts'); 

      Alert.alert('Sukces', 'Trening został dodany do Twojego kalendarza!');
      
      closeAcceptModal();
    } catch (e: any) {
      Alert.alert('Błąd', e.message || 'Nie udało się zaakceptować treningu');
    } finally {
      setActionLoading(null);
    }
  };

  return {
    workouts,
    loading,
    actionLoading,
    
    isModalVisible,
    openAcceptModal,
    closeAcceptModal,
    handleConfirmAccept,

    handleReject, 
  };
}