'use strict';

const PrivateContact = require('../structures/PrivateContact');
const BusinessContact = require('../structures/BusinessContact');

class ContactFactory {
    /**
     * Creates the correct contact type based on the provided data.
     * This uses the Factory design pattern to centralize object creation.
     * @param {Client} client The client that instantiated this
     * @param {object} data The raw data from WhatsApp
     * @returns {PrivateContact|BusinessContact} The instantiated contact object
     */
    static create(client, data) {
        console.log("\n📚 ContactFactory.create() called to determine the type of contact object to create.");
        console.log("👉 Inspecting the raw data for 'isBusiness' flag:", data);

        if(data.isBusiness) {
            console.log("✅ The 'isBusiness' flag is true. Creating a new BusinessContact object.");
            return new BusinessContact(client, data);
        }

        console.log("✅ The 'isBusiness' flag is false. Defaulting to a PrivateContact object.");
        return new PrivateContact(client, data);
    }
}

module.exports = ContactFactory;