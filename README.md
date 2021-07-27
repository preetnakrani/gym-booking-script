# UBC GYM SLOT BOOKING SCRIPT

This project helps book UBC GYM SLOTS to ensure you get one before the session gets full.

The project is hosted [here](http://ubcggymbooking-env.eba-m3sawabi.us-west-2.elasticbeanstalk.com/).

The project can also be run locally. Follow the steps below to setup your local environment.

**Note:** UBC GYM booking system does not have an api and hence a virtual browser is spun up on the server side to book the slot. When running locally the browser instance is rendered so that you can get a visual as it books the slot.

## Configuring your environment

Once you have cloned the project follow the steps:

1. [Install Node LTS](https://nodejs.org/en/download/), which will also installs NPM (you should be able to execute `node --version` and `npm --version` on the command line).

2. Make a .env file in the root of the project and add variable **NODE_ENV=development**.

3. Run **npm install** in the terminal at the root of the project. `npm install`

## Project commands

- `npm start` starts the node server at port 9999.

- `npm run client` starts the front end server.

- `npm run build` builds the front-end and places it in the build folder.

- `npm run server` runs the server with nodemon for development.

- `npm run local` runs controller.js to run the script locally. To use this command you need to put your variables in controller.js to provide the configuration to book your slot. Follow the comments in controller.js to provide the essential parameters to book your preffered slot.

## License

[MIT](https://choosealicense.com/licenses/mit/)
