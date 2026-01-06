'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addTransaction(formData: FormData) {
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const date = new Date(formData.get('date') as string);

    if (!amount || !description || !type || !category || !date) {
        return { error: 'Please fill in all fields' };
    }

    try {
        await prisma.transaction.create({
            data: {
                amount,
                description,
                type,
                category,
                date,
            },
        });

        revalidatePath('/');
        revalidatePath('/analytics');
        return { success: true };
    } catch (error) {
        return { error: 'Failed to add transaction' };
    }
}
