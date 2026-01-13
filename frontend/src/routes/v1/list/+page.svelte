<script lang="ts">
    import { db } from '$lib/v1/database/index';
    import { liveQuery } from 'dexie';

    const transactions = liveQuery(() => 
        db.transactions.toArray()
    );
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Transactions</h1>

    {#if $transactions}
        {#if $transactions.length === 0}
            <div class="text-center py-8 text-neutral-500">
                No transactions yet
            </div>
        {:else}
            <div class="space-y-2">
                {#each $transactions as transaction}
                    <div class="bg-neutral-800 rounded-lg p-4">
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h3 class="font-semibold">{transaction.description}</h3>
                                <p class="text-sm text-neutral-400">{transaction.account}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold">{transaction.amount.toFixed(2)} {transaction.currency}</p>
                                <p class="text-sm text-neutral-400">{transaction.category}</p>
                            </div>
                        </div>
                        <p class="text-xs text-neutral-500">
                            {new Date(transaction.date).toLocaleDateString()}
                        </p>
                    </div>
                {/each}
            </div>
        {/if}
    {:else}
        <div class="text-center py-8 text-neutral-500">
            Loading...
        </div>
    {/if}
</div>
