'use strict';

let mongo;
let apps = [
    'currencyConverter'
];

class AppConfigLoadHandler {
    constructor(root) {
        this.event = 'appConfigLoad';
        mongo = root.mongo;
    }

    async handle(io, client, user, data) {
        if (!user.googleId || !data.app) return;

        let appId = apps.findIndex(_ => _ === data.app);
        let appConfig = await mongo.find('apps', {
            ownerId: user.googleId,
            appId 
        });
        client.emit('appConfigLoadComplete', appConfig || {});
    }
}

module.exports = AppConfigLoadHandler;