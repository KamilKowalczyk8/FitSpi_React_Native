import { MealType } from '@/models/Diet';

export const getMealColor = (type: MealType | number): string => {
  switch (Number(type)) { 
    case MealType.Sniadanie:
      return '#FF9F43'; 
    case MealType.Lunch:
      return '#54A0FF'; 
    case MealType.Obiad:
      return '#10AC84'; 
    case MealType.Przekaska:
      return '#FF6B6B'; 
    case MealType.Kolacja:
      return '#5F27CD'; 
    case MealType.Snack:
      return '#8395A7'; 
    default:
      return '#C8D6E5';
  }
};

export const getMealLabel = (type: MealType | number): string => {
  switch (Number(type)) {
    case MealType.Sniadanie:
      return 'Śniadanie';
    case MealType.Lunch:
      return 'Lunch';
    case MealType.Obiad:
      return 'Obiad';
    case MealType.Przekaska:
      return 'Przekąska';
    case MealType.Kolacja:
      return 'Kolacja';
    case MealType.Snack:
      return 'Inne / Snack';
    default:
      return 'Nieznany posiłek';
  }
};


export const getMealIcon = (type: MealType | number): string => {
    switch (Number(type)) {
      case MealType.Sniadanie: return '☕';
      case MealType.Lunch:     return '🥪';
      case MealType.Obiad:     return '🍲';
      case MealType.Przekaska: return '🍎';
      case MealType.Kolacja:   return '🌙';
      default:                 return '🍪';
    }
  };