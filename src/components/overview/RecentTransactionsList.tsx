import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Transaction } from '../../types';
import { parseTransactionDate } from '../../utils/overviewHelpers';

type RecentTransactionsListProps = {
    transactions: Transaction[];
    onSeeAll?: () => void;
};

const formatAmount = (amount: number, type: Transaction['financeType']) =>
    `${type === 'INCOME' ? '+' : '-'}${amount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL`;

const formatDate = (dateString: string) =>
    parseTransactionDate(dateString).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
    });

const RecentTransactionsList = ({ transactions, onSeeAll }: RecentTransactionsListProps) => (
    <View style={styles.card}>
        <View style={styles.header}>
            <Text style={styles.title}>Recent Transactions</Text>
            {onSeeAll ? (
                <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn}>
                    <Text style={styles.seeAllText}>Targets</Text>
                    <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                </TouchableOpacity>
            ) : null}
        </View>

        {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet.</Text>
        ) : (
            transactions.map((item) => (
                <View key={item.id} style={styles.row}>
                    <View style={[styles.icon, { backgroundColor: item.categoryColor + '18' }]}>
                        <Ionicons name="wallet-outline" size={20} color={item.categoryColor} />
                    </View>
                    <View style={styles.info}>
                        <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
                        <Text style={styles.meta}>
                            {item.categoryName} · {formatDate(item.date)}
                        </Text>
                    </View>
                    <Text
                        style={[
                            styles.amount,
                            { color: item.financeType === 'INCOME' ? '#34C759' : '#FF3B30' },
                        ]}
                    >
                        {formatAmount(item.amount, item.financeType)}
                    </Text>
                </View>
            ))
        )}
    </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: { fontSize: 17, fontWeight: '700', color: '#1C1C1E' },
    seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
    seeAllText: { fontSize: 14, color: '#007AFF', fontWeight: '600', marginRight: 2 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    icon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    info: { flex: 1, marginRight: 8 },
    desc: { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
    meta: { fontSize: 12, color: '#8E8E93', marginTop: 3, fontWeight: '500' },
    amount: { fontSize: 14, fontWeight: '800' },
    emptyText: { color: '#8E8E93', textAlign: 'center', paddingVertical: 20, fontWeight: '500' },
});

export default RecentTransactionsList;
