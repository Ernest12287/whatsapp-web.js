'use strict';

const Base = require('./Base');
const MessageMedia = require('./MessageMedia');
const Location = require('./Location');
const Order = require('./Order');
const Payment = require('./Payment');
const Reaction = require('./Reaction');
const Contact = require('./Contact');
const ScheduledEvent = require('./ScheduledEvent'); // eslint-disable-line no-unused-vars
const { MessageTypes } = require('../util/Constants');

/**
 * Represents a Message on WhatsApp
 * @extends {Base}
 */
class Message extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new Message object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is organizing the raw message data into a clean object.");
        this._data = data;
        
        /**
         * MediaKey that represents the sticker 'ID'
         * @type {string}
         */
        this.mediaKey = data.mediaKey;
        
        /**
         * ID that represents the message
         * @type {object}
         */
        this.id = data.id;

        /**
         * ACK status for the message
         * @type {MessageAck}
         */
        this.ack = data.ack;

        /**
         * Indicates if the message has media available for download
         * @type {boolean}
         */
        this.hasMedia = Boolean(data.directPath);

        /**
         * Message content
         * @type {string}
         */
        this.body = this.hasMedia ? data.caption || '' : data.body || data.pollName || data.eventName || '';

        /**
         * Message type
         * @type {MessageTypes}
         */
        this.type = data.type;

        /**
         * Unix timestamp for when the message was created
         * @type {number}
         */
        this.timestamp = data.t;

        /**
         * ID for the Chat that this message was sent to, except if the message was sent by the current user.
         * @type {string}
         */
        this.from = (typeof (data.from) === 'object' && data.from !== null) ? data.from._serialized : data.from;

        /**
         * ID for who this message is for.
         *
         * If the message is sent by the current user, it will be the Chat to which the message is being sent.
         * If the message is sent by another user, it will be the ID for the current user.
         * @type {string}
         */
        this.to = (typeof (data.to) === 'object' && data.to !== null) ? data.to._serialized : data.to;

        /**
         * If the message was sent to a group, this field will contain the user that sent the message.
         * @type {string}
         */
        this.author = (typeof (data.author) === 'object' && data.author !== null) ? data.author._serialized : data.author;

        /**
         * String that represents from which device type the message was sent
         * @type {string}
         */
        this.deviceType = typeof data.id.id === 'string' && data.id.id.length > 21 ? 'android' : typeof data.id.id === 'string' && data.id.id.substring(0, 2) === '3A' ? 'ios' : 'web';
        /**
         * Indicates if the message was forwarded
         * @type {boolean}
         */
        this.isForwarded = data.isForwarded;

        /**
         * Indicates how many times the message was forwarded.
         *
         * The maximum value is 127.
         * @type {number}
         */
        this.forwardingScore = data.forwardingScore || 0;

        /**
         * Indicates if the message is a status update
         * @type {boolean}
         */
        this.isStatus = data.isStatusV3 || data.id.remote === 'status@broadcast';

        /**
         * Indicates if the message was starred
         * @type {boolean}
         */
        this.isStarred = data.star;

        /**
         * Indicates if the message was a broadcast
         * @type {boolean}
         */
        this.broadcast = data.broadcast;

        /**
         * Indicates if the message was sent by the current user
         * @type {boolean}
         */
        this.fromMe = data.id.fromMe;

        /**
         * Indicates if the message was sent as a reply to another message.
         * @type {boolean}
         */
        this.hasQuotedMsg = data.quotedMsg ? true : false;

        /**
         * Indicates whether there are reactions to the message
         * @type {boolean}
         */
        this.hasReaction = data.hasReaction ? true : false;

        /**
         * Indicates the duration of the message in seconds
         * @type {string}
         */
        this.duration = data.duration ? data.duration : undefined;

        /**
         * Location information contained in the message, if the message is type "location"
         * @type {Location}
         */
        this.location = (() => {
            if (data.type !== MessageTypes.LOCATION) {
                return undefined;
            }
            let description;
            if (data.loc && typeof data.loc === 'string') {
                let splitted = data.loc.split('\n');
                description = {
                    name: splitted[0],
                    address: splitted[1],
                    url: data.clientUrl
                };
            }
            console.log("    - The message contains Location data. A new Location object will be created.");
            return new Location(data.lat, data.lng, description);
        })();

        /**
         * List of vCards contained in the message.
         * @type {Array<string>}
         */
        this.vCards = data.type === MessageTypes.CONTACT_CARD_MULTI ? data.vcardList.map((c) => c.vcard) : data.type === MessageTypes.CONTACT_CARD ? [data.body] : [];
        if (this.vCards.length) {
            console.log("    - The message contains vCard data. The vCards property will be an array.");
        }

        /**
         * Group Invite Data
         * @type {object}
         */
        this.inviteV4 = data.type === MessageTypes.GROUP_INVITE ? {
            inviteCode: data.inviteCode,
            inviteCodeExp: data.inviteCodeExp,
            groupId: data.inviteGrp,
            groupName: data.inviteGrpName,
            fromId: typeof data.from === 'object' && '_serialized' in data.from ? data.from._serialized : data.from,
            toId: typeof data.to === 'object' && '_serialized' in data.to ? data.to._serialized : data.to
        } : undefined;
        if (this.inviteV4) {
            console.log("    - This is a Group Invite message. The inviteV4 property has been populated.");
        }

        /**
         * Indicates the mentions in the message body.
         * @type {string[]}
         */
        this.mentionedIds = data.mentionedJidList || [];
        if (this.mentionedIds.length) {
            console.log("    - This message mentions other users. The mentionedIds array has been populated.");
        }

        /**
         * @typedef {Object} GroupMention
         * @property {string} groupSubject The name  of the group
         * @property {string} groupJid The group ID
         */

        /**
         * Indicates whether there are group mentions in the message body
         * @type {GroupMention[]}
         */
        this.groupMentions = data.groupMentions || [];

        /**
         * Order ID for message type ORDER
         * @type {string}
         */
        this.orderId = data.orderId ? data.orderId : undefined;
        /**
         * Order Token for message type ORDER
         * @type {string}
         */
        this.token = data.token ? data.token : undefined;

        /** * Indicates whether the message is a Gif
         * @type {boolean}
         */
        this.isGif = Boolean(data.isGif);

        /**
         * Indicates if the message will disappear after it expires
         * @type {boolean}
         */
        this.isEphemeral = data.isEphemeral;

        /** Title */
        if (data.title) {
            this.title = data.title;
        }

        /** Description */
        if (data.description) {
            this.description = data.description;
        }

        /** Business Owner JID */
        if (data.businessOwnerJid) {
            this.businessOwnerJid = data.businessOwnerJid;
        }

        /** Product ID */
        if (data.productId) {
            this.productId = data.productId;
        }

        /** Last edit time */
        if (data.latestEditSenderTimestampMs) {
            this.latestEditSenderTimestampMs = data.latestEditSenderTimestampMs;
        }

        /** Last edit message author */
        if (data.latestEditMsgKey) {
            this.latestEditMsgKey = data.latestEditMsgKey;
        }
        
        /**
         * Links included in the message.
         * @type {Array<{link: string, isSuspicious: boolean}>}
         *
         */
        this.links = data.links;
        if (this.links) {
            console.log("    - The message contains links. The links property has been populated.");
        }

        /** Buttons */
        if (data.dynamicReplyButtons) {
            this.dynamicReplyButtons = data.dynamicReplyButtons;
        }

        /** Selected Button Id **/
        if (data.selectedButtonId) {
            this.selectedButtonId = data.selectedButtonId;
        }

        /** Selected List row Id **/
        if (data.listResponse && data.listResponse.singleSelectReply.selectedRowId) {
            this.selectedRowId = data.listResponse.singleSelectReply.selectedRowId;
        }

        if (this.type === MessageTypes.POLL_CREATION) {
            console.log("    - This is a poll creation message. The poll properties have been set.");
            this.pollName = data.pollName;
            this.pollOptions = data.pollOptions;
            this.allowMultipleAnswers = Boolean(!data.pollSelectableOptionsCount);
            this.pollInvalidated = data.pollInvalidated;
            this.isSentCagPollCreation = data.isSentCagPollCreation;
            this.messageSecret = data.messageSecret ? Object.keys(data.messageSecret).map((key) => data.messageSecret[key]) : [];
        }

        console.log("✅ The Message object has been created with the following key properties:");
        console.log("  - ID:", this.id);
        console.log("  - Body:", this.body);
        console.log("  - Type:", this.type);
        console.log("  - Sent by me?", this.fromMe);
        console.log("  - Has Media?", this.hasMedia);
        
        return super._patch(data);
    }

    _getChatId() {
        return this.fromMe ? this.to : this.from;
    }

    /**
     * Reloads this Message object's data in-place with the latest values from WhatsApp Web. 
     * Note that the Message must still be in the web app cache for this to work, otherwise will return null.
     * @returns {Promise<Message>}
     */
    async reload() {
        console.log("\n🔄 reload() called. Attempting to get the latest data for this message.");
        const newData = await this.client.pupPage.evaluate(async (msgId) => {
            const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
            if (!msg) return null;
            return window.WWebJS.getMessageModel(msg);
        }, this.id._serialized);

        if(!newData) {
            console.log("❌ reload() failed. The message could not be found in the cache. Returning null.");
            return null;
        }
        
        console.log("✅ reload() succeeded. Patching the existing object with new data.");
        this._patch(newData);
        return this;
    }

    /**
     * Returns message in a raw format
     * @type {Object}
     */
    get rawData() {
        console.log("\n📦 rawData property was accessed. Returning the original, un-patched data.");
        return this._data;
    }
    
    /**
     * Returns the Chat this message was sent in
     * @returns {Promise<Chat>}
     */
    getChat() {
        console.log("\n💬 getChat() called. Fetching the Chat object for this message.");
        return this.client.getChatById(this._getChatId());
    }

    /**
     * Returns the Contact this message was sent from
     * @returns {Promise<Contact>}
     */
    getContact() {
        console.log("\n👥 getContact() called. Fetching the Contact object for the message author.");
        return this.client.getContactById(this.author || this.from);
    }

    /**
     * Returns the Contacts mentioned in this message
     * @returns {Promise<Array<Contact>>}
     */
    async getMentions() {
        console.log("\n👥 getMentions() called. Fetching Contact objects for mentioned users.");
        const mentions = await Promise.all(this.mentionedIds.map(async m => await this.client.getContactById(m)));
        console.log(`✅ getMentions() completed. Found ${mentions.length} mentions.`);
        return mentions;
    }
    
    /**
     * Returns groups mentioned in this message
     * @returns {Promise<GroupChat[]|[]>}
     */
    async getGroupMentions() {
        console.log("\n👥 getGroupMentions() called. Fetching GroupChat objects for mentioned groups.");
        const mentions = await Promise.all(this.groupMentions.map(async (m) => await this.client.getChatById(m.groupJid._serialized)));
        console.log(`✅ getGroupMentions() completed. Found ${mentions.length} group mentions.`);
        return mentions;
    }

    /**
     * Returns the quoted message, if any
     * @returns {Promise<Message>}
     */
    async getQuotedMessage() {
        console.log("\n➡️ getQuotedMessage() called. Checking for a quoted message.");
        if (!this.hasQuotedMsg) {
            console.log("❌ No quoted message found. Returning undefined.");
            return undefined;
        }

        const quotedMsg = await this.client.pupPage.evaluate(async (msgId) => {
            const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
            const quotedMsg = window.Store.QuotedMsg.getQuotedMsgObj(msg);
            return window.WWebJS.getMessageModel(quotedMsg);
        }, this.id._serialized);

        console.log("✅ getQuotedMessage() completed. A new Message object for the quoted message has been returned.");
        return new Message(this.client, quotedMsg);
    }

    /**
     * Sends a message as a reply to this message. If chatId is specified, it will be sent
     * through the specified Chat. If not, it will send the message
     * in the same Chat as the original message was sent.
     *
     * @param {string|MessageMedia|Location} content
     * @param {string} [chatId]
     * @param {MessageSendOptions} [options]
     * @returns {Promise<Message>}
     */
    async reply(content, chatId, options = {}) {
        console.log("\n↩️ reply() called. Replying to this message with content:", content);
        if (!chatId) {
            chatId = this._getChatId();
            console.log("    - No chatId was provided, replying to the original chat:", chatId);
        }

        options = {
            ...options,
            quotedMessageId: this.id._serialized
        };

        const result = this.client.sendMessage(chatId, content, options);
        console.log("✅ reply() completed. The new Message object for the reply has been returned.");
        return result;
    }

    /**
     * React to this message with an emoji
     * @param {string} reaction - Emoji to react with. Send an empty string to remove the reaction.
     * @return {Promise}
     */
    async react(reaction){
        console.log("\n👍 react() called. Attempting to add reaction:", reaction);
        await this.client.pupPage.evaluate(async (messageId, reaction) => {
            if (!messageId) return null;
            const msg =
                window.Store.Msg.get(messageId) || (await window.Store.Msg.getMessagesById([messageId]))?.messages?.[0];
            if(!msg) return null;
            await window.Store.sendReactionToMsg(msg, reaction);
        }, this.id._serialized, reaction);
        console.log("✅ react() completed. The reaction should now be visible.");
    }

    /**
     * Accept Group V4 Invite
     * @returns {Promise<Object>}
     */
    async acceptGroupV4Invite() {
        console.log("\n🤝 acceptGroupV4Invite() called. Accepting the group invite.");
        const result = await this.client.acceptGroupV4Invite(this.inviteV4);
        console.log("✅ acceptGroupV4Invite() completed. Result:", result);
        return result;
    }

    /**
     * Forwards this message to another chat (that you chatted before, otherwise it will fail)
     *
     * @param {string|Chat} chat Chat model or chat ID to which the message will be forwarded
     * @returns {Promise}
     */
    async forward(chat) {
        console.log("\n➡️ forward() called. Forwarding the message to chat:", chat.id);
        const chatId = typeof chat === 'string' ? chat : chat.id._serialized;

        await this.client.pupPage.evaluate(async (msgId, chatId) => {
            return window.WWebJS.forwardMessage(chatId, msgId);
        }, this.id._serialized, chatId);
        console.log("✅ forward() completed. The message has been forwarded.");
    }

    /**
     * Downloads and returns the attatched message media
     * @returns {Promise<MessageMedia>}
     */
    async downloadMedia() {
        console.log("\n⬇️ downloadMedia() called. Attempting to download media from this message.");
        if (!this.hasMedia) {
            console.log("❌ This message has no media. Returning undefined.");
            return undefined;
        }

        const result = await this.client.pupPage.evaluate(async (msgId) => {
            const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
            if (!msg || !msg.mediaData) {
                return null;
            }
            if (msg.mediaData.mediaStage != 'RESOLVED') {
                // try to resolve media
                await msg.downloadMedia({
                    downloadEvenIfExpensive: true,
                    rmrReason: 1
                });
            }

            if (msg.mediaData.mediaStage.includes('ERROR') || msg.mediaData.mediaStage === 'FETCHING') {
                // media could not be downloaded
                return undefined;
            }

            try {
                const decryptedMedia = await window.Store.DownloadManager.downloadAndMaybeDecrypt({
                    directPath: msg.directPath,
                    encFilehash: msg.encFilehash,
                    filehash: msg.filehash,
                    mediaKey: msg.mediaKey,
                    mediaKeyTimestamp: msg.mediaKeyTimestamp,
                    type: msg.type,
                    signal: (new AbortController).signal
                });

                const data = await window.WWebJS.arrayBufferToBase64Async(decryptedMedia);

                return {
                    data,
                    mimetype: msg.mimetype,
                    filename: msg.filename,
                    filesize: msg.size
                };
            } catch (e) {
                if(e.status && e.status === 404) return undefined;
                throw e;
            }
        }, this.id._serialized);

        if (!result) {
            console.log("❌ An error occurred during media download. Returning undefined.");
            return undefined;
        }
        console.log("✅ downloadMedia() completed. A new MessageMedia object has been returned.");
        return new MessageMedia(result.mimetype, result.data, result.filename, result.filesize);
    }

    /**
     * Deletes a message from the chat
     * @param {?boolean} everyone If true and the message is sent by the current user or the user is an admin, will delete it for everyone in the chat.
     * @param {?boolean} [clearMedia = true] If true, any associated media will also be deleted from a device.
     */
    async delete(everyone, clearMedia = true) {
        console.log("\n🗑️ delete() called. Attempting to delete the message.");
        if (everyone) {
            console.log("    - The 'everyone' flag is true. Trying to delete for all users.");
        }
        await this.client.pupPage.evaluate(async (msgId, everyone, clearMedia) => {
            const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
            const chat = window.Store.Chat.get(msg.id.remote) || (await window.Store.Chat.find(msg.id.remote));
            
            const canRevoke =
                window.Store.MsgActionChecks.canSenderRevokeMsg(msg) || window.Store.MsgActionChecks.canAdminRevokeMsg(msg);

            if (everyone && canRevoke) {
                return window.compareWwebVersions(window.Debug.VERSION, '>=', '2.3000.0')
                    ? window.Store.Cmd.sendRevokeMsgs(chat, { list: [msg], type: 'message' }, { clearMedia: clearMedia })
                    : window.Store.Cmd.sendRevokeMsgs(chat, [msg], { clearMedia: true, type: msg.id.fromMe ? 'Sender' : 'Admin' });
            }

            return window.compareWwebVersions(window.Debug.VERSION, '>=', '2.3000.0')
                ? window.Store.Cmd.sendDeleteMsgs(chat, { list: [msg], type: 'message' }, clearMedia)
                : window.Store.Cmd.sendDeleteMsgs(chat, [msg], clearMedia);
        }, this.id._serialized, everyone, clearMedia);
        console.log("✅ delete() completed. The message should now be deleted.");
    }

    /**
     * Stars this message
     */
    async star() {
        console.log("\n⭐ star() called. Attempting to star the message.");
        await this.client.pupPage.evaluate(async (msgId) => {
            const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
            if (window.Store.MsgActionChecks.canStarMsg(msg)) {
                let chat = await window.Store.Chat.find(msg.id.remote);
                return window.Store.Cmd.sendStarMsgs(chat, [msg], false);
            }
        }, this.id._serialized);
        console.log("✅ star() completed. The message should now be starred.");
    }

    /**
     * Unstars this message
     */
    async unstar() {
        console.log("\n⭐ unstar() called. Attempting to unstar the message.");
        await this.client.pupPage.evaluate(async (msgId) => {
            const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
            if (window.Store.MsgActionChecks.canStarMsg(msg)) {
                let chat = await window.Store.Chat.find(msg.id.remote);
                return window.Store.Cmd.sendUnstarMsgs(chat, [msg], false);
            }
        }, this.id._serialized);
        console.log("✅ unstar() completed. The message should now be unstarred.");
    }

    /**
     * Pins the message (group admins can pin messages of all group members)
     * @param {number} duration The duration in seconds the message will be pinned in a chat
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async pin(duration) {
        console.log("\n📌 pin() called. Pinning the message for", duration, "seconds.");
        const result = await this.client.pupPage.evaluate(async (msgId, duration) => {
            return await window.WWebJS.pinUnpinMsgAction(msgId, 1, duration);
        }, this.id._serialized, duration);
        console.log("✅ pin() completed. Result:", result);
        return result;
    }

    /**
     * Unpins the message (group admins can unpin messages of all group members)
     * @returns {Promise<boolean>} Returns true if the operation completed successfully, false otherwise
     */
    async unpin() {
        console.log("\n📌 unpin() called. Unpinning the message.");
        const result = await this.client.pupPage.evaluate(async (msgId) => {
            return await window.WWebJS.pinUnpinMsgAction(msgId, 2);
        }, this.id._serialized);
        console.log("✅ unpin() completed. Result:", result);
        return result;
    }

    /**
     * Message Info
     * @typedef {Object} MessageInfo
     * @property {Array<{id: ContactId, t: number}>} delivery Contacts to which the message has been delivered to
     * @property {number} deliveryRemaining Amount of people to whom the message has not been delivered to
     * @property {Array<{id: ContactId, t: number}>} played Contacts who have listened to the voice message
     * @property {number} playedRemaining Amount of people who have not listened to the message
     * @property {Array<{id: ContactId, t: number}>} read Contacts who have read the message
     * @property {number} readRemaining Amount of people who have not read the message
     */

    /**
     * Get information about message delivery status.
     * May return null if the message does not exist or is not sent by you.
     * @returns {Promise<?MessageInfo>}
     */
    async getInfo() {
        console.log("\nℹ️ getInfo() called. Fetching delivery information for this message.");
        const info = await this.client.pupPage.evaluate(async (msgId) => {
            const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
            if (!msg || !msg.id.fromMe) return null;

            return new Promise((resolve) => {
                setTimeout(async () => {
                    resolve(await window.Store.getMsgInfo(msg.id));
                }, (Date.now() - msg.t * 1000 < 1250) && Math.floor(Math.random() * (1200 - 1100 + 1)) + 1100 || 0);
            });
        }, this.id._serialized);

        if (!info) {
            console.log("❌ getInfo() failed. The message may not be sent by the bot. Returning null.");
            return null;
        }

        console.log("✅ getInfo() completed. The message info object has been returned.");
        console.log("    - Read by:", info.read.length, "contacts.");
        console.log("    - Delivered to:", info.delivery.length, "contacts.");
        return info;
    }

    /**
     * Gets the order associated with a given message
     * @return {Promise<Order>}
     */
    async getOrder() {
        console.log("\n📦 getOrder() called. Checking for an associated Order object.");
        if (this.type === MessageTypes.ORDER) {
            const result = await this.client.pupPage.evaluate((orderId, token, chatId) => {
                return window.WWebJS.getOrderDetail(orderId, token, chatId);
            }, this.orderId, this.token, this._getChatId());
            if (!result) {
                console.log("❌ No order details were found. Returning undefined.");
                return undefined;
            }
            console.log("✅ getOrder() completed. A new Order object has been returned.");
            return new Order(this.client, result);
        }
        console.log("❌ The message type is not 'ORDER'. Returning undefined.");
        return undefined;
    }
    /**
     * Gets the payment details associated with a given message
     * @return {Promise<Payment>}
     */
    async getPayment() {
        console.log("\n💳 getPayment() called. Checking for associated Payment details.");
        if (this.type === MessageTypes.PAYMENT) {
            const msg = await this.client.pupPage.evaluate(async (msgId) => {
                const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
                if(!msg) return null;
                return msg.serialize();
            }, this.id._serialized);
            console.log("✅ getPayment() completed. A new Payment object has been returned.");
            return new Payment(this.client, msg);
        }
        console.log("❌ The message type is not 'PAYMENT'. Returning undefined.");
        return undefined;
    }


    /**
     * Reaction List
     * @typedef {Object} ReactionList
     * @property {string} id Original emoji
     * @property {string} aggregateEmoji aggregate emoji
     * @property {boolean} hasReactionByMe Flag who sent the reaction
     * @property {Array<Reaction>} senders Reaction senders, to this message
     */

    /**
     * Gets the reactions associated with the given message
     * @return {Promise<ReactionList[]>}
     */
    async getReactions() {
        console.log("\n😊 getReactions() called. Fetching reactions for this message.");
        if (!this.hasReaction) {
            console.log("❌ This message has no reactions. Returning undefined.");
            return undefined;
        }

        const reactions = await this.client.pupPage.evaluate(async (msgId) => {
            const msgReactions = await window.Store.Reactions.find(msgId);
            if (!msgReactions || !msgReactions.reactions.length) return null;
            return msgReactions.reactions.serialize();
        }, this.id._serialized);

        if (!reactions) {
            console.log("❌ An error occurred while fetching reactions. Returning undefined.");
            return undefined;
        }

        console.log("✅ getReactions() completed. Returning an array of Reaction objects.");
        return reactions.map(reaction => {
            reaction.senders = reaction.senders.map(sender => {
                sender.timestamp = Math.round(sender.timestamp / 1000);
                return new Reaction(this.client, sender);
            });
            return reaction;
        });
    }

    /**
     * Edits the current message.
     * @param {string} content
     * @param {MessageEditOptions} [options] - Options used when editing the message
     * @returns {Promise<?Message>}
     */
    async edit(content, options = {}) {
        console.log("\n✍️ edit() called. Attempting to edit the message with new content:", content);
        
        if (options.mentions) {
            !Array.isArray(options.mentions) && (options.mentions = [options.mentions]);
            if (options.mentions.some((possiblyContact) => possiblyContact instanceof Contact)) {
                console.warn('Mentions with an array of Contact are now deprecated. See more at https://github.com/pedroslopez/whatsapp-web.js/pull/2166.');
                options.mentions = options.mentions.map((a) => a.id._serialized);
            }
        }

        options.groupMentions && !Array.isArray(options.groupMentions) && (options.groupMentions = [options.groupMentions]);

        let internalOptions = {
            linkPreview: options.linkPreview === false ? undefined : true,
            mentionedJidList: options.mentions || [],
            groupMentions: options.groupMentions,
            extraOptions: options.extra
        };
        
        if (!this.fromMe) {
            console.log("❌ edit() failed. This message was not sent by the bot. Returning null.");
            return null;
        }
        const messageEdit = await this.client.pupPage.evaluate(async (msgId, message, options) => {
            const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
            if (!msg) return null;

            let canEdit = window.Store.MsgActionChecks.canEditText(msg) || window.Store.MsgActionChecks.canEditCaption(msg);
            if (canEdit) {
                const msgEdit = await window.WWebJS.editMessage(msg, message, options);
                return msgEdit.serialize();
            }
            return null;
        }, this.id._serialized, content, internalOptions);
        
        if (messageEdit) {
            console.log("✅ edit() completed. A new Message object has been returned for the edited message.");
            return new Message(this.client, messageEdit);
        }
        console.log("❌ edit() failed. It may not be an editable message type. Returning null.");
        return null;
    }

    /**
     * Edits the current ScheduledEvent message.
     * Once the scheduled event is canceled, it can not be edited.
     * @param {ScheduledEvent} editedEventObject
     * @returns {Promise<?Message>}
     */
    async editScheduledEvent(editedEventObject) {
        console.log("\n📝 editScheduledEvent() called. Attempting to edit a scheduled event message.");
        if (!this.fromMe) {
            console.log("❌ editScheduledEvent() failed. This message was not sent by the bot. Returning null.");
            return null;
        }

        const edittedEventMsg = await this.client.pupPage.evaluate(async (msgId, editedEventObject) => {
            const msg = window.Store.Msg.get(msgId) || (await window.Store.Msg.getMessagesById([msgId]))?.messages?.[0];
            if (!msg) return null;

            const { name, startTimeTs, eventSendOptions } = editedEventObject;
            const eventOptions = {
                name: name,
                description: eventSendOptions.description,
                startTime: startTimeTs,
                endTime: eventSendOptions.endTimeTs,
                location: eventSendOptions.location,
                callType: eventSendOptions.callType,
                isEventCanceled: eventSendOptions.isEventCanceled,
            };

            await window.Store.ScheduledEventMsgUtils.sendEventEditMessage(eventOptions, msg);
            const editedMsg = window.Store.Msg.get(msg.id._serialized);
            return editedMsg?.serialize();
        }, this.id._serialized, editedEventObject);

        console.log("✅ editScheduledEvent() completed. Returning a new Message object for the updated event.");
        return edittedEventMsg && new Message(this.client, edittedEventMsg);
    }
}

module.exports = Message;