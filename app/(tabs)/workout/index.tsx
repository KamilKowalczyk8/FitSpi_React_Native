import { DateSlider } from '@/components/workout/DateSlider';
import { ExerciseList } from '@/components/workout/ExerciseList';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const WorkoutScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Start your training</Text>

      {/* Dni tygodnia jako slider */}
      <View style={styles.containerdate}>
        <DateSlider selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </View>

      <View style={styles.containertraining}>
        <ExerciseList
          exercises={[
          { name: 'Przysiady', sets: 4, reps: 10, weight: 60 },
          { name: 'Wyciskanie sztangi', sets: 3, reps: 8, weight: 50 },
          { name: 'Podciąganie', sets: 4, reps: 6 },
          { name: 'Podciąganie', sets: 4, reps: 6 },
          { name: 'Podciąganie', sets: 4, reps: 6 },

          { name: 'Podciąganie', sets: 4, reps: 6 },
          
          { name: 'Podciąganie', sets: 4, reps: 6 },

          
          { name: 'Podciąganie', sets: 4, reps: 6 },
          { name: 'Podciąganie', sets: 4, reps: 6 },

          { name: 'Podciąganie', sets: 4, reps: 6 },


        ]}
        />
      </View>


      {/* Reszta komponentów */}
    </View>
  );
};

const styles = StyleSheet.create({
  containerdate: {
    paddingBottom: 10,
    backgroundColor: '#7fff00',
  },
  containertraining: {
    flex: 1,
    backgroundColor: '#00008b',
  },
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default WorkoutScreen;
