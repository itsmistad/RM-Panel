'use strict';

const RootService = require('./services/rootService');

const root = new RootService();
const web = root.web;

class App {
    static async Start() {
        await web.start();
    }
}

App.Start(); // Pull the lever, Kronk!