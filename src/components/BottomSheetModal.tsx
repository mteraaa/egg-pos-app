import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  ScrollView,
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
        <Animated.View
          style={[
            styles.sheet,
            cardStyle,
            styles.sheetClip,
            { transform: [{ translateY }] },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={cardStyle}
          >
            {children}
          </ScrollView>
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
  sheet: {
    maxHeight: Dimensions.get("window").height * 0.85,
  },
  sheetClip: {
    overflow: "hidden",
    padding: 0,
    gap: 0,
  },
});
