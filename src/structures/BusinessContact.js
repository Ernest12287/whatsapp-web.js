'use strict';

const Contact = require('./Contact');

/**
 * Represents a Business Contact on WhatsApp
 * @extends {Contact}
 */
class BusinessContact extends Contact {
    constructor(client, data) {
        super(client, data); // Call the parent constructor
        console.log("\n📚 A new BusinessContact object is being created.");
        console.log("👉 The constructor received the following raw data:", data);
        // The _patch method is called automatically by the parent Contact's constructor if data exists.
    }

    _patch(data) {
        console.log("\n🔧 BusinessContact _patch() is organizing the raw data.");
        
        /**
         * The contact's business profile
         */
        this.businessProfile = data.businessProfile;

        if (this.businessProfile) {
            console.log("    - Business profile data found. Key details include:");
            console.log("      - Business name:", this.businessProfile.name);
            console.log("      - Business description:", this.businessProfile.description);
            console.log("      - Business address:", this.businessProfile.address);
        } else {
            console.log("    - No business profile data found.");
        }

        console.log("✅ The BusinessContact object has been created with a business profile.");
        return super._patch(data);
    }
}

module.exports = BusinessContact;

