import * as $ from 'jquery';
import { KEYS, CLIENT_DATA } from './Constants';
import { ChatHistory } from '../Client/ChatHistory';
import { ipcRenderer } from 'electron';
import { MsgStructIPC } from '../Interfaces/MessageData';
import { ClientNode } from '../Client/ClientNode';

/**
 * Initiate Document Event Listeners
 * Listen for IPC Render Events from IPC Main
 * Handle Client Chat
 */
export class EventListener {
    // Private Variables
    private isCtrl = false;            // Keeps track of CTRL Key being Held Down


    /**
     * Store message in Message History
     * Handles Message Send
     * 
     * @param msg - String Message to store in Message History and Send
     */
    private sendMessage(msg: string): void {
        // Make sure msg is NOT Empty!
        if (!msg) { return; }
        
        // Send Message
        CLIENT_DATA.node.sendMessage(msg);
    
        // Scroll to newest Message :)
        ChatHistory.scrollToBottom();
    }

    
    /**
     * Calculates and adjusts Chat Size to match Window Size
     */
    private adaptChatSize(): void {
        // Calculate Data
        const width = $(".stackContainer").width();
        const height = $(window).height() - $("#chatBox").height() - 100;
        
        // Resize Chat History to Fix
        $(".wrapper").width(width);
        $(".stackContainer").height(height);
    }


    /**
     * Initiates Document Related Event Listeners
     *  - Window Events
     *  - Chat Events
     */
    public initDocumentEvents(): EventListener {
        /**  Event Listeners that handles Keydown */
        $("#chatBox").on("keydown", e => {
            // Variables Used
            const chatBox = $("#chatBox");
            

            // Keep track of Control Key Press
            if (e.which === KEYS.CTRL) { this.isCtrl = true; }



            // Enter ONLY Clicked
            if (e.which === KEYS.ENTER && !this.isCtrl) {
                const msg = chatBox.val().toString().trim();
                this.sendMessage(msg);


                // Clear Text Box
                chatBox.val("");
                return false;   // Ignore NewLine
            }

            // Ctrl+Enter Clicked
            else if (e.which === KEYS.ENTER && this.isCtrl) {
                chatBox.val(chatBox.val() + '\n');          // Insert a New Line
            }
        });

        /**  Event Listeners that handles Keyup */
        $("#chatBox").on("keyup", e => {
            // Keep track of Control Key Release
            if (e.which === KEYS.CTRL) { this.isCtrl = false; }
        });


        /** Window Resize Event */
        $(window).resize(e => {
            // Adapt Chat Size
            this.adaptChatSize();
        });


        /** Window Ready Event */
        $(window).ready(this.adaptChatSize);


        // For Chaining
        return this;
    }

    /**
     * Initiates Electron's IPC Render Event Listeners
     */
    public initIPCrenderEvents(): EventListener {
        /** Client Chat Listener */
        ipcRenderer.on('async-ClientChat', (e, arg: MsgStructIPC) => {
            // Check if Change Username
            if (arg.code === 'chat-user-change' && typeof(arg.message) === 'string') {
                (CLIENT_DATA.node as ClientNode).changeUsername(arg.message);
                ChatHistory.createNotificationSection(`Username Changed to, <span style="font-weight:normal">${arg.message}</span>`);
            }

            // Check if Message Trigger
            else if (arg.code === 'chat-message-tigger' && typeof(arg.message) === 'object') {
                // Check & Handle Focused
                if (arg.message.focused) {
                    ChatHistory.scrollToBottom();
                }

                // Check & Handle Minimized
                else if (arg.message.minimized) {
                    // Toast Create
                    if (!ChatHistory.isScrollAtBottom()) {
                        ChatHistory.createToast("New Messages");
                    }

                    // Notification Create
                    Notification.requestPermission().then(() => {
                        const _ = new Notification("New Message!", {
                            body: `New Message from ${typeof(arg.message) === 'object' ? arg.message.message : ''}`
                        });
                    });
                }
            }

            console.log(`Recieved at Client Chat Listener: ${JSON.stringify(arg)}`);
        });

        /** Initialize Communication with Main IPC */
        const _: MsgStructIPC = { from: "ClientChat", code: "initialize", message: null };
        ipcRenderer.send('async-main', _);

        
        // For Chaining
        return this;
    }
}
