import { COLORS } from '@/constants/theme';
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
        <View style={styles.row}>
            <Ionicons name="person-circle-outline" size={20} color={COLORS.textSecondary} style={{marginRight: 6}} />
            <Text style={styles.label}>Zaproszenie od trenera:</Text>
        </View>
        <Text style={styles.trainerName} numberOfLines={1}>{trainerName}</Text>
        <Text style={styles.date}>{new Date(invitation.createdAt).toLocaleDateString()}</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.rejectButton]} 
            onPress={() => handlePress(false)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={20} color="#fff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.acceptButton]} 
            onPress={() => handlePress(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="checkmark" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg, 
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text, 
    marginBottom: 2,
  },
  date: {
      fontSize: 12,
      color: COLORS.textPlaceholder,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  loaderContainer: {
      paddingHorizontal: 20,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  acceptButton: {
    backgroundColor: COLORS.success, 
  },
  rejectButton: {
    backgroundColor: COLORS.danger, 
  },
});

export default InvitationTile;