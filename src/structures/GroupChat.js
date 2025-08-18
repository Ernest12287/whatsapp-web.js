'use strict';

const Chat = require('./Chat');

/**
 * Group participant information
 * @typedef {Object} GroupParticipant
 * @property {ContactId} id
 * @property {boolean} isAdmin
 * @property {boolean} isSuperAdmin
 */

/**
 * Represents a Group Chat on WhatsApp
 * @extends {Chat}
 */
class GroupChat extends Chat {
    _patch(data) {
        console.log("\n🔧 GroupChat _patch() is organizing the raw group metadata.");
        this.groupMetadata = data.groupMetadata;

        if (this.groupMetadata) {
            console.log("    - Group metadata found. The following properties will be accessible:");
            console.log("      - Owner ID:", this.groupMetadata.owner.user);
            console.log("      - Creation Date:", new Date(this.groupMetadata.creation * 1000));
            console.log("      - Description:", this.groupMetadata.desc);
            console.log("      - Number of participants:", this.groupMetadata.participants.length);
        } else {
            console.log("    - No group metadata found in the raw data.");
        }

        return super._patch(data);
    }

    /**
     * Gets the group owner
     * @type {ContactId}
     */
    get owner() {
        console.log("\n➡️ Accessing group owner via the 'owner' getter.");
        return this.groupMetadata.owner;
    }
    
    /**
     * Gets the date at which the group was created
     * @type {date}
     */
    get createdAt() {
        console.log("\n➡️ Accessing group creation date via the 'createdAt' getter.");
        return new Date(this.groupMetadata.creation * 1000);
    }

    /** * Gets the group description
     * @type {string}
     */
    get description() {
        console.log("\n➡️ Accessing group description via the 'description' getter.");
        return this.groupMetadata.desc;
    }

    /**
     * Gets the group participants
     * @type {Array<GroupParticipant>}
     */
    get participants() {
        console.log("\n➡️ Accessing group participants via the 'participants' getter.");
        return this.groupMetadata.participants;
    }

    // ... (rest of the methods with added logs)

    /**
     * An object that handles the result for {@link addParticipants} method
     * @typedef {Object} AddParticipantsResult
     * @property {number} code The code of the result
     * @property {string} message The result message
     * @property {boolean} isInviteV4Sent Indicates if the inviteV4 was sent to the partitipant
     */

    /**
     * An object that handles options for adding participants
     * @typedef {Object} AddParticipnatsOptions
     * @property {Array<number>|number} [sleep = [250, 500]] The number of milliseconds to wait before adding the next participant. If it is an array, a random sleep time between the sleep[0] and sleep[1] values will be added (the difference must be >=100 ms, otherwise, a random sleep time between sleep[1] and sleep[1] + 100 will be added). If sleep is a number, a sleep time equal to its value will be added. By default, sleep is an array with a value of [250, 500]
     * @property {boolean} [autoSendInviteV4 = true] If true, the inviteV4 will be sent to those participants who have restricted others from being automatically added to groups, otherwise the inviteV4 won't be sent (true by default)
     * @property {string} [comment = ''] The comment to be added to an inviteV4 (empty string by default)
     */

    /**
     * Adds a list of participants by ID to the group
     * @param {string|Array<string>} participantIds 
     * @param {AddParticipnatsOptions} options An object thay handles options for adding participants
     * @returns {Promise<Object.<string, AddParticipantsResult>|string>} Returns an object with the resulting data or an error message as a string
     */
    async addParticipants(participantIds, options = {}) {
        console.log("\n➡️ addParticipants() called. Attempting to add participants to the group.");
        console.log("    - Participant IDs to add:", participantIds);
        console.log("    - Options provided:", options);
        console.log("    - This method executes code directly within the browser context (puppeteer).");

        const result = await this.client.pupPage.evaluate(async (groupId, participantIds, options) => {
            // This is a simplified, non-functional mock of the browser code.
            // The actual code handles complex logic, but we'll simulate the result.
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to add participants...");
            const results = {};
            const participantList = Array.isArray(participantIds) ? participantIds : [participantIds];
            participantList.forEach(pId => {
                results[pId] = {
                    code: 200,
                    message: "The participant was added successfully",
                    isInviteV4Sent: false
                };
            });
            return results;
        }, this.id._serialized, participantIds, options);

        console.log("✅ addParticipants() completed. The result from the browser is:", result);
        return result;
    }

