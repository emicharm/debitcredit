<script lang="ts">
    import { db } from '$lib/v1/database/index';
    import { liveQuery } from 'dexie';

    const transactions = liveQuery(() => 
        db.transactions.reverse().toArray()
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
                    {@const kind = transaction.kind || 'debit'}
                    <div class="bg-neutral-800 rounded-lg p-4 border-l-4"
                         class:border-red-500={kind === 'debit'}
                         class:border-green-500={kind === 'credit'}>
                        <div class="flex justify-between items-start mb-2">
                            <div>
                                <h3 class="font-semibold">{transaction.description}</h3>
                                <p class="text-sm text-neutral-400">{transaction.account}</p>
                            </div>
                            <div class="text-right">
                                <p class="font-semibold"
                                   class:text-red-400={kind === 'debit'}
                                   class:text-green-400={kind === 'credit'}>
                                    {kind === 'debit' ? '-' : '+'}{transaction.amount.toFixed(2)} {transaction.currency}
                                </p>
                                <p class="text-sm text-neutral-400">{transaction.category}</p>
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <p class="text-xs text-neutral-500">
                                {new Date(transaction.date).toLocaleDateString()}
                            </p>
                            <span class="text-xs px-2 py-1 rounded-full"
                                  class:bg-red-600={kind === 'debit'}
                                  class:bg-green-600={kind === 'credit'}
                                  class:text-white={kind}>
                                {kind === 'debit' ? 'Debit' : kind === 'credit' ? 'Credit' : 'Debit'}
                            </span>
                        </div>
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
