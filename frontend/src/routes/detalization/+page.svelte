<script lang="ts">
    import { detalizationData } from '$lib/stores';
    import { goto } from '$app/navigation';
    import { ArrowLeft, Plus, X } from 'lucide-svelte';
    import { formatAmount, type DetalizationEntry } from '$lib/model';

    let data = $state<DetalizationEntry[]>([]);
    let accountCurrency = $state('EUR');

    $effect(() => {
        const storeData = $detalizationData;
        if (storeData) {
            data = [...storeData.entries];
            accountCurrency = storeData.accountCurrency;
        }
    });

    function addEntry() {
        data = [...data, {
            name: '',
            amount: {
                value: 0,
                currency: accountCurrency
            }
        }];
    }

    function removeEntry(index: number) {
        data = data.filter((_, i) => i !== index);
    }

    function goBack() {
        // Save the data back to the store
        if ($detalizationData) {
            detalizationData.set({
                entries: data,
                accountCurrency
            });
        }
        goto(-1);
    }
</script>

<div class="min-h-screen bg-neutral-900 text-white pb-16">
    <!-- Header -->
    <div class="sticky top-0 bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center gap-3 z-10">
        <button
            type="button"
            onclick={goBack}
            class="p-2 hover:bg-neutral-800 rounded-full transition-colors"
        >
            <ArrowLeft class="w-5 h-5" />
        </button>
        <h1 class="text-xl font-semibold">Detalization</h1>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col gap-4">
        {#each data as entry, index}
            <div class="bg-neutral-800 rounded-lg p-4 flex flex-col gap-3">
                <!-- Name and Remove -->
                <div class="flex gap-2 items-center">
                    <input
                        bind:value={entry.name}
                        type="text"
                        placeholder="Entry name"
                        class="flex-1 bg-neutral-700 text-white px-3 py-2 rounded border border-neutral-600 focus:border-blue-500 outline-none"
                    />
                    <button
                        type="button"
                        onclick={() => removeEntry(index)}
                        class="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    >
                        <X class="w-5 h-5" />
                    </button>
                </div>

                <!-- Amount and Currency -->
                <div class="flex gap-2 items-center">
                    <input
                        bind:value={entry.amount.value}
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        class="flex-1 bg-neutral-700 text-white px-3 py-2 rounded border border-neutral-600 focus:border-blue-500 outline-none"
                    />
                    <select
                        bind:value={entry.amount.currency}
                        class="bg-neutral-700 text-white px-3 py-2 rounded border border-neutral-600 focus:border-blue-500 outline-none"
                    >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="RUB">RUB</option>
                        <option value="ARS">ARS</option>
                    </select>
                </div>
            </div>
        {/each}

        <!-- Add Button -->
        <button
            type="button"
            onclick={addEntry}
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
            <Plus class="w-5 h-5" />
            Add Entry
        </button>
    </div>
</div>
