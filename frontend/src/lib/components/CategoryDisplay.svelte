<script lang="ts">
    import type { Icon } from "lucide-svelte";

    interface Props {
        category: string;
        color?: string;
        icon?: typeof Icon;
    }

    let { category, color = "bg-neutral-800", icon }: Props = $props();
</script>

<div class="flex items-center mb-6">
    <div class={`w-12 h-12 ${color} rounded-full mr-4 flex items-center justify-center`}>
        {#if icon}
            <svelte:component this={icon} size={24} class="text-white" />
        {/if}
    </div>
    <div>
        <h1 class="text-2xl font-bold">{category}</h1>
    </div>
</div>
