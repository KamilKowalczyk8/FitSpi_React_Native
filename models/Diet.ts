export interface Product {
  id: number;
  name: string;
  kcal: number; 
  protein?: number;
  carbs?: number;
  fats?: number;
}


export interface FoodLogItem {
  id: number;
  product_name: string;
  kcal: number;
  protein: number;
  carbs: number;
  fats: number;
  weight_g: number; 
  date: string;
  meal: MealType; 
}

export enum MealType {
  Sniadanie = 1,
  Lunch = 2,
  Obiad = 3,
  Przekaska = 4,
  Kolacja = 5,
  Snack = 6 
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
  fats: number;
  carbs: number;
}

export interface NutritionSummary {
  kcal: number;
  protein: number;
  fats: number;
  carbs: number;
}

export interface DailyDietResponse {
  date: string;
  targets: NutritionTargets;
  summary: NutritionSummary;
  foods: FoodLogItem[];
}

export interface AddFoodPayload {
  productId: number;
  date: Date;
  meal: MealType;
  grams: number;
}
export interface CopyMealPayload {
  sourceDate: Date;
  targetDate: Date;
  meal: MealType;
}