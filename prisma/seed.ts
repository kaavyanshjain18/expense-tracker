import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding initial data...');
    // Optional: Add some dummy data if needed, but for now we leave it clean.
    // Actually, let's add 2 dummy transactions so the UI isn't empty.
    await prisma.transaction.createMany({
        data: [
            {
                description: 'Salary',
                amount: 5000,
                type: 'INCOME',
                category: 'Salary',
                date: new Date('2024-01-01'),
            },
            {
                description: 'Rent',
                amount: 1200,
                type: 'EXPENSE',
                category: 'Housing',
                date: new Date('2024-01-05'),
            },
            {
                description: 'Groceries',
                amount: 300,
                type: 'EXPENSE',
                category: 'Food',
                date: new Date('2024-01-10'),
            }
        ]
    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    });
