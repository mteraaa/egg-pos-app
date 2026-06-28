import { useState } from "react";
import { Text, Pressable, StyleSheet, TextInput, View } from "react-native";
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

interface ProductionContentProps extends ProductionSizeCardProps {
  status: StockStatus;
}

type SizeCardProps = SalesSizeCardProps | ProductionSizeCardProps;

type StockStatus = "ok" | "low" | "negative";

function getStockStatus(
  stockTrays: number,
  lowStockThreshold: number
): StockStatus {
  if (stockTrays < 0) return "negative";
  if (stockTrays <= lowStockThreshold) return "low";
  return "ok";
}

const STATUS_CARD_FILL: Record<StockStatus, string> = {
  ok: Colors.surface,
  low: Colors.warningFill,
  negative: Colors.errorFill,
};

const STATUS_BADGE_FILL: Record<StockStatus, string> = {
  ok: Colors.infoFill,
  low: Colors.warning,
  negative: Colors.error,
};

const STATUS_BADGE_TEXT: Record<StockStatus, string> = {
  ok: Colors.textSecondary,
  low: Colors.textOnGreen,
  negative: Colors.textOnGreen,
};

const STATUS_LABEL: Record<StockStatus, string> = {
  ok: "OK",
  low: "LOW",
  negative: "NEGATIVE",
};

const SizeCard = (props: SizeCardProps) => {
  const { label, onPress } = props;
  const status =
    props.variant === "production"
      ? getStockStatus(props.stockTrays, props.lowStockThreshold ?? 0)
      : null;

  return (
    <Pressable
      style={[
        styles.card,
        status ? { backgroundColor: STATUS_CARD_FILL[status] } : null,
      ]}
      onPress={onPress}
    >
      <View style={styles.headerRow}>
        <Text style={styles.size}>{label}</Text>
        {status && (
          <View
            style={[styles.badge, { backgroundColor: STATUS_BADGE_FILL[status] }]}
          >
            <Text style={[styles.badgeText, { color: STATUS_BADGE_TEXT[status] }]}>
              {STATUS_LABEL[status]}
            </Text>
          </View>
        )}
      </View>
      {props.variant === "sales" ? (
        <SalesContent {...props} />
      ) : (
        <ProductionContent {...props} status={status!} />
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

const STATUS_VALUE_COLOR: Record<StockStatus, string> = {
  ok: Colors.primaryDark,
  low: Colors.warning,
  negative: Colors.error,
};

const ProductionContent = ({
  stockTrays,
  collectedTrays,
  status,
}: ProductionContentProps) => {
  return (
    <>
      <Text style={[styles.primaryValue, { color: STATUS_VALUE_COLOR[status] }]}>
        {stockTrays.toFixed(2)} trays
      </Text>
      <Text style={styles.secondaryValue}>trays on hand</Text>
      <View style={styles.collectedPill}>
        <Text style={styles.collectedPillText}>
          +{collectedTrays.toFixed(2)} collected
        </Text>
      </View>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  size: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.lg,
    color: Colors.textPrimary,
  },
  badge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: Typography.fontFamily.semibold,
    fontSize: Typography.size.xs,
  },
  collectedPill: {
    alignSelf: "flex-start",
    backgroundColor: Colors.mintFill,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  collectedPillText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
    color: Colors.primary,
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
