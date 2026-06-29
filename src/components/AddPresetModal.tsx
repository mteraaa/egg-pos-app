import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors, Spacing } from "../constants/theme";
import { styles as detailStyles } from "../screens/SalesDetailScreen.styles";
import BottomSheetModal from "./BottomSheetModal";
import { PRESET_ICON_OPTIONS } from "./PresetCard";

export interface PresetInput {
  name: string;
  defaultAmount: number;
  icon: string;
  color: string;
}

interface AddPresetModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: PresetInput) => void;
}

const AddPresetModal = ({ visible, onClose, onSubmit }: AddPresetModalProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    if (visible) {
      setName("");
      setAmount("");
      setIconIndex(0);
    }
  }, [visible]);

  const submit = () => {
    const parsedAmount = parseFloat(amount) || 0;
    if (!name.trim() || parsedAmount <= 0) return;
    const { icon, color } = PRESET_ICON_OPTIONS[iconIndex];
    onSubmit({ name: name.trim(), defaultAmount: parsedAmount, icon, color });
  };

  return (
    <BottomSheetModal
      visible={visible}
      onRequestClose={onClose}
      cardStyle={detailStyles.modalCard}
    >
          <Text style={detailStyles.modalTitle}>Add Recurring Expense</Text>

          <View style={detailStyles.field}>
            <Text style={detailStyles.fieldLabel}>Name</Text>
            <TextInput
              style={detailStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Feeds"
            />
          </View>

          <View style={detailStyles.field}>
            <Text style={detailStyles.fieldLabel}>Default amount (₱)</Text>
            <TextInput
              style={detailStyles.input}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
            />
          </View>

          <View style={styles.iconField}>
            <Text style={detailStyles.fieldLabel}>Icon</Text>
            <View style={styles.iconRow}>
              {PRESET_ICON_OPTIONS.map((option, index) => (
                <Pressable
                  key={option.icon}
                  style={[
                    styles.iconOption,
                    { backgroundColor: option.color },
                    iconIndex === index && styles.iconOptionActive,
                  ]}
                  onPress={() => setIconIndex(index)}
                >
                  <Ionicons name={option.icon} size={18} color={Colors.textPrimary} />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={detailStyles.modalActions}>
            <Pressable
              style={[detailStyles.modalButton, detailStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={detailStyles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[detailStyles.modalButton, detailStyles.saveButton]}
              onPress={submit}
            >
              <Text style={detailStyles.saveButtonText}>Save</Text>
            </Pressable>
          </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  iconField: {
    gap: Spacing.xs,
  },
  iconRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  iconOption: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconOptionActive: {
    borderColor: Colors.primary,
  },
});

export default AddPresetModal;
