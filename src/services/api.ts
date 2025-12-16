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
    getWalletStats: async (): Promise<WalletStats> => {
        const response = await api.get('/admin/wallets/stats');
        return response.data;
    },
};

export interface WalletStats {
    totalWallets: number;
    cryptoWallets: number;
    fiatWallets: number;
    totalUSDT: number;
    totalUSDC: number;
    totalXAF: number;
    activeUsers: number;
}

export interface SigninPayload {
    type: 'email' | 'phone';
    email?: string;
    password: string;
}

export const AuthService = {
    signin: async (data: SigninPayload) => {
        const response = await api.post('/auth/signin', data);
        return response.data;
    },
    logout: async () => {
        const response = await api.delete('/auth/signout');
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/user');
        return response.data;
    }
};

export interface DashboardStats {
    totalUsers: number;
    verifiedUsersPercent: number;
    pendingWithdrawals: number;
    openDisputes: number;
    dailyVolume: number;
}

export const StatsService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
};

export interface AdminUser {
    id: number;
    username: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
    userMeta?: {
        first_name: string;
        last_name: string;
        phone_number: string;
    };
    wallets?: Wallet[];
}

export const AdminUserService = {
    getAllUsers: async (): Promise<AdminUser[]> => {
        const response = await api.get('/admin/users');
        return response.data;
    },
};

export interface AdminTransaction {
    id: number;
    amount: number;
    transaction_status_id: number;
    created_at: string;
    updated_at: string;
    transactionStatus?: {
        id: number;
        name: string;
    };
    transactionType?: {
        id: number;
        name: string;
    };
    startCurrency?: {
        id: number;
        name: string;
        symbol: string;
    };
    endCurrency?: {
        id: number;
        name: string;
        symbol: string;
    };
    user?: {
        id: number;
        username: string;
        email: string;
    };
}

export interface TransactionStats {
    totalTransactions: number;
    completedTransactions: number;
    pendingTransactions: number;
    failedTransactions: number;
    totalVolume: number;
    transactionsByType: Record<string, number>;
}

export const TransactionAdminService = {
    getAllTransactions: async (): Promise<AdminTransaction[]> => {
        const response = await api.get('/admin/transactions');
        return response.data;
    },
    getStats: async (): Promise<TransactionStats> => {
        const response = await api.get('/admin/transactions/stats');
        return response.data;
    },
};

export interface Country {
    id: number;
    name: string;
    code: string;
}

export interface City {
    id: number;
    name: string;
    country?: Country;
}

export interface Gender {
    id: number;
    name: string;
}

export interface RegistrationConfig {
    countries: Country[];
    cities: City[];
    genders: Gender[];
}

export const RegistrationConfigService = {
    getConfig: async (): Promise<RegistrationConfig> => {
        const response = await api.get('/admin/registration-config');
        return response.data;
    },
    // Countries
    createCountry: async (name: string, code: string): Promise<Country> => {
        const response = await api.post('/admin/registration-config/countries', { name, code });
        return response.data;
    },
    updateCountry: async (id: number, name: string, code: string): Promise<Country> => {
        const response = await api.put(`/admin/registration-config/countries/${id}`, { name, code });
        return response.data;
    },
    deleteCountry: async (id: number): Promise<void> => {
        await api.delete(`/admin/registration-config/countries/${id}`);
    },
    // Cities
    createCity: async (name: string, countryId: number): Promise<City> => {
        const response = await api.post('/admin/registration-config/cities', { name, countryId });
        return response.data;
    },
    updateCity: async (id: number, name: string, countryId: number): Promise<City> => {
        const response = await api.put(`/admin/registration-config/cities/${id}`, { name, countryId });
        return response.data;
    },
    deleteCity: async (id: number): Promise<void> => {
        await api.delete(`/admin/registration-config/cities/${id}`);
    },
    // Genders
    createGender: async (name: string): Promise<Gender> => {
        const response = await api.post('/admin/registration-config/genders', { name });
        return response.data;
    },
    updateGender: async (id: number, name: string): Promise<Gender> => {
        const response = await api.put(`/admin/registration-config/genders/${id}`, { name });
        return response.data;
    },
    deleteGender: async (id: number): Promise<void> => {
        await api.delete(`/admin/registration-config/genders/${id}`);
    },
};
