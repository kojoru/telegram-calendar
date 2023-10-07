const TELEGRAM_API_BASE_URL = 'https://api.telegram.org/bot';

class TelegramAPI {
    constructor(token) {
        this.token = token;
        this.apiBaseUrl = `${TELEGRAM_API_BASE_URL}${token}/`;
    }

    async sendMessage(chatId, text) {
        const url = `${this.apiBaseUrl}sendMessage`;
        const params = {
            chat_id: chatId,
            text: text,
        };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        return response.json();
    }

    async setWebhook(url, secretToken) {
        const params = {
            url: url,
        };
        if (secretToken) {
            params.secret_token = secretToken;
        }
        const url = `${this.apiBaseUrl}setWebhook`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(params)
        });
        return response.json();
    }
}

export { TelegramAPI as Telegram }