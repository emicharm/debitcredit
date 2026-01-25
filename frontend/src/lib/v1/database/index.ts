import {Dexie, type EntityTable} from "dexie"
import { type UserTransaction } from "./model"

export const db = new Dexie("DebitCreditV1") as Dexie & {
    transactions: EntityTable<UserTransaction, 'id'>
}

// Original schema
db.version(2).stores({
    transactions: '++id, date, account, category'
})

// Migration to add kind field with default 'debit' for existing transactions
db.version(3).stores({
    transactions: '++id, date, account, category, kind'
}).upgrade(tx => {
    return tx.table('transactions').toCollection().modify(transaction => {
        if (!transaction.kind) {
            transaction.kind = 'debit';
        }
    });
})