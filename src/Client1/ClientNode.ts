import { MessageData, Status } from "../Interfaces/MessageData";
import { createConnection, Socket } from "net";
import { CLIENT_DATA } from "../Core/Constants";
import { createHmac, randomBytes } from "crypto";
import { createSection, scrollToBottom } from "./ChatHistory";


// Connection Types
type ConxIcon = "connected" | "disconnected" | "connecting";

/**
 * Client Node Class that handles Sub-Server 
 *  and Client Data Transfers and Incomming.
 */
export class ClientNode {
    private clientSocket: Socket;
    /** TODO Private Client Data 
     * - Create UID Per Client Node (How will it be unique?)
     *  - Server Side? Unique Username = Hashed UID?
     *  - UID is used for verifying if self message
     * 
     * - Username
     * - Status
     */
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

        // Socket Connection Event Listner
        this.clientSocket.on('connect', () => {
            console.log('Connection Successful: ', this.clientSocket.address());
            this.setConxIcon("connected");
            this.connectStatus = true;
        });

        // Socket Ready Event Listner
        // this.clientSocket.on('ready', () => {
        //     this.clientSocket.write(`Hi from Client ${this.UID}`);
        // });

        // Socket Data Event Listner (Data Received)
        this.clientSocket.on('data', data => {
            console.log(`\nClient ${this.UID} Received Data: ${data.toString()}`);

            // Convert Data Buffer into MessageData Object
            const msgObj: MessageData = JSON.parse(data.toString());

            // Append Message to History
            createSection(msgObj);

            // TODO : If BrowserWindow is NOT in focus, create a Toast
            //      notifying user there is a new message
            scrollToBottom();
        });


        // Socket Close Event Listner
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

        // Socket Error Event Listner
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
        createSection(msgObj);

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
