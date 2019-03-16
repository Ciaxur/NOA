/**
 * Handle Side Menu Animation, Functionallity, and Events
 */


/**
 * Sets up Side Menu functionality and Event
 *  listeners.
 * 
 * - Positioning
 * - Transitions/Animation
 */
export function sideMenuInit() {
    /* Main Menu Startup Position */
    const mainMenu = {
        elt: document.getElementsByClassName("menu")[0] as HTMLElement,
        width: 0,
        toggleMenu: null
    };
    mainMenu.width = mainMenu.elt.offsetWidth;

    // Toggle Transitions
    mainMenu.toggleMenu = (status) => {
        // mainMenu.elt.setAttribute("style", 
        //   `left: ${status ? 5 : -(mainMenu.width + 5)}px;`
        // );
    
        mainMenu.elt.setAttribute("style",
            `animation: ${status ? "menuIn" : "menuOut"} 0.5s; left: ${status ? 0 : -(mainMenu.width + 5)}px;`
        );
    };
  
  
  
    /* Menu Button Positioning */
    const menuBtn = {
        elt1: document.getElementsByClassName("menu-btn")[0] as HTMLElement,
        elt2: document.getElementsByClassName("menu-btn")[1] as HTMLElement,
        defaultAttrib: `position: absolute; 
                    left: ${mainMenu.width + 5}px; 
                    top: 0px;`,
        toggleElt2: null
    };
    menuBtn.elt2.setAttribute("style", menuBtn.defaultAttrib);

    // Toggle Transitions
    menuBtn.toggleElt2 = (status) => {
        // Create the Attribute based on Status
        const newAttrib = menuBtn.defaultAttrib +
            `animation: ${status ? "appearIn cubic-bezier(1,0, 1,1) 1.2" : "appearOut .1"}s; opacity: ${status ? 1 : 0}`;
    
        // Set new Attribute
        menuBtn.elt2.setAttribute("style", newAttrib);
    };
  
  
  
    /* Document Event Handling */
    let toggleStatus = false;   // Stores Toggling Status

    // Create a Menu Click Event
    const menuClick = _ => {
        // Toggle Main Menu On/Off
        toggleStatus = !toggleStatus;
        mainMenu.toggleMenu(toggleStatus);
    
        // Toggle elt2 Button's Visibility
        menuBtn.toggleElt2(!toggleStatus);
        // menuBtn.elt2.style.visibility = toggleStatus ? "hidden" : "visible";
    };

    // Assign MenuButton Click Event
    menuBtn.elt1.onclick = menuBtn.elt2.onclick = menuClick;
    menuBtn.elt2.onkeydown = menuBtn.elt1.onkeydown = menuClick;


    /* Popluate Side Menu Content */
    populateSideMenuContent("NOA");
}


/**
 * Populates Side Menu Content with given
 *  parameter data
 * 
 * @param titleStr - Side Menu text title
 */
function populateSideMenuContent(titleStr: string) {
    // Set Menu Title
    const menuTitle: Element = document.getElementsByClassName("menu-txt-header")[0];
    menuTitle.textContent = titleStr;

    // Set Sub Menu Data
    const menuSelections: Element = document.getElementsByClassName("menu-selections")[0];
    


    // DEBUG - Just to have content in for now ;)
    const subMs = ["Menu1", "Menu2", "Menu3"];

    for (const m of subMs) {
        const e = document.createElement('div');        // Create DIV Element
        e.classList.add("menu-submenu");                // Add Class
        e.textContent = m;                              // Add Text Content of Menu
        menuSelections.appendChild(e);                  // Append Menu into the Menu Selection :)
    }
}