import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EGG_SIZES, TRAY_SIZE, type SizeKey } from "../constants/sizes";
import {
  createSale,
  deleteSale,
  listSalesByMonth,
  listSalesBySizeAndMonth,
  updateSale,
  type CreateSaleInput,
} from "../lib/db/repositories/sales.repo";
import type { Sale } from "../types/db";
import {
  getAllPricing,
  getPricingBySizeKey,
  updatePricing,
} from "../lib/db/repositories/pricing.repo";

export interface SalesSizeCard {
  sizeKey: SizeKey;
  label: string;
  price: number;
  totalSales: number;
  totalTrays: number;
}

const SALES_SIZES = EGG_SIZES.filter((s) => s.usedInSales);

async function fetchSalesCards(month: string): Promise<SalesSizeCard[]> {
  const [pricing, sales] = await Promise.all([
    getAllPricing(),
    listSalesByMonth(month),
  ]);

  const priceBySize = new Map(pricing.map((p) => [p.sizeKey, p.unitPrice]));
  const totalsBySize = new Map<SizeKey, { sales: number; pieces: number }>();
  for (const sale of sales) {
    const current = totalsBySize.get(sale.sizeKey) ?? { sales: 0, pieces: 0 };
    current.sales += sale.total;
    current.pieces += sale.quantityPieces;
    totalsBySize.set(sale.sizeKey, current);
  }

  return SALES_SIZES.map((size) => {
    const totals = totalsBySize.get(size.key) ?? { sales: 0, pieces: 0 };
    return {
      sizeKey: size.key,
      label: size.label,
      price: priceBySize.get(size.key) ?? 0,
      totalSales: totals.sales,
      totalTrays: totals.pieces / TRAY_SIZE,
    };
  });
}

export function useSalesCards(month: string) {
  return useQuery({
    queryKey: ["sales-cards", month],
    queryFn: () => fetchSalesCards(month),
  });
}

export function useUpdateSizePrice(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sizeKey, price }: { sizeKey: SizeKey; price: number }) =>
      updatePricing(sizeKey, { unitPrice: price }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales-cards", month] });
    },
  });
}

export function useSizePrice(sizeKey: SizeKey) {
  return useQuery({
    queryKey: ["size-price", sizeKey],
    queryFn: async () => (await getPricingBySizeKey(sizeKey))?.unitPrice ?? 0,
  });
}

export function useSalesForSize(sizeKey: SizeKey, month: string) {
  return useQuery({
    queryKey: ["sales", sizeKey, month],
    queryFn: () => listSalesBySizeAndMonth(sizeKey, month),
  });
}

export function useCreateSale(sizeKey: SizeKey, month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSaleInput) => createSale(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales", sizeKey, month] });
      queryClient.invalidateQueries({ queryKey: ["sales-cards", month] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useCreateSaleForMonth(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSaleInput) => createSale(input),
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ["sales", input.sizeKey, month] });
      queryClient.invalidateQueries({ queryKey: ["sales-cards", month] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateSale(sizeKey: SizeKey, month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      localId,
      patch,
    }: {
      localId: string;
      patch: Partial<
        Pick<Sale, "quantityPieces" | "unitPrice" | "customerNote" | "saleDate">
      >;
    }) => updateSale(localId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales", sizeKey, month] });
      queryClient.invalidateQueries({ queryKey: ["sales-cards", month] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteSale(sizeKey: SizeKey, month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (localId: string) => deleteSale(localId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales", sizeKey, month] });
      queryClient.invalidateQueries({ queryKey: ["sales-cards", month] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
