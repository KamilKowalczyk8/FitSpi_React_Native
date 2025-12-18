import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useAuth } from '@/hooks/useAuth';

const COLORS = {
  tabBarBg: '#1E1E1E',
  primary: '#2979FF',
  inactive: '#757575',
  border: '#2C2C2C',
};

export default function TabLayout() {
  const { user } = useAuth();

  const shouldHideCoachTab = user?.role_id === 2;

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
            elevation: 0, 
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
          href: shouldHideCoachTab ? null : undefined,
          
          tabBarIcon: ({ color, focused }) => (
            <Ionicons size={28} name={focused ? 'people' : 'people-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}