import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Spacing, Typography } from "../constants/theme";

export interface PresetIconOption {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

export const PRESET_ICON_OPTIONS: PresetIconOption[] = [
  { icon: "leaf", color: "#FEF3C7" },
  { icon: "person", color: "#DBEAFE" },
  { icon: "bulb", color: "#FCE7F3" },
  { icon: "water", color: "#E0F2FE" },
  { icon: "car", color: "#EDE9FE" },
  { icon: "construct", color: "#FFE4E6" },
  { icon: "cart", color: "#DDF3C9" },
  { icon: "pricetag", color: "#F1F5F9" },
];

const DEFAULT_ICON_OPTION = PRESET_ICON_OPTIONS[PRESET_ICON_OPTIONS.length - 1];

interface PresetCardProps {
  name: string;
  defaultAmount: number;
  isLogged: boolean;
  loggedAmount: number;
  color: string | null;
  icon: string | null;
  onLog: () => void;
}

const PresetCard = ({
  name,
  defaultAmount,
  isLogged,
  loggedAmount,
  color,
  icon,
  onLog,
}: PresetCardProps) => {
  const swatchColor = color ?? DEFAULT_ICON_OPTION.color;
  const iconName = (icon ?? DEFAULT_ICON_OPTION.icon) as keyof typeof Ionicons.glyphMap;

  return (
    <View style={[styles.card, !isLogged && styles.cardPending]}>
      <View style={[styles.iconSwatch, { backgroundColor: swatchColor }]}>
        <Ionicons name={iconName} size={20} color={Colors.textPrimary} />
      </View>

      <View style={styles.body}>
        <Text style={styles.name}>{name}</Text>
        {isLogged ? (
          <Text style={styles.loggedText}>Logged ✓</Text>
        ) : (
          <Text style={styles.pendingText}>
            Not logged yet · default ₱{defaultAmount.toLocaleString()}
          </Text>
        )}
      </View>

      {isLogged ? (
        <Text style={styles.amount}>₱{loggedAmount.toLocaleString()}</Text>
      ) : (
        <Pressable style={styles.logButton} onPress={onLog} hitSlop={8}>
          <Text style={styles.logButtonText}>Log</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  cardPending: {
    borderColor: Colors.warning,
  },
  iconSwatch: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.md,
    color: Colors.textPrimary,
  },
  loggedText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: Colors.success,
  },
  pendingText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: Colors.warning,
  },
  amount: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.lg,
    color: Colors.error,
  },
  logButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  logButtonText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.sm,
    color: Colors.textOnGreen,
  },
});

export default PresetCard;
