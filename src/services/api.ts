import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // For cookies/session
});

export interface Wallet {
    id: number;
    currency: {
        id: number;
        name: string;
        symbol: string;
    };
    balance: number;
    address: string;
    user: {
        id: number;
        email: string;
        username: string;
        role?: string;
    };
}

export const WalletService = {
    getAllWallets: async (): Promise<Wallet[]> => {
        const response = await api.get('/admin/wallets');
        return response.data;
    },
};
