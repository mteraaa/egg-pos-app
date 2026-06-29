import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense,
  createPreset,
  deleteExpense,
  deletePreset,
  listActivePresets,
  listExpensesByMonth,
  updateExpense,
  updatePreset,
  type CreateExpenseInput,
  type CreatePresetInput,
} from "../lib/db/repositories/expenses.repo";
import type { Expense, ExpensePreset } from "../types/db";
import { todayDateKey } from "../utils/date";

export interface RecurringPresetCard extends ExpensePreset {
  isLogged: boolean;
  loggedAmount: number;
  expense: Expense | null;
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

  const loggedByPreset = new Map<string, Expense>();
  const oneOffs: Expense[] = [];
  let totalThisMonth = 0;

  for (const expense of expenses) {
    totalThisMonth += expense.amount;
    if (expense.isOneOff) {
      oneOffs.push(expense);
    } else if (expense.presetId) {
      loggedByPreset.set(expense.presetId, expense);
    }
  }

  const recurring: RecurringPresetCard[] = presets
    .filter((preset) => preset.isRecurring)
    .map((preset) => {
      const expense = loggedByPreset.get(preset.localId) ?? null;
      return {
        ...preset,
        isLogged: expense !== null,
        loggedAmount: expense?.amount ?? preset.defaultAmount,
        expense,
      };
    });

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
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateOneOffExpense(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      localId,
      input,
    }: {
      localId: string;
      input: { name: string; amount: number; note?: string | null };
    }) =>
      updateExpense(localId, {
        name: input.name,
        amount: input.amount,
        note: input.note ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-summary", month] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateLoggedExpense(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      localId,
      amount,
      note,
    }: {
      localId: string;
      amount: number;
      note?: string | null;
    }) => updateExpense(localId, { amount, note: note ?? null }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-summary", month] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteExpense(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (localId: string) => deleteExpense(localId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-summary", month] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
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

export function useUpdatePreset(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      localId,
      input,
    }: {
      localId: string;
      input: CreatePresetInput;
    }) =>
      updatePreset(localId, {
        name: input.name,
        defaultAmount: input.defaultAmount,
        color: input.color ?? null,
        icon: input.icon ?? null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-summary", month] });
    },
  });
}

export function useDeletePreset(month: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (localId: string) => deletePreset(localId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses-summary", month] });
    },
  });
}
