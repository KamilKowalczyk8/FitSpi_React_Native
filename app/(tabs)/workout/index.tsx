import { SettingsDrawer } from "@/components/SettingsDrawer";
import { DateSlider } from "@/components/workout/DateSlider";
import WorkoutAdd from "@/components/workout/view/WorkoutAdd.view";
import WorkoutOptions from "@/components/workout/WorkoutOptions";
import WorkoutTitle from "@/components/workout/WorkoutTitle";
import { WorkoutController } from "@/controllers/workout/workout.controller";
import { useAuth } from "@/hooks/useAuth";
import { isSameDay } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";


const WorkoutScreen = () => {
  const { user, token } = useAuth(); 

  const [selectedWorkout, setSelectedWorkout] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [workouts, setWorkouts] = useState<any[]>([]);

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
  const workout = workouts.find((w) => isSameDay(new Date(w.date), selectedDate));
  if (workout) {
    setSelectedWorkout(workout);
  } else {
    setSelectedWorkout(null);
  }
}, [selectedDate, workouts]);


const handleWorkoutCreated = async (title: string) => {
  if (!token) {
    Alert.alert("Błąd", "Nie jesteś zalogowany");
    return;
  }

  try {
    const newWorkout = await WorkoutController.createWorkout(
      token,
      title,
      selectedDate,
      1
    );

    setWorkouts((prev) => [...prev, newWorkout]);
    setSelectedWorkout(newWorkout); 

    console.log("Trening zapisany:", newWorkout);
  } catch (error) {
    console.error(error);
    Alert.alert("Błąd", "Nie udało się utworzyć treningu");
  }
};



const handleDeleteWorkout = async () => {
  if (!token || !selectedWorkout) return;

  try {
    await WorkoutController.deleteWorkout(token, selectedWorkout.id);

    // usuń z lokalnego stanu
    setWorkouts((prev) => prev.filter((w) => w.id !== selectedWorkout.id));
    setSelectedWorkout(null);

    Alert.alert("Sukces", "Trening został usunięty");
  } catch (error) {
    console.error(error);
    Alert.alert("Błąd", "Nie udało się usunąć treningu");
  }
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
    <WorkoutOptions onDeleteWorkout={handleDeleteWorkout} />
  </View>
) : (
  // pusty kontener zamiast przycisku dodawania
  <View style={styles.addSection}>
    <WorkoutAdd onWorkoutCreated={handleWorkoutCreated} />
  </View>
)}

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
    paddingVertical: 4,
    backgroundColor: "#f0f0f0",
    position: "relative",
  },
  addSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2d1e83ff",
    width: "100%",
  },
  titleAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
});

export default WorkoutScreen;