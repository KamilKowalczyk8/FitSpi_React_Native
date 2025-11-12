import { ClientResponse } from '@/controllers/coach/clientLink.controller';
import React from 'react';
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ClientWorkoutsModalProps {
  visible: boolean;
  onClose: () => void;
  client: ClientResponse;
}


const MOCK_WORKOUTS = [
  { id: '1', name: 'Trening A - Klatka/Triceps' },
  { id: '2', name: 'Trening B - Plecy/Biceps' },
  { id: '3', name: 'Trening C - Nogi/Barki' },
];

const ClientWorkoutsModal: React.FC<ClientWorkoutsModalProps> = ({ visible, onClose, client }) => {
  
  const handleCreateNew = () => {
    onClose(); // Zamknij ten modal
    // Tutaj nawiguj do ekranu tworzenia treningu, przekazując ID klienta
    console.log(`Rozpocznij tworzenie nowego treningu dla: ${client.user_id}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>
          <Text style={styles.title}>Treningi dla</Text>
          <Text style={styles.clientName}>{client.first_name} {client.last_name}</Text>
          
          <FlatList
            data={MOCK_WORKOUTS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.workoutTile}>
                <Text style={styles.workoutName}>{item.name}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>Ten podopieczny nie ma jeszcze żadnych treningów.</Text>}
          />

          <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
            <Text style={styles.createButtonText}>➕ Stwórz nowy trening</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  clientName: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  workoutTile: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 30,
    color: '#888',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#34C759', // Zielony
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ClientWorkoutsModal;