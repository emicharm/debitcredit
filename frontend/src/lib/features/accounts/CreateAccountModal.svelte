<script lang="ts">
    import { X } from 'lucide-svelte';
    import { createAccount } from './api';

    interface Props {
        show: boolean;
        onClose: () => void;
        onCreated?: () => void;
    }

    let { show = $bindable(), onClose, onCreated }: Props = $props();

    let name = $state('');
    let currency = $state('EUR');
    let creating = $state(false);

    async function handleSubmit(e: Event) {
        e.preventDefault();
        if (!name.trim()) return;

        creating = true;
        try {
            await createAccount(name.trim(), currency);
            name = '';
            currency = 'EUR';
            onCreated?.();
            onClose();
        } catch (error) {
            console.error('Failed to create account:', error);
        } finally {
            creating = false;
        }
    }

    function handleClose() {
        if (!creating) {
            name = '';
            currency = 'EUR';
            onClose();
        }
    }
</script>

{#if show}
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onclick={handleClose}>
        <div class="bg-neutral-800 rounded-lg max-w-md w-full" onclick={(e) => e.stopPropagation()}>
            <!-- Header -->
            <div class="flex items-center justify-between p-4 border-b border-neutral-700">
                <h2 class="text-xl font-semibold text-white">New Account</h2>
                <button
                    type="button"
                    onclick={handleClose}
                    disabled={creating}
                    class="p-1 hover:bg-neutral-700 rounded transition-colors"
                >
                    <X class="w-5 h-5 text-neutral-400" />
                </button>
            </div>

            <!-- Form -->
            <form onsubmit={handleSubmit} class="p-4 flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="account-name" class="text-sm text-neutral-400">Account Name</label>
                    <input
                        id="account-name"
                        type="text"
                        bind:value={name}
                        placeholder="e.g., Cash, Bank Account"
                        required
                        disabled={creating}
                        class="bg-neutral-700 text-white px-3 py-2 rounded border border-neutral-600 focus:border-blue-500 outline-none disabled:opacity-50"
                    />
                </div>

                <div class="flex flex-col gap-2">
                    <label for="account-currency" class="text-sm text-neutral-400">Currency</label>
                    <select
                        id="account-currency"
                        bind:value={currency}
                        disabled={creating}
                        class="bg-neutral-700 text-white px-3 py-2 rounded border border-neutral-600 focus:border-blue-500 outline-none disabled:opacity-50"
                    >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="RUB">RUB</option>
                        <option value="ARS">ARS</option>
                    </select>
                </div>

                <div class="flex gap-2 justify-end mt-2">
                    <button
                        type="button"
                        onclick={handleClose}
                        disabled={creating}
                        class="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={creating || !name.trim()}
                        class="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
                    >
                        {creating ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
