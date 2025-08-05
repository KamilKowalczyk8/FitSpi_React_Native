import { format, isSameDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

interface DateSliderProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const generateDateRange = () => {
  const days = [];

  for (let i = -30; i <= 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    days.push({
      fullDate: date,
      dayNumber: format(date, 'dd MMM', { locale: pl }),
      weekDay: format(date, 'EEE', { locale: pl }),
    });
  }

  return days;
};

export const DateSlider: React.FC<DateSliderProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const [days] = useState(generateDateRange());

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.sliderContainer}
    >
      {days.map((day, index) => {
        const isSelected = isSameDay(selectedDate, day.fullDate);
        const isToday = isSameDay(day.fullDate, new Date());

        return (
          <TouchableOpacity
            key={index}
            onPress={() => onSelectDate(day.fullDate)}
            style={[
              styles.dayBox,
              isSelected && styles.selectedDayBox,
              isToday && !isSelected && styles.todayBox,
            ]}
          >
            <Text style={[styles.dayNumber, (isSelected || isToday) && styles.selectedText]}>
              {day.dayNumber}
            </Text>
            <Text style={[styles.weekDay, (isSelected || isToday) && styles.selectedText]}>
              {day.weekDay}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  sliderContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 5,
  },
  dayBox: {
    width: 70,
    maxHeight: 70,
    alignItems: 'center',
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#E6F0FA',
  },
  selectedDayBox: {
    backgroundColor: '#4CAF50',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  weekDay: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
});
