import { useQuery } from "@tanstack/react-query";
import { EGG_SIZES, TRAY_SIZE, type SizeKey } from "../constants/sizes";
import { listExpensesByMonth } from "../lib/db/repositories/expenses.repo";
import { listSalesByMonth } from "../lib/db/repositories/sales.repo";
import { shiftMonthKey } from "../utils/date";

export interface DashboardKpis {
  income: number;
  expenses: number;
  netProfit: number;
  margin: number; // 0..1
}

export interface DashboardComparison {
  incomeChangePct: number | null;
  expensesChangePct: number | null;
  netProfitChangePct: number | null;
  marginChangePts: number | null; // percentage points vs previous month
}

export interface WeeklyTotals {
  label: string;
  income: number;
  expenses: number;
}

export interface SizeProfitRow {
  sizeKey: SizeKey;
  label: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number; // 0..1
}

export interface DashboardData {
  kpis: DashboardKpis;
  comparison: DashboardComparison;
  weekly: WeeklyTotals[];
  profitBySize: SizeProfitRow[];
  hasData: boolean;
}

const PROFIT_SIZES = EGG_SIZES.filter((s) => s.usedInSales);

function computeKpis(income: number, expenses: number): DashboardKpis {
  const netProfit = income - expenses;
  return { income, expenses, netProfit, margin: income > 0 ? netProfit / income : 0 };
}

function pctChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? null : 100;
  return ((current - previous) / previous) * 100;
}

// Splits a month's days into 4 weekly buckets (overflow days fold into W4)
// so the chart always reads as W1-W4, matching how the farmer thinks in weeks.
function weekOfMonth(dateKey: string): number {
  const day = Number(dateKey.split("-")[2]);
  return Math.min(Math.ceil(day / 7), 4);
}

async function fetchDashboard(month: string): Promise<DashboardData> {
  const previousMonth = shiftMonthKey(month, -1);
  const [sales, expenses, prevSales, prevExpenses] = await Promise.all([
    listSalesByMonth(month),
    listExpensesByMonth(month),
    listSalesByMonth(previousMonth),
    listExpensesByMonth(previousMonth),
  ]);

  const income = sales.reduce((sum, sale) => sum + sale.total, 0);
  const expenseTotal = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const kpis = computeKpis(income, expenseTotal);

  const prevIncome = prevSales.reduce((sum, sale) => sum + sale.total, 0);
  const prevExpenseTotal = prevExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const prevKpis = computeKpis(prevIncome, prevExpenseTotal);

  const comparison: DashboardComparison = {
    incomeChangePct: pctChange(income, prevIncome),
    expensesChangePct: pctChange(expenseTotal, prevExpenseTotal),
    netProfitChangePct: pctChange(kpis.netProfit, prevKpis.netProfit),
    marginChangePts: prevIncome === 0 && income === 0 ? null : (kpis.margin - prevKpis.margin) * 100,
  };

  const weekly: WeeklyTotals[] = [1, 2, 3, 4].map((week) => ({
    label: `W${week}`,
    income: 0,
    expenses: 0,
  }));
  for (const sale of sales) {
    weekly[weekOfMonth(sale.saleDate) - 1].income += sale.total;
  }
  for (const expense of expenses) {
    weekly[weekOfMonth(expense.expenseDate) - 1].expenses += expense.amount;
  }

  const totalsBySize = new Map<SizeKey, { revenue: number; trays: number }>();
  for (const sale of sales) {
    const current = totalsBySize.get(sale.sizeKey) ?? { revenue: 0, trays: 0 };
    current.revenue += sale.total;
    current.trays += sale.quantityPieces / TRAY_SIZE;
    totalsBySize.set(sale.sizeKey, current);
  }
  const totalTrays = Array.from(totalsBySize.values()).reduce((sum, v) => sum + v.trays, 0);

  // No per-size cost is stored, so expenses are allocated across sizes by
  // share of trays sold — a size that moved more volume absorbs more cost.
  const profitBySize: SizeProfitRow[] = PROFIT_SIZES.flatMap((size) => {
    const totals = totalsBySize.get(size.key);
    if (!totals || totals.revenue === 0) return [];
    const cost = totalTrays > 0 ? expenseTotal * (totals.trays / totalTrays) : 0;
    const profit = totals.revenue - cost;
    return [
      {
        sizeKey: size.key,
        label: size.label,
        revenue: totals.revenue,
        cost,
        profit,
        margin: profit / totals.revenue,
      },
    ];
  });

  return {
    kpis,
    comparison,
    weekly,
    profitBySize,
    hasData: sales.length > 0 || expenses.length > 0,
  };
}

export function useDashboard(month: string) {
  return useQuery({
    queryKey: ["dashboard", month],
    queryFn: () => fetchDashboard(month),
  });
}
