import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_ORDER, type TabName } from "../constants/tabs";
import { Colors, Typography } from "../constants/theme";
import { useScrollStore } from "../stores/scrollStore";
import { useTabTransitionStore } from "../stores/tabTransitionStore";
import {
  FloatingTabBarBackground,
  getFloatingTabBarStyle,
  TabBarIcon,
} from "./FloatingTabBar";

const TAB_META: Record<TabName, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  dashboard: { label: "Dashboard", icon: "stats-chart" },
  sales: { label: "Sales", icon: "egg" },
  production: { label: "Production", icon: "leaf" },
  expenses: { label: "Expenses", icon: "document-text" },
};

const HIDE_ANIMATION_DURATION = 130;

export default function CustomTabBar() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const hidden = useScrollStore((state) => state.hidden);

  const barStyle = getFloatingTabBarStyle(insets, width);
  const fullWidth = barStyle.width as number;
  const animatedWidth = useRef(new Animated.Value(fullWidth)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: hidden ? 0 : fullWidth,
      duration: HIDE_ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [hidden, fullWidth, animatedWidth]);

  return (
    <Animated.View
      style={[
        barStyle,
        styles.container,
        { width: animatedWidth },
      ]}
    >
      <FloatingTabBarBackground />
      <Animated.View style={[styles.content, { width: fullWidth }]}>
        {TAB_ORDER.map((name, index) => {
          const focused = pathname.startsWith(`/${name}`);
          const meta = TAB_META[name];
          return (
            <Pressable
              key={name}
              style={styles.tabItem}
              onPress={() => {
                const currentIndex = TAB_ORDER.findIndex((t) =>
                  pathname.startsWith(`/${t}`)
                );
                useTabTransitionStore
                  .getState()
                  .setDirection(index >= currentIndex ? "forward" : "backward");
                router.push(`/(tabs)/${name}`);
              }}
            >
              <TabBarIcon
                name={meta.icon}
                color={focused ? Colors.primary : Colors.textSecondary}
                size={22}
                focused={focused}
              />
              <Text
                style={[
                  styles.label,
                  { color: focused ? Colors.primary : Colors.textSecondary },
                ]}
              >
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  content: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    flexDirection: "row",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  label: {
    fontFamily: Typography.fontFamily.medium,
    fontSize: Typography.size.xs,
  },
});
