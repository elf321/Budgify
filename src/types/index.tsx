export interface Transaction {
    id: number;
    description: string;
    amount: number;
    categoryName: string;
    categoryColor: string;
    date: string; 
    financeType: 'INCOME' | 'EXPENSE';
}

export interface Budget {
    id: number;
    userId: number;
    categoryId: number;
    categoryIcon: string;
    categoryColor: string;
    totalAmount: number;
    spentAmount: number;
    remainingAmount: number;
    categoryName: string;
    month: number;
    year: number;
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: 'INCOME' | 'EXPENSE';
}

export interface User {
    id: number;
    username: string;
    email: string;
    fullName: string;
}