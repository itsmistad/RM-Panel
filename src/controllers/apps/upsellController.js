'use strict';

const View = require('../../views/shared/view');
let root;

class UpsellController {
    constructor(_root) {
        this.name = 'Upsells, Downsells, and Bundles';
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
                res.redirect('/apps/upsell');
                return;
            }
            const v = new View(root, res, 'apps/upsell');
            await  v.render({
                title: 'Upsells, Downsells, and Bundles'
            }, req.user);
        }
    }
}

module.exports = UpsellController;