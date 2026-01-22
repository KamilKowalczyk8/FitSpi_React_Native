import { SettingsDrawer } from "@/components/SettingsDrawer";
import { DateSlider } from "@/components/workout/DateSlider";
import ExerciseList from "@/components/workout/ExerciseList";
import { CopyWorkoutModal } from "@/components/workout/view/CopyWorkoutModal";
import { ExerciseAdd } from "@/components/workout/view/ExcerciseAdd.view";
import WorkoutAdd from "@/components/workout/view/WorkoutAdd.view";
import WorkoutOptions from "@/components/workout/WorkoutOptions";
import WorkoutTitle from "@/components/workout/WorkoutTitle";
import { useWorkoutScreen } from "@/hooks/useWorkoutScreen";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  background: '#121212',
  cardBg: '#1E1E1E',
  primary: '#2979FF', 
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  success: '#00C853', 
};

const WorkoutScreen = () => {
  const {
    selectedDate,
    selectedWorkout,
    exercises,
    editingWorkout,
    editingExercise,
    workoutModalVisible,
    copyModalVisible,
    exerciseModalVisible,
    setSelectedDate,
    setExercises,
    setWorkoutModalVisible,
    setCopyModalVisible,
    setExerciseModalVisible, 
    handleSaveWorkout,
    handleDeleteWorkout,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleConfirmCopy,
    handleSaveExercise,
    handleEditExercise,
    handleCloseExerciseModal
  } = useWorkoutScreen();

  return (
    <View style={styles.container}>
      <SettingsDrawer />

      <Text style={styles.heading}>Twój trening</Text>

      <View style={styles.containerdate}>
        <DateSlider selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </View>

      {selectedWorkout ? (
        <View style={{ flex: 1 }}>
          <View style={styles.titleSection}>
            <View style={styles.titleAbsolute}>
              <WorkoutTitle title={selectedWorkout.description || ""} />
            </View>
            <WorkoutOptions
              onDeleteWorkout={handleDeleteWorkout}
              handleEditTitle={handleOpenEditModal}
              handleCopyWorkout={() => setCopyModalVisible(true)}
            />
          </View>

          <View style={{ flex: 1, marginTop: 1 }}>
            <ExerciseList
              exercises={exercises}
              setExercises={setExercises}
              onEdit={handleEditExercise}
            />
          </View>

          <View style={styles.exerciseAddSection}>
            <TouchableOpacity
              onPress={() => setExerciseModalVisible(true)}
              style={styles.addExerciseButton}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={24} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.addExerciseText}>Dodaj ćwiczenie</Text>
            </TouchableOpacity>

            <ExerciseAdd
              modalVisible={exerciseModalVisible}
              onClose={handleCloseExerciseModal}
              onExerciseAdded={handleSaveExercise}
              initialData={editingExercise}
            />
          </View>
        </View>
      ) : (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIconBg}>
            <Ionicons name="barbell-outline" size={60} color={COLORS.primary} />
          </View>
          <Text style={styles.emptyStateTitle}>Dzień wolny?</Text>
          <Text style={styles.emptyStateSubtitle}>
            Nie masz zaplanowanego treningu na ten dzień.
          </Text>

          <TouchableOpacity 
            onPress={handleOpenCreateModal} 
            style={styles.createWorkoutButton}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFF" />
            <Text style={styles.createWorkoutButtonText}>Stwórz trening</Text>
          </TouchableOpacity>
        </View>
      )}

      <WorkoutAdd
        modalVisible={workoutModalVisible}
        initialTitle={editingWorkout?.description || ""}
        onClose={() => setWorkoutModalVisible(false)}
        onWorkoutCreated={handleSaveWorkout}
      />

      <CopyWorkoutModal
        isVisible={copyModalVisible}
        onClose={() => setCopyModalVisible(false)}
        onConfirm={handleConfirmCopy}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60, 
    backgroundColor: COLORS.background, 
  },
  containerdate: {
    paddingBottom: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 15,
    color: COLORS.text, 
    letterSpacing: 0.5,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 13,
    backgroundColor: COLORS.cardBg, 
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    position: "relative",
  },
  titleAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  emptyStateIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1E2A38', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  createWorkoutButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary, 
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30, 
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  createWorkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exerciseAddSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 10,
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  addExerciseButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg, 
    borderWidth: 1,
    borderColor: COLORS.primary, 
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  addExerciseText: {
    color: COLORS.primary, 
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutScreen;