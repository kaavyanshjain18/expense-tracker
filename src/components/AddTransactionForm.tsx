"use client";

import { useRef } from 'react';
import { addTransaction } from '@/app/actions';
import { useFormStatus } from 'react-dom';
import styles from './AddTransactionForm.module.css';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button type="submit" className={styles.button} disabled={pending}>
            {pending ? 'Adding...' : 'Add Transaction'}
        </button>
    );
}

export default function AddTransactionForm() {
    const ref = useRef<HTMLFormElement>(null);

    const handleSubmit = async (formData: FormData) => {
        await addTransaction(formData);
        ref.current?.reset();
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Add New Transaction</h3>
            <form ref={ref} action={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>Description</label>
                    <input name="description" placeholder="e.g. Grocery" required className={styles.input} />
                </div>

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Amount</label>
                        <input name="amount" type="number" step="0.01" placeholder="0.00" required className={styles.input} />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Date</label>
                        <input name="date" type="date" required className={styles.input} defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Type</label>
                        <select name="type" className={styles.select}>
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Category</label>
                        <select name="category" className={styles.select}>
                            <option value="Food">Food</option>
                            <option value="Housing">Housing</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Health">Health</option>
                            <option value="Salary">Salary</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <SubmitButton />
            </form>
        </div>
    );
}
