import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  TAB_BAR_BOTTOM_MARGIN,
  TAB_BAR_HEIGHT,
} from "../../src/components/FloatingTabBar";
import AddOneOffModal from "../../src/components/AddOneOffModal";
import AddPresetModal from "../../src/components/AddPresetModal";
import OneOffRow from "../../src/components/OneOffRow";
import PresetCard from "../../src/components/PresetCard";
import { Colors, Spacing, Typography } from "../../src/constants/theme";
import {
  useCreateOneOffExpense,
  useCreatePreset,
  useExpensesSummary,
  useLogAllRecurring,
  useLogPreset,
} from "../../src/hooks/useExpenses";
import { useMonthStore } from "../../src/stores/monthStore";

export default function ExpensesScreen() {
  const month = useMonthStore((state) => state.month);
  const { data } = useExpensesSummary(month);
  const logPreset = useLogPreset(month);
  const logAllRecurring = useLogAllRecurring(month);
  const createOneOff = useCreateOneOffExpense(month);
  const createPreset = useCreatePreset(month);
  const insets = useSafeAreaInsets();

  const recurring = data?.recurring ?? [];
  const oneOffs = data?.oneOffs ?? [];
  const totalThisMonth = data?.totalThisMonth ?? 0;
  const unloggedPresets = recurring.filter((preset) => !preset.isLogged);

  const [oneOffModalVisible, setOneOffModalVisible] = useState(false);
  const [presetModalVisible, setPresetModalVisible] = useState(false);

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
          />
        ))}
      </View>

      <Pressable
        style={styles.dashedButton}
        onPress={() => setPresetModalVisible(true)}
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
          />
        ))}
      </View>

      <Pressable
        style={styles.dashedButton}
        onPress={() => setOneOffModalVisible(true)}
      >
        <Text style={styles.dashedButtonText}>+ Add one-off expense</Text>
      </Pressable>

      <AddOneOffModal
        visible={oneOffModalVisible}
        onClose={() => setOneOffModalVisible(false)}
        onSubmit={(input) => {
          createOneOff.mutate(input);
          setOneOffModalVisible(false);
        }}
      />

      <AddPresetModal
        visible={presetModalVisible}
        onClose={() => setPresetModalVisible(false)}
        onSubmit={(input) => {
          createPreset.mutate({ ...input, isRecurring: true });
          setPresetModalVisible(false);
        }}
      />
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
