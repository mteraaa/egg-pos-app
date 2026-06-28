import { useState } from "react";
import { Text, Pressable, StyleSheet, TextInput } from "react-native";
import { Colors, Typography, Spacing, Radius } from "../constants/theme";

interface SizeCardBaseProps {
  label: string;
  onPress: () => void;
}

interface SalesSizeCardProps extends SizeCardBaseProps {
  variant: "sales";
  price: number;
  totalSales: number;
  totalTrays: number;
  onPriceChange: (price: number) => void;
}

interface ProductionSizeCardProps extends SizeCardBaseProps {
  variant: "production";
  stockTrays: number;
  collectedTrays: number;
  lowStockThreshold?: number;
}

type SizeCardProps = SalesSizeCardProps | ProductionSizeCardProps;

const SizeCard = (props: SizeCardProps) => {
  const { label, onPress } = props;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.size}>{label}</Text>
      {props.variant === "sales" ? (
        <SalesContent {...props} />
      ) : (
        <ProductionContent {...props} />
      )}
    </Pressable>
  );
};

const SalesContent = ({
  price,
  totalSales,
  totalTrays,
  onPriceChange,
}: SalesSizeCardProps) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(price));

  const commit = () => {
    const parsed = parseFloat(draft);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onPriceChange(parsed);
    } else {
      setDraft(String(price));
    }
    setEditing(false);
  };

  return (
    <>
      {editing ? (
        <Pressable style={styles.pricePill} onPress={() => {}}>
          <Text style={styles.pricePillText}>₱</Text>
          <TextInput
            style={styles.priceInput}
            value={draft}
            onChangeText={setDraft}
            keyboardType="decimal-pad"
            autoFocus
            selectTextOnFocus
            onSubmitEditing={commit}
            onBlur={commit}
          />
          <Text style={styles.pricePillText}>/tray</Text>
        </Pressable>
      ) : (
        <Pressable
          style={styles.pricePill}
          onPress={() => {
            setDraft(String(price));
            setEditing(true);
          }}
        >
          <Text style={styles.pricePillText}>₱{price.toFixed(0)}/tray</Text>
        </Pressable>
      )}
      <Text style={styles.primaryValue}>₱{totalSales.toLocaleString()}</Text>
      <Text style={styles.secondaryValue}>{totalTrays.toFixed(2)} trays</Text>
    </>
  );
};

const ProductionContent = ({
  stockTrays,
  collectedTrays,
  lowStockThreshold = 0,
}: ProductionSizeCardProps) => {
  const stockColor =
    stockTrays < 0
      ? Colors.error
      : stockTrays <= lowStockThreshold
      ? Colors.warning
      : Colors.primaryDark;

  return (
    <>
      <Text style={[styles.primaryValue, { color: stockColor }]}>
        {stockTrays.toFixed(2)} trays
      </Text>
      <Text style={styles.secondaryValue}>
        +{collectedTrays.toFixed(2)} trays collected
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  size: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
  },
  pricePill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  pricePillText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: Colors.primary,
  },
  priceInput: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.sm,
    color: Colors.primary,
    minWidth: 32,
    padding: 0,
  },
  primaryValue: {
    fontFamily: Typography.fontFamily.bold,
    fontSize: Typography.size["2xl"],
    color: Colors.textPrimary,
  },
  secondaryValue: {
    fontFamily: Typography.fontFamily.regular,
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
  },
});

export default SizeCard;
