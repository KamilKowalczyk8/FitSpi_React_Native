import { SettingsDrawer } from "@/components/SettingsDrawer";
import { DateSlider } from "@/components/workout/DateSlider";
import WorkoutAdd from "@/components/workout/view/WorkoutAdd.view";
import WorkoutOptions from "@/components/workout/WorkoutOptions";
import WorkoutTitle from "@/components/workout/WorkoutTitle";
import { WorkoutController } from "@/controllers/workout/workout.controller";
import { useAuth } from "@/hooks/useAuth";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WorkoutScreen = () => {
  const { user, token } = useAuth(); 

  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workouts, setWorkouts] = useState<any[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<any | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!token) return;
      try {
        const data = await WorkoutController.getWorkouts(token);
        setWorkouts(data);
      } catch (error) {
        console.error(error);
        Alert.alert("Błąd", "Nie udało się pobrać treningów");
      }
    };
    fetchWorkouts();
  }, [token]);

  useEffect(() => {
    const workout = workouts.find(w => isSameDay(new Date(w.date), new Date(selectedDate)));
    setSelectedWorkout(workout || null);
  }, [selectedDate, workouts]);

  const handleDeleteWorkout = async () => {
    if (!token || !selectedWorkout) return;

    try {
      await WorkoutController.deleteWorkout(token, selectedWorkout.id);
      setWorkouts(prev => prev.filter(w => w.id !== selectedWorkout.id));
      setSelectedWorkout(null);
      Alert.alert("Sukces", "Trening został usunięty");
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się usunąć treningu");
    }
  };

  const openCreateModal = () => {
    setEditingWorkout(null);
    setModalVisible(true);
  };

  const openEditModal = () => {
    if (!selectedWorkout) return;
    setEditingWorkout(selectedWorkout);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SettingsDrawer />

      <Text style={styles.heading}>Twój trening</Text>

      <View style={styles.containerdate}>
        <DateSlider selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </View>

      {selectedWorkout ? (
        <View style={styles.titleSection}>
          <View style={styles.titleAbsolute}>
            <WorkoutTitle title={selectedWorkout.description} />
          </View>
          <WorkoutOptions
            onDeleteWorkout={handleDeleteWorkout}
            handleEditTitle={openEditModal}
          />
        </View>
      ) : (
        <View style={styles.addSection}>
          <TouchableOpacity onPress={openCreateModal} style={styles.createButton}>
            <Text style={{ color: "#fff", fontSize: 18 }}>➕ Stwórz trening</Text>
          </TouchableOpacity>
        </View>
      )}

      <WorkoutAdd
        modalVisible={modalVisible}
        initialTitle={editingWorkout?.description || ""}
        onClose={() => setModalVisible(false)}
        onWorkoutCreated={async (title) => {
          if (!token) return;

          if (editingWorkout) {
            const updatedWorkout = await WorkoutController.updateWorkoutDescription(
              token,
              editingWorkout.id,
              title
            );
            setWorkouts(prev => prev.map(w => w.id === updatedWorkout.id ? updatedWorkout : w));
            setSelectedWorkout(updatedWorkout);
          } else {
            const newWorkout = await WorkoutController.createWorkout(token, title, selectedDate, 1);
            setWorkouts(prev => [...prev, newWorkout]);
            setSelectedWorkout(newWorkout);
          }

          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  containerdate: {
    paddingBottom: 10,
    backgroundColor: "#7fff00",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  titleAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  addSection: {
    flex: 1, // teraz przycisk jest w środku sekcji
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2d1e83ff",
    width: "100%",
  },
  createButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
});

export default WorkoutScreen;
