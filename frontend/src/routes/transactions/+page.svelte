<script lang="ts">
    import DateHeader from "../DateHeader.svelte"
    import TransactionRow from "../TransactionRow.svelte"

    import type {Amount, TransactionCell} from "$lib";
    import type { Icon } from "lucide-svelte";
    import { categoryConfig } from "$lib/categoryConfig";

    import transactions from "$lib/transactions.json"

    const txs : TransactionCell[] = transactions
</script>
<div class="mx-4">

    {#each txs as tx}
        <TransactionRow cell={{...tx, 
            color: categoryConfig[tx.category]?.color ?? tx.color,
            icon: categoryConfig[tx.category]?.icon ?? tx.icon
        }} />
    {/each}

    <!-- <DateHeader date={new Date(2025, 11, 23)} amounts={[{value: 12345, currency: "RUB"}]}/>
    <DateHeader date={new Date(2025, 11, 22)} amounts={[{value: 12345.87, currency: "RUB"}]}/>
    <DateHeader date={new Date(2025, 11, 21)} amounts={[{value: 342.23, currency: "USDT"}, {value: 532, currency:"EUR"}]}/> -->

    <!-- <TransactionRow cell={{
        category: "Mobile",
        movements: [{
            account_name: "ТБанк",
            account_balance: {value: 12345.32, currency: "RUB"},
            values: [{
                description: "Yota +7 920 800-11-08",
                is_internal: false,
                amount: {value: 1000, currency: "RUB"},
                kind: "debit",
            }]
        }]
    }}/>

    <TransactionRow cell={{
        category: "Переводы",
        movements: [{
            account_name: "ТБанк",
            account_balance: {value: 10000, currency: "RUB"},
            values: [{
                description: "Мия Т.",
                is_internal: false,
                amount: {value: 2965, currency: "RUB"},
                kind: "credit",
            }]
        }]
    }}/>

    <TransactionRow cell={{
        category: "Переводы",
        movements: [{
            account_name: "ТБанк",
            account_balance: {value: 10000, currency: "RUB"},
            values: [{
                description: "Мия Т.",
                is_internal: false,
                amount: {value: 5523, currency: "RUB"},
                kind: "credit",
            }]
        }]
    }}/>

    <TransactionRow cell={{
        category: "Exchange",
        movements: [{
            account_name: "ТБанк",
            account_balance: {value: 153435.23, currency: "RUB"},
            values: [
                {
                    description: "Обмен Евро",
                    is_internal: true,
                    amount: {value: 50000, currency: "RUB"},
                    kind: "debit",
                },
                {
                    description: "Комиссия банка",
                    is_internal: false,
                    amount: {value: 300, currency: "RUB"},
                    kind: "debit"
                }
            ]
        },{
            account_name: "IBT",
            account_balance:  {value: 512.88, currency: "EUR"},
            values: [
                {
                    description: "Начисление",
                    is_internal: true,
                    amount: {value: 509.90, currency: "EUR"},
                    kind: "credit"
                }
            ]
        }]
    }} />


    <TransactionRow cell={{
        category: "Taxi",
        movements: [{
            account_name: "IBT",
            account_balance: {value: 511.87, currency: "EUR"},
            values: [{
                description: "Uber",
                is_internal: false,
                amount: {value: 15924, currency: "ARS"},
                kind: "debit",
            }, {
                description: "",
                is_internal: false,
                amount: {value: 10.01, currency: "EUR"},
                kind:"debit",
                is_exchanged: true,
            }]
        }]
    }}/>



    <div class="flex items-center mb-4">
        <h2 class="font-bold text-xl flex-1">Вчера</h2>
        <div class="text-neutral-500 text-right text-sm">
            <p>-50 000 RUB</p>
        </div>
    </div>

    <TransactionRow cell={{
        category: "Переводы",
        movements: [{
            account_name: "ТБанк",
            account_balance: {value: 10000, currency: "RUB"},
            values: [{
                description: "Мия Т.",
                is_internal: false,
                amount: {value: 50000, currency: "RUB"},
                kind: "debit",
            }]
        }]
    }}/> -->

</div>