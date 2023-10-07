CREATE TABLE IF NOT EXISTS settings (
  name text PRIMARY KEY,
  value text NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id integer PRIMARY KEY AUTOINCREMENT,
  message text NOT NULL
);
