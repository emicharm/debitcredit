<script lang="ts">
    import { db } from '$lib/v1/database/index';
    import type { UserTransaction } from '$lib/v1/database/model';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
	import { ulid } from 'ulid';

    let date = $state(new Date().toISOString().split('T')[0]);
    let description = $state('');
    let amount = $state(0);
    let currency = $state('EUR');
    let account = $state('');
    let category = $state('');
    let isSubmitting = $state(false);

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
                category
            };

            await db.transactions.add(transaction);
            goto(`${base}/v1/list`);
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
            <input
                id="description"
                type="text"
                bind:value={description}
                placeholder="Enter description"
                required
                class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="account" class="text-sm text-neutral-400">Account</label>
            <input
                id="account"
                type="text"
                bind:value={account}
                placeholder="Enter account"
                required
                class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
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
            <input
                id="category"
                type="text"
                bind:value={category}
                placeholder="Enter category"
                required
                class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
            />
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
