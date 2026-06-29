import { useFocusEffect } from "@react-navigation/native";
import { router, usePathname } from "expo-router";
import { useCallback } from "react";
import { useWindowDimensions, type StyleProp, type ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TAB_ORDER } from "../constants/tabs";
import { useTabTransitionStore } from "../stores/tabTransitionStore";

interface SlideInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SLIDE_DURATION = 280;
const SWIPE_EXIT_DURATION = 200;
const SWIPE_DISTANCE_RATIO = 0.22;
const SWIPE_ACTIVATION_OFFSET = 20;
const SWIPE_FAIL_OFFSET = 15;

function commitSwipeNavigation(goingForward: boolean, targetIndex: number) {
  useTabTransitionStore
    .getState()
    .setDirection(goingForward ? "forward" : "backward");
  router.push(`/(tabs)/${TAB_ORDER[targetIndex]}`);
}

export default function SlideInView({ children, style }: SlideInViewProps) {
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const translateX = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      const direction = useTabTransitionStore.getState().direction;
      translateX.value = direction === "backward" ? -width : width;
      translateX.value = withTiming(0, {
        duration: SLIDE_DURATION,
        easing: Easing.out(Easing.cubic),
      });
    }, [translateX, width])
  );

  const pan = Gesture.Pan()
    .activeOffsetX([-SWIPE_ACTIVATION_OFFSET, SWIPE_ACTIVATION_OFFSET])
    .failOffsetY([-SWIPE_FAIL_OFFSET, SWIPE_FAIL_OFFSET])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const currentIndex = TAB_ORDER.findIndex((tab) =>
        pathname.startsWith(`/${tab}`)
      );
      const goingForward = event.translationX < 0;
      const targetIndex = goingForward ? currentIndex + 1 : currentIndex - 1;
      const canNavigate =
        currentIndex !== -1 &&
        targetIndex >= 0 &&
        targetIndex < TAB_ORDER.length &&
        Math.abs(event.translationX) >= width * SWIPE_DISTANCE_RATIO;

      if (!canNavigate) {
        translateX.value = withTiming(0, { duration: SWIPE_EXIT_DURATION });
        return;
      }

      translateX.value = withTiming(goingForward ? -width : width, {
        duration: SWIPE_EXIT_DURATION,
      });
      runOnJS(commitSwipeNavigation)(goingForward, targetIndex);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </GestureDetector>
  );
}
