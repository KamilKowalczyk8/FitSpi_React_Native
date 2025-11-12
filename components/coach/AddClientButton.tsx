import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface AddClientButtonProps{
    onPress: () => void;
}

const AddClientButton: React.FC<AddClientButtonProps> = ({ onPress }) => {
    return(
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>+ Dodaj podopiecznego</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#1e90ff',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 16, 
        alignItems: 'center',
        marginBottom: 16,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddClientButton;