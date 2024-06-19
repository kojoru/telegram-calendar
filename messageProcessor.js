import { MessageSender } from "./messageSender";

const processMessage = async (json, app) => {
	const { telegram, db } = app;

	const messageSender = new MessageSender(app, telegram);

	const chatId = json.message.chat.id;
	const replyToMessageId = json.message.message_id;

	const messageToSave = JSON.stringify(json, null, 2);

	await messageSender.sendMessage(chatId, "Test", replyToMessageId);

	await db.addMessage(messageToSave, json.update_id);

	await messageSender.sendMessage(chatId, "Test 2", replyToMessageId);

    if (json.message.text === '/start') {
			await messageSender.sendMessage(chatId, "Test 3", replyToMessageId);
        return await messageSender.sendGreeting(chatId, replyToMessageId);
    }

		await messageSender.sendMessage(chatId, "Test 4", replyToMessageId);

	return "Skipped message";
};

export { processMessage }
