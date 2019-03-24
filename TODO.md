## Upcomming Changes / Plans (Pre Alpha v0.0.4)

- **Development** Implementations
    - [x] Add TSLint to be checked using GulpJS while building instead of requiring VSCode to have TSLint installed :)
    - [x] Fix Issue where GulpJS Errors from Typescript Compiling not showing Trace
    - [x] Refactor ChatHistory.ts
        - [x] Abstract Class for ChatHistory
        - [x] Only store Variables ONCE in order to have fewer calls
    - [x] Refactor EventListener.ts
        - [x] ~~Abstract~~ Class for EventListener

- **Client-Side** Implementations
    - [x] User Set Username (For now) through Electron Menus
    - [x] Notifications (Windows, Linux, MacOS)
        - [x] Notification for when Window is Minimized
        - [x] Notification for when Window is not in Focus

- **Polishing**
    - [ ] Better message display
        - [ ] Don't display a header for Time and Username if same username sends a message
        - [ ] Display time if major time difference
    - [ ] Chat History Style
        - [ ] Blend the Chat within the entire WindowBrowser
        - [ ] Only Auto Scroll down if user is at the very bottom
        - [ ] Only Auto Scroll down if Window is in **FOCUS**

- [ ] Add a **changelog** Markdown file
    - [ ] Holds changes per each new version
        - [ ] Per Release Add a bunch of Changelog Data on the Version from Previous Version

- [ ] Add a **doc** directory for GitHub Pages

- [ ] Add a **documentation** Markdown file to explain APIs(In thy future...), how to use, what its uses are, etc...

- [ ] Add a **Contribution** Markdown file to set rules on how to contribute :)


## Upcomming Changes / Plans (Pre Alpha v0.0.5)

- [ ] Add more Details to the **README** Markdown file
    - [ ] Add images
    - [ ] Integrated Status Bars
    - [ ] Add instructions
    - [ ] Add more **docs** file (Better Organized)

- **Aesthetics**
    - [ ] Create a new logo
        - [ ] Add to Push Notification
        - [ ] Add to NOA
        - [ ] Add to README


## Upcomming Changes / Plans (Pre Alpha v0.0.6)

- **Client-Side** Implementations
    - [ ] Status Changes
        - [ ] Manual Change
        - [ ] Auto Change
    - [ ] 3rd Party Login
        - [ ] Google Account (Used mainly for UID)

- **Develpment** Implementations
    - [ ] Implement Continuous Integration Service
        - [ ] Most Likely **TravisCl**

- **Style Revamp**
    - [ ] Have multiple Themes Available to choose from


## Upcomming Changes / Plans (Notes...Later)
- Tray Icon
- Notification Sounds
- Better Interactive Notifications (for Mac OS)