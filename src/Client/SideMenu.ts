/**
 * Handle Side Menu Animation, Functionallity, and Events
 */
export abstract class SideMenu {
    private static mainMenu;
    private static menuBtn;
    private static menuTitle: Element;
    private static menuSelections: Element;

    /**
     * Sets up Side Menu functionality and Event
     *  listeners.
     * 
     * - Positioning
     * - Transitions/Animation
     */
    public static initSideMenu(): void {
        /* Main Menu Startup Position */
        this.mainMenu = {
            elt: document.getElementsByClassName("menu")[0] as HTMLElement,
            width: 0,
            toggleMenu: null
        };
        this.mainMenu.width = this.mainMenu.elt.offsetWidth;

        // Toggle Transitions
        this.mainMenu.toggleMenu = (status) => {
            // mainMenu.elt.setAttribute("style", 
            //   `left: ${status ? 5 : -(mainMenu.width + 5)}px;`
            // );
        
            this.mainMenu.elt.setAttribute("style",
                `animation: ${status ? "menuIn" : "menuOut"} 0.5s; left: ${status ? 0 : -(this.mainMenu.width + 5)}px;`
            );
        };
    
    
    
        /* Menu Button Positioning */
        this.menuBtn = {
            elt1: document.getElementsByClassName("menu-btn")[0] as HTMLElement,
            elt2: document.getElementsByClassName("menu-btn")[1] as HTMLElement,
            defaultAttrib: `position: absolute; 
                        left: ${this.mainMenu.width + 5}px; 
                        top: 0px;`,
            toggleElt2: null
        };
        this.menuBtn.elt2.setAttribute("style", this.menuBtn.defaultAttrib);

        // Toggle Transitions
        this.menuBtn.toggleElt2 = (status) => {
            // Create the Attribute based on Status
            const newAttrib = this.menuBtn.defaultAttrib +
                `animation: ${status ? "appearIn cubic-bezier(1,0, 1,1) 1.2" : "appearOut .1"}s; opacity: ${status ? 1 : 0}`;
        
            // Set new Attribute
            this.menuBtn.elt2.setAttribute("style", newAttrib);
        };
    
    
    
        /* Document Event Handling */
        let toggleStatus = false;   // Stores Toggling Status

        // Create a Menu Click Event
        const menuClick = _ => {
            // Toggle Main Menu On/Off
            toggleStatus = !toggleStatus;
            this.mainMenu.toggleMenu(toggleStatus);
        
            // Toggle elt2 Button's Visibility
            this.menuBtn.toggleElt2(!toggleStatus);
            // menuBtn.elt2.style.visibility = toggleStatus ? "hidden" : "visible";
        };

        // Assign MenuButton Click Event
        this.menuBtn.elt1.onclick = this.menuBtn.elt2.onclick = menuClick;
        this.menuBtn.elt2.onkeydown = this.menuBtn.elt1.onkeydown = menuClick;


        // Store Side Menu title Element
        this.menuTitle = document.getElementsByClassName("menu-txt-header")[0];

        // Store Side Menu sub-elements (Sub-Menus)
        this.menuSelections = document.getElementsByClassName("menu-selections")[0];

        
        /* Set Initial Data in Side Menu */
        this.setMenuTitle("NOA");
        // populateSideMenuContent("NOA");
    }

    /**
     * Sets the Side Menu's Title
     * @param newTitle - Side Menu new Title string to set
     */
    public static setMenuTitle(newTitle: string): void {
        this.menuTitle.textContent = newTitle;
    }

    /**
     * Appends a Sub Menu to the Side-Menu
     * @param menuName - The Sub-Menu's Name
     * @param fnOnClick - (Optional) On Click function for submenu, Parameter is the Sub-Menu Div Element 
     */
    public static appendSubMenu(menuName: string, fnOnClick?: (e:Element) => any): void {
        const e = document.createElement('div');        // Create the Div Element
        e.classList.add("menu-submenu");                // Add the CSS Class for it
        e.textContent = menuName;                       // Add Text Content of Menu
        e.onclick = () => { fnOnClick(e); };            // Set onclick Function to SubMenu
        this.menuSelections.appendChild(e);             // Append Menu into the Menu Selection :)
    }
}