import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  TAB_BAR_BOTTOM_MARGIN,
  TAB_BAR_HEIGHT,
} from "../../src/components/FloatingTabBar";
import AddOneOffModal from "../../src/components/AddOneOffModal";
import AddPresetModal from "../../src/components/AddPresetModal";
import EditLoggedExpenseModal from "../../src/components/EditLoggedExpenseModal";
import OneOffRow from "../../src/components/OneOffRow";
import PresetCard from "../../src/components/PresetCard";
import SlideInView from "../../src/components/SlideInView";
import { Colors, Spacing, Typography } from "../../src/constants/theme";
import {
  useCreateOneOffExpense,
  useCreatePreset,
  useDeleteExpense,
  useDeletePreset,
  useExpensesSummary,
  useLogAllRecurring,
  useLogPreset,
  useUpdateLoggedExpense,
  useUpdateOneOffExpense,
  useUpdatePreset,
  type RecurringPresetCard,
} from "../../src/hooks/useExpenses";
import { useMonthStore } from "../../src/stores/monthStore";
import { useScrollStore } from "../../src/stores/scrollStore";
import type { Expense } from "../../src/types/db";

export default function ExpensesScreen() {
  const month = useMonthStore((state) => state.month);
  const { data } = useExpensesSummary(month);
  const logPreset = useLogPreset(month);
  const logAllRecurring = useLogAllRecurring(month);
  const createOneOff = useCreateOneOffExpense(month);
  const updateOneOff = useUpdateOneOffExpense(month);
  const updateLoggedExpense = useUpdateLoggedExpense(month);
  const deleteExpense = useDeleteExpense(month);
  const createPreset = useCreatePreset(month);
  const updatePreset = useUpdatePreset(month);
  const deletePreset = useDeletePreset(month);
  const insets = useSafeAreaInsets();

  const recurring = data?.recurring ?? [];
  const oneOffs = data?.oneOffs ?? [];
  const totalThisMonth = data?.totalThisMonth ?? 0;
  const unloggedPresets = recurring.filter((preset) => !preset.isLogged);

  const [oneOffModalVisible, setOneOffModalVisible] = useState(false);
  const [presetModalVisible, setPresetModalVisible] = useState(false);
  const [editingOneOff, setEditingOneOff] = useState<Expense | null>(null);
  const [editingRecurring, setEditingRecurring] =
    useState<RecurringPresetCard | null>(null);
  const [editingPreset, setEditingPreset] =
    useState<RecurringPresetCard | null>(null);

  const openEditOneOff = (expense: Expense) => {
    setEditingOneOff(expense);
    setOneOffModalVisible(true);
  };

  const handleOneOffLongPress = (expense: Expense) => {
    Alert.alert("Manage expense", undefined, [
      { text: "Edit", onPress: () => openEditOneOff(expense) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          Alert.alert("Delete expense?", "This can't be undone.", [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => deleteExpense.mutate(expense.localId),
            },
          ]),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const openEditPreset = (preset: RecurringPresetCard) => {
    setEditingPreset(preset);
    setPresetModalVisible(true);
  };

  const confirmDeletePreset = (preset: RecurringPresetCard) => {
    Alert.alert(
      "Delete recurring expense?",
      "This removes the recurring expense template. Already-logged amounts for past months are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deletePreset.mutate(preset.localId),
        },
      ]
    );
  };

  const confirmDeleteLog = (preset: RecurringPresetCard) => {
    if (!preset.expense) return;
    Alert.alert("Delete this month's log?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteExpense.mutate(preset.expense!.localId),
      },
    ]);
  };

  const handleRecurringLongPress = (preset: RecurringPresetCard) => {
    if (preset.isLogged) {
      Alert.alert("Manage recurring expense", undefined, [
        { text: "Edit this month's amount", onPress: () => setEditingRecurring(preset) },
        { text: "Edit recurring expense", onPress: () => openEditPreset(preset) },
        {
          text: "Delete this month's log",
          style: "destructive",
          onPress: () => confirmDeleteLog(preset),
        },
        {
          text: "Delete recurring expense",
          style: "destructive",
          onPress: () => confirmDeletePreset(preset),
        },
        { text: "Cancel", style: "cancel" },
      ]);
      return;
    }

    Alert.alert("Manage recurring expense", undefined, [
      { text: "Edit", onPress: () => openEditPreset(preset) },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => confirmDeletePreset(preset),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  return (
    <SlideInView style={styles.screen}>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingBottom:
            insets.bottom + TAB_BAR_BOTTOM_MARGIN + TAB_BAR_HEIGHT + Spacing.md,
        },
      ]}
      onScroll={(e) =>
        useScrollStore.getState().onScroll(e.nativeEvent.contentOffset.y)
      }
      scrollEventThrottle={16}
    >
      <View>
        <Text style={styles.title}>Expenses</Text>
        <Text style={styles.subtitle}>
          ₱{totalThisMonth.toLocaleString()} this month
        </Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recurring</Text>
        {unloggedPresets.length > 0 && (
          <Pressable
            style={styles.logAllButton}
            onPress={() => logAllRecurring.mutate(unloggedPresets)}
          >
            <Text style={styles.logAllButtonText}>Log all recurring</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.list}>
        {recurring.map((preset) => (
          <PresetCard
            key={preset.localId}
            name={preset.name}
            defaultAmount={preset.defaultAmount}
            isLogged={preset.isLogged}
            loggedAmount={preset.loggedAmount}
            color={preset.color}
            icon={preset.icon}
            onLog={() => logPreset.mutate(preset)}
            onLongPress={() => handleRecurringLongPress(preset)}
          />
        ))}
      </View>

      <Pressable
        style={styles.dashedButton}
        onPress={() => {
          setEditingPreset(null);
          setPresetModalVisible(true);
        }}
      >
        <Text style={styles.dashedButtonText}>+ Add recurring expense</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>One-offs</Text>
        <Text style={styles.sectionCount}>{oneOffs.length} items</Text>
      </View>

      <View style={styles.list}>
        {oneOffs.map((expense) => (
          <OneOffRow
            key={expense.localId}
            name={expense.name}
            amount={expense.amount}
            expenseDate={expense.expenseDate}
            onLongPress={() => handleOneOffLongPress(expense)}
          />
        ))}
      </View>

      <Pressable
        style={styles.dashedButton}
        onPress={() => {
          setEditingOneOff(null);
          setOneOffModalVisible(true);
        }}
      >
        <Text style={styles.dashedButtonText}>+ Add one-off expense</Text>
      </Pressable>

      <AddOneOffModal
        visible={oneOffModalVisible}
        onClose={() => setOneOffModalVisible(false)}
        initialValues={
          editingOneOff
            ? {
                name: editingOneOff.name ?? "",
                amount: editingOneOff.amount,
                note: editingOneOff.note,
              }
            : null
        }
        onSubmit={(input) => {
          if (editingOneOff) {
            updateOneOff.mutate({ localId: editingOneOff.localId, input });
          } else {
            createOneOff.mutate(input);
          }
          setOneOffModalVisible(false);
        }}
      />

      <AddPresetModal
        visible={presetModalVisible}
        onClose={() => setPresetModalVisible(false)}
        initialValues={
          editingPreset
            ? {
                name: editingPreset.name,
                defaultAmount: editingPreset.defaultAmount,
                icon: editingPreset.icon ?? "",
                color: editingPreset.color ?? "",
              }
            : null
        }
        onSubmit={(input) => {
          if (editingPreset) {
            updatePreset.mutate({ localId: editingPreset.localId, input: { ...input, isRecurring: true } });
          } else {
            createPreset.mutate({ ...input, isRecurring: true });
          }
          setPresetModalVisible(false);
        }}
      />

      <EditLoggedExpenseModal
        visible={editingRecurring !== null}
        title={`Edit ${editingRecurring?.name ?? "Expense"}`}
        initialValues={
          editingRecurring?.expense
            ? {
                amount: editingRecurring.expense.amount,
                note: editingRecurring.expense.note,
              }
            : null
        }
        onClose={() => setEditingRecurring(null)}
        onSubmit={(input) => {
          if (editingRecurring?.expense) {
            updateLoggedExpense.mutate({
              localId: editingRecurring.expense.localId,
              ...input,
            });
          }
          setEditingRecurring(null);
        }}
      />
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
  },
  sectionCount: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
  logAllButton: {
    backgroundColor: Colors.mintFill,
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  logAllButtonText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.sm,
    color: Colors.primary,
  },
  list: {
    gap: Spacing.sm,
  },
  dashedButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.mintAccent,
    backgroundColor: Colors.mintFill,
    borderRadius: 16,
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  dashedButtonText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.base,
    color: Colors.primary,
  },
});
