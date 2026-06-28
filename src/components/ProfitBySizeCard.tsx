import { StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Spacing, Typography } from "../constants/theme";
import type { SizeProfitRow } from "../hooks/useDashboard";

interface ProfitBySizeCardProps {
  rows: SizeProfitRow[];
}

const MARGIN_HEALTHY_THRESHOLD = 0.4;

const ProfitBySizeCard = ({ rows }: ProfitBySizeCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Profit by Size</Text>
        <Text style={styles.legend}>rev · cost · profit</Text>
      </View>
      <View style={styles.list}>
        {rows.map((row, index) => (
          <ProfitRow key={row.sizeKey} row={row} isLast={index === rows.length - 1} />
        ))}
      </View>
    </View>
  );
};

const ProfitRow = ({ row, isLast }: { row: SizeProfitRow; isLast: boolean }) => {
  const marginColor =
    row.margin >= MARGIN_HEALTHY_THRESHOLD ? Colors.success : Colors.warning;

  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <Text style={styles.sizeLabel}>{row.label}</Text>
      <View style={styles.figures}>
        <Text style={styles.revenue}>₱{Math.round(row.revenue).toLocaleString()}</Text>
        <Text style={styles.cost}>₱{Math.round(row.cost).toLocaleString()}</Text>
      </View>
      <View style={styles.profitColumn}>
        <Text style={[styles.profit, { color: marginColor }]}>
          ₱{Math.round(row.profit).toLocaleString()}
        </Text>
        <Text style={[styles.marginLabel, { color: marginColor }]}>
          {Math.round(row.margin * 100)}% margin
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
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
  legend: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  list: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.sm,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sizeLabel: {
    flex: 1,
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
  },
  figures: {
    flex: 1.4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  revenue: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: Colors.primaryDark,
  },
  cost: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  profitColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  profit: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.base,
  },
  marginLabel: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
  },
});

export default ProfitBySizeCard;
