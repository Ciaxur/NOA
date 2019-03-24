import { MessageData, Status, MsgStructIPC } from "../Interfaces/MessageData";
import { createConnection, Socket } from "net";
import { CLIENT_DATA } from "../Core/Constants";
import { createHmac, randomBytes } from "crypto";
import { ChatHistory } from "./ChatHistory";
import { RequestData, InstanceOfRequestData } from "../Interfaces/RequestData";
import { ipcRenderer } from 'electron';


// Connection Types
type ConxIcon = "connected" | "disconnected" | "connecting";

/**
 * Client Node Class that handles Sub-Server 
 *  and Client Data Transfers and Incomming.
 */
export class ClientNode {
    private clientSocket: Socket;
    private username = "Bobby";
    private UID: string = createHmac('sha256', randomBytes(4)).digest().toString();    // For now
    private status: Status = "Online";
    private connectStatus = false;

    /**
     * Initiate Client Side
     *  - Client Socket Creation
     */
    constructor() {
        // Create the Client Socket
        this.clientSocket = createConnection({
            host: CLIENT_DATA.address.address,
            port: CLIENT_DATA.address.port
        });

        // Setup Socket Data
        this.clientSocket.setTimeout(5000);        // 5 Second Timeout


        // EVENT LISTENERS

        // Socket Connection Event Listener
        this.clientSocket.on('connect', () => {
            console.log('Connection Successful: ', this.clientSocket.address());
            this.setConxIcon("connected");
            this.connectStatus = true;
        });

        // Socket Ready Event Listener
        // this.clientSocket.on('ready', () => {
        //     this.clientSocket.write(`Hi from Client ${this.UID}`);
        // });

        // Socket Data Event Listener (Data Received)
        this.clientSocket.on('data', data => {
            console.log(`\nClient ${this.UID} Received Data: ${data.toString()}`);

            // Convert Data Buffer into MessageData Object
            const msgObj: MessageData | RequestData = JSON.parse(data.toString());
            
            // Check if Data Request Object
            if (InstanceOfRequestData(msgObj)) {
                // Store Response
                const response = (msgObj as RequestData).response;
                const responseType = (msgObj as RequestData).responseType;

                // Check if Response
                if (response !== null) {
                    ChatHistory.createNotificationSection(`${response} ${ responseType === 'connected' ? 'Connected' : 'Disconnected' }!`);
                }
                
                // Check Request Type
                else {
                    // Store Request
                    const request = (msgObj as RequestData).requestType;

                    // Remove Response
                    (msgObj as RequestData).requestType = null;

                    // Check what to Do :)
                    if (request === 'status') {
                        (msgObj as RequestData).response = this.status;
                    } else if (request === 'uid') {
                        (msgObj as RequestData).response = this.UID;
                    } else if (request === 'username') {
                        (msgObj as RequestData).response = this.username;
                        (msgObj as RequestData).responseType = "connected";     // Set Connection Type
                    }


                    // Reply to Server
                    this.clientSocket.write(Buffer.from(JSON.stringify(msgObj)));
                }
            }


            // Message Object of Type MessageData
            else {
                // Append Message to History
                ChatHistory.createSection(msgObj as MessageData);

                // Construct Message Object for IPC Main
                const packet: MsgStructIPC = {
                    from: "ClientNode",
                    code: "chat-message-tigger",
                    message: {
                        minimized: null,
                        focused: null,
                        message: (msgObj as MessageData).username
                    }
                };
                
                // Send Packet Trigger to IPC Main
                ipcRenderer.send('async-main', packet);
            }
        });


        // Socket Close Event Listener
        this.clientSocket.on('close', err => {
            if (err) { console.log("Socket Close Error: ", err); }
            else {
                console.log("Socket Closing");

                // Retry Connection
                this.connectStatus = false;
                this.clientSocket.connect({
                    host: CLIENT_DATA.address.address,
                    port: CLIENT_DATA.address.port
                });
                this.setConxIcon("connecting");
            }
        });

        // Socket Error Event Listener
        this.clientSocket.on('error', err => {
            console.log("Error Occured: ", err.stack);
        });

        // Scoket Timeout Event Lister
        this.clientSocket.on('timeout', () => {
            // Make Sure no Connection
            if (!this.connectStatus) {
                console.error("Socket Timed Out!");
                this.setConxIcon("disconnected");
                // this.clientSocket.end();

                // Retry in 2 Seconds
                setTimeout(() => {
                    this.clientSocket.connect({
                        host: CLIENT_DATA.address.address,
                        port: CLIENT_DATA.address.port
                    });

                    this.setConxIcon("connecting");
                }, 2000);
            }
        });
    }


    /**
     * Sets a new Username to Client Node
     * 
     * @param newName - New Username
     */
    public changeUsername(newName: string): void {
        this.username = newName;
    }
    
    /**
     * Packs and Sends Message Object to other Client Nodes
     * @param msgObj - MessageData Object | Message String
     */
    public sendMessage(msgObj: MessageData | string): void {
        // Construct Message Data Object if Message String Input
        if (typeof msgObj === "string") {
            const newObj: MessageData = {
                UID: this.UID,
                message: msgObj,
                username: this.username,
                status: this.status
            };

            // Construct MessageData
            msgObj = newObj;
        }

        // Construct the Message
        const packet = Buffer.from(JSON.stringify(msgObj));


        // Append Message to History
        ChatHistory.createSection(msgObj);

        // Send the Packet to Server
        this.clientSocket.write(packet);
    }


    /**
     * Sets Connection Icon on the Status Bar
     * @param status - Status Type
     */
    private setConxIcon(status: ConxIcon): void {
        const img: HTMLImageElement = document.getElementsByClassName('conxIcon')[0] as HTMLImageElement;
        const dir = "../../resources/Images/Connection/";
        
        if (status === "disconnected") {
            img.src = dir + "No Connection.png";
            img.title = "No Connection";
        }

        else if (status === "connected") {
            img.src = dir + "Connected.png";
            img.title = "Connection";
        }

        else if (status === "connecting") {
            img.src = dir + "Connecting.png";
            img.title = "Connecting";
        }
    }
}
