'use strict';

const Base = require('./Base');

/**
 * Represents a Reaction on WhatsApp
 * @extends {Base}
 */
class Reaction extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new Reaction object is being created from raw data.");
            console.log("👉 The constructor received the following data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is processing the raw data to create a clean Reaction object.");
        
        /**
         * Reaction ID
         * @type {object}
         */
        this.id = data.msgKey;
        
        /**
         * Orphan
         * @type {number}
         */
        this.orphan = data.orphan;
        
        /**
         * Orphan reason
         * @type {?string}
         */
        this.orphanReason = data.orphanReason;
        
        /**
         * Unix timestamp for when the reaction was created
         * @type {number}
         */
        this.timestamp = data.timestamp;
        
        /**
         * Reaction
         * @type {string}
         */
        this.reaction = data.reactionText;
        
        /**
         * Read
         * @type {boolean}
         */
        this.read = data.read;
        
        /**
         * Message ID
         * @type {object}
         */
        this.msgId = data.parentMsgKey;
        
        /**
         * Sender ID
         * @type {string}
         */
        this.senderId = data.senderUserJid;
        
        /**
         * ACK
         * @type {?number}
         */
        this.ack = data.ack;
        
        console.log("✅ The Reaction object has been created with the following properties:");
        console.log("  - id:", this.id);
        console.log("  - reaction:", this.reaction);
        console.log("  - senderId:", this.senderId);
        console.log("  - msgId (Parent Message ID):", this.msgId);
        
        return super._patch(data);
    }
}

module.exports = Reaction;