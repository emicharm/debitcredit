<script lang="ts">
	import { type Amount, type Account, formatAmount } from "$lib/model";
	import AmountInput from "../AmountInput.svelte";

    interface Props {
        account: Account;
        balance: Amount;
        edit: boolean;
    }

    let {
        account = $bindable(),
        balance = $bindable(),
        edit
    } : Props = $props()
</script>

<div class="flex flex-col justify-between items-stretch mb-3">
    <div class="flex items-center-safe">
        <h2 class="flex-1 text-md font-semibold">{account.name} {account.currency}</h2>
        <div class="font-semibold text-neutral-400 text-xl text-right">
            {#if edit}
                <AmountInput bind:amount={balance} styleClass="text-xl"/>
            {/if}
            {#if !edit}
                {formatAmount(balance)}
            {/if}

            {
                account.currency !== balance.currency
                ? balance.currency
                : ""
            }

        </div>
    </div>
    <p class="text-neutral-400 text-left text-sm">Balance</p>
</div>