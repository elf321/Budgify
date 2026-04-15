import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, ScrollView, Alert
} from 'react-native';
import { register } from '../services/authService';

const RegisterScreen = ({ navigation }: any) => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        surname: ''
    });

    const handleRegister = async () => {
        if (!form.email || !form.password || !form.username) {
            Alert.alert("Error", "Please fill in the required fields.");
            return;
        }

        try {
            await register(form);
            Alert.alert("Success", "Your account has been created! You can now login.", [
                { text: "OK", onPress: () => navigation.navigate('Login') }
            ]);
        } catch (error: any) {
            Alert.alert("Error", "An error occurred while registering.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>New Account</Text>
                    <Text style={styles.subtitle}>Start managing your budget today.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginRight: 10 }]}
                            placeholder="Name"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(val) => setForm({ ...form, name: val })}
                        />
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Surname"
                            placeholderTextColor="#9CA3AF"
                            onChangeText={(val) => setForm({ ...form, surname: val })}
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor="#9CA3AF"
                        onChangeText={(val) => setForm({ ...form, username: val })}
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        placeholderTextColor="#9CA3AF"
                        onChangeText={(val) => setForm({ ...form, email: val })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        onChangeText={(val) => setForm({ ...form, password: val })}
                    />

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.loginText}>
                            Already have an account? <Text style={styles.loginBold}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    scrollContent: { padding: 24, justifyContent: 'center', flexGrow: 1 },
    header: { marginBottom: 32, marginTop: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#000' },
    subtitle: { fontSize: 16, color: '#9CA3AF', marginTop: 8 },
    form: { width: '100%' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    input: {
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        fontSize: 16,
        color: '#000',
        marginBottom: 20,
    },
    registerButton: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    registerButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    loginLink: { marginTop: 24, alignItems: 'center', marginBottom: 20 },
    loginText: { color: '#9CA3AF', fontSize: 14 },
    loginBold: { color: '#000', fontWeight: 'bold' }
});

export default RegisterScreen;