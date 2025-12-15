import { Ionicons } from '@expo/vector-icons'; // Importujemy standardowe ikony Expo
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

// Kolory naszego motywu Blue Active
const COLORS = {
  tabBarBg: '#1E1E1E',   // Nieco jaśniejsze tło dla paska nawigacji
  primary: '#2979FF',    // Neonowy Błękit (Aktywny)
  inactive: '#757575',   // Szary (Nieaktywny)
  border: '#2C2C2C',     // Kolor górnej krawędzi paska
};

export default function TabLayout() {
  
  return (
    <Tabs
      screenOptions={{
      
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        
     
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute', 
            backgroundColor: COLORS.tabBarBg, 
            borderTopColor: COLORS.border,
          },
          default: {
            backgroundColor: COLORS.tabBarBg,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            height: 108,
            paddingBottom: 8,
            paddingTop: 8,
          },
        }),
    
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen
        name="workout/index"
        options={{
          title: 'Treningi',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={28} name={focused ? 'barbell' : 'barbell-outline'} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="diet/index"
        options={{
          title: 'Dieta',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={28} name={focused ? 'nutrition' : 'nutrition-outline'} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="coach/index"
        options={{
          title: 'Podopieczni',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={28} name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}