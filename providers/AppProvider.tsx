import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';

type Props = { children: ReactNode };

export const AppProvider = ({ children }: Props) => {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};
