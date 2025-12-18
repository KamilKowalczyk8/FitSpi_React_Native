import { getWorkoutStatusColor, getWorkoutStatusLabel } from '@/app/utils/workoutStatusHelper';
import { COLORS } from '@/constants/theme';
import { ClientResponse } from '@/controllers/coach/clientLink.controller';
import { WorkoutController } from "@/controllers/workout/workout.controller";
import { useAuth } from "@/hooks/useAuth";
import { useClientWorkoutsController } from "@/hooks/useClientWorkoutsController";
import { WorkoutItem, WorkoutStatus } from "@/models/Workout";
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CreateWorkoutModal from './CreateWorkoutModal.tsx';
import ClientWorkoutDetailsModal from './exercisesClient/ClientWorkoutDetailsModal';
import ClientWorkoutOptions from './exercisesClient/ClientWorkoutOptions';
import EditWorkoutTitleModal from './exercisesClient/EditWorkoutTitleModal';

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

  const filteredWorkouts = workouts.filter(w => w.status !== WorkoutStatus.ACCEPTED);

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
      setEditTitleVisible(false);
      Alert.alert("Sukces", "Nazwa zmieniona.");
      refresh();
    } catch (e: any) {
      Alert.alert("Błąd", e.message || "Nie udało się zmienić nazwy.");
    }
  };

  const handleSendWorkout = async (workoutId: number) => {
    if (!token) return;
    try {
      await WorkoutController.sendWorkout(token, workoutId);
      Alert.alert("Sukces", "Trening został wysłany do podopiecznego.");
      refresh();
    } catch (e: any) {
      Alert.alert("Błąd", e.message || "Nie udało się wysłać treningu.");
    }
  };

  const handleWorkoutCreated = () => {
    refresh(); 
    setCreateVisible(false);
    Alert.alert("Sukces", "Szkic treningu został utworzony. Możesz go teraz edytować i wysłać.");
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
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.container}>

            {/* Header: Close Button & Title */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.title}>Treningi dla</Text>
                <Text style={styles.clientName}>
                {client.first_name} {client.last_name}
                </Text>
            </View>

            {/* Content */}
            {loading ? (
               <View style={styles.centerContent}>
                   <ActivityIndicator size="large" color={COLORS.primary} />
               </View>
            ) : error ? (
              <View style={styles.centerContent}>
                   <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <FlatList<WorkoutItem>
                data={filteredWorkouts}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                
                renderItem={({ item, index }) => (
                  <View 
                    style={[
                      styles.workoutTile, 
                      { zIndex: 1000 - index } 
                    ]}
                  >
                    <TouchableOpacity 
                      style={styles.tileContent} 
                      onPress={() => openDetails(item)}
                    >
                      <Text style={styles.workoutName} numberOfLines={1}>{item.description}</Text>
                      <View style={styles.metaRow}>
                          <Text style={styles.date}>{item.date}</Text>
                          <Text style={[styles.statusText, { color: getWorkoutStatusColor(item.status) }]}>
                            • {getWorkoutStatusLabel(item.status)}
                          </Text>
                      </View>
                    </TouchableOpacity>

                    <ClientWorkoutOptions 
                      status={item.status}
                      onSend={() => handleSendWorkout(item.id)}
                      onEditTitle={() => openEditTitle(item)}
                      onViewDetails={() => openDetails(item)}
                      onDelete={() => handleDelete(item.id)}
                    />
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>
                    Ten podopieczny nie ma jeszcze żadnych aktywnych treningów.
                  </Text>
                }
              />
            )}

            <TouchableOpacity 
              style={styles.createButton} 
              onPress={() => setCreateVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle" size={20} color="#fff" style={{marginRight: 8}} />
              <Text style={styles.createButtonText}>Stwórz nowy trening</Text>
            </TouchableOpacity>

          </View>
        </View>
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
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: COLORS.modalBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    
    // Cienie
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    padding: 5,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  title: { 
    fontSize: 14, 
    color: COLORS.textSecondary, 
    marginBottom: 4 
  },
  clientName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: COLORS.text, 
    textAlign: 'center', 
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  listContent: {
      paddingBottom: 20,
  },
  workoutTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg, // Ciemne tło karty
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tileContent: {
      flex: 1,
      marginRight: 10,
  },
  workoutName: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: COLORS.text,
    marginBottom: 4
  },
  metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  date: { 
    fontSize: 13, 
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyText: { 
    textAlign: 'center', 
    paddingVertical: 40, 
    color: COLORS.textSecondary, 
    fontSize: 15,
    fontStyle: 'italic',
  },
  errorText: {
      color: COLORS.danger,
      textAlign: 'center',
      fontSize: 16,
  },
  createButton: { 
    flexDirection: 'row',
    backgroundColor: COLORS.primary, // Neon Blue
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  createButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default ClientWorkoutsModal;