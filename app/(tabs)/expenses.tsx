import { StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "../../src/constants/theme";

export default function ExpensesScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Expenses</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size["3xl"],
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
  },
});
