import { DietController } from '@/controllers/diet/diet.controller';
import { useAuth } from '@/hooks/useAuth';
import { DailySummary, FoodLogItem } from '@/models/Diet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export const useDiet = (selectedDate: Date) => {
  const { token } = useAuth();
  
  const [foodLogs, setFoodLogs] = useState<FoodLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Funkcja pobierająca dane
  const fetchLogs = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await DietController.getDailyLogs(token, selectedDate);
      setFoodLogs(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Błąd pobierania diety");
      // Opcjonalnie: wyczyść listę w razie błędu, aby nie pokazywać starych danych
      setFoodLogs([]); 
    } finally {
      setLoading(false);
    }
  }, [token, selectedDate]);

  // Pobieraj dane za każdym razem, gdy zmieni się data lub token
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Funkcja usuwania
  const deleteLog = async (id: number) => {
    if (!token) return;
    try {
      await DietController.deleteLog(token, id);
      // Aktualizuj stan lokalnie bez ponownego pobierania (szybciej)
      setFoodLogs(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      Alert.alert("Błąd", "Nie udało się usunąć produktu");
    }
  };

  // Obliczanie podsumowania dnia (używamy useMemo dla wydajności)
  const summary: DailySummary = useMemo(() => {
    return foodLogs.reduce(
      (acc, item) => ({
        totalCalories: acc.totalCalories + (item.calories || 0),
        totalProtein: acc.totalProtein + (item.protein || 0),
        totalCarbs: acc.totalCarbs + (item.carbs || 0),
        totalFats: acc.totalFats + (item.fats || 0),
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 }
    );
  }, [foodLogs]);

  return {
    foodLogs,
    summary,
    loading,
    error,
    refresh: fetchLogs,
    deleteLog
  };
};