export const ExerciseTemplateController = {
  getTemplates: async () => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(`${API_URL}/exercise-templates`, {
      method: "GET",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Nie udało się pobrać szablonów ćwiczeń");
    }

    return result;
  },

  createTemplate: async (name: string, description?: string) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const response = await fetch(`${API_URL}/exercise-templates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description: description ?? "",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Nie udało się dodać szablonu ćwiczenia");
    }

    return result;
  },
};
