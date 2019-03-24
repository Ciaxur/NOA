import { openDevTools } from 'electron-debug';
import { Menu, BrowserWindow, app } from 'electron';


/**
 * Initiates Menus & SubMenus for main Electron Window app
 * @param win - Main Electron Browser Window
 */
export function initMenus(win: BrowserWindow): void {
    // Create Menu
    const menu = Menu.buildFromTemplate([
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
                },

                {
                    label: "Change Username",
                    click() {
                        /**
                         * TODO: Use, 'createSimpleWindow(size, URL, initMenuFn?)'
                         *  that creates a simple Window when needed. Also have it return
                         *  the BrowserWindow to add ipc to communicate with ipcRender
                         *  in order to change the Username ;)
                         * 
                         * Also create an HTML for it as well! Be organized
                         *  Create a Directory under Electron called 'BrowserWindows'
                         *  and under that, 'ChangeName', which contains an object that 
                         *  handles the creation/destruction of that browser and call it here :)
                         */
                    }
                }
            ]
        }
    ]);

    // Set Menu to app
    Menu.setApplicationMenu(menu);
}