import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Radius, Spacing, Typography } from "../constants/theme";
import { useQuickActionStore } from "../stores/quickActionStore";
import { getFabStyle } from "./FloatingTabBar";

export default function QuickActionFab() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const fabStyle = getFabStyle(insets, width);
  const [menuOpen, setMenuOpen] = useState(false);
  const setPendingAction = useQuickActionStore((state) => state.setPendingAction);

  const selectAction = (action: "sale" | "production") => {
    setMenuOpen(false);
    setPendingAction(action);
    router.push(action === "sale" ? "/(tabs)/sales" : "/(tabs)/production");
  };

  return (
    <>
      <Pressable
        style={[styles.addButton, fabStyle]}
        onPress={() => setMenuOpen(true)}
        hitSlop={8}
      >
        <Ionicons name="add" size={24} color={Colors.textOnGreen} />
      </Pressable>

      <Modal
        visible={menuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
          <View
            style={[
              styles.menu,
              {
                right: width - (fabStyle.left + fabStyle.width),
                bottom: fabStyle.bottom + fabStyle.height + Spacing.sm,
              },
            ]}
          >
            <Pressable style={styles.menuItem} onPress={() => selectAction("sale")}>
              <Ionicons name="egg" size={18} color={Colors.primary} />
              <Text style={styles.menuItemText}>Log Sale</Text>
            </Pressable>
            <View style={styles.menuDivider} />
            <Pressable
              style={styles.menuItem}
              onPress={() => selectAction("production")}
            >
              <Ionicons name="leaf" size={18} color={Colors.primary} />
              <Text style={styles.menuItemText}>Log Production</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    borderRadius: 9999,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  backdrop: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xs,
    minWidth: 190,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  menuItemText: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.base,
    color: Colors.textPrimary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.sm,
  },
});
