import { Router } from 'itty-router';
import { Telegram } from './telegram';
import { Database } from './db';

// Create a new router
const router = Router();
const handle = async (request, env, ctx) => {
	let telegram = new Telegram(env.TELEGRAM_BOT_TOKEN);
	let db = new Database(env.DB);
	let app = {telegram, db};

	router.handle(request, app, env, ctx);
}
const processMessage = async (message, app) => {
	const {telegram, db} = app;
	const chatId = json.message.chat.id;
	const reply_to_message_id = json.message.message_id;

	const messageToSave = JSON.stringify(json, null, 2);
	await telegram.sendMessage(chatId, "```json" + messageToSave + "```", 'MarkdownV2', reply_to_message_id);	

	await db.addMessage(messageToSave);
};

/*
Our index route, a simple hello world.
*/
router.get('/', () => {
	return new Response('Hello, world! This is the root page of your Worker template.');
});

router.post('/miniAppInit', async (request, app) => {
	const {telegram, db} = app;
	let json = await request.json();
	let initData = json.initData;

	let {expectedHash, calculatedHash, data} = await telegram.calculateHashes(initData);
	db.addInitDataCheck(initData, expectedHash, calculatedHash);
	console.log(data);

	if(expectedHash !== calculatedHash) {
		return new Response('Unauthorized', { status: 401 });
	}

	return new Response('Success', { status: 200 });
	
});

router.post('/telegramMessage', async (request, app) => {

	const {db} = app;
	const telegramProvidedToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
	const savedToken = await db.getSetting("telegram_security_code");
	
	if (telegramProvidedToken !== savedToken) {
		return new Response('Unauthorized', { status: 401 });
	}

	let message = await request.json();
	await processMessage(message, app);

	return new Response('Success', { status: 200 });
});

router.post('/init', async (request, app) => {
	if(request.headers.get('Authorization') !== `Bearer ${env.INIT_SECRET}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	const {telegram, db} = app;

	let token = await db.getSetting("telegram_security_code");

	if (token === null) {
		token = crypto.getRandomValues(new Uint8Array(16)).join("");
		await db.initSetting("telegram_security_code", token);
	}

	let json = await request.json();
	let externalUrl = json.externalUrl;

	let response = await telegram.setWebhook(`${externalUrl}/telegramMessage`, token);

	return new Response('Success! ' + JSON.stringify(response), { status: 200 });
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch: handle,
};
