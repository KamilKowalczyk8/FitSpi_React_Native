import { addDays, format, isSameDay, startOfWeek } from "date-fns";
import { pl } from "date-fns/locale";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
const COLORS = {
  background: '#121212',
  cardBg: '#2C2C2C',
  primary: '#2979FF', 
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
};

interface DateSliderProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const generateWeekDays = (baseDate: Date) => {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    return {
      fullDate: date,
      dayNumber: format(date, "dd MMM", { locale: pl }),
      weekDay: format(date, "EEE", { locale: pl }),
    };
  });
};

export const DateSlider: React.FC<DateSliderProps> = ({ selectedDate, onSelectDate }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [days, setDays] = useState(generateWeekDays(new Date()));
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const newDays = generateWeekDays(addDays(new Date(), weekOffset * 7));
    setDays(newDays);
    scrollRef.current?.scrollTo({ x: 0, animated: false });
  }, [weekOffset]);

  const goToNextWeek = () => setWeekOffset(weekOffset + 1);
  const goToPrevWeek = () => setWeekOffset(weekOffset - 1);

  return (
    <View style={styles.container}>
      {/* Strzałka w lewo */}
      <TouchableOpacity onPress={goToPrevWeek} style={[styles.arrowButton, { left: 0 }]}>
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weekContainer}
        ref={scrollRef}
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
                isSelected ? styles.selectedDayBox : isToday ? styles.todayDayBox : null,
              ]}
            >
              <Text style={[styles.dayNumber, isSelected ? styles.selectedText : isToday ? styles.todayText : null]}>
                {day.dayNumber}
              </Text>
              <Text style={[styles.weekDay, isSelected ? styles.selectedText : isToday ? styles.todayText : null]}>
                {day.weekDay}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity onPress={goToNextWeek} style={[styles.arrowButton, { right: 0 }]}>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: COLORS.background, 
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 30, 
  },
  dayBox: {
    width: 70,
    maxHeight: 70,
    alignItems: "center",
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.cardBg, 
  },
  selectedDayBox: {
    backgroundColor: COLORS.primary, 
  },
  todayDayBox: {
    backgroundColor: COLORS.cardBg, 
    borderWidth: 1,                 
    borderColor: COLORS.primary,    
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text, 
  },
  weekDay: {
    fontSize: 14,
    color: COLORS.textSecondary, 
  },
  selectedText: {
    color: '#FFFFFF', 
  },
  todayText: {
    color: COLORS.primary, 
    fontWeight: "bold",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    marginTop: -18,
    paddingHorizontal: 10,
    zIndex: 10,
  },
  arrowText: {
    fontSize: 40,
    color: COLORS.primary, 
    fontWeight: "bold",
  },
});