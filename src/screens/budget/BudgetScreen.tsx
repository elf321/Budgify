import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserTransactions } from '../../services/transactionService';
import { Transaction } from '../../types';
import { colors } from '../../theme/colors';
import BrandLogo from '../../components/BrandLogo';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long' });
};

const BudgetScreen = ({ userId = 1 }: { userId?: number }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const fetchData = useCallback(async () => {
        try {
            const transactionData = await getUserTransactions(userId);
            setTransactions(transactionData);
        } catch (error) {
            console.error("Data could not be loaded", error);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const totalIncome = transactions
        .filter(t => t.financeType === 'INCOME')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions
        .filter(t => t.financeType === 'EXPENSE')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const netBalance = totalIncome - totalExpense;

    const expenseRatio = totalIncome > 0
        ? Math.min((totalExpense / totalIncome) * 100, 100)
        : (totalExpense > 0 ? 100 : 0);

    const remainingRatio = Math.max(0, 100 - expenseRatio);

    const renderTransactionItem = ({ item }: { item: Transaction }) => {
        const isIncome = item.financeType === 'INCOME';
        const accent = isIncome ? colors.income : colors.expense;

        return (
        <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: isIncome ? colors.incomeSoft : colors.expenseSoft }]}>
                <Ionicons
                    name={isIncome ? 'arrow-down' : 'arrow-up'}
                    size={20}
                    color={accent}
                />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.transactionDesc}>{item.description}</Text>
                <Text style={styles.transactionSubText}>
                    {item.categoryName} • {formatDate(item.date)}
                </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.transactionAmount, { color: accent }]}>
                    {item.financeType === 'INCOME' ? '+' : '-'}{item.amount.toLocaleString()} TL
                </Text>
            </View>
        </View>
    );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTransactionItem}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.headerSection}>
                        <View style={styles.headerRow}>
                            <View>
                                <Text style={styles.eyebrow}>Budgify wallet</Text>
                                <Text style={styles.title}>My Wallet</Text>
                            </View>
                            <BrandLogo size={44} />
                        </View>

                        <View style={styles.mainBalanceCard}>
                            <View>
                                <Text style={styles.balanceLabel}>Total Balance</Text>
                                <Text style={styles.balanceAmount}>{netBalance.toLocaleString()} TL</Text>
                            </View>

                            <View style={styles.statsRow}>
                                <View style={styles.statBox}>
                                    <View style={[styles.iconCircle, { backgroundColor: colors.incomeSoft }]}>
                                        <Ionicons name="arrow-down" size={16} color={colors.income} />
                                    </View>
                                    <View>
                                        <Text style={styles.statLabel}>Income</Text>
                                        <Text style={styles.incomeValue}>+{totalIncome.toLocaleString()} TL</Text>
                                    </View>
                                </View>

                                <View style={styles.statBox}>
                                    <View style={[styles.iconCircle, { backgroundColor: colors.expenseSoft }]}>
                                        <Ionicons name="arrow-up" size={16} color={colors.expense} />
                                    </View>
                                    <View>
                                        <Text style={styles.statLabel}>Expense</Text>
                                        <Text style={styles.expenseValue}>-{totalExpense.toLocaleString()} TL</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.spendingCard}>
                            <View style={styles.ratioTextRow}>
                                <Text style={styles.ratioLabelText}>Monthly Spending</Text>
                                <Text style={styles.ratioValueText}>{expenseRatio.toFixed(0)}% used</Text>
                            </View>
                            <View style={styles.progressBarBackground}>
                                <View style={[
                                    styles.progressBarForeground,
                                    {
                                        width: `${expenseRatio}%`,
                                        backgroundColor: expenseRatio > 90 ? colors.expense : colors.primary
                                    }
                                ]} />
                            </View>
                            <Text style={styles.remainingText}>{remainingRatio.toFixed(0)}% of income still available</Text>
                        </View>

                        <Text style={styles.sectionTitle}>Recent Transactions</Text>
                    </View>
                }
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No transactions found yet.</Text>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerSection: { paddingTop: 56, marginBottom: 10 },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
        marginBottom: 22,
    },
    eyebrow: { color: colors.primary, fontSize: 13, fontWeight: '800', marginBottom: 6 },
    title: { fontSize: 32, fontWeight: '800', color: colors.ink },
    mainBalanceCard: {
        backgroundColor: colors.surface,
        borderRadius: 26,
        padding: 22,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 3
    },
    balanceLabel: { color: colors.muted, fontSize: 14, fontWeight: '700' },
    balanceAmount: { color: colors.ink, fontSize: 40, fontWeight: '800', marginTop: 6 },
    spendingCard: {
        backgroundColor: colors.primarySoft,
        borderRadius: 20,
        padding: 16,
        marginBottom: 28,
    },
    ratioTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' },
    ratioLabelText: { color: colors.ink, fontSize: 13, fontWeight: '700' },
    ratioValueText: { color: colors.primary, fontSize: 13, fontWeight: '800' },
    progressBarBackground: { height: 8, backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: 4, overflow: 'hidden' },
    progressBarForeground: { height: '100%', borderRadius: 4 },
    remainingText: { color: colors.muted, fontSize: 12, fontWeight: '600', marginTop: 8 },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
    },
    statBox: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        backgroundColor: colors.surfaceSoft,
        borderRadius: 18,
        padding: 12,
        gap: 10,
    },
    iconCircle: { width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center' },
    statLabel: { color: colors.muted, fontSize: 12, fontWeight: '700' },
    incomeValue: { color: colors.income, fontSize: 13, fontWeight: '800', marginTop: 2 },
    expenseValue: { color: colors.expense, fontSize: 13, fontWeight: '800', marginTop: 2 },
    sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.ink, marginBottom: 16 },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: colors.ink,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
        borderWidth: 1,
        borderColor: colors.border
    },
    transactionIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    transactionDesc: { fontSize: 16, fontWeight: '800', color: colors.ink },
    transactionSubText: { fontSize: 13, color: colors.muted, marginTop: 4, fontWeight: '600' },
    transactionAmount: { fontSize: 16, fontWeight: '800' },
    emptyText: { textAlign: 'center', color: colors.muted, marginTop: 50, fontSize: 16, fontWeight: '600' }
});

export default BudgetScreen;
