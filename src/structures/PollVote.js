'use strict';

const Message = require('./Message');
const Base = require('./Base');

/**
 * Selected poll option structure
 * @typedef {Object} SelectedPollOption
 * @property {number} id The local selected or deselected option ID
 * @property {string} name The option name
 */

/**
 * Represents a Poll Vote on WhatsApp
 * @extends {Base}
 */
class PollVote extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new PollVote object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is organizing the raw poll vote data into a clean object.");

        /**
         * The person who voted
         * @type {string}
         */
        this.voter = data.sender;
        console.log("    - The voter's ID is:", this.voter);

        /**
         * The selected poll option(s)
         * If it's an empty array, the user hasn't selected any options on the poll,
         * may occur when they deselected all poll options
         * @type {SelectedPollOption[]}
         */
        this.selectedOptions =
            data.selectedOptionLocalIds.length > 0
                ? data.selectedOptionLocalIds.map((e) => ({
                    name: data.parentMessage.pollOptions.find((x) => x.localId === e).name,
                    localId: e
                }))
                : [];
        if (this.selectedOptions.length > 0) {
            console.log("    - The user selected poll options. The selectedOptions array has been populated.");
            console.log("      - Selected Option(s):", this.selectedOptions.map(o => o.name).join(', '));
        } else {
            console.log("    - The user deselected all poll options. The selectedOptions array is empty.");
        }

        /**
         * Timestamp the option was selected or deselected at
         * @type {number}
         */
        this.interractedAtTs = data.senderTimestampMs;
        console.log("    - Interaction timestamp:", this.interractedAtTs);

        /**
         * The poll creation message associated with the poll vote
         * @type {Message}
         */
        this.parentMessage = new Message(this.client, data.parentMessage);
        console.log("    - The parentMessage (the poll itself) has been linked to this vote.");

        console.log("✅ The PollVote object has been successfully created.");

        return super._patch(data);
    }
}

module.exports = PollVote;