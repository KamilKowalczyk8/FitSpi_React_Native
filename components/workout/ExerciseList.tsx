import React from 'react';
import { ScrollView, StyleSheet, Text, View, } from 'react-native';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number; 
}

interface ExerciseListProps {
  exercises: Exercise[];
}

export const ExerciseList: React.FC<ExerciseListProps> = ({ exercises }) => {
  return (
    <ScrollView style={styles.container}>
      {exercises.map((exercise, index) => (
        <View key={index} style={styles.exerciseBox}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseDetails}>
            Serie: {exercise.sets} × Powtórzenia: {exercise.reps}
            {exercise.weight ? ` × Ciężar: ${exercise.weight} kg` : ''}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  exerciseBox: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F2F7FB',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default ExerciseList;
