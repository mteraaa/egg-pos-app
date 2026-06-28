import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from "../../../src/components/FloatingTabBar";
import SizeCard from "../../../src/components/SizeCard";
import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from "../../../src/constants/theme";
import { useProductionCards } from "../../../src/hooks/useProduction";
import { useMonthStore } from "../../../src/stores/monthStore";

const LOW_STOCK_THRESHOLD = 2;

export default function ProductionScreen() {
  const month = useMonthStore((state) => state.month);
  const { data: cards = [] } = useProductionCards(month);
  const insets = useSafeAreaInsets();

  const negativeCards = cards.filter((card) => card.stockTrays < 0);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT + Spacing.md },
      ]}
    >
      <Text style={styles.title}>Production</Text>
      <Text style={styles.subtitle}>Stock on hand · collected this month</Text>

      {negativeCards.length > 0 && (
        <View style={styles.banner}>
          <Ionicons name="warning" size={18} color={Colors.error} />
          <Text style={styles.bannerText}>
            {negativeCards.map((c) => c.label).join(", ")}{" "}
            {negativeCards.length === 1 ? "is" : "are"} in negative stock — sold
            more than collected. Log a collection.
          </Text>
        </View>
      )}

      <View style={styles.grid}>
        {cards.map((card) => (
          <View key={card.sizeKey} style={styles.gridItem}>
            <SizeCard
              variant="production"
              label={card.label}
              stockTrays={card.stockTrays}
              collectedTrays={card.collectedTrays}
              lowStockThreshold={LOW_STOCK_THRESHOLD}
              onPress={() => router.push(`/(tabs)/production/${card.sizeKey}`)}
            />
          </View>
        ))}
      </View>
    </ScrollView>
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
  title: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size["3xl"],
    color: Colors.textPrimary,
  },
  subtitle: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.base,
    color: Colors.textSecondary,
    marginTop: -Spacing.sm,
  },
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.sm,
    backgroundColor: Colors.errorFill,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  bannerText: {
    flex: 1,
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: Colors.error,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  gridItem: {
    width: "47%",
  },
});
