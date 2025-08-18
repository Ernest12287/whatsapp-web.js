'use strict';

/**
 * ScheduledEvent send options
 * @typedef {Object} ScheduledEventSendOptions
 * @property {?string} description The scheduled event description
 * @property {?Date} endTime The end time of the event
 * @property {?string} location The location of the event
 * @property {?string} callType The type of a WhatsApp call link to generate, valid values are: `video` | `voice`
 * @property {boolean} [isEventCanceled = false] Indicates if a scheduled event should be sent as an already canceled
 * @property {?Array<number>} messageSecret The custom message secret, can be used as an event ID. NOTE: it has to be a unique vector with a length of 32
 */

/** Represents a ScheduledEvent on WhatsApp */
class ScheduledEvent {
    /**
     * @param {string} name
     * @param {Date} startTime
     * @param {ScheduledEventSendOptions} options
     */

    
    
    constructor(name, startTime, options = {}) {
        console.log("ok this function basically creates a scheduled event");
        console.log("what is expects is simple it needs a name that is a string and must be a string \n a start time this must be in date form \n options this can either be a string or well we can say they are instructions ");
        
        
        /**
         * The name of the event
         * @type {string}
         */
        this.name = this._validateInputs('name', name).trim();

        /**
         * The start time of the event
         * @type {number}
         */
        this.startTimeTs = Math.floor(startTime.getTime() / 1000);

        /**
         * The send options for the event
         * @type {Object}
         */
        this.eventSendOptions = {
            description: options.description?.trim(),
            endTimeTs: options.endTime ? Math.floor(options.endTime.getTime() / 1000) : null,
            location: options.location?.trim(),
            callType: this._validateInputs('callType', options.callType),
            isEventCanceled: options.isEventCanceled ?? false,
            messageSecret: options.messageSecret
        };
        console.log("there are some things the library expects like for the name a string example `my food` \n the start time should be a number like 02.45pm or rather you can forget about the pm but make sure youhave a time check function \n the event send options areand can be sth like desctiption that you want, end time, call type and many more  ");
                // At the end of your constructor, replace the old log with this:
        console.log("there are some things the library produces: an object.");
        console.log("The object has a name, a start time, and other properties under 'eventSendOptions'.");
        console.log("To use them, you access the properties directly, for example:");
        console.log("  - The name is: scheduledEvent.name");
        console.log("  - The description is: scheduledEvent.eventSendOptions.description");
        console.log("  - The start time (in UTC) is: scheduledEvent.startTimeTs");
        console.log("You will pass the entire 'scheduledEvent' object to a client method to send it.");
        
    }

    /**
     * Inner function to validate input values
     * @param {string} propName The property name to validate the value of
     * @param {string | number} propValue The property value to validate
     * @returns {string | number} The property value if a validation succeeded
     */
    _validateInputs(propName, propValue) {
        if (propName === 'name' && !propValue) {
            throw new class CreateScheduledEventError extends Error {
                constructor(m) { super(m); }
            }(`Empty '${propName}' parameter value is provided.`);
        }

        if (propName === 'callType' && propValue && !['video', 'voice'].includes(propValue)) {
            throw new class CreateScheduledEventError extends Error {
                constructor(m) { super(m); }
            }(`Invalid '${propName}' parameter value is provided. Valid values are: 'voice' | 'video'.`);
        }
        
        return propValue;
    }
}

module.exports = ScheduledEvent;
