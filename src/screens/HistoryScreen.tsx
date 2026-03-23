import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HistoryScreen = () => (
    <View style={styles.container}><Text style={styles.title}>History</Text></View>
);

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold' }
});

export default HistoryScreen;