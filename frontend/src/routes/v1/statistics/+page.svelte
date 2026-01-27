<script lang="ts">
    import { db } from '$lib/v1/database/index';
    import { liveQuery } from 'dexie';
    import { TrendingUp, TrendingDown, DollarSign, Tag } from 'lucide-svelte';
    import type { UserTransaction } from '$lib/v1/database/model';

    interface CurrencyAmount {
        debit: number;
        credit: number;
        balance: number;
    }

    interface CategoryStats {
        currencies: Record<string, number>; // amount per currency
        transactionCount: number;
        totalSpent: number; // for percentage calculation (converted to base currency)
    }

    interface MonthlyStats {
        month: string;
        year: number;
        categories: Record<string, CategoryStats>;
        currencies: Record<string, CurrencyAmount>;
        transactionCount: number;
    }

    interface TotalStats {
        currencies: Record<string, CurrencyAmount>;
        transactionCount: number;
    }

    const transactions = liveQuery(() =>
        db.transactions.toArray()
    );

    // Calculate monthly statistics with categories and multiple currencies
    const monthlyStats = $derived.by(() => {
        if (!$transactions) return [];

        const stats = new Map<string, MonthlyStats>();

        $transactions.forEach((transaction) => {
            const date = new Date(transaction.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('en-US', { month: 'long' });
            const year = date.getFullYear();
            const currency = transaction.currency || 'EUR';
            const category = transaction.category || 'Uncategorized';
            const kind = transaction.kind || 'debit';

            if (!stats.has(monthKey)) {
                stats.set(monthKey, {
                    month: monthName,
                    year: year,
                    categories: {},
                    currencies: {},
                    transactionCount: 0
                });
            }

            const monthStat = stats.get(monthKey)!;
            monthStat.transactionCount++;

            // Initialize currency if not exists
            if (!monthStat.currencies[currency]) {
                monthStat.currencies[currency] = { debit: 0, credit: 0, balance: 0 };
            }

            // Initialize category if not exists
            if (!monthStat.categories[category]) {
                monthStat.categories[category] = {
                    currencies: {},
                    transactionCount: 0,
                    totalSpent: 0
                };
            }

            // Update currency totals
            if (kind === 'debit') {
                monthStat.currencies[currency].debit += transaction.amount;
                monthStat.currencies[currency].balance -= transaction.amount;

                // Update category totals (only track expenses/debits in categories)
                if (!monthStat.categories[category].currencies[currency]) {
                    monthStat.categories[category].currencies[currency] = 0;
                }
                monthStat.categories[category].currencies[currency] += transaction.amount;
                monthStat.categories[category].transactionCount++;
                monthStat.categories[category].totalSpent += transaction.amount;
            } else {
                monthStat.currencies[currency].credit += transaction.amount;
                monthStat.currencies[currency].balance += transaction.amount;
            }
        });

        // Sort by year and month (newest first)
        return Array.from(stats.entries())
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([_, stat]) => stat);
    });

    // Calculate totals by currency
    const totals = $derived.by(() => {
        const result: TotalStats = {
            currencies: {},
            transactionCount: 0
        };

        monthlyStats.forEach(stat => {
            result.transactionCount += stat.transactionCount;

            Object.entries(stat.currencies).forEach(([currency, amounts]) => {
                if (!result.currencies[currency]) {
                    result.currencies[currency] = { debit: 0, credit: 0, balance: 0 };
                }
                result.currencies[currency].debit += amounts.debit;
                result.currencies[currency].credit += amounts.credit;
                result.currencies[currency].balance += amounts.balance;
            });
        });

        return result;
    });

    // Format currency display with proper symbol
    function formatCurrency(amount: number, currency: string): string {
        const symbols: Record<string, string> = {
            'EUR': '€',
            'USD': '$',
            'RUB': '₽',
            'ARS': '$'
        };
        const symbol = symbols[currency] || currency;
        return `${amount.toFixed(2)} ${symbol}`;
    }

    // Format multiple currencies for category display
    function formatCategoryCurrencies(currencies: Record<string, number>): string {
        return Object.entries(currencies)
            .filter(([_, amount]) => amount > 0)
            .map(([currency, amount]) => {
                const symbol = currency === 'ARS' ? 'ARS' : currency;
                return `${amount.toFixed(0)} ${symbol}`;
            })
            .join(' • ');
    }

    // Calculate percentage for a category
    function calculateCategoryPercentage(category: CategoryStats, monthStat: MonthlyStats): number {
        const totalMonthlySpent = Object.values(monthStat.categories)
            .reduce((sum, cat) => sum + cat.totalSpent, 0);

        if (totalMonthlySpent === 0) return 0;
        return (category.totalSpent / totalMonthlySpent) * 100;
    }
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Monthly Statistics</h1>

    {#if $transactions}
        {#if $transactions.length === 0}
            <div class="text-center py-8 text-neutral-500">
                No transactions to analyze
            </div>
        {:else}
            <!-- Overall Summary -->
            <div class="bg-neutral-800 rounded-lg p-4 mb-6">
                <h2 class="text-lg font-semibold mb-4">Overall Summary</h2>

                {#each Object.entries(totals.currencies) as [currency, amounts]}
                    <div class="mb-4">
                        <h3 class="text-sm font-medium text-neutral-400 mb-2">{currency}</h3>
                        <div class="grid grid-cols-3 gap-2">
                            <div class="bg-neutral-900 rounded-lg p-2">
                                <div class="flex items-center gap-1 text-green-400 mb-1">
                                    <TrendingUp size={14} />
                                    <span class="text-xs">Income</span>
                                </div>
                                <p class="text-sm font-bold">+{formatCurrency(amounts.credit, currency)}</p>
                            </div>
                            <div class="bg-neutral-900 rounded-lg p-2">
                                <div class="flex items-center gap-1 text-red-400 mb-1">
                                    <TrendingDown size={14} />
                                    <span class="text-xs">Expenses</span>
                                </div>
                                <p class="text-sm font-bold">-{formatCurrency(amounts.debit, currency)}</p>
                            </div>
                            <div class="bg-neutral-900 rounded-lg p-2">
                                <div class="flex items-center gap-1 text-blue-400 mb-1">
                                    <DollarSign size={14} />
                                    <span class="text-xs">Balance</span>
                                </div>
                                <p class="text-sm font-bold"
                                   class:text-green-400={amounts.balance >= 0}
                                   class:text-red-400={amounts.balance < 0}>
                                    {amounts.balance >= 0 ? '+' : ''}{formatCurrency(amounts.balance, currency)}
                                </p>
                            </div>
                        </div>
                    </div>
                {/each}

                <div class="text-xs text-neutral-500 mt-3">
                    Total transactions: {totals.transactionCount}
                </div>
            </div>

            <!-- Monthly Breakdown by Categories -->
            <h2 class="text-lg font-semibold mb-4">Monthly Breakdown by Category</h2>
            <div class="space-y-3">
                {#each monthlyStats as stat}
                    <div class="bg-neutral-800 rounded-lg p-4">
                        <div class="mb-4">
                            <h3 class="font-semibold">{stat.month} {stat.year}</h3>
                            <p class="text-xs text-neutral-400">{stat.transactionCount} transactions</p>
                        </div>

                        <!-- Category breakdown -->
                        <div class="space-y-2">
                            {#each Object.entries(stat.categories).sort((a, b) => b[1].totalSpent - a[1].totalSpent) as [categoryName, categoryData]}
                                {@const percentage = calculateCategoryPercentage(categoryData, stat)}
                                {#if Object.keys(categoryData.currencies).length > 0}
                                    <div class="bg-neutral-900 rounded-lg p-3">
                                        <div class="flex justify-between items-start mb-1">
                                            <div class="flex items-center gap-2">
                                                <Tag size={14} class="text-neutral-500" />
                                                <span class="text-sm font-medium">{categoryName}</span>
                                                <span class="text-xs text-neutral-500">({percentage.toFixed(1)}%)</span>
                                            </div>
                                        </div>
                                        <div class="text-sm text-neutral-300 font-mono">
                                            {formatCategoryCurrencies(categoryData.currencies)}
                                        </div>
                                        <!-- Visual percentage bar -->
                                        <div class="mt-2 bg-neutral-800 rounded-full h-2 overflow-hidden">
                                            <div class="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all"
                                                 style="width: {percentage}%">
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            {/each}
                        </div>

                        <!-- Monthly totals per currency -->
                        <div class="mt-4 pt-3 border-t border-neutral-700">
                            <div class="text-xs text-neutral-400 mb-2">Monthly totals:</div>
                            <div class="flex flex-wrap gap-3">
                                {#each Object.entries(stat.currencies) as [currency, amounts]}
                                    <div class="text-sm">
                                        <span class="text-neutral-500">{currency}:</span>
                                        <span class="font-medium"
                                              class:text-green-400={amounts.balance >= 0}
                                              class:text-red-400={amounts.balance < 0}>
                                            {amounts.balance >= 0 ? '+' : ''}{formatCurrency(amounts.balance, currency)}
                                        </span>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {:else}
        <div class="text-center py-8 text-neutral-500">
            Loading statistics...
        </div>
    {/if}
</div>