import { DailySummary } from '@/models/Diet';
import { useMemo } from 'react';

// Typ dla celów (możesz go przenieść do models/User.ts w przyszłości)
export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export const useDietGoals = (currentSummary: DailySummary) => {
  
  // TODO: W przyszłości tutaj pobierzesz cele z backendu (np. z useAuth() -> user.goals)
  const goals: MacroGoals = useMemo(() => ({
    calories: 2500,
    protein: 180, // gramy
    carbs: 300,   // gramy
    fats: 70,     // gramy
  }), []);

  // Mapujemy "brzydkie" nazwy z bazy (totalCalories) na "ładne" dla komponentu (calories)
  const consumed = useMemo(() => ({
    calories: currentSummary.totalCalories,
    protein: currentSummary.totalProtein,
    carbs: currentSummary.totalCarbs,
    fats: currentSummary.totalFats,
  }), [currentSummary]);

  return {
    goals,
    consumed,
  };
};