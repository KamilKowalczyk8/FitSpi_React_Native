export const WorkoutController = {
  createWorkout: async (token: string, description: string, workout_type = 1) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    console.log("🔑 Token wysyłany do backendu:", token); // sprawdź, czy tu leci cały JWT!
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
        date: new Date().toISOString(),
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Nie udało się utworzyć treningu');
    }
    return result;
  },
};
