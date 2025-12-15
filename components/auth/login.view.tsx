import CheckBox from 'expo-checkbox';
import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Kolory naszego motywu
const COLORS = {
  background: '#121212',
  inputBg: '#2C2C2C',
  primary: '#2979FF', // Energetyczna limonka
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  black: '#000000',
};

export function LoginView({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  handleLogin,
}: any) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Witaj ponownie!</Text>
        <Text style={styles.subtitle}>Zaloguj się, aby kontynuować trening.</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Hasło"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
            color={rememberMe ? COLORS.primary : undefined}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Zapamiętaj mnie</Text>
        </View>

        {/* Customowy Przycisk zamiast zwykłego Button */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>ZALOGUJ SIĘ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerLink}
          onPress={() => { router.replace('/(auth)/register/register') }}
        >
          <Text style={styles.footerText}>
            Nie masz konta? <Text style={styles.linkText}>Zarejestruj się</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800', // Bardzo gruby font
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 40,
    textAlign: 'left',
  },
  inputContainer: {
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12, 
    marginBottom: 16,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    marginRight: 10,
    borderRadius: 4,
    borderColor: COLORS.textSecondary,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30, 
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10, 
    elevation: 5,
  },
  primaryButtonText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1, 
  },
  footerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});