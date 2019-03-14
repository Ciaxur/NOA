import { MessageData } from "../Interfaces/MessageData";

// Element Define
const box: HTMLElement = document.getElementsByClassName("content")[0] as HTMLElement;


/**
 * Scrolling Event
 * - Removes Toast if there is and if scrolled
 *      to the bottom
 */
box.onscroll = e => {
    if (isScrollAtBottom()) {
        removeToast();
    }
};


/** 
 * Method that creates and appends a new Section 
 * 
 * @param msgObj - Message Object to Append to Section Data
 */
export function createSection(msgObj: MessageData): void {
    const e = document.createElement("div");
    e.classList.add("section");
    e.setAttribute("style", "animation: fadeIn 500ms;");
    console.log(msgObj.message);
    
    e.innerHTML =
        `<!--         Top Bar Section -->
        <div class="row top-section">
          <div class="col-md-4 text-left">
            ${msgObj.username} <span class="date-mute"> ${getDate()}</span>
          </div>
          
          <div class="col-md-4 text-center"></div>
          
          <div class="col-md-4 text-right">
            <!-- Options Area -->
          </div>
        </div>
        
<!--         Middle Bar Section (Text) -->
        <div class="row mid-section">
          
          <div class="col-md-12 text-left divText">${msgObj.message}</div>
          
        </div>`;





    box.appendChild(e);
}

/** 
 * Method that check if Scrolled to Bottom 
 * 
 * @returns - Boolean on State of Scroll at Bottom
 */
function isScrollAtBottom(): boolean {
    const posFromBottom = box.scrollHeight - box.offsetHeight;
    return (posFromBottom > 0 && posFromBottom !== Math.floor(box.scrollTop))
        ? false
        : true;
}

/**
 * Scrolls to Bottom (Newest Message)
 */
export function scrollToBottom(): void {
    box.scrollTo(0, box.scrollHeight);
}

/**
 * Creates a Toast in the wrapper Div
 * 
 * @param msg - Message to Apply to Toast
 */
function createToast(msg: string): void {
    // Make sure only ONE Toast Lives!
    if (isToast()) { return; }


    // Create Toast in a Row>Col>Toast Div
    const rowDiv = createElement('div', ['row', 'text-center', 'noselect', 'toastRow']);
    rowDiv.appendChild(createElement('div', 'col-md-4'));
    const toastDiv = rowDiv.appendChild(createElement('div', 'col-md-4'));
    rowDiv.appendChild(createElement('div', 'col-md-4'));

    // Append the Toast to middle div
    const toast = createElement('div', 'toast');
    toast.innerText = msg;
    toastDiv.appendChild(toast);

    // Create Animation ;)
    // Set cursor to pointer
    toast.setAttribute("style", "animation: toastExpand 200ms linear; cursor: pointer;");

    // Set on click event for toast
    toast.onclick = e => {
        // Scroll to bottom of Wrapper
        box.scrollTo(0, box.scrollHeight);
    };


    // Append rowDiv to wrapper div
    document.getElementsByClassName("wrapper")[0].appendChild(rowDiv);
}

/** Removes Toast if any */
function removeToast(): void {
    const r = isToast();
    if (r) { r[0].remove(); }
}

/**
 * Checks if there is Toast 
 * 
 * @returns - false if none, return the Toast Row Div is there is
 */
function isToast() {
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
function createElement(tagType: string, classArr: string | string[] | null) {
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
function getDate(): string {
    const d = new Date();

    // Construct Date = MM/DD/YYYY : HH:MM
    const hrs = (d.getHours() < 10) ? `0${d.getHours()}` : `${d.getHours()}`;
    const min = (d.getMinutes() < 10) ? `0${d.getMinutes()}` : `${d.getMinutes()}`;
    const dateStr = `${d.getMonth()}/${d.getDate()}/${d.getFullYear()} : ${hrs}:${min}`;

    return dateStr;
}