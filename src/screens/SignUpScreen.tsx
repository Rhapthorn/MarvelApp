// src/screens/SignUpScreen.tsx
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../navigation/types';

interface SignUpFormData {
    username: string;
    email: string;
    password: string;
}

export default function SignUpScreen(): React.JSX.Element {
    const navigation = useNavigation<NavigationProps>();
    const isDark = useColorScheme() === 'dark';
    const styles = getStyles(isDark);

    const {
        control,
        handleSubmit,
        formState: {errors, isValid}
    } = useForm<SignUpFormData>({
        mode: 'onChange',
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    });

    const onSubmit = (data: SignUpFormData) => {
        console.log('Valid Registration Data:', data);
        navigation.navigate('Home');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <Text style={styles.header}>Join the Initiative</Text>
                <Text style={styles.subtext}>Register to track your favorite heroes.</Text>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Username</Text>
                    <Controller
                        control={control}
                        name="username"
                        rules={{
                            required: 'Username is required',
                            minLength: {value: 3, message: 'Must be at least 3 characters'}
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={[styles.input, errors.username && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="e.g., StarLord99"
                                placeholderTextColor={isDark ? "#888" : "#999"}
                                autoCapitalize="none"
                                keyboardAppearance={isDark ? 'dark' : 'light'}
                            />
                        )}
                    />
                    {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={[styles.input, errors.email && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="peter@parker.com"
                                placeholderTextColor={isDark ? "#888" : "#999"}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                keyboardAppearance={isDark ? 'dark' : 'light'}
                            />
                        )}
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Password</Text>
                    <Controller
                        control={control}
                        name="password"
                        rules={{
                            required: 'Password is required',
                            minLength: {value: 8, message: 'Must be at least 8 characters'}
                        }}
                        render={({field: {onChange, onBlur, value}}) => (
                            <TextInput
                                style={[styles.input, errors.password && styles.inputError]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                placeholder="••••••••"
                                placeholderTextColor={isDark ? "#888" : "#999"}
                                secureTextEntry
                                autoCapitalize="none"
                                keyboardAppearance={isDark ? 'dark' : 'light'}
                            />
                        )}
                    />
                    {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, !isValid && styles.submitButtonDisabled]}
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid}
                >
                    <Text style={styles.submitButtonText}>Create Account</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: isDark ? '#121212' : '#F2F2F2',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: '900',
        color: isDark ? '#991B1B' : '#E23636',
        marginBottom: 8,
    },
    subtext: {
        fontSize: 16,
        color: isDark ? '#AAAAAA' : '#666',
        marginBottom: 32,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: isDark ? '#FFFFFF' : '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: isDark ? '#1E1E1E' : '#FFF',
        borderWidth: 1,
        borderColor: isDark ? '#333' : '#CCC',
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        color: isDark ? '#FFFFFF' : '#202020',
    },
    inputError: {
        borderColor: '#E23636',
        borderWidth: 1.5,
    },
    errorText: {
        color: '#E23636',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: isDark ? '#991B1B' : '#E23636',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 12,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: isDark ? 0.4 : 0.1,
        shadowRadius: 4,
    },
    submitButtonDisabled: {
        backgroundColor: isDark ? '#551111' : '#FFA0A0',
        elevation: 0,
        shadowOpacity: 0,
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        opacity: 1,
    },
});