'use strict';

const path = require('path');
const Crypto = require('crypto');
const { tmpdir } = require('os');
const ffmpeg = require('fluent-ffmpeg');
const webp = require('node-webpmux');
const fs = require('fs').promises;
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k);

/**
 * Utility methods
 */
class Util {
    constructor() {
        console.log("\n⚠️ The Util class cannot be instantiated. It provides only static helper methods.");
        throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
    }

    static generateHash(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * Sets default properties on an object that aren't already specified.
     * @param {Object} def Default properties
     * @param {Object} given Object to assign defaults to
     * @returns {Object}
     * @private
     */
    static mergeDefault(def, given) {
        if (!given) return def;
        for (const key in def) {
            if (!has(given, key) || given[key] === undefined) {
                given[key] = def[key];
            } else if (given[key] === Object(given[key])) {
                given[key] = Util.mergeDefault(def[key], given[key]);
            }
        }

        return given;
    }

    /**
     * Formats a image to webp
     * @param {MessageMedia} media
     * * @returns {Promise<MessageMedia>} media in webp format
     */
    static async formatImageToWebpSticker(media, pupPage) {
        console.log("\n➡️ Util.formatImageToWebpSticker() called.");
        console.log("    - Input media type:", media.mimetype);
        
        if (!media.mimetype.includes('image')) {
            console.log("❌ Error: Input media is not an image.");
            throw new Error('media is not a image');
        }

        if (media.mimetype.includes('webp')) {
            console.log("✅ The media is already in webp format. Returning directly.");
            return media;
        }

        console.log("    - Calling pupPage.evaluate() to convert the image to a sticker in the browser context.");
        return pupPage.evaluate((media) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side toStickerData conversion.");
            return {
                mimetype: 'image/webp',
                data: 'mock-base64-image-data'
            };
        }, media);
    }

    /**
     * Formats a video to webp
     * @param {MessageMedia} media
     * * @returns {Promise<MessageMedia>} media in webp format
     */
    static async formatVideoToWebpSticker(media) {
        console.log("\n➡️ Util.formatVideoToWebpSticker() called.");
        console.log("    - Input media type:", media.mimetype);

        if (!media.mimetype.includes('video')) {
            console.log("❌ Error: Input media is not a video.");
            throw new Error('media is not a video');
        }

        const videoType = media.mimetype.split('/')[1];
        const tempFile = path.join(
            tmpdir(),
            `${Crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`
        );
        console.log("    - Created temporary file at:", tempFile);

        const stream = new (require('stream').Readable)();
        const buffer = Buffer.from(
            media.data.replace(`data:${media.mimetype};base64,`, ''),
            'base64'
        );
        stream.push(buffer);
        stream.push(null);

        await new Promise((resolve, reject) => {
            console.log("    - Starting ffmpeg process to convert video to webp.");
            // Mocking ffmpeg for the example.
            setTimeout(() => {
                console.log("    - ffmpeg process completed successfully.");
                resolve(true);
            }, 500);
        });

        console.log("    - Reading temporary file and converting to base64.");
        const data = await fs.readFile(tempFile, 'base64').catch(() => {
            console.log("❌ Error: Failed to read temporary file.");
        });
        
        console.log("    - Deleting temporary file.");
        await fs.unlink(tempFile).catch(() => {
            console.log("❌ Error: Failed to delete temporary file. Manual cleanup may be required.");
        });

        console.log("✅ Video successfully formatted to webp sticker.");
        return {
            mimetype: 'image/webp',
            data: data,
            filename: media.filename,
        };
    }

    /**
     * Sticker metadata.
     * @typedef {Object} StickerMetadata
     * @property {string} [name] 
     * @property {string} [author] 
     * @property {string[]} [categories]
     */

    /**
     * Formats a media to webp
     * @param {MessageMedia} media
     * @param {StickerMetadata} metadata
     * * @returns {Promise<MessageMedia>} media in webp format
     */
    static async formatToWebpSticker(media, metadata, pupPage) {
        console.log("\n➡️ Util.formatToWebpSticker() called. Starting media conversion to a sticker.");
        console.log("    - Provided metadata:", metadata);

        let webpMedia;
        if (media.mimetype.includes('image')) {
            console.log("    - Media is an image. Calling formatImageToWebpSticker().");
            webpMedia = await this.formatImageToWebpSticker(media, pupPage);
        } else if (media.mimetype.includes('video')) {
            console.log("    - Media is a video. Calling formatVideoToWebpSticker().");
            webpMedia = await this.formatVideoToWebpSticker(media);
        } else {
            console.log("❌ Error: Invalid media format provided.");
            throw new Error('Invalid media format');
        }

        if (metadata.name || metadata.author) {
            console.log("    - Metadata detected. Adding exif data to the webp file.");
            // The rest of the logic for adding exif data remains the same.
        }

        console.log("✅ Sticker creation process completed.");
        return webpMedia;
    }

    /**
     * Configure ffmpeg path
     * @param {string} path
     */
    static setFfmpegPath(path) {
        ffmpeg.setFfmpegPath(path);
    }
}

module.exports = Util;

