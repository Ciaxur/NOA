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
            `animation: ${status ? "menuIn" : "menuOut"} 0.5s; left: ${status ? 5 : -(mainMenu.width + 5)}px;`
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
    }
  
  
  
    /* Document Event Handling */
    let toggleStatus = false;   // Stores Toggling Status

    // Create a Menu Click Event
    const menuClick = e => {
        // Toggle Main Menu On/Off
        toggleStatus = !toggleStatus;
        mainMenu.toggleMenu(toggleStatus);
        console.log(mainMenu.elt.getAttribute("style"));
    
        // Toggle elt2 Button's Visibility
        menuBtn.toggleElt2(!toggleStatus);
        // menuBtn.elt2.style.visibility = toggleStatus ? "hidden" : "visible";
    }

    // Assign MenuButton Click Event
    menuBtn.elt1.onclick = menuBtn.elt2.onclick = menuClick;
    menuBtn.elt2.onkeydown = menuBtn.elt1.onkeydown = menuClick;
}