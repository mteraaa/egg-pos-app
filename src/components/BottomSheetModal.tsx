import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Modal,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

interface BottomSheetModalProps {
  visible: boolean;
  onRequestClose: () => void;
  cardStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const SLIDE_DISTANCE = 320;

export default function BottomSheetModal({
  visible,
  onRequestClose,
  cardStyle,
  children,
}: BottomSheetModalProps) {
  const translateY = useRef(new Animated.Value(SLIDE_DISTANCE)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SLIDE_DISTANCE,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[cardStyle, { transform: [{ translateY }] }]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
});
