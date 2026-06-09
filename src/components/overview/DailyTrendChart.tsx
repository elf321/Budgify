import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyTrendPoint } from '../../utils/overviewHelpers';
import { colors } from '../../theme/colors';

type DailyTrendChartProps = {
    data: DailyTrendPoint[];
    periodLabel: string;
};

const CHART_HEIGHT = 120;

const DailyTrendChart = ({ data, periodLabel }: DailyTrendChartProps) => {
    const maxValue = Math.max(
        ...data.flatMap((d) => [d.income, d.expense]),
        1,
    );

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>Income & Expense Trend</Text>
                <Text style={styles.subtitle}>{periodLabel}</Text>
            </View>

            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.income }]} />
                    <Text style={styles.legendText}>Income</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.expense }]} />
                    <Text style={styles.legendText}>Expense</Text>
                </View>
            </View>

            {data.every((d) => d.income === 0 && d.expense === 0) ? (
                <Text style={styles.emptyText}>No data for this period.</Text>
            ) : (
                <View style={styles.chartArea}>
                    {data.map((point, index) => {
                        const incomeHeight = (point.income / maxValue) * CHART_HEIGHT;
                        const expenseHeight = (point.expense / maxValue) * CHART_HEIGHT;

                        return (
                            <View key={`${point.label}-${index}`} style={styles.barGroup}>
                                <View style={styles.barsRow}>
                                    <View
                                        style={[
                                            styles.bar,
                                            styles.incomeBar,
                                            { height: Math.max(incomeHeight, point.income > 0 ? 4 : 0) },
                                        ]}
                                    />
                                    <View
                                        style={[
                                            styles.bar,
                                            styles.expenseBar,
                                            { height: Math.max(expenseHeight, point.expense > 0 ? 4 : 0) },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.barLabel} numberOfLines={1}>
                                    {point.label}
                                </Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: colors.border,
    },
    header: { marginBottom: 12 },
    title: { fontSize: 17, fontWeight: '800', color: colors.ink },
    subtitle: { fontSize: 13, color: colors.muted, marginTop: 2, fontWeight: '600' },
    legendRow: { flexDirection: 'row', marginBottom: 16 },
    legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
    legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    legendText: { fontSize: 12, color: colors.muted, fontWeight: '700' },
    chartArea: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: CHART_HEIGHT + 24,
        paddingTop: 8,
    },
    barGroup: { flex: 1, alignItems: 'center' },
    barsRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: CHART_HEIGHT,
    },
    bar: { width: 8, borderRadius: 4, minHeight: 0, marginHorizontal: 1.5 },
    incomeBar: { backgroundColor: colors.income },
    expenseBar: { backgroundColor: colors.expense },
    barLabel: { fontSize: 10, color: colors.muted, marginTop: 8, fontWeight: '700' },
    emptyText: { textAlign: 'center', color: colors.muted, paddingVertical: 24, fontWeight: '600' },
});

export default DailyTrendChart;
