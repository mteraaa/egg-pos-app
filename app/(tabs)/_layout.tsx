import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router/tabs";
import { StyleSheet, useWindowDimensions } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  FloatingTabBarBackground,
  getFloatingTabBarStyle,
  TabBarIcon,
} from "../../src/components/FloatingTabBar";
import MonthSwitcher from "../../src/components/MonthSwitcher";
import { Colors, Gradient, Spacing, Typography } from "../../src/constants/theme";
import { useMonthStore } from "../../src/stores/monthStore";

const styles = StyleSheet.create({
  headerSafeArea: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    alignItems: "center",
  },
});

function Header() {
  const { month, goToPreviousMonth, goToNextMonth } = useMonthStore();

  return (
    <LinearGradient colors={Gradient.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <SafeAreaView style={styles.headerSafeArea} edges={["top"]}>
        <MonthSwitcher
          month={month}
          onPrevious={goToPreviousMonth}
          onNext={goToNextMonth}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamily.medium,
          fontSize: Typography.size.xs,
        },
        tabBarItemStyle: {
          paddingTop: Spacing.sm,
        },
        tabBarBackground: () => <FloatingTabBarBackground />,
        tabBarStyle: getFloatingTabBarStyle(insets, width),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="stats-chart" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="egg" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="production"
        options={{
          title: "Production",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="leaf" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ color, size, focused }) => (
            <TabBarIcon name="document-text" color={color} size={size} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
