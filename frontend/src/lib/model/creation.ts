import type { Account, Amount } from ".";

export interface UserEvent {

}

export interface UserEventTransfer {
    account: Account;
    balance: Amount;

    description: string;
    amount_local: Amount;
    kind: "debit" | "credit";
    internal: boolean;
}

export function formatAccount(account: Account): string {
    return account.name + " " + account.currency
}