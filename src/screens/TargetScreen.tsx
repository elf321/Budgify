import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCategoriesByType } from '../services/categoryService';
import { createTarget, getTargetStatusList } from '../services/targetService';
import { Category, TargetStatus, TargetType } from '../types';

const formatAmount = (value: number) =>
    value.toLocaleString('tr-TR', { maximumFractionDigits: 0 }) + ' TL';

type TargetScreenProps = {
    userId?: number;
};

const TargetScreen = ({ userId = 1 }: TargetScreenProps) => {
    const [targets, setTargets] = useState<TargetStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);

    const [targetType, setTargetType] = useState<TargetType>('GENERAL');
    const [amount, setAmount] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const fetchTargets = useCallback(async () => {
        try {
            setError(null);
            const data = await getTargetStatusList(userId);
            setTargets(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Targets could not be loaded');
            setTargets([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId]);

    useEffect(() => {
        setLoading(true);
        fetchTargets();
    }, [fetchTargets]);

    useEffect(() => {
        if (targetType !== 'CATEGORY') return;

        const loadCategories = async () => {
            try {
                const data = await getCategoriesByType('EXPENSE');
                setCategories(data);
                setSelectedCategory(null);
            } catch {
                Alert.alert('Error', 'Categories could not be loaded.');
            }
        };
        loadCategories();
    }, [targetType]);

    const resetForm = () => {
        setAmount('');
        setTargetType('GENERAL');
        setSelectedCategory(null);
        setShowForm(false);
    };

    const handleCreate = async () => {
        const parsedAmount = Number(amount.replace(',', '.'));
        if (!parsedAmount || parsedAmount <= 0) {
            Alert.alert('Warning', 'Please enter a valid target amount.');
            return;
        }
        if (targetType === 'CATEGORY' && !selectedCategory) {
            Alert.alert('Warning', 'Please select a category.');
            return;
        }

        setSaving(true);
        try {
            await createTarget(userId, {
                targetType,
                targetAmount: parsedAmount,
                categoryName: targetType === 'CATEGORY' ? selectedCategory!.name : undefined,
                categoryColor: targetType === 'CATEGORY' ? selectedCategory!.color : undefined,
            });
            resetForm();
            await fetchTargets();
            Alert.alert('Success', 'Target created successfully.');
        } catch (e) {
            Alert.alert('Error', e instanceof Error ? e.message : 'Target could not be created.');
        } finally {
            setSaving(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchTargets();
    };

    const getProgressColor = (percentage: number, remaining: number) => {
        if (remaining < 0) return '#FF3B30';
        if (percentage >= 90) return '#FF9500';
        return '#34C759';
    };

    const renderTargetCard = (item: TargetStatus) => {
        const progress = Math.min(item.progressPercentage, 100);
        const progressColor = getProgressColor(progress, item.remainingAmount);
        const isOverBudget = item.remainingAmount < 0;
        const title = item.targetType === 'GENERAL'
            ? 'General Spending'
            : item.categoryName ?? 'Category Target';
        const accent = item.categoryColor ?? '#1A1F2B';

        return (
            <View key={item.id} style={styles.targetCard}>
                <View style={styles.targetHeader}>
                    <View style={[styles.targetIcon, { backgroundColor: accent + '18' }]}>
                        <Ionicons
                            name={item.targetType === 'GENERAL' ? 'pie-chart-outline' : 'pricetag-outline'}
                            size={22}
                            color={accent}
                        />
                    </View>
                    <View style={styles.targetInfo}>
                        <Text style={styles.targetTitle}>{title}</Text>
                        <Text style={styles.targetSubtitle}>
                            Limit: {formatAmount(item.targetAmount)}
                        </Text>
                    </View>
                    <Text style={[styles.targetPct, { color: progressColor }]}>
                        {item.progressPercentage.toFixed(0)}%
                    </Text>
                </View>

                <View style={styles.progressBackground}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${progress}%`, backgroundColor: progressColor },
                        ]}
                    />
                </View>

                <View style={styles.targetStats}>
                    <Text style={styles.statText}>
                        Spent: <Text style={styles.statValue}>{formatAmount(item.currentSpent)}</Text>
                    </Text>
                    <Text style={[styles.statText, isOverBudget && styles.overBudget]}>
                        {isOverBudget
                            ? `Over: ${formatAmount(Math.abs(item.remainingAmount))}`
                            : `Left: ${formatAmount(item.remainingAmount)}`}
                    </Text>
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
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.title}>Targets</Text>
                    <Text style={styles.subtitle}>Monthly spending limits</Text>
                </View>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => setShowForm((prev) => !prev)}
                >
                    <Ionicons name={showForm ? 'close' : 'add'} size={22} color="#FFF" />
                </TouchableOpacity>
            </View>

            {error ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : null}

            {showForm ? (
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>New Target</Text>

                    <View style={styles.typeRow}>
                        <TouchableOpacity
                            style={[styles.typeBtn, targetType === 'GENERAL' && styles.typeBtnActive]}
                            onPress={() => setTargetType('GENERAL')}
                        >
                            <Text style={[styles.typeBtnText, targetType === 'GENERAL' && styles.typeBtnTextActive]}>
                                General
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.typeBtn, targetType === 'CATEGORY' && styles.typeBtnActive]}
                            onPress={() => setTargetType('CATEGORY')}
                        >
                            <Text style={[styles.typeBtnText, targetType === 'CATEGORY' && styles.typeBtnTextActive]}>
                                Category
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.amountInput}
                        placeholder="Target amount (TL)"
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                    />

                    {targetType === 'CATEGORY' ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
                            {categories.map((cat) => (
                                <TouchableOpacity
                                    key={cat.id}
                                    style={[
                                        styles.categoryChip,
                                        selectedCategory?.id === cat.id && {
                                            backgroundColor: cat.color + '20',
                                            borderColor: cat.color,
                                        },
                                    ]}
                                    onPress={() => setSelectedCategory(cat)}
                                >
                                    <Text style={[styles.categoryChipText, { color: cat.color }]}>
                                        {cat.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : null}

                    <TouchableOpacity
                        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                        onPress={handleCreate}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.saveBtnText}>Create Target</Text>
                        )}
                    </TouchableOpacity>
                </View>
            ) : null}

            {targets.length === 0 ? (
                <View style={styles.emptyCard}>
                    <Ionicons name="flag-outline" size={40} color="#8E8E93" />
                    <Text style={styles.emptyTitle}>No targets yet</Text>
                    <Text style={styles.emptyText}>
                        Set a monthly spending limit to track your progress.
                    </Text>
                </View>
            ) : (
                targets.map(renderTargetCard)
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FDFDFD' },
    content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FDFDFD' },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: { fontSize: 28, fontWeight: '800', color: '#1C1C1E' },
    subtitle: { fontSize: 14, color: '#8E8E93', marginTop: 4, fontWeight: '500' },
    addBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1A1F2B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorBox: {
        backgroundColor: '#FF3B3015',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    errorText: { color: '#FF3B30', fontWeight: '600' },
    formCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    formTitle: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginBottom: 16 },
    typeRow: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    typeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    typeBtnActive: { backgroundColor: '#FFF' },
    typeBtnText: { fontWeight: '600', color: '#8E8E93' },
    typeBtnTextActive: { color: '#1C1C1E', fontWeight: '700' },
    amountInput: {
        borderWidth: 1,
        borderColor: '#F2F2F7',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        marginBottom: 14,
        backgroundColor: '#FAFAFA',
    },
    categoryList: { marginBottom: 16 },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: '#F9FAFB',
        marginRight: 10,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    categoryChipText: { fontWeight: '700' },
    saveBtn: {
        backgroundColor: '#1A1F2B',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    saveBtnDisabled: { opacity: 0.7 },
    saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
    targetCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    targetHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    targetIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    targetInfo: { flex: 1 },
    targetTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
    targetSubtitle: { fontSize: 13, color: '#8E8E93', marginTop: 2, fontWeight: '500' },
    targetPct: { fontSize: 15, fontWeight: '800' },
    progressBackground: {
        height: 8,
        backgroundColor: '#F2F2F7',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 12,
    },
    progressFill: { height: '100%', borderRadius: 4 },
    targetStats: { flexDirection: 'row', justifyContent: 'space-between' },
    statText: { fontSize: 13, color: '#8E8E93', fontWeight: '500' },
    statValue: { color: '#1C1C1E', fontWeight: '700' },
    overBudget: { color: '#FF3B30', fontWeight: '700' },
    emptyCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginTop: 12 },
    emptyText: { fontSize: 14, color: '#8E8E93', textAlign: 'center', marginTop: 8, lineHeight: 20 },
});

export default TargetScreen;
