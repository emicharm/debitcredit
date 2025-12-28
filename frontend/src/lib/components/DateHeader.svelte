<script lang="ts">
    import { isToday, isYesterday, format } from 'date-fns';
    import { ru } from 'date-fns/locale';
    import type {Amount} from "$lib/model"
    import {formatAmount} from "$lib/model"


    let { 
        date: date,
        amounts,
    }: {
        date: Date | string;
        amounts: Amount[];
    } = $props();


    function formatDate(dateValue: Date | string): string {
        const d = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
        
        if (isToday(d)) {
            return 'Сегодня';
        } else if (isYesterday(d)) {
            return 'Вчера';
        } else {
            return format(d, 'd MMMM', { locale: ru });
        }
    }

</script>

<div class="flex items-center mb-4">
    <h2 class="font-bold text-xl flex-1">{formatDate(date)}</h2>
    <div class="text-neutral-500 text-right text-sm">
        {#each amounts as amount}
            <p>{formatAmount(amount)} {amount.currency}</p>
        {/each}
    </div>
</div>