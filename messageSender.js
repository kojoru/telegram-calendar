import { md } from 'telegram-md';

class MessageSender {
    constructor(app, telegram) {
        this.botName = app.botName;
        this.telegram = telegram;
    }

    async sendMessage(chatId, text, reply_to_message_id) {
        return await this.telegram.sendMessage(chatId, text, 'MarkdownV2', reply_to_message_id);
    }

    async sendGreeting(chatId, replyToMessageId) {
        const message =
md`Hello!

${md.bold("Group Meetup Facilitator")} helps you organize group meetups, e. g. in-person events or\
 calls. Here's how it works:
 
1. Organizer accesses ${md.link("the calendar", `https://t.me/${this.botName}/calendar`)} \
to set options for when the group can meet
2. Organizer receives a link to share with the group
3. Group members vote for the options that work for them
4. Organizer receives a summary of the votes and can pick the best option

And that's it!

Go to ${md.link("the calendar", `https://t.me/${this.botName}/calendar`)} to get started`;

        return await this.sendMessage(chatId, md.build(message), replyToMessageId);
    }

    async sendCalendarLink(chatId, userName, calendarRef) {
        const message =
md`Thanks!

You calendar is submitted and is ready to share. Feel free to share the next message \
or just copy the link from it.`;

        await this.sendMessage(chatId, md.build(message));

        const linkMessage =
md`${userName} uses ${md.bold("Group Meetup Facilitator")} to organize a group meetup! 

Please click on the link below to vote for the dates that work for you. You can vote for multiple dates:

${md.link(`https://t.me/${this.botName}/calendar?startapp=${calendarRef}`, `https://t.me/${this.botName}/calendar?startapp=${calendarRef}`)}`;
    
        return await this.sendMessage(chatId, md.build(linkMessage));
    }
}

export { MessageSender };