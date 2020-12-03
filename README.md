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
