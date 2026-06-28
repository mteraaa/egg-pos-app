import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EGG_SIZES, TRAY_SIZE, type SizeKey } from "../constants/sizes";
import { sumSoldPiecesBySize } from "../lib/db/repositories/sales.repo";
import {
  createCollection,
  listCollectionsByMonth,
  listCollectionsBySizeAndMonth,
  sumCollectedPiecesBySize,
  type CreateCollectionInput,
} from "../lib/db/repositories/collections.repo";

export interface ProductionSizeCard {
  sizeKey: SizeKey;
  label: string;
  stockTrays: number;
  collectedTrays: number;
}

const PRODUCTION_SIZES = EGG_SIZES.filter((s) => s.usedInProduction);

async function fetchProductionCards(month: string): Promise<ProductionSizeCard[]> {
  const [collectedThisMonth, cumulativeCollected, cumulativeSold] = await Promise.all([
    listCollectionsByMonth(month),
    sumCollectedPiecesBySize(month),
    sumSoldPiecesBySize(month),
  ]);

  const collectedPiecesBySize = new Map<SizeKey, number>();
  for (const collection of collectedThisMonth) {
    collectedPiecesBySize.set(
      collection.sizeKey,
      (collectedPiecesBySize.get(collection.sizeKey) ?? 0) + collection.quantityPieces
    );
  }

  return PRODUCTION_SIZES.map((size) => {
    const stockPieces =
      (cumulativeCollected.get(size.key) ?? 0) - (cumulativeSold.get(size.key) ?? 0);
    const collectedPieces = collectedPiecesBySize.get(size.key) ?? 0;
    return {
      sizeKey: size.key,
      label: size.label,
      stockTrays: stockPieces / TRAY_SIZE,
      collectedTrays: collectedPieces / TRAY_SIZE,
    };
  });
}

export function useProductionCards(month: string) {
  return useQuery({
    queryKey: ["production-cards", month],
    queryFn: () => fetchProductionCards(month),
  });
}

export function useCollectionsForSize(sizeKey: SizeKey, month: string) {
  return useQuery({
    queryKey: ["collections", sizeKey, month],
    queryFn: () => listCollectionsBySizeAndMonth(sizeKey, month),
  });
}

export function useCreateCollection(sizeKey: SizeKey, month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCollectionInput) => createCollection(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections", sizeKey, month] });
      queryClient.invalidateQueries({ queryKey: ["production-cards", month] });
    },
  });
}
