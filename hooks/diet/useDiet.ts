import { DietController } from '@/controllers/diet/diet.controller';
import { useAuth } from '@/hooks/useAuth';
import { useDisclosure } from '@/hooks/useDisclosure';
import { DailyDietResponse, FoodLogItem, MealType } from '@/models/Diet';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

interface CopyMealArgs {
  targetDate: Date;
  mealId: MealType;
}

export const useDiet = (selectedDate: Date) => {
  const { token } = useAuth();
  
  const [dailyData, setDailyData] = useState<DailyDietResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addModal = useDisclosure();
  const copyModal = useDisclosure();
  const [mealToCopy, setMealToCopy] = useState<MealType | null>(null);

  const fetchLogs = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await DietController.getDailyData(token, selectedDate);
      setDailyData(data);
    } catch (err: any) {
      console.error(err);
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
      fetchLogs(); 
    } catch (err: any) {
      Alert.alert("Błąd", "Nie udało się usunąć produktu");
    }
  };

  const copyMealLogic = async ({ targetDate, mealId }: CopyMealArgs) => {
    if (!token) return;
    try {
        await DietController.copyMeal(token, {
            sourceDate: selectedDate,
            targetDate: targetDate,
            meal: mealId
        });
        Alert.alert("Sukces", "Posiłek został skopiowany!");
        
        if (targetDate.toDateString() === selectedDate.toDateString()) {
            fetchLogs();
        }
    } catch (e: any) {
        Alert.alert("Błąd", e.message || "Nie udało się skopiować posiłku");
    }
  };

  const handleOpenCopy = (mealId: number) => {
    setMealToCopy(mealId);
    copyModal.open();
  };

  const handleCopyConfirm = (targetDate: Date) => {
    if (mealToCopy) {
      copyMealLogic({ targetDate, mealId: mealToCopy });
      copyModal.close();
    }
  };

  const handleFoodAdded = () => {
    addModal.close();
    fetchLogs();
  };

  const foodLogs = dailyData?.foods || [];
  const groupedMeals = useMemo(() => {
    const groups: Record<number, FoodLogItem[]> = {};
    foodLogs.forEach((item) => {
      const mealId = (item.meal as unknown as number) || MealType.Snack; 
      if (!groups[mealId]) groups[mealId] = [];
      groups[mealId].push(item);
    });
    return groups;
  }, [foodLogs]);

  const emptyTargets = { kcal: 0, protein: 0, fats: 0, carbs: 0 };
  const emptySummary = { kcal: 0, protein: 0, fats: 0, carbs: 0 };

  return {
    foodLogs,
    targets: dailyData?.targets || emptyTargets,
    summary: dailyData?.summary || emptySummary,
    groupedMeals,
    loading,
    error,

    deleteLog,
    
    modals: {
        add: addModal,
        copy: copyModal
    },
    state: {
        mealToCopy
    },
    handlers: {
        openCopy: handleOpenCopy,
        confirmCopy: handleCopyConfirm,
        foodAdded: handleFoodAdded
    }
  };
};