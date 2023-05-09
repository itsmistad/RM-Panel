'use strict';

let mongo;
let apps = [
    'currencyConverter'
];

class AppConfigSaveHandler {
    constructor(root) {
        this.event = 'appConfigSave';
        mongo = root.mongo;
    }

    async handle(io, client, user, data) {
        if (!user.googleId || !data.app) return;

        let appId = apps.findIndex(_ => _ === data.app);
        let savePayload = {};
        for (let entry in data)
            if (entry !== 'app')
                savePayload[entry] = data[entry];
        await mongo.update('apps', {
            ownerId: user.googleId,
            appId 
        }, {
            $set: savePayload
        }, true);
    }
}

module.exports = AppConfigSaveHandler;