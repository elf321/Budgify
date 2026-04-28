import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getUserTransactions } from '../../services/transactionService';
import { Transaction } from '../../types';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

    // Harcama/Gelir oranı hesaplaması
    const expenseRatio = totalIncome > 0
        ? Math.min((totalExpense / totalIncome) * 100, 100)
        : (totalExpense > 0 ? 100 : 0);

    const renderTransactionItem = ({ item }: { item: Transaction }) => (
        <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: item.categoryColor + '15' }]}>
                <Ionicons
                    name={ 'wallet-outline'}
                    size={22}
                    color={item.categoryColor}
                />
            </View>

            <View style={{ flex: 1 }}>
                <Text style={styles.transactionDesc}>{item.description}</Text>
                <Text style={styles.transactionSubText}>
                    {item.categoryName} • {formatDate(item.date)}
                </Text>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.transactionAmount, { color: item.financeType === 'INCOME' ? '#34C759' : '#FF3B30' }]}>
                    {item.financeType === 'INCOME' ? '+' : '-'}{item.amount.toLocaleString()} TL
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={transactions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTransactionItem}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.headerSection}>
                        <Text style={styles.title}>My Wallet</Text>

                        <View style={styles.mainBalanceCard}>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <Text style={styles.balanceAmount}>{netBalance.toLocaleString()} TL</Text>

                            {/* Spending Progress Bar */}
                            <View style={styles.ratioSection}>
                                <View style={styles.ratioTextRow}>
                                    <Text style={styles.ratioLabelText}>Monthly Spending</Text>
                                    <Text style={styles.ratioValueText}>{expenseRatio.toFixed(0)}% of income</Text>
                                </View>
                                <View style={styles.progressBarBackground}>
                                    <View style={[
                                        styles.progressBarForeground,
                                        {
                                            width: `${expenseRatio}%`,
                                            backgroundColor: expenseRatio > 90 ? '#FF3B30' : '#34C759'
                                        }
                                    ]} />
                                </View>
                            </View>

                            <View style={styles.statsRow}>
                                <View style={styles.statBox}>
                                    <View style={styles.iconCircle}>
                                        <Ionicons name="arrow-down" size={16} color="#34C759" />
                                    </View>
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.statLabel}>Income</Text>
                                        <Text style={styles.incomeValue}>+{totalIncome.toLocaleString()} TL</Text>
                                    </View>
                                </View>

                                <View style={styles.verticalDivider} />

                                <View style={styles.statBox}>
                                    <View style={[styles.iconCircle, { backgroundColor: '#FF3B3020' }]}>
                                        <Ionicons name="arrow-up" size={16} color="#FF3B30" />
                                    </View>
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.statLabel}>Expense</Text>
                                        <Text style={styles.expenseValue}>-{totalExpense.toLocaleString()} TL</Text>
                                    </View>
                                </View>
                            </View>
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
    container: { flex: 1, backgroundColor: '#FDFDFD' },
    headerSection: { paddingTop: 60, marginBottom: 10 },
    title: { fontSize: 32, fontWeight: '800', color: '#1C1C1E', marginBottom: 25 },

    mainBalanceCard: {
        backgroundColor: '#1A1F2B', // İstediğin Charcoal Blue tonu
        borderRadius: 32,
        padding: 28,
        marginBottom: 35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10
    },
    balanceLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: '600', letterSpacing: 0.5 },
    balanceAmount: { color: '#FFF', fontSize: 42, fontWeight: '800', marginVertical: 8 },

    // Ratio Section Styles
    ratioSection: { marginTop: 15, marginBottom: 5 },
    ratioTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, alignItems: 'flex-end' },
    ratioLabelText: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' },
    ratioValueText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
    progressBarBackground: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' },
    progressBarForeground: { height: '100%', borderRadius: 3 },

    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)'
    },
    statBox: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#34C75920', justifyContent: 'center', alignItems: 'center' },
    statLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' },
    incomeValue: { color: '#34C759', fontSize: 14, fontWeight: '700' },
    expenseValue: { color: '#FF3B30', fontSize: 14, fontWeight: '700' },
    verticalDivider: { width: 1, height: 35, backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 15 },

    sectionTitle: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 20 },

    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 24,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F2F2F7'
    },
    transactionIcon: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
    transactionDesc: { fontSize: 17, fontWeight: '700', color: '#1C1C1E' },
    transactionSubText: { fontSize: 13, color: '#8E8E93', marginTop: 4, fontWeight: '500' },
    transactionAmount: { fontSize: 17, fontWeight: '800' },

    emptyText: { textAlign: 'center', color: '#8E8E93', marginTop: 50, fontSize: 16, fontWeight: '500' }
});

export default BudgetScreen;