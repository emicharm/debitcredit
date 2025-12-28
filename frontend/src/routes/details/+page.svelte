<script lang="ts">
    import { selectedTransaction } from '$lib/stores';
    import { formatAmount } from '$lib/model';
    import { goto } from '$app/navigation';
    import CategoryDisplay from '$lib/components/CategoryDisplay.svelte';
    import ValueDisplay from '$lib/components/details/Value.svelte';
	import Account from '$lib/components/verbose/Account.svelte';

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
            
            <CategoryDisplay category={cell.category} color={cell.color} icon={cell.icon} />

            <div class="space-y-6">
                {#each cell.movements as movement, movementIdx}
                    <div class="bg-neutral-900 rounded-lg p-4">
                        <!-- <AccountDisplay account={movement.account} account_balance={movement.account_balance} /> -->
                        <Account bind:account={movement.account} bind:balance={movement.account_balance} edit={false} />

                        <div class="space-y-3">
                            {#each movement.values as value}
                                <ValueDisplay 
                                    description={value.description}
                                    kind={value.kind}
                                    is_internal={value.is_internal}
                                    is_exchanged={value.is_exchanged}
                                    amount={value.amount}
                                    account={movement.account}
                                />
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
