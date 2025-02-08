const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const setupSocket = require("app/socket");
const { syncDatabase } = require('./config/syncDatabase')
const { seedEvents } = require('./config/eventCreator')

const server = http.createServer(app);
require('dotenv').config();


function setupExpress() {
    server.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`));
}

function setConfig() {
    app.use(express.static("public"));
    app.set("views", path.resolve("./app/templates"));
    app.set("view engine", "ejs");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(session({
        secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true, cookie: { maxAge: 1800000 }
    }));


    if (process.env.DataBaseCreate == "true") {
        // syncDatabase()
        // seedEvents()
    }
}

function serRouters() {
    app.use(require("app/routes"));
}

function serSocket() {
    setupSocket(server);
}

module.exports = class Application {
    constructor() {
        try {
            setupExpress();
            setConfig();
            serRouters();
            serSocket();
        } catch (error) {
            console.log(error);
        }
    }
}