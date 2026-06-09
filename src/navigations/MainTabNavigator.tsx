import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import OverviewScreen from '../screens/OverviewScreen';
import TargetScreen from '../screens/TargetScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import BudgetScreen from '../screens/budget/BudgetScreen';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

type MainTabNavigatorProps = {
    navigation: { replace: (screen: string) => void };
};

const MainTabNavigator = ({ navigation }: MainTabNavigatorProps) => {
    const [activeTab, setActiveTab] = useState('Overview');
    const { userId, logout } = useAuth();

    if (!userId) {
        navigation.replace('Login');
        return null;
    }

    const renderScreen = () => {
        switch (activeTab) {
            case 'Overview': return (
                <OverviewScreen
                    userId={userId}
                    onSeeAllTargets={() => setActiveTab('Target')}
                />
            );
            case 'Target': return <TargetScreen userId={userId} />;
            case 'Add': return <AddTransactionScreen userId={userId} />;
            case 'Budget': return <BudgetScreen userId={userId} />;
            default: return <OverviewScreen userId={userId} />;
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
                onLogout={() => {
                    logout();
                    navigation.replace('Login');
                }}
            />
        </SafeAreaView>
    );
};

export default MainTabNavigator;
