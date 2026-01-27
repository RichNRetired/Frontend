export interface User {
    id: number | string;
    name?: string;
    email?: string;
    addresses?: Address[];
}

export interface Address {
    id?: number | string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    addressType?: string;
    default?: boolean;
    createdAt?: string;
}