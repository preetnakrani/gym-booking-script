# UBC GYM SLOT BOOKING SCRIPT

This project helps book UBC GYM SLOTS to ensure you get one before the session gets full.

The project is hosted [here](http://gym-app-download.us-west-2.elasticbeanstalk.com/). You can download the desktop client or book the slot in the cloud using the webversion.

Demo of desktop client:

https://user-images.githubusercontent.com/44685953/128789024-a03a45f4-36b2-4480-bf10-10b1aec97f93.mp4

The project can also be run locally. Follow the steps below to setup your local environment.

**Note:** UBC GYM booking system does not have an api and hence a virtual browser is spun up on the server side to book the slot. When running locally the browser instance is rendered so that you can get a visual as it books the slot.

## Configuring your environment

Once you have cloned the project follow the steps:

1. [Install Node LTS](https://nodejs.org/en/download/), which will also installs NPM (you should be able to execute `node --version` and `npm --version` on the command line).

2. Make a .env file in the root of the project and add variable **NODE_ENV=development**.

3. Run **npm install** in the terminal at the root of the project. `npm install`

## Project commands

- `npm start` starts the node server at port 9999 by running [app.js](./app.js)

- `npm run client` starts the front end server.

- `npm run build` builds the front-end and places it in the build folder.

- `npm run server` runs the server with nodemon for development by running [app.js](./app.js)

- `npm run local` runs [controller.js](./api/controller.js) to run the script locally. To use this command you need to put your variables in [controller.js](./api/controller.js) to provide the configuration to book your slot. Follow the comments in [controller.js](./api/controller.js) to provide the essential parameters to book your preffered slot.

## License

[MIT](./LICENSE)
