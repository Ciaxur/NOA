import { openDevTools, refresh } from 'electron-debug';
import { Menu, BrowserWindow, app, ipcMain } from 'electron';
import { WindowTools } from './Tools/WindowTools';
import { ipcChannels } from './app';
import { MsgStructIPC, Status } from '../../Interfaces/MessageData';


/**
 * Initiates Menus & SubMenus for main Electron Window app
 * @param win - Main Electron Browser Window
 */
export function initMainMenu(win: BrowserWindow): void {
    // Create Menu
    const menu = Menu.buildFromTemplate([
        // File Menu
        {
            label: '&File',
            submenu: [
                // Exit Submenu
                {
                    label: "&Exit",
                    click() { app.quit(); }
                }
            ],
        },

        // Edit Menu
        {
            label: "&Edit",
            submenu: [
                // Change Username
                {
                    label: "Change &Username",
                    click() {
                        // Create the Browser Window as a Child of Parent
                        //  of type Modal and not Menus
                        let _ = WindowTools.createSimpleWindow({
                            width: 400,
                            height: 200,
                            parent: win,
                            modal: true,
                            resizable: false,
                            show: false
                        }, `file://${__dirname}/BrowserWindows/ChangeUsername.html`, w => w.setMenu(null), false);

                        // Setup Events Manually
                        _.once('ready-to-show', e => {
                            _.show();   // Show the Window
                            
                            // Setup IPC Main to listen from Render ONCE
                            ipcMain.once('async-ChangeName', (e, arg) => {
                                // Construct Object
                                const packet: MsgStructIPC = {
                                    from: "Menus-ChangeName",
                                    code: "chat-user-change",
                                    message: arg
                                };
                                
                                // Ping it to ClientChat Listener
                                ipcChannels["ClientChat"].sender.send('async-ClientChat', packet);

                                // Close Window
                                _.close();
                            });
                        });

                        _.on('closed', e => _ = null);
                    }
                },

                // Change Status
                {
                    label: "Change &Status",
                    submenu: [
                        // Status->Online
                        {
                            label: "Onine",
                            type: "radio",
                            checked: true,
                            click() {
                                // Change Status
                                changeNodeStatus("Online");
                            }
                        },

                        // Status->Busy
                        {
                            label: "Busy",
                            type: "radio",
                            checked: false,
                            click() {
                                // Change Status
                                changeNodeStatus("Busy");
                            }
                        },

                        // Status->Away
                        {
                            label: "Away",
                            type: "radio",
                            checked: false,
                            click() {
                                // Change Status
                                changeNodeStatus("Away");
                            }
                        }
                    ]
                },

                // Reload Window
                {
                    label: "Reload Window",
                    accelerator: "CmdOrCtrl+R",
                    click() { refresh(); }
                }
            ]
        },

        // View Menu
        {
            label: '&View',
            submenu: [
                // Debugger Tools
                {
                    label: '&Debugger Tools',
                    accelerator: 'CmdOrCtrl+Shift+I',
                    click() {
                        openDevTools(win);
                    }
                }
            ]
        }
    ]);

    // Set Menu to Window
    win.setMenu(menu);
}


/**
 * Sends IPC to Client to prompt Status Change
 * @param newStatus - Status to change to
 */
function changeNodeStatus(newStatus: Status): void {
    // Construct Packet
    const packet: MsgStructIPC = {
        from: "Menus-ChangeStatus",
        code: "chat-status-change",
        message: newStatus
    };
    
    // Ping it to ClientChat Listener
    ipcChannels["ClientChat"].sender.send('async-ClientChat', packet);
}