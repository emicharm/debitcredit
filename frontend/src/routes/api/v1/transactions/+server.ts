import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import transactionsData from '$lib/transactions.json';

export const GET: RequestHandler = async ({ url }) => {
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const lastId = url.searchParams.get('last');

    // Mock: simulate finding the starting index
    let startIndex = 0;
    if (lastId) {
        const lastIndex = transactionsData.findIndex((tx: any) => tx.order === parseInt(lastId));
        if (lastIndex !== -1) {
            startIndex = lastIndex + 1;
        }
    }

    // Get the slice of transactions
    const transactions = transactionsData.slice(startIndex, startIndex + limit);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return json({
        transactions,
        hasMore: startIndex + limit < transactionsData.length
    });
};
