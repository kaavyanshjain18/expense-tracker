import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { predictNextMonth } from '@/lib/ml';

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany();

        const totalIncome = transactions
            .filter((t) => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter((t) => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = totalIncome - totalExpense;

        // Prepare data for ML (Monthly Expenses)
        // Group expenses by Month-Year
        const expensesByMonth = transactions
            .filter((t) => t.type === 'EXPENSE')
            .reduce((acc, t) => {
                const month = t.date.toISOString().slice(0, 7); // YYYY-MM
                acc[month] = (acc[month] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        // Sort by month
        const sortedMonths = Object.keys(expensesByMonth).sort();
        const history = sortedMonths.map(month => ({
            month,
            total: expensesByMonth[month]
        }));

        const prediction = predictNextMonth(history);

        // Group by Category
        const categoryData: Record<string, number> = {};
        transactions
            .filter((t) => t.type === 'EXPENSE')
            .forEach((t) => {
                categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
            });

        // Format for charts
        const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
            name,
            value
        }));

        return NextResponse.json({
            totalIncome,
            totalExpense,
            balance,
            prediction,
            categoryChartData,
            history // For chart trends
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
