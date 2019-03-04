import { ServerNode } from "../Server/ServerNode";
import { MessageData, Status } from "../Interfaces/MessageData";
import { addMsgHistory } from "../Core/EventListners";
import { Socket, createSocket } from "dgram";
import { AddressInfo } from "net";
import { SERVER_DATA } from "../Core/Constants";
import { createHmac, randomBytes } from "crypto";

/**
 * Client Node Class that handles Sub-Server 
 *  and Client Data Transfers and Incomming.
 */
export class ClientNode {
    private SERVER: ServerNode;
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
     *  - Server Socket Creation
     *  - Client Socket Creation
     */
    constructor() {
        // Create Server and start Message Callback
        this.SERVER = new ServerNode((msg: Buffer, rinfo: AddressInfo) => {
            // Parse Buffer JSON
            const messageData: MessageData = JSON.parse(msg.toString());

            // Add Message String to Message History
            // Verify not Self Message
            if (messageData.UID !== this.UID) {
                addMsgHistory(messageData.message);

                // Debug Output : Packets
                console.log('Data Packet Recieved %j', messageData);
                console.log(`Data from: ${rinfo.address}:${rinfo.port}`);
            }
        });

        // Make sure Server Created Successfully
        if (this.SERVER) {
            // Debug Output
            console.log("Server Created!");
        }

        // Debug Output : Server Creation Error
        else {
            console.error("Server Failed to be Created!");
        }
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

        // Setup Pre-Send Data
        // Create Client Socket
        const addr = SERVER_DATA.address;
        this.clientSocket = createSocket({
            type: 'udp4',
            reuseAddr: true
        });
        
        // Send Message | Callback Error
        this.clientSocket.send(packet, addr.port, addr.address, err => {
            if (err) { console.log(`Error occurred while sending message: \n${err.stack}`); }
            else { console.log("Message sent successfully"); }

            // Close Socket when Done :)
            this.clientSocket.close();
        });
    }
}
