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

    async initSetting(settingName, settingValue) {
        return await this.db.prepare(
            `INSERT 
                INTO settings (createdDate, updatedDate, name, value)
                VALUES (DATETIME('now'), DATETIME('now'), ?, ?)`
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

    async addInitDataCheck(initData, expectedHash, calculatedHash) {
        return await this.db.prepare(
            `INSERT 
                INTO initDataChecks (createdDate, updatedDate, initData, expectedHash, calculatedHash) 
                VALUES (DATETIME('now'), DATETIME('now'), ?, ?, ?, ?)`
          )
            .bind(initData, expectedHash, calculatedHash)
            .run();
    }
}

export { Database }