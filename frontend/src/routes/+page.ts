import { redirect } from '@sveltejs/kit';

// Preview branch: the Dec 31 build has no home page, so open the list.
export function load() {
	redirect(307, '/transactions');
}
