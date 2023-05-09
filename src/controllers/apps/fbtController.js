
'use strict';

const View = require('../../views/shared/view');
let root;

class FbtController {
    constructor(_root) {
        this.name = 'Frequently Bought Together';
        root = _root;
    }

    async run(route, req, res) {
        if (!req.user) { // Prevent the page from loading if the user is not logged in.
            if (req.query['login']) {
                res.redirect('/auth/google/callback');
            } else
                res.redirect('/');
        } else {
            if (req.query['login']) {
                res.redirect('/apps/fbt');
                return;
            }
            const v = new View(root, res, 'apps/fbt');
            await  v.render({
                title: 'Frequently Bought Together'
            }, req.user);
        }
    }
}

module.exports = FbtController;