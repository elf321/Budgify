import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { getUserBudgets } from '../services/budgetService';
import { Budget } from '../types';

const formatAmount = (value: number) =>
    value.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' TL';

const BudgetScreen = ({ userId = 1 }: { userId?: number }) => {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBudgets = useCallback(async () => {
        try {
            setError(null);
            const data = await getUserBudgets(userId);
            setBudgets(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Budgets could not be loaded.');
            setBudgets([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId]);

    useEffect(() => {
        setLoading(true);
        fetchBudgets();
    }, [fetchBudgets]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchBudgets();
    };

    const renderBudgetItem = ({ item }: { item: Budget }) => {
        const progress = item.totalAmount > 0
            ? Math.min((item.spentAmount / item.totalAmount) * 100, 100)
            : 0;
        const isOverBudget = item.spentAmount > item.totalAmount;

        return (
            <View style={styles.budgetCard}>
                <View style={styles.cardHeader}>
                    <View style={[styles.categoryDot, { backgroundColor: item.categoryColor || '#8E8E93' }]} />
                    <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName}>{item.categoryName}</Text>
                        <Text style={styles.periodText}>{item.month}/{item.year}</Text>
                    </View>
                    <Text style={[styles.remainingText, isOverBudget && styles.overBudgetText]}>
                        {isOverBudget
                            ? `${formatAmount(Math.abs(item.remainingAmount))} over`
                            : `${formatAmount(item.remainingAmount)} left`}
                    </Text>
                </View>

                <View style={styles.progressTrack}>
                    <View
                        style={[
                            styles.progressFill,
                            {
                                width: `${progress}%`,
                                backgroundColor: isOverBudget ? '#FF3B30' : '#34C759',
                            },
                        ]}
                    />
                </View>

                <View style={styles.amountRow}>
                    <Text style={styles.amountMuted}>{formatAmount(item.spentAmount)} spent</Text>
                    <Text style={styles.amountStrong}>{formatAmount(item.totalAmount)}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#1A1F2B" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={budgets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBudgetItem}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={styles.content}
                ListHeaderComponent={
                    <View style={styles.headerSection}>
                        <Text style={styles.title}>Budgets</Text>
                        <Text style={styles.subtitle}>Monthly limits by category</Text>
                        {error ? (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}
                    </View>
                }
                ListEmptyComponent={
                    <View style={styles.emptyCard}>
                        <Text style={styles.emptyTitle}>No budgets yet</Text>
                        <Text style={styles.emptyText}>
                            Create category limits from the backend to track spending here.
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFDFD' },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFDFD' },
    headerSection: { paddingTop: 56, marginBottom: 20 },
    title: { fontSize: 28, fontWeight: '800', color: '#1C1C1E' },
    subtitle: { fontSize: 14, color: '#8E8E93', marginTop: 4, fontWeight: '500' },
    errorBox: {
        backgroundColor: '#FF3B3015',
        borderRadius: 12,
        padding: 12,
        marginTop: 16,
    },
    errorText: { color: '#FF3B30', fontWeight: '600' },
    budgetCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F2F2F7',
        padding: 18,
        marginBottom: 14,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    categoryDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
    categoryInfo: { flex: 1 },
    categoryName: { color: '#1C1C1E', fontSize: 17, fontWeight: '700' },
    periodText: { color: '#8E8E93', fontSize: 12, fontWeight: '600', marginTop: 3 },
    remainingText: { color: '#34C759', fontSize: 13, fontWeight: '700' },
    overBudgetText: { color: '#FF3B30' },
    progressTrack: {
        height: 8,
        backgroundColor: '#F2F2F7',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: 4 },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    amountMuted: { color: '#8E8E93', fontSize: 13, fontWeight: '600' },
    amountStrong: { color: '#1C1C1E', fontSize: 13, fontWeight: '800' },
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#F2F2F7',
        padding: 24,
        alignItems: 'center',
    },
    emptyTitle: { color: '#1C1C1E', fontSize: 17, fontWeight: '700' },
    emptyText: { color: '#8E8E93', fontSize: 14, textAlign: 'center', marginTop: 6 },
});

export default BudgetScreen;
