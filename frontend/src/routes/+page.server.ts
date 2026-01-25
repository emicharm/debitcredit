import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	// Redirect to transactions page as the default
	redirect(303, 'v1/list');
};