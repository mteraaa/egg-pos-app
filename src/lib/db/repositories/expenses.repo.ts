import { v4 as uuidv4 } from "uuid";
import { getDb } from "../client";
import type { Expense, ExpensePreset } from "../../../types/db";

interface ExpensePresetRow {
  local_id: string;
  server_id: string | null;
  name: string;
  default_amount: number;
  is_recurring: number;
  color: string | null;
  icon: string | null;
  is_active: number;
  sync_status: string;
  deleted: number;
  created_at: string;
  updated_at: string;
}

interface ExpenseRow {
  local_id: string;
  server_id: string | null;
  preset_id: string | null;
  name: string | null;
  amount: number;
  note: string | null;
  expense_date: string;
  is_one_off: number;
  sync_status: string;
  deleted: number;
  created_at: string;
  updated_at: string;
}

function toExpensePreset(row: ExpensePresetRow): ExpensePreset {
  return {
    localId: row.local_id,
    serverId: row.server_id,
    name: row.name,
    defaultAmount: row.default_amount,
    isRecurring: row.is_recurring === 1,
    color: row.color,
    icon: row.icon,
    isActive: row.is_active === 1,
    syncStatus: row.sync_status as ExpensePreset["syncStatus"],
    deleted: row.deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toExpense(row: ExpenseRow): Expense {
  return {
    localId: row.local_id,
    serverId: row.server_id,
    presetId: row.preset_id,
    name: row.name,
    amount: row.amount,
    note: row.note,
    expenseDate: row.expense_date,
    isOneOff: row.is_one_off === 1,
    syncStatus: row.sync_status as Expense["syncStatus"],
    deleted: row.deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// --- Presets ---

export interface CreatePresetInput {
  name: string;
  defaultAmount: number;
  isRecurring: boolean;
  color?: string | null;
  icon?: string | null;
}

export async function createPreset(
  input: CreatePresetInput
): Promise<ExpensePreset> {
  const db = await getDb();
  const now = new Date().toISOString();
  const localId = uuidv4();

  await db.runAsync(
    `INSERT INTO expense_presets
      (local_id, server_id, name, default_amount, is_recurring, color, icon,
       is_active, sync_status, deleted, created_at, updated_at)
     VALUES (?, NULL, ?, ?, ?, ?, ?, 1, 'pending', 0, ?, ?);`,
    [
      localId,
      input.name,
      input.defaultAmount,
      input.isRecurring ? 1 : 0,
      input.color ?? null,
      input.icon ?? null,
      now,
      now,
    ]
  );

  return {
    localId,
    serverId: null,
    name: input.name,
    defaultAmount: input.defaultAmount,
    isRecurring: input.isRecurring,
    color: input.color ?? null,
    icon: input.icon ?? null,
    isActive: true,
    syncStatus: "pending",
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listActivePresets(): Promise<ExpensePreset[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<ExpensePresetRow>(
    `SELECT * FROM expense_presets
     WHERE deleted = 0 AND is_active = 1
     ORDER BY name;`
  );
  return rows.map(toExpensePreset);
}

export async function deletePreset(localId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE expense_presets SET deleted = 1, sync_status = 'pending', updated_at = ?
     WHERE local_id = ?;`,
    [new Date().toISOString(), localId]
  );
}

// --- Expenses (recurring logs + one-offs) ---

export interface CreateExpenseInput {
  presetId?: string | null;
  name?: string | null;
  amount: number;
  note?: string | null;
  expenseDate: string;
  isOneOff: boolean;
}

export async function createExpense(
  input: CreateExpenseInput
): Promise<Expense> {
  const db = await getDb();
  const now = new Date().toISOString();
  const localId = uuidv4();

  await db.runAsync(
    `INSERT INTO expenses
      (local_id, server_id, preset_id, name, amount, note, expense_date,
       is_one_off, sync_status, deleted, created_at, updated_at)
     VALUES (?, NULL, ?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?);`,
    [
      localId,
      input.presetId ?? null,
      input.name ?? null,
      input.amount,
      input.note ?? null,
      input.expenseDate,
      input.isOneOff ? 1 : 0,
      now,
      now,
    ]
  );

  return {
    localId,
    serverId: null,
    presetId: input.presetId ?? null,
    name: input.name ?? null,
    amount: input.amount,
    note: input.note ?? null,
    expenseDate: input.expenseDate,
    isOneOff: input.isOneOff,
    syncStatus: "pending",
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listExpensesByMonth(
  month: string,
  type: "all" | "recurring" | "oneoff" = "all"
): Promise<Expense[]> {
  const db = await getDb();
  const typeFilter =
    type === "recurring"
      ? "AND is_one_off = 0"
      : type === "oneoff"
        ? "AND is_one_off = 1"
        : "";

  const rows = await db.getAllAsync<ExpenseRow>(
    `SELECT * FROM expenses
     WHERE deleted = 0 AND substr(expense_date, 1, 7) = ? ${typeFilter}
     ORDER BY expense_date DESC, created_at DESC;`,
    [month]
  );
  return rows.map(toExpense);
}

export async function listExpensesByPreset(
  presetId: string
): Promise<Expense[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<ExpenseRow>(
    `SELECT * FROM expenses
     WHERE deleted = 0 AND preset_id = ?
     ORDER BY expense_date DESC, created_at DESC;`,
    [presetId]
  );
  return rows.map(toExpense);
}

export async function deleteExpense(localId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE expenses SET deleted = 1, sync_status = 'pending', updated_at = ?
     WHERE local_id = ?;`,
    [new Date().toISOString(), localId]
  );
}
