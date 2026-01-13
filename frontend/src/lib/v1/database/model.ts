export interface UserTransaction {
    date: Date;
    description: string;
    amount: number;
    currency: string;
    account: string;
    category: string;
}