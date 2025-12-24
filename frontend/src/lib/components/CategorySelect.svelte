<script lang="ts">
    import { categoryConfig } from '$lib/categoryConfig';

    let {
        value = $bindable(''),
    } = $props();

    let searchText = $state('');
    let showSuggestions = $state(false);
    let isInvalid = $state(false);
    let inputRef: HTMLInputElement;

    $effect(() => {
        if (value && categoryConfig[value]) {
            searchText = value;
            isInvalid = false;
        }
    });

    let filteredCategories = $derived(
        Object.keys(categoryConfig).filter(cat => 
            cat.toLowerCase().includes(searchText.toLowerCase())
        )
    );

    function handleInput() {
        showSuggestions = true;
        value = '';
        isInvalid = false;
    }

    function selectCategory(category: string) {
        value = category;
        searchText = category;
        showSuggestions = false;
        isInvalid = false;
    }

    function handleFocus() {
        showSuggestions = true;
    }

    function handleBlur() {
        // Delay to allow click on suggestion
        setTimeout(() => {
            showSuggestions = false;
            // Check if the current searchText matches a valid category
            if (searchText && !categoryConfig[searchText]) {
                isInvalid = true;
            }
        }, 200);
    }
</script>

<div class="relative">
    <div class={`flex items-center bg-neutral-900 rounded-lg `}>
        {#if value && categoryConfig[value]}
            <div class={`w-12 h-12 ${categoryConfig[value].color} rounded-full mr-4 flex items-center justify-center shrink-0`}>
                <svelte:component this={categoryConfig[value].icon} size={24} class="text-white" />
            </div>
        {/if}
        <input
            bind:this={inputRef}
            bind:value={searchText}
            oninput={handleInput}
            onfocus={handleFocus}
            onblur={handleBlur}
            placeholder="Select category..."
            class="flex-1 bg-transparent outline-none text-white {isInvalid ? 'border border-red-500' : 'border-none'} focus-within:border-blue-500 text-2xl font-bold px-0"
        />
    </div>

    {#if showSuggestions && filteredCategories.length > 0}
        <div class="absolute z-10 w-full mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {#each filteredCategories as category}
                <button
                    onclick={() => selectCategory(category)}
                    class="w-full flex items-center px-4 py-3 hover:bg-neutral-800 transition-colors text-left"
                >
                    <div class={`w-8 h-8 ${categoryConfig[category].color} rounded-full mr-3 flex items-center justify-center`}>
                        <svelte:component this={categoryConfig[category].icon} size={18} class="text-white" />
                    </div>
                    <span class="text-white">{category}</span>
                </button>
            {/each}
        </div>
    {/if}
    <div class="mb-6"></div>
</div>
