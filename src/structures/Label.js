'use strict';

const Base = require('./Base');
// eslint-disable-next-line no-unused-vars
const Chat = require('./Chat');

/**
 * WhatsApp Business Label information
 */
class Label extends Base {
    /**
     * @param {Base} client
     * @param {object} labelData
     */
    constructor(client, labelData){
        super(client);

        if(labelData) {
            console.log("\n📚 A new Label object is being created.");
            console.log("👉 The constructor received the following raw data:", labelData);
            this._patch(labelData);
        }
    }

    _patch(labelData){
        console.log("\n🔧 _patch() is organizing the raw label data into a clean object.");
        /**
         * Label ID
         * @type {string}
         */
        this.id = labelData.id;

        /**
         * Label name
         * @type {string}
         */
        this.name = labelData.name;

        /**
         * Label hex color
         * @type {string}
         */
        this.hexColor = labelData.hexColor;

        console.log("✅ The Label object has been created with the following properties:");
        console.log("  - ID:", this.id);
        console.log("  - Name:", this.name);
        console.log("  - Hex Color:", this.hexColor);
    }
    /**
     * Get all chats that have been assigned this Label
     * @returns {Promise<Array<Chat>>}
     */
    async getChats(){
        console.log("\n➡️ getChats() called. Attempting to retrieve all chats for this label.");
        console.log("    - Calling client.getChatsByLabelId() with label ID:", this.id);
        const chats = await this.client.getChatsByLabelId(this.id);
        console.log(`✅ getChats() completed. Found ${chats.length} chats associated with this label.`);
        return chats;
    }

}

module.exports = Label;