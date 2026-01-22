import SettingsDrawer from '@/components/SettingsDrawer';
import { AddFoodButton } from '@/components/diet/AddFoodButton';
import { AddFoodModal } from '@/components/diet/AddFoodModal';
import { CopyMealModal } from '@/components/diet/CopyMealModal';
import { DietSummary } from '@/components/diet/DietSummary';
import { MealSection } from '@/components/diet/MealSection';
import { DateSlider } from '@/components/workout/DateSlider';
import { COLORS } from '@/constants/theme';
import { useDiet } from '@/hooks/diet/useDiet';
import { MealType } from '@/models/Diet';
import { getMealColor, getMealLabel } from '@/utils/mealHelper';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

const MEAL_ORDER = [
  MealType.Sniadanie,
  MealType.Lunch,
  MealType.Obiad,
  MealType.Przekaska,
  MealType.Kolacja,
  MealType.Snack
];

const DietScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { 
    groupedMeals, 
    targets, 
    summary, 
    loading, 
    deleteLog,
    modals,   
    handlers,  
    state      
  } = useDiet(selectedDate);

  return (
    <View style={styles.container}>
      <SettingsDrawer />  
      
      <Text style={styles.heading}>Twoja dieta</Text> 
      
      <View style={styles.dateContainer}>
        <DateSlider 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
        />
      </View>

      <View style={styles.contentContainer}>
        {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
        ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {MEAL_ORDER.map((mealId) => {
                    const items = groupedMeals[mealId] || []; 
                    if (items.length === 0) return null;
                    return (
                        <MealSection
                            key={mealId}
                            title={getMealLabel(mealId)}
                            color={getMealColor(mealId)} 
                            items={items}
                            onDelete={deleteLog}
                            onCopy={() => handlers.openCopy(mealId)}
                        />
                    );
                })}
                
                <AddFoodButton onPress={modals.add.open} />
            </ScrollView>
        )}
      </View>
      
      {summary && targets && (
          <DietSummary 
            consumed={{
                calories: summary.kcal,
                protein: summary.protein,
                fats: summary.fats, 
                carbs: summary.carbs
            }}
            goals={{
                calories: targets.kcal,
                protein: targets.protein,
                fats: targets.fats,
                carbs: targets.carbs
            }}
          />
      )}
      
      <AddFoodModal 
        visible={modals.add.isOpen} 
        onClose={modals.add.close}
        date={selectedDate}
        onAdded={handlers.foodAdded}
      />
      
      <CopyMealModal 
        visible={modals.copy.isOpen} 
        onClose={modals.copy.close}
        onConfirm={handlers.confirmCopy}
        mealType={state.mealToCopy}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: COLORS.background, 
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
    color: COLORS.text, 
    letterSpacing: 0.5,
  },
  dateContainer: {
    paddingBottom: 10,
    backgroundColor: COLORS.background, 
  },
  contentContainer: {
    flex: 1,
    backgroundColor: COLORS.background, 
    paddingTop: 10,
  },
});

export default DietScreen;