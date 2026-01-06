interface MonthlyData {
    month: string; // "2024-01"
    total: number;
}

export function predictNextMonth(history: MonthlyData[]): number {
    if (!history || history.length === 0) return 0;
    if (history.length === 1) return history[0].total;

    // Calculate Average
    const sumTotal = history.reduce((sum, item) => sum + item.total, 0);
    const average = sumTotal / history.length;

    // Simple Linear Regression
    // x: time (0, 1, 2...), y: amount
    const n = history.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    history.forEach((data, index) => {
        const x = index;
        const y = data.total;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Predict for next month (x = n)
    const nextX = n;
    let prediction = slope * nextX + intercept;

    // Use average if regression gives non-sensical negative result (due to sparse/declining data)
    if (prediction <= 0) {
        return average;
    }

    return prediction;
}
