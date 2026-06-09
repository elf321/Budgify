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
import { colors } from '../theme/colors';
import BrandLogo from '../components/BrandLogo';
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
    onSeeAllTargets?: () => void;
};

const OverviewScreen = ({ userId = 1, onSeeAllTargets }: OverviewScreenProps) => {
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
                <ActivityIndicator size="large" color={colors.primary} />
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
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.eyebrow}>Your monthly picture</Text>
                    <Text style={styles.greeting}>Financial Overview</Text>
                    <Text style={styles.subGreeting}>Your summary at a glance</Text>
                </View>
                <BrandLogo size={44} />
            </View>

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
                        <View style={[styles.summaryIcon, { backgroundColor: colors.incomeSoft }]}>
                            <Ionicons name="arrow-down" size={18} color={colors.income} />
                        </View>
                        <View>
                            <Text style={styles.summaryItemLabel}>Total Income</Text>
                            <Text style={styles.incomeValue}>+{formatAmount(totalIncome)}</Text>
                        </View>
                    </View>

                    <View style={styles.summaryDivider} />

                    <View style={styles.summaryItem}>
                        <View style={[styles.summaryIcon, { backgroundColor: colors.expenseSoft }]}>
                            <Ionicons name="arrow-up" size={18} color={colors.expense} />
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
                onSeeAll={onSeeAllTargets}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 14,
    },
    eyebrow: { color: colors.primary, fontSize: 13, fontWeight: '800', marginBottom: 6 },
    greeting: { fontSize: 30, fontWeight: '800', color: colors.ink },
    subGreeting: { fontSize: 15, color: colors.muted, marginTop: 4, fontWeight: '600' },
    toggleWrap: { marginTop: 20, marginBottom: 8 },
    periodLabel: {
        fontSize: 13,
        color: colors.muted,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    errorBox: {
        backgroundColor: colors.expenseSoft,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    errorText: { color: colors.expense, fontWeight: '700' },
    summaryCard: {
        backgroundColor: colors.surface,
        borderRadius: 26,
        padding: 22,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
        elevation: 3,
    },
    balanceLabel: { color: colors.muted, fontSize: 14, fontWeight: '700' },
    balanceAmount: { color: colors.ink, fontSize: 38, fontWeight: '800', marginVertical: 6 },
    summaryRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 16,
    },
    summaryItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surfaceSoft,
        borderRadius: 18,
        padding: 12,
    },
    summaryIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    summaryItemLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' },
    incomeValue: { color: colors.income, fontSize: 13, fontWeight: '800', marginTop: 2 },
    expenseValue: { color: colors.expense, fontSize: 13, fontWeight: '800', marginTop: 2 },
    summaryDivider: {
        display: 'none',
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.ink, marginBottom: 12 },
    donutSection: { marginBottom: 20 },
    donutCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    donutChartWrap: { marginRight: 16 },
    legendList: { flex: 1 },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
    legendName: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.ink },
    legendPct: { fontSize: 13, fontWeight: '800', color: colors.muted },
    legendEmpty: { fontSize: 13, color: colors.muted, fontWeight: '600' },
});

export default OverviewScreen;
