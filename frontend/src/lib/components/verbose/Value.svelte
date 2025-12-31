<script lang="ts">
    import {formatAmount, type Account, type MovementValue} from '$lib/model'
    import AmountInput from '../AmountInput.svelte';

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


</script>
<div class="border-t border-neutral-800 pt-3">
    <div class="flex flex-col justify-between items-stretch mb-1">
        <div class="flex items-center mb-2">
            <p class="flex-1 font-medium text-md">{value.description}</p>
            <p class={`text-xl font-semibold ${
                value.kind === "credit" ? "text-green-500" : "text-white"
            }`}>
                {
                    account.currency !== value.amount.currency
                    ? value.amount.currency
                    : ""
                }
                {#if edit}
                    <AmountInput bind:amount={value.amount} styleClass="text-xl" />
                {/if}
                {#if !edit}
                    {formatAmount(value.amount)}
                {/if}
            </p>
        </div>
        <div class="flex items-center">
            <p class="flex-1 font-medium text-md mb-2">
              
            </p>
            {#if value.exchanged && value.amount_exchanged != null}
            <p class="text-xl font-semibold text-neutral-400">
                {account.currency !== value.amount_exchanged.currency
                ? value.amount_exchanged.currency
                : ""}
                {#if edit}
                    <AmountInput bind:amount={value.amount_exchanged} styleClass="text-xl" />
                {/if}
                {#if !edit}
                    {formatAmount(value.amount_exchanged)}
                {/if}

            </p>
            {/if}
        </div>
        <div>
            <div class="flex gap-2 mt-1 flex-wrap">
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
</div>