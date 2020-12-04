# Python-Learning-Platform

Python version required:

- Python 2.7

## Third-party library used:
- NodeJS
  - Official Website: https://nodejs.org/en/
  - Installation Link: https://nodejs.org/en/download/

- Chocolatey (For install MeteorJS)
  - Official Website: https://docs.chocolatey.org/en-us/
  - Installation Link: https://docs.chocolatey.org/en-us/choco/setup

- MeteorJS
  - Official Website: https://www.meteor.com/
  - Installation Link: https://www.meteor.com/install

- ReactJS
  - Official Website: https://reactjs.org/
  - Installation Link: https://reactjs.org/docs/create-a-new-react-app.html

Installation Steps:

1.  Install third party application with the installation links above
2.  Unzip project folder
3.  Running Flask
    - Open terminal and set directory to "flask"
    - Set environment variable FLASK_APP=index.py wth set FLASK_APP=index.py on windows or export FLASK_APP=index.py on mac
    - Run the following commands
    > set FLASK_APP=index.py (Windows) / export FLASK_APP=index.py (Mac)
    > flask run
4.  Running PLP Client
    - Open terminal and set directory to "plpClient"
    - Run the following commands
    > meteor npm install
    > npm run web (Windows) / npm run web-mac (Mac)
4.  Running PLP Admin
    - Open terminal and set directory to "plpAdmin"
    - Run the following commands
    > meteor npm install
    > npm run web (Windows) / npm run web-mac (Mac)
5.  Access PLP Client with http://localhost:7000 and PLP Admin with http://localhost:8000

File Structure:
/flask
- Contains code related to checking student's submitted codes written in python for flask framework.
  /index.py
  - Exposed API for plpClient to call in order to check student's submitted code.

/plpAdmin
- Admin Portal Codes.
- All .css or .scss files in the folder are used to control its respective module defined by its file name.
- .css files are imported by the modules themselves
- .scss files are imported by the main.scss file found in the entry codes

  /client
  - Entry codes and main scss style file
  
  /imports
  - Main folder for all files related to the program
  
    /api
    - Database files including initiation, publications and methods (APIs for client side)

      /{collectionName}
      - Specific folder for each collection (Like tables in SQL)

        /server/publications
        - Publishes some publication for clients to subscribe - https://docs.meteor.com/api/pubsub.html

        /methods
        - Stores all methods related to CRUD operations of the specific collection - https://docs.meteor.com/api/methods.html
    
    /reducers
    - State files for redux stores - https://react-redux.js.org/

      /{stateNames}
      - Initial states and dispatchable actions that are specific to a module of the program

      /index.js
      - Consolidates and exposes the combined reducers for store.js to use
    
    /routes
    - Routes used for the program and their appropriate components - https://reactrouter.com/

      /components
      - Custom components for handling different kind of routes. Written to allow multiple reuse of the same component logic.

      /console
      - Routes used for the program

        /content.js
        - Routes used for different modules in the system (Root layer)

        /modal.js
        - Routes used for modals in the system (Modal layer)

      /root.js
      - Root routes for consoles pages and sign in pages
    
    /sagas
    - Saga related files mainly for controlling modal states. -https://redux-saga.js.org/

    /startup
    - Startup files that meteor will run when app starts

      /both
      - Files inside this folder will run on both server and client side
      
      /client
      - Files inside this folder will run on the client side
      
      /server
      - Files inside this folder will run on the server side

    /ui
    - Main folder for all UI related files

      /components
      - Files for all reusable UI components

        /icons
        - Files for all icons used

        /modal
        - Base modal files for reuse by other more specific modals

        /validators
        - Custom validators for Validator forms 

        /{fileName}.js
        - Other common reusable components described by their file name

      /layouts
      - Files for all layout components

        /console
        - Components pertaining to UIs rendered after log in page

          /body
          - Components for the main portion of the program (Inspect the page and view the page from the highest level to understand more)

            /content
            - UI components for the content portion of the program

              /{moduleFolders}/index.js
              - Folders containing module specific files for rendering the basic layout of that module

              /footer.js
              - UI for controlling footer

              /index.js
              - Switches the UI content for different modules based on current route

            /sideMenu/index.js
            - Components for the side menu UI

            /index.js
            - Component for the body which renders the body layouts consisting of side menu and content

          /header
          - Component for the header UI