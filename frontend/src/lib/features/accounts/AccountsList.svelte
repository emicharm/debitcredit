<script lang="ts">
    import { formatAmount } from '$lib/model';
    import type { StoredAccount } from '$lib/model';
    import { ChevronRight } from 'lucide-svelte';

    interface Props {
        accounts: StoredAccount[];
        onAccountClick?: (account: StoredAccount) => void;
    }

    let { accounts, onAccountClick }: Props = $props();
</script>

<div class="flex flex-col gap-2">
    {#if accounts.length === 0}
        <div class="text-center py-8 text-neutral-400">
            <p>No accounts yet</p>
            <p class="text-sm mt-2">Add your first account to get started</p>
        </div>
    {:else}
        {#each accounts as account}
            <button
                type="button"
                onclick={() => onAccountClick?.(account)}
                class="bg-neutral-800 rounded-lg p-4 flex items-center justify-between hover:bg-neutral-700 transition-colors text-left"
            >
                <div class="flex flex-col gap-1">
                    <span class="text-white font-medium">{account.name}</span>
                    <span class="text-neutral-400 text-sm">{account.currency}</span>
                </div>
                <ChevronRight class="w-5 h-5 text-neutral-500" />
            </button>
        {/each}
    {/if}
</div>
