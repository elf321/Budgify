import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Period } from '../../utils/overviewHelpers';

type PeriodToggleProps = {
    value: Period;
    onChange: (period: Period) => void;
};

const PeriodToggle = ({ value, onChange }: PeriodToggleProps) => (
    <View style={styles.container}>
        <TouchableOpacity
            style={[styles.option, value === 'week' && styles.optionActive]}
            onPress={() => onChange('week')}
        >
            <Text style={[styles.optionText, value === 'week' && styles.optionTextActive]}>
                Weekly
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.option, value === 'month' && styles.optionActive]}
            onPress={() => onChange('month')}
        >
            <Text style={[styles.optionText, value === 'month' && styles.optionTextActive]}>
                Monthly
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F7',
        borderRadius: 14,
        padding: 4,
    },
    option: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    optionActive: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    optionText: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
    optionTextActive: { color: '#1C1C1E', fontWeight: '700' },
});

export default PeriodToggle;
