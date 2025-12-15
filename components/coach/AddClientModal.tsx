import { COLORS } from '@/constants/theme';
import { useAddClientController } from '@/hooks/useAddClientController';
import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.container}>
                        <Text style={styles.title}>Zaproś podopiecznego</Text>
                    
                        <Text style={styles.label}>
                            Wpisz adres e-mail użytkownika, którego chcesz dodać:
                        </Text>
                        <TextInput
                            style={[
                                styles.input, 
                                errors.email && styles.inputError
                            ]}
                            placeholder="email@example.com"
                            placeholderTextColor={COLORS.textPlaceholder}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        
                        {errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity 
                                style={styles.cancelButton} 
                                onPress={handleClose} 
                                disabled={isLoading}
                            >
                                <Text style={styles.cancelButtonText}>Anuluj</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.sendButton} 
                                onPress={handleSendInvitation} 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.sendButtonText}>Wyślij</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        backgroundColor: COLORS.modalBg,
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
        color: COLORS.text,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 10,
    },
    input: {
        backgroundColor: COLORS.inputBg,
        color: COLORS.text,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 6,
    },
    inputError: {
        borderColor: COLORS.danger,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 12,
        marginBottom: 12,
        marginLeft: 4,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 15,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.danger,
        backgroundColor: 'transparent',
    },
    cancelButtonText: {
        color: COLORS.text,
        fontWeight: '600',
        fontSize: 16,
    },
    sendButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        elevation: 2,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default AddClientModal;