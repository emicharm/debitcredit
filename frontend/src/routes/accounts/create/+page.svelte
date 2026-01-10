<script lang="ts">
    import { goto } from '$app/navigation';
    import { ArrowLeft } from 'lucide-svelte';
    import { createAccount } from '$lib/features/accounts';
    import { fly, fade } from 'svelte/transition';

    let name = $state('');
    let currency = $state('EUR');
    let creating = $state(false);

    async function handleSubmit(e: Event) {
        e.preventDefault();
        if (!name.trim()) return;

        creating = true;
        try {
            await createAccount(name.trim(), currency);
            goto('/accounts');
        } catch (error) {
            console.error('Failed to create account:', error);
        } finally {
            creating = false;
        }
    }
</script>

<!-- Backdrop -->
<div 
    class="fixed inset-0 bg-black/100 z-20" 
    in:fade={{ duration: 300 }} 
    out:fade={{ duration: 300 }}
    onclick={() => !creating && goto('/accounts')}
></div>

<!-- Sheet -->
<div 
    class="fixed inset-x-0 bottom-0 top-16 bg-neutral-900 text-white rounded-t-3xl shadow-2xl z-30 flex flex-col" 
    in:fly={{ y: '100%', duration: 300 }} 
    out:fly={{ y: '100%', duration: 300 }}
>
    <!-- Header -->
    <div class="px-4 py-3 flex items-center gap-3 border-b border-neutral-800">
        <button
            type="button"
            onclick={() => goto('/accounts')}
            disabled={creating}
            class="p-2 hover:bg-neutral-800 rounded-full transition-colors disabled:opacity-50"
        >
            <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-xl font-semibold">New Account</h1>
    </div>

    <!-- Form -->
    <form onsubmit={handleSubmit} class="p-4 flex flex-col gap-4 flex-1 overflow-y-auto">
        <div class="flex flex-col gap-2">
            <label for="account-name" class="text-sm text-neutral-400">Account Name</label>
            <input
                id="account-name"
                type="text"
                bind:value={name}
                placeholder="e.g., Cash, Bank Account"
                required
                disabled={creating}
                autofocus
                class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none disabled:opacity-50"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="account-currency" class="text-sm text-neutral-400">Currency</label>
            <select
                id="account-currency"
                bind:value={currency}
                disabled={creating}
                class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none disabled:opacity-50"
            >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="RUB">RUB</option>
                <option value="ARS">ARS</option>
            </select>
        </div>

        <button
            type="submit"
            disabled={creating || !name.trim()}
            class="mt-4 w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {creating ? 'Creating...' : 'Create Account'}
        </button>
    </form>
</div>
