import { prisma } from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import { PieChart, ListFilter } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
    const transactions = await prisma.transaction.findMany({
        orderBy: { date: 'desc' },
    });

    const categoryData: Record<string, number> = {};
    transactions.filter((t: any) => t.type === 'EXPENSE').forEach((t: any) => {
        categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
    });

    const sortedCategories = Object.entries(categoryData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

    const totalExpense = transactions
        .filter((t: any) => t.type === 'EXPENSE')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

    return { sortedCategories, totalExpense };
}

export default async function Analytics() {
    const { sortedCategories, totalExpense } = await getData();

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <Navbar />
            <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--foreground)' }}>Analytics</h1>

                <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '2rem' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--foreground)' }}>
                        <ListFilter className="w-5 h-5" /> Category Breakdown
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {sortedCategories.length === 0 ? (
                            <p style={{ color: 'var(--muted-foreground)' }}>No expense data available.</p>
                        ) : (
                            sortedCategories.map((cat) => {
                                const percentage = ((cat.value / totalExpense) * 100).toFixed(1);
                                return (
                                    <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{cat.name}</span>
                                                <span style={{ color: 'var(--muted-foreground)' }}>{percentage}% (${cat.value.toFixed(2)})</span>
                                            </div>
                                            <div style={{ height: '8px', background: 'var(--secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
