'use strict';

/**
 * Location send options
 * @typedef {Object} LocationSendOptions
 * @property {string} [name] Location name
 * @property {string} [address] Location address
 * @property {string} [url] URL address to be shown within a location message
 * @property {string} [description] Location full description
 */

/**
 * Location information
 */
class Location {
    /**
     * @param {number} latitude
     * @param {number} longitude
     * @param {LocationSendOptions} [options] Location send options
     */
    constructor(latitude, longitude, options = {}) {
        console.log("\n📚 A new Location object is being created.");
        console.log("👉 The constructor received latitude:", latitude, "and longitude:", longitude);
        console.log("👉 It also received the following options:", options);
        
        /**
         * Location latitude
         * @type {number}
         */
        this.latitude = latitude;
        console.log("  - Latitude set to:", this.latitude);

        /**
         * Location longitude
         * @type {number}
         */
        this.longitude = longitude;
        console.log("  - Longitude set to:", this.longitude);

        /**
         * Name for the location
         * @type {string|undefined}
         */
        this.name = options.name;
        if (this.name) {
            console.log("  - Name set to:", this.name);
        }

        /**
         * Location address
         * @type {string|undefined}
         */
        this.address = options.address;
        if (this.address) {
            console.log("  - Address set to:", this.address);
        }

        /**
         * URL address to be shown within a location message
         * @type {string|undefined}
         */
        this.url = options.url;
        if (this.url) {
            console.log("  - URL set to:", this.url);
        }

        /**
         * Location full description
         * @type {string|undefined}
         */
        this.description = this.name && this.address
            ? `${this.name}\n${this.address}`
            : this.name || this.address || '';
        console.log("  - The description property has been generated as:", this.description);

        console.log("✅ The Location object has been successfully created.");
    }
}

module.exports = Location;

