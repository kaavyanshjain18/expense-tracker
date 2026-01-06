import { Transaction } from '@prisma/client';
import styles from './RecentTransactions.module.css';

export default function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Recent Transactions</h3>
            <div className={styles.list}>
                {transactions.length === 0 ? (
                    <p style={{ color: 'var(--muted-foreground)' }}>No transactions found.</p>
                ) : (
                    transactions.map((t) => (
                        <div key={t.id} className={styles.item}>
                            <div className={styles.info}>
                                <span className={styles.description}>{t.description}</span>
                                <span className={styles.date}>{new Date(t.date).toLocaleDateString()}</span>
                            </div>
                            <div className={`${styles.amount} ${t.type === 'INCOME' ? styles.income : styles.expense}`}>
                                {t.type === 'INCOME' ? '+' : '-'}${t.amount.toFixed(2)}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
