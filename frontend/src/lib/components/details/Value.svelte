<script lang="ts">
    import { formatAmount } from '$lib/model';
    import type { Amount, Account } from '$lib/model';
	import { format } from 'date-fns';
	import { de } from 'date-fns/locale';

    interface Props {
        description: string;
        kind: 'debit' | 'credit';
        is_internal?: boolean;
        is_exchanged?: boolean;
        amount: Amount;
        account: Account;
    }

    let { description, kind, is_internal = false, is_exchanged = false, amount, account }: Props = $props();

    let displayAmount = $derived.by(() => {
        let amountValue = kind === "debit" ? "-": "+"
        amountValue += formatAmount(amount)
        if (account.currency !== amount.currency) {
            amountValue += " " + amount.currency
        }
        return amountValue
    })
</script>

<div class="border-t border-neutral-800 pt-3">
    <div class="flex justify-between items-stretch mb-1">
        <div class="flex-1">
            <p class="font-medium">{description}</p>
            <div class="flex gap-2 mt-1">
                <span class="text-xs bg-neutral-700 text-white px-2 py-0.5 rounded">
                    {kind === 'debit' ? 'Debit' : 'Credit'}
                </span>
                {#if is_internal}
                    <span class="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">Internal</span>
                {/if}
                {#if is_exchanged}
                    <span class="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">Exchanged</span>
                {/if}
            </div>
        </div>
        <div class="text-right flex items-center">
            <p class={`text-lg font-semibold ${
                is_exchanged ? "text-neutral-400" : 
                kind === "credit" ? "text-green-500" : "text-white"
            }`}>
                {displayAmount}
            </p>
        </div>
    </div>
</div>
