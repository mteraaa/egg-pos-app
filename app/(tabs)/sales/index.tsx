import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from "../../../src/components/FloatingTabBar";
import SizeCard from "../../../src/components/SizeCard";
import { Colors, Spacing, Typography } from "../../../src/constants/theme";
import { useSalesCards, useUpdateSizePrice } from "../../../src/hooks/useSales";
import { useMonthStore } from "../../../src/stores/monthStore";

export default function SalesScreen() {
  const month = useMonthStore((state) => state.month);
  const { data: cards = [] } = useSalesCards(month);
  const updatePrice = useUpdateSizePrice(month);
  const [showHidden, setShowHidden] = useState(false);
  const insets = useSafeAreaInsets();

  const visibleCards = cards.filter(
    (card) => showHidden || card.sizeKey !== "cracked"
  );
  const hasHiddenCard = cards.some((card) => card.sizeKey === "cracked");

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT + Spacing.md },
      ]}
    >
      <Text style={styles.title}>Sales</Text>
      <Text style={styles.subtitle}>Tap a size to view or log sales</Text>

      <View style={styles.grid}>
        {visibleCards.map((card) => (
          <View key={card.sizeKey} style={styles.gridItem}>
            <SizeCard
              variant="sales"
              label={card.label}
              price={card.price}
              totalSales={card.totalSales}
              totalTrays={card.totalTrays}
              onPriceChange={(price) =>
                updatePrice.mutate({ sizeKey: card.sizeKey, price })
              }
              onPress={() => router.push(`/(tabs)/sales/${card.sizeKey}`)}
            />
          </View>
        ))}
      </View>

      {hasHiddenCard && !showHidden && (
        <Pressable
          style={styles.moreSizesButton}
          onPress={() => setShowHidden(true)}
        >
          <Text style={styles.moreSizesText}>+ More sizes</Text>
        </Pressable>
      )}
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
  },
  gridItem: {
    width: "47%",
  },
  moreSizesButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.mintAccent,
    backgroundColor: Colors.mintFill,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  moreSizesText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.base,
    color: Colors.primary,
  },
});
