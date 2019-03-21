// RequestType Type
export type RequestType = 'username' | 'uid' | 'status';
type connectType = 'connected' | 'disconnected';

/** Request Data Structure */
export interface RequestData {
    requestType:    RequestType,        // Requested Data
    response:       string,             // Responded Data
    responseType:   connectType         // Response Type
};


/**
 * Checks if Object is of type RequestData
 * @param object - Object to be Checked
 * @returns True or False on State of Instance
 */
export function InstanceOfRequestData(object: any): boolean {
    return 'requestType' in object;
}
