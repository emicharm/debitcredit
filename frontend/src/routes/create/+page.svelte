<script lang="ts">
    import { formatAmount, type Transaction, type MovementValue } from "$lib/model";
    import { goto } from '$app/navigation';
    import CategorySelect from '$lib/components/CategorySelect.svelte';
    import AmountInput from '$lib/components/AmountInput.svelte';
	import Transfer from '$lib/components/verbose/Transfer.svelte';
    import SlidePanel from '$lib/components/SlidePanel.svelte';
    import { createTransaction } from "$lib/database"
    import { ulid } from 'ulid';
    import { Plus, ArrowRight } from 'lucide-svelte';

    // Create a new empty transaction
    function createEmptyTransaction(): Transaction {
        return {
            id: ulid(),
            category: '',
            date: new Date().toISOString(),
            movements: [
                // {
                //     account: { name: '', currency: 'EUR' },
                //     account_balance: { value: 0, currency: 'EUR' },
                //     values: [
                //         {
                //             description: '',
                //             is_internal: false,
                //             is_calculated: false,
                //             amount: { value: 0, currency: 'EUR' },
                //             kind: 'debit'
                //         }
                //     ]
                // },
                // {
                //     account: { name: '', currency: 'EUR' },
                //     account_balance: { value: 0, currency: 'EUR' },
                //     values: [
                //         {
                //             description: '',
                //             is_internal: false,
                //             is_calculated: false,
                //             amount: { value: 0, currency: 'EUR' },
                //             kind: 'credit'
                //         }
                //     ]
                // }
            ]
        };
    }

    let transaction = $state(createEmptyTransaction());
    let selectedCategory = $state('');
    let isSubmitting = $state(false);
    let error = $state('');
    let showAddMenu = $state(false);

    function goBack() {
        goto('/transactions');
    }

    function addTransfer() {
        transaction.movements = [...transaction.movements, 
            {
                account: null,
                account_balance: null,
                values: [
                    // {
                    //     description: '',
                    //     is_internal: false,
                    //     is_calculated: false,
                    //     amount: { value: 0, currency: 'EUR' },
                    //     kind: 'debit'
                    // }
                ]
            },
            // {
            //     account: { name: '', currency: 'EUR' },
            //     account_balance: { value: 0, currency: 'EUR' },
            //     values: [
            //         {
            //             description: '',
            //             is_internal: false,
            //             is_calculated: false,
            //             amount: { value: 0, currency: 'EUR' },
            //             kind: 'credit'
            //         }
            //     ]
            // }
        ];
        showAddMenu = false;
    }

    async function handleSubmit() {
        isSubmitting = true;
        error = '';
        
        try {
            transaction.category = selectedCategory;
            transaction.id = ulid(); // Generate new ID for submission
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
    <!-- <button onclick={goBack} class="text-blue-500 mb-4">← Back</button> -->
    
    <h1 class="text-2xl font-bold mb-6">Create Transaction</h1>

    <CategorySelect bind:value={selectedCategory} />
        
    <div class="space-y-6">
        {#each transaction.movements as movement, movementIdx}
            <div class="bg-neutral-900 rounded-lg p-1">
                <Transfer bind:transfer={transaction.movements[movementIdx]} edit={true} />
            </div>
        {/each}
    </div>

    <!-- Add Button -->
    <button 
        type="button"
        onclick={() => showAddMenu = true}
        class="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-lg py-4 px-6 rounded-lg mt-6 transition-colors flex items-center justify-center gap-2"
    >
        <Plus class="w-5 h-5" />
        Add
    </button>
        
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
</div>

<SlidePanel 
    show={showAddMenu} 
    title="Add to Transaction"
    onClose={() => showAddMenu = false}
>
    <div class="flex flex-col py-2">
        <button
            type="button"
            onclick={addTransfer}
            class="w-full px-4 py-4 flex items-center justify-between hover:bg-neutral-800 transition-colors"
        >
            <span class="text-white font-medium">Transfer</span>
            <ArrowRight class="w-5 h-5 text-neutral-500" />
        </button>
    </div>
</SlidePanel>
