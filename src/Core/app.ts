import { app, BrowserWindow } from "electron";

let win: BrowserWindow;


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
    win.loadURL(`file://${__dirname}/index.html`);

    // Browser Window Functionallity
    win.on('closed', () => win = null);
    win.once('ready-to-show', () => win.show());
}


app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') { app.quit(); }
});

app.on('activate', () => { if (win === null) { createWindow(); } });

