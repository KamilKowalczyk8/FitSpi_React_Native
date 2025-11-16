import { ClientResponse } from '@/controllers/coach/clientLink.controller';
import { useCreateWorkoutController } from '@/hooks/useCreateWorkoutController';
import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  client: ClientResponse;
  onWorkoutCreated?: () => void;
}


const CreateWorkoutModal: React.FC<Props> = ({
  visible,
  onClose,
  client,
  onWorkoutCreated
}) => {
  const {
    description,
    setDescription,
    date,
    setDate,
    isLoading,
    error,
    handleCreate,
  } = useCreateWorkoutController({ client, onClose, onWorkoutCreated });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Nowy trening dla</Text>
          <Text style={styles.clientName}>{client.first_name} {client.last_name}</Text>

          <Text style={styles.label}>Nazwa treningu</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Podaj nazwe treningu"
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.createButton, isLoading && styles.disabledButton]}
            onPress={handleCreate}
            disabled={isLoading}
          >
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createButtonText}>Stwórz</Text>}
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 9,
    right: 10,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 7,
  },
  clientName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20, 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '500', 
    marginTop: 10, 
    marginBottom: 5 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
  },
  createButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  createButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default CreateWorkoutModal;