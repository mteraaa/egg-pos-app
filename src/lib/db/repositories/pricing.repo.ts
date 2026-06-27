import { getDb } from "../client";
import type { SizeKey } from "../../../constants/sizes";
import type { SizePricing } from "../../../types/db";

interface SizePricingRow {
  size_key: string;
  unit_price: number;
  unit_cost: number;
  is_active: number;
  updated_at: string;
}

function toSizePricing(row: SizePricingRow): SizePricing {
  return {
    sizeKey: row.size_key as SizeKey,
    unitPrice: row.unit_price,
    unitCost: row.unit_cost,
    isActive: row.is_active === 1,
    updatedAt: row.updated_at,
  };
}

export async function getAllPricing(): Promise<SizePricing[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<SizePricingRow>(
    "SELECT * FROM size_pricing ORDER BY size_key;"
  );
  return rows.map(toSizePricing);
}

export async function getPricingBySizeKey(
  sizeKey: SizeKey
): Promise<SizePricing | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<SizePricingRow>(
    "SELECT * FROM size_pricing WHERE size_key = ?;",
    [sizeKey]
  );
  return row ? toSizePricing(row) : null;
}

export async function updatePricing(
  sizeKey: SizeKey,
  patch: Partial<Pick<SizePricing, "unitPrice" | "unitCost" | "isActive">>
): Promise<void> {
  const db = await getDb();
  const current = await getPricingBySizeKey(sizeKey);
  if (!current) return;

  const next = { ...current, ...patch };
  await db.runAsync(
    `UPDATE size_pricing
     SET unit_price = ?, unit_cost = ?, is_active = ?, updated_at = ?
     WHERE size_key = ?;`,
    [
      next.unitPrice,
      next.unitCost,
      next.isActive ? 1 : 0,
      new Date().toISOString(),
      sizeKey,
    ]
  );
}
