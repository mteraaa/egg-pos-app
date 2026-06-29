import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetModal from "../../../src/components/BottomSheetModal";
import { TAB_BAR_BOTTOM_MARGIN, TAB_BAR_HEIGHT } from "../../../src/components/FloatingTabBar";
import CollectionRow from "../../../src/components/CollectionRow";
import { Colors, Spacing } from "../../../src/constants/theme";
import { EGG_SIZES, TRAY_SIZE, type SizeKey } from "../../../src/constants/sizes";
import {
  useCollectionsForSize,
  useCreateCollection,
  useDeleteCollection,
  useUpdateCollection,
} from "../../../src/hooks/useProduction";
import { useMonthStore } from "../../../src/stores/monthStore";
import { useScrollStore } from "../../../src/stores/scrollStore";
import { todayDateKey } from "../../../src/utils/date";
import { styles } from "../../../src/screens/ProductionDetailScreen.styles";
import type { EggCollection } from "../../../src/types/db";

export default function SizeProductionDetailScreen() {
  const { sizeKey } = useLocalSearchParams<{ sizeKey: SizeKey }>();
  const month = useMonthStore((state) => state.month);
  const sizeDef = EGG_SIZES.find((s) => s.key === sizeKey);
  const insets = useSafeAreaInsets();
  const tabBarClearance = insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT;

  const { data: collections = [] } = useCollectionsForSize(sizeKey, month);
  const createCollection = useCreateCollection(sizeKey, month);
  const updateCollection = useUpdateCollection(sizeKey, month);
  const deleteCollection = useDeleteCollection(sizeKey, month);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCollection, setEditingCollection] =
    useState<EggCollection | null>(null);
  const [trays, setTrays] = useState("");
  const [pieces, setPieces] = useState("");
  const [note, setNote] = useState("");

  const openModal = () => {
    setEditingCollection(null);
    setTrays("");
    setPieces("");
    setNote("");
    setModalVisible(true);
  };

  const openEditModal = (collection: EggCollection) => {
    setEditingCollection(collection);
    setTrays(String(Math.floor(collection.quantityPieces / TRAY_SIZE)));
    setPieces(String(collection.quantityPieces % TRAY_SIZE));
    setNote(collection.note ?? "");
    setModalVisible(true);
  };

  const handleLongPress = (collection: EggCollection) => {
    Alert.alert("Manage collection", undefined, [
      { text: "Edit", onPress: () => openEditModal(collection) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          Alert.alert("Delete collection?", "This can't be undone.", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => deleteCollection.mutate(collection.localId),
            },
          ]),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const submit = () => {
    const trayCount = parseInt(trays, 10) || 0;
    const pieceCount = parseInt(pieces, 10) || 0;
    const quantityPieces = trayCount * TRAY_SIZE + pieceCount;
    if (quantityPieces <= 0) return;

    if (editingCollection) {
      updateCollection.mutate(
        {
          localId: editingCollection.localId,
          patch: {
            quantityPieces,
            note: note.trim() ? note.trim() : null,
          },
        },
        { onSuccess: () => setModalVisible(false) }
      );
      return;
    }

    createCollection.mutate({
      sizeKey,
      quantityPieces,
      note: note.trim() ? note.trim() : null,
      collectionDate: todayDateKey(),
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
        data={collections}
        keyExtractor={(item) => item.localId}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarClearance + Spacing.xl },
        ]}
        onScroll={(e) =>
          useScrollStore.getState().onScroll(e.nativeEvent.contentOffset.y)
        }
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <CollectionRow
            date={item.collectionDate}
            quantityPieces={item.quantityPieces}
            note={item.note}
            onLongPress={() => handleLongPress(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <Text style={styles.empty}>No collections logged for this month yet.</Text>
        }
      />

      <Pressable
        style={[styles.addButton, { bottom: tabBarClearance + Spacing.sm }]}
        onPress={openModal}
      >
        <Ionicons name="add" size={20} color={Colors.textOnGreen} />
        <Text style={styles.addButtonText}>Log Collection</Text>
      </Pressable>

      <BottomSheetModal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        cardStyle={styles.modalCard}
      >
            <Text style={styles.modalTitle}>
              {editingCollection ? "Edit Collection" : "Log Collection"} —{" "}
              {sizeDef?.label}
            </Text>

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
              <Text style={styles.fieldLabel}>Note (optional)</Text>
              <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
                placeholder="e.g. Morning collection"
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
      </BottomSheetModal>
    </View>
  );
}
