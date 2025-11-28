export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum ActivityLevel {
  SEDENTARY = 1.2,     
  LIGHT = 1.375,        
  MODERATE = 1.55,      
  ACTIVE = 1.725,       
  VERY_ACTIVE = 1.9,   
}

export enum DietGoal {
  LOSE_WEIGHT = 'lose_weight',
  MAINTAIN = 'maintain',
  GAIN_WEIGHT = 'gain_weight',
}

export interface UserProfileData {
  gender: Gender;
  date_of_birth: string; 
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal: DietGoal;
}