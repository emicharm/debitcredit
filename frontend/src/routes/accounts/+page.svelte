<script lang="ts">
    import { AccountsList, accountsQuery, createAccount } from '$lib/features/accounts';
    import { updateAccountAsNew, archiveAccount } from '$lib/database/accounts';
    import { Plus, ArrowLeft, Trash2 } from 'lucide-svelte';
    import { fly, fade } from 'svelte/transition';
    import type { StoredAccount } from '$lib/model';

    let accounts = $state<StoredAccount[]>([]);
    let showCreateSheet = $state(false);
    let name = $state('');
    let currency = $state('EUR');
    let creating = $state(false);
    let editingAccount = $state<StoredAccount | null>(null);

    $effect(() => {
        const subscription = accountsQuery.subscribe(value => {
            if (value) {
                accounts = value;
            }
        });

        return () => subscription.unsubscribe();
    });

    function handleAccountClick(account: StoredAccount) {
        editingAccount = account;
        name = account.name;
        currency = account.currency;
        showCreateSheet = true;
    }

    function openCreateSheet() {
        editingAccount = null;
        name = '';
        currency = 'EUR';
        showCreateSheet = true;
    }

    async function handleSubmit(e: Event) {
        e.preventDefault();
        if (!name.trim() || creating) return;

        creating = true;
        try {
            if (editingAccount) {
                await updateAccountAsNew(editingAccount.id, name.trim(), currency);
            } else {
                await createAccount(name.trim(), currency);
            }
            // Reset state immediately after successful save
            showCreateSheet = false;
            editingAccount = null;
            name = '';
            currency = 'EUR';
        } catch (error) {
            console.error('Failed to save account:', error);
        } finally {
            creating = false;
        }
    }

    function closeSheet() {
        if (!creating) {
            showCreateSheet = false;
            editingAccount = null;
            name = '';
            currency = 'EUR';
        }
    }

    async function handleDelete() {
        if (!editingAccount || creating) return;

        creating = true;
        try {
            await archiveAccount(editingAccount.id, '');
            // Reset state after successful delete
            showCreateSheet = false;
            editingAccount = null;
            name = '';
            currency = 'EUR';
        } catch (error) {
            console.error('Failed to delete account:', error);
        } finally {
            creating = false;
        }
    }
</script>

<div class="min-h-screen bg-neutral-900 text-white pb-16 relative">
    <!-- Header -->
    <div class="sticky top-0 bg-neutral-900 border-neutral-800 px-4 py-4 flex items-center justify-between z-10">
        <h1 class="text-2xl font-bold">Accounts</h1>
        <button
            type="button"
            onclick={openCreateSheet}
            class="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
        >
            <Plus class="w-6 h-6" />
        </button>
    </div>

    <!-- Content -->
    <div class="p-4">
        <AccountsList {accounts} onAccountClick={handleAccountClick} />
    </div>
</div>

{#if showCreateSheet}
    <!-- Backdrop -->
    <div 
        class="fixed inset-0 bg-black/20 z-20" 
        in:fade={{ duration: 300 }} 
        out:fade={{ duration: 300 }}
        onclick={closeSheet}
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
                onclick={closeSheet}
                disabled={creating}
                class="p-2 hover:bg-neutral-800 rounded-full transition-colors disabled:opacity-50"
            >
                <ArrowLeft class="w-5 h-5" />
            </button>
            <h1 class="text-xl font-semibold">{editingAccount ? 'Edit Account' : 'New Account'}</h1>
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

            <div class="flex gap-2 mt-4">
                {#if editingAccount}
                    <button
                        type="button"
                        onclick={handleDelete}
                        disabled={creating}
                        class="px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
                    >
                        <Trash2 class="w-5 h-5" />
                        Delete
                    </button>
                {/if}
                <button
                    type="submit"
                    disabled={creating || !name.trim()}
                    class="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {creating ? 'Saving...' : (editingAccount ? 'Save Changes' : 'Create Account')}
                </button>
            </div>
        </form>
    </div>
{/if}