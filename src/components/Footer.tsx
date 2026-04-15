import React from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface FooterProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onLogout?: () => void;
}

const Footer = ({ activeTab, setActiveTab, onLogout }: FooterProps) => {
    const tabs = [
        { id: 'Overview', label: 'Overview', icon: 'grid-outline' },
        { id: 'History', label: 'History', icon: 'time-outline' },
        { id: 'Add', label: 'Add', icon: 'add-circle-outline' },
        { id: 'Budget', label: 'Budget', icon: 'wallet-outline' },
        { id: 'Logout', label: 'Logout', icon: 'log-out-outline' },
    ];

    const handlePress = (tabId: string) => {
        if (tabId !== 'Logout') {
            setActiveTab(tabId);
            return;
        }

        if (!onLogout) return;

        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: onLogout },
        ]);
    };

    return (
        <View style={styles.footer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.id}
                    style={styles.tab}
                    onPress={() => handlePress(tab.id)}
                >
                    <Icon
                        name={tab.icon}
                        size={24}
                        color={
                            tab.id === 'Logout'
                                ? '#9CA3AF'
                                : activeTab === tab.id
                                  ? '#000'
                                  : '#9CA3AF'
                        }
                    />
                    <Text style={[
                        styles.tabText,
                        tab.id !== 'Logout' && activeTab === tab.id && styles.activeTabText,
                    ]}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        height: 80,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        justifyContent: 'space-around',
        paddingTop: 10,
    },
    tab: { alignItems: 'center', flex: 1 },
    tabText: { fontSize: 11, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },
    activeTabText: { color: '#000', fontWeight: 'bold' }
});

export default Footer;