import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { getUserBudgets } from '../services/budgetService';
import { Budget } from '../types';

const { width } = Dimensions.get('window');

const BudgetScreen = ({ userId = 1 }: { userId?: number }) => {
    const [budgets, setBudgets] = useState<Budget[]>([]);

    useEffect(() => {
        const fetchBudgets = async () => {
            const data = await getUserBudgets(userId);
            setBudgets(data);
        };
        fetchBudgets();
    }, [userId]);

    const renderBudgetItem = ({ item }: { item: Budget }) => {
        const progress = Math.min((item.spentAmount / item.totalAmount) * 100, 100);
        const isOverBudget = item.spentAmount > item.totalAmount;

        return (
            <View style={{
                backgroundColor: '#1E1E1E',
                borderRadius: 20,
                padding: 20,
                marginBottom: 15,
                borderWidth: 1,
                borderColor: isOverBudget ? '#FF4D4D' : '#333'
            }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{item.categoryName}</Text>
                    <Text style={{ color: isOverBudget ? '#FF4D4D' : '#A0A0A0' }}>
                        {item.remainingAmount < 0 ? 'Limit Aşıldı!' : `${item.remainingAmount} TL kaldı`}
                    </Text>
                </View>

                <View style={{ height: 10, backgroundColor: '#333', borderRadius: 5, overflow: 'hidden' }}>
                    <View style={{
                        width: `${progress}%`,
                        height: '100%',
                        backgroundColor: isOverBudget ? '#FF4D4D' : '#4CAF50', // Yeşil veya Kırmızı
                        borderRadius: 5
                    }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                    <Text style={{ color: '#888' }}>{item.spentAmount} TL harcandı</Text>
                    <Text style={{ color: 'white', fontWeight: '600' }}>{item.totalAmount} TL</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#121212', paddingHorizontal: 20, paddingTop: 60 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold' }}>Bütçelerim</Text>
                <TouchableOpacity
                    style={{ backgroundColor: '#4CAF50', padding: 10, borderRadius: 12 }}
                    onPress={() => {/* Bütçe Ekleme Modalını Aç */ }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>+ Ekle</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={budgets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBudgetItem}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center', marginTop: 50 }}>Henüz bir bütçe tanımlamadın.</Text>}
            />
        </View>
    );
};

export default BudgetScreen;