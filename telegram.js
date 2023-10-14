import { hmacSha256, hex } from './cryptoUtils.js';
const TELEGRAM_API_BASE_URL = 'https://api.telegram.org/bot';

class TelegramAPI {
	constructor(token, useTestApi = false) {
		this.token = token;
		let testApiAddendum = useTestApi ? 'test/' : '';
		this.apiBaseUrl = `${TELEGRAM_API_BASE_URL}${token}/${testApiAddendum}`;
	}

	async calculateHashes(initData) {
		const urlParams = new URLSearchParams(initData);

		const expectedHash = urlParams.get("hash");
		urlParams.delete("hash");
		urlParams.sort();
	  
		let dataCheckString = "";
	  
		for (const [key, value] of urlParams.entries()) {
		  dataCheckString += `${key}=${value}\n`;
		}
	  
		dataCheckString = dataCheckString.slice(0, -1);
		let data = Object.fromEntries(urlParams);
		data.user = JSON.parse(data.user||null);
		data.receiver = JSON.parse(data.receiver||null);
		data.chat = JSON.parse(data.chat||null);

		const secretKey = await hmacSha256(this.token, "WebAppData");
		const calculatedHash = hex(await hmacSha256(dataCheckString, secretKey));

		return {expectedHash, calculatedHash, data};
	}

	async getUpdates(lastUpdateId) {
		const url = `${this.apiBaseUrl}getUpdates`;
		const params = {};
		if (lastUpdateId) {
			params.offset = lastUpdateId + 1;
		}

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params),
		});
		return response.json();
	}

	async sendMessage(chatId, text, parse_mode, reply_to_message_id) {
		const url = `${this.apiBaseUrl}sendMessage`;
		const params = {
			chat_id: chatId,
			text: text,
		};
		if (parse_mode) {
			params.parse_mode = parse_mode;
		}
		if (reply_to_message_id) {
			params.reply_to_message_id = reply_to_message_id;
		}
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(params)
		});
		return response.json();
	}

	async setWebhook(externalUrl, secretToken) {
		const params = {
			url: externalUrl,
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

	async getMe() {
		const url = `${this.apiBaseUrl}getMe`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		return response.json();
	}
}

export { TelegramAPI as Telegram }