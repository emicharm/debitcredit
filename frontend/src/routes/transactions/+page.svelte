<script lang="ts">
    import DateHeader from "../../lib/components/DateHeader.svelte"
    import TransactionRow from "../../lib/components/TransactionRow.svelte"

    import type {Transaction} from "$lib/model";
    import { categoryConfig } from "$lib/categoryConfig";
    import {liveQuery} from "dexie"
    import {db} from "$lib/database"
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    // Reactive query that automatically updates when database changes
    let transactions = $state<Transaction[]>([]);
    let loading = $state(true);

    // Load transactions from database, sorted by date (newest first) - only in browser
    onMount(() => {
        if (browser) {
            const subscription = liveQuery(async () => {
                return await db.transactions.toArray();
            }).subscribe({
                next: (txs) => {
                    if (txs) {
                        // Sort by date descending (newest first)
                        transactions = txs.sort((a, b) => {
                            return new Date(b.date).getTime() - new Date(a.date).getTime();
                        });
                        loading = false;
                    }
                },
                error: (err) => {
                    console.error('Failed to load transactions:', err);
                    loading = false;
                }
            });

            return () => subscription.unsubscribe();
        } else {
            loading = false;
        }
    });

    // Group transactions by date
    let groupedTxs = $derived(transactions.reduce((acc, tx) => {
        const date = tx.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(tx);
        return acc;
    }, {} as Record<string, Transaction[]>));

    // Get sorted dates (newest first)
    let sortedDates = $derived(Object.keys(groupedTxs).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        // Handle invalid dates by putting them at the top
        if (isNaN(dateA.getTime())) return -1;
        if (isNaN(dateB.getTime())) return 1;
        return dateB.getTime() - dateA.getTime();
    }));
</script>
<div class="mx-4 flex flex-col">

    {#if loading}
        <div class="text-center py-8 text-neutral-400">Loading...</div>
    {:else if transactions.length === 0}
        <p class="text-center py-8 text-neutral-500">No transactions yet</p>
    {:else}
        {#each sortedDates as date}
            <DateHeader date={new Date(date)} amounts={[]} />
            
            {#each groupedTxs[date] as tx}
                <TransactionRow cell={{...tx, 
                    color: categoryConfig[tx.category]?.color ?? tx.color,
                    icon: categoryConfig[tx.category]?.icon ?? tx.icon
                }} />
            {/each}
        {/each}
    {/if}

</div>