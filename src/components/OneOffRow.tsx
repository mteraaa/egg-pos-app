import { StyleSheet, Text, View } from "react-native";
import { Colors, Typography } from "../constants/theme";
import { formatShortDate } from "../utils/date";

interface OneOffRowProps {
  name: string | null;
  amount: number;
  expenseDate: string;
}

const OneOffRow = ({ name, amount, expenseDate }: OneOffRowProps) => {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.date}>{formatShortDate(expenseDate)}</Text>
      </View>
      <Text style={styles.amount}>−₱{amount.toLocaleString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
  },
  name: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
  },
  date: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  amount: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
    color: Colors.error,
  },
});

export default OneOffRow;
