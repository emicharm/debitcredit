<script lang="ts">
    import { ChevronDown } from 'lucide-svelte';

    interface Props {
        value: string;
        suggestions: string[];
        placeholder?: string;
        required?: boolean;
        id?: string;
        class?: string;
    }

    let {
        value = $bindable(),
        suggestions = [],
        placeholder = '',
        required = false,
        id = '',
        class: className = ''
    }: Props = $props();

    let showSuggestions = $state(false);
    let filteredSuggestions = $state<string[]>([]);
    let selectedIndex = $state(-1);
    let inputElement: HTMLInputElement;

    // Filter suggestions based on input
    $effect(() => {
        if (value && value.length > 0) {
            filteredSuggestions = suggestions
                .filter(s => s.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5); // Limit to 5 suggestions
        } else {
            filteredSuggestions = suggestions.slice(0, 5);
        }
    });

    function handleInput() {
        showSuggestions = true;
        selectedIndex = -1;
    }

    function selectSuggestion(suggestion: string) {
        value = suggestion;
        showSuggestions = false;
        selectedIndex = -1;
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (!showSuggestions || filteredSuggestions.length === 0) return;

        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, filteredSuggestions.length - 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                break;
            case 'Enter':
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    selectSuggestion(filteredSuggestions[selectedIndex]);
                }
                break;
            case 'Escape':
                showSuggestions = false;
                selectedIndex = -1;
                break;
        }
    }

    function handleBlur() {
        // Delay to allow click on suggestion
        setTimeout(() => {
            showSuggestions = false;
            selectedIndex = -1;
        }, 200);
    }

    function toggleSuggestions() {
        showSuggestions = !showSuggestions;
        if (showSuggestions) {
            inputElement?.focus();
        }
    }
</script>

<div class="relative">
    <div class="relative">
        <input
            bind:this={inputElement}
            bind:value={value}
            oninput={handleInput}
            onkeydown={handleKeyDown}
            onblur={handleBlur}
            onfocus={handleInput}
            {id}
            {placeholder}
            {required}
            type="text"
            class="bg-neutral-800 text-white px-3 py-2 pr-8 rounded border border-neutral-700 focus:border-blue-500 outline-none w-full {className}"
        />
        {#if suggestions.length > 0}
            <button
                type="button"
                onclick={toggleSuggestions}
                class="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
            >
                <div class="transition-transform" class:rotate-180={showSuggestions}>
                    <ChevronDown size={16} />
                </div>
            </button>
        {/if}
    </div>

    {#if showSuggestions && filteredSuggestions.length > 0}
        <div class="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg overflow-hidden">
            {#each filteredSuggestions as suggestion, index}
                <button
                    type="button"
                    onclick={() => selectSuggestion(suggestion)}
                    class="w-full text-left px-3 py-2 hover:bg-neutral-700 transition-colors text-white text-sm"
                    class:bg-neutral-700={index === selectedIndex}
                >
                    {suggestion}
                </button>
            {/each}
        </div>
    {/if}
</div>