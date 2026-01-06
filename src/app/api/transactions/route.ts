import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { date: 'desc' },
            take: 50, // Limit for better performance
        });
        return NextResponse.json(transactions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, description, date, type, category } = body;

        const transaction = await prisma.transaction.create({
            data: {
                amount: parseFloat(amount),
                description,
                date: new Date(date),
                type,
                category,
            },
        });

        return NextResponse.json(transaction);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }
}
