import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import BottomSheetModal from "./BottomSheetModal";
import { styles as detailStyles } from "../screens/SalesDetailScreen.styles";

export interface LoggedExpenseInput {
  amount: number;
  note: string | null;
}

interface EditLoggedExpenseModalProps {
  visible: boolean;
  title: string;
  initialValues: LoggedExpenseInput | null;
  onClose: () => void;
  onSubmit: (input: LoggedExpenseInput) => void;
}

const EditLoggedExpenseModal = ({
  visible,
  title,
  initialValues,
  onClose,
  onSubmit,
}: EditLoggedExpenseModalProps) => {
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (visible) {
      setAmount(initialValues ? String(initialValues.amount) : "");
      setNote(initialValues?.note ?? "");
    }
  }, [visible, initialValues]);

  const submit = () => {
    const parsedAmount = parseFloat(amount) || 0;
    if (parsedAmount <= 0) return;
    onSubmit({ amount: parsedAmount, note: note.trim() ? note.trim() : null });
  };

  return (
    <BottomSheetModal
      visible={visible}
      onRequestClose={onClose}
      cardStyle={detailStyles.modalCard}
    >
      <Text style={detailStyles.modalTitle}>{title}</Text>

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

export default EditLoggedExpenseModal;
