import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ExerciseOptions from './ExerciseOptions'; // Upewnij się, że ta ścieżka jest poprawna

// Typy interfejsów pozostają bez zmian
interface Exercise {
  id: number; // Zmieniono na number, bo tak zazwyczaj przychodzi z API
  name: string;
  sets: number;
  reps: number | string;
  weight?: number;
}

interface ExerciseListProps {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
}

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  setExercises,
}) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

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

        {/* 👇 GŁÓWNA ZMIANA JEST TUTAJ 👇 */}
        <ExerciseOptions
          isOpen={isMenuOpen}
          onToggle={() => setOpenMenuId(isMenuOpen ? null : item.id)}
          onEdit={() => {
            // Tutaj logika edycji, np. otwarcie modala
            console.log("Edytuj:", item);
            setOpenMenuId(null);
          }}
          onCopy={() => { /* Logika kopiowania */ }}
          // 1. Przekazujemy ID ćwiczenia, które ma zostać usunięte
          exerciseId={item.id}
          // 2. Przekazujemy funkcję, która zostanie wywołana PO usunięciu
          onDeleted={() => {
            // Ta funkcja filtruje listę ćwiczeń, usuwając z niej to o danym ID
            // To powoduje natychmiastowe odświeżenie interfejsu użytkownika
            setExercises((currentExercises) =>
              currentExercises.filter((ex) => ex.id !== item.id)
            );
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

// Style pozostają bez zmian
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