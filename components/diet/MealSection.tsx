import { FoodLogItem } from '@/models/Diet';
import React, { useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View
} from 'react-native';
import { FoodListItem } from './FoodListItem';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  title: string;
  items: FoodLogItem[];
  onDelete: (id: number) => void;
  color: string;
  defaultExpanded?: boolean;
}

export const MealSection: React.FC<Props> = ({ 
  title, 
  items, 
  onDelete, 
  color, 
  defaultExpanded = true 
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const totalKcal = items.reduce((sum, item) => sum + (item.kcal || 0), 0);
  const totalProtein = items.reduce((sum, item) => sum + (item.protein || 0), 0);
  const totalFats = items.reduce((sum, item) => sum + (item.fats || 0), 0);
    const totalCarbs = items.reduce((sum, item) => sum + (item.carbs || 0), 0);


  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={[styles.container, { borderLeftColor: color }]}> 
      {/* Nagłówek Sekcji */}
      <TouchableOpacity 
        onPress={toggleExpand} 
        style={[styles.header, { borderBottomColor: expanded ? '#eee' : 'transparent' }]} 
        activeOpacity={0.7}
      >
        <View style={styles.headerTitleRow}>
          {/* Kropka z kolorem */}
          <View style={[styles.dot, { backgroundColor: color }]} />
          
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.kcalInfo, { color: color }]}>
             {Math.round(totalKcal)} kcal
          </Text>
          <Text style={[styles.kcalInfo, { color: color }]}>
             B: {Math.round(totalProtein)} 
          </Text>
          <Text style={[styles.kcalInfo, { color: color }]}>
              T: {Math.round(totalFats)}
          </Text>
           <Text style={[styles.kcalInfo, { color: color }]}>
              W: {Math.round(totalCarbs)}
          </Text>
          
        </View>
        <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* Lista Produktów */}
      {expanded && (
        <View style={styles.content}>
          {items.map((item) => (
            <View key={item.id}>
               <FoodListItem item={item} onDelete={onDelete} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 5, 
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  kcalInfo: {
    fontSize: 14,
    fontWeight: '600',
  },
  arrow: {
    fontSize: 14,
    color: '#999',
  },
  content: {
    paddingBottom: 5,
  },
});