<script lang="ts">
    import Value from './Value.svelte';
    import AccountSelect from './AccountSelect.svelte';
    import BalanceInput from './BalanceInput.svelte';
    import TextInput from './TextInput.svelte';
    import SlidePanel from '$lib/components/SlidePanel.svelte';
    import { formatAmount, type Account} from '$lib/model';
    import {formatAccount, type UserEventTransfer} from '$lib/model/creation'
    import { accountExists } from '$lib/database/accounts';
	import { is } from 'date-fns/locale';
    import Radio from './Radio.svelte'
    import Checkbox from './Checkbox.svelte';

    interface Props {
        transfer: UserEventTransfer;
        edit?: boolean;
    }

    let { 
        transfer: transfer = $bindable(),
        edit = false
    }: Props = $props();

    let showEditPanel = $state(false);

    let isValid = $state('Empty transfer')

    const kindOptions = [
        {label: "Credit", value: "credit"},
        {label: "Debit", value: "debit"}
    ]



    $effect(() => {
        // Capture values for reactivity tracking
        const account = transfer.account;
        const amount = transfer.amount_local?.value;
        const currency = transfer.amount_local?.currency;
        
        (async () => {
            let missing = []
            const isAccountExists = await accountExists(account)
            if (!isAccountExists) {
                missing.push("account")
            }

            if (!amount) {
                missing.push("amount")
            }

            if (!currency) {
                missing.push("currency")
            }

            if (missing.length > 0) {
                isValid = "Empty transfer - missing " + missing.join(', ')
            } else {
                isValid = ''
            }

        })();
    });

    $effect(() => {
        if (transfer == null) {
            transfer = {
                account: {name: '', currency: ''},
                balance: {value: 0, currency: ''},
                description: '',
                amount_local: {value: 0, currency: ''},
                kind: "debit",
                internal: false,
            }
        }

        if (transfer.balance == null) {
            transfer.balance = {value: 0, currency: ''}
        }

        transfer.balance.currency = transfer.account?.currency || ''

        if (transfer.amount_local == null) {
            transfer.amount_local = {value: 0, currency: ''}
        }
        if (transfer.amount_local?.value === 0) {
            transfer.amount_local.currency = transfer.account?.currency || ''
        }
    })
</script>

<button 
    type="button"
    onclick={() => showEditPanel = true}
    class="w-full space-y-1 bg-neutral-800 rounded-2xl p-4 hover:bg-neutral-700 transition-colors text-left"
>
    {#if isValid.length > 0}
        <h2>Transfer</h2>
        <p class="text-neutral-500">{isValid}</p>
    {:else}
        <div>
            <h2>Transfer</h2>
            <h2 class={transfer?.description === '' ? 'text-neutral-600' : ''}>{transfer.description || "No description"}</h2>
            <h2>{transfer.description}</h2>
            <h2>{formatAccount(transfer.account)}</h2>
        </div>
        <p>{formatAmount(transfer.balance)}</p>
        <p>{formatAmount(transfer.amount_local)} {transfer.amount_local.currency}</p>
    {/if}
</button>

<SlidePanel 
    show={showEditPanel} 
    title="Edit Transfer"
    onClose={() => showEditPanel = false}
    showBackButton={true}
    fullHeight={true}
>
    <div class="p-4 flex flex-col gap-4">
        <AccountSelect bind:account={transfer.account} />
        <BalanceInput bind:balance={transfer.balance} disabledCurrency={true}/>
        <TextInput bind:value={transfer.description} label="Description" placeholder="Enter description" />
        <BalanceInput bind:balance={transfer.amount_local} />
        <Radio name="Kind" bind:option={transfer.kind} options={kindOptions}/>
        <Checkbox name="Internal Transfer" bind:checked={transfer.internal} />
    </div>
</SlidePanel>
