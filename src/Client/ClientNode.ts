import { ServerNode } from "../Server/ServerNode";
import { MessageData } from "../Interfaces/MessageData";
import { addMsgHistory } from "../Core/EventListners";

/**
 * Client Node Class that handles Sub-Server 
 *  and Client Data Transfers and Incomming.
 */
export class ClientNode {
    private Server: ServerNode;

    /**
     * Initiate Client Side
     *  - Server
     */
    constructor() {
        // Create Server and start Message Callback
        this.Server = new ServerNode((msg: Buffer) => {
            // Parse Buffer JSON
            const messageData: MessageData = JSON.parse(msg.toString());

            // Add Message String to Message History
            addMsgHistory(messageData.message);
            

            console.log('Data Packet Recieved %j', messageData);
        });
    }
}
