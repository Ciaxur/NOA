/**
 * Initiate Document Event Listners
 */

import * as $ from 'jquery';
import { KEYS } from './Constants';

// Global Variables
let isCtrl = false;         // Keeps track of Control Key Down


/**  Event Listners that handles Keydown */
$("#chatBox").on("keydown", e => {
    // Variables Used
    const chatBox = $("#chatBox");
    

    // Keep track of Control Key Press
    if (e.which === KEYS.CTRL) { isCtrl = true; }



    // Enter ONLY Clicked
    if (e.which === KEYS.ENTER && !isCtrl) {
        // TODO :: Handle Message Send              // Send Message
        const msg = chatBox.val().toString().trim();
        $("#chatHistory").val($("#chatHistory").val() + msg + '\n');


        // Clear Text Box
        chatBox.val("");
        return false;   // Ignore NewLine
    }

    // Ctrl+Enter Clicked
    else if (e.which === KEYS.ENTER && isCtrl) {
        chatBox.val(chatBox.val() + '\n');          // Insert a New Line
    }
});

/**  Event Listners that handles Keyup */
$("#chatBox").on("keyup", e => {
    // Keep track of Control Key Release
    if (e.which === KEYS.CTRL) { isCtrl = false; }
});