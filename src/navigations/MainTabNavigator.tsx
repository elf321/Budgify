import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import OverviewScreen from '../screens/OverviewScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import BudgetScreen from '../screens/budget/BudgetScreen';
import Footer from '../components/Footer';

type MainTabNavigatorProps = {
    navigation: { replace: (screen: string) => void };
};

const MainTabNavigator = ({ navigation }: MainTabNavigatorProps) => {
    const [activeTab, setActiveTab] = useState('Overview');

    const renderScreen = () => {
        switch (activeTab) {
            case 'Overview': return <OverviewScreen />;
            case 'History': return <HistoryScreen />;
            case 'Add': return <AddTransactionScreen />;
            case 'Budget': return <BudgetScreen userId={1} />;
            default: return <OverviewScreen />;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
                {renderScreen()}
            </View>
            <Footer
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onLogout={() => navigation.replace('Login')}
            />
        </SafeAreaView>
    );
};

export default MainTabNavigator;