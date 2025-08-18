'use strict';

/**
 * Interface Controller
 */
class InterfaceController {

    constructor(props) {
        this.pupPage = props.pupPage;
        console.log("📚 InterfaceController created. Ready to control the WhatsApp Web UI.");
    }

    /**
     * Opens the Chat Window
     * @param {string} chatId ID of the chat window that will be opened
     */
    async openChatWindow(chatId) {
        console.log(`\n➡️ openChatWindow() called. Attempting to open chat window for ID: ${chatId}`);
        await this.pupPage.evaluate(async (chatId) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to open chat window...");
            // Mocking the browser-side call
            const chat = { id: chatId };
            await window.Store.Cmd.openChatBottom(chat);
        }, chatId);
        console.log("✅ Command sent to open the chat window.");
    }

    /**
     * Opens the Chat Drawer
     * @param {string} chatId ID of the chat drawer that will be opened
     */
    async openChatDrawer(chatId) {
        console.log(`\n➡️ openChatDrawer() called. Attempting to open chat drawer for ID: ${chatId}`);
        await this.pupPage.evaluate(async chatId => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to open chat drawer...");
            let chat = { id: chatId };
            await window.Store.Cmd.openDrawerMid(chat);
        }, chatId);
        console.log("✅ Command sent to open the chat drawer.");
    }

    /**
     * Opens the Chat Search
     * @param {string} chatId ID of the chat search that will be opened
     */
    async openChatSearch(chatId) {
        console.log(`\n➡️ openChatSearch() called. Attempting to open chat search for ID: ${chatId}`);
        await this.pupPage.evaluate(async chatId => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to open chat search...");
            let chat = { id: chatId };
            await window.Store.Cmd.chatSearch(chat);
        }, chatId);
        console.log("✅ Command sent to open chat search.");
    }

    /**
     * Opens or Scrolls the Chat Window to the position of the message
     * @param {string} msgId ID of the message that will be scrolled to
     */
    async openChatWindowAt(msgId) {
        console.log(`\n➡️ openChatWindowAt() called. Attempting to scroll to message with ID: ${msgId}`);
        await this.pupPage.evaluate(async (msgId) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to scroll to message...");
            const msg = { id: { _serialized: msgId, remote: 'mock-chat-id' } };
            const chat = { id: msg.id.remote };
            const searchContext = {};
            await window.Store.Cmd.openChatAt({ chat: chat, msgContext: searchContext });
        }, msgId);
        console.log("✅ Command sent to scroll to the message.");
    }

    /**
     * Opens the Message Drawer
     * @param {string} msgId ID of the message drawer that will be opened
     */
    async openMessageDrawer(msgId) {
        console.log(`\n➡️ openMessageDrawer() called. Attempting to open message drawer for message ID: ${msgId}`);
        await this.pupPage.evaluate(async msgId => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to open message drawer...");
            const msg = { id: msgId };
            await window.Store.Cmd.msgInfoDrawer(msg);
        }, msgId);
        console.log("✅ Command sent to open the message drawer.");
    }

    /**
     * Closes the Right Drawer
     */
    async closeRightDrawer() {
        console.log("\n➡️ closeRightDrawer() called. Attempting to close the right drawer.");
        await this.pupPage.evaluate(async () => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to close right drawer...");
            await window.Store.DrawerManager.closeDrawerRight();
        });
        console.log("✅ Command sent to close the right drawer.");
    }

    /**
     * Get all Features
     */
    async getFeatures() {
        console.log("\n➡️ getFeatures() called. Retrieving all available features.");
        const features = await this.pupPage.evaluate(() => {
            console.log("[PUPPETEER_MOCK] Fetching features from the browser...");
            return {
                F: {
                    feature1: true,
                    feature2: false
                }
            };
        });
        console.log("✅ Features retrieved:", features.F);
        return features.F;
    }

    /**
     * Check if Feature is enabled
     * @param {string} feature status to check
     */
    async checkFeatureStatus(feature) {
        console.log(`\n➡️ checkFeatureStatus() called. Checking status of feature: '${feature}'`);
        const isEnabled = await this.pupPage.evaluate((feature) => {
            console.log("[PUPPETEER_MOCK] Checking feature status in the browser...");
            return feature === 'feature1';
        }, feature);
        console.log(`✅ Status for '${feature}' is: ${isEnabled}`);
        return isEnabled;
    }

    /**
     * Enable Features
     * @param {string[]} features to be enabled
     */
    async enableFeatures(features) {
        console.log(`\n➡️ enableFeatures() called. Attempting to enable features:`, features);
        await this.pupPage.evaluate((features) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to enable features...");
        }, features);
        console.log("✅ Command sent to enable features.");
    }

    /**
     * Disable Features
     * @param {string[]} features to be disabled
     */
    async disableFeatures(features) {
        console.log(`\n➡️ disableFeatures() called. Attempting to disable features:`, features);
        await this.pupPage.evaluate((features) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to disable features...");
        }, features);
        console.log("✅ Command sent to disable features.");
    }
}

module.exports = InterfaceController;