import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.afblock.dartsia.app';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // For cookies/session
});

// Add request interceptor to include Bearer token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
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
        if (response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
        }
        return response.data;
    },
    logout: async () => {
        localStorage.removeItem('auth_token');
        const response = await api.delete('/auth/signout');
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/user');
        return response.data;
    },
    forgotPassword: async (email: string) => {
        const response = await api.post('/auth/forgot-password', { email });
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

export interface FiatFee {
    id: number;
    rate: number;
    currency: {
        id: number;
        name: string;
        iso_code: string;
    };
    transfertFiatDirection: {
        id: number;
        name: string;
        description: string;
    };
    last_updated: string;
}

export const FeeService = {
    getFees: async (): Promise<FiatFee[]> => {
        const response = await api.get('/admin/transactions/fees');
        return response.data;
    },
    updateFee: async (id: number, rate: number): Promise<FiatFee> => {
        const response = await api.put(`/admin/transactions/fees/${id}`, { rate });
        return response.data;
    },
    // Conversion Rates
    getConversionRates: async (): Promise<ConversionRate[]> => {
        const response = await api.get('/admin/transactions/conversion-rates');
        return response.data;
    },
    updateConversionRate: async (id: number, rate: number, fee_percent: number): Promise<ConversionRate> => {
        const response = await api.put(`/admin/transactions/conversion-rates/${id}`, { rate, fee_percent });
        return response.data;
    },
};

export interface ConversionRate {
    id: number;
    rate: number;
    fee_percent: number;
    last_updated: string;
    from_currency: {
        id: number;
        iso_code: string;
        name: string;
    };
    to_currency: {
        id: number;
        iso_code: string;
        name: string;
    };
}

export interface Currency {
    id: number;
    name: string;
    iso_code: string;
    is_crypto: boolean;
    is_active: boolean;
    description: string;
}

export const CurrencyService = {
    getCurrencies: async (): Promise<Currency[]> => {
        const response = await api.get('/admin/transactions/currencies');
        return response.data;
    },
    toggleCurrency: async (id: number): Promise<Currency> => {
        const response = await api.patch(`/admin/transactions/currencies/${id}/toggle`);
        return response.data;
    },
    createCurrency: async (data: { name: string; description: string; iso_code: string; is_crypto: boolean }): Promise<Currency> => {
        const response = await api.post('/admin/transactions/currencies', data);
        return response.data;
    },
    deleteCurrency: async (id: number): Promise<void> => {
        await api.delete(`/admin/transactions/currencies/${id}`);
    },
};

export interface NotificationProvider {
    id: number;
    name: string;
    type: 'EMAIL' | 'SMS';
    credentials: any;
    isActive: boolean;
    rateLimit: number;
}

export const NotificationService = {
    getProviders: async (): Promise<NotificationProvider[]> => {
        const response = await api.get('/admin/notifications/providers');
        return response.data;
    },
    updateProvider: async (id: number, data: { credentials: any; isActive: boolean; rateLimit: number }): Promise<NotificationProvider> => {
        const response = await api.put(`/admin/notifications/providers/${id}`, data);
        return response.data;
    },
    toggleProvider: async (id: number): Promise<NotificationProvider> => {
        const response = await api.post(`/admin/notifications/providers/${id}/toggle`);
        return response.data;
    },
    sendTest: async (id: number, email: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.post(`/admin/notifications/providers/${id}/test`, { email });
        return response.data;
    },
    sendBroadcast: async (title: string, body: string): Promise<{ success: boolean; sent_count: number }> => {
        const response = await api.post(`/admin/notifications/broadcast`, { title, body });
        return response.data;
    },
};
