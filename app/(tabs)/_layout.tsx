import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router/tabs";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTabBar from "../../src/components/CustomTabBar";
import MonthSwitcher from "../../src/components/MonthSwitcher";
import QuickActionFab from "../../src/components/QuickActionFab";
import { Gradient, Spacing } from "../../src/constants/theme";
import { useMonthStore } from "../../src/stores/monthStore";

const HEADER_VERTICAL_PADDING_RATIO = 0.018;

const styles = StyleSheet.create({
  headerSafeArea: {
    paddingHorizontal: Spacing.md,
    alignItems: "center",
  },
});

function Header() {
  const { month, goToPreviousMonth, goToNextMonth } = useMonthStore();
  const { height } = useWindowDimensions();
  const verticalPadding = Math.max(Spacing.sm, height * HEADER_VERTICAL_PADDING_RATIO);

  return (
    <LinearGradient colors={Gradient.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <SafeAreaView
        style={[
          styles.headerSafeArea,
          { paddingTop: verticalPadding, paddingBottom: verticalPadding },
        ]}
        edges={["top"]}
      >
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
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          header: () => <Header />,
          tabBarStyle: { display: "none" },
          lazy: false,
        }}
      >
        <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
        <Tabs.Screen name="sales" options={{ title: "Sales" }} />
        <Tabs.Screen name="production" options={{ title: "Production" }} />
        <Tabs.Screen name="expenses" options={{ title: "Expenses" }} />
      </Tabs>
      <CustomTabBar />
      <QuickActionFab />
    </View>
  );
}
