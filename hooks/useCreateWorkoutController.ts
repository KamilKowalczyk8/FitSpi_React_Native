import { ClientResponse } from '@/controllers/coach/clientLink.controller';
import { WorkoutController } from '@/controllers/workout/workout.controller';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface Props {
  client: ClientResponse;
  onClose: () => void;
}

export function useCreateWorkoutController({ client, onClose }: Props) {
  const { token } = useAuth();
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date()); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!token || !client) return;
    if (!description) {
      setError('Nazwa treningu jest wymagana.');
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      await WorkoutController.createWorkoutForClient(
        token,
        client.user_id,
        description,
        date
      );
      setIsLoading(false);
      onClose(); // Zamknij modal po sukcesie
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
    }
  };

  return {
    description,
    setDescription,
    date,
    setDate,
    isLoading,
    error,
    handleCreate,
  };
}