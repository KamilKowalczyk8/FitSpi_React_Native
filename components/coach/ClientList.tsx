import { ClientResponse } from '@/controllers/coach/clientLink.controller';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text } from 'react-native';
import ClientTile from './ClientTile';

interface ClientListProps {
  clients: ClientResponse[];
  isLoading: boolean;
  error: string | null;
  onBrowseWorkouts: (client: ClientResponse) => void; // <-- Oczekujemy handlera
}

const ClientList: React.FC<ClientListProps> = ({ clients, isLoading, error, onBrowseWorkouts }) => {

  if (isLoading) {
    return <ActivityIndicator size="large" color="#1e90ff" style={styles.centered} />;
  }

  if (error) {
    return <Text style={[styles.centered, styles.errorText]}>{error}</Text>;
  }

  if (clients.length === 0) {
    return <Text style={styles.centered}>Nie masz jeszcze żadnych podopiecznych.</Text>;
  }

  return (
    <FlatList
      data={clients}
      renderItem={({ item }) => (
        <ClientTile 
          client={item} 
          onBrowseWorkouts={() => onBrowseWorkouts(item)} 
        />
      )}
      keyExtractor={(item) => item.user_id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
  }
});

export default ClientList;