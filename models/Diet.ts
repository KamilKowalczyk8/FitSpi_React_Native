export interface FoodLogItem {
  id: number;
  product_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  weight_g: number; // waga w gramach
  date: string;
  meal_type?: string; // np. 'breakfast', 'lunch', etc.
}

// Podsumowanie makroskładników dla całego dnia
export interface DailySummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}