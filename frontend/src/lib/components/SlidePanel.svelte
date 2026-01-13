<script lang="ts">
    import { fly, fade } from 'svelte/transition';
    import { ArrowLeft } from 'lucide-svelte';

    interface Props {
        show: boolean;
        title?: string;
        onClose: () => void;
        showBackButton?: boolean;
        fullHeight?: boolean;
    }

    let { 
        show = false,
        title,
        onClose,
        showBackButton = false,
        fullHeight = false
    }: Props = $props();
</script>

{#if show}
    <!-- Backdrop -->
    <div 
        class="fixed inset-0 bg-black/20 z-20" 
        in:fade={{ duration: 300 }} 
        out:fade={{ duration: 300 }}
        onclick={onClose}
    ></div>

    <!-- Sheet -->
    <div 
        class="fixed inset-x-0 bottom-0 bg-neutral-900 text-white rounded-t-3xl shadow-2xl z-30 flex flex-col pb-16 {fullHeight ? 'top-16' : ''}" 
        in:fly={{ y: '100%', duration: 300 }} 
        out:fly={{ y: '100%', duration: 300 }}
    >
        {#if title || showBackButton}
            <!-- Header -->
            <div class="px-4 py-3 flex items-center gap-3 border-b border-neutral-800">
                {#if title}
                    <h2 class="text-lg font-semibold">{title}</h2>
                {/if}
            </div>
        {/if}

        <!-- Content -->
        <div class="flex-1 overflow-y-auto">
            <slot />
        </div>
    </div>
{/if}
