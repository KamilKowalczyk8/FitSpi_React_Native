import { ClientResponse } from '@/controllers/coach/clientLink.controller';
import React, { useState } from "react";
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ClientOptions from "./ClientOptions";

interface ClientTileProps {
    client: ClientResponse;
    onBrowseWorkouts: () => void;
}

const ClientTile: React.FC<ClientTileProps> = ({ client, onBrowseWorkouts }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTilePress = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }
    console.log(`Nawigacja do klienta: ${client.first_name}`);
  };

  const handleToggleMenu = (event: GestureResponderEvent) => {
    event.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={handleTilePress}
      activeOpacity={0.7}
    >
      <View style={styles.avatar} />

      {/* Dane klienta */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {client.first_name} {client.last_name}
        </Text>
        <Text style={styles.email}>{client.email}</Text>
      </View>

      {/* Menu z opcjami klienta */}
      <ClientOptions
        isOpen={isMenuOpen}
        onToggle={handleToggleMenu}
        onDelete={() => {
          console.log(`Usuń klienta: ${client.first_name}`);
          setIsMenuOpen(false);
        }}
        onBrowseWorkouts={() => {
          setIsMenuOpen(false);
          onBrowseWorkouts();
        }}
        onCreateTraining={() => {
          console.log(`Stwórz trening dla: ${client.first_name}`);
          setIsMenuOpen(false);
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ccc",
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});

export default ClientTile;
