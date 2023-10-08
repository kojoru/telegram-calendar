import { Router } from 'itty-router';
import { Telegram } from './telegram';
import { Database } from './db';

// Create a new router
const router = Router();

/*
Our index route, a simple hello world.
*/
router.get('/', () => {
	return new Response('Hello, world! This is the root page of your Worker template.');
});

router.post('/miniAppInit', async (request, env) => {
	let json = await request.json();
	let telegram = new Telegram(env.TELEGRAM_BOT_TOKEN);
	let db = new Database(env.DB);
	let initData = json.initData;

	let {expectedHash, calculatedHash, data} = await telegram.calculateHashes(initData);
	db.addInitDataCheck(initData, expectedHash, calculatedHash);
	console.log(data);

	if(expectedHash !== calculatedHash) {
		return new Response('Unauthorized', { status: 401 });
	}

	return new Response('Success', { status: 200 });
	
});

router.post('/telegramMessage', async (request, env) => {

	const db = new Database(env.DB);
	const telegramProvidedToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
	const savedToken = await db.getSetting("telegram_security_code");
	
	if (telegramProvidedToken !== savedToken) {
		return new Response('Unauthorized', { status: 401 });
	}

	let json = await request.json();

	const telegram = new Telegram(env.TELEGRAM_BOT_TOKEN);
	const chatId = json.message.chat.id;
	const reply_to_message_id = json.message.message_id;

	const messageToSave = JSON.stringify(json, null, 2);
	await telegram.sendMessage(chatId, "```json" + messageToSave + "```", 'MarkdownV2', reply_to_message_id);	

	await db.addMessage(messageToSave);

	return new Response('Success', { status: 200 });
});

router.post('/init', async (request, env, ctx) => {
	if(request.headers.get('Authorization') !== `Bearer ${env.INIT_SECRET}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	const db = new Database(env.DB);

	let token = await db.getSetting("telegram_security_code");

	if (token === null) {
		token = crypto.getRandomValues(new Uint8Array(16)).join("");
		await db.initSetting("telegram_security_code", token);
	}

	let json = await request.json();
	let externalUrl = json.externalUrl;

	let telegram = new Telegram(env.TELEGRAM_BOT_TOKEN);
	let response = await telegram.setWebhook(`${externalUrl}/telegramMessage`, token);

	return new Response('Success! ' + JSON.stringify(response), { status: 200 });
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch: router.handle,
};
