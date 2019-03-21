import { Socket } from "net";

/**
 * Clinet Socket List that holds Client Socket and Data
 *  on Server Side
 */
export interface ClientSocketList {
    socket: Socket,         // Client TCP Socket Object
    username: string        // Client Username
}