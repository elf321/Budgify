import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, ScrollView, Alert
} from 'react-native';
import { getCategoriesByType } from '../services/categoryService';
import { createTransaction } from '../services/transactionService';
import { Category } from '../types';
import { colors } from '../theme/colors';

type AddTransactionScreenProps = {
    userId: number;
    onSaved?: () => void;
};

const AddTransactionScreen = ({ userId, onSaved }: AddTransactionScreenProps) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesByType(type);
                setCategories(data);
                setSelectedCategory(null);
            } catch (error) {
                console.error("Category loading error:", error);
                Alert.alert("Error", "Categories could not be loaded.");
            }
        };
        fetchCategories();
    }, [type]);

    const handleSave = async () => {
        const parsedAmount = Number(amount.replace(',', '.'));

        if (!parsedAmount || parsedAmount <= 0 || !selectedCategory) {
            Alert.alert("Warning", "Please enter a valid amount and select a category.");
            return;
        }

        const transactionData = {
            description: description || (type === 'INCOME' ? "Income" : "Expense"),
            amount: parsedAmount,
            categoryId: selectedCategory.id,
            userId,
            financeType: type
        };

        try {
            await createTransaction(transactionData);
            setAmount('');
            setDescription('');
            Alert.alert("Success", "Transaction saved successfully.");
            onSaved?.();
        } catch (error) {
            Alert.alert("Error", "Transaction could not be saved.");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>New Transaction</Text>
                <View style={styles.typeSelector}>
                    <TouchableOpacity
                        style={[styles.typeButton, type === 'EXPENSE' && styles.expenseActive]}
                        onPress={() => setType('EXPENSE')}
                    >
                    <Text style={[styles.typeText, type === 'EXPENSE' && styles.expenseActiveText]}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, type === 'INCOME' && styles.incomeActive]}
                        onPress={() => setType('INCOME')}
                    >
                    <Text style={[styles.typeText, type === 'INCOME' && styles.incomeActiveText]}>Income</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor={colors.muted}
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                />

                <TextInput
                    style={styles.descriptionInput}
                    placeholder={type === 'EXPENSE' ? "Expense Statement" : "Income Statement"}
                    placeholderTextColor={colors.muted}
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={styles.label}>Select category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryItem,
                                selectedCategory?.id === cat.id && { backgroundColor: cat.color + '20', borderColor: cat.color, borderWidth: 1.5 }
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.categoryText, { color: cat.color }]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { padding: 24, paddingTop: 20 },
    title: { fontSize: 26, fontWeight: '800', color: colors.ink, marginBottom: 20 },
    typeSelector: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 16, padding: 5, borderWidth: 1, borderColor: colors.border },
    typeButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    typeText: { fontWeight: '800', color: colors.muted },
    expenseActiveText: { color: colors.expense },
    incomeActiveText: { color: colors.income },
    expenseActive: { backgroundColor: colors.expenseSoft },
    incomeActive: { backgroundColor: colors.incomeSoft },
    form: { padding: 24 },
    amountInput: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 24,
        color: colors.ink,
        fontSize: 50,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 18,
        paddingVertical: 18,
    },
    descriptionInput: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 18,
        color: colors.ink,
        fontSize: 17,
        paddingHorizontal: 16,
        paddingVertical: 15,
        marginBottom: 28,
    },
    label: { fontSize: 13, fontWeight: '800', color: colors.muted, marginBottom: 15, textTransform: 'uppercase' },
    categoryList: { flexDirection: 'row', marginBottom: 40 },
    categoryItem: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 15,
        backgroundColor: colors.surface,
        marginRight: 10,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    categoryText: { fontWeight: '700' },
    saveButton: {
        height: 58,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 4,
    },
    saveButtonText: { color: '#FFF', fontSize: 17, fontWeight: '800' }
});

export default AddTransactionScreen;
