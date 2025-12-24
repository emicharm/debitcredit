<script lang="ts">
    import type {Amount, TransactionCell} from "$lib";
    import {formatAmount} from "$lib";
    import { goto } from '$app/navigation';
    import { selectedTransaction } from '$lib/stores';

    const displayBalance = false;
    const displayAccountName = true;

    



    let {
        cell,
    }: {
        cell: TransactionCell;
    } = $props();

    function handleClick() {
        selectedTransaction.set(cell);
        goto('/details');
    }

</script>
<div class="flex items-top mb-4 cursor-pointer hover:bg-neutral-800 hover:bg-opacity-20 rounded-lg p-2 -m-2 transition-colors" onclick={handleClick}>
    <div class={`w-8 h-8 ${cell.color == null || cell.color === "" ? "bg-neutral-800" : cell.color} rounded-full mr-4 flex items-center justify-center`}>
        {#if cell.icon}
            <svelte:component this={cell.icon} size={18} class="text-white" />
        {/if}
    </div>
    <div class="flex-1 gap-4">
        {#each cell.movements as movement, movement_idx}
            {#each movement.values as value, value_idx}
                <div>
                    <div class="flex text-sm text-justify">
                        <h3 class="flex-1">{value.description}</h3>
                        <p>{#if value.is_internal}<span class="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block mr-1.5"></span>{/if}
                            <span class={`${value.is_exchanged ? "text-md text-neutral-400": (
                                value.kind === "credit" ? "text-green-500" : ""
                            )}`}>
                            {value.kind === "debit" ? "-" : ""}{formatAmount(value.amount)}
                            {(value.amount.currency !== movement.account_balance.currency) || value.is_exchanged ?  " " +value.amount.currency : ""}
                            </span>
                        </p>
                    </div>
                    <div class="flex text-xs text-neutral-400">
                        <p class="flex-1">{movement_idx+1 == cell.movements.length && value_idx+1 == movement.values.length ? cell.category: ''}</p>
                        <p>{value_idx+1 == movement.values.length ?
                            `${displayAccountName ? movement.account_name: ''}${
                            displayBalance ?
                            ' ' + formatAmount(movement.account_balance, "'") +
                            ' ' + movement.account_balance.currency :
                            ''}`
                    
                    
                    :''}</p>
                    </div>
                </div>
            {/each}
        {/each}
    </div>
</div>