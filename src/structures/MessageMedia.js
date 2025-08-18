'use strict';

const fs = require('fs');
const path = require('path');
const mime = require('mime');
const fetch = require('node-fetch');
const { URL } = require('url');

/**
 * Media attached to a message
 * @param {string} mimetype MIME type of the attachment
 * @param {string} data Base64-encoded data of the file
 * @param {?string} filename Document file name. Value can be null
 * @param {?number} filesize Document file size in bytes. Value can be null
 */
class MessageMedia {
    constructor(mimetype, data, filename, filesize) {
        console.log("\n📚 A new MessageMedia object is being instantiated.");
        
        /**
         * MIME type of the attachment
         * @type {string}
         */
        this.mimetype = mimetype;
        console.log("  - MIME type set to:", this.mimetype);

        /**
         * Base64 encoded data that represents the file
         * @type {string}
         */
        this.data = data;
        console.log("  - Data (base64) set. Size:", this.data.length, "characters.");

        /**
         * Document file name. Value can be null
         * @type {?string}
         */
        this.filename = filename;
        console.log("  - Filename set to:", this.filename);
        
        /**
         * Document file size in bytes. Value can be null
         * @type {?number}
         */
        this.filesize = filesize;
        if(this.filesize) {
            console.log("  - Filesize set to:", this.filesize, "bytes.");
        }
        
        console.log("✅ MessageMedia object successfully created.");
    }

    /**
     * Creates a MessageMedia instance from a local file path
     * @param {string} filePath 
     * @returns {MessageMedia}
     */
    static fromFilePath(filePath) {
        console.log("\n➡️ fromFilePath() static method called. Processing local file:", filePath);
        
        console.log("    - Step 1: Reading file synchronously and encoding to Base64.");
        const b64data = fs.readFileSync(filePath, {encoding: 'base64'});
        
        console.log("    - Step 2: Determining MIME type from file extension.");
        const mimetype = mime.getType(filePath); 
        
        console.log("    - Step 3: Extracting filename from the path.");
        const filename = path.basename(filePath);
        
        console.log("    - All data gathered. Now creating a new MessageMedia object.");
        return new MessageMedia(mimetype, b64data, filename);
    }

    /**
     * Creates a MessageMedia instance from a URL
     * @param {string} url
     * @param {Object} [options]
     * @param {boolean} [options.unsafeMime=false]
     * @param {string} [options.filename]
     * @param {object} [options.client]
     * @param {object} [options.reqOptions]
     * @param {number} [options.reqOptions.size=0]
     * @returns {Promise<MessageMedia>}
     */
    static async fromUrl(url, options = {}) {
        console.log("\n➡️ fromUrl() static method called. Processing URL:", url);
        
        const pUrl = new URL(url);
        let mimetype = mime.getType(pUrl.pathname);

        if (!mimetype && !options.unsafeMime) {
            console.log("❌ MIME type could not be determined from URL. Throwing an error.");
            throw new Error('Unable to determine MIME type using URL. Set unsafeMime to true to download it anyway.');
        }

        async function fetchData (url, options) {
            console.log("    - Fetching data from the URL...");
            const reqOptions = Object.assign({ headers: { accept: 'image/* video/* text/* audio/*' } }, options);
            const response = await fetch(url, reqOptions);
            const mime = response.headers.get('Content-Type');
            const size = response.headers.get('Content-Length');

            const contentDisposition = response.headers.get('Content-Disposition');
            const name = contentDisposition ? contentDisposition.match(/((?<=filename=")(.*)(?="))/) : null;

            let data = '';
            if (response.buffer) {
                data = (await response.buffer()).toString('base64');
            } else {
                const bArray = new Uint8Array(await response.arrayBuffer());
                bArray.forEach((b) => {
                    data += String.fromCharCode(b);
                });
                data = btoa(data);
            }
            
            console.log("    - Data successfully fetched and converted to Base64.");
            return { data, mime, name, size };
        }

        console.log("    - Initiating fetch operation...");
        const res = options.client
            ? (await options.client.pupPage.evaluate(fetchData, url, options.reqOptions))
            : (await fetchData(url, options.reqOptions));
        
        const filename = options.filename ||
            (res.name ? res.name[0] : (pUrl.pathname.split('/').pop() || 'file'));
        
        if (!mimetype) {
            console.log("    - MIME type was not found initially. Falling back to response header.");
            mimetype = res.mime;
        }

        console.log("    - All data gathered. Creating a new MessageMedia object from URL data.");
        return new MessageMedia(mimetype, res.data, filename, res.size || null);
    }
}

module.exports = MessageMedia;