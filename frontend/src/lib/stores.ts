import { writable } from 'svelte/store';
import type { TransactionCell } from '$lib';

export const selectedTransaction = writable<TransactionCell | null>(null);
