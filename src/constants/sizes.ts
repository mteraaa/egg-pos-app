export type SizeKey =
  | "peewee"
  | "xs"
  | "small"
  | "medium"
  | "large"
  | "xl"
  | "jumbo"
  | "cracked";

export interface EggSizeDef {
  key: SizeKey;
  label: string;
  usedInSales: boolean;
  usedInProduction: boolean;
  isSpecial: boolean; // true = hidden by default, shown via "+ Add another" (cracked)
  sortOrder: number;
}

export const EGG_SIZES: EggSizeDef[] = [
  {
    key: "peewee",
    label: "Peewee",
    usedInSales: false,
    usedInProduction: true,
    isSpecial: false,
    sortOrder: 1,
  },
  {
    key: "xs",
    label: "Extra Small",
    usedInSales: false,
    usedInProduction: true,
    isSpecial: false,
    sortOrder: 2,
  },
  {
    key: "small",
    label: "Small",
    usedInSales: true,
    usedInProduction: true,
    isSpecial: false,
    sortOrder: 3,
  },
  {
    key: "medium",
    label: "Medium",
    usedInSales: true,
    usedInProduction: true,
    isSpecial: false,
    sortOrder: 4,
  },
  {
    key: "large",
    label: "Large",
    usedInSales: true,
    usedInProduction: true,
    isSpecial: false,
    sortOrder: 5,
  },
  {
    key: "xl",
    label: "X-Large",
    usedInSales: true,
    usedInProduction: true,
    isSpecial: false,
    sortOrder: 6,
  },
  {
    key: "jumbo",
    label: "Jumbo",
    usedInSales: true,
    usedInProduction: true,
    isSpecial: false,
    sortOrder: 7,
  },
  {
    key: "cracked",
    label: "Cracked",
    usedInSales: true,
    usedInProduction: true,
    isSpecial: true,
    sortOrder: 99,
  },
];

export const TRAY_SIZE = 30; // pieces per tray — unit conversion constant
