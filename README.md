 ## How to Serve React + Express

 1. Install Node (latest LTS) and Yarn
 2. Install nodemon and concurrently modules globally ('npm install -g [package]')
 3. Run 'npm install' at the root and at the 'matchery_client' directory
 3. If bcrypt gives you problems, take a look at [this](https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions) to install VS Dev tools
 4. Run 'yarn dev' to run front and back end

TODO
* Admin Judge page adding judges only adds to the first event, need to figure out a way to fix this
* Pressing enter when wanting to submit form (currently requires clicking buttons)
* synchronicity between two judges eg

* Want to use firstName instead of username in Main.js but this is not set in localStorage during login so we need to make a separate fetch request for the user's first name
