export const ProductController = {
  getAllProducts: async (token: string) => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    if (!token) throw new Error("Brak tokena!");

    const response = await fetch(`${API_URL}/products`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Błąd pobierania produktów");
    
    return result; 
  },
};