<script lang="ts">
    import { formatAmount } from "$lib/model";
    import { selectedTransaction } from '$lib/stores';
    import { goto } from '$app/navigation';
    import CategorySelect from '$lib/components/CategorySelect.svelte';
    import AmountInput from '$lib/components/AmountInput.svelte';
	import Value from '$lib/components/verbose/Value.svelte';

    import { createTransaction } from "$lib/database"
	import Account from "$lib/components/verbose/Account.svelte";

    let template = $state($selectedTransaction);

    let transaction = $state(JSON.parse(JSON.stringify(template)))

    let selectedCategory = $state(transaction?.category || '');
    let isSubmitting = $state(false);
    let error = $state('');

    function goBack() {
        goto('/transactions');
    }

    async function handleSubmit() {
        if (!transaction) return;
        
        isSubmitting = true;
        error = '';
        
        try {
            transaction.category = selectedCategory;
            await createTransaction(transaction);
            goto('/transactions');
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to create transaction';
            console.error('Failed to create transaction:', err);
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="mx-4 mt-4">
    <button onclick={goBack} class="text-blue-500 mb-4">← Back</button>
    
    <h1 class="text-2xl font-bold mb-6">Повторить операцию</h1>

    {#if transaction}
        <CategorySelect bind:value={selectedCategory} />
        

        <div class="space-y-6">
            {#each transaction.movements as movement, movementIdx}
                <div class="bg-neutral-900 rounded-lg p-4">
                    <Account bind:account={movement.account} bind:balance={movement.account_balance} edit={true} />
                    <div class="space-y-3">
                        {#each movement.values as value, valueIdx}
                            <Value
                                bind:value={movement.values[valueIdx]}
                                account={movement.account}
                                edit={true}
                            />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
        
        {#if error}
            <div class="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mt-6">
                {error}
            </div>
        {/if}

        <button 
            onclick={handleSubmit}
            disabled={isSubmitting || !selectedCategory}
            class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-6 rounded-lg mt-6 transition-colors"
        >
            {isSubmitting ? 'Creating...' : 'Create Transaction'}
        </button>
    {:else}
        <p class="text-neutral-400">No template selected</p>
    {/if}
</div>
