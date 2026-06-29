import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, Radius, Spacing, Typography } from "../constants/theme";
import { TRAY_SIZE } from "../constants/sizes";

interface CollectionRowProps {
  date: string;
  quantityPieces: number;
  note?: string | null;
  onLongPress?: () => void;
}

const CollectionRow = ({
  date,
  quantityPieces,
  note,
  onLongPress,
}: CollectionRowProps) => {
  const trays = quantityPieces / TRAY_SIZE;

  return (
    <Pressable style={styles.row} onLongPress={onLongPress} delayLongPress={400}>
      <View style={styles.left}>
        <Text style={styles.date}>{date}</Text>
        {note ? <Text style={styles.note}>{note}</Text> : null}
      </View>
      <Text style={styles.trays}>+{trays.toFixed(2)} trays</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
  },
  left: {
    gap: 2,
  },
  date: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
  },
  note: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
  trays: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size.md,
    color: Colors.primaryDark,
  },
});

export default CollectionRow;
