'use strict';

const Base = require('./Base');
const Message = require('./Message');

/**
 * Represents a Chat on WhatsApp
 * @extends {Base}
 */
class Chat extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new Chat object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is organizing the raw chat data into a clean object.");
        
        /**
         * ID that represents the chat
         * @type {object}
         */
        this.id = data.id;

        /**
         * Title of the chat
         * @type {string}
         */
        this.name = data.formattedTitle;

        /**
         * Indicates if the Chat is a Group Chat
         * @type {boolean}
         */
        this.isGroup = data.isGroup;

        /**
         * Indicates if the Chat is readonly
         * @type {boolean}
         */
        this.isReadOnly = data.isReadOnly;

        /**
         * Amount of messages unread
         * @type {number}
         */
        this.unreadCount = data.unreadCount;

        /**
         * Unix timestamp for when the last activity occurred
         * @type {number}
         */
        this.timestamp = data.t;

        /**
         * Indicates if the Chat is archived
         * @type {boolean}
         */
        this.archived = data.archive;

        /**
         * Indicates if the Chat is pinned
         * @type {boolean}
         */
        this.pinned = !!data.pin;

        /**
         * Indicates if the chat is muted or not
         * @type {boolean}
         */
        this.isMuted = data.isMuted;

        /**
         * Unix timestamp for when the mute expires
         * @type {number}
         */
        this.muteExpiration = data.muteExpiration;

        /**
         * Last message fo chat
         * @type {Message}
         */
        this.lastMessage = data.lastMessage ? new Message(this.client, data.lastMessage) : undefined;
        
        console.log("✅ The Chat object has been created with the following properties:");
        console.log("  - ID:", this.id);
        console.log("  - Name:", this.name);
        console.log("  - Is a Group?", this.isGroup);
        if (this.lastMessage) {
            console.log("  - Contains a lastMessage property:", this.lastMessage);
        }

        return super._patch(data);
    }

    /**
     * Send a message to this chat
     * @param {string|MessageMedia|Location} content
     * @param {MessageSendOptions} [options] 
     * @returns {Promise<Message>} Message that was just sent
     */
    async sendMessage(content, options) {
        console.log("\n💬 sendMessage() called. Preparing to send content:", content);
        const result = await this.client.sendMessage(this.id._serialized, content, options);
        console.log("✅ sendMessage() completed. A Message object was returned.");
        return result;
    }

    /**
     * Sets the chat as seen
     * @returns {Promise<Boolean>} result
     */
    async sendSeen() {
        console.log("\n👁️  sendSeen() called. Setting chat as read.");
        const result = await this.client.sendSeen(this.id._serialized);
        console.log("✅ sendSeen() completed. Result:", result);
        return result;
    }

    /**
     * Clears all messages from the chat
     * @returns {Promise<boolean>} result
     */
    async clearMessages() {
        console.log("\n🗑️  clearMessages() called. Attempting to delete all messages from this chat.");
        const result = await this.client.pupPage.evaluate(chatId => {
            return window.WWebJS.sendClearChat(chatId);
        }, this.id._serialized);
        console.log("✅ clearMessages() completed. Result:", result);
        return result;
    }

    /**
     * Deletes the chat
     * @returns {Promise<Boolean>} result
     */
    async delete() {
        console.log("\n❌ delete() called. Attempting to delete the entire chat.");
        const result = await this.client.pupPage.evaluate(chatId => {
            return window.WWebJS.sendDeleteChat(chatId);
        }, this.id._serialized);
        console.log("✅ delete() completed. Result:", result);
        return result;
    }

    /**
     * Archives this chat
     */
    async archive() {
        console.log("\n📦 archive() called. Archiving the chat.");
        const result = await this.client.archiveChat(this.id._serialized);
        console.log("✅ archive() completed. Result:", result);
        return result;
    }

    /**
     * un-archives this chat
     */
    async unarchive() {
        console.log("\n📦 unarchive() called. Unarchiving the chat.");
        const result = await this.client.unarchiveChat(this.id._serialized);
        console.log("✅ unarchive() completed. Result:", result);
        return result;
    }

    /**
     * Pins this chat
     * @returns {Promise<boolean>} New pin state. Could be false if the max number of pinned chats was reached.
     */
    async pin() {
        console.log("\n📌 pin() called. Attempting to pin the chat.");
        const result = await this.client.pinChat(this.id._serialized);
        console.log("✅ pin() completed. New pin state:", result);
        return result;
    }

    /**
     * Unpins this chat
     * @returns {Promise<boolean>} New pin state
     */
    async unpin() {
        console.log("\n📌 unpin() called. Attempting to unpin the chat.");
        const result = await this.client.unpinChat(this.id._serialized);
        console.log("✅ unpin() completed. New pin state:", result);
        return result;
    }

    /**
     * Mutes this chat forever, unless a date is specified
     * @param {?Date} unmuteDate Date when the chat will be unmuted, don't provide a value to mute forever
     * @returns {Promise<{isMuted: boolean, muteExpiration: number}>}
     */
    async mute(unmuteDate) {
        console.log("\n🔇 mute() called. Muting the chat.");
        const result = await this.client.muteChat(this.id._serialized, unmuteDate);
        this.isMuted = result.isMuted;
        this.muteExpiration = result.muteExpiration;
        console.log("✅ mute() completed. isMuted:", this.isMuted, ", muteExpiration:", this.muteExpiration);
        return result;
    }

    /**
     * Unmutes this chat
     * @returns {Promise<{isMuted: boolean, muteExpiration: number}>}
     */
    async unmute() {
        console.log("\n🔊 unmute() called. Unmuting the chat.");
        const result = await this.client.unmuteChat(this.id._serialized);
        this.isMuted = result.isMuted;
        this.muteExpiration = result.muteExpiration;
        console.log("✅ unmute() completed. isMuted:", this.isMuted, ", muteExpiration:", this.muteExpiration);
        return result;
    }

    /**
     * Mark this chat as unread
     */
    async markUnread(){
        console.log("\n✉️  markUnread() called. Marking the chat as unread.");
        const result = await this.client.markChatUnread(this.id._serialized);
        console.log("✅ markUnread() completed. Result:", result);
        return result;
    }

    /**
     * Loads chat messages, sorted from earliest to latest.
     * @param {Object} searchOptions Options for searching messages. Right now only limit and fromMe is supported.
     * @param {Number} [searchOptions.limit] The amount of messages to return. If no limit is specified, the available messages will be returned. Note that the actual number of returned messages may be smaller if there aren't enough messages in the conversation. Set this to Infinity to load all messages.
     * @param {Boolean} [searchOptions.fromMe] Return only messages from the bot number or vise versa. To get all messages, leave the option undefined.
     * @returns {Promise<Array<Message>>}
     */
    async fetchMessages(searchOptions) {
        console.log("\n📥 fetchMessages() called. Fetching messages with options:", searchOptions);
        console.log("    - This is a complex ASYNCHRONOUS operation. The browser will handle fetching and filtering.");
        
        let messages = await this.client.pupPage.evaluate(async (chatId, searchOptions) => {
            const msgFilter = (m) => {
                if (m.isNotification) {
                    return false; // dont include notification messages
                }
                if (searchOptions && searchOptions.fromMe !== undefined && m.id.fromMe !== searchOptions.fromMe) {
                    return false;
                }
                return true;
            };

            const chat = await window.WWebJS.getChat(chatId, { getAsModel: false });
            let msgs = chat.msgs.getModelsArray().filter(msgFilter);

            if (searchOptions && searchOptions.limit > 0) {
                while (msgs.length < searchOptions.limit) {
                    const loadedMessages = await window.Store.ConversationMsgs.loadEarlierMsgs(chat);
                    if (!loadedMessages || !loadedMessages.length) break;
                    msgs = [...loadedMessages.filter(msgFilter), ...msgs];
                }
                
                if (msgs.length > searchOptions.limit) {
                    msgs.sort((a, b) => (a.t > b.t) ? 1 : -1);
                    msgs = msgs.splice(msgs.length - searchOptions.limit);
                }
            }

            return msgs.map(m => window.WWebJS.getMessageModel(m));

        }, this.id._serialized, searchOptions);
        
        console.log("✅ fetchMessages() completed. Returning", messages.length, "Message objects.");
        return messages.map(m => new Message(this.client, m));
    }

    /**
     * Simulate typing in chat. This will last for 25 seconds.
     */
    async sendStateTyping() {
        console.log("\n✍️  sendStateTyping() called. The bot is now typing...");
        const result = await this.client.pupPage.evaluate(chatId => {
            window.WWebJS.sendChatstate('typing', chatId);
            return true;
        }, this.id._serialized);
        console.log("✅ sendStateTyping() completed. Result:", result);
        return result;
    }

    /**
     * Simulate recording audio in chat. This will last for 25 seconds.
     */
    async sendStateRecording() {
        console.log("\n🎙️  sendStateRecording() called. The bot is now recording audio...");
        const result = await this.client.pupPage.evaluate(chatId => {
            window.WWebJS.sendChatstate('recording', chatId);
            return true;
        }, this.id._serialized);
        console.log("✅ sendStateRecording() completed. Result:", result);
        return result;
    }

    /**
     * Stops typing or recording in chat immediately.
     */
    async clearState() {
        console.log("\n🛑 clearState() called. Stopping the bot's typing/recording state.");
        const result = await this.client.pupPage.evaluate(chatId => {
            window.WWebJS.sendChatstate('stop', chatId);
            return true;
        }, this.id._serialized);
        console.log("✅ clearState() completed. Result:", result);
        return result;
    }

    /**
     * Returns the Contact that corresponds to this Chat.
     * @returns {Promise<Contact>}
     */
    async getContact() {
        console.log("\n👥 getContact() called. Fetching the Contact object for this chat.");
        const result = await this.client.getContactById(this.id._serialized);
        console.log("✅ getContact() completed. A Contact object was returned.");
        return result;
    }

    /**
     * Returns array of all Labels assigned to this Chat
     * @returns {Promise<Array<Label>>}
     */
    async getLabels() {
        console.log("\n🏷️  getLabels() called. Fetching labels for this chat.");
        const result = await this.client.getChatLabels(this.id._serialized);
        console.log("✅ getLabels() completed. Found", result.length, "labels.");
        return result;
    }

    /**
     * Add or remove labels to this Chat
     * @param {Array<number|string>} labelIds
     * @returns {Promise<void>}
     */
    async changeLabels(labelIds) {
        console.log("\n🏷️  changeLabels() called. Applying labels:", labelIds);
        const result = await this.client.addOrRemoveLabels(labelIds, [this.id._serialized]);
        console.log("✅ changeLabels() completed.");
        return result;
    }

    /**
     * Gets instances of all pinned messages in a chat
     * @returns {Promise<[Message]|[]>}
     */
    async getPinnedMessages() {
        console.log("\n📌 getPinnedMessages() called. Fetching pinned messages.");
        const result = await this.client.getPinnedMessages(this.id._serialized);
        console.log("✅ getPinnedMessages() completed. Found", result.length, "pinned messages.");
        return result;
    }
    
    /**
     * Sync chat history conversation
     * @return {Promise<boolean>} True if operation completed successfully, false otherwise.
     */
    async syncHistory() {
        console.log("\n🔄 syncHistory() called. Syncing the chat history.");
        const result = await this.client.syncHistory(this.id._serialized);
        console.log("✅ syncHistory() completed. Result:", result);
        return result;
    }
}

module.exports = Chat;