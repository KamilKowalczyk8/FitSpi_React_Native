import SettingsDrawer from '@/components/SettingsDrawer';
import { DietSummary } from '@/components/diet/DietSummary';
import { DateSlider } from '@/components/workout/DateSlider';
import { useDiet } from '@/hooks/diet/useDiet';
import { useDietGoals } from '@/hooks/diet/useDietGoals';
import { useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DietScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 1. Pobieramy listę jedzenia i surowe podsumowanie
  const { foodLogs, summary, loading, deleteLog } = useDiet(selectedDate);

  // 2. Przeliczamy to na cele (Fitatu style)
  const { goals, consumed } = useDietGoals(summary);

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Twoja dieta</Text>
        <View style={styles.settingsWrapper}>
          <SettingsDrawer />   
        </View>
      </View>

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
                            <Text style={styles.productName}>{item.product_name}</Text>
                            <Text style={styles.productDetails}>
                                {item.weight_g}g • {item.calories} kcal • B: {item.protein} T: {item.fats} W: {item.carbs}
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

      {/* Dolny komponent Podsumowania (Czyste przekazanie danych) */}
      <DietSummary 
        consumed={consumed} 
        goals={goals} 
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    position: 'relative',
    height: 50,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  settingsWrapper: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 10,
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