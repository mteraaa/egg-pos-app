import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Radius, Spacing, Typography } from "../constants/theme";
import { formatMonthLabel } from "../utils/date";

interface MonthSwitcherProps {
  month: string;
  onPrevious: () => void;
  onNext: () => void;
}

const MonthSwitcher = ({ month, onPrevious, onNext }: MonthSwitcherProps) => {
  return (
    <View style={styles.pill}>
      <Pressable
        onPress={onPrevious}
        style={styles.arrowButton}
        hitSlop={8}
      >
        <Ionicons name="chevron-back" size={18} color={Colors.textOnGreen} />
      </Pressable>
      <Text style={styles.label}>{formatMonthLabel(month)}</Text>
      <Pressable onPress={onNext} style={styles.arrowButton} hitSlop={8}>
        <Ionicons name="chevron-forward" size={18} color={Colors.textOnGreen} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: Radius.full,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  arrowButton: {
    padding: 2,
  },
  label: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.base,
    color: Colors.textOnGreen,
    minWidth: 120,
    textAlign: "center",
  },
});

export default MonthSwitcher;
