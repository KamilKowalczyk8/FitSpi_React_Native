import { FoodLogItem } from '@/models/Diet';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  item: FoodLogItem;
  onDelete: (id: number) => void;
}

export const FoodListItem: React.FC<Props> = ({ item, onDelete }) => {
  
    const name = item.product_name || (item as any).product?.name || 'Produkt';  const weight = item.weight_g || (item as any).grams || 0; 
  const calories = item.kcal || 0; 
  
  const protein = item.protein || 0;
  const fats = item.fats || 0;
  const carbs = item.carbs || 0;

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>
          {weight}g • {Math.round(calories)} kcal
        </Text>
        <Text style={styles.macros}>
          B: {Math.round(protein)}  T: {Math.round(fats)}  W: {Math.round(carbs)}
        </Text>
      </View>
      
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    // Cień
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  macros: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteIcon: {
    fontSize: 16,
  },
});