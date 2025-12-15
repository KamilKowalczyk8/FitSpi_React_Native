import { COLORS } from '@/constants/theme'; // Import motywu
import { ClientResponse } from '@/controllers/coach/clientLink.controller';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import ClientTile from './ClientTile';

interface ClientListProps {
  clients: ClientResponse[];
  isLoading: boolean;
  error: string | null;
  onBrowseWorkouts: (client: ClientResponse) => void; 
}

const ClientList: React.FC<ClientListProps> = ({ clients, isLoading, error, onBrowseWorkouts }) => {

  if (isLoading) {
    return (
        <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
    );
  }

  if (error) {
    return (
        <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
        </View>
    );
  }

  if (clients.length === 0) {
    return (
        <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Nie masz jeszcze żadnych podopiecznych.</Text>
        </View>
    );
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
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary, 
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger, 
    textAlign: 'center',
  }
});

export default ClientList;