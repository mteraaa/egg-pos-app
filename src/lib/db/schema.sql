CREATE TABLE IF NOT EXISTS size_pricing (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  size_key TEXT NOT NULL UNIQUE,
  unit_price REAL NOT NULL DEFAULT 0,
  unit_cost REAL NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  local_id TEXT NOT NULL UNIQUE,
  server_id TEXT,
  size_key TEXT NOT NULL,
  quantity_pieces INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total REAL NOT NULL,
  customer_note TEXT,
  sale_date TEXT NOT NULL,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS egg_collections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  local_id TEXT NOT NULL UNIQUE,
  server_id TEXT,
  size_key TEXT NOT NULL,
  quantity_pieces INTEGER NOT NULL,
  collection_date TEXT NOT NULL,
  note TEXT,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS expense_presets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  local_id TEXT NOT NULL UNIQUE,
  server_id TEXT,
  name TEXT NOT NULL,
  default_amount REAL NOT NULL DEFAULT 0,
  is_recurring INTEGER NOT NULL DEFAULT 0,
  color TEXT,
  icon TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  local_id TEXT NOT NULL UNIQUE,
  server_id TEXT,
  preset_id TEXT,
  name TEXT,
  amount REAL NOT NULL,
  note TEXT,
  expense_date TEXT NOT NULL,
  is_one_off INTEGER NOT NULL DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'pending',
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS monthly_periods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  month TEXT NOT NULL UNIQUE,        -- "2026-06"
  status TEXT NOT NULL DEFAULT 'open',
  opening_stock TEXT NOT NULL DEFAULT '{}',  -- JSON blob: { large: 12, ... }
  closed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_sales_date_size ON sales (sale_date, size_key);
CREATE INDEX IF NOT EXISTS idx_collections_date_size ON egg_collections (collection_date, size_key);
CREATE INDEX IF NOT EXISTS idx_expenses_date_preset ON expenses (expense_date, preset_id);
