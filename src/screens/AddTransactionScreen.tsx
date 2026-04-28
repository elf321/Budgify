import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, SafeAreaView, ScrollView, Alert
} from 'react-native';
import { getCategoriesByType } from '../services/categoryService';
import { createTransaction } from '../services/transactionService';
import { Category, Transaction } from '../types';

const AddTransactionScreen = ({ onSaved }: any) => {
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
            userId: 1,
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
                        <Text style={[styles.typeText, type === 'EXPENSE' && styles.activeText]}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.typeButton, type === 'INCOME' && styles.incomeActive]}
                        onPress={() => setType('INCOME')}
                    >
                        <Text style={[styles.typeText, type === 'INCOME' && styles.activeText]}>Income</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={[styles.amountInput, { color: type === 'EXPENSE' ? '#000000' : '#000000' }]}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                />

                <TextInput
                    style={styles.descriptionInput}
                    placeholder={type === 'EXPENSE' ? "Expense Statement" : "Income Statement"}
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
                    style={[styles.saveButton, { backgroundColor: type === 'EXPENSE' ? '#000' : '#000000' }]}
                    onPress={handleSave}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { padding: 24, paddingTop: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 20 },
    typeSelector: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 },
    typeButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    typeText: { fontWeight: '600', color: '#6B7280' },
    activeText: { color: '#FFF' },
    expenseActive: { backgroundColor: '#FF3B30' },
    incomeActive: { backgroundColor: '#34C759' },
    form: { padding: 24 },
    amountInput: { fontSize: 54, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
    descriptionInput: { fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 15, marginBottom: 30 },
    label: { fontSize: 14, fontWeight: '700', color: '#9CA3AF', marginBottom: 15, textTransform: 'uppercase' },
    categoryList: { flexDirection: 'row', marginBottom: 40 },
    categoryItem: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 15, backgroundColor: '#F9FAFB', marginRight: 10, justifyContent: 'center' },
    categoryText: { fontWeight: '700' },
    saveButton: { height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default AddTransactionScreen;