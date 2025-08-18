'use strict';

const Base = require('./Base');

/**
 * Represents a GroupNotification on WhatsApp
 * @extends {Base}
 */
class GroupNotification extends Base {
    constructor(client, data) {
        super(client);

        if(data) {
            console.log("\n📚 A new GroupNotification object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is organizing the raw notification data into a clean object.");
        /**
         * ID that represents the groupNotification
         * @type {object}
         */
        this.id = data.id;
        console.log("    - ID set to:", this.id._serialized);

        /**
         * Extra content
         * @type {string}
         */
        this.body = data.body || '';
        if (this.body) {
            console.log("    - Body content set to:", this.body);
        }

        /** * GroupNotification type
         * @type {GroupNotificationTypes}
         */
        this.type = data.subtype;
        console.log("    - Notification type set to:", this.type);
        
        /**
         * Unix timestamp for when the groupNotification was created
         * @type {number}
         */
        this.timestamp = data.t;
        console.log("    - Timestamp set to:", this.timestamp);

        /**
         * ID for the Chat that this groupNotification was sent for.
         * * @type {string}
         */
        this.chatId = typeof (data.id.remote) === 'object' ? data.id.remote._serialized : data.id.remote;
        console.log("    - Chat ID set to:", this.chatId);

        /**
         * ContactId for the user that produced the GroupNotification.
         * @type {string}
         */
        this.author = typeof (data.author) === 'object' ? data.author._serialized : data.author;
        console.log("    - Author ID set to:", this.author);
        
        /**
         * Contact IDs for the users that were affected by this GroupNotification.
         * @type {Array<string>}
         */
        this.recipientIds = [];

        if (data.recipients) {
            this.recipientIds = data.recipients;
            console.log("    - Recipient IDs set. Number of recipients:", this.recipientIds.length);
        }

        console.log("✅ The GroupNotification object has been successfully created.");

        return super._patch(data);
    }

    /**
     * Returns the Chat this groupNotification was sent in
     * @returns {Promise<Chat>}
     */
    getChat() {
        console.log("\n➡️ getChat() called. Retrieving the associated Chat object.");
        return this.client.getChatById(this.chatId);
    }

    /**
     * Returns the Contact this GroupNotification was produced by
     * @returns {Promise<Contact>}
     */
    getContact() {
        console.log("\n➡️ getContact() called. Retrieving the author's Contact object.");
        return this.client.getContactById(this.author);
    }

    /**
     * Returns the Contacts affected by this GroupNotification.
     * @returns {Promise<Array<Contact>>}
     */
    async getRecipients() {
        console.log("\n➡️ getRecipients() called. Retrieving Contact objects for all recipients.");
        const recipientContacts = await Promise.all(this.recipientIds.map(async m => await this.client.getContactById(m)));
        console.log(`✅ getRecipients() completed. Found ${recipientContacts.length} recipient contacts.`);
        return recipientContacts;
    }

    /**
     * Sends a message to the same chat this GroupNotification was produced in.
     * * @param {string|MessageMedia|Location} content 
     * @param {object} options
     * @returns {Promise<Message>}
     */
    async reply(content, options={}) {
        console.log("\n➡️ reply() called. Sending a message back to the group chat.");
        console.log("    - The reply content is:", content);
        const sentMessage = await this.client.sendMessage(this.chatId, content, options);
        console.log("✅ reply() completed. Message sent successfully.");
        return sentMessage;
    }
    
}

module.exports = GroupNotification;

