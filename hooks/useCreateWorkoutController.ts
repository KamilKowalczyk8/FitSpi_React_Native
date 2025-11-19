import { ClientResponse } from '@/controllers/coach/clientLink.controller';
import { WorkoutController } from '@/controllers/workout/workout.controller';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

interface Props {
  client: ClientResponse;
  onClose: () => void;
  onWorkoutCreated?: () => void;
}

export function useCreateWorkoutController({ client, onClose, onWorkoutCreated }: Props) {
  const { token } = useAuth();
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!token || !client) return;
    if (!description) {
      setError("Nazwa treningu jest wymagana.");
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

      onWorkoutCreated?.();
      onClose();
    } catch (e: any) {
        console.error('Błąd przy tworzeniu treningu:', e);
        setError(e.message || "Wystąpił błąd podczas tworzenia treningu.");
    } finally {
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
