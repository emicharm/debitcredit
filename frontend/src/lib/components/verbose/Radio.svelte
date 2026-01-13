<script lang="ts">
    interface Option {
        label: string;
        value: string
    }
    interface Props {
        name: string;
        option: string;
        options: Option[];
    }

    let {
        name,
        option = $bindable(),
        options
    }: Props = $props();



</script>

<div class="flex flex-col gap-2">
    <label class="text-sm text-neutral-400">{name}</label>
    <div class="flex gap-2">
        {#each options as op}
            {console.log(op, option)}
            <button 
                class="flex-1 bg-neutral-800 text-white px-3 py-2 rounded border outline-none {option === op.value ? "border-amber-600" : "border-neutral-700"}"
                onclick={() => option = op.value}
            >{op.label}</button>
        {/each}
    </div>
</div>