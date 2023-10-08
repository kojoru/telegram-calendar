CREATE TABLE IF NOT EXISTS settings (
  name text PRIMARY KEY,
  createdDate text NOT NULL,
  updatedDate text NOT NULL,
  value text NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id integer PRIMARY KEY AUTOINCREMENT,
  createdDate text NOT NULL,
  updatedDate text NOT NULL,
  message text NOT NULL,
  updateId text NOT NULL
);

CREATE TABLE IF NOT EXISTS initDataCheck (
  id integer PRIMARY KEY AUTOINCREMENT,
  createdDate text NOT NULL,
  updatedDate text NOT NULL,
  initData text NOT NULL,
  expectedHash text NOT NULL,
  calculatedHash text NOT NULL
);
