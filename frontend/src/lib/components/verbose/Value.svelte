<script lang="ts">
    import {formatAmount, type Account, type MovementValue, type DetalizationEntry} from '$lib/model'
    import AmountInput from '../AmountInput.svelte';
    import { detalizationData } from '$lib/stores';
    import { goto } from '$app/navigation';

    interface Props {
        value: MovementValue;
        account: Account;
        edit: boolean;
    }

    let {
        value = $bindable(),
        account,
        edit
    } : Props = $props()

    function toggleKind() {
        if (edit) {
            value.kind = value.kind === 'debit' ? 'credit' : 'debit';
        }
    }

    function toggleInternal() {
        if (edit) {
            value.is_internal = !value.is_internal
        }
    }

    function toggleExchange() {
        if (edit) {
            value.exchanged = !value.exchanged
        }
    }

    function toggleCalculated() {
        if (edit) {
            value.is_calculated = !value.is_calculated
        }
    }

    function toggleBalance() {
        if (edit) {
            value.has_balance = !value.has_balance
            if (value.has_balance && !value.balance_after) {
                value.balance_after = {
                    value: 0,
                    currency: account.currency
                }
            }
        }
    }

    function toggleDetalization() {
        if (edit) {
            if (!value.detalization) {
                value.detalization = []
            }
            detalizationData.set({
                entries: value.detalization,
                accountCurrency: account.currency
            })
            goto('/detalization')
        }
    }

    function addDetalizationEntry() {
        if (edit && value.detalization) {
            value.detalization = [...value.detalization, {
                name: '',
                amount: {
                    value: 0,
                    currency: account.currency
                }
            }]
        }
    }

    function removeDetalizationEntry(index: number) {
        if (edit && value.detalization) {
            value.detalization = value.detalization.filter((_, i) => i !== index)
        }
    }

    $effect(() => {
        if (value.exchanged && !value.amount_exchanged) {
            value.amount_exchanged = {
                value: 0,
                currency: account.currency
            }
        }
    })

    $effect(() => {
        if (value.has_balance && !value.balance_after) {
            value.balance_after = {
                value: 0,
                currency: account.currency
            }
        }
    })

    $effect(() => {
        if (value.has_detalization && !value.detalization) {
            value.detalization = []
        }
    })

    // Watch for changes from the detalization page
    $effect(() => {
        const storeData = $detalizationData;
        if (storeData && value.detalization) {
            value.detalization = storeData.entries;
        }
    })

