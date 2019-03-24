import { ClientNode } from "../Client/ClientNode";
import { CLIENT_DATA } from "./Constants";

/** 
 * Preload Script After loading Preload & EventListeners
 *  but before Electron
 */

 // Initiate Client Node
const clientNode = new ClientNode();
CLIENT_DATA.node = clientNode;