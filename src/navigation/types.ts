// src/navigation/types.ts
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ComicVineCharacter} from '../models/ComicVineApi';

export type RootStackParamList = {
    Home: undefined;
    Characters: undefined;
    CharacterDetails: { character: ComicVineCharacter };
    Profile: undefined;
    SignUp: undefined;
    MediaArchives: { characterId: number; characterName: string };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;