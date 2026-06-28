import { v4 as uuidv4 } from "uuid";
import { getDb } from "../client";
import { TRAY_SIZE, type SizeKey } from "../../../constants/sizes";
import type { Sale } from "../../../types/db";

interface SaleRow {
  local_id: string;
  server_id: string | null;
  size_key: string;
  quantity_pieces: number;
  unit_price: number;
  total: number;
  customer_note: string | null;
  sale_date: string;
  sync_status: string;
  deleted: number;
  created_at: string;
  updated_at: string;
}

function toSale(row: SaleRow): Sale {
  return {
    localId: row.local_id,
    serverId: row.server_id,
    sizeKey: row.size_key as SizeKey,
    quantityPieces: row.quantity_pieces,
    unitPrice: row.unit_price,
    total: row.total,
    customerNote: row.customer_note,
    saleDate: row.sale_date,
    syncStatus: row.sync_status as Sale["syncStatus"],
    deleted: row.deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface CreateSaleInput {
  sizeKey: SizeKey;
  quantityPieces: number;
  unitPrice: number;
  customerNote?: string | null;
  saleDate: string;
}

export async function createSale(input: CreateSaleInput): Promise<Sale> {
  const db = await getDb();
  const now = new Date().toISOString();
  const localId = uuidv4();
  const total = (input.quantityPieces / TRAY_SIZE) * input.unitPrice;

  await db.runAsync(
    `INSERT INTO sales
      (local_id, server_id, size_key, quantity_pieces, unit_price, total,
       customer_note, sale_date, sync_status, deleted, created_at, updated_at)
     VALUES (?, NULL, ?, ?, ?, ?, ?, ?, 'pending', 0, ?, ?);`,
    [
      localId,
      input.sizeKey,
      input.quantityPieces,
      input.unitPrice,
      total,
      input.customerNote ?? null,
      input.saleDate,
      now,
      now,
    ]
  );

  return {
    localId,
    serverId: null,
    sizeKey: input.sizeKey,
    quantityPieces: input.quantityPieces,
    unitPrice: input.unitPrice,
    total,
    customerNote: input.customerNote ?? null,
    saleDate: input.saleDate,
    syncStatus: "pending",
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listSalesByMonth(month: string): Promise<Sale[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<SaleRow>(
    `SELECT * FROM sales
     WHERE deleted = 0 AND substr(sale_date, 1, 7) = ?
     ORDER BY sale_date DESC, created_at DESC;`,
    [month]
  );
  return rows.map(toSale);
}

export async function listSalesBySizeAndMonth(
  sizeKey: SizeKey,
  month: string
): Promise<Sale[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<SaleRow>(
    `SELECT * FROM sales
     WHERE deleted = 0 AND size_key = ? AND substr(sale_date, 1, 7) = ?
     ORDER BY sale_date DESC, created_at DESC;`,
    [sizeKey, month]
  );
  return rows.map(toSale);
}

export async function sumSoldPiecesBySize(
  uptoMonth: string
): Promise<Map<SizeKey, number>> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ size_key: string; total: number }>(
    `SELECT size_key, SUM(quantity_pieces) as total FROM sales
     WHERE deleted = 0 AND substr(sale_date, 1, 7) <= ?
     GROUP BY size_key;`,
    [uptoMonth]
  );
  return new Map(rows.map((row) => [row.size_key as SizeKey, row.total]));
}

export async function updateSale(
  localId: string,
  patch: Partial<
    Pick<Sale, "quantityPieces" | "unitPrice" | "customerNote" | "saleDate">
  >
): Promise<void> {
  const db = await getDb();
  const row = await db.getFirstAsync<SaleRow>(
    "SELECT * FROM sales WHERE local_id = ?;",
    [localId]
  );
  if (!row) return;

  const current = toSale(row);
  const next = { ...current, ...patch };
  const total = (next.quantityPieces / TRAY_SIZE) * next.unitPrice;
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE sales
     SET quantity_pieces = ?, unit_price = ?, total = ?, customer_note = ?,
         sale_date = ?, sync_status = 'pending', updated_at = ?
     WHERE local_id = ?;`,
    [
      next.quantityPieces,
      next.unitPrice,
      total,
      next.customerNote,
      next.saleDate,
      now,
      localId,
    ]
  );
}

export async function deleteSale(localId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE sales SET deleted = 1, sync_status = 'pending', updated_at = ?
     WHERE local_id = ?;`,
    [new Date().toISOString(), localId]
  );
}
