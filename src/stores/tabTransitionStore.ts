import { create } from "zustand";

type Direction = "forward" | "backward";

interface TabTransitionStore {
  direction: Direction;
  setDirection: (direction: Direction) => void;
}

export const useTabTransitionStore = create<TabTransitionStore>((set) => ({
  direction: "forward",
  setDirection: (direction) => set({ direction }),
}));
