// ==========================================
// SHARED UTILITY TYPES
// ==========================================
// We use string | Date because data from the server might be serialized as a string
type Populated<T> = string | T; 

// ==========================================
// ACCOUNT HEAD TYPES
// ==========================================
export type AccountType = 'INCOME' | 'EXPENSE' | 'ASSET' | 'LIABILITY' | 'EQUITY';
export type FundCategory = 'RESTRICTED' | 'UNRESTRICTED';

export interface TAccountHead {
  _id: string;
  name: string;
  type: AccountType;
  fundCategory: FundCategory;
  subType: string[];
  code: string;
  description?: string;
  isSystem?: boolean;
  isBankAccount?:boolean
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ==========================================
// INVENTORY TYPES
// ==========================================
export type InventoryCategory = 'FOOD' | 'CLOTHING' | 'EDUCATION' | 'MEDICAL' | 'MAINTENANCE';
export type InventoryLogType = 'IN' | 'OUT';

export interface TInventoryItem {
  _id: string;
  name: string;
  category: InventoryCategory;
  unit: string;
  currentStock: number;
  minimumStockLevel: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface TInventoryLog {
  _id: string;
  item: Populated<TInventoryItem>; // Can be just the ID string, or the full populated item
  quantity: number;
  type: InventoryLogType;
  reason: string;
  date: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

// ==========================================
// TRANSACTION (FINANCE) TYPES
// ==========================================
export type TransactionType = 'INCOME' | 'EXPENSE';
export type PaymentMethod = 'CASH' | 'BANK' | 'CHEQUE' | 'IN_KIND';

export interface TTransaction {
  _id: string;
  amount: number;
  date: string | Date;
  type: TransactionType;
  accountHead: Populated<TAccountHead>; // Can be just the ID string, or the full populated account
  paymentMethod: PaymentMethod;
  description: string;
  subTypeSelected?: string;
  referenceNumber?: string;
  donorOrVendorName?: string;
  logId?: Populated<TInventoryLog> | null; // Can be just the ID, populated log, or null
  createdAt?: string | Date;
  updatedAt?: string | Date;
}