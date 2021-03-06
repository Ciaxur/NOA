import { createServer, Server, Socket } from 'net';
import { SERVER_DATA } from '../Core/Constants';
import { RequestData, InstanceOfRequestData } from '../Interfaces/RequestData';
import { ClientSocketList } from '../Interfaces/ClientSocketList';


/**
 * Server Node Class to handle Server-Side
 *  actions, errors, binding, and data (Input/Output)
 */
class ServerNode {
    private static instanceNum = 0;             // Make sure only ONE Server per Client
    private server: Server;                     // Server Socket
    private PORT = SERVER_DATA.address.port;    // Default Port Number

    // Server-Client Data
    private clientList: ClientSocketList[];     // List of all Connected Client Sockets
    private MAX_CONX = 5;                       // Limit Maximum Connection (Default for now is 5)
    
    

    /**
     * Initiate Server Node to only ONE Instance
     *  Message Callback takes on msg Parameter of type Buffer
     * 
     * @param msgCallback - (Optional) Callback function called when recieving message
     */
    constructor() {
        if (ServerNode.instanceNum === 0) {
            // Increment Instance
            ServerNode.instanceNum++;

            // Initiate Client List
            this.clientList = [];
            
            // Initiate the Server to PORT
            this.bindServer(this.PORT);
        }
    }


    /**
     * Binds the Server Node to a given Port Number
     * @param PORT - Port Number to Bind Server to
     */
    public bindServer(PORT: number): void {
        // Set PORT
        this.PORT = PORT;

        // Check Server Status
        // Server is On -> Turn it off
        if (this.server) { this.server.unref(); }

        // Initiate Server
        this.initServer();
        
        // Bind Server & Set Status
        this.server.listen(PORT, () => console.log('Opened Server on ', this.server.address()) );
    }


    /**
     * Removes Client from ClientList
     * @param client - Client to Remove
     */
    private removeClient(client: Socket): void {
        for (let i = 0; i < this.clientList.length; i++) {
            if (this.clientList[i].socket === client) {
                this.clientList.splice(i, 1);
            }
        }
    }


    /**
     * Broadcasts Data to other Connected Clients
     * @param data - Data Buffer to Send
     * @param sender - Sender to Avoid Resending to
     */
    private broadcast(data: Buffer, sender: Socket) {
        for (const client of this.clientList) {
            if (client.socket !== sender) {
                client.socket.write(data);
            }
        }
    }
    

    /**
     * Requests User Data from a given Client Socket
     * 
     * @param user - Client Socket to Request from
     * @param dataRequested - Data Request from Client
     */
    private requestUserData(user: Socket, dataRequested: RequestData): void {
        // Pack up Data Request Object
        const packet = Buffer.from(JSON.stringify(dataRequested));

        // Write Data Packet to Client Socket
        user.write(packet);
    }

    /**
     * @returns The Index in the Client List of given Client (Returns -1 if not found)
     */
    private indexOfClientSocket(clientSocket: Socket): number {
        // Search for Client in the list
        for (let i = 0; i < this.clientList.length; i++) {
            if (this.clientList[i].socket === clientSocket) {
                return i;   // Return found Index
            }
        }

        // Return not found :(
        return -1;
    }
    

    /**
     * Initiates Server to Socket
     */
    private initServer() {
        // Create Server Socket
        this.server = createServer(clientSocket => {
            // On Client Socket Disconnect
            clientSocket.on('end', () => {
                console.log("Client Disconnected!", clientSocket.address());

                // Broadcast to Users that Client Disconnected :(
                const index = this.indexOfClientSocket(clientSocket);
                const packet: RequestData = {
                    requestType: null,
                    response: this.clientList[index].username,
                    responseType: 'disconnected'
                };

                // Pack up Data and Broadcast it
                this.broadcast(Buffer.from(JSON.stringify(packet)), clientSocket);


                // Remove Client from ClientList
                this.removeClient(clientSocket);
            });

            // On Data Received from Client to Server
            clientSocket.on('data', data => {
                console.log("Server Received Data: ", data.toString());

                // Check if Response Data Object
                const obj = JSON.parse(data.toString());
                if (InstanceOfRequestData(obj)) {
                    const responseObj: RequestData = obj;
                    
                    // Check Response Type
                    if (responseObj.responseType === 'connected') {
                        // Find Index and Store Username ;)
                        const index = this.indexOfClientSocket(clientSocket);
                        this.clientList[index].username = responseObj.response;
                    }
                }

                // Broadcast Data to other Connected Clients
                this.broadcast(data, clientSocket);
            });
        });

        // Set Server Properties
        this.server.maxConnections = this.MAX_CONX;
        


        // EVENT LISTENERS

        // New Connection Event Listener
        this.server.on('connection', socket => {
            // Output Msg for New Connection
            console.log("New Connection from: ", socket.address());

            // Store Client
            this.clientList.push({ socket, username: null });

            // Request Client MessageData (For Username and ID Verification)
            this.requestUserData(socket, {
                requestType: "username",
                response: null,
                responseType: null
            });

            // Output Total Connections
            this.server.getConnections((err, count) => {
                if (err) {
                    console.error("Error Ocurred in Connections: ", err.stack);
                } else {
                    console.log(`Connections Count: ${count}`);
                }
            });
        });

        // Error Event Listener
        this.server.on('error', err => {
            console.error('Error Ocurred in Server: ', err.stack);
            
            // Close Up Server
            this.server.unref();
        });
    }

    
    /**
     * Switch Server On
     */
    public turnOn(): void {
        this.bindServer(this.PORT);
    }

    /**
     * Switch Server Off
     */
    public turnOff(): void {
        if (this.server) { this.server.unref(); }
    }
}



/** 
 * As soon as this Server Node is Ran, it'll create a Server Node
 *  locally.
 * Future plans pending to either a Seprate Server or an Internal Mini-Server
 *  that each Client will have Enabled by default until they connect manually
 *  to another client :)
 */
const _ = new ServerNode();