import { Client } from '../Client/ClientNode';

// Code Type
type DataUpdate_Code = 'update' | 'remove' | 'add';

/**
 * Data Update Interface Packet
 *  - Code type to know what to do with data
 *  - Holds Data to be Updated
 */
export interface UpdateData {
    code: DataUpdate_Code;      // Data Update Code
    data: Client;               // Data to Update
}


/**
 * Determines if Object is an Instance of UpdateData or not
 * @param object - Object to test
 * @returns True or False based on Object type
 */
export function InstanceOfUpdateData(object: any): boolean {
    return 'code' && 'data' in object;
}