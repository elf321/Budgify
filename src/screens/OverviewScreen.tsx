import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserTransactions } from '../services/transactionService';
import { Transaction } from '../types';
import PeriodToggle from '../components/overview/PeriodToggle';
import DailyTrendChart from '../components/overview/DailyTrendChart';
import DonutChart from '../components/overview/DonutChart';
import RecentTransactionsList from '../components/overview/RecentTransactionsList';
import {
    Period,
    buildCategoryBreakdown,
    buildDailyTrend,
    filterTransactionsByPeriod,
    getPeriodRange,
    getRecentTransactions,
    sumByType,
} from '../utils/overviewHelpers';

const formatAmount = (value: number) =>
    value.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' TL';

type OverviewScreenProps = {
    userId?: number;
    onSeeAllHistory?: () => void;
};

const OverviewScreen = ({ userId = 1, onSeeAllHistory }: OverviewScreenProps) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [period, setPeriod] = useState<Period>('month');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const data = await getUserTransactions(userId);
            setTransactions(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Data could not be loaded');
            setTransactions([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId]);

    useEffect(() => {
        setLoading(true);
        fetchData();
    }, [fetchData]);

    const periodTransactions = useMemo(
        () => filterTransactionsByPeriod(transactions, period),
        [transactions, period],
    );

    const totalIncome = useMemo(() => sumByType(periodTransactions, 'INCOME'), [periodTransactions]);
    const totalExpense = useMemo(() => sumByType(periodTransactions, 'EXPENSE'), [periodTransactions]);
    const totalBalance = totalIncome - totalExpense;

    const dailyTrend = useMemo(
        () => buildDailyTrend(transactions, period),
        [transactions, period],
    );

    const categoryBreakdown = useMemo(
        () => buildCategoryBreakdown(periodTransactions),
        [periodTransactions],
    );

    const recentTransactions = useMemo(
        () => getRecentTransactions(transactions, 5),
        [transactions],
    );

    const periodLabel = useMemo(() => {
        const { start, end } = getPeriodRange(period);
        if (period === 'week') {
            return `${start.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}`;
        }
        return start.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
    }, [period]);

    const trendSubtitle = period === 'week' ? 'Last 7 days' : 'Weekly buckets this month';

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1A1F2B" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Text style={styles.greeting}>Financial Overview</Text>
            <Text style={styles.subGreeting}>Your summary at a glance</Text>

            <View style={styles.toggleWrap}>
                <PeriodToggle value={period} onChange={setPeriod} />
            </View>
            <Text style={styles.periodLabel}>{periodLabel}</Text>

            {error ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            <View style={styles.summaryCard}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>{formatAmount(totalBalance)}</Text>

                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <View style={[styles.summaryIcon, { backgroundColor: '#34C75920' }]}>
                            <Ionicons name="arrow-down" size={18} color="#34C759" />
                        </View>
                        <View>
                            <Text style={styles.summaryItemLabel}>Total Income</Text>
                            <Text style={styles.incomeValue}>+{formatAmount(totalIncome)}</Text>
                        </View>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryItem}>
                        <View style={[styles.summaryIcon, { backgroundColor: '#FF3B3020' }]}>
                            <Ionicons name="arrow-up" size={18} color="#FF3B30" />
                        </View>
                        <View>
                            <Text style={styles.summaryItemLabel}>Total Expense</Text>
                            <Text style={styles.expenseValue}>-{formatAmount(totalExpense)}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <DailyTrendChart data={dailyTrend} periodLabel={trendSubtitle} />

            <View style={styles.donutSection}>
                <Text style={styles.sectionTitle}>Spending by Category</Text>
                <View style={styles.donutCard}>
                    <View style={styles.donutChartWrap}>
                        <DonutChart data={categoryBreakdown} size={168} />
                    </View>
                    <View style={styles.legendList}>
                        {categoryBreakdown.length === 0 ? (
                            <Text style={styles.legendEmpty}>No expenses in this period.</Text>
                        ) : (
                            categoryBreakdown.slice(0, 5).map((item) => {
                                const total = categoryBreakdown.reduce((s, c) => s + c.totalAmount, 0);
                                const pct = total > 0 ? ((item.totalAmount / total) * 100).toFixed(0) : '0';
                                return (
                                    <View key={item.name} style={styles.legendRow}>
                                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                        <Text style={styles.legendName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.legendPct}>{pct}%</Text>
                                    </View>
                                );
                            })
                        )}
                    </View>
                </View>
            </View>

            <RecentTransactionsList
                transactions={recentTransactions}
                onSeeAll={onSeeAllHistory}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFDFD' },
    content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFDFD' },
    greeting: { fontSize: 28, fontWeight: '800', color: '#1C1C1E' },
    subGreeting: { fontSize: 15, color: '#8E8E93', marginTop: 4, fontWeight: '500' },
    toggleWrap: { marginTop: 20, marginBottom: 8 },
    periodLabel: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorBox: {
        backgroundColor: '#FF3B3015',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    errorText: { color: '#FF3B30', fontWeight: '600' },
    summaryCard: {
        backgroundColor: '#1A1F2B',
        borderRadius: 28,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    balanceLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 14, fontWeight: '600' },
    balanceAmount: { color: '#FFF', fontSize: 36, fontWeight: '800', marginVertical: 6 },
    summaryRow: {
        flexDirection: 'row',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.12)',
    },
    summaryItem: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    summaryIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    summaryItemLabel: { color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: '600' },
    incomeValue: { color: '#34C759', fontSize: 13, fontWeight: '700', marginTop: 2 },
    expenseValue: { color: '#FF3B30', fontSize: 13, fontWeight: '700', marginTop: 2 },
    summaryDivider: {
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.12)',
        marginHorizontal: 12,
    },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginBottom: 12 },
    donutSection: { marginBottom: 20 },
    donutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    donutChartWrap: { marginRight: 16 },
    legendList: { flex: 1 },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
    legendName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
    legendPct: { fontSize: 13, fontWeight: '700', color: '#8E8E93' },
    legendEmpty: { fontSize: 13, color: '#8E8E93', fontWeight: '500' },
});

export default OverviewScreen;
