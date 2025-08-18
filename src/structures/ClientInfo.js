'use strict';

const Base = require('./Base');

/**
 * Current connection information
 * @extends {Base}
 */
class ClientInfo extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new ClientInfo object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is organizing the raw client data into a clean object.");
        /**
         * Name configured to be shown in push notifications
         * @type {string}
         */
        this.pushname = data.pushname;
        console.log("    - The bot's pushname is set to:", this.pushname);

        /**
         * Current user ID
         * @type {object}
         */
        this.wid = data.wid;
        console.log("    - The bot's WhatsApp ID (wid) is set to:", this.wid._serialized);

        /**
         * @type {object}
         * @deprecated Use .wid instead
         */
        this.me = data.wid;
        console.log("    - The deprecated 'me' property is also set to the same ID.");

        /**
         * Information about the phone this client is connected to. Not available in multi-device.
         * @type {object}
         * @property {string} wa_version WhatsApp Version running on the phone
         * @property {string} os_version OS Version running on the phone (iOS or Android version)
         * @property {string} device_manufacturer Device manufacturer
         * @property {string} device_model Device model
         * @property {string} os_build_number OS build number
         * @deprecated
         */
        this.phone = data.phone;
        if (this.phone) {
            console.log("    - Phone information is available (deprecated):", this.phone);
        }

        /**
         * Platform WhatsApp is running on
         * @type {string}
         */
        this.platform = data.platform;
        console.log("    - The platform is set to:", this.platform);

        console.log("✅ The ClientInfo object has been successfully created.");

        return super._patch(data);
    }

    /**
     * Get current battery percentage and charging status for the attached device
     * @returns {object} batteryStatus
     * @returns {number} batteryStatus.battery - The current battery percentage
     * @returns {boolean} batteryStatus.plugged - Indicates if the phone is plugged in (true) or not (false)
     * @deprecated
     */
    async getBatteryStatus() {
        console.log("\n➡️ getBatteryStatus() called. This method is deprecated.");
        console.log("    - Executing code directly in the browser context to get battery status.");
        const batteryStatus = await this.client.pupPage.evaluate(() => {
            // This is a simplified, non-functional mock of the browser code.
            // The actual code retrieves live data.
            console.log("[PUPPETEER_MOCK] Fetching battery and plugged status from window.Store.Conn...");
            return {
                battery: 85,
                plugged: false
            };
        });

        console.log("✅ getBatteryStatus() completed. The result is:", batteryStatus);
        return batteryStatus;
    }
}

module.exports = ClientInfo;

