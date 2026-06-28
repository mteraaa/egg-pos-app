import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  createPreset,
  listActivePresets,
  listExpensesByMonth,
  type CreateExpenseInput,
  type CreatePresetInput,
} from "../lib/db/repositories/expenses.repo";
import type { Expense, ExpensePreset } from "../types/db";
import { todayDateKey } from "../utils/date";

export interface RecurringPresetCard extends ExpensePreset {
  isLogged: boolean;
  loggedAmount: number;
}

export interface ExpensesSummary {
  totalThisMonth: number;
  recurring: RecurringPresetCard[];
  oneOffs: Expense[];
}

async function fetchExpensesSummary(month: string): Promise<ExpensesSummary> {
  const [presets, expenses] = await Promise.all([
    listActivePresets(),
    listExpensesByMonth(month),
  ]);

  const loggedByPreset = new Map<string, number>();
  const oneOffs: Expense[] = [];
  let totalThisMonth = 0;

  for (const expense of expenses) {
    totalThisMonth += expense.amount;
    if (expense.isOneOff) {
      oneOffs.push(expense);
    } else if (expense.presetId) {
      loggedByPreset.set(
        expense.presetId,
        (loggedByPreset.get(expense.presetId) ?? 0) + expense.amount
      );
    }
  }

  const recurring: RecurringPresetCard[] = presets
    .filter((preset) => preset.isRecurring)
    .map((preset) => ({
      ...preset,
      isLogged: loggedByPreset.has(preset.localId),
      loggedAmount: loggedByPreset.get(preset.localId) ?? preset.defaultAmount,
    }));

  return { totalThisMonth, recurring, oneOffs };
}

export function useExpensesSummary(month: string) {
  return useQuery({
    queryKey: ["expenses-summary", month],
    queryFn: () => fetchExpensesSummary(month),
  });
}

export function useLogPreset(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (preset: ExpensePreset) =>
      createExpense({
        presetId: preset.localId,
        amount: preset.defaultAmount,
        expenseDate: todayDateKey(),
        isOneOff: false,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-summary", month] });
    },
  });
}

export function useLogAllRecurring(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (presets: ExpensePreset[]) =>
      Promise.all(
        presets.map((preset) =>
          createExpense({
            presetId: preset.localId,
            amount: preset.defaultAmount,
            expenseDate: todayDateKey(),
            isOneOff: false,
          })
        )
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-summary", month] });
    },
  });
}

export function useCreateOneOffExpense(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; amount: number; note?: string | null }) =>
      createExpense({
        presetId: null,
        name: input.name,
        amount: input.amount,
        note: input.note ?? null,
        expenseDate: todayDateKey(),
        isOneOff: true,
      } satisfies CreateExpenseInput),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-summary", month] });
    },
  });
}

export function useCreatePreset(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePresetInput) => createPreset(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-summary", month] });
    },
  });
}
