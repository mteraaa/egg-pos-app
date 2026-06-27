import type { SizeKey } from "../constants/sizes";

export type SyncStatus = "pending" | "synced" | "failed";

export interface SizePricing {
  sizeKey: SizeKey;
  unitPrice: number;
  unitCost: number;
  isActive: boolean;
  updatedAt: string;
}

export interface Sale {
  localId: string;
  serverId: string | null;
  sizeKey: SizeKey;
  quantityPieces: number;
  unitPrice: number;
  total: number;
  customerNote: string | null;
  saleDate: string;
  syncStatus: SyncStatus;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EggCollection {
  localId: string;
  serverId: string | null;
  sizeKey: SizeKey;
  quantityPieces: number;
  collectionDate: string;
  note: string | null;
  syncStatus: SyncStatus;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExpensePreset {
  localId: string;
  serverId: string | null;
  name: string;
  defaultAmount: number;
  isRecurring: boolean;
  color: string | null;
  icon: string | null;
  isActive: boolean;
  syncStatus: SyncStatus;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  localId: string;
  serverId: string | null;
  presetId: string | null;
  name: string | null;
  amount: number;
  note: string | null;
  expenseDate: string;
  isOneOff: boolean;
  syncStatus: SyncStatus;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
