import {Dexie, type EntityTable} from "dexie"
import { type UserTransaction } from "./model"

export const db = new Dexie("DebitCreditV1") as Dexie & {
    transactions: EntityTable<UserTransaction, 'id'>
}

db.version(2).stores({
    transactions: '++id, date, account, category'
})