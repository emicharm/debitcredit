import {Dexie, liveQuery, type EntityTable} from "dexie"
import {type Transaction, type MovementValue, type StoredAccount} from "$lib/model"
import transactions from "$lib/database/transactions.json"
import { ulid } from "ulid";
import { browser } from "$app/environment";

export const db = new Dexie("DebitCredit") as Dexie & {
  transactions: EntityTable<Transaction, 'id'>;
  accounts: EntityTable<StoredAccount, 'id'>;
};

// Define ALL versions FIRST before any database operations
db.version(1).stores({
    transactions: 'id',
    accounts: 'id, name'
});

function migrateTransaction(transaction: Transaction) {
        for (let i = 0; i < transaction.movements.length; i++) {
            let exchanged_mv = null
            for (let j = 0; j < transaction.movements[i].values.length; j++) {
                const value = transaction.movements[i].values[j]
                if (value && (value as any).is_exchanged) {
                    console.log("exchange value", value)
                    exchanged_mv = value
                }
            }

            console.log("exchanged mv", exchanged_mv)

            if (exchanged_mv == null) {
                continue
            }

            for (let j = 0; j < transaction.movements[i].values.length; j++) {
                const value = transaction.movements[i].values[j]
                if (exchanged_mv !== value) {
                    value.exchanged = true
                    value.amount_exchanged = exchanged_mv.amount
                }
            }

            transaction.movements[i].values = transaction.movements[i].values.filter((value: MovementValue) => !(value as any).is_exchanged)
        }
    return transaction
}

// Only run database operations AFTER all versions are defined
// if (browser) {
//     // Drop and recreate database to test migration
//     db.delete()
//     .then(() => {
//         console.log("Database deleted, recreating...");
//         return db.open();
//     })
//     .then(() => {
//         console.log("Database opened at version:", db.verno);
        
//         // Check if we already have data
//         return db.transactions.count();
//     }).then(count => {
//         if (count === 0) {


//             console.log("No existing data, inserting initial data...");
//             return db.transactions.bulkPut((transactions as Transaction[]).map(migrateTransaction));
//         } else {
//             console.log(`Database already has ${count} transactions`);
//             return null;
//         }
//     }).then((result) => {
//         if (result !== null) {
//             console.log("Imported transactions from JSON");
//         }
//     }).catch(error => {
//         if (error.name === "BulkError") {
//             console.error("Some transactions did not succeed. However, " + (100000-error.failures.length) + " transactions were added successfully");
//         } else {
//             throw error;
//         }
//     });

//     db.open().then(() => {
//         return db.transactions.count();
//     }).then(count => {
//         // Only add sample transactions if we don't have too many already
//         if (count < 10) {
//             return db.transactions.bulkPut(([{
//         id: "ibt transaction 1",
//         date: "12/26/2025",
//         category: "Taxi",
//         movements: [{
//             account: {name: "IBT", currency: "EUR"},
//             account_balance: {value: 511.87, currency: "EUR"},
//             values: [{
//                 description: "Uber",
//                 is_internal: false,
//                 amount: {value: 15924, currency: "ARS"},
//                 kind: "debit",
//             }, {
//                 description: "",
//                 is_internal: false,
//                 amount: {value: 10.01, currency: "EUR"},
//                 kind:"debit",
//                 is_exchanged: true,
//             }]
//         }]
//     },
//     {
//         id: "ibt transaction 2",
//         date: "12/25/2025",
//         category: "Exchange",
//         movements: [{
//             account: {name:"ТБанк",currency: "RUB"},
//             account_balance: {value: 153435.23, currency: "RUB"},
//             values: [
//                 {
//                     description: "Обмен Евро",
//                     is_internal: true,
//                     amount: {value: 50000, currency: "RUB"},
//                     kind: "debit",
//                 },
//                 {
//                     description: "Комиссия банка",
//                     is_internal: false,
//                     amount: {value: 300, currency: "RUB"},
//                     kind: "debit"
//                 }
//             ]
//         },{
//             account: {name: "IBT", currency: "EUR"},
//             account_balance:  {value: 512.88, currency: "EUR"},
//             values: [
//                 {
//                     description: "Начисление",
//                     is_internal: true,
//                     amount: {value: 509.90, currency: "EUR"},
//                     kind: "credit"
//                 }
//             ]
//         }]
//     }
//     ] as Transaction[]).map(migrateTransaction)).then(() => {
//         console.log("Sample transactions added");
//     });
//         } else {
//             console.log(`Skipping sample transactions, already have ${count} transactions`);
//         }
//     });
// }

export function createTransaction(transaction: Transaction) {
    transaction.id = ulid()
    db.transactions.add(transaction)
}
