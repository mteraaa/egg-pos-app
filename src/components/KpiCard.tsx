import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { Gradient, Radius, Spacing, Typography } from "../constants/theme";

interface KpiCardProps {
  label: string;
  value: string;
  changeLabel: string | null;
  captionLabel: string;
}

const KpiCard = ({ label, value, changeLabel, captionLabel }: KpiCardProps) => {
  return (
    <LinearGradient
      colors={Gradient.brand}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {changeLabel && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{changeLabel}</Text>
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.caption}>{captionLabel}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.base,
    color: "rgba(255,255,255,0.92)",
  },
  badge: {
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.xs,
    color: "#FFFFFF",
  },
  value: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size["2xl"],
    color: "#FFFFFF",
  },
  caption: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: "rgba(255,255,255,0.85)",
  },
});

export default KpiCard;
