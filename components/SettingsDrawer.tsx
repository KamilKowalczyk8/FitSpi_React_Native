import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
    Animated,
    Dimensions,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export const SettingsDrawer: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(width));
  const router = useRouter();

  const toggleDrawer = () => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setVisible(false));
    } else {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleLogout = async () => {
    // usuń token z SecureStore
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");

    // zamknij panel
    toggleDrawer();

    // przenieś na ekran logowania
    router.replace("/(auth)/login/login");
  };

  return (
    <View style={styles.container}>
      {/* Ikona koła zębatego */}
      <TouchableOpacity onPress={toggleDrawer} style={styles.gearButton}>
        <Ionicons name="settings-outline" size={28} color="#000" />
      </TouchableOpacity>

      {/* Panel boczny */}
      <Modal transparent visible={visible} animationType="none">
        <Pressable style={styles.overlay} onPress={toggleDrawer} />
        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          <Text style={styles.drawerTitle}>Opcje</Text>

          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>⚙️ Ustawienia</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
            <Text style={styles.optionText}>🚪 Wyloguj się</Text>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 100,
  },
  gearButton: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 50,
    elevation: 4,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.6,
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
    elevation: 8,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 18,
  },
});
