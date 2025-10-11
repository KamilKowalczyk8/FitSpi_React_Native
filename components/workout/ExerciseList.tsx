import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ExerciseOptions from './ExerciseOptions';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number | string;
  weight?: number;
}

interface ExerciseListProps {
  exercises: Exercise[];
  onEditExercise: (exercise: Exercise) => void;
  onDeleteExercise: (exerciseId: string) => void;
  onCopyExercise: (exercise: Exercise) => void;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  onEditExercise,
  onDeleteExercise,
  onCopyExercise,
}) => {

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const renderItem = ({ item }: { item: Exercise }) => {
    const isMenuOpen = item.id === openMenuId;

    return (
      <View style={[styles.exerciseBox, isMenuOpen && styles.activeExerciseBox]}>
        <View style={styles.infoContainer}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseDetails}>
            {item.sets} serie × {item.reps} powt.
            {item.weight ? ` × ${item.weight} kg` : ''}
          </Text>
        </View>
        <ExerciseOptions
          isOpen={isMenuOpen}
          onToggle={() => setOpenMenuId(isMenuOpen ? null : item.id)}
          onEdit={() => {
            onEditExercise(item);
            setOpenMenuId(null);
          }}
          onDelete={() => {
            onDeleteExercise(item.id);
            setOpenMenuId(null);
          }}
          onCopy={() => {
            onCopyExercise(item);
            setOpenMenuId(null);
          }}
        />
      </View>
    );
  };

  return (
    <FlatList
      data={exercises}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      removeClippedSubviews={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  exerciseBox: {
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#F2F7FB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  activeExerciseBox: {
    zIndex: 1,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
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