<script lang="ts">
    import { db } from '$lib/v1/database/index';
    import type { UserTransaction, TransactionKind } from '$lib/v1/database/model';
    import { navigation } from '$lib/navigation.svelte';
	import { ulid } from 'ulid';
    import { liveQuery } from 'dexie';
    import AutocompleteInput from '$lib/components/AutocompleteInput.svelte';

    let date = $state(new Date().toISOString().split('T')[0]);
    let description = $state('');
    let amount = $state(0);
    let currency = $state('EUR');
    let account = $state('');
    let category = $state('');
    let kind = $state<TransactionKind>('debit');
    let isSubmitting = $state(false);

    // Get all transactions for suggestions
    const transactions = liveQuery(() =>
        db.transactions.toArray()
    );

    // Extract unique values for suggestions
    const suggestions = $derived.by(() => {
        if (!$transactions) return { descriptions: [], accounts: [], categories: [] };

        const descriptions = new Set<string>();
        const accounts = new Set<string>();
        const categories = new Set<string>();

        $transactions.forEach(t => {
            if (t.description) descriptions.add(t.description);
            if (t.account) accounts.add(t.account);
            if (t.category) categories.add(t.category);
        });

        return {
            descriptions: Array.from(descriptions).sort(),
            accounts: Array.from(accounts).sort(),
            categories: Array.from(categories).sort()
        };
    });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        isSubmitting = true;

        try {
            const transaction: UserTransaction = {
                id: ulid(),
                date: new Date(date),
                description,
                amount,
                currency,
                account,
                category,
                kind
            };

            await db.transactions.add(transaction);
            navigation.navigateTo('transactions');
        } catch (error) {
            console.error('Failed to create transaction:', error);
            alert('Failed to create transaction');
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="p-4">
    <h1 class="text-2xl font-bold mb-6">Create Transaction</h1>

    <form onsubmit={handleSubmit} class="space-y-4">
        <div class="flex flex-col gap-2">
            <label for="date" class="text-sm text-neutral-400">Date</label>
            <input
                id="date"
                type="date"
                bind:value={date}
                required
                class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="description" class="text-sm text-neutral-400">Description</label>
            <AutocompleteInput
                bind:value={description}
                suggestions={suggestions.descriptions}
                placeholder="Enter description"
                required={true}
                id="description"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="account" class="text-sm text-neutral-400">Account</label>
            <AutocompleteInput
                bind:value={account}
                suggestions={suggestions.accounts}
                placeholder="Enter account"
                required={true}
                id="account"
            />
        </div>

        <div class="flex gap-2">
            <div class="flex-1 flex flex-col gap-2">
                <label for="amount" class="text-sm text-neutral-400">Amount</label>
                <input
                    id="amount"
                    type="number"
                    step="0.01"
                    bind:value={amount}
                    required
                    class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
                />
            </div>

            <div class="flex flex-col gap-2">
                <label for="currency" class="text-sm text-neutral-400">Currency</label>
                <select
                    id="currency"
                    bind:value={currency}
                    class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
                >
                    <option value="EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option value="RUB">RUB</option>
                    <option value="ARS">ARS</option>
                </select>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <label for="category" class="text-sm text-neutral-400">Category</label>
            <AutocompleteInput
                bind:value={category}
                suggestions={suggestions.categories}
                placeholder="Enter category"
                required={true}
                id="category"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label class="text-sm text-neutral-400">Transaction Type</label>
            <div class="flex gap-2">
                <button
                    type="button"
                    onclick={() => kind = 'debit'}
                    class="flex-1 py-2 px-4 rounded-lg border transition-all"
                    class:bg-red-600={kind === 'debit'}
                    class:border-red-600={kind === 'debit'}
                    class:text-white={kind === 'debit'}
                    class:bg-neutral-800={kind !== 'debit'}
                    class:border-neutral-700={kind !== 'debit'}
                    class:text-neutral-400={kind !== 'debit'}
                >
                    Debit (-)
                </button>
                <button
                    type="button"
                    onclick={() => kind = 'credit'}
                    class="flex-1 py-2 px-4 rounded-lg border transition-all"
                    class:bg-green-600={kind === 'credit'}
                    class:border-green-600={kind === 'credit'}
                    class:text-white={kind === 'credit'}
                    class:bg-neutral-800={kind !== 'credit'}
                    class:border-neutral-700={kind !== 'credit'}
                    class:text-neutral-400={kind !== 'credit'}
                >
                    Credit (+)
                </button>
            </div>
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
        >
            {isSubmitting ? 'Creating...' : 'Create Transaction'}
        </button>
    </form>
</div>
