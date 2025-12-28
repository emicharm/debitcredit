<script lang="ts">
    import AmountInput from '../AmountInput.svelte';
    import type { Amount } from '$lib/model';

    interface Props {
        value: {
            description: string;
            kind: 'debit' | 'credit';
            is_internal?: boolean;
            is_exchanged?: boolean;
            amount: Amount;
        };
    }

    let { value }: Props = $props();
</script>

<div class="border-t border-neutral-800 pt-3">
    <div class="flex justify-between items-stretch mb-1">
        <div class="flex-1">
            <p class="font-medium">{value.description || 'No description'}</p>
            <div class="flex gap-2 mt-1">
                <span class="text-xs bg-neutral-700 text-white px-2 py-0.5 rounded">
                    {value.kind === 'debit' ? 'Debit' : 'Credit'}
                </span>
                <button 
                    onclick={() => value.is_internal = !value.is_internal}
                    class={`text-xs px-2 py-0.5 rounded cursor-pointer transition-colors ${value.is_internal ? 'bg-blue-500 text-white' : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'}`}
                >
                    Internal
                </button>
                <button 
                    onclick={() => value.is_exchanged = !value.is_exchanged}
                    class={`text-xs px-2 py-0.5 rounded cursor-pointer transition-colors ${value.is_exchanged ? 'bg-purple-500 text-white' : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'}`}
                >
                    Exchanged
                </button>
            </div>
        </div>
        <div class="text-right flex">
            <AmountInput 
                bind:amount={value.amount}
                kind={value.kind}
                colorClass={value.is_exchanged ? "text-neutral-400" : 
                    value.kind === "credit" ? "text-green-500" : "text-white"}
            />
        </div>
    </div>
</div>
