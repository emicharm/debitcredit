import { writable } from 'svelte/store';
import type { Transaction, DetalizationEntry } from '$lib/model';

export const selectedTransaction = writable<Transaction | null>(null);

export interface DetalizationData {
    entries: DetalizationEntry[];
    accountCurrency: string;
}

export const detalizationData = writable<DetalizationData | null>(null);
