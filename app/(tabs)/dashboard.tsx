import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from "../../src/components/FloatingTabBar";
import { Colors, Spacing, Typography } from "../../src/constants/theme";

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        { paddingBottom: insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT + Spacing.md },
      ]}
    >
      <Text style={styles.title}>Dashboard</Text>
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
