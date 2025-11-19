import InvitationTile from '@/components/coach/InvitationTile';
import { useInvitationsController } from '@/hooks/useInvitationsController';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text
} from 'react-native';

interface InvitationsModalProps {
  visible: boolean;
  onClose: () => void;
}

const InvitationsModal: React.FC<InvitationsModalProps> = ({ visible, onClose }) => {
  const { invitations, isLoading, handleRespond } = useInvitationsController(visible);

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="#1e90ff" style={styles.centeredContent} />;
    }
    if (invitations.length === 0) {
      return <Text style={styles.centeredContent}>Brak oczekujących zaproszeń.</Text>;
    }
    return (
      <FlatList
        data={invitations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <InvitationTile 
            invitation={item} 
            onRespond={handleRespond} 
          />
        )}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container}> 
          <Text style={styles.heading}>Oczekujące zaproszenia</Text>
          {renderContent()}
        </Pressable>
      </Pressable>
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
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 0,
    paddingTop: 10,
  },
  centeredContent: {
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: 16,
    color: '#666',
  },
});

export default InvitationsModal;