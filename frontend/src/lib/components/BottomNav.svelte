<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Receipt, Plus, CreditCard, BarChart3, Menu, X } from 'lucide-svelte';
	
	let showMenu = $state(false);
	let lastSelectedMenuItem = $state<typeof menuItems[0] | null>(null);
	
	const mainNavItems = [
		{ path: '/transactions', label: 'Transactions', icon: Receipt },
		{ path: '/create', label: 'Create', icon: Plus },
	];
	
	const menuItems = [
		{ path: '/accounts', label: 'Accounts', icon: CreditCard },
		{ path: '/details', label: 'Details', icon: BarChart3 },
	];
	
	let activeMenuItem = $derived(menuItems.find(item => $page.url.pathname === item.path));
	let displayMenuItem = $derived(activeMenuItem || lastSelectedMenuItem);
	let moreButtonIcon = $derived(showMenu ? X : (displayMenuItem?.icon || Menu));
	let moreButtonLabel = $derived(displayMenuItem?.label || 'More');
	
	function toggleMenu(event: MouseEvent) {
		event.stopPropagation();
		
		// If we have a last selected menu item and we're not currently on it, navigate to it
		if (lastSelectedMenuItem && $page.url.pathname !== lastSelectedMenuItem.path) {
			goto(lastSelectedMenuItem.path);
			return;
		}
		
		// Otherwise, toggle the menu
		showMenu = !showMenu;
	}
	
	function handleMenuItemClick(path: string) {
		const clickedItem = menuItems.find(item => item.path === path);
		if (clickedItem) {
			lastSelectedMenuItem = clickedItem;
		}
		showMenu = false;
		goto(path);
	}
	
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (showMenu && !target.closest('.menu-popup') && !target.closest('.menu-button')) {
			showMenu = false;
		}
	}
	
	$effect(() => {
		if (showMenu) {
			// Delay adding the listener to avoid catching the same click that opened the menu
			const timeout = setTimeout(() => {
				document.addEventListener('click', handleClickOutside);
			}, 0);
			return () => {
				clearTimeout(timeout);
				document.removeEventListener('click', handleClickOutside);
			};
		}
	});
</script>

<!-- Menu Popup -->
{#if showMenu}
	<div class="menu-popup fixed bottom-20 right-4 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 p-2 min-w-[160px] z-50">
		{#each menuItems as item}
			<button
				onclick={() => handleMenuItemClick(item.path)}
				class="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-neutral-700 transition-colors text-left text-white"
				class:bg-neutral-700={$page.url.pathname === item.path}
			>
				<svelte:component this={item.icon} size={20} />
				<span class="font-medium">{item.label}</span>
			</button>
		{/each}
	</div>
{/if}

<!-- Bottom Navigation Bar -->
<nav class="fixed bottom-0 left-0 right-0 bg-neutral-900 shadow-lg z-40" style="touch-action: manipulation;">
	<div class="flex justify-around items-center h-16 max-w-screen-lg mx-auto px-4">
		{#each mainNavItems as item}
			<a
				href={item.path}
				class="flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-lg transition-colors text-white"
				class:text-blue-400={$page.url.pathname === item.path}
				class:opacity-60={$page.url.pathname !== item.path}
			>
				<svelte:component this={item.icon} size={24} class="mb-1" />
				<span class="text-xs font-medium">{item.label}</span>
			</a>
		{/each}
		
		<button
			onclick={(e) => toggleMenu(e)}
			class="menu-button flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-lg transition-colors text-white"
			class:text-blue-400={showMenu || activeMenuItem}
			class:opacity-60={!showMenu && !activeMenuItem}
		>
			<svelte:component this={moreButtonIcon} size={24} class="mb-1" />
			<span class="text-xs font-medium">{moreButtonLabel}</span>
		</button>
	</div>
</nav>

<style>
	.menu-popup {
		animation: slideUp 0.2s ease-out;
	}
	
	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
