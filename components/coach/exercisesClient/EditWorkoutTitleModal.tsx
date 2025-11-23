import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  initialTitle: string;
  onSave: (newTitle: string) => Promise<void>;
}

const EditWorkoutTitleModal: React.FC<Props> = ({ visible, onClose, initialTitle, onSave }) => {
  const [title, setTitle] = useState(initialTitle);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle, visible]);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    await onSave(title);
    setLoading(false);
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <View style={styles.bubbleContainer}>
          <Text style={styles.header}>Zmień nazwę treningu</Text>
          
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Wpisz nową nazwę..."
            autoFocus
            selectTextOnFocus 
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Anuluj</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveText}>Zapisz</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bubbleContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#f2f2f2', 
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10, // Odstęp między guzikami
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditWorkoutTitleModal;