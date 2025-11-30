import { getMealColor, getMealLabel } from '@/app/utils/mealHelper';
import SettingsDrawer from '@/components/SettingsDrawer';
import { AddFoodButton } from '@/components/diet/AddFoodButton';
import { AddFoodModal } from '@/components/diet/AddFoodModal';
import { CopyMealModal } from '@/components/diet/CopyMealModal';
import { DietSummary } from '@/components/diet/DietSummary';
import { MealSection } from '@/components/diet/MealSection';
import { DateSlider } from '@/components/workout/DateSlider';
import { useDiet } from '@/hooks/diet/useDiet';
import { useDisclosure } from '@/hooks/useDisclosure'; // <--- NOWY HOOK
import { MealType } from '@/models/Diet';
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
  
  // 1. Logika biznesowa z hooka useDiet
  const { 
    foodLogs, 
    groupedMeals, // Gotowe grupy!
    targets, 
    summary, 
    loading, 
    deleteLog, 
    refresh, 
    copyMeal // Gotowa funkcja kopiująca
  } = useDiet(selectedDate);

  // 2. Obsługa Modali przy pomocy useDisclosure
  const addModal = useDisclosure();
  const copyModal = useDisclosure();
  
  const [mealToCopy, setMealToCopy] = useState<MealType | null>(null);

  // Handlery
  const handleOpenCopy = (mealId: number) => {
    setMealToCopy(mealId);
    copyModal.open();
  };

  const handleCopyConfirm = (targetDate: Date) => {
    if (mealToCopy) {
      copyMeal({ targetDate, mealId: mealToCopy });
      copyModal.close();
    }
  };

  const handleFoodAdded = () => {
    addModal.close();
    refresh();
  };

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
            <ActivityIndicator size="large" color="#34C759" style={{ marginTop: 20 }} />
        ) : (
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                {foodLogs.length === 0 ? (
                    <Text style={styles.placeholderText}>Brak posiłków w tym dniu.</Text>
                ) : (
                    MEAL_ORDER.map((mealId) => {
                        const items = groupedMeals[mealId] || []; // Pobieramy z hooka
                        if (items.length === 0) return null;

                        return (
                            <MealSection
                                key={mealId}
                                title={getMealLabel(mealId)}
                                color={getMealColor(mealId)}
                                items={items}
                                onDelete={deleteLog}
                                onCopy={() => handleOpenCopy(mealId)}
                            />
                        );
                    })
                )}
                
                <AddFoodButton onPress={addModal.open} />
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
                fats: targets.fat,
                carbs: targets.carbs
            }}
          />
      )}

      <AddFoodModal 
        visible={addModal.isOpen} 
        onClose={addModal.close}
        date={selectedDate}
        onAdded={handleFoodAdded}
      />

      <CopyMealModal 
        visible={copyModal.isOpen}
        onClose={copyModal.close}
        onConfirm={handleCopyConfirm}
        mealType={mealToCopy}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  dateContainer: {
    paddingBottom: 10,
    backgroundColor: "#7fff00",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

export default DietScreen;