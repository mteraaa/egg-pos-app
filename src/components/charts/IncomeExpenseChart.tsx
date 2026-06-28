import { BarChart } from "react-native-gifted-charts";
import { StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Spacing, Typography } from "../../constants/theme";
import type { WeeklyTotals } from "../../hooks/useDashboard";

interface IncomeExpenseChartProps {
  weekly: WeeklyTotals[];
}

const BAR_WIDTH = 18;
const GROUP_SPACING = 22;

const IncomeExpenseChart = ({ weekly }: IncomeExpenseChartProps) => {
  const barData = weekly.flatMap((week) => [
    {
      value: week.income,
      label: week.label,
      frontColor: Colors.primary,
      spacing: 2,
    },
    {
      value: week.expenses,
      frontColor: Colors.error,
      spacing: GROUP_SPACING,
    },
  ]);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Income vs Expenses</Text>
        <View style={styles.legendRow}>
          <LegendDot color={Colors.primary} label="Income" />
          <LegendDot color={Colors.error} label="Expenses" />
        </View>
      </View>
      <BarChart
        data={barData}
        barWidth={BAR_WIDTH}
        spacing={2}
        initialSpacing={Spacing.sm}
        barBorderRadius={4}
        hideRules
        yAxisThickness={0}
        xAxisThickness={0}
        xAxisLabelTextStyle={styles.axisLabel}
        yAxisTextStyle={styles.axisLabel}
        noOfSections={4}
        height={160}
      />
    </View>
  );
};

const LegendDot = ({ color, label }: { color: string; label: string }) => (
  <View style={styles.legendItem}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
  },
  legendRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  axisLabel: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
});

export default IncomeExpenseChart;
