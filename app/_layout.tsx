import { AppProvider } from '@/providers/AppProvider';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <AppProvider>
      <Slot />
      <StatusBar style="auto" />
    </AppProvider>
  );
}
