<script lang="ts">
    import { Receipt, Plus } from 'lucide-svelte';
    import { navigation, type View } from '$lib/navigation.svelte';

    // Import components for different views
    import TransactionsList from './v1/list/+page.svelte';
    import CreateTransaction from './v1/create/+page.svelte';

    // Navigation items
    const navItems = [
        { id: 'transactions', label: 'Transactions', icon: Receipt },
        { id: 'create', label: 'Create', icon: Plus },
    ] as const;
</script>

<!-- Main content area -->
<div class="min-h-screen pb-16">
    {#if navigation.currentView === 'transactions'}
        <TransactionsList />
    {:else if navigation.currentView === 'create'}
        <CreateTransaction />
    {/if}
</div>

<!-- Bottom Navigation Bar -->
<nav class="fixed bottom-0 left-0 right-0 bg-neutral-900 shadow-lg z-40">
    <div class="flex justify-around items-center h-16 max-w-5xl mx-auto px-4 pb-4">
        {#each navItems as item}
            {@const Icon = item.icon}
            <button
                onclick={() => navigation.navigateTo(item.id as View)}
                class="flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-lg transition-colors text-white"
                class:text-blue-400={navigation.currentView === item.id}
                class:opacity-60={navigation.currentView !== item.id}
            >
                <Icon size={24} class="mb-1" />
                <span class="text-xs font-medium">{item.label}</span>
            </button>
        {/each}
    </div>
</nav>