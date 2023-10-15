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

CREATE TABLE IF NOT EXISTS users (
	id integer PRIMARY KEY AUTOINCREMENT,
	createdDate text NOT NULL,
	updatedDate text NOT NULL,
	lastAuthTimestamp text NOT NULL,
	telegramId integer UNIQUE NOT NULL,
	username text,
	isBot integer,
	firstName text,
	lastName text,
	languageCode text,
	isPremium integer,
	addedToAttachmentMenu integer,
	allowsWriteToPm integer,
	photoUrl text
);

CREATE TABLE IF NOT EXISTS tokens (
	id integer PRIMARY KEY AUTOINCREMENT,
	createdDate text NOT NULL,
	updatedDate text NOT NULL,
	expiredDate text NOT NULL,
	tokenHash text UNIQUE NOT NULL,
	userId integer NOT NULL,
	FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS calendars (
	id integer PRIMARY KEY AUTOINCREMENT,
	createdDate text NOT NULL,
	updatedDate text NOT NULL,
	userId integer NOT NULL,
	calendarJson text NOT NULL,
	calendarRef text NOT NULL,
	FOREIGN KEY(userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS selectedDates (
	id integer PRIMARY KEY AUTOINCREMENT,
	createdDate text NOT NULL,
	updatedDate text NOT NULL,
	userId integer NOT NULL,
	calendarId integer NOT NULL,
	selectedDatesJson text NOT NULL,
	FOREIGN KEY(userId) REFERENCES users(id),
	FOREIGN KEY(calendarId) REFERENCES calendars(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS userSelectedDatesIndex ON selectedDates (userId, calendarId);

CREATE UNIQUE INDEX IF NOT EXISTS tokenHashIndex ON tokens (tokenHash);
CREATE UNIQUE INDEX IF NOT EXISTS telegramIdIndex ON users (telegramId);