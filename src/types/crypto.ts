export type KYCLevel = 'none' | 'basic' | 'advanced' | 'full';

export type UserStatus = 'active' | 'frozen' | 'banned' | 'pending';

export type RiskScore = 'low' | 'medium' | 'high' | 'critical';

export type TransactionStatus = 'pending' | 'confirming' | 'completed' | 'failed' | 'cancelled';

export type TransactionType = 'deposit' | 'withdrawal' | 'transfer' | 'p2p_buy' | 'p2p_sell' | 'marketplace' | 'fee';

export type EscrowStatus = 'pending' | 'funded' | 'released' | 'refunded' | 'disputed';

export type DisputeStatus = 'open' | 'in_review' | 'resolved' | 'escalated';

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

export type WalletType = 'hot' | 'cold' | 'escrow';

export type CryptoAsset = 'BTC' | 'ETH' | 'USDT' | 'USDC' | 'BNB' | 'SOL';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  kycLevel: KYCLevel;
  totalBalance: number;
  status: UserStatus;
  riskScore: RiskScore;
  createdAt: Date;
  lastActive: Date;
  verified: boolean;
}

export interface Wallet {
  id: string;
  crypto: CryptoAsset;
  address: string;
  balance: number;
  lockedBalance: number;
  network: string;
  type: WalletType;
  status: 'active' | 'frozen' | 'maintenance';
}

export interface Transaction {
  id: string;
  type: TransactionType;
  userId: string;
  userName: string;
  amount: number;
  crypto: CryptoAsset;
  fee: number;
  network: string;
  status: TransactionStatus;
  confirmations: number;
  requiredConfirmations: number;
  txHash?: string;
  timestamp: Date;
}

export interface P2PTrade {
  id: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  crypto: CryptoAsset;
  amount: number;
  fiatAmount: number;
  fiatCurrency: string;
  paymentMethod: string;
  price: number;
  escrowStatus: EscrowStatus;
  timeRemaining?: number;
  createdAt: Date;
}

export interface Dispute {
  id: string;
  type: 'p2p' | 'marketplace';
  partyA: string;
  partyB: string;
  amount: number;
  crypto: CryptoAsset;
  escrowedAmount: number;
  status: DisputeStatus;
  slaTimer: number;
  createdAt: Date;
  description: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  category: string;
  price: number;
  crypto: CryptoAsset;
  stock: number;
  status: 'active' | 'suspended' | 'out_of_stock';
}

export interface MarketplaceOrder {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  crypto: CryptoAsset;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveryStatus: OrderStatus;
  createdAt: Date;
}

export interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export type AdminRole = 'super_admin' | 'admin_finance' | 'admin_compliance' | 'support_client' | 'admin_marketplace';
