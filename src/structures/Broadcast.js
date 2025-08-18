'use strict';

const Base = require('./Base');
const Message = require('./Message');

/**
 * Represents a Status/Story on WhatsApp
 * @extends {Base}
 */
class Broadcast extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new Broadcast object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is organizing the raw broadcast data into a clean object.");
        
        /**
         * ID that represents the chat
         * @type {object}
         */
        this.id = data.id;
        console.log("    - ID set to:", this.id._serialized);

        /**
         * Unix timestamp of last status
         * @type {number}
         */
        this.timestamp = data.t;
        console.log("    - Timestamp of the last status:", this.timestamp);

        /**
         * Number of available statuses
         * @type {number}
         */
        this.totalCount = data.totalCount;
        console.log("    - Total number of statuses:", this.totalCount);

        /**
         * Number of not viewed
         * @type {number}
         */
        this.unreadCount = data.unreadCount;
        console.log("    - Number of unviewed statuses:", this.unreadCount);

        /**
         * Messages statuses
         * @type {Message[]}
         */
        this.msgs = data.msgs?.map(msg => new Message(this.client, msg));
        if (this.msgs && this.msgs.length > 0) {
            console.log("    - Found", this.msgs.length, "message statuses. Creating Message objects for each one.");
        } else {
            console.log("    - No message statuses found in the raw data.");
        }

        console.log("✅ The Broadcast object has been successfully created.");
        return super._patch(data);
    }

    /**
     * Returns the Chat this message was sent in
     * @returns {Promise<Chat>}
     */
    getChat() {
        console.log("\n➡️ getChat() called. Retrieving the associated Chat object.");
        console.log("    - Calling client.getChatById() with ID:", this.id._serialized);
        return this.client.getChatById(this.id._serialized);
    }

    /**
     * Returns the Contact this message was sent from
     * @returns {Promise<Contact>}
     */
    getContact() {
        console.log("\n➡️ getContact() called. Retrieving the associated Contact object.");
        console.log("    - Calling client.getContactById() with ID:", this.id._serialized);
        return this.client.getContactById(this.id._serialized);
    }
}

module.exports = Broadcast;

