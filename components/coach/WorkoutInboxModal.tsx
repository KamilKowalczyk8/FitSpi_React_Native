import { CopyWorkoutModal } from '@/components/workout/view/CopyWorkoutModal';
import { PendingWorkout, useWorkoutInbox } from '@/hooks/useWorkoutInbox';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const WorkoutInboxModal: React.FC<Props> = ({ visible, onClose }) => {
  const {
    workouts,
    loading,
    actionLoading,
    isModalVisible,
    openAcceptModal,
    closeAcceptModal,
    handleConfirmAccept,
    handleReject, 
  } = useWorkoutInbox(visible);

  const confirmReject = (id: number) => {
    Alert.alert(
      "Odrzuć trening",
      "Czy na pewno chcesz odrzucić tę propozycję?",
      [
        { text: "Anuluj", style: "cancel" },
        { text: "Odrzuć", style: "destructive", onPress: () => handleReject(id) }
      ]
    );
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={styles.container} onPress={() => {}}>
            
            <View style={styles.header}>
              <Text style={styles.title}>📬 Oczekujące treningi</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#34C759" style={{ marginTop: 20 }} />
            ) : (
              <FlatList<PendingWorkout>
                data={workouts}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>Brak nowych treningów od trenera.</Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.row}>
                    <View style={styles.info}>
                      <Text style={styles.workoutName}>{item.description}</Text>
                      <Text style={styles.subText}>
                        Utworzono: {new Date(item.created_at).toLocaleDateString()}
                      </Text>
                    </View>

                    <View style={styles.actions}>
                        {/* Przycisk AKCEPTUJ */}
                        <TouchableOpacity
                          style={styles.acceptBtn}
                          onPress={() => openAcceptModal(item.id)}
                          disabled={actionLoading === item.id}
                        >
                          {actionLoading === item.id ? (
                            <ActivityIndicator color="#fff" size="small" />
                          ) : (
                            <Text style={styles.acceptText}>Akceptuj</Text>
                          )}
                        </TouchableOpacity>

                         {/* Przycisk ODRZUĆ */}
                        <TouchableOpacity
                          style={styles.rejectBtn}
                          onPress={() => confirmReject(item.id)}
                          disabled={actionLoading === item.id}
                        >
                          <Text style={styles.rejectText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>

      <CopyWorkoutModal
        isVisible={isModalVisible}
        onClose={closeAcceptModal}
        onConfirm={handleConfirmAccept} 
        title="Zaplanuj ten trening na:"
        confirmText="Zatwierdź"
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
    height: '70%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  closeBtn: { padding: 5 },
  closeText: { fontSize: 20, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888', fontSize: 16 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  info: { flex: 1 },
  workoutName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  subText: { fontSize: 12, color: '#888' },
  
  actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
  },
  acceptBtn: {
    backgroundColor: '#34C759',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  acceptText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  

  rejectBtn: {
      backgroundColor: '#ffebee', 
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ffcdd2'
  },
  rejectText: {
      color: '#d32f2f', 
      fontWeight: 'bold',
      fontSize: 14
  }
});

export default WorkoutInboxModal;