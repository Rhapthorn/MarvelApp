// src/navigation/types.ts
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Home: undefined;
    SignUp: undefined;
    Characters: undefined;
    Profile: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;