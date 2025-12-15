import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface AddClientButtonProps {
    onPress: () => void;
}

const AddClientButton: React.FC<AddClientButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity 
            style={styles.button} 
            onPress={onPress}
            activeOpacity={0.7} 
        >
            <Ionicons 
                name="person-add-outline" 
                size={22} 
                color={COLORS.primary} 
                style={styles.icon} 
            />
            <Text style={styles.text}>Dodaj podopiecznego</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.cardBg, 
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.primary, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    icon: {
        marginRight: 10,
    },
    text: {
        color: COLORS.primary, 
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});

export default AddClientButton;