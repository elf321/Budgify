import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, ScrollView, Alert
} from 'react-native';
import { register } from '../services/authService';
import { colors } from '../theme/colors';
import BrandLogo from '../components/BrandLogo';

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
                    <BrandLogo size={52} />
                    <Text style={styles.title}>New Account</Text>
                    <Text style={styles.subtitle}>Start managing your budget today.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginRight: 10 }]}
                            placeholder="Name"
                            placeholderTextColor={colors.muted}
                            onChangeText={(val) => setForm({ ...form, name: val })}
                        />
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Surname"
                            placeholderTextColor={colors.muted}
                            onChangeText={(val) => setForm({ ...form, surname: val })}
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        placeholderTextColor={colors.muted}
                        onChangeText={(val) => setForm({ ...form, username: val })}
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        placeholderTextColor={colors.muted}
                        onChangeText={(val) => setForm({ ...form, email: val })}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colors.muted}
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
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { padding: 24, justifyContent: 'center', flexGrow: 1 },
    header: { marginBottom: 32, marginTop: 20, gap: 16 },
    title: { fontSize: 32, fontWeight: '800', color: colors.ink },
    subtitle: { fontSize: 16, color: colors.muted, marginTop: 8, fontWeight: '600' },
    form: { width: '100%' },
    row: { flexDirection: 'row', justifyContent: 'space-between' },
    input: {
        height: 56,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.ink,
        marginBottom: 14,
    },
    registerButton: {
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: colors.primary,
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 4,
    },
    registerButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    loginLink: { marginTop: 24, alignItems: 'center', marginBottom: 20 },
    loginText: { color: colors.muted, fontSize: 14, fontWeight: '600' },
    loginBold: { color: colors.primary, fontWeight: '800' }
});

export default RegisterScreen;
