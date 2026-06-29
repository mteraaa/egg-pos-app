import { create } from "zustand";

const DIRECTION_THRESHOLD = 6;
const TOP_BUFFER = 40;

interface ScrollStore {
  hidden: boolean;
  lastOffset: number;
  onScroll: (offsetY: number) => void;
}

export const useScrollStore = create<ScrollStore>((set, get) => ({
  hidden: false,
  lastOffset: 0,
  onScroll: (offsetY) => {
    const { lastOffset, hidden } = get();
    const delta = offsetY - lastOffset;

    if (Math.abs(delta) < DIRECTION_THRESHOLD) return;

    const shouldHide = delta > 0 && offsetY > TOP_BUFFER;
    const shouldShow = delta < 0 || offsetY <= TOP_BUFFER;

    if (shouldHide && !hidden) {
      set({ hidden: true, lastOffset: offsetY });
    } else if (shouldShow && hidden) {
      set({ hidden: false, lastOffset: offsetY });
    } else {
      set({ lastOffset: offsetY });
    }
  },
}));
