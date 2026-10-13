// src/screens/CharactersScreen.tsx
import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    Animated,
    RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ComicVineResponse, ComicVineCharacter } from '../models/ComicVineApi';
import { NavigationProps } from '../navigation/types';

const API_KEY = 'ed1d819b62a4d6d9e4de1e727cae1b366fc3e655'; // Ensure your actual key is here

// --- UI Polish: Pulsing Skeleton Card ---
const SkeletonCard = (): React.JSX.Element => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })
            ])
        ).start();
    }, [opacity]);

    return (
        <Animated.View style={[styles.card, { opacity }]}>
            <View style={styles.thumbnailPlaceholder} />
            <View style={styles.infoContainer}>
                <View style={styles.skeletonTitle} />
                <View style={styles.skeletonLine} />
                <View style={styles.skeletonLineShort} />
            </View>
        </Animated.View>
    );
};

export default function CharactersScreen(): React.JSX.Element {
    const navigation = useNavigation<NavigationProps>();
    const [characters, setCharacters] = useState<ComicVineCharacter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        void fetchCharacters('Avengers');
    }, []);

    const fetchCharacters = async (query: string, isRefresh = false): Promise<void> => {
        if (!query) return;

        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const url = `https://comicvine.gamespot.com/api/search/?api_key=${API_KEY}&format=json&limit=50&resources=character&query=${encodeURIComponent(query)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'MarvelCrossPlatformApp_Development_v1.0',
                    'Accept': 'application/json'
                }
            });

            const json: ComicVineResponse<ComicVineCharacter> = await response.json();

            if (json.error === 'OK') {
                setCharacters(json.results);
            } else {
                console.error("API Error:", json.error);
            }
        } catch (error) {
            console.error("Error fetching characters:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSearchSubmit = () => {
        if (searchQuery.trim().length > 0) {
            void fetchCharacters(searchQuery.trim());
        }
    };

    const onRefresh = () => {
        // If the search bar has text, refresh that search; otherwise, refresh the default
        void fetchCharacters(searchQuery.trim() || 'Avengers', true);
    };

    const renderItem = ({ item }: { item: ComicVineCharacter }) => {
        const imageUrl = item.image?.medium_url || 'https://via.placeholder.com/100x120?text=No+Image';

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CharacterDetails', { character: item })}
            >
                <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
                <View style={styles.infoContainer}>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.descriptionText} numberOfLines={3}>
                        {item.deck || 'No summary available in the archive.'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for a hero (e.g., Spider-Man)..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                    autoCorrect={false}
                />
            </View>

            {loading ? (
                <View style={styles.listContent}>
                    {/* Render 5 skeleton cards to fill the initial screen */}
                    {[1, 2, 3, 4, 5].map((key) => (
                        <SkeletonCard key={key} />
                    ))}
                </View>
            ) : (
                <FlatList
                    data={characters}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#E23636" // iOS spinner color
                            colors={["#E23636"]} // Android spinner color
                        />
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No heroes found in the database.</Text>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#E23636',
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#202020',
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
    emptyText: {
        textAlign: 'center',
        color: '#666666',
        marginTop: 40,
        fontSize: 16,
    },
    // Skeleton Styles
    thumbnailPlaceholder: {
        width: 100,
        height: 120,
        backgroundColor: '#E0E0E0',
    },
    skeletonTitle: {
        width: '60%',
        height: 20,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 12,
    },
    skeletonLine: {
        width: '90%',
        height: 14,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
    },
    skeletonLineShort: {
        width: '70%',
        height: 14,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
    }
});