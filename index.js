import { Router } from 'itty-router';
import { Telegram } from './telegram';

// Create a new router
const router = Router();

/*
Our index route, a simple hello world.
*/
router.get('/', () => {
	return new Response('Hello, world! This is the root page of your Worker template.');
});


router.post('/telegramMessage', async (request, env) => {

	const telegramProvidedToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
	const savedToken = await env.DB.prepare(
        "SELECT value FROM settings WHERE name = ?"
      )
        .bind("telegram_security_code")
        .first('value');

	
	if (telegramProvidedToken !== savedToken) {
		return new Response('Unauthorized', { status: 401 });
	}

	let json = await request.json();

	const telegram = new Telegram(env.TELEGRAM_BOT_TOKEN);
	const chatId = json.message.chat.id;
	const reply_to_message_id = json.message.message_id;

	// Serialize the JSON to a string.
	const messageToSave = JSON.stringify(json, null, 2);

	// Send a message to the chat acknowledging receipt of their message
	await telegram.sendMessage(chatId, "```json" + messageToSave + "```", 'MarkdownV2', reply_to_message_id);	

	await env.DB.prepare(
		"INSERT INTO messages (message) VALUES (?)"
	).bind(messageToSave).run();

	return new Response('Success', { status: 200 });
});

router.post('/init', async (request, env, ctx) => {
	if(request.headers.get('Authorization') !== `Bearer ${env.INIT_SECRET}`) {
		return new Response('Unauthorized', { status: 401 });
	}

	const { results } = await env.DB.prepare(
        "SELECT * FROM settings WHERE name = ?"
      )
        .bind("telegram_security_code")
        .all();

	let token;
	if (results.length === 0) {
		token = crypto.getRandomValues(new Uint8Array(16)).join("");
		await env.DB.prepare(
			"INSERT INTO settings (name, value) VALUES (?, ?)"
		).bind("telegram_security_code", token).run();
	} else {
		token = results[0].value;
	}

	let json = await request.json();
	let externalUrl = json.externalUrl;

	let telegram = new Telegram(env.TELEGRAM_BOT_TOKEN);
	let response = await telegram.setWebhook(`${externalUrl}/telegramMessage`, token);

	return new Response('Success' + JSON.stringify(response), { status: 200 });
});

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch: router.handle,
};
