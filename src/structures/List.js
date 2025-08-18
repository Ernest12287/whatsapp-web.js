'use strict';

const Util = require('../util/Util');

/**
 * Message type List
 */
class List {
    /**
     * @param {string} body
     * @param {string} buttonText
     * @param {Array<any>} sections
     * @param {string?} title
     * @param {string?} footer
     */
    constructor(body, buttonText, sections, title, footer) {
        console.log("\n📚 A new List object is being created.");
        console.log("👉 The constructor received the following parameters:");
        console.log("  - Body:", body);
        console.log("  - Button Text:", buttonText);
        console.log("  - Sections (raw):", sections);
        console.log("  - Title:", title);
        console.log("  - Footer:", footer);

        /**
         * Message body
         * @type {string}
         */
        this.description = body;

        /**
         * List button text
         * @type {string}
         */
        this.buttonText = buttonText;
        
        /**
         * title of message
         * @type {string}
         */
        this.title = title;
        

        /**
         * footer of message
         * @type {string}
         */
        this.footer = footer;

        /**
         * sections of message
         * @type {Array<any>}
         */
        console.log("\n🔧 _format() is being called to validate and format the sections.");
        this.sections = this._format(sections);
        
        console.log("\n✅ The List object has been created with validated sections.");
        console.log("  - Final sections object:", this.sections);
    }
    
    /**
     * Creates section array from simple array
     * @param {Array<any>} sections
     * @returns {Array<any>}
     * @example
     * Input: [{title:'sectionTitle',rows:[{id:'customId', title:'ListItem2', description: 'desc'},{title:'ListItem2'}]}]
     * Returns: [{'title':'sectionTitle','rows':[{'rowId':'customId','title':'ListItem1','description':'desc'},{'rowId':'oGSRoD','title':'ListItem2','description':''}]}]
     */
    _format(sections){
        console.log("    - Starting validation of sections array...");
        if(!sections.length){
            console.log("❌ Error: The sections array is empty. Throwing an error.");
            throw '[LT02] List without sections';
        }
        if(sections.length > 1 && sections.filter(s => typeof s.title == 'undefined').length > 1){
            console.log("❌ Error: More than one section has an empty title. Throwing an error.");
            throw '[LT05] You can\'t have more than one empty title.';
        }
        
        console.log("    - Validation passed. Now mapping and formatting each section and its rows.");
        return sections.map( (section) =>{
            console.log(`    - Processing section: ${section.title || 'Untitled'}`);
            if(!section.rows.length){
                console.log("❌ Error: A section contains no rows. Throwing an error.");
                throw '[LT03] Section without rows';
            }
            return {
                title: section.title ? section.title : undefined,
                rows: section.rows.map( (row) => {
                    console.log(`      - Processing row: ${row.title || 'Untitled'}`);
                    if(!row.title){
                        console.log("❌ Error: A row has no title. Throwing an error.");
                        throw '[LT04] Row without title';
                    }
                    return {
                        rowId: row.id ? row.id : Util.generateHash(6),
                        title: row.title,
                        description: row.description ? row.description : ''
                    };
                })
            };
        });
    }
    
}

module.exports = List;

