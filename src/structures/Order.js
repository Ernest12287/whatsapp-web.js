'use strict';

const Base = require('./Base');
const Product = require('./Product');

/**
 * Represents a Order on WhatsApp
 * @extends {Base}
 */
class Order extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new Order object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("\n🔧 _patch() is organizing the raw order data into a clean object.");
        
        /**
         * List of products
         * @type {Array<Product>}
         */
        if (data.products) {
            console.log("    - The raw data contains a list of products. We will now create an array of Product objects.");
            this.products = data.products.map(product => new Product(this.client, product));
        }
        /**
         * Order Subtotal
         * @type {string}
         */
        this.subtotal = data.subtotal;
        /**
         * Order Total
         * @type {string}
         */
        this.total = data.total;
        /**
         * Order Currency
         * @type {string}
         */
        this.currency = data.currency;
        /**
         * Order Created At
         * @type {number}
         */
        this.createdAt = data.createdAt;

        console.log("✅ The Order object has been created with the following properties:");
        console.log("  - Subtotal:", this.subtotal);
        console.log("  - Total:", this.total);
        console.log("  - Number of products:", this.products.length);

        return super._patch(data);
    }
}

module.exports = Order;