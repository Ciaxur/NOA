## Upcomming Changes / Plans

- Add a **changelog** Markdown file *(Maybe)*
    - Holds changes per each new version

- Add a **doc** directory for GitHub Pages

- Add a **documentation** Markdown file to explain APIs(In thy future...), how to use, what its uses are, etc...

- Add a **Contribution** Markdown file to set rules on how to contribute :)

- Add more to the to do list, **TODO** Markdown file

- Add more Details to the **README** Markdown file
    - Add images
    - Integrated Status Bars
    - Add instructions
    - Add more **docs** file (Better Organized)

- **Refactoring** a ton of code
    - Add comments
    - Re-organize sections and split up main classes, Server and Client, into sub-classes for more readability
    - Have more variables instead of literals in parameters
    - Have main data such as, urls and ports, in a sub-class for easy access

- **Server-Side** Implementations
    - Make Server un-static?
        - To solve the issue with every client thread getting an old Stack?
    - Better randomly hashed id's?
    - Better crash handling
    - Add a GUI for the Server?
        - Maybe combine it within the Client so that every client is a "mini-server"
        - Or Seperate Client - Server