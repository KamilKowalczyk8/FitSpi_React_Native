import { ClientResponse } from "@/controllers/coach/clientLink.controller";
import { WorkoutController } from "@/controllers/workout/workout.controller";
import { useAuth } from "@/hooks/useAuth";
import { WorkoutItem } from "@/models/Workout";
import { useEffect, useState } from "react";

export function useClientWorkoutsController(
  client: ClientResponse,
  visible: boolean,
  refreshAfterCreate: boolean
) {
  const { token } = useAuth();

  const [workouts, setWorkouts] = useState<WorkoutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadClientWorkouts = async () => {
    if (!token || !client) return;

    setLoading(true);
    setError(null);

    try {
      const data = await WorkoutController.getClientWorkouts(token, client.user_id);
      setWorkouts(data);
    } catch (err: any) {
      setError(err.message || "Nie udało się pobrać treningów klienta");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refreshAfterCreate && visible) {
      loadClientWorkouts();
    }
  }, [refreshAfterCreate, visible]);

  useEffect(() => {
    if (visible) {
      loadClientWorkouts();
    }
  }, [visible, client]);

  return {
    workouts,
    loading,
    error,
    refresh: loadClientWorkouts,
  };
}

