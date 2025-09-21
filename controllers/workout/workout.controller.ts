export const WorkoutController = {
  createWorkout: async (
    token: string, 
    description: string, 
    date?: Date,
    workout_type = 1) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    console.log("🔑 Token wysyłany do backendu:", token); 
    if (!token) throw new Error("Brak tokena!")
    const response = await fetch(`${API_URL}/workouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, 
      },
      body: JSON.stringify({
        description,
        workout_type,
        date: (date ?? new Date()).toISOString(),
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Nie udało się utworzyć treningu');
    }
    return result;
  },

  getWorkouts: async(token: string) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    if (!token) throw new Error("Brak tokena!");

    const response = await fetch(`${API_URL}/workouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Nie udało się pobrać treningów");
    }
    return result;
  },


deleteWorkout: async (token: string, workoutId: number) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    if (!token) throw new Error("Brak tokena!");

    const response = await fetch(`${API_URL}/workouts/${workoutId}`, { 
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
        let message = "Nie udało się usunąć treningu";
        try {
            const result = await response.json();
            message = result.message || message;
        } catch {}
        throw new Error(message);
    }
    return true;
},

  
};
