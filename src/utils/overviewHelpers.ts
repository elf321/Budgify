import { CategorySummary, Transaction } from '../types';

export type Period = 'week' | 'month';

const DAY_MS = 24 * 60 * 60 * 1000;

export function parseTransactionDate(dateString: string): Date {
    const parsed = new Date(dateString);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

export function getPeriodRange(period: Period, reference = new Date()): { start: Date; end: Date } {
    const end = startOfDay(reference);
    end.setHours(23, 59, 59, 999);

    const start = new Date(end);

    if (period === 'week') {
        start.setDate(end.getDate() - 6);
        start.setHours(0, 0, 0, 0);
        return { start, end };
    }

    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return { start, end };
}

export function isWithinPeriod(date: Date, period: Period, reference = new Date()): boolean {
    const { start, end } = getPeriodRange(period, reference);
    return date >= start && date <= end;
}

export function filterTransactionsByPeriod(
    transactions: Transaction[],
    period: Period,
    reference = new Date(),
): Transaction[] {
    return transactions.filter((t) =>
        isWithinPeriod(parseTransactionDate(t.date), period, reference),
    );
}

function toAmount(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

export function sumByType(transactions: Transaction[], type: 'INCOME' | 'EXPENSE'): number {
    return transactions
        .filter((t) => t.financeType === type)
        .reduce((sum, t) => sum + toAmount(t.amount), 0);
}

export type DailyTrendPoint = {
    label: string;
    income: number;
    expense: number;
};

export function buildDailyTrend(
    transactions: Transaction[],
    period: Period,
    reference = new Date(),
): DailyTrendPoint[] {
    const { start, end } = getPeriodRange(period, reference);
    const points: DailyTrendPoint[] = [];

    if (period === 'week') {
        for (let i = 0; i < 7; i++) {
            const day = new Date(start);
            day.setDate(start.getDate() + i);
            const dayEnd = new Date(day);
            dayEnd.setHours(23, 59, 59, 999);

            const dayTx = transactions.filter((t) => {
                const d = parseTransactionDate(t.date);
                return d >= day && d <= dayEnd;
            });

            points.push({
                label: day.toLocaleDateString('tr-TR', { weekday: 'short' }),
                income: sumByType(dayTx, 'INCOME'),
                expense: sumByType(dayTx, 'EXPENSE'),
            });
        }
        return points;
    }

    const cursor = new Date(start);
    while (cursor <= end) {
        const weekStart = new Date(cursor);
        const weekEnd = new Date(cursor);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        if (weekEnd > end) weekEnd.setTime(end.getTime());

        const weekTx = transactions.filter((t) => {
            const d = parseTransactionDate(t.date);
            return d >= weekStart && d <= weekEnd;
        });

        const weekIndex = Math.floor((weekStart.getTime() - start.getTime()) / (7 * DAY_MS)) + 1;
        points.push({
            label: `H${weekIndex}`,
            income: sumByType(weekTx, 'INCOME'),
            expense: sumByType(weekTx, 'EXPENSE'),
        });

        cursor.setDate(cursor.getDate() + 7);
    }

    return points;
}

export function buildCategoryBreakdown(transactions: Transaction[]): CategorySummary[] {
    const map = new Map<string, CategorySummary>();

    transactions
        .filter((t) => t.financeType === 'EXPENSE')
        .forEach((t) => {
            const existing = map.get(t.categoryName);
            const amount = toAmount(t.amount);
            if (existing) {
                existing.totalAmount += amount;
            } else {
                map.set(t.categoryName, {
                    name: t.categoryName,
                    totalAmount: amount,
                    color: t.categoryColor || '#8E8E93',
                });
            }
        });

    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount);
}

export function getRecentTransactions(transactions: Transaction[], limit = 5): Transaction[] {
    return [...transactions]
        .sort((a, b) => parseTransactionDate(b.date).getTime() - parseTransactionDate(a.date).getTime())
        .slice(0, limit);
}
