// App.tsx
import React from 'react';
import {useColorScheme} from 'react-native';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {RootStackParamList} from './src/navigation/types';

import HomeScreen from './src/screens/HomeScreen';
import CharactersScreen from './src/screens/CharactersScreen';
import CharacterDetailsScreen from './src/screens/CharacterDetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import MediaArchivesScreen from './src/screens/MediaArchivesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
    const scheme = useColorScheme();

    const MarvelLightTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: '#F2F2F2',
            card: '#E23636',
            text: '#FFFFFF',
        },
    };

    const MarvelDarkTheme = {
        ...DarkTheme,
        colors: {
            ...DarkTheme.colors,
            background: '#121212',
            card: '#991B1B',
            text: '#FFFFFF',
        },
    };

    return (
        <NavigationContainer theme={scheme === 'dark' ? MarvelDarkTheme : MarvelLightTheme}>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerTintColor: '#FFF',
                    headerTitleStyle: {fontWeight: 'bold'},
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} options={{title: 'Marvel Hub'}}/>
                <Stack.Screen name="Characters" component={CharactersScreen} options={{title: 'Database'}}/>
                <Stack.Screen
                    name="CharacterDetails"
                    component={CharacterDetailsScreen}
                    options={({route}) => ({title: route.params.character.name})}
                />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{title: 'My Profile'}}/>
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{title: 'Registration'}}/>
                <Stack.Screen
                    name="MediaArchives"
                    component={MediaArchivesScreen}
                    options={({route}) => ({title: `${route.params.characterName} Archives`})}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}