
'use strict';

const View = require('../../views/shared/view');
let root, mongo;

class CurrencyController {
    constructor(_root) {
        this.name = 'Currency Converter';
        root = _root;
        mongo = root.mongo;
    }

    async run(route, req, res) {
        if (route === '/apps/currency/config') {
            if (req.query['api_key']) {
                let appConfig = await mongo.find('apps', {
                    apiKey: req.query['api_key']
                });
                res.send(appConfig);
                return;
            }
            res.send(null);
            return;
        }

        if (!req.user) { // Prevent the page from loading if the user is not logged in.
            if (req.query['login']) {
                res.redirect('/auth/google/callback');
            } else
                res.redirect('/');
        } else {
            if (req.query['login']) {
                res.redirect('/apps/currency');
                return;
            }
            const v = new View(root, res, 'apps/currency');
            await v.render({
                title: 'Currency Converter'
            }, req.user);
        }
    }
}

module.exports = CurrencyController;