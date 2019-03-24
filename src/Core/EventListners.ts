/**
 * Initiate Document Event Listners
 */

import * as $ from 'jquery';
import { KEYS, CLIENT_DATA } from './Constants';
import { scrollToBottom, createNotificationSection } from '../Client/ChatHistory';
import { ipcRenderer } from 'electron';
import { MsgStructIPC } from '../Interfaces/MessageData';
import { ClientNode } from '../Client/ClientNode';

// Global Variables
let isCtrl = false;         // Keeps track of Control Key Down


/**
 * Store message in Message History
 * Handles Message Send
 * 
 * @param msg - String Message to store in Message History and Send
 */
function sendMessage(msg): void {
    // Make sure msg is NOT Empty!
    if (!msg) { return; }
    
    // Send Message
    CLIENT_DATA.node.sendMessage(msg);

    // Scroll to newest Message :)
    scrollToBottom();
}

/**
 * Calculates and adjusts Chat Size to match Window Size
 */
function adaptChatSize(): void {
    // Calculate Data
    const width = $(".stackContainer").width();
    const height = $(window).height() - $("#chatBox").height() - 100;
    
    // Resize Chat History to Fix
    $(".wrapper").width(width);
    $(".stackContainer").height(height);
}


/** 
 * Electron IPC Render Event Listeners 
 *  Client Chat Listener
 */
ipcRenderer.on('async-ClientChat', (e, arg: MsgStructIPC) => {
    // Check if Change Username
    if (arg.from === 'Menus-ChangeName') {
        (CLIENT_DATA.node as ClientNode).changeUsername(arg.message);
        createNotificationSection(`Username Changed to, <span style="font-weight:normal">${arg.message}</span>`);
    }

    console.log(`Recieved at Client Chat Listener: ${JSON.stringify(arg)}`);
});

/** Initialize Communication with Main IPC */
const _: MsgStructIPC = { from: "ClientChat", message: "initial" };
ipcRenderer.send('async-main', _);



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


/** Window Resize Event */
$(window).resize(e => {
    // Adapt Chat Size
    adaptChatSize();
});


/** Window Ready Event */
$(window).ready(adaptChatSize);

/** Handle Port Selection Buttons */
$(".port-btn-group").on("click", e => {
    // Obtain and Notify Port Change
    const PORT = (e.target.innerHTML).trim();
    sendMessage(`Port Set to ${PORT}`);
});
