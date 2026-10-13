// src/screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen(): React.JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [favoriteHero, setFavoriteHero] = useState<string>('');

    useEffect(() => {
        loadProfileData();
    }, []);

    const loadProfileData = async () => {
        try {
            const savedUsername = await AsyncStorage.getItem('@profile_username');
            const savedHero = await AsyncStorage.getItem('@profile_hero');

            if (savedUsername) setUsername(savedUsername);
            if (savedHero) setFavoriteHero(savedHero);
        } catch (error) {
            console.error('Error loading profile data:', error);
        }
    };

    const saveProfileData = async () => {
        try {
            await AsyncStorage.setItem('@profile_username', username);
            await AsyncStorage.setItem('@profile_hero', favoriteHero);
            Alert.alert('Secure Transmission', 'Profile data updated successfully.');
        } catch (error) {
            console.error('Error saving profile data:', error);
            Alert.alert('Error', 'Failed to save profile data.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Text style={styles.header}>Agent Profile</Text>
                <Text style={styles.subtext}>Manage your local database clearance.</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Codename (Username)</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter your username"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Current Target (Favorite Hero)</Text>
                    <TextInput
                        style={styles.input}
                        value={favoriteHero}
                        onChangeText={setFavoriteHero}
                        placeholder="e.g., Moon Knight"
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={saveProfileData}>
                    <Text style={styles.saveButtonText}>Save Profile</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: '900',
        color: '#E23636',
        marginBottom: 8,
    },
    subtext: {
        fontSize: 16,
        color: '#666',
        marginBottom: 32,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: '#202020',
    },
    saveButton: {
        backgroundColor: '#E23636',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});