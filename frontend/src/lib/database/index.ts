import {Dexie, liveQuery, type EntityTable} from "dexie"
import {type Transaction} from "$lib/model"
import transactions from "$lib/database/transactions.json"
import { ulid } from "ulid";
import { browser } from "$app/environment";

export const db = new Dexie("DebitCredit") as Dexie & {
  transactions: EntityTable<Transaction, 'id'>;
};

db.version(1).stores({
    transactions: 'id'
})

// Only run database operations in browser
if (browser) {
    db.transactions.bulkPut(transactions as Transaction[])
.then(() => {
    console.log("Imported transactions")
})
.catch(error => {
    if (error.name === "BulkError") {
        // Explicitly catching the bulkAdd() operation makes those successful
        // additions commit despite that there were errors.
        console.error("Some raindrops did not succeed. However, " + (100000-error.failures.length) + " raindrops was added successfully");
    } else {
        throw error; // we're only handling BulkError specifically here...
    }
})

    db.transactions.bulkPut([{
        id: "ibt transaction 1",
        date: "12/26/2025",
        category: "Taxi",
        movements: [{
            account: {name: "IBT", currency: "EUR"},
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
    },
    {
        id: "ibt transaction 2",
        date: "12/25/2025",
        category: "Exchange",
        movements: [{
            account: {name:"ТБанк",currency: "RUB"},
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
            account: {name: "IBT", currency: "EUR"},
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
    }
    ] as Transaction[])
}

export function createTransaction(transaction: Transaction) {
    transaction.id = ulid()
    db.transactions.add(transaction)
}
