import type { ULID } from "ulid";

export type TransactionKind = 'debit' | 'credit';

export interface UserTransaction {
    id: ULID;
    date: Date;
    description: string;
    amount: number;
    currency: string;
    account: string;
    category: string;
    kind: TransactionKind;
}