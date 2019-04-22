/** 
 * Constant Values Declerations
 */
import { ConstantKeys, ServerData } from "../Interfaces/Constant_Keys";

// jQuery Key Values
export const KEYS: ConstantKeys = {
    CTRL: 17,
    ENTER: 13  
};

// Server Data
export const SERVER_DATA: ServerData = {
    address: {
        address: "localhost",
        port: 41234,
        family: 'IPv4'
    },
    timeout: null
};

// Client Connection Data
export const CLIENT_DATA: ServerData = {
    address: {
        address: "localhost",
        port: 41234,
        family: 'IPv4'
    },
    node: null,             // Store up Client Node
    timeout: 300000         // 5min Timout
};
