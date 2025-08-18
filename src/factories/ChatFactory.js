'use strict';

const PrivateChat = require('../structures/PrivateChat');
const GroupChat = require('../structures/GroupChat');
const Channel = require('../structures/Channel');

class ChatFactory {
    /**
     * Creates the correct chat type based on the provided data.
     * This uses the Factory design pattern to centralize object creation.
     * @param {Client} client The client that instantiated this
     * @param {object} data The raw data from WhatsApp
     * @returns {PrivateChat|GroupChat|Channel} The instantiated chat object
     */
    static create(client, data) {
        console.log("\n📚 ChatFactory.create() called to determine the type of chat object to create.");
        console.log("👉 Inspecting the raw data for chat type flags:", data);

        if (data.isGroup) {
            console.log("✅ The 'isGroup' flag is true. Creating a new GroupChat object.");
            return new GroupChat(client, data);
        }
        
        if (data.isChannel) {
            console.log("✅ The 'isChannel' flag is true. Creating a new Channel object.");
            return new Channel(client, data);
        }

        console.log("✅ Neither 'isGroup' nor 'isChannel' is true. Defaulting to a PrivateChat object.");
        return new PrivateChat(client, data);
    }
}

module.exports = ChatFactory;