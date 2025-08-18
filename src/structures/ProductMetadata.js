'use strict';

const Base = require('./Base');

class ProductMetadata extends Base {
    constructor(client, data) {
        super(client);

        if (data) {
            console.log("\n📚 A new ProductMetadata object is being created.");
            console.log("👉 The constructor received the following raw data:", data);
            this._patch(data);
        }
    }

    _patch(data) {
        console.log("🔧 The _patch() method is processing the raw data.");
        
        /** Product ID */
        this.id = data.id;
        /** Retailer ID */
        this.retailer_id = data.retailer_id;
        /** Product Name  */
        this.name = data.name;
        /** Product Description */
        this.description = data.description;
        
        console.log("✅ The ProductMetadata object has been created with the following properties:");
        console.log("  - id:", this.id);
        console.log("  - name:", this.name);
        console.log("  - retailer_id:", this.retailer_id);
        console.log("  - description:", this.description);

        return super._patch(data);
    }
}

module.exports = ProductMetadata;