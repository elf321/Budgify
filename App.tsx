import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import OverviewScreen from './src/screens/OverviewScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import BudgetScreen from './src/screens/BudgetScreen';
import Footer from './src/components/Footer';
type TabType = 'Overview' | 'History' | 'Add' | 'Budget';

export default function App() {
    const [activeTab, setActiveTab] = useState('Overview');

    const renderScreen = () => {
        switch (activeTab) {
            case 'Overview': return <OverviewScreen />;
            case 'History': return <HistoryScreen />;
            case 'Add': return <AddTransactionScreen />;
            case 'Budget': return <BudgetScreen />;
            default: return <OverviewScreen />;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                {renderScreen()}
            </View>
            <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});