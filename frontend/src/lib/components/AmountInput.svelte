<script lang="ts">
    import { formatAmount } from "$lib";
    import type { Amount } from "$lib";

    let {
        amount = $bindable(),
        colorClass = "text-white",
    }: {
        amount: Amount;
        colorClass?: string;
    } = $props();

    let inputRef: HTMLInputElement;
    let displayValue = $state(formatAmount(amount));

    // Update displayValue when amount changes externally
    $effect(() => {
        if (!inputRef || document.activeElement !== inputRef) {
            displayValue = formatAmount(amount);
        }
    });

    function handleFocus() {
        displayValue = String(amount.value);
    }

    function handleBlur() {
        const numValue = parseFloat(displayValue);
        if (!isNaN(numValue)) {
            amount.value = numValue;
        }
        displayValue = formatAmount(amount);
    }
</script>

<input
    bind:this={inputRef}
    bind:value={displayValue}
    onfocus={handleFocus}
    onblur={handleBlur}
    type="text"
    class={`text-lg font-bold text-right bg-transparent border-none outline-none ${colorClass} w-full max-w-full px-0 h-auto leading-none py-0`}
/>
