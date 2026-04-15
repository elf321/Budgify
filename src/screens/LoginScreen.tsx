import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { login } from '../services/authService';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const user = await login(email, password);

            navigation.replace('Main');

        } catch (error: any) {
            Alert.alert("Error", "The email address or password is incorrect or the server is unreachable.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inner}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Budgify</Text>
                    <Text style={styles.subtitle}>Finansal yolculuğuna devam et.</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.registerLink}
                        onPress={() => navigation.navigate('Register')}
                    >
                        <Text style={styles.registerText}>
                            Don't have an account? <Text style={styles.registerBold}>Register</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    inner: { flex: 1, padding: 24, justifyContent: 'center' },
    header: { marginBottom: 40 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#000', letterSpacing: -1 },
    subtitle: { fontSize: 16, color: '#9CA3AF', marginTop: 8 },
    form: { width: '100%' },
    input: {
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB', 
        fontSize: 16,
        color: '#000',
        marginBottom: 24,
    },
    loginButton: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    loginButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    registerLink: { marginTop: 24, alignItems: 'center' },
    registerText: { color: '#9CA3AF', fontSize: 14 },
    registerBold: { color: '#000', fontWeight: 'bold' }
});

export default LoginScreen;