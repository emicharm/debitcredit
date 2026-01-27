// Shared navigation state for client-side routing
export type View = 'transactions' | 'create' | 'statistics';

class NavigationStore {
    currentView = $state<View>('transactions');

    navigateTo(view: View) {
        this.currentView = view;
    }
}

export const navigation = new NavigationStore();