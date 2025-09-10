import { useAuth } from '@/hooks/useAuth';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

export default function SplashScreen() {
  const { user, isLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, []);

  if (isLoading || showSplash) {
    return (
      <View style={styles.container}>
        <Image
          source={require('@/assets/images/logoFitSpi.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }

  return <Redirect href="/(auth)/login/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  },
});
