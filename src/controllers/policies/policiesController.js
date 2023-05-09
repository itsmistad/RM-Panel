'use strict';

const View = require('../../views/shared/view');
let root;

class PoliciesController {
    constructor(_root) {
        this.name = 'Policies';
        root = _root;
    }

    async run(route, req, res) {
        let viewPath, viewTitle;
        switch (route) {
        case '/policies/terms': 
            viewPath = 'policies/terms';
            viewTitle = 'Terms and Conditions';
            break;
        case '/policies/privacy':
            viewPath = 'policies/privacy';
            viewTitle = 'Privacy Policy';
            break;
        case '/policies/cookies':
            viewPath = 'policies/cookies';
            viewTitle = 'Cookies Policy';
            break;
        }
        const v = new View(root, res, viewPath);
        await  v.render({
            title: viewTitle
        }, req.user);
    }
}

module.exports = PoliciesController;