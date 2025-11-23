import { useAuth } from '@/hooks/useAuth';
import { AppProvider } from '@/providers/AppProvider';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

const InitialLayout = () => {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (user && inAuthGroup) {
      router.replace('/(tabs)/workout');
    } else if (!user && inTabsGroup) {
      router.replace('/(auth)/login/login');
    }
  }, [user, segments, isLoading]);

  return <Slot />;
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <AppProvider>
      <InitialLayout />
      <StatusBar style="auto" />
    </AppProvider>
  );
}
