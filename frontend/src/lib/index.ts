// place files you want to import through the `$lib` alias in this folder.

export interface Amount {
    value: number;
    currency: string;
}

export function formatAmount(amount: Amount, sep: string = ' '): string {
    const abs = Math.abs(amount.value)
    const parts = Math.abs(amount.value).toFixed(2).split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    const decimalPart = parts[1];
    
    const sign = amount.value < 0 ? '-' : '';
    let formattedValue = integerPart
    if (decimalPart[1] !== '0') {
        formattedValue = formattedValue + '.' + decimalPart
    } else if (decimalPart[0] !== '0') {
        formattedValue = formattedValue + '.' + decimalPart.slice(0, 1)
    }
    
    return `${sign}${formattedValue}`;
}

    type MovementKind = "debit" | "credit"

    interface MovementValue {
        description: string;
        is_internal: boolean;
        is_exchanged?: boolean;
        amount: Amount;
        kind: MovementKind;
    };

    interface Movement {
        account_name: string;
        account_balance: Amount;
        values: MovementValue[];
    }

    export interface TransactionCell {
        category: string;
        color?: string;
        icon?: any;
        movements: Movement[];
    }