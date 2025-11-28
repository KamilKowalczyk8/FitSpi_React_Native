import SettingsDrawer from '@/components/SettingsDrawer';
import { DietSummary } from '@/components/diet/DietSummary';
import { DateSlider } from '@/components/workout/DateSlider';
import { useDiet } from '@/hooks/diet/useDiet';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DietScreen = () => {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const { foodLogs, targets, summary, loading, deleteLog } = useDiet(selectedDate);


  return (
    <View style={styles.container}>
      <SettingsDrawer />  
      <Text style={styles.heading}>Twoja dieta</Text> 
      
      {/* Slider daty */}
      <View style={styles.dateContainer}>
        <DateSlider 
          selectedDate={selectedDate} 
          onSelectDate={setSelectedDate} 
        />
      </View>

      {/* Lista produktów */}
      <View style={styles.contentContainer}>
        {loading ? (
            <ActivityIndicator size="large" color="#34C759" style={{ marginTop: 20 }} />
        ) : (
            <FlatList
                data={foodLogs}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={
                    <Text style={styles.placeholderText}>Brak posiłków w tym dniu.</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.logItem}>
                        <View style={{flex: 1}}>
                            {/* Upewnij się, że nazwy pól pasują do tego co zwraca API (np. product.name vs product_name) */}
                            <Text style={styles.productName}>{item.product_name || 'Produkt'}</Text>
                            <Text style={styles.productDetails}>
                                {item.weight_g}g • {Math.round(item.calories)} kcal • B: {Math.round(item.protein)} T: {Math.round(item.fats)} W: {Math.round(item.carbs)}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteLog(item.id)} style={{padding: 5}}>
                            <Text style={{fontSize: 18}}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        )}
      </View>

      {/* Dolny komponent Podsumowania */}
      {/* Renderujemy go tylko, gdy mamy dane summary i targets */}
      {summary && targets && (
          <DietSummary 
            consumed={{
                calories: summary.kcal,
                protein: summary.protein,
                fats: summary.fat, 
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
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  logItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  productDetails: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  }
});

export default DietScreen;