import * as $ from 'jquery';
import { KEYS, CLIENT_DATA } from './Constants';
import { ChatHistory } from '../Client/ChatHistory';
import { ipcRenderer } from 'electron';
import { MsgStructIPC, Status } from '../Interfaces/MessageData';
import { ClientNode } from '../Client/ClientNode';

/**
 * Initiate Document Event Listeners
 * Listen for IPC Render Events from IPC Main
 * Handle Client Chat
 */
export class EventListener {
    // Private Variables
    private isCtrl = false;                     // Keeps track of CTRL Key being Held Down
    private chatBox: HTMLElement;               // Stores Message Box Element
    private notificationRequested = false;      // Keep track of HTML5 Notification Request
    private clientTimeout;                      // Keeps track of BrowserWindow being in background (without use) | Holds Timeout Event
    private clientStatusAutoset = false;        // Keeps track of whether client's status was changed due to timeout


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

            // Check if Change Status
            else if (arg.code === 'chat-status-change' && typeof (arg.message) === 'string') {
                // Change Status according to massage
                (CLIENT_DATA.node as ClientNode).setStatus(arg.message as Status);
            }

            // Check if Message Trigger
            else if (arg.code === 'chat-message-tigger' && typeof(arg.message) === 'object') {
                // Check & Handle Focused
                if (arg.message.focused) {
                    // Only Scroll if user is at Bottom
                    if (ChatHistory.isScrollAtBottom(true)) { ChatHistory.scrollToBottom(); }

                    // Create a Toast to Notify user has a new Message waiting
                    else { ChatHistory.createToast("New Message!"); }
                }

                // Create a Toast if NOT Focused
                else if (!arg.message.focused) {
                    // Toast Create
                    if (!ChatHistory.isScrollAtBottom()) {
                        ChatHistory.createToast("New Message!");
                    }
                }

                // Check & Handle Minimized
                // Only Notify if user is Online
                if (arg.message.minimized && arg.message.status === "Online") {
                    // Toast Create
                    if (!ChatHistory.isScrollAtBottom()) {
                        ChatHistory.createToast("New Message!");
                    }

                    // Notification Create
                    // Only Create if not requested yet
                    if (!this.notificationRequested) {
                        Notification.requestPermission().then(() => {
                            // Create Notirfication & Initiate
                            const _ = new Notification("New Message!", {
                                body: `New Message from ${typeof (arg.message) === 'object' ? arg.message.message : ''}`,
                                icon: '../../resources/Core/favicon.png'
                            });

                            // Keep track of notification request status
                            this.notificationRequested = true;

                            // Set an On Close Event (When user or os closes Notification)
                            _.onclose = e => {
                                // Reset Notification Status
                                this.notificationRequested = false;
                            };

                            // Set an On Click Event
                            _.onclick = () => {
                                const packet: MsgStructIPC = {
                                    code: "browserwindow-change",
                                    from: 'ClientChat',
                                    message: "browserwindow-focus"
                                };

                                // Prompt Main to Focus Window
                                ipcRenderer.send('async-main', packet);
                            
                                // Remove Notification Request (Prevent Spamming)
                                this.notificationRequested = false;
                            };
                        });
                    }
                }
            }

            // Check if Browser Window Change
            else if (arg.code === 'browserwindow-change' && typeof(arg.message) === 'string') {
                // Broswer Came in Focus
                if (arg.message === 'focused') {
                    // Focus on Message Box :)
                    this.focusOnMsgBox();

                    // Clear Timout
                    if (this.clientTimeout) {
                        window.clearTimeout(this.clientTimeout);
                        this.clientTimeout = null;
                    }

                    // Check if Client's Status was changed
                    //  due to timeout
                    else if (this.clientStatusAutoset) {
                        this.clientStatusAutoset = false;
                        (CLIENT_DATA.node as ClientNode).setStatus("Online");
                        console.log("Status set to: Online"); // DEBUG
                    }
                }

                // Browser Became Minimized
                else if (arg.message === 'minimized') {
                    // Make sure User didn't manually set Status (Basically Online)
                    if (!this.clientTimeout && (CLIENT_DATA.node as ClientNode).getStatus() === "Online") {
                        // Set Client Timout
                        this.clientTimeout = setTimeout(() => {
                            // Set Client as Away
                            // Set that Status was Autoset
                            (CLIENT_DATA.node as ClientNode).setStatus('Away');
                            this.clientStatusAutoset = true;
                            console.log("Status set to: Away"); // DEBUG

                            // Remove SetTimoutID
                            this.clientTimeout = null;
                        }, CLIENT_DATA.timeout);
                    }
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

    /**
     * Focuses on Chat Message Box
     */
    private focusOnMsgBox(): void {
        // Focus on ChatBox by Default
        document.getElementById("chatBox").focus();
    }
}
