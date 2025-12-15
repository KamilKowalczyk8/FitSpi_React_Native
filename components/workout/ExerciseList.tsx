import { COLORS } from '@/constants/theme'; // Pamiętaj o imporcie
import { ExerciseResponse } from "@/types/exercise.types";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import ExerciseOptions from "./ExerciseOptions";

type ExerciseListProps = {
  exercises: ExerciseResponse[];
  setExercises: React.Dispatch<React.SetStateAction<ExerciseResponse[]>>;
  onEdit: (exercise: ExerciseResponse) => void;
};

export const ExerciseList: React.FC<ExerciseListProps> = ({
  exercises,
  setExercises,
  onEdit,
}) => {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const renderItem = ({ item }: { item: ExerciseResponse }) => {
    const isMenuOpen = item.id === openMenuId;

    return (
      <View style={[styles.exerciseBox, isMenuOpen && styles.activeExerciseBox]}>
        <View style={styles.infoContainer}>
          <Text style={styles.exerciseName}>{item.name}</Text>
          <Text style={styles.exerciseDetails}>
            {item.sets} serie × {item.reps} powt.
            {item.weight ? ` × ${item.weight} ${item.weightUnits}` : ""}
          </Text>
        </View>

        <ExerciseOptions
          isOpen={isMenuOpen}
          onToggle={() => setOpenMenuId(isMenuOpen ? null : item.id)}
          onEdit={() => {
            onEdit(item);
            setOpenMenuId(null);
          }}
          exerciseId={item.id}
          onDeleted={() => {
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
      style={{ backgroundColor: COLORS.background }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.background, 
    flexGrow: 1,
  },
  exerciseBox: {
    marginBottom: 12,
    paddingVertical: 14, 
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg, 
    borderWidth: 1,
    borderColor: COLORS.border,    
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  activeExerciseBox: {
    zIndex: 1,
    borderColor: COLORS.primary, 
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.text, 
  },
  exerciseDetails: {
    fontSize: 14,
    color: COLORS.textSecondary, 
  },
});

export default ExerciseList;