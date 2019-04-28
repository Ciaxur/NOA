import { app, BrowserWindow, ipcMain } from "electron";
import { initMainMenu } from './Menus';
import { MsgStructIPC } from "../../Interfaces/MessageData";
import * as path from 'path';

let win: BrowserWindow;

/** Create Main App */
function createWindow() {
    // Create Browser Window
    win = new BrowserWindow({
        width: 800,
        height: 740,
        show: false,
        icon: path.join(__dirname, '../../../resources/Core/favicon.ico')
    });

    // Set Window Ttile
    win.setTitle("NOA");

    // Load in HTML File
    win.loadURL(`file://${__dirname}/../index.html`);

    // Browser Window Functionallity
    win.on('closed', () => win = null);
    win.once('ready-to-show', () => win.show());
    win.on('focus', () => {
        // Construct Message
        const obj: MsgStructIPC = {
            code: 'browserwindow-change',
            from: 'win-event-focus',
            message: "focused"
        };
        
        // Send data to Client Chat
        ipcChannels["ClientChat"].sender.send('async-ClientChat', obj);
    });
    win.on('minimize', () => {
        // Construct Packet
        const packet: MsgStructIPC = {
            code: "browserwindow-change",
            from: "win-minimize",
            message: "minimized"
        };
        
        // Notify Client Chat
        ipcChannels["ClientChat"].sender.send('async-ClientChat', packet);
    });


    // Initiate Menus
    initMainMenu(win);
}

/** Assign Main Application Events */
app.on('ready', createWindow) ;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
    if (win === null) { createWindow(); }
});

/**
 * On Windows 10, Need to pin "node_modules/electron/dist/electron.exe"
 *  to Start and the following method needs to be executed to see Notifications
 */
app.setAppUserModelId(process.execPath);



/** Structure Saving IPC Communication */
export const ipcChannels = {};            // Key/Pair Channels (Used for Lookup)


/** Initiate IPC Communication from Main */
ipcMain.on('async-main', (e, arg: MsgStructIPC) => {
    /**
     * Switch Statemend based on the Argument's Code
     */
    switch (arg.code) {
        // Store IPC Communcation
        case 'initialize':
            // Make sure it hasn't been stored before
            //  store Channel for later use
            if (ipcChannels[arg.from] === undefined) {
                ipcChannels[arg.from] = e;
            }
            break;
        

        // Check if Chat Message Trigger
        case 'chat-message-tigger':
            // Set Main Window Status in Object
            let msg = null;
            if (typeof (arg.message) === 'object') {
                msg = arg.message.message;
            }

            arg.message = {
                focused: win.isFocused(),
                minimized: win.isMinimized(),
                status: (arg.message as any).status,
                message: msg
            };


            // Flash Frame in Taskbar
            // Only Flash if Online or Away
            // No Flash if Busy
            if ((!arg.message.focused            || arg.message.minimized) &&
                (arg.message.status === "Online" || arg.message.status === "Away")) {
                win.flashFrame(true);
                win.once('focus', () => win.flashFrame(false));
            }

            
            // Send data to Client Chat
            ipcChannels["ClientChat"].sender.send('async-ClientChat', arg);
            break;
    
        
        // Check if Broswer Window Manipulation
        case 'browserwindow-change':
            // Message of type String
            if (typeof (arg.message) === 'string') {
                if (arg.message === 'browserwindow-focus') {        // Set Main Browser Window to Focus
                    win.focus();
                }
            }
            break;
    
        default:
            break;
    }
    
    // DEBUG
    console.log(`Async-Main Received: ${JSON.stringify(arg)}`);
});