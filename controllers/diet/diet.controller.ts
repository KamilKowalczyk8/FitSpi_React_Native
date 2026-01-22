import { AddFoodPayload, CopyMealPayload, DailyDietResponse } from "@/models/Diet";
import { toDateString } from "@/utils/dateHelper";

export const DietController = {
  getDailyData: async (token: string, date: Date): Promise<DailyDietResponse> => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    
    if (!token) throw new Error("Brak tokena!");

    const dateString = toDateString(date);

    const response = await fetch(`${API_URL}/foods?date=${dateString}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Nie udało się pobrać danych dziennika");
    }

    return result;
  },


  addFood: async (token: string, payload: AddFoodPayload) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    if (!token) throw new Error("Brak tokena!");

    const response = await fetch(`${API_URL}/foods`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: payload.productId,
        date: payload.date.toISOString(), 
        meal: payload.meal,
        grams: payload.grams,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Nie udało się dodać posiłku");
    }

    return result;
  },

  copyMeal: async (token: string, payload: CopyMealPayload) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    if (!token) throw new Error("Brak tokena!");

    const response = await fetch(`${API_URL}/foods/copy-meal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sourceDate: payload.sourceDate.toISOString(),
        targetDate: payload.targetDate.toISOString(),
        meal: payload.meal,
      }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Nie udało się skopiować posiłku");
    }
    return true;
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