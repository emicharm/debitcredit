<script lang="ts">
    import { formatAmount } from "$lib";
    import { selectedTransaction } from '$lib/stores';
    import { goto } from '$app/navigation';
    import CategorySelect from '$lib/components/CategorySelect.svelte';
    import AmountInput from '$lib/components/AmountInput.svelte';

    let template = $state($selectedTransaction);

    let transaction = $state(JSON.parse(JSON.stringify(template)))

    let selectedCategory = $state(transaction?.category || '');

    function goBack() {
        goto('/transactions');
    }
</script>

<div class="mx-4 mt-4">
    <button onclick={goBack} class="text-blue-500 mb-4">← Back</button>
    
    <h1 class="text-2xl font-bold mb-6">Повторить операцию</h1>

    {#if transaction}
        <!-- <div class="bg-neutral-900 rounded-lg p-4 mb-4">
            <p class="text-sm text-neutral-400 mb-2">Template from:</p>
            <p class="text-lg font-semibold">{transaction.category}</p>
        </div> -->

        <div class="mb-6">
            <CategorySelect bind:value={selectedCategory} />
        </div>

        <div class="space-y-6">
            {#each transaction.movements as movement, movementIdx}
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
                                            <span class="text-xs bg-neutral-700 text-white px-2 py-0.5 rounded">
                                                {value.kind === 'debit' ? 'Debit' : 'Credit'}
                                            </span>
                                            <button 
                                                onclick={() => value.is_internal = !value.is_internal}
                                                class={`text-xs px-2 py-0.5 rounded cursor-pointer transition-colors ${value.is_internal ? 'bg-blue-500 text-white' : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'}`}
                                            >
                                                Internal
                                            </button>
                                            <button 
                                                onclick={() => value.is_exchanged = !value.is_exchanged}
                                                class={`text-xs px-2 py-0.5 rounded cursor-pointer transition-colors ${value.is_exchanged ? 'bg-purple-500 text-white' : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'}`}
                                            >
                                                Exchanged
                                            </button>
                                        </div>
                                    </div>
                                    <div class="text-right flex">
                                        <AmountInput 
                                            bind:amount={value.amount}
                                            colorClass={value.is_exchanged ? "text-neutral-400" : 
                                                value.kind === "credit" ? "text-green-500" : "text-white"}
                                        />
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
        
        <p class="text-neutral-400">Transaction creation form coming soon...</p>
        <p class="text-sm text-neutral-500 mt-2">Selected: {selectedCategory || 'None'}</p>
    {:else}
        <p class="text-neutral-400">No template selected</p>
    {/if}
</div>
