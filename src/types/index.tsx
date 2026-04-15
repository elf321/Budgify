export interface Transaction {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: string;
    type: 'INCOME' | 'EXPENSE';
}

export interface Budget {
    category: string;
    limit: number;
    spent: number;
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    color: string;
}