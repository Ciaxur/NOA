import { Socket } from "net";
import { Status } from "./MessageData";

/**
 * Clinet Socket List that holds Client Socket and Data
 *  on Server Side
 */
export interface ClientSocketList {
    socket: Socket;             // Client TCP Socket Object
    UID: string;                // Client's UID
    username: string;           // Client's Username
    status: Status;             // Client's Status
}