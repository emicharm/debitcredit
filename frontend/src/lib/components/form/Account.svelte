<script lang="ts">
    import { formatAmount } from '$lib/model';
    import type { Amount, Account } from '$lib/model';

    import AmountInput from '../AmountInput.svelte';

    interface Props {
        account: Account;
        account_balance: Amount;
    }

    let { account, account_balance }: Props = $props();
</script>

<div class="flex justify-between items-stretch mb-3">
    <div class="flex-1">
        <h2 class="text-lg font-semibold">{account.name} {account.currency}</h2>
        <p class="text-neutral-400 text-left text-sm">Balance</p>
    </div>
    <div class="flex">

        <!-- <p class="text-neutral-400 text-right text-sm">Balance</p> -->
        <AmountInput 
                bind:amount={account_balance}
                kind="credit"
                colorClass="text-neutral-400"
            />
        <!-- <p class="text-lg font-semibold text-neutral-400">
            {formatAmount(account_balance)} {account.currency !== account_balance.currency ? account_balance.currency : ""}
        </p> -->
    </div>
</div>
