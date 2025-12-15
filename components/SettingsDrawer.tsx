import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { COLORS } from '@/constants/theme';
import { useAuth } from "@/hooks/useAuth";
import InvitationsModal from "./coach/InvitationsModal";
import WorkoutInboxModal from "./coach/WorkoutInboxModal";
import UserProfileModal from "./diet/UserProfileModal";

const { width } = Dimensions.get("window");

export const SettingsDrawer: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(width));
  const [invitationsVisible, setInvitationsVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
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

  const openProfileModal = () => {
    toggleDrawer();
    setTimeout(() => setProfileVisible(true), 300);
  }

  // Komponent pomocniczy dla pozycji w menu
  const DrawerItem = ({ icon, label, onPress, isDestructive = false }: any) => (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      <Ionicons 
        name={icon} 
        size={24} 
        color={isDestructive ? COLORS.danger : COLORS.iconColor} 
        style={styles.icon}
      />
      <Text style={[styles.optionText, isDestructive && { color: COLORS.danger }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Przycisk otwierania (Zębatka) */}
      <TouchableOpacity onPress={toggleDrawer} style={styles.gearButton}>
        <Ionicons name="settings-outline" size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="none" onRequestClose={toggleDrawer}>
        <Pressable style={styles.overlay} onPress={toggleDrawer} />
        
        <Animated.View
          style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
        >
          {/* Bezpieczny obszar dla notcha/wyspy */}
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.drawerContent}>
                
                <Text style={styles.drawerTitle}>Menu</Text>
                
                <View style={styles.separator} />

                <DrawerItem 
                    icon="mail-unread-outline" 
                    label="Zaproszenia" 
                    onPress={openInvitationsModal} 
                />

                <DrawerItem 
                    icon="download-outline" 
                    label="Treningi od trenera" 
                    onPress={openInboxModal} 
                />

                <DrawerItem 
                    icon="person-circle-outline" 
                    label="Twój Profil" 
                    onPress={openProfileModal} 
                />

                <DrawerItem 
                    icon="construct-outline" 
                    label="Ustawienia" 
                    onPress={() => {}} // Placeholder
                />

                {/* Separator przed wylogowaniem */}
                <View style={[styles.separator, { marginVertical: 20 }]} />

                <DrawerItem 
                    icon="log-out-outline" 
                    label="Wyloguj się" 
                    onPress={handleLogout} 
                    isDestructive
                />
            </View>
          </SafeAreaView>
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
      <UserProfileModal
        visible={profileVisible}
        onClose={() => setProfileVisible(false)}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 55, 
    right: 20,
    zIndex: 100,
  },
  gearButton: {
    backgroundColor: COLORS.buttonBg,
    padding: 10,
    borderRadius: 50, 
    borderWidth: 1,
    borderColor: '#444',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  drawer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: width * 0.65, 
    height: "100%",
    backgroundColor: COLORS.drawerBg,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: -5, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
  },
  drawerContent: {
      paddingHorizontal: 25,
      paddingTop: 40,
  },
  drawerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 10,
  },
  separator: {
      height: 1,
      backgroundColor: COLORS.separator,
      marginBottom: 10,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  icon: {
      marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
});

export default SettingsDrawer;