export interface FoodLogItem {
  id: number;
  product_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  weight_g: number; 
  date: string;
  meal_type?: string; 
}

export interface DailySummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}
export interface NutritionTargets {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface NutritionSummary {
  kcal: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface DailyDietResponse {
  date: string;
  targets: NutritionTargets;
  summary: NutritionSummary;
  foods: FoodLogItem[];
}