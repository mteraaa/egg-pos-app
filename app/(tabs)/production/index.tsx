import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetModal from "../../../src/components/BottomSheetModal";
import {
  TAB_BAR_BOTTOM_MARGIN,
  TAB_BAR_HEIGHT,
} from "../../../src/components/FloatingTabBar";
import SizeCard from "../../../src/components/SizeCard";
import SlideInView from "../../../src/components/SlideInView";
import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from "../../../src/constants/theme";
import { TRAY_SIZE, type SizeKey } from "../../../src/constants/sizes";
import { useCreateCollectionForMonth, useProductionCards } from "../../../src/hooks/useProduction";
import { useMonthStore } from "../../../src/stores/monthStore";
import { useQuickActionStore } from "../../../src/stores/quickActionStore";
import { useScrollStore } from "../../../src/stores/scrollStore";
import { todayDateKey } from "../../../src/utils/date";
import { styles as detailStyles } from "../../../src/screens/ProductionDetailScreen.styles";

const LOW_STOCK_THRESHOLD = 2;

export default function ProductionScreen() {
  const month = useMonthStore((state) => state.month);
  const { data: cards = [] } = useProductionCards(month);
  const createCollection = useCreateCollectionForMonth(month);
  const insets = useSafeAreaInsets();
  const pendingAction = useQuickActionStore((state) => state.pendingAction);
  const clearPendingAction = useQuickActionStore(
    (state) => state.clearPendingAction,
  );

  const negativeCards = cards.filter((card) => card.stockTrays < 0);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSizeKey, setSelectedSizeKey] = useState<SizeKey | null>(null);
  const [trays, setTrays] = useState("");
  const [pieces, setPieces] = useState("");
  const [note, setNote] = useState("");

  const openModal = () => {
    setSelectedSizeKey(cards[0]?.sizeKey ?? null);
    setTrays("");
    setPieces("");
    setNote("");
    setModalVisible(true);
  };

  useEffect(() => {
    if (pendingAction === "production") {
      openModal();
      clearPendingAction();
    }
  }, [pendingAction]);

  const submit = () => {
    if (!selectedSizeKey) return;
    const trayCount = parseInt(trays, 10) || 0;
    const pieceCount = parseInt(pieces, 10) || 0;
    const quantityPieces = trayCount * TRAY_SIZE + pieceCount;
    if (quantityPieces <= 0) return;

    createCollection.mutate({
      sizeKey: selectedSizeKey,
      quantityPieces,
      note: note.trim() ? note.trim() : null,
      collectionDate: todayDateKey(),
    });
    setModalVisible(false);
  };

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
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Production</Text>
          <Text style={styles.subtitle}>Stock on hand · collected this month</Text>
        </View>
      </View>

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

      <BottomSheetModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        cardStyle={detailStyles.modalCard}
      >
        <Text style={detailStyles.modalTitle}>Log Collection</Text>
        <View style={styles.sizeField}>
          <Text style={detailStyles.fieldLabel}>Size</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sizeChipRow}
          >
            {cards.map((card) => (
              <Pressable
                key={card.sizeKey}
                style={[
                  styles.sizeChip,
                  selectedSizeKey === card.sizeKey && styles.sizeChipActive,
                ]}
                onPress={() => setSelectedSizeKey(card.sizeKey)}
              >
                <Text
                  style={[
                    styles.sizeChipText,
                    selectedSizeKey === card.sizeKey &&
                      styles.sizeChipTextActive,
                  ]}
                >
                  {card.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={detailStyles.fieldRow}>
          <View style={detailStyles.field}>
            <Text style={detailStyles.fieldLabel}>Trays</Text>
            <TextInput
              style={detailStyles.input}
              keyboardType="number-pad"
              value={trays}
              onChangeText={setTrays}
              placeholder="0"
            />
          </View>
          <View style={detailStyles.field}>
            <Text style={detailStyles.fieldLabel}>Pieces</Text>
            <TextInput
              style={detailStyles.input}
              keyboardType="number-pad"
              value={pieces}
              onChangeText={setPieces}
              placeholder="0"
            />
          </View>
        </View>

        <View style={detailStyles.field}>
          <Text style={detailStyles.fieldLabel}>Note (optional)</Text>
          <TextInput
            style={detailStyles.input}
            value={note}
            onChangeText={setNote}
            placeholder="e.g. Morning collection"
          />
        </View>

        <View style={detailStyles.modalActions}>
          <Pressable
            style={[detailStyles.modalButton, detailStyles.cancelButton]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={detailStyles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable
            style={[detailStyles.modalButton, detailStyles.saveButton]}
            onPress={submit}
          >
            <Text style={detailStyles.saveButtonText}>Save</Text>
          </Pressable>
        </View>
      </BottomSheetModal>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  sizeField: {
    gap: Spacing.xs,
  },
  sizeChipRow: {
    flexDirection: "row",
    gap: Spacing.xs,
  },
  sizeChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  sizeChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sizeChipText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: Colors.textPrimary,
  },
  sizeChipTextActive: {
    color: Colors.textOnGreen,
  },
});
