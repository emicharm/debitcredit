<script lang="ts">
    import { formatAmount } from "$lib/model";
    import type { Amount, MovementKind } from "$lib/model";

    let {
        amount = $bindable(),
        styleClass = "",
    }: {
        amount: Amount;
        styleClass: string;
    } = $props();

    let inputRef: HTMLInputElement;
    let displayValue = $state(formatAmount(amount));
    let inputWidth = $state('auto');

    // Calculate width based on content
    $effect(() => {
        if (inputRef) {
            // Create a temporary span to measure text width
            const span = document.createElement('span');
            span.style.visibility = 'hidden';
            span.style.position = 'absolute';
            span.style.whiteSpace = 'pre';
            span.className = inputRef.className;
            span.textContent = displayValue || '0';
            document.body.appendChild(span);
            const width = span.offsetWidth;
            document.body.removeChild(span);
            inputWidth = `${Math.max(width + 4, 20)}px`;
        }
    });

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
        // Replace comma with period for parsing
        const normalizedValue = displayValue.replace(/,/g, '.');
        const numValue = Math.abs(parseFloat(normalizedValue));
        if (!isNaN(numValue)) {
            amount.value = numValue;
        } else {
            // Set to zero if empty or invalid
            amount.value = 0;
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
    inputmode="decimal"
    style="width: {inputWidth}; min-height: 1em; max-height: 1em; -webkit-text-size-adjust: 100%; vertical-align: center;"
    class={`text-right bg-transparent outline-none px-0 h-[1em] leading-[1em] py-0 box-content overflow-hidden border-0 border-b border-gray-600 ${styleClass}`}/>