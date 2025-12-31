<script lang="ts">
    import type {Amount, Transaction} from "$lib/model";
    import {formatAmount} from "$lib/model";
    import { goto } from '$app/navigation';
    import { selectedTransaction } from '$lib/stores';

    const displayBalance = false;
    const displayAccountName = true;

    



    let {
        cell,
    }: {
        cell: Transaction;
    } = $props();

    function handleClick() {
        selectedTransaction.set(cell);
        goto('/details');
    }

    interface Row {
        description: string;
        isInternal: boolean;
        isExchanged: boolean;
        amountValue: string;
        amountValueStyle: string;
        categoryValue: string;
        balanceValue: string;
    }

    const rows = $derived(cell.movements.reduce((accMovements, movement, movement_idx) => {
        const movementData = movement.values.reduce((accValues, value, value_idx) => {
            let amountValue = ''

            // if (value.kind === "debit") {
            //     amountValue += '-'
            // }

            if  (value.amount.currency !== movement.account.currency) {
                amountValue +=  value.amount.currency + " "
            }
            amountValue += formatAmount(value.amount)



            let amountValueStyle = ''
            if (value.kind == "credit") {
                amountValueStyle = "text-green-500"
            }

            if (value.is_exchanged) {
                amountValueStyle = "text-md text-neutral-400"
            }

            let categoryValue = ""
            if (movement_idx+1 == cell.movements.length && value_idx+1 == movement.values.length) {
                categoryValue = cell.category
            }

            let balanceValue = ""
            if (value_idx+1 == movement.values.length) {
                balanceValue += movement.account.name

                if (displayBalance) {
                    balanceValue += ' ' + formatAmount(movement.account_balance, "'")
                }

                balanceValue += ' ' + movement.account_balance.currency
            }

            return [...accValues, {
                description: value.description,
                isInternal: value.is_internal,
                isExchanged: value.is_exchanged ?? false,
                amountValue: amountValue,
                amountValueStyle: amountValueStyle,
                categoryValue: categoryValue,
                balanceValue: balanceValue,
            }]
        }, [] as Array<Row>)

        return [...accMovements, ...movementData]
    }, [] as Array<Row>))

</script>
<button class="flex items-top mb-4 cursor-pointer hover:bg-neutral-800 hover:bg-opacity-20 rounded-lg p-2 -m-2 transition-colors" onclick={handleClick}>
    <div class={`w-8 h-8 ${cell.color == null || cell.color === "" ? "bg-neutral-800" : cell.color} rounded-full mr-4 flex items-center justify-center`}>
        {#if cell.icon}
            <svelte:component this={cell.icon} size={18} class="text-white" />
        {/if}
    </div>
    <div class="flex-1 gap-4">
        {#each rows as row}
            <div>
                <div class="flex text-sm text-justify">
                    <h3 class="flex-1">{row.description}</h3>
                    <p>
                        {#if row.isInternal}<span class="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block mr-1.5"></span>{/if}
                        {#if row.isExchanged}<span class="w-2.5 h-2.5 bg-purple-500 rounded-full inline-block mr-1.5"></span>{/if}
                        <span class={row.amountValueStyle}>{row.amountValue}</span>
                    </p>
                </div>
                <div class="flex text-xs text-neutral-400">
                    <p class="flex-1 text-left">{row.categoryValue}</p>
                    <p>{row.balanceValue}</p>
                </div>
            </div>
        {/each}
    </div>
</button>