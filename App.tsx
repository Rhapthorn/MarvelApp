// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/types';

import HomeScreen from './src/screens/HomeScreen';
import CharactersScreen from './src/screens/CharactersScreen';
import CharacterDetailsScreen from './src/screens/CharacterDetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SignUpScreen from './src/screens/SignUpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: { backgroundColor: '#E23636' },
                    headerTintColor: '#FFF',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Marvel Hub' }} />
                <Stack.Screen name="Characters" component={CharactersScreen} options={{ title: 'Database' }} />
                <Stack.Screen
                    name="CharacterDetails"
                    component={CharacterDetailsScreen}
                    options={({ route }) => ({ title: route.params.character.name })}
                />
                <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
                <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Registration' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}