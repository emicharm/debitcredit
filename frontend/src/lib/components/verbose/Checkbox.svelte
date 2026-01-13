<script lang="ts">
    interface Props {
        name: string;
        checked: boolean;
    }    

    let {
        name,
        checked = $bindable()
    }: Props = $props()
</script>

<div class="flex items-center gap-2">
    <input
        type="checkbox"
        bind:checked={checked}
        class="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
        />
        <span class="text-sm text-neutral-400">{name}</span>

</div>