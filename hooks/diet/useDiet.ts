import { DietController } from '@/controllers/diet/diet.controller';
import { useAuth } from '@/hooks/useAuth';
import { DailyDietResponse } from '@/models/Diet'; // Używamy nowego typu
import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

export const useDiet = (selectedDate: Date) => {
  const { token } = useAuth();
  
  const [dailyData, setDailyData] = useState<DailyDietResponse | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await DietController.getDailyData(token, selectedDate);
      setDailyData(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Błąd pobierania danych");
      setDailyData(null);
    } finally {
      setLoading(false);
    }
  }, [token, selectedDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const deleteLog = async (id: number) => {
    if (!token) return;
    try {
      await DietController.deleteLog(token, id);
      // Najprościej: odświeżamy dane z serwera po usunięciu
      fetchLogs(); 
    } catch (err: any) {
      Alert.alert("Błąd", "Nie udało się usunąć produktu");
    }
  };

  const emptyTargets = { kcal: 0, protein: 0, fat: 0, carbs: 0 };
  const emptySummary = { kcal: 0, protein: 0, fat: 0, carbs: 0 };

  return {
    foodLogs: dailyData?.foods || [], 
    targets: dailyData?.targets || emptyTargets, 
    summary: dailyData?.summary || emptySummary, 
    
    loading,
    error,
    refresh: fetchLogs,
    deleteLog
  };
};