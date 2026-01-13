<script lang="ts">
    interface Props {
        value: string;
        label?: string;
        placeholder?: string;
        disabled?: boolean;
    }

    let {
        value = $bindable(),
        label = '',
        placeholder = '',
        disabled = false
    }: Props = $props();
</script>

<div class="flex flex-col gap-2">
    {#if label}
        <label class="text-sm text-neutral-400">{label}</label>
    {/if}
    <input
        type="text"
        bind:value={value}
        {placeholder}
        {disabled}
        class="bg-neutral-800 text-white px-3 py-2 rounded border border-neutral-700 focus:border-blue-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    />
</div>
