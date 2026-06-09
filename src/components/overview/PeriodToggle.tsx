import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Period } from '../../utils/overviewHelpers';
import { colors } from '../../theme/colors';

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
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    option: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    optionActive: {
        backgroundColor: colors.primarySoft,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    optionText: { fontSize: 14, fontWeight: '700', color: colors.muted },
    optionTextActive: { color: colors.primary, fontWeight: '800' },
});

export default PeriodToggle;
