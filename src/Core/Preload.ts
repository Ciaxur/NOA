/** 
 * Preload Script Prior to loading the Electron
 *  app.
 */
import * as $ from 'jquery';
import { SideMenu } from '../Client/SideMenu';
import { CLIENT_DATA } from './Constants';
import { ClientNode } from '../Client/ClientNode';


/** 
 * On Document Read Method
 * 
 * - Focus on the ChatBox
 */
$(document).ready(e => { 
    // Focus on ChatBox by Default
    document.getElementById("chatBox").focus();

    // Initiate Side Menu
    SideMenu.initSideMenu();

    /** 
     * TODO: Add a Friends List side menu when clicked,
     *  Append sub-"lists" of the available users that are online :)
     * - Have those users' status & part of the UID show (Grayed Out)
     * 
     * TODO: Add Some way to REMOVE when clicked again...
     * 
     * TODO: Make it to were if a user connects, ALL other users send their
     *  "packet" to the user to update their friends list :)
     */
    SideMenu.appendSubMenu("Friends List", (e: Element) => {
        // Get SubMenu Parent Element
        const parent = e.parentElement;

        // Get Client Node's Friends List
        const clientNode = (CLIENT_DATA.node as ClientNode);
        
        // Append all Friends
        const list = clientNode.getFriendsList();
        for (let i = 0; i < list.length; i++) {
            const div = document.createElement('div');
            div.classList.add('menu-submenu');

            // Construct Smaller UID
            // Append to Friends List
            const smallUID = list[i].UID.substr(list[i].UID.length - 4);
            div.innerHTML = `${list[i].username} <span class="text-muted">(${smallUID})</span>`;

            parent.appendChild(div);
        }
    });

});