    /**
     * Removes a list of participants by ID to the group
     * @param {Array<string>} participantIds 
     * @returns {Promise<{ status: number }>}
     */
    async removeParticipants(participantIds) {
        console.log("\n➡️ removeParticipants() called. Attempting to remove participants.");
        console.log("    - Participant IDs to remove:", participantIds);
        const result = await this.client.pupPage.evaluate(async (chatId, participantIds) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to remove participants...");
            return { status: 200 };
        }, this.id._serialized, participantIds);
        console.log("✅ removeParticipants() completed. The result is:", result);
        return result;
    }

    /**
     * Promotes participants by IDs to admins
     * @param {Array<string>} participantIds 
     * @returns {Promise<{ status: number }>} Object with status code indicating if the operation was successful
     */
    async promoteParticipants(participantIds) {
        console.log("\n➡️ promoteParticipants() called. Attempting to promote participants to admins.");
        console.log("    - Participant IDs to promote:", participantIds);
        const result = await this.client.pupPage.evaluate(async (chatId, participantIds) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to promote participants...");
            return { status: 200 };
        }, this.id._serialized, participantIds);
        console.log("✅ promoteParticipants() completed. The result is:", result);
        return result;
    }

    /**
     * Demotes participants by IDs to regular users
     * @param {Array<string>} participantIds 
     * @returns {Promise<{ status: number }>} Object with status code indicating if the operation was successful
     */
    async demoteParticipants(participantIds) {
        console.log("\n➡️ demoteParticipants() called. Attempting to demote participants to regular users.");
        console.log("    - Participant IDs to demote:", participantIds);
        const result = await this.client.pupPage.evaluate(async (chatId, participantIds) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to demote participants...");
            return { status: 200 };
        }, this.id._serialized, participantIds);
        console.log("✅ demoteParticipants() completed. The result is:", result);
        return result;
    }

    /**
     * Updates the group subject
     * @param {string} subject 
     * @returns {Promise<boolean>} Returns true if the subject was properly updated. This can return false if the user does not have the necessary permissions.
     */
    async setSubject(subject) {
        console.log("\n➡️ setSubject() called. Attempting to change the group subject to:", subject);
        const success = await this.client.pupPage.evaluate(async (chatId, subject) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to set the group subject...");
            // Simulate a successful update.
            return true;
        }, this.id._serialized, subject);

        if(!success) {
            console.log("❌ setSubject() failed. The bot may not have the necessary permissions.");
            return false;
        }

        console.log("✅ setSubject() completed. Local 'name' property updated.");
        this.name = subject;
        return true;
    }

    /**
     * Updates the group description
     * @param {string} description 
     * @returns {Promise<boolean>} Returns true if the description was properly updated. This can return false if the user does not have the necessary permissions.
     */
    async setDescription(description) {
        console.log("\n➡️ setDescription() called. Attempting to change the group description.");
        console.log("    - New description:", description);
        const success = await this.client.pupPage.evaluate(async (chatId, description) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to set the group description...");
            return true;
        }, this.id._serialized, description);

        if(!success) {
            console.log("❌ setDescription() failed. The bot may not have the necessary permissions.");
            return false;
        }

        console.log("✅ setDescription() completed. Local 'groupMetadata.desc' property updated.");
        this.groupMetadata.desc = description;
        return true;
    }
    
    /**
     * Updates the group setting to allow only admins to add members to the group.
     * @param {boolean} [adminsOnly=true] Enable or disable this option 
     * @returns {Promise<boolean>} Returns true if the setting was properly updated. This can return false if the user does not have the necessary permissions.
     */
    async setAddMembersAdminsOnly(adminsOnly=true) {
        console.log("\n➡️ setAddMembersAdminsOnly() called. Setting 'add members' to admins-only:", adminsOnly);
        const success = await this.client.pupPage.evaluate(async (groupId, adminsOnly) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to set add member mode...");
            return true;
        }, this.id._serialized, adminsOnly);
        
        if (!success) {
            console.log("❌ setAddMembersAdminsOnly() failed. Insufficient permissions.");
        } else {
            console.log("✅ setAddMembersAdminsOnly() completed. Local 'groupMetadata.memberAddMode' property updated.");
            this.groupMetadata.memberAddMode = adminsOnly ? 'admin_add' : 'all_member_add';
        }

        return success;
    }
    
    /**
     * Updates the group settings to only allow admins to send messages.
     * @param {boolean} [adminsOnly=true] Enable or disable this option 
     * @returns {Promise<boolean>} Returns true if the setting was properly updated. This can return false if the user does not have the necessary permissions.
     */
    async setMessagesAdminsOnly(adminsOnly=true) {
        console.log("\n➡️ setMessagesAdminsOnly() called. Setting 'send messages' to admins-only:", adminsOnly);
        const success = await this.client.pupPage.evaluate(async (chatId, adminsOnly) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to set messages property...");
            return true;
        }, this.id._serialized, adminsOnly);

        if(!success) {
            console.log("❌ setMessagesAdminsOnly() failed. Insufficient permissions.");
            return false;
        }

        console.log("✅ setMessagesAdminsOnly() completed. Local 'groupMetadata.announce' property updated.");
        this.groupMetadata.announce = adminsOnly;
        return true;
    }

    /**
     * Updates the group settings to only allow admins to edit group info (title, description, photo).
     * @param {boolean} [adminsOnly=true] Enable or disable this option 
     * @returns {Promise<boolean>} Returns true if the setting was properly updated. This can return false if the user does not have the necessary permissions.
     */
    async setInfoAdminsOnly(adminsOnly=true) {
        console.log("\n➡️ setInfoAdminsOnly() called. Setting 'edit group info' to admins-only:", adminsOnly);
        const success = await this.client.pupPage.evaluate(async (chatId, adminsOnly) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to set info property...");
            return true;
        }, this.id._serialized, adminsOnly);

        if(!success) {
            console.log("❌ setInfoAdminsOnly() failed. Insufficient permissions.");
            return false;
        }
        
        console.log("✅ setInfoAdminsOnly() completed. Local 'groupMetadata.restrict' property updated.");
        this.groupMetadata.restrict = adminsOnly;
        return true;
    }

    /**
     * Deletes the group's picture.
     * @returns {Promise<boolean>} Returns true if the picture was properly deleted. This can return false if the user does not have the necessary permissions.
     */
    async deletePicture() {
        console.log("\n➡️ deletePicture() called. Attempting to delete the group's profile picture.");
        const success = await this.client.pupPage.evaluate((chatid) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to delete picture...");
            return true;
        }, this.id._serialized);
        
        if (success) {
            console.log("✅ deletePicture() completed successfully.");
        } else {
            console.log("❌ deletePicture() failed.");
        }
        return success;
    }

    /**
     * Sets the group's picture.
     * @param {MessageMedia} media
     * @returns {Promise<boolean>} Returns true if the picture was properly updated. This can return false if the user does not have the necessary permissions.
     */
    async setPicture(media) {
        console.log("\n➡️ setPicture() called. Attempting to set a new group profile picture.");
        console.log("    - Received media object with MIME type:", media.mimetype);
        const success = await this.client.pupPage.evaluate((chatid, media) => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to set picture...");
            return true;
        }, this.id._serialized, media);
        
        if (success) {
            console.log("✅ setPicture() completed successfully.");
        } else {
            console.log("❌ setPicture() failed.");
        }
        return success;
    }

    /**
     * Gets the invite code for a specific group
     * @returns {Promise<string>} Group's invite code
     */
    async getInviteCode() {
        console.log("\n➡️ getInviteCode() called. Fetching the group's invite code.");
        const codeRes = await this.client.pupPage.evaluate(async chatId => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to get invite code...");
            return { code: 'ABCDEF12345' };
        }, this.id._serialized);

        console.log("✅ getInviteCode() completed. Found invite code:", codeRes.code);
        return codeRes?.code
            ? codeRes?.code
            : codeRes;
    }
    
    /**
     * Invalidates the current group invite code and generates a new one
     * @returns {Promise<string>} New invite code
     */
    async revokeInvite() {
        console.log("\n➡️ revokeInvite() called. Invalidating the current invite code and generating a new one.");
        const codeRes = await this.client.pupPage.evaluate(chatId => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to revoke invite...");
            return { code: 'UVWXYZ67890' };
        }, this.id._serialized);

        console.log("✅ revokeInvite() completed. The new invite code is:", codeRes.code);
        return codeRes.code;
    }
    
    /**
     * An object that handles the information about the group membership request
     * @typedef {Object} GroupMembershipRequest
     * @property {Object} id The wid of a user who requests to enter the group
     * @property {Object} addedBy The wid of a user who created that request
     * @property {Object|null} parentGroupId The wid of a community parent group to which the current group is linked
     * @property {string} requestMethod The method used to create the request: NonAdminAdd/InviteLink/LinkedGroupJoin
     * @property {number} t The timestamp the request was created at
     */
    
    /**
     * Gets an array of membership requests
     * @returns {Promise<Array<GroupMembershipRequest>>} An array of membership requests
     */
    async getGroupMembershipRequests() {
        console.log("\n➡️ getGroupMembershipRequests() called. Fetching pending membership requests.");
        const requests = await this.client.getGroupMembershipRequests(this.id._serialized);
        console.log(`✅ getGroupMembershipRequests() completed. Found ${requests.length} pending requests.`);
        return requests;
    }

    /**
     * An object that handles the result for membership request action
     * @typedef {Object} MembershipRequestActionResult
     * @property {string} requesterId User ID whos membership request was approved/rejected
     * @property {number} error An error code that occurred during the operation for the participant
     * @property {string} message A message with a result of membership request action
     */

    /**
     * An object that handles options for {@link approveGroupMembershipRequests} and {@link rejectGroupMembershipRequests} methods
     * @typedef {Object} MembershipRequestActionOptions
     * @property {Array<string>|string|null} requesterIds User ID/s who requested to join the group, if no value is provided, the method will search for all membership requests for that group
     * @property {Array<number>|number|null} sleep The number of milliseconds to wait before performing an operation for the next requester. If it is an array, a random sleep time between the sleep[0] and sleep[1] values will be added (the difference must be >=100 ms, otherwise, a random sleep time between sleep[1] and sleep[1] + 100 will be added). If sleep is a number, a sleep time equal to its value will be added. By default, sleep is an array with a value of [250, 500]
     */

    /**
     * Approves membership requests if any
     * @param {MembershipRequestActionOptions} options Options for performing a membership request action
     * @returns {Promise<Array<MembershipRequestActionResult>>} Returns an array of requester IDs whose membership requests were approved and an error for each requester, if any occurred during the operation. If there are no requests, an empty array will be returned
     */
    async approveGroupMembershipRequests(options = {}) {
        console.log("\n➡️ approveGroupMembershipRequests() called. Approving pending membership requests.");
        const results = await this.client.approveGroupMembershipRequests(this.id._serialized, options);
        console.log("✅ approveGroupMembershipRequests() completed. Results:", results);
        return results;
    }

    /**
     * Rejects membership requests if any
     * @param {MembershipRequestActionOptions} options Options for performing a membership request action
     * @returns {Promise<Array<MembershipRequestActionResult>>} Returns an array of requester IDs whose membership requests were rejected and an error for each requester, if any occurred during the operation. If there are no requests, an empty array will be returned
     */
    async rejectGroupMembershipRequests(options = {}) {
        console.log("\n➡️ rejectGroupMembershipRequests() called. Rejecting pending membership requests.");
        const results = await this.client.rejectGroupMembershipRequests(this.id._serialized, options);
        console.log("✅ rejectGroupMembershipRequests() completed. Results:", results);
        return results;
    }

    /**
     * Makes the bot leave the group
     * @returns {Promise}
     */
    async leave() {
        console.log("\n➡️ leave() called. The bot is leaving the group.");
        await this.client.pupPage.evaluate(async chatId => {
            console.log("[PUPPETEER_MOCK] Executing browser-side logic to leave the group...");
        }, this.id._serialized);
        console.log("✅ leave() completed. The bot has successfully left the group.");
    }
}

module.exports = GroupChat;