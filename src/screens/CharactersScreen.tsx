// src/screens/CharactersScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CharactersScreen(): React.JSX.Element {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Character List Implementation Pending...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F2' },
    text: { fontSize: 18, color: '#333333', fontWeight: '500' }
});