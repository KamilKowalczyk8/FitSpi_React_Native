import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const COLORS = {
  background: '#121212',
  inputBg: '#2C2C2C',
  primary: '#2979FF', 
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  error: '#FF5252', 
  white: '#FFFFFF',
};

export function RegisterView({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
  handleRegister,
}: any) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        <Text style={styles.title}>Załóż konto</Text>
        <Text style={styles.subtitle}>Dołącz do nas i zacznij swoją przemianę!</Text>

        <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
                <TextInput
                    style={[styles.input, errors.first_name && styles.inputError]}
                    placeholder="Imię"
                    placeholderTextColor="#888"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                {errors.first_name && <Text style={styles.errorText}>{errors.first_name}</Text>}
            </View>
            <View style={{flex: 1, marginLeft: 8}}>
                <TextInput
                    style={[styles.input, errors.last_name && styles.inputError]}
                    placeholder="Nazwisko"
                    placeholderTextColor="#888"
                    value={lastName}
                    onChangeText={setLastName}
                />
                {errors.last_name && <Text style={styles.errorText}>{errors.last_name}</Text>}
            </View>
        </View>

        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Hasło"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          placeholder="Potwierdź hasło"
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

        <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
          <Text style={styles.primaryButtonText}>ZAREJESTRUJ SIĘ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.footerLink}
          onPress={() => router.replace('/(auth)/login/login')}
        >
          <Text style={styles.footerText}>
            Masz już konto? <Text style={styles.linkText}>Zaloguj się</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 30,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 0, 
  },
  input: {
    backgroundColor: COLORS.inputBg,
    color: COLORS.text,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    color: COLORS.white, 
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerLink: {
    marginTop: 24,
    marginBottom: 20,
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