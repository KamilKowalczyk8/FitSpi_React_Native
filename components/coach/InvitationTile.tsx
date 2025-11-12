import { InvitationResponse } from '@/controllers/coach/clientLink.controller';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface InvitationTileProps {
  invitation: InvitationResponse;
  onRespond: (linkId: number, accept: boolean) => Promise<void>;
}

const InvitationTile: React.FC<InvitationTileProps> = ({ invitation, onRespond }) => {
  const [isLoading, setIsLoading] = useState(false);
  const trainerName = `${invitation.trainer.first_name} ${invitation.trainer.last_name}`;

  const handlePress = async (accept: boolean) => {
    setIsLoading(true);
    await onRespond(invitation.id, accept);
  };

  return (
    <View style={styles.tile}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Zaproszenie od trenera:</Text>
        <Text style={styles.trainerName}>{trainerName}</Text>
      </View>
      
      {isLoading ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handlePress(false)}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handlePress(true)}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    color: '#666',
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    padding: 8,
    borderRadius: 20, 
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#34C759', 
  },
  rejectButton: {
    backgroundColor: '#FF3B30', 
  },
});

export default InvitationTile;