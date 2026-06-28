import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { ColorValue, Platform, StyleSheet, View } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";
import { Colors, Radius, Spacing } from "../constants/theme";

export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_BOTTOM_MARGIN = Spacing.md;
export const TAB_BAR_SIDE_MARGIN = Spacing.lg;

const styles = StyleSheet.create({
  blur: {
    flex: 1,
    borderRadius: Radius.full,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.14)",
  },
  sheen: {
    flex: 1,
    borderRadius: Radius.full,
  },
  edgeHighlight: {
    ...StyleSheet.absoluteFill,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.85)",
    borderLeftColor: "rgba(255, 255, 255, 0.6)",
    borderRightColor: "rgba(255, 255, 255, 0.25)",
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    marginTop: 3,
  },
});

export function getFloatingTabBarStyle(insets: EdgeInsets) {
  return {
    position: "absolute" as const,
    left: TAB_BAR_SIDE_MARGIN,
    right: TAB_BAR_SIDE_MARGIN,
    bottom: insets.bottom + TAB_BAR_BOTTOM_MARGIN,
    height: TAB_BAR_HEIGHT,
    borderRadius: Radius.full,
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
  };
}

export function FloatingTabBarBackground() {
  return (
    <BlurView
      intensity={80}
      tint="light"
      blurMethod={Platform.OS === "android" ? "dimezisBlurView" : "none"}
      style={styles.blur}
    >
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.05)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.sheen}
      />
      <View style={styles.edgeHighlight} />
    </BlurView>
  );
}

export function TabBarIcon({
  name,
  color,
  size,
  focused,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: ColorValue;
  size: number;
  focused: boolean;
}) {
  return (
    <View style={{ alignItems: "center" }}>
      <Ionicons name={name} size={size} color={color} />
      <View style={[styles.activeDot, { opacity: focused ? 1 : 0 }]} />
    </View>
  );
}
