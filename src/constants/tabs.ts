export const TAB_ORDER = ["dashboard", "sales", "production", "expenses"] as const;

export type TabName = (typeof TAB_ORDER)[number];
