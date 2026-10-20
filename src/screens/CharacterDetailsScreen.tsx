// src/screens/CharacterDetailsScreen.tsx
import React, {useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    InteractionManager,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    useWindowDimensions,
    View
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHtml from 'react-native-render-html';
import {NavigationProps, RootStackParamList} from '../navigation/types';

type CharacterDetailsRouteProp = RouteProp<RootStackParamList, 'CharacterDetails'>;

export default function CharacterDetailsScreen(): React.JSX.Element {
    const route = useRoute<CharacterDetailsRouteProp>();
    const navigation = useNavigation<NavigationProps>();
    const {character} = route.params;

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [isTransitionComplete, setIsTransitionComplete] = useState<boolean>(false);

    const isDark = useColorScheme() === 'dark';
    const styles = getStyles(isDark);
    const scrollY = useRef(new Animated.Value(0)).current;
    const {width} = useWindowDimensions();

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            setIsTransitionComplete(true);
        });
        return () => task.cancel();
    }, []);

    const imageUrl = character.image?.medium_url || 'https://via.placeholder.com/400x500?text=No+Image';

    const getGenderText = (genderCode: number | null) => {
        switch (genderCode) {
            case 1:
                return 'Male';
            case 2:
                return 'Female';
            case 3:
                return 'Other';
            default:
                return 'Classified';
        }
    };

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

    const imageScale = scrollY.interpolate({
        inputRange: [-200, 0],
        outputRange: [2, 1],
        extrapolateRight: 'clamp',
    });

    const imageTranslateY = scrollY.interpolate({
        inputRange: [0, 400],
        outputRange: [0, 150],
        extrapolateLeft: 'clamp',
    });

    const htmlBaseStyle = {
        color: isDark ? '#AAAAAA' : '#444444',
        fontSize: 16,
        lineHeight: 26,
    };

    const htmlTagsStyles = {
        h1: {color: isDark ? '#FFFFFF' : '#202020', fontSize: 24, marginTop: 16, marginBottom: 8},
        h2: {color: isDark ? '#FFFFFF' : '#202020', fontSize: 22, marginTop: 16, marginBottom: 8},
        h3: {color: isDark ? '#FFFFFF' : '#202020', fontSize: 20, marginTop: 16, marginBottom: 8},
        a: {color: isDark ? '#FF6B6B' : '#E23636', textDecorationLine: 'none' as const},
        p: {marginBottom: 16},
        ul: {paddingLeft: 20, marginBottom: 16},
        li: {marginBottom: 8},
    };

    return (
        <View style={styles.container}>
            <Animated.Image
                source={{uri: imageUrl}}
                style={[
                    styles.heroImage,
                    {
                        transform: [
                            {translateY: imageTranslateY},
                            {scale: imageScale}
                        ]
                    }
                ]}
                resizeMode="cover"
            />

            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                    {useNativeDriver: true}
                )}
            >
                <View style={styles.detailsCard}>
                    <Text style={styles.title}>{character.name}</Text>

                    <View style={styles.dossierContainer}>
                        <View style={styles.dossierRow}>
                            <Text style={styles.dossierLabel}>Real Name:</Text>
                            <Text style={styles.dossierValue}>{character.real_name || 'Classified'}</Text>
                        </View>
                        <View style={styles.dossierRow}>
                            <Text style={styles.dossierLabel}>Gender:</Text>
                            <Text style={styles.dossierValue}>{getGenderText(character.gender)}</Text>
                        </View>
                        {character.aliases && (
                            <View style={styles.dossierRow}>
                                <Text style={styles.dossierLabel}>Aliases:</Text>
                                <Text style={styles.dossierValue}>
                                    {character.aliases.split('\n').filter(Boolean).join(', ')}
                                </Text>
                            </View>
                        )}
                        <View style={styles.dossierRow}>
                            <Text style={styles.dossierLabel}>Publisher:</Text>
                            <Text style={styles.dossierValue}>{character.publisher?.name || 'Marvel'}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.archiveButton}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('MediaArchives', {
                            characterId: character.id,
                            characterName: character.name
                        })}
                    >
                        <Text style={styles.archiveButtonText}>View Full Media Archives</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}/>

                    <Text style={styles.sectionHeader}>Biography</Text>

                    {!isTransitionComplete ? (
                        <ActivityIndicator size="large" color="#E23636" style={styles.loader}/>
                    ) : character.description ? (
                        <RenderHtml
                            contentWidth={width - 48}
                            source={{
                                html: character.description,
                                baseUrl: 'https://comicvine.gamespot.com' // Instantly resolves all broken relative links
                            }}
                            baseStyle={htmlBaseStyle}
                            tagsStyles={htmlTagsStyles}
                            ignoredDomTags={['iframe', 'video']}
                        />
                    ) : (
                        <Text style={styles.deckText}>
                            {character.deck || 'No detailed summary available in the archives.'}
                        </Text>
                    )}

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

const getStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#F2F2F2',
    },
    scrollContent: {
        paddingTop: 400,
        paddingBottom: 32,
    },
    heroImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 450,
        backgroundColor: isDark ? '#2C2C2C' : '#DDDDDD',
    },
    detailsCard: {
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
        minHeight: 500,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -3},
        shadowOpacity: isDark ? 0.3 : 0.15,
        shadowRadius: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: isDark ? '#FFFFFF' : '#202020',
        marginBottom: 16,
    },
    dossierContainer: {
        backgroundColor: isDark ? '#2C2C2C' : '#F8F8F8',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    dossierRow: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'flex-start',
    },
    dossierLabel: {
        width: 85,
        fontSize: 14,
        fontWeight: 'bold',
        color: isDark ? '#AAAAAA' : '#666666',
    },
    dossierValue: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: isDark ? '#FFFFFF' : '#202020',
    },
    archiveButton: {
        backgroundColor: isDark ? '#333333' : '#EEEEEE',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
    },
    archiveButtonText: {
        color: isDark ? '#FFFFFF' : '#202020',
        fontSize: 16,
        fontWeight: '700',
    },
    sectionHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        color: isDark ? '#FFFFFF' : '#202020',
        marginBottom: 16,
    },
    divider: {
        height: 1,
        backgroundColor: isDark ? '#333333' : '#EEEEEE',
        marginBottom: 24,
    },
    deckText: {
        fontSize: 18,
        color: isDark ? '#AAAAAA' : '#444444',
        lineHeight: 28,
        marginBottom: 32,
    },
    loader: {
        marginVertical: 40,
    },
    actionButton: {
        backgroundColor: isDark ? '#991B1B' : '#E23636',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
    },
    actionButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});