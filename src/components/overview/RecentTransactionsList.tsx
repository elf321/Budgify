import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Transaction } from '../../types';
import { parseTransactionDate } from '../../utils/overviewHelpers';
import { colors } from '../../theme/colors';

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
                    <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
            ) : null}
        </View>

        {transactions.length === 0 ? (
            <Text style={styles.emptyText}>No transactions yet.</Text>
        ) : (
            transactions.map((item) => (
                <View key={item.id} style={styles.row}>
                    <View style={[styles.icon, { backgroundColor: item.financeType === 'INCOME' ? colors.incomeSoft : colors.expenseSoft }]}>
                        <Ionicons
                            name={item.financeType === 'INCOME' ? 'arrow-down' : 'arrow-up'}
                            size={20}
                            color={item.financeType === 'INCOME' ? colors.income : colors.expense}
                        />
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
                            { color: item.financeType === 'INCOME' ? colors.income : colors.expense },
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
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: { fontSize: 17, fontWeight: '800', color: colors.ink },
    seeAllBtn: { flexDirection: 'row', alignItems: 'center' },
    seeAllText: { fontSize: 14, color: colors.primary, fontWeight: '700', marginRight: 2 },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
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
    desc: { fontSize: 15, fontWeight: '800', color: colors.ink },
    meta: { fontSize: 12, color: colors.muted, marginTop: 3, fontWeight: '600' },
    amount: { fontSize: 14, fontWeight: '800' },
    emptyText: { color: colors.muted, textAlign: 'center', paddingVertical: 20, fontWeight: '600' },
});

export default RecentTransactionsList;
