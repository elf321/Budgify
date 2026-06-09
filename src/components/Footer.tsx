import React from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

interface FooterProps {
    activeTab: string;
    setActiveTab: (tab: any) => void;
    onLogout?: () => void;
}

const Footer = ({ activeTab, setActiveTab, onLogout }: FooterProps) => {
    const tabs = [
        { id: 'Overview', label: 'Overview', icon: 'grid-outline' },
        { id: 'Target', label: 'Target', icon: 'flag-outline' },
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
                    <View style={[
                        styles.iconWrap,
                        tab.id !== 'Logout' && activeTab === tab.id && styles.activeIconWrap,
                    ]}>
                        <Icon
                            name={tab.icon}
                            size={23}
                            color={
                                tab.id === 'Logout'
                                    ? colors.muted
                                    : activeTab === tab.id
                                      ? colors.primary
                                      : colors.muted
                            }
                        />
                    </View>
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
        height: 84,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.surface,
        justifyContent: 'space-around',
        paddingTop: 8,
    },
    tab: { alignItems: 'center', flex: 1 },
    iconWrap: {
        width: 42,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIconWrap: { backgroundColor: colors.primarySoft },
    tabText: { fontSize: 11, color: colors.muted, marginTop: 3, fontWeight: '600' },
    activeTabText: { color: colors.primary, fontWeight: '800' }
});

export default Footer;
