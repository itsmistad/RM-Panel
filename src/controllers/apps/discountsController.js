
'use strict';

const View = require('../../views/shared/view');
let root;

class DiscountsController {
    constructor(_root) {
        this.name = 'Quantity Breaks and Discounts';
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
                res.redirect('/apps/discounts');
                return;
            }
            const v = new View(root, res, 'apps/discounts');
            await  v.render({
                title: 'Quantity Breaks and Discounts'
            }, req.user);
        }
    }
}

module.exports = DiscountsController;