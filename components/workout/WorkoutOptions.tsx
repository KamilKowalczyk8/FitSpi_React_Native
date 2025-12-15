import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const COLORS = {
  menuBg: '#2C2C2C',      
  text: '#FFFFFF',        
  primary: '#2979FF',     
  danger: '#FF5252',    
  border: '#3D3D3D',     
};

type Props = {
  onDeleteWorkout: () => void;
  handleEditTitle: () => void;
  handleCopyWorkout?: () => void;
};

const WorkoutOptions = ({ 
  onDeleteWorkout, 
  handleEditTitle, 
  handleCopyWorkout 
}: Props) => {
  const [open, setOpen] = useState(false);

  const toggleOptions = () => setOpen(!open);

  const handleEditAndClose = () => {
    setOpen(false);
    handleEditTitle();
  };

  const handleCopyAndClose = () => {
    setOpen(false);
    handleCopyWorkout?.();
  };

  const handleDeleteAndClose = () => {
    setOpen(false);
    onDeleteWorkout();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.triggerButton} 
        onPress={toggleOptions}
        activeOpacity={0.6}
      >
        <Ionicons name="ellipsis-vertical" size={24} color={COLORS.text} />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          
          <TouchableOpacity style={styles.optionButton} onPress={handleEditAndClose}>
            <Ionicons name="create-outline" size={20} color={COLORS.text} style={styles.icon} />
            <Text style={styles.optionText}>Zmień tytuł</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleCopyAndClose}>
            <Ionicons name="copy-outline" size={20} color={COLORS.text} style={styles.icon} />
            <Text style={styles.optionText}>Kopiuj trening</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.optionButton} onPress={handleDeleteAndClose}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} style={styles.icon} />
            <Text style={[styles.optionText, { color: COLORS.danger }]}>Usuń trening</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 100, 
  },
  triggerButton: {
    padding: 3,
    borderRadius: 20,
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: COLORS.menuBg,
    borderRadius: 12,
    paddingVertical: 5,
    minWidth: 180,
    borderWidth: 1,
    borderColor: COLORS.border,
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
    marginVertical: 4,
  }
});

export default WorkoutOptions;