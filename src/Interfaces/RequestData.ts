import { Status } from "./MessageData";

// RequestType Type
export type RequestType = 'username' | 'uid' | 'status';
type connectType = 'connected' | 'disconnected';

// Simple Response Object Interface
export interface ResponseType {
    connectType: connectType;
    UID: string;
    status: Status;
}

/** Request Data Structure */
export interface RequestData {
    requestType:    RequestType;        // Requested Data
    response:       string;             // Responded Data
    responseType:   ResponseType;       // Response Type
}


/**
 * Checks if Object is of type RequestData
 * @param object - Object to be Checked
 * @returns True or False on State of Instance
 */
export function InstanceOfRequestData(object: any): boolean {
    return 'requestType' in object;
}
