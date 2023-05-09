'use strict';

const View = require('../../views/shared/view');
let root;

class UrgencyController {
    constructor(_root) {
        this.name = 'Social Proof and Urgency';
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
                res.redirect('/apps/urgency');
                return;
            }
            const v = new View(root, res, 'apps/urgency');
            await  v.render({
                title: 'Social Proof and Urgency'
            }, req.user);
        }
    }
}

module.exports = UrgencyController;