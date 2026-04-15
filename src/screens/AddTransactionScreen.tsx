import React, { useState, useEffect } from 'react';
import { 
    View, Text, TextInput, TouchableOpacity, 
    StyleSheet, SafeAreaView, ScrollView, Alert 
} from 'react-native';
import { getAllCategories } from '../services/categoryService';
import { createTransaction } from '../services/transactionService';
import { Category } from '../types';

type AddTransactionScreenProps = {
    onSaved?: () => void;
};

const AddTransactionScreen = ({ onSaved }: AddTransactionScreenProps) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch (error) {
                Alert.alert("Error", "Categories could not be loaded.");
            }
        };
        fetchCategories();
    }, []);

    const handleSave = async () => {
        const normalizedAmount = amount.trim().replace(',', '.');
        const parsedAmount = Number(normalizedAmount);

        if (!normalizedAmount || !Number.isFinite(parsedAmount) || parsedAmount <= 0 || !selectedCategory) {
            Alert.alert("Warning", "Please select the amount and category.");
            return;
        }

        const transactionData = {
            description: description || "No description",
            amount: parsedAmount,
            categoryId: selectedCategory.id,
            userId: 1 
        };

        try {
            const created = await createTransaction(transactionData);
            if (!created || !created.id) {
                throw new Error("Transaction could not be created.");
            }
            setAmount('');
            setDescription('');
            setSelectedCategory(null);
            Alert.alert("Success", "Transaction saved successfully!", [
                { text: "OK", onPress: () => onSaved?.() }
            ]);
        } catch (error) {
            const message = error instanceof Error ? error.message : "An error occurred while saving the transaction.";
            Alert.alert("Error", message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Add Transaction</Text>
            </View>

            <View style={styles.form}>
                <TextInput
                    style={styles.amountInput}
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />

                <TextInput
                    style={styles.descriptionInput}
                    placeholder="Where did you spend? (e.g: Migros)"
                    placeholderTextColor="#9CA3AF"
                    value={description}
                    onChangeText={setDescription}
                />

                <Text style={styles.label}>Choose category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
                    {categories.map((cat) => (
                        <TouchableOpacity 
                            key={cat.id} 
                            style={[
                                styles.categoryItem, 
                                selectedCategory?.id === cat.id && { borderColor: cat.color, borderWidth: 2 }
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[styles.categoryText, { color: cat.color }]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: { padding: 24, paddingTop: 40 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#000' },
    form: { padding: 24 },
    amountInput: { fontSize: 48, fontWeight: 'bold', color: '#000', marginBottom: 20 },
    descriptionInput: { fontSize: 18, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingVertical: 12, marginBottom: 30 },
    label: { fontSize: 16, fontWeight: '600', color: '#9CA3AF', marginBottom: 12 },
    categoryList: { flexDirection: 'row', marginBottom: 40 },
    categoryItem: { 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        borderRadius: 20, 
        backgroundColor: '#F3F4F6', 
        marginRight: 10,
        height: 45,
        justifyContent: 'center'
    },
    categoryText: { fontWeight: '600' },
    saveButton: { backgroundColor: '#000', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});

export default AddTransactionScreen;