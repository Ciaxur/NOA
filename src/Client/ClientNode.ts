import { MessageData, Status } from "../Interfaces/MessageData";
import { addMsgHistory } from "../Core/EventListners";
import { createConnection, Socket } from "net";
import { SERVER_DATA } from "../Core/Constants";
import { createHmac, randomBytes } from "crypto";

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
    private username: String = "Bobby";
    private UID: String = createHmac('sha256', randomBytes(4)).digest().toString();    // For now
    private status: Status = "Online";

    /**
     * Initiate Client Side
     *  - Client Socket Creation
     */
    constructor() {
        // Create the Client Socket
        this.clientSocket = createConnection({
            host: SERVER_DATA.address.address,
            port: SERVER_DATA.address.port
        });

        // Setup Socket Data
        this.clientSocket.setTimeout(0);        // No Time-Out



        // EVENT LISTENERS

        // Socket Connection Event Listner
        this.clientSocket.on('connect', () => {
            console.log('Connection Successful: ', this.clientSocket.address());
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

            addMsgHistory(msgObj.message);
            // socket.end();
        });


        // Socket Close Event Listner
        this.clientSocket.on('close', err => {
            if (err) { console.log("Socket Close Error: ", err); }
            else { console.log("Socket Closing"); }
        });

        // Socket Error Event Listner
        this.clientSocket.on('error', err => {
            console.log("Error Occured: ", err.stack);
        });

        // Scoket Timeout Event Lister
        this.clientSocket.on('timeout', () => {
            console.error("Socket Timed Out!");
            this.clientSocket.end();
        });
    }

    
    /**
     * Packs and Sends Message Object to other Client Nodes
     * @param msgObj - MessageData Object | Message String
     */
    public sendMessage(msgObj: MessageData | String): void {
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

        // Send the Packet to Server
        this.clientSocket.write(packet);
    }
}