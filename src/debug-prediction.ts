import { PrismaClient } from '@prisma/client';
import { predictNextMonth } from './lib/ml';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Debugging Prediction Logic ---');

    const transactions = await prisma.transaction.findMany();
    console.log(`Total Transactions: ${transactions.length}`);

    const expenses = transactions.filter(t => t.type === 'EXPENSE');
    console.log(`Total Expenses: ${expenses.length}`);

    if (expenses.length === 0) {
        console.log('No expenses found. Prediction should be 0.');
        return;
    }

    const expensesByMonth: Record<string, number> = {};
    expenses.forEach((t) => {
        const month = t.date.toISOString().slice(0, 7);
        expensesByMonth[month] = (expensesByMonth[month] || 0) + t.amount;
    });

    const chartData = Object.entries(expensesByMonth)
        .map(([month, total]) => ({ month, total }))
        .sort((a, b) => a.month.localeCompare(b.month));

    console.log('Monthly Expenses History:', chartData);

    const prediction = predictNextMonth(chartData);
    console.log(`Prediction Result: ${prediction}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
