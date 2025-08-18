'use strict';

// -----------------------------------------------------------
// A. What this code expects as INPUTS
// -----------------------------------------------------------

/**
 * Poll send options
 * @typedef {Object} PollSendOptions
 * @property {boolean} [allowMultipleAnswers=false] - If false, it's a single-choice poll.
 * @property {?Array<number>} messageSecret - A unique ID for the poll.
 */

/**
 * Represents a Poll on WhatsApp.
 * This class expects three main inputs in its constructor.
 */
class Poll {
    /**
     * @param {string} pollName - The name or question of the poll. This expects a string.
     * @param {Array<string>} pollOptions - The list of choices for the poll. This expects an array of strings.
     * @param {PollSendOptions} options - Additional settings for the poll. This expects an object.
     */
    constructor(pollName, pollOptions, options = {}) {
        // Log the inputs to show what the constructor receives.
        console.log("👉 CONSTRUCTOR START: A new Poll object is being created.");
        console.log("  - EXPECTED INPUT (pollName):", pollName);
        console.log("  - EXPECTED INPUT (pollOptions):", pollOptions);
        console.log("  - EXPECTED INPUT (options):", options);

        // -----------------------------------------------------------
        // B. How this code processes and produces OUTPUTS
        // -----------------------------------------------------------

        /**
         * The name of the poll.
         * The input string is trimmed for whitespace.
         * @type {string}
         */
        this.pollName = pollName.trim();
        
        /**
         * The array of poll options.
         * The input array of strings is processed into an array of objects.
         * Each object has a 'name' (string) and a 'localId' (number).
         * @type {Array.<{name: string, localId: number}>}
         */
        this.pollOptions = pollOptions.map((option, index) => ({
            name: option.trim(),
            localId: index
        }));
        console.log(" Each object should have a name that is a STRING  and a localid WHICH MUST BE A NUMBER")
        /**
         * The send options for the poll.
         * The input object is used to set the final properties.
         * @type {PollSendOptions}
         */
        this.options = {
            allowMultipleAnswers: options.allowMultipleAnswers === true,
            messageSecret: options.messageSecret
        };

        // Log the final object properties to show the student the final output.
        console.log("\n🚀 CONSTRUCTOR FINISHED: The Poll object has been created.");
        console.log("  - PRODUCED PROPERTY (pollName):", this.pollName);
        console.log("  - PRODUCED PROPERTY (pollOptions):", this.pollOptions);
        console.log("  - PRODUCED PROPERTY (options):", this.options);
    }
}

module.exports = Poll;