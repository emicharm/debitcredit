import { writable } from 'svelte/store';
import type { Transaction } from '$lib/model';

export const selectedTransaction = writable<Transaction | null>(null);
