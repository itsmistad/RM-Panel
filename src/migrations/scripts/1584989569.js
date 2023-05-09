'use strict';
const configKeys = require('../../services/config/configKeys');

module.exports = new function() {
    this.desc = `Inserts the following into the "config" collection:
- ${JSON.stringify(configKeys.authentication.session_secret)}
- ${JSON.stringify(configKeys.authentication.passport_google_clientid)}
- ${JSON.stringify(configKeys.authentication.passport_google_clientsecret)}
- ${JSON.stringify(configKeys.authentication.passport_google_redirect)}`;

    this.up = async function(m) {
        await m.save('config', {
            key: configKeys.authentication.session_secret.key,
            value: configKeys.authentication.session_secret.defaultValue
        });
        await m.save('config', {
            key: configKeys.authentication.passport_google_clientid.key,
            value: configKeys.authentication.passport_google_clientid.defaultValue
        });
        await m.save('config', {
            key: configKeys.authentication.passport_google_clientsecret.key,
            value: configKeys.authentication.passport_google_clientsecret.defaultValue
        });
        await m.save('config', {
            key: configKeys.authentication.passport_google_redirect.key,
            value: configKeys.authentication.passport_google_redirect.defaultValue
        });
    };

    this.down = async function() {
    };
};