import { MessageData } from "../Interfaces/MessageData";



/**
 * Structure that Handles ChatHistory data and properties
 *  - Handles Creation of Sections and Notification
 */
export abstract class ChatHistory {
    // Private Static Variables
    private static box: HTMLElement = document.getElementsByClassName("content")[0] as HTMLElement;
    private static prevMsgObj: MessageData = null;                  // Keep Track of Previous Data
    private static lastMessageTime = -1;                            // Keeps track of the time the Last Message was received (in milliseconds)
    private static lastMessageTimeMsTimeout = (5)*(60*1000);        // Time in milliseconds to account for unless Top Bar is shown (Set to 5 Minutes) => (min)*(sec * ms)
    private static isBottomBeforeSectionCreate: boolean = null;     // Backup for isScrollAtBottom function, since some events are asynchronous so syncronous events happen prior :)

    /**
     * Mimics a Constructor Method
     *  - Initiates Vital Data for ChatHistory
     */
    public static initChatHistory(): void {
        /**
         * Scrolling Event
         * - Removes Toast if there is and if scrolled
         *      to the bottom
         */
        this.box.onscroll = e => {
            if (this.isScrollAtBottom()) {
                this.removeToast();
            }
        };
    }

    /** 
     * Method that creates and appends a new Section 
     * 
     * @param msgObj - Message Object to Append to Section Data
     */
    public static createSection(msgObj: MessageData): void {
        // Initiate Document Element
        const e = document.createElement("div");
        e.classList.add("section");
        e.setAttribute("style", "animation: fadeIn 500ms;");

        
        // Create HTML Text
        e.innerHTML =
            `${
                // Check Previous Message to decide if Top Section should be inserted
                // Check if Timeout Reached
            (this.prevMsgObj && msgObj.UID === this.prevMsgObj.UID) && !(this.lastMessageTime !== -1 && Date.now() - this.lastMessageTime >= this.lastMessageTimeMsTimeout) ? ''
            : `<!--         Top Bar Section -->
                <div class="row top-section">
                    <div class="col-md-4 text-left">
                        ${msgObj.username} <span class="date-mute"> ${this.getDate()}</span>
                    </div>
                    
                    <div class="col-md-4 text-center"></div>
                    
                    <div class="col-md-4 text-right">
                        <!-- Options Area -->
                    </div>
                </div>`
            }
            
    <!--         Middle Bar Section (Text) -->
            <div class="row mid-section">
            
            <div class="col-md-12 text-left divText">${msgObj.message}</div>
            
            </div>`;


        // Keep track of Previous Message Object
        // Keep track of last message recieved TIME
        this.prevMsgObj = msgObj;
        this.lastMessageTime = Date.now();

        // Keep a Backup of State
        this.isBottomBeforeSectionCreate = this.isScrollAtBottom();

        // Append to Chat History Box
        this.box.appendChild(e);
    }

    /**
     * Creates a Notification Section in Chat History
     * @param msg - The Notification Message to Display
     */
    public static createNotificationSection(msg: string): void {
        const e = document.createElement("div");
        e.classList.add("section");
        e.setAttribute("style", "animation: fadeIn 500ms;");
        
        e.innerHTML =
            `<div class="row text-center notification-mute">
            
            <div class="col-md-12 divText">${msg}</div>
            
            </div>`;

        this.box.appendChild(e);
    }

    /** 
     * Method that check if Scrolled to Bottom 
     * 
     * @param checkTemp - (Optional) Checks if Temporary Scroll State (For Async Purposes)
     * @returns - Boolean on State of Scroll at Bottom
     */
    public static isScrollAtBottom(checkTemp?: boolean): boolean {
        // Check if Backup was Created
        if (checkTemp && this.isBottomBeforeSectionCreate !== null) {
            const temp = this.isBottomBeforeSectionCreate;
            this.isBottomBeforeSectionCreate = null;
            return temp;
        }
        
        // Check Scroll Status
        const posFromBottom = this.box.scrollHeight - this.box.offsetHeight;
        return (posFromBottom > 0 && posFromBottom !== Math.floor(this.box.scrollTop))
            ? false
            : true;
    }

    /**
     * Scrolls to Bottom (Newest Message)
     */
    public static scrollToBottom(): void {
        this.box.scrollTo(0, this.box.scrollHeight);
    }

    /**
     * Creates a Toast in the wrapper Div
     * 
     * @param msg - Message to Apply to Toast
     */
    public static createToast(msg: string): void {
        // Make sure only ONE Toast Lives!
        if (this.isToast()) { return; }


        // Create Toast in a Row>Col>Toast Div
        const rowDiv = this.createElement('div', ['row', 'text-center', 'noselect', 'toastRow']);
        rowDiv.appendChild(this.createElement('div', 'col-md-4'));
        const toastDiv = rowDiv.appendChild(this.createElement('div', 'col-md-4'));
        rowDiv.appendChild(this.createElement('div', 'col-md-4'));

        // Append the Toast to middle div
        const toast = this.createElement('div', 'toast');
        toast.innerText = msg;
        toastDiv.appendChild(toast);

        // Create Animation ;)
        // Set cursor to pointer
        toast.setAttribute("style", "animation: toastExpand 200ms linear; cursor: pointer;");

        // Set on click event for toast
        toast.onclick = e => {
            // Scroll to bottom of Wrapper
            this.box.scrollTo(0, this.box.scrollHeight);
        };


        // Append rowDiv to wrapper div
        document.getElementsByClassName("wrapper")[0].appendChild(rowDiv);
    }

    /** Removes Toast if any */
    private static removeToast(): void {
        const r = this.isToast();
        if (r) { r[0].remove(); }
    }

    /**
     * Checks if there is Toast 
     * 
     * @returns - false if none, return the Toast Row Div is there is
     */
    private static isToast() {
        const r = document.getElementsByClassName('toastRow');
        if (r && r.length === 1) {
            return r;           // Return the Entire Toast Row DIV
        }

        return false;
    }

    /**
     * Creates an Element with classe
     * 
     * @param tagType Element Tag Type Name
     * @param classArr String that holds the Class Tag, Array of Class Tags, or Null :)
     */
    private static createElement(tagType: string, classArr: string | string[] | null) {
        const e = document.createElement(tagType);

        if (classArr) {
            if (classArr instanceof Array) {
                for (const c of classArr) {
                    e.classList.add(c);
                }
            }

            else {
                e.classList.add(classArr);
            }
        }

        return e;
    }

    /**
     * Generates a Date String that follows MM/DD/YYYY : HH:MM
     * 
     * @returns String of Date Format of MM/DD/YYYY : HH:MM
     */
    private static getDate(): string {
        const d = new Date();

        // Construct Date = MM/DD/YYYY : HH:MM
        const hrs = (d.getHours() < 10) ? `0${d.getHours()}` : `${d.getHours()}`;
        const min = (d.getMinutes() < 10) ? `0${d.getMinutes()}` : `${d.getMinutes()}`;
        const dateStr = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()} : ${hrs}:${min}`;

        return dateStr;
    }
}


// Initiate ChatHistory
ChatHistory.initChatHistory();

















