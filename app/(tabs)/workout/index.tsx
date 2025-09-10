import { SettingsDrawer } from "@/components/SettingsDrawer";
import { DateSlider } from "@/components/workout/DateSlider";
import WorkoutAdd from "@/components/workout/WorkoutAdd";
import WorkoutOptions from "@/components/workout/WorkoutOptions";
import WorkoutTitle from "@/components/workout/WorkoutTitle";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const WorkoutScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workoutTitle, setWorkoutTitle] = useState("");

  return (
    <View style={styles.container}>
      <SettingsDrawer />

      <Text style={styles.heading}>Twój trening</Text>

      <View style={styles.containerdate}>
        <DateSlider selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </View>

      {workoutTitle !== "" && (
      <View style={styles.titleSection}>
        <View style={styles.titleAbsolute}>
          <WorkoutTitle title={workoutTitle} />
        </View>
        <WorkoutOptions onDeleteWorkout={() => setWorkoutTitle("")} />

      </View>
      )}


     {workoutTitle === "" && (
      <View style={styles.addSection}>
        <WorkoutAdd onWorkoutCreated={setWorkoutTitle} />
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
