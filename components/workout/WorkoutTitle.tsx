import { StyleSheet, Text } from "react-native";

const COLORS = {
  text: '#FFFFFF',       
  primary: '#2979FF',    
};

type Props = {
  title: string;
};

const WorkoutTitle = ({ title }: Props) => {
  return (
    <Text 
      style={styles.title} 
      numberOfLines={1} 
      adjustsFontSizeToFit 
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    color: COLORS.text,        
    fontSize: 18,
    fontWeight: "700",         
    textAlign: "center",
    letterSpacing: 0.5,       
    textTransform: 'capitalize', 
  },
});

export default WorkoutTitle;