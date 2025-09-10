import { StyleSheet, Text } from "react-native";

type Props = {
  title: string;
};

const WorkoutTitle = ({ title }: Props) => {
  return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
  title: {
    backgroundColor: "#ff8c00",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
});

export default WorkoutTitle;
