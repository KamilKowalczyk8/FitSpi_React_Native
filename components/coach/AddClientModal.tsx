import { useAddClientController } from '@/hooks/useAddClientController';
import React from 'react';
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface AddClientModalProps {
  visible: boolean;
  onClose: () => void;
  onInvitationSent: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ visible, onClose, onInvitationSent }) => {

  const {
    email,
    setEmail,
    isLoading,
    errors,
    handleSendInvitation,
    handleClose,
  } = useAddClientController({ onClose, onInvitationSent });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Zaproś podopiecznego</Text>
          <Text style={styles.label}>Wpisz adres e-mail użytkownika, którego chcesz dodać:</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]} 
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleClose} disabled={isLoading}>
              <Text style={styles.buttonText}>Anuluj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={handleSendInvitation} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Wyślij</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 4, 
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    marginBottom: 12, 
    marginLeft: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#aaa',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#1e90ff',
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AddClientModal;