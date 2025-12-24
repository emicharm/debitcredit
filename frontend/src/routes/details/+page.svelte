<script lang="ts">
    import { selectedTransaction } from '$lib/stores';
    import { formatAmount } from '$lib';
    import { goto } from '$app/navigation';

    let cell = $state($selectedTransaction);

    function goBack() {
        goto('/transactions');
    }

    function handleRepeat() {
        goto('/create');
    }
</script>

<div class="mx-4 mt-4">
    <button onclick={goBack} class="text-blue-500 mb-4">← Back</button>
    <h1 class="text-2xl font-bold mb-6">Детализация</h1>

    {#if cell}
        <div class="mb-6">
            
            <div class="flex items-center mb-6">
                <div class={`w-12 h-12 ${cell.color || "bg-neutral-800"} rounded-full mr-4 flex items-center justify-center`}>
                    {#if cell.icon}
                        <svelte:component this={cell.icon} size={24} class="text-white" />
                    {/if}
                </div>
                <div>
                    <h1 class="text-2xl font-bold">{cell.category}</h1>
                </div>
            </div>

            <div class="space-y-6">
                {#each cell.movements as movement, movementIdx}
                    <div class="bg-neutral-900 rounded-lg p-4">
                        <div class="flex justify-between items-center mb-3">
                            <h2 class="text-lg font-semibold">{movement.account_name}</h2>
                            <p class="text-neutral-400">
                                Balance: {formatAmount(movement.account_balance)} {movement.account_balance.currency}
                            </p>
                        </div>

                        <div class="space-y-3">
                            {#each movement.values as value}
                                <div class="border-t border-neutral-800 pt-3">
                                    <div class="flex justify-between items-stretch mb-1">
                                        <div class="flex-1">
                                            <p class="font-medium">{value.description || 'No description'}</p>
                                            <div class="flex gap-2 mt-1">
                                                {#if value.is_internal}
                                                    <span class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">Internal</span>
                                                {/if}
                                                {#if value.is_exchanged}
                                                    <span class="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">Exchanged</span>
                                                {/if}
                                                <span class="text-xs bg-neutral-700 text-white px-2 py-0.5 rounded">
                                                    {value.kind === 'debit' ? 'Debit' : 'Credit'}
                                                </span>
                                            </div>
                                        </div>
                                        <div class="text-right flex items-center">
                                            <p class={`text-lg font-bold ${
                                                value.is_exchanged ? "text-neutral-400" : 
                                                value.kind === "credit" ? "text-green-500" : "text-white"
                                            }`}>
                                                {value.kind === "debit" ? "-" : "+"}{formatAmount(value.amount)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>

            <button 
                onclick={handleRepeat}
                class="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 px-6 rounded-lg mt-6 transition-colors"
            >
                Repeat
            </button>
        </div>
    {:else}
        <div class="text-center mt-8">
            <p class="text-neutral-400 mb-4">No transaction selected</p>
            <button onclick={goBack} class="text-blue-500">Go to Transactions</button>
        </div>
    {/if}
</div>
