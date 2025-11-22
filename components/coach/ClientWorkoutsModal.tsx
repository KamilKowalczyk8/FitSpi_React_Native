import { ClientResponse } from '@/controllers/coach/clientLink.controller';
import { WorkoutController } from "@/controllers/workout/workout.controller";
import { useAuth } from "@/hooks/useAuth";
import { useClientWorkoutsController } from "@/hooks/useClientWorkoutsController";
import { WorkoutItem } from "@/models/Workout";
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ClientWorkoutDetailsModal from './exercisesClient/ClientWorkoutDetailsModal';
import ClientWorkoutOptions from './exercisesClient/ClientWorkoutOptions';
import EditWorkoutTitleModal from './exercisesClient/EditWorkoutTitleModal';

import CreateWorkoutModal from './CreateWorkoutModal.tsx';

interface Props {
  visible: boolean;
  onClose: () => void;
  client: ClientResponse;
}

const ClientWorkoutsModal: React.FC<Props> = ({
  visible,
  onClose,
  client,
}) => {
  const { token } = useAuth();
  
  const { workouts, loading, error, refresh } = useClientWorkoutsController(client, visible, false);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);
  const [isDetailsVisible, setDetailsVisible] = useState(false);
  const [isEditTitleVisible, setEditTitleVisible] = useState(false);
  const [isCreateVisible, setCreateVisible] = useState(false); 


  const handleDelete = async (workoutId: number) => {
    if (!token) return;
    try {
      await WorkoutController.deleteWorkout(token, workoutId);
      Alert.alert("Sukces", "Trening został usunięty.");
      refresh(); 
    } catch (e: any) {
      Alert.alert("Błąd", e.message || "Nie udało się usunąć treningu.");
    }
  };

  const handleUpdateTitle = async (newTitle: string) => {
    if (!token || !selectedWorkout) return;
    try {
      await WorkoutController.updateWorkoutDescription(token, selectedWorkout.id, newTitle);
      Alert.alert("Sukces", "Nazwa zmieniona.");
      refresh();
    } catch (e: any) {
      Alert.alert("Błąd", e.message || "Nie udało się zmienić nazwy.");
    }
  };

  const handleWorkoutCreated = () => {
    refresh(); 
    setCreateVisible(false);
    Alert.alert("Sukces", "Trening został utworzony i wysłany do podopiecznego.");
  };

  const openDetails = (workout: WorkoutItem) => {
    setSelectedWorkout(workout);
    setDetailsVisible(true);
  };

  const openEditTitle = (workout: WorkoutItem) => {
    setSelectedWorkout(workout);
    setEditTitleVisible(true);
  };

  return (
    <>
      {/* GŁÓWNY MODAL Z LISTĄ TRENINGÓW */}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
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
              <Text style={{ textAlign: 'center', marginTop: 20 }}>Ładowanie…</Text>
            ) : error ? (
              <Text style={{ color: "red", textAlign: 'center', marginTop: 20 }}>{error}</Text>
            ) : (
              <FlatList<WorkoutItem>
                data={workouts}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                
                renderItem={({ item, index }) => (
                  <View 
                    style={[
                      styles.workoutTile, 
                      { zIndex: 1000 - index } 
                    ]}
                  >
                    <TouchableOpacity 
                      style={{ flex: 1, justifyContent: 'center' }} 
                      onPress={() => openDetails(item)}
                    >
                      <Text style={styles.workoutName}>{item.description}</Text>
                      <Text style={styles.date}>{item.date}</Text>
                    </TouchableOpacity>

                    <ClientWorkoutOptions 
                      onEditTitle={() => openEditTitle(item)}
                      onViewDetails={() => openDetails(item)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Ten podopieczny nie ma jeszcze żadnych treningów.
                  </Text>
                }
              />
            )}

            {/* Przycisk otwierający modal tworzenia */}
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={() => setCreateVisible(true)}
            >
              <Text style={styles.createButtonText}>➕ Stwórz nowy trening</Text>
            </TouchableOpacity>

          </Pressable>
        </Pressable>
      </Modal>

      <ClientWorkoutDetailsModal 
        visible={isDetailsVisible}
        workout={selectedWorkout}
        onClose={() => {
          setDetailsVisible(false);
          setSelectedWorkout(null);
        }}
      />

      <EditWorkoutTitleModal
        visible={isEditTitleVisible}
        initialTitle={selectedWorkout?.description || ""}
        onClose={() => {
          setEditTitleVisible(false);
          setSelectedWorkout(null);
        }}
        onSave={handleUpdateTitle}
      />

      <CreateWorkoutModal
        visible={isCreateVisible}
        onClose={() => setCreateVisible(false)}
        client={client}
        onWorkoutCreated={handleWorkoutCreated} 
      />
    </>
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
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: "#eee",
    borderRadius: 20,
    zIndex: 1,
  },
  closeButtonText: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333", 
    paddingHorizontal: 6 
  },
  title: { 
    fontSize: 16, 
    color: '#888', 
    textAlign: 'center', 
    marginBottom: 5 
  },
  clientName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20 
  },
  workoutTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
    minHeight: 70, 
  },
  workoutName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: "#333",
    marginBottom: 4
  },
  date: { 
    fontSize: 13, 
    color: "#777" 
  },
  emptyText: { 
    textAlign: 'center', 
    paddingVertical: 30, 
    color: '#888', 
    fontSize: 16 
  },
  createButton: { 
    backgroundColor: '#34C759', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  createButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default ClientWorkoutsModal;