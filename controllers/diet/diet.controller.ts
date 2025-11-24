import { FoodLogItem } from '@/models/Diet';

export const DietController = {
  getDailyLogs: async (token: string, date: Date): Promise<FoodLogItem[]> => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    
    if (!token) throw new Error("Brak tokena!");

    // Formatowanie daty do YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];

    const response = await fetch(`${API_URL}/food-logs?date=${dateString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Nie udało się pobrać posiłków");
    }

    // Zakładam, że backend zwraca tablicę posiłków
    return result;
  },

  deleteLog: async (token: string, logId: number) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    if (!token) throw new Error("Brak tokena!");

    const response = await fetch(`${API_URL}/food-logs/${logId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Nie udało się usunąć wpisu");
    }
    return true;
  }
};