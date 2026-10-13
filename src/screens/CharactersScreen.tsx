// src/screens/CharactersScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from 'react-native';
import CryptoJS from 'crypto-js';
import { MarvelApiResponse, MarvelCharacter } from '../models/MarvelAPI';

// IMPORTANT: Insert your actual keys from developer.marvel.com
const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const PRIVATE_KEY = 'YOUR_PRIVATE_KEY';

export default function CharactersScreen(): React.JSX.Element {
    const [characters, setCharacters] = useState<MarvelCharacter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            const ts = new Date().getTime().toString();
            const hash = CryptoJS.MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();

            const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&limit=20`;

            const response = await fetch(url);
            const json: MarvelApiResponse<MarvelCharacter> = await response.json();

            setCharacters(json.data.results);
        } catch (error) {
            console.error("Error fetching characters:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: MarvelCharacter }) => {
        // Marvel API HTTP image URLs need to be converted to HTTPS for iOS ATS compliance
        const imageUrl = `${item.thumbnail.path}.${item.thumbnail.extension}`.replace('http:', 'https:');

        return (
            <View style={styles.card}>
                <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.descriptionText} numberOfLines={3}>
                        {item.description || 'No description available in the archive.'}
                    </Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#E23636" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={characters}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
    },
    listContent: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    thumbnail: {
        width: 100,
        height: 120,
        backgroundColor: '#DDDDDD',
    },
    infoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#202020',
        marginBottom: 4,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 20,
    },
});