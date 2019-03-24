import { BrowserWindow } from 'electron';

/**
 * Method Tools for creating and manipulating 
 *  simple Windows (Browser, View, etc..)
 */
export abstract class WindowTools {
    /**
     * Creates a simple BrowserWindow with given params.
     * Sets up Default Events if given
     * 
     * @param options - BrowserWindow Options
     * @param fileURL - HTML File URL to load into Window
     * @param menuFn - (Optional) Menu Function to call to initiate window to
     * @param defaultEvents - (Optional) If true, Initiates default events
     * @returns WindowBroswer Object created
     */
    static createSimpleWindow(options: Electron.BrowserWindowConstructorOptions, fileURL: string, menuFn?: (win: BrowserWindow) => any, defaultEvents?: boolean): BrowserWindow {

        // Creates Browser Window
        let win = new BrowserWindow(options);

        // Set Default Window Title
        win.setTitle("Simple Window");

        // Load in File
        win.loadURL(fileURL);

        // Browser Window Default Functionallity
        if (defaultEvents) {
            // Check if Window is Shown or not
            // ready-to-show event
            if (options.show === false) {
                win.once('ready-to-show', () => win.show());
            }
        }

        // Required Funcitonallity
        win.on('closed', () => win = null);

        // Check if menu function given
        if (menuFn) { menuFn(win); }


        // Return created WindowBrowser Object
        //  to be edited later
        return win;
    }
}
