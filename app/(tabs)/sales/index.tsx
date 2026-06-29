import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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
import { TRAY_SIZE, type SizeKey } from "../../../src/constants/sizes";
import { Colors, Spacing, Typography } from "../../../src/constants/theme";
import {
  useCreateSaleForMonth,
  useSalesCards,
  useUpdateSizePrice,
} from "../../../src/hooks/useSales";
import { useMonthStore } from "../../../src/stores/monthStore";
import { todayDateKey } from "../../../src/utils/date";
import { styles as detailStyles } from "../../../src/screens/SalesDetailScreen.styles";

export default function SalesScreen() {
  const month = useMonthStore((state) => state.month);
  const { data: cards = [] } = useSalesCards(month);
  const updatePrice = useUpdateSizePrice(month);
  const createSale = useCreateSaleForMonth(month);
  const [showHidden, setShowHidden] = useState(false);
  const insets = useSafeAreaInsets();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSizeKey, setSelectedSizeKey] = useState<SizeKey | null>(null);
  const [trays, setTrays] = useState("");
  const [pieces, setPieces] = useState("");
  const [price, setPrice] = useState("0");
  const [note, setNote] = useState("");

  const visibleCards = cards.filter(
    (card) => showHidden || card.sizeKey !== "cracked",
  );
  const hasHiddenCard = cards.some((card) => card.sizeKey === "cracked");

  const selectSize = (sizeKey: SizeKey, defaultPrice: number) => {
    setSelectedSizeKey(sizeKey);
    setPrice(String(defaultPrice));
  };

  const openModal = () => {
    const firstCard = visibleCards[0];
    setSelectedSizeKey(firstCard?.sizeKey ?? null);
    setTrays("");
    setPieces("");
    setPrice(String(firstCard?.price ?? 0));
    setNote("");
    setModalVisible(true);
  };

  const submit = () => {
    if (!selectedSizeKey) return;
    const trayCount = parseInt(trays, 10) || 0;
    const pieceCount = parseInt(pieces, 10) || 0;
    const quantityPieces = trayCount * TRAY_SIZE + pieceCount;
    const unitPrice = parseFloat(price) || 0;
    if (quantityPieces <= 0) return;

    createSale.mutate({
      sizeKey: selectedSizeKey,
      quantityPieces,
      unitPrice,
      customerNote: note.trim() ? note.trim() : null,
      saleDate: todayDateKey(),
    });
    setModalVisible(false);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom:
            insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT + Spacing.md,
        },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sales</Text>
          <Text style={styles.subtitle}>Tap a size to view or log sales</Text>
        </View>
        <Pressable style={styles.addButton} onPress={openModal} hitSlop={8}>
          <Ionicons name="add" size={24} color={Colors.textOnGreen} />
        </Pressable>
      </View>

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

      <BottomSheetModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        cardStyle={detailStyles.modalCard}
      >
            <Text style={detailStyles.modalTitle}>Log Sale</Text>
            <View style={styles.sizeField}>
              <Text style={detailStyles.fieldLabel}>Size</Text>
              <View style={styles.sizeChipRow}>
                {visibleCards.map((card) => (
                  <Pressable
                    key={card.sizeKey}
                    style={[
                      styles.sizeChip,
                      selectedSizeKey === card.sizeKey && styles.sizeChipActive,
                    ]}
                    onPress={() => selectSize(card.sizeKey, card.price)}
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
              </View>
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
              <Text style={detailStyles.fieldLabel}>Price per tray (₱)</Text>
              <TextInput
                style={detailStyles.input}
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={detailStyles.field}>
              <Text style={detailStyles.fieldLabel}>
                Customer note (optional)
              </Text>
              <TextInput
                style={detailStyles.input}
                value={note}
                onChangeText={setNote}
                placeholder="e.g. Mrs. Santos"
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
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
  sizeField: {
    gap: Spacing.xs,
  },
  sizeChipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
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
