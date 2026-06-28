import { create } from "zustand";
import { currentMonthKey, shiftMonthKey } from "../utils/date";

interface MonthStore {
  month: string; // "YYYY-MM"
  setMonth: (month: string) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export const useMonthStore = create<MonthStore>((set) => ({
  month: currentMonthKey(),
  setMonth: (month) => set({ month }),
  goToPreviousMonth: () =>
    set((state) => ({ month: shiftMonthKey(state.month, -1) })),
  goToNextMonth: () =>
    set((state) => ({ month: shiftMonthKey(state.month, 1) })),
}));
