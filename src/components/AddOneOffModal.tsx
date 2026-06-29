import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import BottomSheetModal from "./BottomSheetModal";
import { styles as detailStyles } from "../screens/SalesDetailScreen.styles";

export interface OneOffInput {
  name: string;
  amount: number;
  note: string | null;
}

interface AddOneOffModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: OneOffInput) => void;
  initialValues?: OneOffInput | null;
}

const AddOneOffModal = ({
  visible,
  onClose,
  onSubmit,
  initialValues,
}: AddOneOffModalProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (visible) {
      setName(initialValues?.name ?? "");
      setAmount(initialValues ? String(initialValues.amount) : "");
      setNote(initialValues?.note ?? "");
    }
  }, [visible, initialValues]);

  const submit = () => {
    const parsedAmount = parseFloat(amount) || 0;
    if (!name.trim() || parsedAmount <= 0) return;
    onSubmit({
      name: name.trim(),
      amount: parsedAmount,
      note: note.trim() ? note.trim() : null,
    });
  };

  return (
    <BottomSheetModal
      visible={visible}
      onRequestClose={onClose}
      cardStyle={detailStyles.modalCard}
    >
          <Text style={detailStyles.modalTitle}>
            {initialValues ? "Edit One-off Expense" : "Add One-off Expense"}
          </Text>

          <View style={detailStyles.field}>
            <Text style={detailStyles.fieldLabel}>Name</Text>
            <TextInput
              style={detailStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Vet visit"
            />
          </View>

          <View style={detailStyles.field}>
            <Text style={detailStyles.fieldLabel}>Amount (₱)</Text>
            <TextInput
              style={detailStyles.input}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              placeholder="0"
            />
          </View>

          <View style={detailStyles.field}>
            <Text style={detailStyles.fieldLabel}>Note (optional)</Text>
            <TextInput
              style={detailStyles.input}
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Annual checkup"
            />
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

export default AddOneOffModal;
