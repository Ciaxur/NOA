## Changelog (Pre Alpha v0.0.4)

- **Development** Implementations
    - [x] Add TSLint to be checked using GulpJS while building instead of requiring VSCode to have TSLint installed :smiley:
    - [x] Fix Issue where GulpJS Errors from Typescript Compiling not showing Trace
    - [x] Refactor ChatHistory.ts
        - [x] Abstract Class for ChatHistory
        - [x] Only store Variables ONCE in order to have fewer calls
    - [x] Refactor EventListener.ts
        - [x] Class for EventListener

- **Client-Side** Implementations
    - [x] User Set Username (For now) through Electron Menus
    - [x] Notifications (Windows, Linux, MacOS)
        - [x] Notification for when Window is Minimized
        - [x] Notification for when Window is not in Focus

- **Polishing**
    - [x] Better message display
        - [x] Don't display a header for Time and Username if same username sends a message
        - [x] Display time if major time difference
    - [x] Chat History Style
        - [x] Blend the Chat within the entire WindowBrowser
        - [x] Only Auto Scroll down if user is at the very bottom
        - [x] Only Auto Scroll down if Window is in **FOCUS**

- **GitHub**
    - [x] Add a **changelog** Markdown file
        - [x] Holds changes per each new version
            - Each Version has realeased as the changes associated with it but removed from To-Do List Markdown. So moved from To-Do List into Changlog :smiley:

- **Wiki**
    - [x] Initiate Wiki Page for Documentation and Contribution
    - [x] Add **Recommended VSCode Extensions** 
    - [x] Add a **documentation** Section to explain APIs(In thy future...), how to use, what its uses are, etc...
    - [x] Add a **Contribution** Section to set rules on how to contribute :smiley:


