import AddClientButton from '@/components/coach/AddClientButton';
import AddClientModal from '@/components/coach/AddClientModal';
import ClientList from '@/components/coach/ClientList';
import ClientWorkoutsModal from '@/components/coach/ClientWorkoutsModal';
import CreateWorkoutModal from '@/components/coach/CreateWorkoutModal.tsx';
import { SettingsDrawer } from '@/components/SettingsDrawer';
import { useCoachController } from '@/hooks/useCoachController';
import { StyleSheet, Text, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  clientsSection: {
    flex: 1,
    marginTop: 20,
  }
});

export default function CoachScreen() {
  const {
    clients,
    isLoading,
    error,
    isModalVisible,
    openModal,
    closeModal,
    fetchClients,
    selectedClient,
    isBrowseModalVisible,
    openBrowseModal,
    closeBrowseModal,

    isCreateModalVisible,
    openCreateWorkoutModal,
    closeCreateWorkoutModal,
  } = useCoachController();

  return (
    <View style={styles.container}> 
      <SettingsDrawer />
      <Text style={styles.heading}>Twoi Podopieczni</Text>

      <View style={styles.clientsSection}>
        <AddClientButton onPress={openModal} />
        
        <ClientList 
          clients={clients} 
          isLoading={isLoading} 
          error={error} 
          onBrowseWorkouts={openBrowseModal}
        />
      </View>

      <AddClientModal
        visible={isModalVisible}
        onClose={closeModal}
        onInvitationSent={fetchClients} 
      />

      {selectedClient && (
      <>
      <ClientWorkoutsModal
            visible={isBrowseModalVisible}
            onClose={closeBrowseModal}
            client={selectedClient}
            onCreateWorkout={openCreateWorkoutModal} refreshAfterCreate={false}    />

    <CreateWorkoutModal
      visible={isCreateModalVisible}
      onClose={closeCreateWorkoutModal}
      client={selectedClient}
    />
  </>
)}

    </View>
  );
}