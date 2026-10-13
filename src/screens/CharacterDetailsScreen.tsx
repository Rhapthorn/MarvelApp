// src/screens/CharacterDetailsScreen.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Animated } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/types';

type CharacterDetailsRouteProp = RouteProp<RootStackParamList, 'CharacterDetails'>;

export default function CharacterDetailsScreen(): React.JSX.Element {
    const route = useRoute<CharacterDetailsRouteProp>();
    const { character } = route.params;
    const [isSaving, setIsSaving] = useState<boolean>(false);

    // 1. Initialize an Animated Value to track the scroll Y-axis
    const scrollY = useRef(new Animated.Value(0)).current;

    const imageUrl = character.image?.medium_url || 'https://via.placeholder.com/400x500?text=No+Image';

    const saveAsTarget = async () => {
        setIsSaving(true);
        try {
            await AsyncStorage.setItem('@profile_hero', character.name);
            Alert.alert('Target Acquired', `${character.name} has been saved to your Agent Profile.`);
        } catch (error) {
            console.error('Error saving character:', error);
            Alert.alert('Error', 'Failed to update profile clearance.');
        } finally {
            setIsSaving(false);
        }
    };

    // 2. Interpolate the scroll value into scale and translation transforms
    const imageScale = scrollY.interpolate({
        inputRange: [-200, 0],
        outputRange: [2, 1],
        extrapolateRight: 'clamp', // Prevents shrinking when scrolling down
    });

    const imageTranslateY = scrollY.interpolate({
        inputRange: [0, 400],
        outputRange: [0, 150],
        extrapolateLeft: 'clamp', // Prevents pushing up when pulling down
    });

    return (
        <View style={styles.container}>
            {/* 3. Extract the Image from the ScrollView and apply the Animated transforms */}
            <Animated.Image
                source={{ uri: imageUrl }}
                style={[
                    styles.heroImage,
                    {
                        transform: [
                            { translateY: imageTranslateY },
                            { scale: imageScale }
                        ]
                    }
                ]}
                resizeMode="cover"
            />

            {/* 4. Use Animated.ScrollView and map its scroll event directly to our scrollY value */}
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                scrollEventThrottle={16} // 60fps event firing
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true } // Offloads animation to the native iOS UI thread
                )}
            >
                <View style={styles.detailsCard}>
                    <Text style={styles.title}>{character.name}</Text>

                    <Text style={styles.deckText}>
                        {character.deck || 'No detailed summary available in the archives.'}
                    </Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={saveAsTarget}
                        disabled={isSaving}
                    >
                        <Text style={styles.actionButtonText}>
                            {isSaving ? 'Saving...' : 'Set as Current Target'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    scrollContent: {
        paddingTop: 400, // Matches the height of the hero image to push the card down
        paddingBottom: 32,
    },
    heroImage: {
        position: 'absolute', // Fixed in the background
        top: 0,
        left: 0,
        right: 0,
        height: 450,
        backgroundColor: '#DDDDDD',
    },
    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 500, // Ensures the card covers the screen when scrolled up
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#202020',
        marginBottom: 16,
    },
    deckText: {
        fontSize: 18,
        color: '#444444',
        lineHeight: 28,
        marginBottom: 32,
    },
    actionButton: {
        backgroundColor: '#E23636',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});