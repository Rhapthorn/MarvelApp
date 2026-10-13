// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProps } from '../navigation/types';

export default function HomeScreen(): React.JSX.Element {
    const navigation = useNavigation<NavigationProps>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Marvel Universe</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Characters')}>
                <Text style={styles.buttonText}>View Characters</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.buttonText}>My Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonOutline} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.buttonOutlineText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F2', padding: 20 },
    title: { fontSize: 28, fontWeight: '900', color: '#E23636', marginBottom: 40 },
    button: { backgroundColor: '#E23636', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, width: '100%', alignItems: 'center', marginBottom: 16, elevation: 3 },
    buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    buttonOutline: { borderColor: '#E23636', borderWidth: 2, paddingVertical: 14, paddingHorizontal: 32, borderRadius: 8, width: '100%', alignItems: 'center' },
    buttonOutlineText: { color: '#E23636', fontSize: 16, fontWeight: 'bold' }
});