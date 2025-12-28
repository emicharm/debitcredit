import type { Transaction } from "$lib/model";

export interface TransactionsResponse {
    transactions: Transaction[];
    hasMore: boolean;
}

export interface TransactionsState {
    transactions: Transaction[];
    loading: boolean;
    hasMore: boolean;
    lastId: number | null;
}

export async function fetchTransactions(limit: number = 20, lastId?: number): Promise<TransactionsResponse> {
    const params = new URLSearchParams({
        limit: limit.toString(),
        ...(lastId && { last: lastId.toString() })
    });
    
    const response = await fetch(`/api/v1/transactions?${params}`);
    
    if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
    }
    
    return await response.json();
}

export async function loadMoreTransactions(currentState: TransactionsState): Promise<TransactionsState> {
    try {
        const data = await fetchTransactions(20, currentState.lastId ?? undefined);
        
        const newTransactions = [...currentState.transactions, ...data.transactions];
        const newLastId = data.transactions.length > 0 
            ? data.transactions[data.transactions.length - 1].order 
            : currentState.lastId;
        
        return {
            transactions: newTransactions,
            loading: false,
            hasMore: data.hasMore,
            lastId: newLastId
        };
    } catch (error) {
        console.error('Failed to load transactions:', error);
        return {
            ...currentState,
            loading: false
        };
    }
}

export async function createTransaction(transaction: Transaction): Promise<Transaction> {
    const response = await fetch('/api/v1/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(transaction)
    });
    
    if (!response.ok) {
        throw new Error(`Failed to create transaction: ${response.statusText}`);
    }
    
    return await response.json();
}
