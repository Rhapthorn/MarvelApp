// src/screens/CharactersScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
    Animated,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {ComicVineCharacter, ComicVineResponse} from '../models/ComicVineApi';
import {NavigationProps} from '../navigation/types';

// IMPORTANT: Insert your actual Comic Vine API key here
const API_KEY = 'ed1d819b62a4d6d9e4de1e727cae1b366fc3e655';

const SkeletonCard = ({isDark}: { isDark: boolean }): React.JSX.Element => {
    const opacity = useRef(new Animated.Value(0.3)).current;
    const styles = getStyles(isDark);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {toValue: 1, duration: 800, useNativeDriver: true}),
                Animated.timing(opacity, {toValue: 0.3, duration: 800, useNativeDriver: true})
            ])
        ).start();
    }, [opacity]);

    return (
        <Animated.View style={[styles.card, {opacity}]}>
            <View style={styles.thumbnailPlaceholder}/>
            <View style={styles.infoContainer}>
                <View style={styles.skeletonTitle}/>
                <View style={styles.skeletonLine}/>
                <View style={styles.skeletonLineShort}/>
            </View>
        </Animated.View>
    );
};

export default function CharactersScreen(): React.JSX.Element {
    const navigation = useNavigation<NavigationProps>();
    const isDark = useColorScheme() === 'dark';
    const styles = getStyles(isDark);

    const [characters, setCharacters] = useState<ComicVineCharacter[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [debouncedQuery, setDebouncedQuery] = useState<string>('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        void fetchCharacters(debouncedQuery);
    }, [debouncedQuery]);

    const fetchCharacters = async (query: string = '', isRefresh = false): Promise<void> => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            let url = '';
            if (query.trim().length > 0) {
                // Uses the core /characters/ endpoint with comma-separated filters for partial name match AND publisher
                url = `https://comicvine.gamespot.com/api/characters/?api_key=${API_KEY}&format=json&limit=50&filter=name:${encodeURIComponent(query)},publisher:43&sort=count_of_issue_appearances:desc`;
            } else {
                // Default alphabetical Marvel preload
                url = `https://comicvine.gamespot.com/api/characters/?api_key=${API_KEY}&format=json&limit=50&filter=publisher:43&sort=name:asc`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'User-Agent': 'MarvelCrossPlatformApp_Development_v1.0',
                    'Accept': 'application/json'
                }
            });

            const json: ComicVineResponse<ComicVineCharacter> = await response.json();

            if (json.error === 'OK') {
                // The API now strictly returns Marvel characters natively, no JS filtering required
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

    const onRefresh = () => {
        void fetchCharacters(debouncedQuery, true);
    };

    const renderItem = ({item}: { item: ComicVineCharacter }) => {
        const imageUrl = item.image?.medium_url || 'https://via.placeholder.com/100x120?text=No+Image';

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('CharacterDetails', {character: item})}
            >
                <Image source={{uri: imageUrl}} style={styles.thumbnail}/>
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
                    placeholder="Search for a Marvel hero..."
                    placeholderTextColor={isDark ? "#888" : "#999"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                    autoCorrect={false}
                    keyboardAppearance={isDark ? 'dark' : 'light'}
                    clearButtonMode="while-editing"
                />
            </View>

            {loading ? (
                <View style={styles.listContent}>
                    {[1, 2, 3, 4, 5].map((key) => (
                        <SkeletonCard key={key} isDark={isDark}/>
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
                            tintColor={isDark ? "#FFF" : "#E23636"}
                        />
                    }
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No Marvel heroes found for this query.</Text>
                    }
                />
            )}
        </View>
    );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#F2F2F2',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: isDark ? '#991B1B' : '#E23636',
    },
    searchInput: {
        backgroundColor: isDark ? '#2C2C2C' : '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: isDark ? '#FFFFFF' : '#202020',
    },
    listContent: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
    },
    thumbnail: {
        width: 100,
        height: 120,
        backgroundColor: isDark ? '#2C2C2C' : '#DDDDDD',
    },
    infoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isDark ? '#FFFFFF' : '#202020',
        marginBottom: 4,
    },
    descriptionText: {
        fontSize: 14,
        color: isDark ? '#AAAAAA' : '#666666',
        lineHeight: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: isDark ? '#AAAAAA' : '#666666',
        marginTop: 40,
        fontSize: 16,
    },
    thumbnailPlaceholder: {
        width: 100,
        height: 120,
        backgroundColor: isDark ? '#333333' : '#E0E0E0',
    },
    skeletonTitle: {
        width: '60%',
        height: 20,
        backgroundColor: isDark ? '#333333' : '#E0E0E0',
        borderRadius: 4,
        marginBottom: 12,
    },
    skeletonLine: {
        width: '90%',
        height: 14,
        backgroundColor: isDark ? '#333333' : '#E0E0E0',
        borderRadius: 4,
        marginBottom: 8,
    },
    skeletonLineShort: {
        width: '70%',
        height: 14,
        backgroundColor: isDark ? '#333333' : '#E0E0E0',
        borderRadius: 4,
    }
});