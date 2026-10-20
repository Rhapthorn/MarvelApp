// src/screens/MediaArchivesScreen.tsx
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, SectionList, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';
import {ComicVineCharacter, ComicVineMedia, ComicVineSingleResponse} from '../models/ComicVineApi';

const API_KEY = 'ed1d819b62a4d6d9e4de1e727cae1b366fc3e655';

type MediaArchivesRouteProp = RouteProp<RootStackParamList, 'MediaArchives'>;

interface SectionData {
    title: string;
    data: ComicVineMedia[];
}

export default function MediaArchivesScreen(): React.JSX.Element {
    const route = useRoute<MediaArchivesRouteProp>();
    const {characterId, characterName} = route.params;

    const isDark = useColorScheme() === 'dark';
    const styles = getStyles(isDark);

    const [sections, setSections] = useState<SectionData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchFullMedia = async () => {
            try {
                const url = `https://comicvine.gamespot.com/api/character/4005-${characterId}/?api_key=${API_KEY}&format=json&field_list=movies,tv_credits,issue_credits`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'MarvelCrossPlatformApp_Development_v1.0',
                        'Accept': 'application/json'
                    }
                });

                const json: ComicVineSingleResponse<ComicVineCharacter> = await response.json();

                if (json.error === 'OK' && json.results) {
                    const newSections: SectionData[] = [];

                    if (json.results.movies && json.results.movies.length > 0) {
                        newSections.push({title: 'Theatrical Films', data: json.results.movies});
                    }
                    if (json.results.tv_credits && json.results.tv_credits.length > 0) {
                        newSections.push({title: 'TV Series & Animation', data: json.results.tv_credits});
                    }
                    if (json.results.issue_credits && json.results.issue_credits.length > 0) {
                        newSections.push({title: 'Comic Issues', data: json.results.issue_credits});
                    }

                    setSections(newSections);
                }
            } catch (error) {
                console.error("Error fetching full media:", error);
            } finally {
                setLoading(false);
            }
        };

        void fetchFullMedia();
    }, [characterId]);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#E23636"/>
                <Text style={styles.loadingText}>Accessing secure archives...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({item}) => (
                    <View style={styles.itemRow}>
                        <Text style={styles.itemText}>
                            {item.name} {item.issue_number ? `#${item.issue_number}` : ''}
                        </Text>
                    </View>
                )}
                renderSectionHeader={({section: {title, data}}) => (
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>{title} ({data.length})</Text>
                    </View>
                )}
                stickySectionHeadersEnabled={true}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No media appearances found for {characterName}.</Text>
                }
            />
        </View>
    );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#F2F2F2',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#121212' : '#F2F2F2',
    },
    loadingText: {
        marginTop: 16,
        color: isDark ? '#AAAAAA' : '#666666',
        fontSize: 16,
    },
    listContent: {
        paddingBottom: 32,
    },
    headerContainer: {
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: isDark ? '#333333' : '#E0E0E0',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: isDark ? '#E23636' : '#991B1B',
        textTransform: 'uppercase',
    },
    itemRow: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: isDark ? '#121212' : '#F2F2F2',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: isDark ? '#333333' : '#E0E0E0',
    },
    itemText: {
        fontSize: 16,
        color: isDark ? '#FFFFFF' : '#202020',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: isDark ? '#AAAAAA' : '#666666',
    }
});