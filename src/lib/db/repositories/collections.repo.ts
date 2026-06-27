import { v4 as uuidv4 } from "uuid";
import { getDb } from "../client";
import type { SizeKey } from "../../../constants/sizes";
import type { EggCollection } from "../../../types/db";

interface EggCollectionRow {
  local_id: string;
  server_id: string | null;
  size_key: string;
  quantity_pieces: number;
  collection_date: string;
  note: string | null;
  sync_status: string;
  deleted: number;
  created_at: string;
  updated_at: string;
}

function toEggCollection(row: EggCollectionRow): EggCollection {
  return {
    localId: row.local_id,
    serverId: row.server_id,
    sizeKey: row.size_key as SizeKey,
    quantityPieces: row.quantity_pieces,
    collectionDate: row.collection_date,
    note: row.note,
    syncStatus: row.sync_status as EggCollection["syncStatus"],
    deleted: row.deleted === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export interface CreateCollectionInput {
  sizeKey: SizeKey;
  quantityPieces: number;
  collectionDate: string;
  note?: string | null;
}

export async function createCollection(
  input: CreateCollectionInput
): Promise<EggCollection> {
  const db = await getDb();
  const now = new Date().toISOString();
  const localId = uuidv4();

  await db.runAsync(
    `INSERT INTO egg_collections
      (local_id, server_id, size_key, quantity_pieces, collection_date, note,
       sync_status, deleted, created_at, updated_at)
     VALUES (?, NULL, ?, ?, ?, ?, 'pending', 0, ?, ?);`,
    [
      localId,
      input.sizeKey,
      input.quantityPieces,
      input.collectionDate,
      input.note ?? null,
      now,
      now,
    ]
  );

  return {
    localId,
    serverId: null,
    sizeKey: input.sizeKey,
    quantityPieces: input.quantityPieces,
    collectionDate: input.collectionDate,
    note: input.note ?? null,
    syncStatus: "pending",
    deleted: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function listCollectionsByMonth(
  month: string
): Promise<EggCollection[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<EggCollectionRow>(
    `SELECT * FROM egg_collections
     WHERE deleted = 0 AND substr(collection_date, 1, 7) = ?
     ORDER BY collection_date DESC, created_at DESC;`,
    [month]
  );
  return rows.map(toEggCollection);
}

export async function listCollectionsBySizeAndMonth(
  sizeKey: SizeKey,
  month: string
): Promise<EggCollection[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<EggCollectionRow>(
    `SELECT * FROM egg_collections
     WHERE deleted = 0 AND size_key = ? AND substr(collection_date, 1, 7) = ?
     ORDER BY collection_date DESC, created_at DESC;`,
    [sizeKey, month]
  );
  return rows.map(toEggCollection);
}

export async function updateCollection(
  localId: string,
  patch: Partial<
    Pick<EggCollection, "quantityPieces" | "collectionDate" | "note">
  >
): Promise<void> {
  const db = await getDb();
  const row = await db.getFirstAsync<EggCollectionRow>(
    "SELECT * FROM egg_collections WHERE local_id = ?;",
    [localId]
  );
  if (!row) return;

  const current = toEggCollection(row);
  const next = { ...current, ...patch };
  const now = new Date().toISOString();

  await db.runAsync(
    `UPDATE egg_collections
     SET quantity_pieces = ?, collection_date = ?, note = ?,
         sync_status = 'pending', updated_at = ?
     WHERE local_id = ?;`,
    [next.quantityPieces, next.collectionDate, next.note, now, localId]
  );
}

export async function deleteCollection(localId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE egg_collections SET deleted = 1, sync_status = 'pending', updated_at = ?
     WHERE local_id = ?;`,
    [new Date().toISOString(), localId]
  );
}
