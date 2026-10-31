export type TransactionStatus =
  | 'order_received'
  | 'awaiting_payment'
  | 'partially_paid'
  | 'payment_claimed'
  | 'evidence_submitted'
  | 'merchant_confirmed'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'needs_review';

export type PaymentClaimStatus =
  | 'none'
  | 'customer_claimed'
  | 'receipt_submitted'
  | 'bank_sms_logged'
  | 'merchant_confirmed'
  | 'independently_verified';

export interface EvidenceItem {
  id: string;
  type: 'whatsapp_message' | 'receipt_image' | 'bank_sms';
  content?: string;
  imageUrl?: string;
  extractedAmount?: number;
  transactionReference?: string;
  timestamp: string;
  bankName?: string;
  senderInfo?: string;
  matchConfidence: number; // 0 to 1
  verificationNote: string;
  status: 'unverified' | 'needs_review' | 'merchant_confirmed';
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  productName: string;
  productId?: string;
  quantity: number;
  agreedAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  currency: string;
  date: string;
  status: TransactionStatus;
  paymentClaimStatus: PaymentClaimStatus;
  evidence: EvidenceItem[];
  sourceMessages: string[];
  notes?: string;
  confidence: number;
  requiresReview: boolean;
  reviewReason?: string;
  paymentMethod?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  totalSpent: number;
  totalAgreed: number;
  totalOrders: number;
  outstandingBalance: number;
  firstTransactionDate: string;
  lastTransactionDate: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  category?: string;
  unitsSold: number;
  totalSalesValue: number;
  orderCount: number;
  averageSellingPrice: number;
  trend: 'up' | 'down' | 'stable';
  inquiryCount: number;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'merchant' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  hasAttachment?: boolean;
  attachmentType?: 'image' | 'document';
  attachmentUrl?: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone?: string;
  date: string;
  lastMessage: string;
  messageCount: number;
  messages: ChatMessage[];
  relatedTransactionIds: string[];
}

export interface BusinessProfile {
  id: string;
  name: string;
  ownerName: string;
  category: string;
  country: string;
  currency: string;
  currencySymbol: string;
  reconciliationFrequency: 'weekly' | 'biweekly' | 'monthly';
  reminderDay: string;
  reminderTime: string;
  isOnboarded: boolean;
  isDemoMode: boolean;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  token?: string;
}

export interface ImportSummary {
  id: string;
  fileName: string;
  fileSize: number;
  importedAt: string;
  conversationsProcessed: number;
  activitiesIdentified: number;
  transactionsExtracted: number;
  customersIdentified: number;
  productsIdentified: number;
  evidenceFound: number;
  requiresReviewCount: number;
}

export interface BusinessObservation {
  id: string;
  title: string;
  description: string;
  category: 'sales' | 'customer' | 'product' | 'cashflow' | 'alert';
  severity: 'info' | 'positive' | 'warning';
  actionableTip?: string;
}
