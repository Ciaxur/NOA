/** 
 * Preload Script Prior to loading the Electron
 *  app.
 */
import * as $ from 'jquery';
import { sideMenuInit} from '../Client/SideMenu';


/** 
 * On Document Read Method
 * 
 * - Focus on the ChatBox
 */
$(document).ready(e => { 
    // Focus on ChatBox by Default
    document.getElementById("chatBox").focus();

    // Initiate Side Menu
    sideMenuInit();
});