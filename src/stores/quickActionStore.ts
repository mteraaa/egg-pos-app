import { create } from "zustand";

type QuickAction = "sale" | "production";

interface QuickActionStore {
  pendingAction: QuickAction | null;
  setPendingAction: (action: QuickAction) => void;
  clearPendingAction: () => void;
}

export const useQuickActionStore = create<QuickActionStore>((set) => ({
  pendingAction: null,
  setPendingAction: (action) => set({ pendingAction: action }),
  clearPendingAction: () => set({ pendingAction: null }),
}));
