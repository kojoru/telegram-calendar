const sendGreeting = async (chatId, replyToMessageId, telegram) => {
    return await telegram.sendMessage(chatId, "Hello\\!\n\n Access [the calendar](https://t.me/group_meetup_bot/calendar) to set your availability and you will receive the voting link back", 'MarkdownV2', replyToMessageId);
}

const processMessage = async (json, app) => {
	const {telegram, db} = app;
	const chatId = json.message.chat.id;
	const replyToMessageId = json.message.message_id;


	const messageToSave = JSON.stringify(json, null, 2);

    if (json.message.text === '/start') {
        return await sendGreeting(chatId, replyToMessageId, telegram);
    }

	//await telegram.sendMessage(chatId, "```json" + messageToSave + "```", 'MarkdownV2', replyToMessageId);

	await db.addMessage(messageToSave, json.update_id);
};

export { processMessage }