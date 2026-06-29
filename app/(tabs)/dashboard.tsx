import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import IncomeExpenseChart from "../../src/components/charts/IncomeExpenseChart";
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from "../../src/components/FloatingTabBar";
import KpiCard from "../../src/components/KpiCard";
import ProfitBySizeCard from "../../src/components/ProfitBySizeCard";
import SlideInView from "../../src/components/SlideInView";
import { Colors, Spacing, Typography } from "../../src/constants/theme";
import { useDashboard } from "../../src/hooks/useDashboard";
import { useMonthStore } from "../../src/stores/monthStore";
import { useScrollStore } from "../../src/stores/scrollStore";
import { formatMonthAbbrev, shiftMonthKey } from "../../src/utils/date";

function formatChange(value: number | null, unit: "%" | "pts"): string | null {
  if (value === null) return null;
  const rounded = Math.round(Math.abs(value));
  const arrow = value >= 0 ? "▲" : "▼";
  return unit === "pts" ? `${arrow}${rounded} pts` : `${arrow}${rounded}%`;
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const month = useMonthStore((state) => state.month);
  const { data } = useDashboard(month);
  const caption = `vs ${formatMonthAbbrev(shiftMonthKey(month, -1))}`;

  return (
    <SlideInView style={styles.screen}>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT + Spacing.md },
      ]}
      onScroll={(e) =>
        useScrollStore.getState().onScroll(e.nativeEvent.contentOffset.y)
      }
      scrollEventThrottle={16}
    >
      {!data || !data.hasData ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No activity yet this month</Text>
          <Text style={styles.emptySubtitle}>
            Log a sale or expense to see your dashboard come to life.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiRow}>
              <KpiCard
                label="Income"
                value={`₱${Math.round(data.kpis.income).toLocaleString()}`}
                changeLabel={formatChange(data.comparison.incomeChangePct, "%")}
                captionLabel={caption}
              />
              <KpiCard
                label="Expenses"
                value={`₱${Math.round(data.kpis.expenses).toLocaleString()}`}
                changeLabel={formatChange(data.comparison.expensesChangePct, "%")}
                captionLabel={caption}
              />
            </View>
            <View style={styles.kpiRow}>
              <KpiCard
                label="Net Profit"
                value={`₱${Math.round(data.kpis.netProfit).toLocaleString()}`}
                changeLabel={formatChange(data.comparison.netProfitChangePct, "%")}
                captionLabel={caption}
              />
              <KpiCard
                label="Margin"
                value={`${Math.round(data.kpis.margin * 100)}%`}
                changeLabel={formatChange(data.comparison.marginChangePts, "pts")}
                captionLabel={caption}
              />
            </View>
          </View>

          <IncomeExpenseChart weekly={data.weekly} />

          {data.profitBySize.length > 0 && (
            <ProfitBySizeCard rows={data.profitBySize} />
          )}
        </>
      )}
    </ScrollView>
    </SlideInView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  kpiGrid: {
    gap: Spacing.sm,
  },
  kpiRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing["2xl"],
    gap: Spacing.xs,
  },
  emptyTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
  },
  emptySubtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
