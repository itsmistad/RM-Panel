'use strict';

const View = require('../views/shared/view');
let root;

class HomeController {
    constructor(_root) {
        this.name = 'Home';
        root = _root;
    }

    async run(route, req, res) {
        const v = new View(root, res, 'home');
        await v.render({
            title: 'Home',
            badLogin: req.query['badLogin'] || 0
        }, req.user);
    }
}

module.exports = HomeController;