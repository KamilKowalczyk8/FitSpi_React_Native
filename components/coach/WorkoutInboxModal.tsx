import { CopyWorkoutModal } from '@/components/workout/view/CopyWorkoutModal';
import { COLORS } from '@/constants/theme'; // Import motywu
import { PendingWorkout, useWorkoutInbox } from '@/hooks/useWorkoutInbox';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
}

const WorkoutInboxModal: React.FC<Props> = ({ visible, onClose }) => {
    const {
        workouts,
        loading,
        actionLoading,
        isModalVisible,
        openAcceptModal,
        closeAcceptModal,
        handleConfirmAccept,
        handleReject, 
    } = useWorkoutInbox(visible);

    const confirmReject = (id: number) => {
        Alert.alert(
            "Odrzuć trening",
            "Czy na pewno chcesz odrzucić tę propozycję?",
            [
                { text: "Anuluj", style: "cancel" },
                { 
                    text: "Odrzuć", 
                    style: "destructive", 
                    onPress: () => handleReject(id) 
                }
            ]
        );
    };

    return (
        <>
            <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
                <Pressable style={styles.overlay} onPress={onClose}>
                    <Pressable style={styles.container} onPress={() => {}}>
                        
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.headerTitleRow}>
                                <Ionicons name="mail-unread-outline" size={24} color={COLORS.primary} style={{marginRight: 10}} />
                                <Text style={styles.title}>Oczekujące treningi</Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                                <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* Content */}
                        {loading ? (
                            <View style={styles.centerContent}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </View>
                        ) : (
                            <FlatList<PendingWorkout>
                                data={workouts}
                                keyExtractor={(item) => item.id.toString()}
                                contentContainerStyle={styles.listContent}
                                ListEmptyComponent={
                                    <View style={styles.centerContent}>
                                        <Ionicons name="checkmark-done-circle-outline" size={50} color={COLORS.textPlaceholder} />
                                        <Text style={styles.emptyText}>Brak nowych treningów od trenera.</Text>
                                    </View>
                                }
                                renderItem={({ item }) => (
                                    <View style={styles.card}>
                                        <View style={styles.info}>
                                            <Text style={styles.workoutName}>{item.description}</Text>
                                            <View style={styles.metaRow}>
                                                <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} style={{marginRight: 5}} />
                                                <Text style={styles.subText}>
                                                    Otrzymano: {new Date(item.created_at).toLocaleDateString()}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.actions}>
                                            

                                            <TouchableOpacity
                                                style={styles.acceptBtn}
                                                onPress={() => openAcceptModal(item.id)}
                                                disabled={actionLoading === item.id}
                                                activeOpacity={0.7}
                                            >
                                                {actionLoading === item.id ? (
                                                    <ActivityIndicator color="#fff" size="small" />
                                                ) : (
                                                    <>
                                                        <Ionicons name="download-outline" size={18} color="#fff" style={{marginRight: 6}} />
                                                        <Text style={styles.acceptText}>Pobierz</Text>
                                                    </>
                                                )}
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.rejectBtn}
                                                onPress={() => confirmReject(item.id)}
                                                disabled={actionLoading === item.id}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />
                        )}
                    </Pressable>
                </Pressable>
            </Modal>

            <CopyWorkoutModal
                isVisible={isModalVisible}
                onClose={closeAcceptModal}
                onConfirm={handleConfirmAccept} 
                title="Zaplanuj ten trening na:"
                confirmText="Zatwierdź"
            />
        </>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: COLORS.modalBg,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold',
        color: COLORS.text, 
    },
    closeBtn: { 
        padding: 5 
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 150,
    },
    emptyText: { 
        textAlign: 'center', 
        marginTop: 15, 
        color: COLORS.textSecondary, 
        fontSize: 16 
    },
    listContent: {
        paddingBottom: 10,
    },
    card: {
        backgroundColor: COLORS.cardBg,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    info: { 
        flex: 1,
        marginRight: 10,
    },
    workoutName: { 
        fontSize: 16, 
        fontWeight: '600', 
        marginBottom: 6,
        color: COLORS.text, 
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    subText: { 
        fontSize: 12, 
        color: COLORS.textSecondary, 
    },
    
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    acceptBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary, 
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        minWidth: 100,
        justifyContent: 'center',
    },
    acceptText: { 
        color: '#fff', 
        fontWeight: 'bold', 
        fontSize: 14 
    },
    rejectBtn: {
        backgroundColor: 'transparent', 
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.danger,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default WorkoutInboxModal;