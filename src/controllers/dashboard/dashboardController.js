'use strict';

const View = require('../../views/shared/view');
let root, mongo;

class DashboardController {
    constructor(_root) {
        this.name = 'Dashboard';
        root = _root;
        mongo = root.mongo;
    }

    async run(route, req, res) {
        switch (route) {
        case '/dashboard/upload':
            if (!req.isAuthenticated()) { // Don't do anything if the user is not logged in
                res.send({
                    response: 'err'
                });
                return;
            }
            mongo.update('dashboards', {
                googleId: req.user.googleId
            }, {
                $set: {
                    apps: req.body,
                }
            }, true);
            res.send({
                response: 'ok'
            });
            break;
        default:
            if (!req.isAuthenticated()) { // Prevent the page from loading if the user is not logged in.
                if (req.query['login']) {
                    res.redirect('/auth/google/callback');
                } else
                    res.redirect('/');
            } else {
                if (req.query['login']) {
                    res.redirect('/dashboard');
                    return;
                }
                let dashboard = await mongo.find('dashboards', {
                    googleId: req.user.googleId
                });
                const v = new View(root, res, 'dashboard/dashboard');
                await  v.render({
                    title: 'Dashboard',
                    apps: JSON.stringify(dashboard.apps || [])
                }, req.user);
            }
            break;
        }
    }
}

module.exports = DashboardController;