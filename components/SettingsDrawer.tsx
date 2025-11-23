import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

import { useAuth } from "@/hooks/useAuth";
import InvitationsModal from "./coach/InvitationsModal";
import WorkoutInboxModal from "./coach/WorkoutInboxModal";


const { width } = Dimensions.get("window");

export const SettingsDrawer: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(width));
  const [invitationsVisible, setInvitationsVisible] = useState(false);

  const [inboxVisible, setInboxVisible] = useState(false);

  const router = useRouter();
  const { user, logout } = useAuth();

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
    toggleDrawer();
    await logout();
    router.replace("/(auth)/login/login"); 
  };

  const openInvitationsModal = () => {
    toggleDrawer();
    setTimeout(() => setInvitationsVisible(true), 300);
  };

  const openInboxModal = () => {
    toggleDrawer(); 
    setTimeout(() => setInboxVisible(true), 300); 
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleDrawer} style={styles.gearButton}>
        <Ionicons name="settings-outline" size={28} color="#000" />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="none">
        <Pressable style={styles.overlay} onPress={toggleDrawer} />
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
        >
          <Text style={styles.drawerTitle}>Opcje</Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={openInvitationsModal}
            >
              <Text style={styles.optionText}>📬 Zaproszenia</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton}
              onPress={openInboxModal}
            >
              <Text style={styles.optionText}>💪 Treningi od trenera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton}>
              <Text style={styles.optionText}>⚙️ Ustawienia</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionButton} onPress={handleLogout}>
              <Text style={styles.optionText}>🚪 Wyloguj się</Text>
            </TouchableOpacity>
        </Animated.View>
      </Modal>

      <InvitationsModal
        visible={invitationsVisible}
        onClose={() => setInvitationsVisible(false)}
      />
      <WorkoutInboxModal 
        visible={inboxVisible}
        onClose={() => setInboxVisible(false)}
      />

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
    width: width * 0.58,
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
    elevation: 8,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionButton: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 18,
  },
});

export default SettingsDrawer;
