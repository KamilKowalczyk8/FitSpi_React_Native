import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DietSummaryProps {
  consumed: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export const DietSummary: React.FC<DietSummaryProps> = ({ consumed, goals }) => {
  
  const renderItem = (
    label: string, 
    current: number, 
    max: number, 
    color: string,
    unit: string = 'g'
  ) => {
    // Zabezpieczenie przed dzieleniem przez zero i ograniczenie do 100%
    const percentage = max > 0 ? Math.min(Math.max(current / max, 0), 1) : 0;
    
    return (
      <View style={styles.column}>
        {/* Etykieta na górze (np. BIAŁKO) */}
        <Text style={styles.label}>{label}</Text>
        
        {/* Pasek postępu (Poziomy) */}
        <View style={styles.track}>
          <View 
            style={[
              styles.fill, 
              { 
                width: `${percentage * 100}%`, 
                backgroundColor: color 
              }
            ]} 
          />
        </View>

        {/* Wartości na dole (np. 60/120g) */}
        <Text style={styles.valueText}>
          <Text style={styles.current}>{current.toFixed(0)}</Text>
          <Text style={styles.max}>/{max}{unit}</Text>
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. Kcal */}
      {renderItem('Kcal', consumed.calories, goals.calories, '#34C759', '')}
      
      {/* 2. Białko */}
      {renderItem('Białko', consumed.protein, goals.protein, '#1E90FF')}
      
      {/* 3. Tłuszcze */}
      {renderItem('Tłuszcze', consumed.fats, goals.fats, '#FFD700')}
      
      {/* 4. Węglowodany */}
      {renderItem('Węgle', consumed.carbs, goals.carbs, '#FF4500')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Elementy obok siebie
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    // Cień
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
    gap: 10, // Odstęp między kolumnami
  },
  column: {
    flex: 1, // Każdy element zajmuje równą szerokość
    alignItems: 'center', // Wyśrodkowanie treści w kolumnie
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#888',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  track: {
    width: '100%', 
    height: 6,     
    backgroundColor: '#F0F0F5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  valueText: {
    fontSize: 13,
  },
  current: {
    fontWeight: 'bold',
    color: '#333',
  },
  max: {
    color: '#999',
    fontSize: 11,
  }
});