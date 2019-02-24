import { createSocket, Socket } from 'dgram';
import { AddressInfo } from 'net';


/**
 * Server Node Class to handle Server-Side
 *  actions, errors, binding, and data (Input/Output)
 */
export class ServerNode {
    private static instanceNum = 0;             // Make sure only ONE Server per Client
    private server: Socket;                     // Server Socket
    private PORT: number = 41234;               // Default Port Number
    private msgCallback;                        // Message Callback | msgCallback( msg: Buffer) : void
    

    /**
     * Initiate Server Node to only ONE Instance
     *  Message Callback takes on msg Parameter of type Buffer
     * 
     * @param msgCallback - (Optional) Callback function called when recieving message
     */
    constructor(msgCallback?) {
        if (ServerNode.instanceNum === 0) {
            // Increment Instance
            ServerNode.instanceNum++;

            // Create the Callback Function to be run
            //  when recieving messages
            this.msgCallback = msgCallback ? msgCallback : null;
            
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
        // Server is On
        try {
            this.server.close();
        } catch (e) {
            console.log(`Closing Server Error: ${e}`);
        }

        // Initiate Server
        this.initServer();
        
        // Bind Server & Set Status
        this.server.bind(this.PORT);
    }

    /**
     * Initiates Server to Socket
     */
    private initServer() {
        // Create Server Socket
        this.server = createSocket('udp4');

        // Server - Error Listener
        this.server.on('error', err => {
            console.error(`Server Error:\n ${err.stack}`);
            this.server.close();
        });


        // Server - Message Listner
        this.server.on('message', (msg, rinfo) => {
            // console.log(`Server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

            // TODO :: Interface JSON Object for msgCallback with more data
            //  on user, msg, time, and status, etc...
            if (this.msgCallback != null) {
                this.msgCallback(msg);
            }
        });

        // Server - Listner Initiated
        this.server.on('listening', () => {
            const address: AddressInfo = this.server.address() as AddressInfo;
            console.log(`Server Listening ${address.address}:${address.port}`);
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
        if (this.server) { this.server.close(); }
    }
}