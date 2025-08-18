'use strict';

const Base = require('./Base');
const ProductMetadata = require('./ProductMetadata');

/**
 * Represents a Product on WhatsAppBusiness
 * @extends {Base}
 */
class Product extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new Product object is being created from raw data.");
            console.log("👉 The constructor received the following initial data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("🔧 The _patch() method is organizing the initial product data.");
        
        /**
         * Product ID
         * @type {string}
         */
        this.id = data.id;
        /**
         * Price
         * @type {string}
         */
        this.price = data.price ? data.price : '';
        /**
         * Product Thumbnail
         * @type {string}
         */
        this.thumbnailUrl = data.thumbnailUrl;
        /**
         * Currency
         * @type {string}
         */
        this.currency = data.currency;
        /**
         * Product Name
         * @type {string}
         */
        this.name = data.name;
        /**
         * Product Quantity
         * @type {number}
         */
        this.quantity = data.quantity;
        /** Product metadata */
        this.data = null;
        
        console.log("✅ The Product object has been created with base properties:");
        console.log("  - id:", this.id);
        console.log("  - name:", this.name);
        console.log("  - price:", this.price);

        return super._patch(data);
    }

    async getData() {
        console.log("\n🔎 A bot method is calling getData() to fetch full product details.");
        console.log("    - This is an ASYNCHRONOUS operation. The bot must wait for a response.");
        
        if (this.data === null) {
            // This is a placeholder for the puppeteer call. In a real scenario, this
            // would connect to the browser to get the data.
            let result = await this.client.pupPage.evaluate((productId) => {
                // ... This code runs in the browser context ...
                return window.WWebJS.getProductMetadata(productId);
            }, this.id);

            if (!result) {
                this.data = undefined;
                console.log("❌ Failed to get additional product data. It may not exist.");
            } else {
                console.log("✅ Full product metadata received! Creating a new ProductMetadata object from it.");
                this.data = new ProductMetadata(this.client, result);
            }
        }
        
        console.log("    - getData() is returning the product metadata object.");
        return this.data;
    }
}

module.exports = Product;