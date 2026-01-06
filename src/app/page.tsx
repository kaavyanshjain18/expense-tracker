import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import DashboardCard from '@/components/DashboardCard';
import ExpenseChart from '@/components/ExpenseChart';
import RecentTransactions from '@/components/RecentTransactions';
import AddTransactionForm from '@/components/AddTransactionForm';
// import { calculateTrend } from '@/lib/ml'; // Removed invalid import
import { predictNextMonth } from '@/lib/ml';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const transactions = await prisma.transaction.findMany({
        orderBy: { date: 'desc' },
    });

    const totalIncome = transactions
        .filter((t: any) => t.type === 'INCOME')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter((t: any) => t.type === 'EXPENSE')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    // Chart Data: Group by Month (YYYY-MM)
    const expensesByMonth: Record<string, number> = {};
    transactions
        .filter((t: any) => t.type === 'EXPENSE')
        .forEach((t: any) => {
            const month = t.date.toISOString().slice(0, 7);
            expensesByMonth[month] = (expensesByMonth[month] || 0) + t.amount;
        });

    const chartData = Object.entries(expensesByMonth)
        .map(([month, total]) => ({ month, total }))
        .sort((a, b) => a.month.localeCompare(b.month));

    // Prediction Data
    const predictionHistory = chartData.map(d => ({ month: d.month, total: d.total }));
    const nextMonthPrediction = predictNextMonth(predictionHistory);

    return {
        transactions: transactions.slice(0, 5), // Top 5 recent
        totalIncome,
        totalExpense,
        balance,
        chartData,
        nextMonthPrediction,
    };
}

export default async function Home() {
    const data = await getData();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--foreground)' }}>Dashboard</h1>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <DashboardCard title="Total Balance" value={`$${data.balance.toFixed(2)}`} icon={Wallet} />
                    <DashboardCard title="Total Income" value={`$${data.totalIncome.toFixed(2)}`} icon={TrendingUp} trend="up" />
                    <DashboardCard title="Total Expenses" value={`$${data.totalExpense.toFixed(2)}`} icon={TrendingDown} trend="down" />
                    <DashboardCard
                        title="Next Month Prediction"
                        value={`$${data.nextMonthPrediction.toFixed(2)}`}
                        icon={PiggyBank}
                        subtext="AI Estimated Expense"
                    />
                </div>

                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <ExpenseChart data={data.chartData} />
                        <RecentTransactions transactions={data.transactions} />
                    </div>
                    <div>
                        <AddTransactionForm />
                    </div>
                </div>
            </main>
        </div>
    );
}
