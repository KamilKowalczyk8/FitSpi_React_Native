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

import { useClientWorkoutsController } from "@/hooks/useClientWorkoutsController";
import { WorkoutItem } from "@/models/Workout";

interface Props {
  visible: boolean;
  onClose: () => void;
  client: ClientResponse;
  onCreateWorkout: () => void;
  refreshAfterCreate: boolean;
}

const ClientWorkoutsModal: React.FC<Props> = ({
  visible,
  onClose,
  client,
  onCreateWorkout,
  refreshAfterCreate,
}) => {

  const { workouts, loading, error } =
    useClientWorkoutsController(client, visible);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>


          <Text style={styles.title}>Treningi dla</Text>
          <Text style={styles.clientName}>
            {client.first_name} {client.last_name}
          </Text>

          {loading ? (
            <Text>Ładowanie…</Text>
          ) : error ? (
            <Text style={{ color: "red" }}>{error}</Text>
          ) : (
            <FlatList<WorkoutItem>
              data={workouts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.workoutTile}>
                  <Text style={styles.workoutName}>{item.name}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  Ten podopieczny nie ma jeszcze żadnych treningów.
                </Text>
              }
            />
          )}

          <TouchableOpacity style={styles.createButton} onPress={onCreateWorkout}>
            <Text style={styles.createButtonText}>➕ Stwórz nowy trening</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};



const styles = StyleSheet.create({

  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
  },

  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  date: {
    marginTop: 4,
    fontSize: 14,
    color: "#777",
  },
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
    marginBottom: 7,
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