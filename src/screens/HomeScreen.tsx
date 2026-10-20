// src/screens/HomeScreen.tsx
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../navigation/types';

export default function HomeScreen(): React.JSX.Element {
    const isDark = useColorScheme() === 'dark';
    const styles = getStyles(isDark);
    const navigation = useNavigation<NavigationProps>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Marvel Universe</Text>

            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Characters')}
            >
                <Text style={styles.buttonText}>View Characters</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('Profile')}
            >
                <Text style={styles.buttonText}>My Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.outlineButton}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('SignUp')}
            >
                <Text style={styles.outlineButtonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#121212' : '#F2F2F2',
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: isDark ? '#991B1B' : '#E23636',
        marginBottom: 48,
    },
    button: {
        backgroundColor: isDark ? '#991B1B' : '#E23636',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: isDark ? '#991B1B' : '#E23636',
    },
    outlineButtonText: {
        color: isDark ? '#991B1B' : '#E23636',
        fontSize: 18,
        fontWeight: 'bold',
    },
});