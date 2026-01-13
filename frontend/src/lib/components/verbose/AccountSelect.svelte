<script lang="ts">
    import { accountsQuery } from '$lib/database/accounts';
    import type { Account } from '$lib/model';

    interface Props {
        account: Account | null;
    }

    let {
        account = $bindable()
    }: Props = $props();

    const accounts = accountsQuery;
</script>

<div class="flex flex-col gap-2">
    <label for="account-select" class="text-sm text-neutral-400">Account</label>
    <select
        id="account-select"
        onchange={(e) => {
            const target = e.currentTarget;
            const selectedId = target.value;
            if (selectedId && $accounts) {
                const selected = $accounts.find(acc => acc.id === selectedId);
                if (selected) {
                    account = { name: selected.name, currency: selected.currency };
                }
            } else {
                account = null;
            }
        }}
        value={account && $accounts ? $accounts.find(acc => account != null && acc.name === account.name && acc.currency === account.currency)?.id : ''}
        class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
    >
        <option value="">Select an account</option>
        {#if $accounts}
            {#each $accounts as acc}
                <option value={acc.id}>{acc.name} ({acc.currency})</option>
            {/each}
        {/if}
    </select>
</div>
