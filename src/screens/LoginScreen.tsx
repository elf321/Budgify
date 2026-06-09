import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import BrandLogo from '../components/BrandLogo';

const LoginScreen = ({ navigation }: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (loading) return;

        try {
            setLoading(true);
            await login(email, password);
            navigation.replace('Main');
        } catch (error: any) {
            Alert.alert("Error", error?.message || "The email address or password is incorrect or the server is unreachable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inner}
            >
                <BrandLogo size={58} />
                <View style={styles.header}>
                    <Text style={styles.title}>Budgify</Text>
                    <Text style={styles.subtitle}>Finansal yolculuguna devam et.</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email address"
                        placeholderTextColor={colors.muted}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={colors.muted}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                        <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
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
    container: { flex: 1, backgroundColor: colors.background },
    inner: { flex: 1, padding: 24, justifyContent: 'center' },
    header: { marginTop: 18, marginBottom: 36 },
    title: { fontSize: 34, fontWeight: '800', color: colors.ink },
    subtitle: { fontSize: 16, color: colors.muted, marginTop: 8, fontWeight: '600' },
    form: { width: '100%' },
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
    loginButton: {
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        shadowColor: colors.primary,
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 4,
    },
    loginButtonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    registerLink: { marginTop: 24, alignItems: 'center' },
    registerText: { color: colors.muted, fontSize: 14, fontWeight: '600' },
    registerBold: { color: colors.primary, fontWeight: '800' }
});

export default LoginScreen;
