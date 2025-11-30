import { FoodLogItem } from '@/models/Diet';
import { Ionicons } from '@expo/vector-icons';
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
import { MealOptionsModal } from './MealOptionsModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Props {
  title: string;
  items: FoodLogItem[];
  onDelete: (id: number) => void;
  color: string;
  onCopy: () => void;
}

export const MealSection: React.FC<Props> = ({ 
  title, 
  items, 
  onDelete, 
  color, 
  onCopy 
}) => {
  const [expanded, setExpanded] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

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
      
      {/* NAGŁÓWEK - JEDEN WIERSZ */}
      <View style={[styles.header, { borderBottomColor: expanded ? '#f5f5f5' : 'transparent' }]}>
        
        {/* LEWA STRONA (Rozwijanie): Tytuł + Makro */}
        <TouchableOpacity 
            onPress={toggleExpand} 
            style={styles.headerMain} 
            activeOpacity={0.7}
        >
            <View style={styles.headerRow}>
                {/* Kropka */}
                <View style={[styles.dot, { backgroundColor: color }]} />
                
                {/* Tytuł */}
                <Text style={styles.title}>{title}</Text>
                
                {/* Kalorie */}
                <Text style={[styles.kcalText, { color: color }]}>
                    {Math.round(totalKcal)} kcal
                </Text>

                {/* Makro (Małe, w jednej linii) */}
                <View style={styles.macrosContainer}>
                    <Text style={styles.macroText}>B:{Math.round(totalProtein)}</Text>
                    <Text style={styles.macroText}>T:{Math.round(totalFats)}</Text>
                    <Text style={styles.macroText}>W:{Math.round(totalCarbs)}</Text>
                </View>
            </View>

            {/* Strzałka (przyklejona do lewej sekcji, ale na końcu) */}
            <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {/* PRAWA STRONA: 3 KROPKI (Opcje) */}
        <TouchableOpacity 
            onPress={() => setMenuVisible(true)} 
            style={styles.menuButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="ellipsis-vertical" size={18} color="#aaa" />
        </TouchableOpacity>

      </View>

      {/* LISTA PRODUKTÓW */}
      {expanded && (
        <View style={styles.content}>
          {items.map((item) => (
            <View key={item.id}>
               <FoodListItem item={item} onDelete={onDelete} />
            </View>
          ))}
        </View>
      )}

      {/* MODAL OPCJI */}
      <MealOptionsModal 
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onCopy={onCopy}
        title={`Opcje: ${title}`}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10, 
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderLeftWidth: 4, 
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50, 
    backgroundColor: '#fff',
    borderBottomWidth: 1,
  },
  headerMain: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 5,
    height: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  kcalText: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  macrosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroText: {
    fontSize: 14, 
    color: '#888',
    marginRight: 6,
  },
  arrow: {
    fontSize: 10,
    color: '#ccc',
    paddingHorizontal: 5,
  },
  
  // Przycisk Menu
  menuButton: {
    width: 40,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#f9f9f9', // Bardzo delikatna separacja
  },
  
  content: {
    paddingBottom: 0,
  },
});