import { db } from './index';
import { ulid } from 'ulid';
import type { StoredAccount, Account } from '$lib/model';
import { liveQuery } from 'dexie';

export async function createAccount(name: string, currency: string): Promise<StoredAccount> {
    const account: StoredAccount = {
        id: ulid(),
        name,
        currency,
        createdAt: new Date().toISOString()
    };
    
    await db.accounts.add(account);
    return account;
}

export async function getAccounts(): Promise<StoredAccount[]> {
    return await db.accounts
        .filter(account => !account.archived)
        .toArray()
        .then(accounts => accounts.sort((a, b) => a.name.localeCompare(b.name)));
}

export async function getAccount(id: string): Promise<StoredAccount | undefined> {
    return await db.accounts.get(id);
}

export async function accountExists(account: Account): Promise<boolean> {
    if (!account || !account.name || !account.currency) {
        return false;
    }
    
    const existing = await db.accounts
        .filter(acc => 
            !acc.archived && 
            acc.name === account.name && 
            acc.currency === account.currency
        )
        .first();
    
    return existing !== undefined;
}

export async function archiveAccount(id: string, replacedBy: string): Promise<void> {
    await db.accounts.update(id, { archived: true, replacedBy });
}

// Create a new version of an account (append-only update)
export async function updateAccountAsNew(oldAccountId: string, name: string, currency: string): Promise<StoredAccount> {
    const newAccount: StoredAccount = {
        id: ulid(),
        name,
        currency,
        createdAt: new Date().toISOString()
    };
    
    await db.accounts.add(newAccount);
    await archiveAccount(oldAccountId, newAccount.id);
    
    return newAccount;
}

// Reactive query for active accounts list
export const accountsQuery = liveQuery(() => 
    db.accounts
        .filter(account => !account.archived)
        .toArray()
        .then(accounts => accounts.sort((a, b) => a.name.localeCompare(b.name)))
);
