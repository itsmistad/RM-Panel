'use strict';

let auth;

class AuthenticationController {
    constructor(root) {
        this.name = 'Authentication';
        auth = root.auth;
    }

    async run(route, req, res) {
        switch (route) {
        case '/auth/google/callback': 
            auth.processCallback(req, res);
            break;
        case '/auth/logout':
            req.session.destroy();
            res.redirect('back');
            break;
        }
    }
}

module.exports = AuthenticationController;