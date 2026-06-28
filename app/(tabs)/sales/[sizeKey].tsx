import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from "../../../src/components/FloatingTabBar";
import TransactionRow from "../../../src/components/TransactionRow";
import { Colors, Spacing } from "../../../src/constants/theme";
import { EGG_SIZES, TRAY_SIZE, type SizeKey } from "../../../src/constants/sizes";
import {
  useCreateSale,
  useSalesForSize,
  useSizePrice,
} from "../../../src/hooks/useSales";
import { useMonthStore } from "../../../src/stores/monthStore";
import { todayDateKey } from "../../../src/utils/date";
import { styles } from "../../../src/screens/SalesDetailScreen.styles";

export default function SizeSalesDetailScreen() {
  const { sizeKey } = useLocalSearchParams<{ sizeKey: SizeKey }>();
  const month = useMonthStore((state) => state.month);
  const sizeDef = EGG_SIZES.find((s) => s.key === sizeKey);
  const insets = useSafeAreaInsets();
  const tabBarClearance = insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT;

  const { data: sales = [] } = useSalesForSize(sizeKey, month);
  const { data: defaultPrice = 0 } = useSizePrice(sizeKey);
  const createSale = useCreateSale(sizeKey, month);

  const [modalVisible, setModalVisible] = useState(false);
  const [trays, setTrays] = useState("");
  const [pieces, setPieces] = useState("");
  const [price, setPrice] = useState("0");
  const [note, setNote] = useState("");

  useEffect(() => {
    setPrice(String(defaultPrice));
  }, [defaultPrice]);

  const openModal = () => {
    setTrays("");
    setPieces("");
    setPrice(String(defaultPrice));
    setNote("");
    setModalVisible(true);
  };

  const submit = () => {
    const trayCount = parseInt(trays, 10) || 0;
    const pieceCount = parseInt(pieces, 10) || 0;
    const quantityPieces = trayCount * TRAY_SIZE + pieceCount;
    const unitPrice = parseFloat(price) || 0;
    if (quantityPieces <= 0) return;

    createSale.mutate({
      sizeKey,
      quantityPieces,
      unitPrice,
      customerNote: note.trim() ? note.trim() : null,
      saleDate: todayDateKey(),
    });
    setModalVisible(false);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>{sizeDef?.label ?? sizeKey}</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={sales}
        keyExtractor={(item) => item.localId}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarClearance + Spacing.xl },
        ]}
        renderItem={({ item }) => (
          <TransactionRow
            date={item.saleDate}
            quantityPieces={item.quantityPieces}
            total={item.total}
            note={item.customerNote}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No sales logged for this month yet.</Text>
        }
      />

      <Pressable
        style={[styles.addButton, { bottom: tabBarClearance + Spacing.sm }]}
        onPress={openModal}
      >
        <Ionicons name="add" size={20} color={Colors.textOnGreen} />
        <Text style={styles.addButtonText}>Add Sale</Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Log Sale — {sizeDef?.label}</Text>

            <View style={styles.fieldRow}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Trays</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={trays}
                  onChangeText={setTrays}
                  placeholder="0"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Pieces</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="number-pad"
                  value={pieces}
                  onChangeText={setPieces}
                  placeholder="0"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Price per tray (₱)</Text>
              <TextInput
                style={styles.input}
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Customer note (optional)</Text>
              <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
                placeholder="e.g. Mrs. Santos"
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={submit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
