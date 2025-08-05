import CheckBox from 'expo-checkbox';
import { Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.title}>Logowanie</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View style={styles.checkboxContainer}>
        <CheckBox value={rememberMe} onValueChange={setRememberMe} />
        <Text style={styles.label}>Zapamiętaj mnie</Text>
      </View>
      <Button title="Zaloguj się" onPress={handleLogin} />
      <TouchableOpacity onPress={() => {/* tutaj nawigacja do rejestracji */}}>
        <Text style={styles.registerText}>Nie masz konta? Zarejestruj się</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  label: { marginLeft: 8 },
  registerText: { color: 'blue', marginTop: 20, textAlign: 'center' },
});
