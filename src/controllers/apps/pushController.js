
'use strict';

const View = require('../../views/shared/view');
let root;

class PushController {
    constructor(_root) {
        this.name = 'Push Notifications';
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
                res.redirect('/apps/push');
                return;
            }
            const v = new View(root, res, 'apps/push');
            await  v.render({
                title: 'Push Notifications'
            }, req.user);
        }
    }
}

module.exports = PushController;