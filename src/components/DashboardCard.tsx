import { LucideIcon } from 'lucide-react';
import styles from './DashboardCard.module.css';

interface DashboardCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export default function DashboardCard({ title, value, icon: Icon, subtext, trend }: DashboardCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                <Icon className={styles.icon} />
            </div>
            <div className={styles.content}>
                <div className={styles.value}>{value}</div>
                {subtext && <p className={styles.subtext}>{subtext}</p>}
            </div>
        </div>
    );
}
