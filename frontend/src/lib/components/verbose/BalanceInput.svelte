<script lang="ts">
    import type { Amount } from '$lib/model';

    interface Props {
        balance: Amount | null;
        disabled?: boolean;
        disabledCurrency?: boolean;
    }

    let {
        balance = $bindable(),
        disabled = false,
        disabledCurrency = false
    }: Props = $props();

    // Initialize balance if null
    if (!balance) {
        balance = { value: 0, currency: 'EUR' };
    }
</script>

<div class="flex flex-col gap-2">
    <label class="text-sm text-neutral-400">Balance</label>
    <div class="flex gap-2">
        <input
            type="number"
            step="0.01"
            bind:value={balance.value}
            {disabled}
            placeholder="0.00"
            class="flex-1 bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <select
            bind:value={balance.currency}
            disabled={disabledCurrency || disabled}
            class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="RUB">RUB</option>
            <option value="ARS">ARS</option>
        </select>
    </div>
</div>
