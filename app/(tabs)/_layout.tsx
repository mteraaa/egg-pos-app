import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
  return (
    <Tabs
      screenOptions={{
        header: () => <Header />,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: Typography.fontFamily.medium,
          fontSize: Typography.size.xs,
        },
        tabBarStyle: {
          height: 60,
          paddingTop: Spacing.xs,
          paddingBottom: Spacing.xs,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Sales",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="egg" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="production"
        options={{
          title: "Production",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="leaf" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: "Expenses",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
