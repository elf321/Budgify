import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { CategorySummary } from '../../types';

type DonutChartProps = {
    data: CategorySummary[];
    size?: number;
};

type SliceData = CategorySummary & {
    startAngle: number;
    sweepAngle: number;
};

function PieSlice({
    startAngle,
    sweepAngle,
    color,
    size,
}: {
    startAngle: number;
    sweepAngle: number;
    color: string;
    size: number;
}) {
    const radius = size / 2;
    if (sweepAngle <= 0) return null;

    const wedgeStyle: ViewStyle = {
        width: radius,
        height: size,
        backgroundColor: color,
        transformOrigin: 'left center',
    };

    const renderWedge = (start: number, degrees: number) => (
        <View
            style={{
                position: 'absolute',
                width: size,
                height: size,
                transform: [{ rotate: `${start}deg` }],
            }}
        >
            <View
                style={{
                    position: 'absolute',
                    left: radius,
                    width: radius,
                    height: size,
                    overflow: 'hidden',
                }}
            >
                <View style={[wedgeStyle, { transform: [{ rotate: `${degrees}deg` }] }]} />
            </View>
        </View>
    );

    if (sweepAngle <= 180) {
        return renderWedge(startAngle, sweepAngle);
    }

    return (
        <>
            {renderWedge(startAngle, 180)}
            {renderWedge(startAngle + 180, sweepAngle - 180)}
        </>
    );
}

const DonutChart = ({ data, size = 168 }: DonutChartProps) => {
    const strokeWidth = 22;
    const innerSize = size - strokeWidth * 2;
    const total = data.reduce((sum, item) => sum + item.totalAmount, 0);

    const slices: SliceData[] = useMemo(() => {
        if (total <= 0) return [];
        let angle = 0;
        return data.map((item) => {
            const sweepAngle = (item.totalAmount / total) * 360;
            const slice = { ...item, startAngle: angle, sweepAngle };
            angle += sweepAngle;
            return slice;
        });
    }, [data, total]);

    if (total === 0) {
        return (
            <View style={[styles.wrap, { width: size, height: size }]}>
                <View
                    style={[
                        styles.emptyOuter,
                        { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth },
                    ]}
                >
                    <Text style={styles.emptyText}>No expenses</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.wrap, { width: size, height: size }]}>
            <View style={[styles.pieContainer, { width: size, height: size }]}>
                {slices.map((slice) => (
                    <PieSlice
                        key={slice.name}
                        startAngle={slice.startAngle}
                        sweepAngle={slice.sweepAngle}
                        color={slice.color}
                        size={size}
                    />
                ))}
            </View>

            <View
                style={[
                    styles.centerLabel,
                    {
                        width: innerSize,
                        height: innerSize,
                        borderRadius: innerSize / 2,
                    },
                ]}
            >
                <Text style={styles.centerTitle}>Total</Text>
                <Text style={styles.centerAmount} numberOfLines={1}>
                    {total.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                </Text>
                <Text style={styles.centerUnit}>TL</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieContainer: {
        transform: [{ rotate: '-90deg' }],
    },
    centerLabel: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    centerTitle: { fontSize: 11, color: '#8E8E93', fontWeight: '600' },
    centerAmount: { fontSize: 18, fontWeight: '800', color: '#1C1C1E', marginTop: 2 },
    centerUnit: { fontSize: 11, color: '#8E8E93', fontWeight: '600' },
    emptyOuter: {
        borderColor: '#F2F2F7',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    emptyText: { fontSize: 12, color: '#8E8E93', fontWeight: '600' },
});

export default DonutChart;
