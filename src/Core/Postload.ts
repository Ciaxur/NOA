import { ClientNode } from "../Client/ClientNode";
import { CLIENT_DATA } from "./Constants";
import { EventListener } from './EventListener';

/** 
 * Preload Script After loading Preload
 *  but before Electron
 * 
 *  - Initiate Event Listeners
 *  - Initiate Client Node
 */
// Event Listeners
new EventListener()
    .initDocumentEvents()
    .initIPCrenderEvents();

 // Initiate Client Node
const clientNode = new ClientNode();
CLIENT_DATA.node = clientNode;

