
'use strict';

const View = require('../../views/shared/view');
let root;

class FaqController {
    constructor(_root) {
        this.name = 'Frequently Asked Questions';
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
                res.redirect('/apps/faq');
                return;
            }
            const v = new View(root, res, 'apps/faq');
            await  v.render({
                title: 'Frequently Asked Questions'
            }, req.user);
        }
    }
}

module.exports = FaqController;