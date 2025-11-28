import { UserProfileData } from '@/models/Profile';

export const UserProfileController = {

  createProfile: async (token: string, data: UserProfileData) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    if (!token) throw new Error("Brak tokena!");

    console.log("📤 Tworzenie profilu:", data);

    const response = await fetch(`${API_URL}/user-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Nie udało się utworzyć profilu");
    }

    return result;
  },

  getProfile: async (token: string) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    if (!token) throw new Error("Brak tokena!");

    const response = await fetch(`${API_URL}/user-profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      return null;
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Nie udało się pobrać profilu");
    }

    return result;
  },

  updateProfile: async (token: string, data: Partial<UserProfileData>) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    if (!token) throw new Error("Brak tokena!");

    console.log("📤 Aktualizacja profilu:", data);

    const response = await fetch(`${API_URL}/user-profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Nie udało się zaktualizować profilu");
    }

    return result;
  },
};