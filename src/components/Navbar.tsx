"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, LayoutDashboard, PieChart } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>
                <Wallet className="w-6 h-6 text-primary" color="var(--primary)" />
                <span>ExpenseTracker</span>
            </div>
            <div className={styles.links}>
                <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>
                    Dashboard
                </Link>
                <Link href="/analytics" className={`${styles.link} ${pathname === '/analytics' ? styles.active : ''}`}>
                    Analytics
                </Link>
            </div>
        </nav>
    );
}
