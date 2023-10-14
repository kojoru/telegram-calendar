import { MessageSender } from "./messageSender";

const processMessage = async (json, app) => {
	const { telegram, db } = app;

	const messageSender = new MessageSender(app, telegram);

	const chatId = json.message.chat.id;
	const replyToMessageId = json.message.message_id;

	const messageToSave = JSON.stringify(json, null, 2);
	await db.addMessage(messageToSave, json.update_id);

    if (json.message.text === '/start') {
        return await messageSender.sendGreeting(chatId, replyToMessageId);
    } 

	return "Skipped message";
};

export { processMessage }