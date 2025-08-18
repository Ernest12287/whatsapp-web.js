'use strict';

const Base = require('./Base');

/**
 * ID that represents a contact
 * @typedef {Object} ContactId
 * @property {string} server
 * @property {string} user
 * @property {string} _serialized
 */

/**
 * Represents a Contact on WhatsApp
 * @extends {Base}
 */
class Contact extends Base {
    constructor(client, data) {
        super(client);

        if(data) {
            console.log("\n📚 A new Contact object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("🔧 The _patch() method is organizing the raw data to create a clean Contact object.");

        /**
         * ID that represents the contact
         * @type {ContactId}
         */
        this.id = data.id;

        /**
         * Contact's phone number
         * @type {string}
         */
        this.number = data.userid;

        /**
         * Indicates if the contact is a business contact
         * @type {boolean}
         */
        this.isBusiness = data.isBusiness;

        /**
         * Indicates if the contact is an enterprise contact
         * @type {boolean}
         */
        this.isEnterprise = data.isEnterprise;

        this.labels = data.labels;

        /**
         * The contact's name, as saved by the current user
         * @type {?string}
         */
        this.name = data.name;

        /**
         * The name that the contact has configured to be shown publically
         * @type {string}
         */
        this.pushname = data.pushname;

        this.sectionHeader = data.sectionHeader;

        /**
         * A shortened version of name
         * @type {?string}
         */
        this.shortName = data.shortName;

        this.statusMute = data.statusMute;
        this.type = data.type;
        this.verifiedLevel = data.verifiedLevel;
        this.verifiedName = data.verifiedName;

        /**
         * Indicates if the contact is the current user's contact
         * @type {boolean}
         */
        this.isMe = data.isMe;

        /**
         * Indicates if the contact is a user contact
         * @type {boolean}
         */
        this.isUser = data.isUser;

        /**
         * Indicates if the contact is a group contact
         * @type {boolean}
         */
        this.isGroup = data.isGroup;

        /**
         * Indicates if the number is registered on WhatsApp
         * @type {boolean}
         */
        this.isWAContact = data.isWAContact;

        /**
         * Indicates if the number is saved in the current phone's contacts
         * @type {boolean}
         */
        this.isMyContact = data.isMyContact;

        /**
         * Indicates if you have blocked this contact
         * @type {boolean}
         */
        this.isBlocked = data.isBlocked;
        
        console.log("✅ The Contact object has been created with all properties.");
        console.log("  - ID:", this.id);
        console.log("  - Pushname:", this.pushname);
        console.log("  - Is this a group contact?", this.isGroup);

        return super._patch(data);
    }

    /**
     * Returns the contact's profile picture URL, if privacy settings allow it
     * @returns {Promise<string>}
     */
    async getProfilePicUrl() {
        console.log("\n🔎 The getProfilePicUrl() method is being called.");
        console.log("    - This is an ASYNCHRONOUS operation. The bot must wait for a response from the server.");
        const result = await this.client.getProfilePicUrl(this.id._serialized);
        console.log("✅ getProfilePicUrl() has received a response.");
        console.log("    - The URL received is:", result);
        return result;
    }

    /**
     * Returns the contact's formatted phone number, (12345678901@c.us) => (+1 (234) 5678-901)
     * @returns {Promise<string>}
     */
    async getFormattedNumber() {
        console.log("\n🔎 The getFormattedNumber() method is being called.");
        console.log("    - This is an ASYNCHRONOUS operation. Waiting for the formatted number.");
        const result = await this.client.getFormattedNumber(this.id._serialized);
        console.log("✅ getFormattedNumber() has completed. The result is:", result);
        return result;
    }
    
    /**
     * Returns the contact's countrycode, (1541859685@c.us) => (1)
     * @returns {Promise<string>}
     */
    async getCountryCode() {
        console.log("\n🔎 The getCountryCode() method is being called.");
        const result = await this.client.getCountryCode(this.id._serialized);
        console.log("✅ getCountryCode() has completed. The result is:", result);
        return result;
    }
    
    /**
     * Returns the Chat that corresponds to this Contact. 
     * Will return null when getting chat for currently logged in user.
     * @returns {Promise<Chat>}
     */
    async getChat() {
        console.log("\n🔎 The getChat() method is being called.");
        if(this.isMe) {
            console.log("    - This contact is the current user. getChat() will return null.");
            return null;
        }
        console.log("    - This is an ASYNCHRONOUS operation. Waiting for the chat object.");
        const chat = await this.client.getChatById(this.id._serialized);
        console.log("✅ getChat() has completed. The Chat object has been received.");
        return chat;
    }

    /**
     * Blocks this contact from WhatsApp
     * @returns {Promise<boolean>}
     */
    async block() {
        console.log("\n🛡️ The block() method is being called.");
        if(this.isGroup) {
            console.log("    - This is a group. block() cannot be called on a group. Returning false.");
            return false;
        }
        console.log("    - This is an ASYNCHRONOUS operation. Attempting to block the contact.");
        await this.client.pupPage.evaluate(async (contactId) => {
            // ... This code runs in the browser context ...
        }, this.id._serialized);
        this.isBlocked = true;
        console.log("✅ The block() operation completed. 'this.isBlocked' is now set to true.");
        return true;
    }

    /**
     * Unblocks this contact from WhatsApp
     * @returns {Promise<boolean>}
     */
    async unblock() {
        console.log("\n🔓 The unblock() method is being called.");
        if(this.isGroup) {
            console.log("    - This is a group. unblock() cannot be called on a group. Returning false.");
            return false;
        }
        console.log("    - This is an ASYNCHRONOUS operation. Attempting to unblock the contact.");
        await this.client.pupPage.evaluate(async (contactId) => {
            // ... This code runs in the browser context ...
        }, this.id._serialized);
        this.isBlocked = false;
        console.log("✅ The unblock() operation completed. 'this.isBlocked' is now set to false.");
        return true;
    }

    /**
     * Gets the Contact's current "about" info. Returns null if you don't have permission to read their status.
     * @returns {Promise<?string>}
     */
    async getAbout() {
        console.log("\n🔎 The getAbout() method is being called.");
        console.log("    - This is an ASYNCHRONOUS operation. Waiting for the 'about' status.");
        const about = await this.client.pupPage.evaluate(async (contactId) => {
            // ... This code runs in the browser context ...
        }, this.id._serialized);

        if (typeof about.status !== 'string') {
            console.log("    - The status could not be retrieved. It may be private or not set. Returning null.");
            return null;
        }
        
        console.log("✅ The getAbout() operation completed. The status is:", about.status);
        return about.status;
    }

    /**
     * Gets the Contact's common groups with you. Returns empty array if you don't have any common group.
     * @returns {Promise<WAWebJS.ChatId[]>}
     */
    async getCommonGroups() {
        console.log("\n🔎 The getCommonGroups() method is being called.");
        const result = await this.client.getCommonGroups(this.id._serialized);
        console.log("✅ getCommonGroups() has completed. Found", result.length, "common groups.");
        return result;
    }
    
}

module.exports = Contact;