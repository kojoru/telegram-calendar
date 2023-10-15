class Database {
	constructor(databaseConnection) {
		this.db = databaseConnection;
	}

	async getSetting(settingName) {
		return await this.db.prepare("SELECT value FROM settings WHERE name = ?")
			.bind(settingName)
			.first('value');
	}

	async getLatestUpdateId() {
		let result = await this.db.prepare("SELECT updateId FROM messages ORDER BY updateId DESC LIMIT 1")
			.first('updateId');
		
		return Number(result);
	}

	async setSetting(settingName, settingValue) {
		return await this.db.prepare(
			`INSERT 
				INTO settings (createdDate, updatedDate, name, value)
				VALUES (DATETIME('now'), DATETIME('now'), ?, ?)
				ON CONFLICT(name) DO UPDATE SET
					updatedDate = DATETIME('now'),
					value = excluded.value
					WHERE excluded.value <> settings.value`
		  )
			.bind(settingName, settingValue)
			.run();
	}

	async addMessage(message, updateId) {
		return await this.db.prepare(
			`INSERT 
				INTO messages (createdDate, updatedDate, message, updateId)
				VALUES (DATETIME('now'), DATETIME('now'), ?, ?)`
		  )
			.bind(message, updateId)
			.run();
	}

	async getUser(telegramId) {
		return await this.db.prepare("SELECT * FROM users WHERE telegramId = ?")
			.bind(telegramId)
			.first();
	}

	async saveUser(user, authTimestamp) {
		console.log(user);
		console.log(authTimestamp);
		// the following is an upsert, see https://sqlite.org/lang_upsert.html for more info
		return await this.db.prepare(
			`INSERT 
				INTO users (createdDate, updatedDate, lastAuthTimestamp, 
					telegramId, isBot, firstName, lastName, username, languageCode,
					isPremium, addedToAttachmentMenu, allowsWriteToPm, photoUrl                  
					)
				VALUES (DATETIME('now'), DATETIME('now'), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
				ON CONFLICT(telegramId) DO UPDATE SET
					updatedDate = DATETIME('now'),
					lastAuthTimestamp = COALESCE(excluded.lastAuthTimestamp, lastAuthTimestamp),
					isBot = COALESCE(excluded.isBot, isBot),
					firstName = excluded.firstName,
					lastName = excluded.lastName,
					username = excluded.username,
					languageCode = COALESCE(excluded.languageCode, languageCode),
					isPremium = COALESCE(excluded.isPremium, isPremium),
					addedToAttachmentMenu = COALESCE(excluded.addedToAttachmentMenu, addedToAttachmentMenu),
					allowsWriteToPm = COALESCE(excluded.allowsWriteToPm, allowsWriteToPm),
					photoUrl = COALESCE(excluded.photoUrl, photoUrl)
					WHERE excluded.lastAuthTimestamp > users.lastAuthTimestamp`
		  )
			.bind(authTimestamp, 
				user.id, +user.is_bot, user.first_name||null, user.last_name||null, user.username||null, user.language_code||null,
				+user.is_premium, +user.added_to_attachment_menu, +user.allows_write_to_pm, user.photo_url||null
				)
			.run();
	}

	async saveToken(telegramId, tokenHash) {
		const user = await this.getUser(telegramId);
		console.log(user.id, tokenHash);
		return await this.db.prepare(
			`INSERT 
				INTO tokens (createdDate, updatedDate, expiredDate, userId, tokenHash) 
				VALUES (DATETIME('now'), DATETIME('now'), DATETIME('now', '+1 day'), ?, ?)`
			)
			.bind(user.id, tokenHash)
			.run();
	}

	async getUserByTokenHash(tokenHash) {
		return await this.db.prepare(
			`SELECT users.* FROM tokens 
				INNER JOIN users ON tokens.userId = users.id
				WHERE tokenHash = ? AND DATETIME('now') < expiredDate`
			)
			.bind(tokenHash)
			.first();
	}

	async saveCalendar(calendarJson, calendarRef, userId) {
		return await this.db.prepare(
			`INSERT 
				INTO calendars (createdDate, updatedDate, calendarJson, calendarRef, userId) 
				VALUES (DATETIME('now'), DATETIME('now'), ?, ?, ?)`
			)
			.bind(calendarJson, calendarRef, userId)
			.run();
	}

	async getCalendarByRef(calendarRef) {
		return await this.db.prepare(
			`SELECT calendarJson FROM calendars 
				WHERE calendarRef = ?`
			)
			.bind(calendarRef)
			.first('calendarJson');
	}
}

export { Database }