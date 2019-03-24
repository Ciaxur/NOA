import { app, BrowserWindow, ipcMain } from "electron";
import { initMainMenu } from './Menus';
import { MsgStructIPC } from "../../Interfaces/MessageData";

let win: BrowserWindow;

/** Create Main App */
function createWindow() {
    // Create Browser Window
    win = new BrowserWindow({
        width: 800,
        height: 740,
        show: false
    });

    // Set Window Ttile
    win.setTitle("NOA");

    // Load in HTML File
    win.loadURL(`file://${__dirname}/../index.html`);

    // Browser Window Functionallity
    win.on('closed', () => win = null);
    win.once('ready-to-show', () => win.show());


    // Initiate Menus
    initMainMenu(win);
}

/** Assign Main Application Events */
app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => {
    if (win === null) { createWindow(); }
});



/** Structure Saving IPC Communication */
export const ipcChannels = {};            // Key/Pair Channels (Used for Lookup)


/** Initiate IPC Communication from Main */
ipcMain.on('async-main', (e, arg: MsgStructIPC) => {
    // Store IPC Communcation
    if (arg.message === 'initial') {
        // Make sure it hasn't been stored before
        //  store Channel for later use
        if (ipcChannels[arg.from] === undefined) {
            ipcChannels[arg.from] = e;
        }
    }
    
    console.log(`Async-Main Received: ${JSON.stringify(arg)}`);
});