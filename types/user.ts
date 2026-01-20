export interface User {
    id: string;
    name: string;
    email: string;
    addresses: Address[];
}

export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
}