</script>
<div class="border-t border-neutral-800 pt-3">
    <div class="flex flex-col gap-3">
        <!-- Description -->
        <div class="flex flex-col gap-1">
            {#if edit}
                <input
                    bind:value={value.description}
                    type="text"
                    placeholder="Description"
                    class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
                />
            {:else}
                <p class="font-medium text-md">{value.description}</p>
            {/if}
        </div>

        <!-- Main Amount -->
        <div class="flex flex-col gap-1">
            <span class="text-sm text-neutral-400">Amount</span>
            {#if edit}
                <div class="flex gap-2 items-center">
                    <input
                        bind:value={value.amount.value}
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        class="flex-1 bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
                    />
                    <select
                        bind:value={value.amount.currency}
                        class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
                    >
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                        <option value="RUB">RUB</option>
                        <option value="ARS">ARS</option>
                    </select>
                </div>
            {:else}
                <div class={`text-xl font-semibold ${
                    value.kind === "credit" ? "text-green-500" : "text-white"
                }`}>
                    {account.currency !== value.amount.currency ? value.amount.currency : ""}
                    {formatAmount(value.amount)}
                </div>
            {/if}
        </div>

        <!-- Exchanged Amount -->
        <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
                <input
                    type="checkbox"
                    bind:checked={value.exchanged}
                    disabled={!edit}
                    class="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span class="text-sm text-neutral-400">Exchanged Amount</span>
            </div>
            {#if value.exchanged && value.amount_exchanged != null}
                {#if edit}
                    <div class="flex gap-2 items-center">
                        <input
                            bind:value={value.amount_exchanged.value}
                            type="number"
                            step="0.01"
                            placeholder="Exchanged Amount"
                            class="flex-1 bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
                        />
                        <select
                            bind:value={value.amount_exchanged.currency}
                            class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
                        >
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="RUB">RUB</option>
                            <option value="ARS">ARS</option>
                        </select>
                    </div>
                {:else}
                    <div class="text-xl font-semibold text-neutral-400">
                        {account.currency !== value.amount_exchanged.currency ? value.amount_exchanged.currency : ""}
                        {formatAmount(value.amount_exchanged)}
                    </div>
                {/if}
            {/if}
        </div>

        <!-- Balance After -->
        <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
                <input
                    type="checkbox"
                    bind:checked={value.has_balance}
                    disabled={!edit}
                    class="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span class="text-sm text-neutral-400">Balance After</span>
            </div>
            {#if value.has_balance && value.balance_after != null}
                {#if edit}
                    <div class="flex gap-2 items-center">
                        <input
                            bind:value={value.balance_after.value}
                            type="number"
                            step="0.01"
                            placeholder="Balance After"
                            class="flex-1 bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
                        />
                        <select
                            bind:value={value.balance_after.currency}
                            class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none"
                        >
                            <option value="EUR">EUR</option>
                            <option value="USD">USD</option>
                            <option value="RUB">RUB</option>
                            <option value="ARS">ARS</option>
                        </select>
                    </div>
                {:else}
                    <div class="text-xl font-semibold text-neutral-400">
                        {account.currency !== value.balance_after.currency ? value.balance_after.currency : ""}
                        {formatAmount(value.balance_after)}
                    </div>
                {/if}
            {/if}
        </div>

        <!-- Detalization -->
        <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
                <input
                    type="checkbox"
                    bind:checked={value.has_detalization}
                    disabled={!edit}
                    class="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                />
                <button
                    type="button"
                    onclick={toggleDetalization}
                    disabled={!edit}
                    class="text-sm text-neutral-400 hover:text-neutral-200 text-left"
                >
                    Detalization {value.detalization && value.detalization.length > 0 ? `(${value.detalization.length})` : ''}
                </button>
            </div>
            {#if !edit && value.has_detalization && value.detalization && value.detalization.length > 0}
                <div class="flex flex-col gap-1 pl-6">
                    {#each value.detalization as entry}
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-neutral-300">{entry.name}</span>
                            <span class="text-neutral-400">
                                {account.currency !== entry.amount.currency ? entry.amount.currency : ""}
                                {formatAmount(entry.amount)}
                            </span>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-2 flex-wrap">
            <button 
                type="button"
                class="text-md bg-neutral-700 text-white px-2 py-0.5 rounded {edit ? 'cursor-pointer hover:bg-neutral-600' : ''}"
                disabled={!edit}
                onclick={toggleKind}
            >
                {value.kind === 'debit' ? 'Debit' : 'Credit'}
            </button>
            <button 
                type="button"
                class="text-md {value.is_internal ? 'bg-blue-500' : 'bg-neutral-700'} text-white px-2 py-0.5 rounded {edit ? 'cursor-pointer hover:bg-neutral-600': ''}"
                disabled={!edit}
                onclick={toggleInternal}
            >Internal</button>
            <button 
                type="button"
                class="text-md {value.exchanged ? 'bg-purple-500' : 'bg-neutral-700'} text-white px-2 py-0.5 rounded {edit ? 'cursor-pointer hover:bg-neutral-600': ''}"
                disabled={!edit}
                onclick={toggleExchange}
            >Exchange</button>
            <button
                type="button"
                class="text-md {value.is_calculated ? 'bg-amber-500' : 'bg-neutral-700'} text-white px-2 py-0.5 rounded {edit ? 'cursor-pointer hover:bg-neutral-600': ''}"
                disabled={!edit}
                onclick={toggleCalculated}
            >Calculated</button>
        </div>
    </div>
</div>