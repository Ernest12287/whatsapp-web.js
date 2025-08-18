'use strict';

const Base = require('./Base');
const Message = require('./Message');

/**
 * Channel ID structure
 * @typedef {Object} ChannelId
 * @property {string} server
 * @property {string} user
 * @property {string} _serialized
 */

/**
 * Represents a Channel on WhatsApp
 * @extends {Base}
 */
class Channel extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new Channel object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is organizing the raw channel data into a clean object.");
        this.channelMetadata = data.channelMetadata;
        
        /**
         * ID that represents the channel
         * @type {ChannelId}
         */
        this.id = data.id;
        console.log("    - Channel ID set to:", this.id._serialized);

        /**
         * Title of the channel
         * @type {string}
         */
        this.name = data.name;
        console.log("    - Channel name set to:", this.name);

        /** * The channel description
         * @type {string}
         */
        this.description = data.channelMetadata.description;
        console.log("    - Channel description set to:", this.description);

        /**
         * Indicates if it is a Channel
         * @type {boolean}
         */
        this.isChannel = data.isChannel;

        /**
         * Indicates if it is a Group
         * @type {boolean}
         */
        this.isGroup = data.isGroup;

        /**
         * Indicates if the channel is readonly
         * @type {boolean}
         */
        this.isReadOnly = data.isReadOnly;

        /**
         * Amount of messages unread
         * @type {number}
         */
        this.unreadCount = data.unreadCount;
        console.log("    - Unread message count:", this.unreadCount);

        /**
         * Unix timestamp for when the last activity occurred
         * @type {number}
         */
        this.timestamp = data.t;

        /**
         * Indicates if the channel is muted or not
         * @type {boolean}
         */
        this.isMuted = data.isMuted;

        /**
         * Unix timestamp for when the mute expires
         * @type {number}
         */
        this.muteExpiration = data.muteExpiration;

        /**
         * Last message in the channel
         * @type {Message}
         */
        this.lastMessage = data.lastMessage ? new Message(super.client, data.lastMessage) : undefined;
        if (this.lastMessage) {
            console.log("    - Last message object created. Message body:", this.lastMessage.body);
        }

        console.log("✅ The Channel object has been successfully created.");
        return super._patch(data);
    }

    /**
     * Gets the subscribers of the channel (only those who are in your contact list)
     * @param {?number} limit Optional parameter to specify the limit of subscribers to retrieve
     * @returns {Promise<{contact: Contact, role: string}[]>} Returns an array of objects that handle the subscribed contacts and their roles in the channel
     */
    async getSubscribers(limit) {
        console.log("\n➡️ getSubscribers() called. Retrieving subscribed contacts from the channel.");
        console.log("    - Limit parameter:", limit || 'None (retrieving all)');
        const subscribers = await this.client.pupPage.evaluate(async (channelId, limit) => {
            console.log("[PUPPETEER_MOCK] Fetching subscribers from the browser API...");
            return [{
                contact: { id: { _serialized: 'mock_contact_id_1' }, pushname: 'Mock User 1' },
                role: 'ADMIN'
            }, {
                contact: { id: { _serialized: 'mock_contact_id_2' }, pushname: 'Mock User 2' },
                role: 'SUBSCRIBER'
            }];
        }, this.id._serialized, limit);

        console.log(`✅ getSubscribers() completed. Found ${subscribers.length} subscribers.`);
        return subscribers;
    }

    /**
     * Updates the channel subject
     * @param {string} newSubject 
     * @returns {Promise<boolean>} Returns true if the subject was properly updated. This can return false if the user does not have the necessary permissions.
     */
    async setSubject(newSubject) {
        console.log("\n➡️ setSubject() called. Attempting to change the channel subject to:", newSubject);
        const success = await this._setChannelMetadata({ name: newSubject }, { editName: true });
        success && (this.name = newSubject);
        console.log(`✅ setSubject() ${success ? 'completed successfully.' : 'failed. Insufficient permissions?'}`);
        return success;
    }

    /**
     * Updates the channel description
     * @param {string} newDescription 
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async setDescription(newDescription) {
        console.log("\n➡️ setDescription() called. Attempting to change the channel description.");
        console.log("    - New description:", newDescription);
        const success = await this._setChannelMetadata({ description: newDescription }, { editDescription: true });
        success && (this.description = newDescription);
        console.log(`✅ setDescription() ${success ? 'completed successfully.' : 'failed. Insufficient permissions?'}`);
        return success;
    }

    /**
     * Updates the channel profile picture
     * @param {MessageMedia} newProfilePicture 
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async setProfilePicture(newProfilePicture) {
        console.log("\n➡️ setProfilePicture() called. Attempting to change the channel's profile picture.");
        console.log("    - Received media object with MIME type:", newProfilePicture.mimetype);
        const success = await this._setChannelMetadata({ picture: newProfilePicture }, { editPicture: true });
        console.log(`✅ setProfilePicture() ${success ? 'completed successfully.' : 'failed. Insufficient permissions?'}`);
        return success;
    }

    /**
     * Updates available reactions to use in the channel
     * * Valid values for passing to the method are:
     * 0 for NONE reactions to be avaliable
     * 1 for BASIC reactions to be available: 👍, ❤️, 😂, 😮, 😢, 🙏
     * 2 for ALL reactions to be available
     * @param {number} reactionCode 
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async setReactionSetting(reactionCode) {
        console.log("\n➡️ setReactionSetting() called. Attempting to update reaction settings.");
        console.log("    - New reaction setting code:", reactionCode);
        if (![0, 1, 2].includes(reactionCode)) {
            console.log("❌ Error: Invalid reaction code. Must be 0, 1, or 2.");
            return false;
        }
        const reactionMapper = {
            0: 3,
            1: 1,
            2: 0
        };
        const success = await this._setChannelMetadata(
            { reactionCodesSetting: reactionMapper[reactionCode] },
            { editReactionCodesSetting: true }
        );
        success && (this.channelMetadata.reactionCodesSetting = reactionCode);
        console.log(`✅ setReactionSetting() ${success ? 'completed successfully.' : 'failed. Insufficient permissions?'}`);
        return success;
    }

    /**
     * Mutes the channel
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async mute() {
        console.log("\n➡️ mute() called. Attempting to mute the channel.");
        const success = await this._muteUnmuteChannel('MUTE');
        if (success) {
            this.isMuted = true;
            this.muteExpiration = -1;
            console.log("✅ mute() completed. The channel is now muted.");
        } else {
            console.log("❌ mute() failed. Insufficient permissions?");
        }
        return success;
    }
    
    /**
     * Unmutes the channel
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async unmute() {
        console.log("\n➡️ unmute() called. Attempting to unmute the channel.");
        const success = await this._muteUnmuteChannel('UNMUTE');
        if (success) {
            this.isMuted = false;
            this.muteExpiration = 0;
            console.log("✅ unmute() completed. The channel is now unmuted.");
        } else {
            console.log("❌ unmute() failed. Insufficient permissions?");
        }
        return success;
    }

    /**
     * Message options
     * @typedef {Object} MessageSendOptions
     * @property {?string} caption Image or video caption
     * @property {?string[]} mentions User IDs of user that will be mentioned in the message
     * @property {?MessageMedia} media Image or video to be sent
     */

    /**
     * Sends a message to this channel
     * @param {string|MessageMedia} content
     * @param {?MessageSendOptions} options
     * @returns {Promise<Message>} Message that was just sent
     */
    async sendMessage(content, options) {
        console.log("\n➡️ sendMessage() called. Sending a message to the channel.");
        console.log("    - Message content:", content);
        console.log("    - Message options:", options);
        return this.client.sendMessage(this.id._serialized, content, options);
    }

    /**
     * Sets the channel as seen
     * @returns {Promise<boolean>}
     */
    async sendSeen() {
        console.log("\n➡️ sendSeen() called. Marking the channel as seen.");
        const success = await this.client.sendSeen(this.id._serialized);
        console.log(`✅ sendSeen() ${success ? 'completed successfully.' : 'failed.'}`);
        return success;
    }

    /**
     * @typedef {Object} SendChannelAdminInviteOptions
     * @property {?string} comment The comment to be added to an invitation
     */

    /**
     * Sends a channel admin invitation to a user, allowing them to become an admin of the channel
     * @param {string} chatId The ID of a user to send the channel admin invitation to
     * @param {SendChannelAdminInviteOptions} options 
     * @returns {Promise<boolean>} Returns true if an invitation was sent successfully, false otherwise
     */
    async sendChannelAdminInvite(chatId, options = {}) {
        console.log("\n➡️ sendChannelAdminInvite() called. Sending an admin invite to:", chatId);
        const success = await this.client.sendChannelAdminInvite(chatId, this.id._serialized, options);
        console.log(`✅ sendChannelAdminInvite() ${success ? 'completed successfully.' : 'failed.'}`);
        return success;
    }

    /**
     * Accepts a channel admin invitation and promotes the current user to a channel admin
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async acceptChannelAdminInvite() {
        console.log("\n➡️ acceptChannelAdminInvite() called. Accepting an admin invitation.");
        const success = await this.client.acceptChannelAdminInvite(this.id._serialized);
        console.log(`✅ acceptChannelAdminInvite() ${success ? 'completed successfully.' : 'failed.'}`);
        return success;
    }

    /**
     * Revokes a channel admin invitation sent to a user by a channel owner
     * @param {string} userId The user ID the invitation was sent to
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async revokeChannelAdminInvite(userId) {
        console.log("\n➡️ revokeChannelAdminInvite() called. Revoking an admin invite from:", userId);
        const success = await this.client.revokeChannelAdminInvite(this.id._serialized, userId);
        console.log(`✅ revokeChannelAdminInvite() ${success ? 'completed successfully.' : 'failed.'}`);
        return success;
    }

    /**
     * Demotes a channel admin to a regular subscriber (can be used also for self-demotion)
     * @param {string} userId The user ID to demote
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async demoteChannelAdmin(userId) {
        console.log("\n➡️ demoteChannelAdmin() called. Demoting channel admin:", userId);
        const success = await this.client.demoteChannelAdmin(this.id._serialized, userId);
        console.log(`✅ demoteChannelAdmin() ${success ? 'completed successfully.' : 'failed.'}`);
        return success;
    }

    /**
     * Options for transferring a channel ownership to another user
     * @typedef {Object} TransferChannelOwnershipOptions
     * @property {boolean} [shouldDismissSelfAsAdmin = false] If true, after the channel ownership is being transferred to another user, the current user will be dismissed as a channel admin and will become to a channel subscriber.
     */

    /**
     * Transfers a channel ownership to another user.
     * Note: the user you are transferring the channel ownership to must be a channel admin.
     * @param {string} newOwnerId
     * @param {TransferChannelOwnershipOptions} options
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async transferChannelOwnership(newOwnerId, options = {}) {
        console.log("\n➡️ transferChannelOwnership() called. Transferring ownership to:", newOwnerId);
        console.log("    - Options provided:", options);
        const success = await this.client.transferChannelOwnership(this.id._serialized, newOwnerId, options);
        console.log(`✅ transferChannelOwnership() ${success ? 'completed successfully.' : 'failed.'}`);
        return success;
    }

    /**
     * Loads channel messages, sorted from earliest to latest
     * @param {Object} searchOptions Options for searching messages. Right now only limit and fromMe is supported
     * @param {Number} [searchOptions.limit] The amount of messages to return. If no limit is specified, the available messages will be returned. Note that the actual number of returned messages may be smaller if there aren't enough messages in the conversation. Set this to Infinity to load all messages
     * @param {Boolean} [searchOptions.fromMe] Return only messages from the bot number or vise versa. To get all messages, leave the option undefined
     * @returns {Promise<Array<Message>>}
     */
    async fetchMessages(searchOptions) {
        console.log("\n➡️ fetchMessages() called. Attempting to retrieve messages from the channel.");
        console.log("    - Search options:", searchOptions);
        const messages = await this.client.pupPage.evaluate(async (channelId, searchOptions) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to fetch messages...");
            const mockMessages = [
                { id: { _serialized: 'msg_1', fromMe: false }, body: 'Hello channel!' },
                { id: { _serialized: 'msg_2', fromMe: true }, body: 'This is my first post!' }
            ];
            const limit = searchOptions && searchOptions.limit || 10;
            return mockMessages.slice(0, limit).map(m => m);
        }, this.id._serialized, searchOptions);
        
        console.log(`✅ fetchMessages() completed. Found ${messages.length} messages.`);
        return messages.map((msg) => new Message(this.client, msg));
    }

    /**
     * Deletes the channel you created
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async deleteChannel() {
        console.log("\n➡️ deleteChannel() called. Deleting the channel.");
        const success = await this.client.deleteChannel(this.id._serialized);
        console.log(`✅ deleteChannel() ${success ? 'completed successfully.' : 'failed.'}`);
        return success;
    }

    /**
     * Internal method to change the channel metadata
     * @param {string|number|MessageMedia} value The new value to set
     * @param {string} property The property of a channel metadata to change
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async _setChannelMetadata(value, property) {
        console.log("\n➡️ _setChannelMetadata() internal method called.");
        console.log("    - Value to set:", value);
        console.log("    - Property to change:", property);
        const success = await this.client.pupPage.evaluate(async (channelId, value, property) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to change channel metadata...");
            return true;
        }, this.id._serialized, value, property);

        console.log(`✅ _setChannelMetadata() ${success ? 'completed successfully.' : 'failed.'}`);
        return success;
    }

    /**
     * Internal method to mute or unmute the channel
     * @param {string} action The action: 'MUTE' or 'UNMUTE'
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async _muteUnmuteChannel(action) {
        console.log("\n➡️ _muteUnmuteChannel() internal method called.");
        console.log("    - Action:", action);
        const success = await this.client.pupPage.evaluate(async (channelId, action) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to mute/unmute channel...");
            return true;
        }, this.id._serialized, action);
        
        console.log(`✅ _muteUnmuteChannel() ${success ? 'completed successfully.' : 'failed.'}`);
        return success;
    }
}

module.exports = Channel;

