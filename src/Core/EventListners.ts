/**
 * Initiate Document Event Listners
 */

import * as $ from 'jquery';
import { KEYS } from './Constants';
import { clientNode } from './Postload';

// Global Variables
let isCtrl = false;         // Keeps track of Control Key Down


/**
 * Store message in Message History
 * Handles Message Send
 * 
 * @param msg - String Message to store in Message History and Send
 */
function sendMessage(msg): void {
    // Send Message
    clientNode.sendMessage(msg);

    // Add msg to Message History
    addMsgHistory(msg);
}

/** 
 * Adds Message to Chat History
 * 
 * @param msg - Message to be added to Chat History
 */
export function addMsgHistory(msg: String): void {
    // Store Message in Message History    
    $("#chatHistory").val($("#chatHistory").val().toString() + msg + '\n');
}



/**  Event Listners that handles Keydown */
$("#chatBox").on("keydown", e => {
    // Variables Used
    const chatBox = $("#chatBox");
    

    // Keep track of Control Key Press
    if (e.which === KEYS.CTRL) { isCtrl = true; }



    // Enter ONLY Clicked
    if (e.which === KEYS.ENTER && !isCtrl) {
        const msg = chatBox.val().toString().trim();
        sendMessage(msg);


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


/** Handle Port Selection Buttons */
$(".port-btn-group").on("click", e => {
    // Obtain and Notify Port Change
    const PORT = (e.target.innerHTML).trim();
    sendMessage(`Port Set to ${PORT}`);
});
