'use strict';

const Base = require('./Base');

/**
 * Represents a Call on WhatsApp
 * @extends {Base}
 */
class Call extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new Call object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is organizing the raw call data into a clean object.");
        /**
         * Call ID
         * @type {string}
         */
        this.id = data.id;
        console.log("    - Call ID set to:", this.id);

        /**
         * From
         * @type {string}
         */
        this.from = data.peerJid;
        console.log("    - Caller ID (peerJid) set to:", this.from);

        /**
         * Unix timestamp for when the call was created
         * @type {number}
         */
        this.timestamp = data.offerTime;
        console.log("    - Timestamp set to:", this.timestamp);

        /**
         * Is video
         * @type {boolean}
         */
        this.isVideo = data.isVideo;
        console.log("    - Is a video call?", this.isVideo);

        /**
         * Is Group
         * @type {boolean}
         */
        this.isGroup = data.isGroup;
        console.log("    - Is a group call?", this.isGroup);

        /**
         * Indicates if the call was sent by the current user
         * @type {boolean}
         */
        this.fromMe = data.outgoing;
        console.log("    - Is the call from me?", this.fromMe);

        /**
         * Indicates if the call can be handled in waweb
         * @type {boolean}
         */
        this.canHandleLocally = data.canHandleLocally;

        /**
         * Indicates if the call Should be handled in waweb
         * @type {boolean}
         */
        this.webClientShouldHandle = data.webClientShouldHandle;

        /**
         * Object with participants
         * @type {object}
         */
        this.participants = data.participants;
        if (this.participants) {
            console.log("    - Participants object set. Number of participants:", this.participants.length);
        }
        
        console.log("✅ The Call object has been successfully created.");
        return super._patch(data);
    }

    /**
     * Reject the call
    */
    async reject() {
        console.log("\n➡️ reject() called. Attempting to reject the call.");
        console.log(`    - This will call the browser-side function with peerJid: ${this.from} and call ID: ${this.id}`);
        const result = await this.client.pupPage.evaluate((peerJid, id) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to reject call...");
            // A mock implementation of the browser function.
            const successful = Math.random() > 0.1; // Simulate a 90% success rate
            return successful ? { status: 'ok' } : { status: 'error' };
        }, this.from, this.id);
        
        if (result.status === 'ok') {
            console.log("✅ reject() completed successfully. The call has been rejected.");
        } else {
            console.log("❌ reject() failed. The call could not be rejected.");
        }

        return result;
    }
}

module.exports = Call;

